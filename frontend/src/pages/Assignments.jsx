import { useEffect, useState } from "react";
import api from "../services/api";

function Assignments() {
  const [assignments, setAssignments] = useState([]);

  const [baseId, setBaseId] = useState("");
  const [equipmentTypeId, setEquipmentTypeId] = useState("");
  const [personnelName, setPersonnelName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [assignmentDate, setAssignmentDate] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadAssignments = async () => {
    try {
      const response = await api.get("/assignments");

      setAssignments(
        response.data.assignments || response.data
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load assignments");
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await api.post("/assignments", {
        base_id: Number(baseId),
        equipment_type_id: Number(equipmentTypeId),
        personnel_name: personnelName,
        quantity: Number(quantity),
        assignment_date: assignmentDate
      });

      setMessage("Assignment recorded successfully.");

      setBaseId("");
      setEquipmentTypeId("");
      setPersonnelName("");
      setQuantity("");
      setAssignmentDate("");

      loadAssignments();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Failed to record assignment."
      );
    }
  };

  return (
    <div className="dashboard">

      <h1>Assignments</h1>

      <div className="card">

        <h2>Assign Equipment</h2>

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
            type="text"
            placeholder="Personnel Name"
            value={personnelName}
            onChange={(e) =>
              setPersonnelName(e.target.value)
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
            value={assignmentDate}
            onChange={(e) =>
              setAssignmentDate(e.target.value)
            }
            required
          />

          <button type="submit">
            Record Assignment
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

      <h2>Assignment History</h2>

      {assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (

        <table>

          <thead>
            <tr>
              <th>Base</th>
              <th>Equipment</th>
              <th>Personnel</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {assignments.map((assignment) => (
              <tr key={assignment.id}>

                <td>
                  {assignment.base_name ||
                    assignment.base_id}
                </td>

                <td>
                  {assignment.equipment_name ||
                    assignment.equipment_type_id}
                </td>

                <td>
                  {assignment.personnel_name ||
                    assignment.personnel}
                </td>

                <td>
                  {assignment.quantity}
                </td>

                <td>
                  {assignment.assignment_date
                    ? new Date(
                        assignment.assignment_date
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

export default Assignments;