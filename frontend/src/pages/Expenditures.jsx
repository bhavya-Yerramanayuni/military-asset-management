import { useEffect, useState } from "react";
import api from "../services/api";

function Expenditures() {
  const [expenditures, setExpenditures] = useState([]);

  const [baseId, setBaseId] = useState("");
  const [equipmentTypeId, setEquipmentTypeId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [expenditureDate, setExpenditureDate] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadExpenditures = async () => {
    try {
      const response = await api.get("/expenditures");

      setExpenditures(
        response.data.expenditures || response.data
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load expenditures");
    }
  };

  useEffect(() => {
    loadExpenditures();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await api.post("/expenditures", {
        base_id: Number(baseId),
        equipment_type_id: Number(equipmentTypeId),
        quantity: Number(quantity),
        reason,
        expended_at: expenditureDate
      });

      setMessage("Expenditure recorded successfully.");

      setBaseId("");
      setEquipmentTypeId("");
      setQuantity("");
      setReason("");
      setExpenditureDate("");

      loadExpenditures();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Failed to record expenditure."
      );
    }
  };

  return (
    <div className="dashboard">

      <h1>Expenditures</h1>

      <div className="card">

        <h2>Record Expenditure</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="number"
            placeholder="Base ID"
            value={baseId}
            onChange={(e) => setBaseId(e.target.value)}
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
            type="text"
            placeholder="Reason"
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
            required
          />

          <input
            type="date"
            value={expenditureDate}
            onChange={(e) =>
              setExpenditureDate(e.target.value)
            }
            required
          />

          <button type="submit">
            Record Expenditure
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

      <h2>Expenditure History</h2>

      {expenditures.length === 0 ? (
        <p>No expenditures found.</p>
      ) : (

        <table>

          <thead>
            <tr>
              <th>Base</th>
              <th>Equipment</th>
              <th>Quantity</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {expenditures.map((expenditure) => (
              <tr key={expenditure.id}>

                <td>
                  {expenditure.base_name ||
                    expenditure.base_id}
                </td>

                <td>
                  {expenditure.equipment_name ||
                    expenditure.equipment_type_id}
                </td>

                <td>
                  {expenditure.quantity}
                </td>

                <td>
                  {expenditure.reason}
                </td>

                <td>
                  {expenditure.expended_at
                    ? new Date(
                        expenditure.expended_at
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

export default Expenditures;