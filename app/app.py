
import os

import psycopg
from flask import Flask, jsonify, request
from psycopg.rows import dict_row

app = Flask(__name__)

DATABASE_URL = os.environ["DATABASE_URL"]


def get_connection():
    return psycopg.connect(
        DATABASE_URL,
        row_factory=dict_row,
        connect_timeout=3,
    )


@app.get("/")
def home():
    return jsonify(
        application="Docker Two-Tier Demo",
        status="running",
        endpoints=["/health", "/db-check", "/items"],
    )


@app.get("/health")
def health():
    return jsonify(status="healthy"), 200


@app.get("/db-check")
def db_check():
    try:
        with get_connection() as conn:
            row = conn.execute("SELECT 1 AS result").fetchone()
        return jsonify(database="connected", result=row["result"]), 200
    except psycopg.Error:
        app.logger.exception("Database connection check failed")
        return jsonify(database="unavailable"), 503


@app.post("/items")
def create_item():
    data = request.get_json(silent=True) or {}
    name = data.get("name")

    if not isinstance(name, str) or not name.strip():
        return jsonify(error="A non-empty name is required"), 400

    try:
        with get_connection() as conn:
            row = conn.execute(
                "INSERT INTO items (name) VALUES (%s) RETURNING id, name",
                (name.strip(),),
            ).fetchone()

        return jsonify(row), 201
    except psycopg.Error:
        app.logger.exception("Could not create item")
        return jsonify(error="Database operation failed"), 503


@app.get("/items")
def list_items():
    try:
        with get_connection() as conn:
            rows = conn.execute(
                "SELECT id, name FROM items ORDER BY id"
            ).fetchall()

        return jsonify(items=rows), 200
    except psycopg.Error:
        app.logger.exception("Could not list items")
        return jsonify(error="Database operation failed"), 503
