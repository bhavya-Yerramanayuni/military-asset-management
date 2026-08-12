import { useEffect, useState } from "react";
import api from "../services/api";

function Inventory() {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const response = await api.get("/assets");

        setAssets(
          response.data.assets || response.data
        );
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
          "Failed to load inventory"
        );
      }
    };

    loadAssets();
  }, []);

  return (
    <div className="dashboard">

      <h1>Inventory</h1>

      {error && <p className="error">{error}</p>}

      {!error && assets.length === 0 && (
        <p>Loading inventory...</p>
      )}

      {assets.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Base</th>
              <th>Equipment</th>
              <th>Quantity</th>
            </tr>
          </thead>

          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td>
                  {asset.base_name || asset.base_id}
                </td>

                <td>
                  {asset.equipment_name ||
                    asset.equipment_type_id}
                </td>

                <td>
                  {asset.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}

export default Inventory;