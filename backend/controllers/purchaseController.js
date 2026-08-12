import pool from "../config/db.js";

export const createPurchase = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      base_id,
      equipment_type_id,
      quantity
    } = req.body;

    if (!base_id || !equipment_type_id || !quantity) {
      return res.status(400).json({
        message:
          "base_id, equipment_type_id and quantity are required"
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0"
      });
    }

    // Base Commander can only purchase for assigned base
    if (
      req.user.role === "BASE_COMMANDER" &&
      Number(base_id) !== Number(req.user.base_id)
    ) {
      return res.status(403).json({
        message:
          "You can only purchase equipment for your assigned base"
      });
    }

    await client.query("BEGIN");

    // Create purchase record
    const purchaseResult = await client.query(
      `
      INSERT INTO purchases
        (base_id, equipment_type_id, quantity, created_by)
      VALUES
        ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        base_id,
        equipment_type_id,
        quantity,
        req.user.id
      ]
    );

    // Increase inventory
    const assetResult = await client.query(
      `
      INSERT INTO assets
        (base_id, equipment_type_id, quantity)
      VALUES
        ($1, $2, $3)
      ON CONFLICT (base_id, equipment_type_id)
      DO UPDATE
      SET quantity = assets.quantity + EXCLUDED.quantity
      RETURNING *
      `,
      [
        base_id,
        equipment_type_id,
        quantity
      ]
    );

    // Audit log
    await client.query(
      `
      INSERT INTO audit_logs
        (user_id, action, details)
      VALUES
        ($1, $2, $3)
      `,
      [
        req.user.id,
        "PURCHASE",
        `Purchased ${quantity} units of equipment type ${equipment_type_id} for base ${base_id}`
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Purchase recorded successfully",
      purchase: purchaseResult.rows[0],
      updated_asset: assetResult.rows[0]
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(
      "Create purchase error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to record purchase"
    });

  } finally {
    client.release();
  }
};


export const getPurchases = async (req, res) => {

  try {

    let query = `
      SELECT
        p.id,
        p.base_id,
        b.name AS base_name,
        p.equipment_type_id,
        e.name AS equipment_name,
        e.category,
        p.quantity,
        p.purchase_date,
        p.created_by,
        u.username AS created_by_username
      FROM purchases p

      JOIN bases b
        ON p.base_id = b.id

      JOIN equipment_types e
        ON p.equipment_type_id = e.id

      LEFT JOIN users u
        ON p.created_by = u.id
    `;

    const values = [];

    if (req.user.role === "BASE_COMMANDER") {

      query += " WHERE p.base_id = $1";

      values.push(req.user.base_id);
    }

    query += " ORDER BY p.id DESC";

    const result = await pool.query(
      query,
      values
    );

    res.json({
      count: result.rows.length,
      purchases: result.rows
    });

  } catch (error) {

    console.error(
      "Get purchases error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch purchases"
    });
  }
};