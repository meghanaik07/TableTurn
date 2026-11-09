
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Tables from "./Tables";
import "../styles/Dashboard.css";

const API_URL = "http://localhost:5000/api/tables";

const reservations = [
  { name: "Ananya Sharma", guests: 3, time: "07:00 PM", table: "T02", status: "Confirmed" },
  { name: "Rahul Kumar", guests: 5, time: "07:30 PM", table: "T03", status: "Seated" },
  { name: "Priya Nair", guests: 2, time: "08:00 PM", table: "T01", status: "Confirmed" },
  { name: "Arjun Rao", guests: 4, time: "08:30 PM", table: "T04", status: "Pending" },
];

function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTables() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch tables");
      }

      const data = await response.json();

      setTables(
        data.map((table) => ({
          id: table.tableNumber,
          capacity: table.capacity,
          status: table.status,
          mongoId: table._id,
        }))
      );
    } catch (error) {
      alert("Unable to load tables. Please check your backend.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTables();
  }, []);

  async function handleAddTable(newTable) {
    const alreadyExists = tables.some(
      (table) => table.id.toLowerCase() === newTable.id.toLowerCase()
    );

    if (alreadyExists) {
      alert("This table number already exists.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableNumber: newTable.id,
          capacity: newTable.capacity,
          status: newTable.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add table");
      }

      await fetchTables();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleUpdateTable(tableId, updatedDetails) {
    const table = tables.find((item) => item.id === tableId);

    if (!table) return;

    try {
      const response = await fetch(`${API_URL}/${table.mongoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          capacity: updatedDetails.capacity,
          status: updatedDetails.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update table");
      }

      await fetchTables();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDeleteTable(tableId) {
    const confirmed = window.confirm(
      `Are you sure you want to delete table ${tableId}?`
    );

    if (!confirmed) return;

    const table = tables.find((item) => item.id === tableId);

    if (!table) return;

    try {
      const response = await fetch(`${API_URL}/${table.mongoId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete table");
      }

      await fetchTables();
    } catch (error) {
      alert(error.message);
    }
  }

  const available = tables.filter(
    (table) => table.status === "Available"
  ).length;

  const reserved = tables.filter(
    (table) => table.status === "Reserved"
  ).length;

  const occupied = tables.filter(
    (table) => table.status === "Occupied"
  ).length;

  const stats = [
    { label: "Total Tables", value: tables.length, icon: "▦", color: "blue" },
    { label: "Available", value: available, icon: "✓", color: "green" },
    { label: "Reserved", value: reserved, icon: "▣", color: "orange" },
    { label: "Occupied", value: occupied, icon: "●", color: "purple" },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="dashboard-main">
        {activePage === "dashboard" ? (
          <>
            <header className="dashboard-header">
              <div>
                <span className="page-eyebrow">RESTAURANT MANAGEMENT</span>
                <h1>Dashboard Overview</h1>
                <p>Here's what's happening at your restaurant today.</p>
              </div>

              <div className="header-date">
                <span className="date-icon">▦</span>
                <span>Restaurant Admin</span>
              </div>
            </header>

            <section className="welcome-banner">
              <div>
                <span className="welcome-label">WELCOME BACK!</span>
                <h2>Manage your restaurant effortlessly.</h2>
                <p>
                  Monitor tables, reservations and your waiting queue from one place.
                </p>
              </div>
              <div className="welcome-decoration">T</div>
            </section>

            <section className="stats-grid">
              {stats.map((stat) => (
                <article className="stat-card" key={stat.label}>
                  <div className={`stat-icon ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p>{stat.label}</p>
                    <h2>{stat.value}</h2>
                  </div>
                  <span className="stat-caption">Current overview</span>
                </article>
              ))}
            </section>

            <section className="dashboard-section">
              <div className="section-heading">
                <div>
                  <h2>Table Overview</h2>
                  <p>Current status of restaurant tables</p>
                </div>

                <button
                  className="text-button"
                  onClick={() => setActivePage("tables")}
                >
                  Manage Tables →
                </button>
              </div>

              {loading ? (
                <p>Loading tables...</p>
              ) : (
                <div className="table-grid">
                  {tables.map((table) => (
                    <article className="table-card" key={table.mongoId}>
                      <div className="table-card-top">
                        <span className="table-symbol">▦</span>
                        <span className={`status-badge ${table.status.toLowerCase()}`}>
                          {table.status}
                        </span>
                      </div>
                      <h3>{table.id}</h3>
                      <p>{table.capacity} Seats</p>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="dashboard-section">
              <div className="section-heading">
                <div>
                  <h2>Recent Reservations</h2>
                  <p>Latest restaurant bookings</p>
                </div>

                <button
                  className="text-button"
                  onClick={() => setActivePage("reservations")}
                >
                  View All →
                </button>
              </div>

              <div className="reservation-table-wrapper">
                <table className="reservation-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Guests</th>
                      <th>Time</th>
                      <th>Table</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reservations.map((reservation, index) => (
                      <tr key={index}>
                        <td className="customer-name">{reservation.name}</td>
                        <td>{reservation.guests} People</td>
                        <td>{reservation.time}</td>
                        <td>{reservation.table}</td>
                        <td>
                          <span className={`reservation-status ${reservation.status.toLowerCase()}`}>
                            {reservation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="waitlist-preview">
              <div className="waitlist-icon">☷</div>
              <div className="waitlist-content">
                <h3>Digital Waitlist</h3>
                <p>
                  Manage waiting customers and promote them when suitable tables become available.
                </p>
              </div>

              <button
                className="text-button"
                onClick={() => setActivePage("waitlist")}
              >
                View Waitlist →
              </button>
            </section>

            <footer className="dashboard-footer">
              TableTurn · Restaurant Management System
            </footer>
          </>
        ) : activePage === "tables" ? (
          loading ? (
            <p>Loading tables...</p>
          ) : (
            <Tables
              tables={tables}
              onAddTable={handleAddTable}
              onUpdateTable={handleUpdateTable}
              onDeleteTable={handleDeleteTable}
            />
          )
        ) : activePage === "reservations" || activePage === "waitlist" ? (
          <section className="coming-soon">
            <span>TABLETURN MANAGEMENT</span>
            <h1>
              {activePage === "reservations"
                ? "Reservation Management"
                : "Digital Waitlist"}
            </h1>
            <p>This section will be implemented in the next development stage.</p>
            <button onClick={() => setActivePage("dashboard")}>
              ← Back to Dashboard
            </button>
          </section>
        ) : null}
      </main>
    </div>
  );
}

export default Dashboard;
