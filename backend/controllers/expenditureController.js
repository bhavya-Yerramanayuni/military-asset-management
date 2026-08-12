import pool from "../config/db.js";

export const createExpenditure = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      base_id,
      equipment_type_id,
      quantity,
      reason
    } = req.body;

    if (
      !base_id ||
      !equipment_type_id ||
      !quantity ||
      !reason
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
        message: "You can only record expenditure for your base"
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
      INSERT INTO expenditures
        (
          base_id,
          equipment_type_id,
          quantity,
          reason,
          recorded_by
        )
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        base_id,
        equipment_type_id,
        quantity,
        reason,
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
        "EXPENDITURE",
        `Expended ${quantity} units. Reason: ${reason}`
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Expenditure recorded successfully",
      expenditure: result.rows[0]
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error("Expenditure error:", error.message);

    res.status(500).json({
      message: "Failed to record expenditure"
    });

  } finally {
    client.release();
  }
};


export const getExpenditures = async (req, res) => {
  try {

    let query = `
      SELECT
        x.id,
        x.base_id,
        b.name AS base_name,
        x.equipment_type_id,
        e.name AS equipment_name,
        x.quantity,
        x.reason,
        x.expended_at
      FROM expenditures x
      JOIN bases b
        ON x.base_id = b.id
      JOIN equipment_types e
        ON x.equipment_type_id = e.id
    `;

    const values = [];

    if (req.user.role === "BASE_COMMANDER") {
      query += " WHERE x.base_id = $1";
      values.push(req.user.base_id);
    }

    query += " ORDER BY x.id DESC";

    const result = await pool.query(query, values);

    res.json({
      count: result.rows.length,
      expenditures: result.rows
    });

  } catch (error) {

    console.error("Get expenditures error:", error.message);

    res.status(500).json({
      message: "Failed to fetch expenditures"
    });
  }
};