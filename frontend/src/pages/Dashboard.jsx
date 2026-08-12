import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [showMovementModal, setShowMovementModal] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/dashboard/summary");

        setData(response.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
          "Failed to load dashboard"
        );
      }
    };

    loadDashboard();
  }, []);

  if (error) {
    return (
      <div className="dashboard">
        <h2>Dashboard Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  const summary = data.summary;

  return (
    <div className="dashboard">

      <h1>Military Asset Management</h1>

      <h2>Dashboard</h2>

      <div className="stats">

        <div className="card">
          <h3>Opening Balance</h3>
          <p>{summary.opening_balance}</p>
        </div>

        <div
          className="card"
          onClick={() => setShowMovementModal(true)}
          style={{ cursor: "pointer" }}
        >
          <h3>Net Movement</h3>
          <p>{summary.net_movement}</p>
          <small>Click to view breakdown</small>
        </div>

        <div className="card">
          <h3>Closing Balance</h3>
          <p>{summary.closing_balance}</p>
        </div>

        <div className="card">
          <h3>Total Assigned</h3>
          <p>{summary.total_assigned}</p>
        </div>

        <div className="card">
          <h3>Total Expended</h3>
          <p>{summary.total_expended}</p>
        </div>

      </div>

      {showMovementModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            className="card"
            style={{
              width: "400px",
              padding: "25px",
              backgroundColor: "white"
            }}
          >

            <h2>Net Movement Breakdown</h2>

            <p>
              <strong>Purchases:</strong>{" "}
              +{summary.total_purchased}
            </p>

            <p>
              <strong>Transfers In:</strong>{" "}
              +{summary.transfers_in}
            </p>

            <p>
              <strong>Transfers Out:</strong>{" "}
              -{summary.transfers_out}
            </p>

            <hr />

            <p>
              <strong>Net Movement:</strong>{" "}
              {summary.net_movement}
            </p>

            <button
              onClick={() =>
                setShowMovementModal(false)
              }
            >
              Close
            </button>

          </div>
        </div>
      )}

      <h2>Base Inventory</h2>

      <table>
        <thead>
          <tr>
            <th>Base</th>
            <th>Total Quantity</th>
          </tr>
        </thead>

        <tbody>
          {data.base_inventory.map((base) => (
            <tr key={base.base_id}>
              <td>{base.base_name}</td>
              <td>{base.total_quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Dashboard;