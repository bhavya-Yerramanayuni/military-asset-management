import { useEffect, useState } from "react";
import api from "../services/api";

function Purchases() {
  const [purchases, setPurchases] = useState([]);

  const [baseId, setBaseId] = useState("");
  const [equipmentTypeId, setEquipmentTypeId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPurchases = async () => {
    try {
      const response = await api.get("/purchases");

      setPurchases(
        response.data.purchases || response.data
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load purchases");
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await api.post("/purchases", {
        base_id: Number(baseId),
        equipment_type_id: Number(equipmentTypeId),
        quantity: Number(quantity),
        purchase_date: purchaseDate
      });

      setMessage("Purchase recorded successfully");

      setBaseId("");
      setEquipmentTypeId("");
      setQuantity("");
      setPurchaseDate("");

      loadPurchases();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Failed to record purchase"
      );
    }
  };

  return (
    <div className="dashboard">

      <h1>Purchases</h1>

      {/* Purchase Form */}

      <div className="card">
        <h2>Add Purchase</h2>

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
            type="date"
            value={purchaseDate}
            onChange={(e) =>
              setPurchaseDate(e.target.value)
            }
            required
          />

          <button type="submit">
            Record Purchase
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

      {/* Purchase History */}

      <h2>Purchase History</h2>

      {purchases.length === 0 ? (
        <p>No purchases found.</p>
      ) : (
        <table>

          <thead>
            <tr>
              <th>Base</th>
              <th>Equipment</th>
              <th>Quantity</th>
              <th>Purchase Date</th>
            </tr>
          </thead>

          <tbody>

            {purchases.map((purchase) => (
              <tr key={purchase.id}>

                <td>
                  {purchase.base_name ||
                    purchase.base_id}
                </td>

                <td>
                  {purchase.equipment_name ||
                    purchase.equipment_type_id}
                </td>

                <td>
                  {purchase.quantity}
                </td>

                <td>
                  {purchase.purchase_date
                    ? new Date(
                        purchase.purchase_date
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

export default Purchases;