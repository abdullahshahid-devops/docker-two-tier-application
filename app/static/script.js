
const form = document.getElementById("item-form");
const input = document.getElementById("item-name");
const message = document.getElementById("message");
const addButton = document.getElementById("add-button");

// Display application and database health
async function checkHealth() {
    const appStatus = document.getElementById("app-status");
    const dbStatus = document.getElementById("db-status");

    try {
        const response = await fetch("/health");
        if (!response.ok) throw new Error();

        const data = await response.json();
        const healthy = data.status === "healthy";

        appStatus.textContent = healthy ? "Healthy" : "Unavailable";
        appStatus.style.color = healthy ? "#39ff14" : "#38bdf8";
    } catch {
        appStatus.textContent = "Offline";
        appStatus.style.color = "#38bdf8";
    }

    try {
        const response = await fetch("/db-check");
        if (!response.ok) throw new Error();

        const data = await response.json();
        const connected = data.database === "connected";

        dbStatus.textContent = connected ? "Connected" : "Unavailable";
        dbStatus.style.color = connected ? "#39ff14" : "#38bdf8";
    } catch {
        dbStatus.textContent = "Offline";
        dbStatus.style.color = "#38bdf8";
    }
}

// Load database records
async function loadItems() {
    const list = document.getElementById("items-list");

    try {
        const response = await fetch("/items");
        if (!response.ok) throw new Error("Unable to load records.");

        const data = await response.json();
        list.innerHTML = "";

        data.items.forEach(item => {
            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = item.id;

            const nameCell = document.createElement("td");
            nameCell.textContent = item.name;

            const actionCell = document.createElement("td");
            actionCell.className = "action-cell";

            // Pencil icon: Edit item
            const editButton = document.createElement("button");
            editButton.className = "icon-button";
            editButton.title = "Edit item";
            editButton.setAttribute("aria-label", "Edit item");

            editButton.innerHTML = `
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/>
                </svg>`;

            editButton.onclick = () => editItem(item);

            // Trash icon: Delete item
            const deleteButton = document.createElement("button");
            deleteButton.className = "icon-button";
            deleteButton.title = "Delete item";
            deleteButton.setAttribute("aria-label", "Delete item");

            deleteButton.innerHTML = `
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 6h18"/>
                    <path d="M8 6V4h8v2"/>
                    <path d="m19 6-1 14H6L5 6"/>
                    <path d="M10 11v5M14 11v5"/>
                </svg>`;

            deleteButton.onclick = () => deleteItem(item);

            actionCell.append(editButton, deleteButton);
            row.append(idCell, nameCell, actionCell);
            list.appendChild(row);
        });

        document.getElementById("item-count").textContent =
            data.items.length;

        if (data.items.length === 0) {
            list.innerHTML =
                "<tr><td colspan='3'>No items found.</td></tr>";
        }

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "#38bdf8";
    }
}

// Create new item
form.addEventListener("submit", async event => {
    event.preventDefault();

    const name = input.value.trim();
    if (!name) return;

    addButton.disabled = true;
    addButton.textContent = "Adding...";

    try {
        const response = await fetch("/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Add failed.");

        message.textContent = "Item added successfully!";
        message.style.color = "#39ff14";

        input.value = "";
        await loadItems();

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "#38bdf8";
    } finally {
        addButton.disabled = false;
        addButton.textContent = "Add Item";
    }
});

// Edit existing item
async function editItem(item) {
    const newName = prompt("Enter the new item name:", item.name);

    if (newName === null || !newName.trim()) return;

    try {
        const response = await fetch(`/items/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName.trim() })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Update failed.");

        message.textContent = "Item updated successfully!";
        message.style.color = "#39ff14";

        await loadItems();

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "#38bdf8";
    }
}

// Delete existing item
async function deleteItem(item) {
    if (!confirm(`Delete "${item.name}"?`)) return;

    try {
        const response = await fetch(`/items/${item.id}`, {
            method: "DELETE"
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Delete failed.");

        message.textContent = "Item deleted successfully!";
        message.style.color = "#39ff14";

        await loadItems();

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "#38bdf8";
    }
}

// Start dashboard
checkHealth();
loadItems();

setInterval(checkHealth, 30000);

