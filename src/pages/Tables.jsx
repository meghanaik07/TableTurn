import { useState } from "react";
import "../styles/Tables.css";
function Tables({ tables, onAddTable, onUpdateTable, onDeleteTable }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("Available");

  function resetForm() {
    setTableNumber("");
    setCapacity("");
    setStatus("Available");
    setEditingId(null);
    setShowForm(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const tableData = {
      id: tableNumber.trim().toUpperCase(),
      capacity: Number(capacity),
      status,
    };

    if (editingId) {
      onUpdateTable(editingId, tableData);
    } else {
      onAddTable(tableData);
    }

    resetForm();
  }

  function handleEdit(table) {
    setTableNumber(table.id);
    setCapacity(String(table.capacity));
    setStatus(table.status);
    setEditingId(table.id);
    setShowForm(true);
  }

  const available = tables.filter((table) => table.status === "Available").length;
  const reserved = tables.filter((table) => table.status === "Reserved").length;
  const occupied = tables.filter((table) => table.status === "Occupied").length;

  return (
    <div className="tables-page">
      <header className="tables-header">
        <div>
          <span className="page-eyebrow">RESTAURANT MANAGEMENT</span>
          <h1>Table Management</h1>
          <p>Manage restaurant tables, seating capacity and availability.</p>
        </div>

        <button className="add-table-button" onClick={() => setShowForm(true)}>
          + Add New Table
        </button>
      </header>

      <section className="table-stats">
        <article className="table-stat-card">
          <span>Total Tables</span>
          <h2>{tables.length}</h2>
        </article>
        <article className="table-stat-card">
          <span>Available</span>
          <h2>{available}</h2>
        </article>
        <article className="table-stat-card">
          <span>Reserved</span>
          <h2>{reserved}</h2>
        </article>
        <article className="table-stat-card">
          <span>Occupied</span>
          <h2>{occupied}</h2>
        </article>
      </section>

      {showForm && (
        <section className="table-form-card">
          <div className="table-form-heading">
            <h2>{editingId ? "Edit Table" : "Add New Table"}</h2>
            <button className="close-form-button" onClick={resetForm}>×</button>
          </div>

          <form onSubmit={handleSubmit} className="table-form">
            <label>
              Table Number
              <input
                value={tableNumber}
                onChange={(event) => setTableNumber(event.target.value)}
                placeholder="Example: T07"
                required
                disabled={Boolean(editingId)}
              />
            </label>

            <label>
              Seating Capacity
              <input
                type="number"
                min="1"
                max="50"
                value={capacity}
                onChange={(event) => setCapacity(event.target.value)}
                placeholder="Enter number of seats"
                required
              />
            </label>

            <label>
              Table Status
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option>Available</option>
                <option>Reserved</option>
                <option>Occupied</option>
              </select>
            </label>

            <div className="table-form-actions">
              <button type="button" className="cancel-button" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="save-table-button">
                {editingId ? "Save Changes" : "Add Table"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="table-list-section">
        <div className="section-heading">
          <div>
            <h2>All Restaurant Tables</h2>
            <p>View and manage your restaurant seating arrangements.</p>
          </div>
          <span className="table-count">{tables.length} Tables</span>
        </div>

        {tables.length === 0 ? (
          <div className="empty-tables">
            <h3>No tables added yet</h3>
            <p>Click Add New Table to create your first restaurant table.</p>
          </div>
        ) : (
          <div className="managed-table-grid">
            {tables.map((table) => (
              <article className="managed-table-card" key={table.id}>
                <div className="managed-table-top">
                  <span className="managed-table-icon">▦</span>
                  <span className={`status-badge ${table.status.toLowerCase()}`}>
                    {table.status}
                  </span>
                </div>

                <h3>{table.id}</h3>
                <p>{table.capacity} Seats</p>

                <div className="managed-table-actions">
                  <button onClick={() => handleEdit(table)}>Edit</button>
                  <button
                    className="delete-table-button"
                    onClick={() => onDeleteTable(table.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Tables;
