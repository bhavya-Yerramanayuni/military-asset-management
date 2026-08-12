import { useEffect, useState } from "react";
import api from "../services/api";

function Transfers() {
  const [transfers, setTransfers] = useState([]);

  const [sourceBaseId, setSourceBaseId] = useState("");
  const [destinationBaseId, setDestinationBaseId] = useState("");
  const [equipmentTypeId, setEquipmentTypeId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [transferDate, setTransferDate] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadTransfers = async () => {
    try {
      const response = await api.get("/transfers");

      setTransfers(
        response.data.transfers || response.data
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load transfers");
    }
  };

  useEffect(() => {
    loadTransfers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (sourceBaseId === destinationBaseId) {
      setError("Source and destination bases must be different.");
      return;
    }

    try {
      await api.post("/transfers", {
        source_base_id: Number(sourceBaseId),
        destination_base_id: Number(destinationBaseId),
        equipment_type_id: Number(equipmentTypeId),
        quantity: Number(quantity),
        transfer_date: transferDate
      });

      setMessage("Transfer recorded successfully.");

      setSourceBaseId("");
      setDestinationBaseId("");
      setEquipmentTypeId("");
      setQuantity("");
      setTransferDate("");

      loadTransfers();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Failed to record transfer."
      );
    }
  };

  return (
    <div className="dashboard">

      <h1>Transfers</h1>

      {/* Transfer Form */}

      <div className="card">

        <h2>Initiate Transfer</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="number"
            placeholder="Source Base ID"
            value={sourceBaseId}
            onChange={(e) =>
              setSourceBaseId(e.target.value)
            }
            required
          />

          <input
            type="number"
            placeholder="Destination Base ID"
            value={destinationBaseId}
            onChange={(e) =>
              setDestinationBaseId(e.target.value)
            }
            required
          />

          <input
            type="number"
            placeholder="Equipment Type ID"
            value={equipmentTypeId}
            onChange={(e) =>
              setEquipmentTypeId(e.target.value)
            }
            required
          />

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            min="1"
            required
          />

          <input
            type="date"
            value={transferDate}
            onChange={(e) =>
              setTransferDate(e.target.value)
            }
            required
          />

          <button type="submit">
            Record Transfer
          </button>

        </form>

        {message && (
          <p style={{ color: "green" }}>
            {message}
          </p>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

      </div>

      {/* Transfer History */}

      <h2>Transfer History</h2>

      {transfers.length === 0 ? (
        <p>No transfers found.</p>
      ) : (

        <table>

          <thead>
            <tr>
              <th>Source Base</th>
              <th>Destination Base</th>
              <th>Equipment</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {transfers.map((transfer) => (
              <tr key={transfer.id}>

                <td>
                  {transfer.source_base_name ||
                    transfer.source_base_id}
                </td>

                <td>
                  {transfer.destination_base_name ||
                    transfer.destination_base_id}
                </td>

                <td>
                  {transfer.equipment_name ||
                    transfer.equipment_type_id}
                </td>

                <td>
                  {transfer.quantity}
                </td>

                <td>
                  {transfer.transfer_date
                    ? new Date(
                        transfer.transfer_date
                      ).toLocaleDateString()
                    : "-"}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}

export default Transfers;