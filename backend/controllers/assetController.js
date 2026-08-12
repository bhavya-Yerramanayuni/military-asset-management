import pool from "../config/db.js";

export const getAssets = async (req, res) => {
  try {
    let query = `
      SELECT
        a.id,
        a.base_id,
        b.name AS base_name,
        a.equipment_type_id,
        e.name AS equipment_name,
        e.category,
        a.quantity,
        a.created_at
      FROM assets a
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

    query += " ORDER BY a.id";

    const result = await pool.query(query, values);

    res.json({
      count: result.rows.length,
      assets: result.rows,
    });
  } catch (error) {
    console.error("Get assets error:", error.message);

    res.status(500).json({
      message: "Failed to fetch assets",
    });
  }
};


export const createAsset = async (req, res) => {
  try {
    const {
      base_id,
      equipment_type_id,
      quantity,
    } = req.body;

    if (!base_id || !equipment_type_id || quantity === undefined) {
      return res.status(400).json({
        message:
          "base_id, equipment_type_id and quantity are required",
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        message: "Quantity cannot be negative",
      });
    }

    if (
      req.user.role === "BASE_COMMANDER" &&
      Number(base_id) !== Number(req.user.base_id)
    ) {
      return res.status(403).json({
        message: "You can only manage your assigned base",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO assets
        (base_id, equipment_type_id, quantity)
      VALUES
        ($1, $2, $3)
      ON CONFLICT (base_id, equipment_type_id)
      DO UPDATE SET quantity = assets.quantity + EXCLUDED.quantity
      RETURNING *
      `,
      [base_id, equipment_type_id, quantity]
    );

    res.status(201).json({
      message: "Asset created successfully",
      asset: result.rows[0],
    });
  } catch (error) {
    console.error("Create asset error:", error.message);

    res.status(500).json({
      message: "Failed to create asset",
    });
  }
};


export const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        message: "Valid quantity is required",
      });
    }

    const existing = await pool.query(
      "SELECT * FROM assets WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    const asset = existing.rows[0];

    if (
      req.user.role === "BASE_COMMANDER" &&
      Number(asset.base_id) !== Number(req.user.base_id)
    ) {
      return res.status(403).json({
        message: "You can only manage your assigned base",
      });
    }

    const result = await pool.query(
      `
      UPDATE assets
      SET quantity = $1
      WHERE id = $2
      RETURNING *
      `,
      [quantity, id]
    );

    res.json({
      message: "Asset updated successfully",
      asset: result.rows[0],
    });
  } catch (error) {
    console.error("Update asset error:", error.message);

    res.status(500).json({
      message: "Failed to update asset",
    });
  }
};