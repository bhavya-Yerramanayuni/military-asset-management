import pool from "../config/db.js";

export const createAssignment = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      base_id,
      equipment_type_id,
      personnel_name,
      quantity
    } = req.body;

    if (
      !base_id ||
      !equipment_type_id ||
      !personnel_name ||
      !quantity
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0"
      });
    }

    if (
      req.user.role === "BASE_COMMANDER" &&
      Number(base_id) !== Number(req.user.base_id)
    ) {
      return res.status(403).json({
        message: "You can only assign assets from your base"
      });
    }

    await client.query("BEGIN");

    const asset = await client.query(
      `
      SELECT *
      FROM assets
      WHERE base_id = $1
      AND equipment_type_id = $2
      FOR UPDATE
      `,
      [base_id, equipment_type_id]
    );

    if (asset.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Asset not found"
      });
    }

    if (asset.rows[0].quantity < quantity) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Insufficient inventory"
      });
    }

    await client.query(
      `
      UPDATE assets
      SET quantity = quantity - $1
      WHERE base_id = $2
      AND equipment_type_id = $3
      `,
      [quantity, base_id, equipment_type_id]
    );

    const result = await client.query(
      `
      INSERT INTO assignments
        (
          base_id,
          equipment_type_id,
          personnel_name,
          quantity,
          assigned_by
        )
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        base_id,
        equipment_type_id,
        personnel_name,
        quantity,
        req.user.id
      ]
    );

    await client.query(
      `
      INSERT INTO audit_logs
        (user_id, action, details)
      VALUES
        ($1, $2, $3)
      `,
      [
        req.user.id,
        "ASSIGNMENT",
        `Assigned ${quantity} units to ${personnel_name}`
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Assignment created successfully",
      assignment: result.rows[0]
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error("Assignment error:", error.message);

    res.status(500).json({
      message: "Failed to create assignment"
    });

  } finally {
    client.release();
  }
};


export const getAssignments = async (req, res) => {
  try {

    let query = `
      SELECT
        a.id,
        a.base_id,
        b.name AS base_name,
        a.equipment_type_id,
        e.name AS equipment_name,
        a.personnel_name,
        a.quantity,
        a.assigned_at
      FROM assignments a
      JOIN bases b
        ON a.base_id = b.id
      JOIN equipment_types e
        ON a.equipment_type_id = e.id
    `;

    const values = [];

    if (req.user.role === "BASE_COMMANDER") {
      query += " WHERE a.base_id = $1";
      values.push(req.user.base_id);
    }

    query += " ORDER BY a.id DESC";

    const result = await pool.query(query, values);

    res.json({
      count: result.rows.length,
      assignments: result.rows
    });

  } catch (error) {

    console.error("Get assignments error:", error.message);

    res.status(500).json({
      message: "Failed to fetch assignments"
    });
  }
};