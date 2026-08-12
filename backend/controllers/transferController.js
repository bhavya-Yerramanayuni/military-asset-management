import pool from "../config/db.js";

export const createTransfer = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      source_base_id,
      destination_base_id,
      equipment_type_id,
      quantity
    } = req.body;

    if (
      !source_base_id ||
      !destination_base_id ||
      !equipment_type_id ||
      !quantity
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (source_base_id === destination_base_id) {
      return res.status(400).json({
        message: "Source and destination bases must be different"
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0"
      });
    }

    if (
      req.user.role === "BASE_COMMANDER" &&
      Number(source_base_id) !== Number(req.user.base_id)
    ) {
      return res.status(403).json({
        message: "You can only transfer from your assigned base"
      });
    }

    await client.query("BEGIN");

    const sourceAsset = await client.query(
      `
      SELECT *
      FROM assets
      WHERE base_id = $1
      AND equipment_type_id = $2
      FOR UPDATE
      `,
      [source_base_id, equipment_type_id]
    );

    if (sourceAsset.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Source asset not found"
      });
    }

    if (sourceAsset.rows[0].quantity < quantity) {
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
      [quantity, source_base_id, equipment_type_id]
    );

    await client.query(
      `
      INSERT INTO assets
        (base_id, equipment_type_id, quantity)
      VALUES
        ($1, $2, $3)
      ON CONFLICT (base_id, equipment_type_id)
      DO UPDATE
      SET quantity = assets.quantity + EXCLUDED.quantity
      `,
      [destination_base_id, equipment_type_id, quantity]
    );

    const transferResult = await client.query(
      `
      INSERT INTO transfers
        (
          source_base_id,
          destination_base_id,
          equipment_type_id,
          quantity,
          status,
          initiated_by
        )
      VALUES
        ($1, $2, $3, $4, 'COMPLETED', $5)
      RETURNING *
      `,
      [
        source_base_id,
        destination_base_id,
        equipment_type_id,
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
        "TRANSFER",
        `Transferred ${quantity} units from base ${source_base_id} to base ${destination_base_id}`
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Transfer completed successfully",
      transfer: transferResult.rows[0]
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error("Transfer error:", error.message);

    res.status(500).json({
      message: "Failed to complete transfer"
    });

  } finally {
    client.release();
  }
};


export const getTransfers = async (req, res) => {
  try {

    let query = `
      SELECT
        t.id,
        t.source_base_id,
        sb.name AS source_base,
        t.destination_base_id,
        db.name AS destination_base,
        t.equipment_type_id,
        e.name AS equipment_name,
        t.quantity,
        t.status,
        t.timestamp
      FROM transfers t
      JOIN bases sb
        ON t.source_base_id = sb.id
      JOIN bases db
        ON t.destination_base_id = db.id
      JOIN equipment_types e
        ON t.equipment_type_id = e.id
    `;

    const values = [];

    if (req.user.role === "BASE_COMMANDER") {
      query += `
        WHERE
          t.source_base_id = $1
          OR t.destination_base_id = $1
      `;

      values.push(req.user.base_id);
    }

    query += " ORDER BY t.id DESC";

    const result = await pool.query(query, values);

    res.json({
      count: result.rows.length,
      transfers: result.rows
    });

  } catch (error) {

    console.error("Get transfers error:", error.message);

    res.status(500).json({
      message: "Failed to fetch transfers"
    });
  }
};