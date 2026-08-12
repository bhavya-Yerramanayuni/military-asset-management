import pool from "../config/db.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const {
      base_id,
      equipment_type_id,
      from,
      to
    } = req.query;

    // -----------------------------------
    // Determine base access
    // -----------------------------------

    let selectedBaseId = base_id
      ? Number(base_id)
      : null;

    if (req.user.role === "BASE_COMMANDER") {
      selectedBaseId = Number(req.user.base_id);

      if (
        base_id &&
        Number(base_id) !== Number(req.user.base_id)
      ) {
        return res.status(403).json({
          message: "You can only view your assigned base"
        });
      }
    }

    const equipmentTypeId = equipment_type_id
      ? Number(equipment_type_id)
      : null;

    // -----------------------------------
    // Validate dates
    // -----------------------------------

    if (from && to && from > to) {
      return res.status(400).json({
        message: "From date cannot be after To date"
      });
    }

    // -----------------------------------
    // Current Closing Balance
    // -----------------------------------

    const assetValues = [];
    const assetConditions = [];

    if (selectedBaseId) {
      assetValues.push(selectedBaseId);

      assetConditions.push(
        `a.base_id = $${assetValues.length}`
      );
    }

    if (equipmentTypeId) {
      assetValues.push(equipmentTypeId);

      assetConditions.push(
        `a.equipment_type_id = $${assetValues.length}`
      );
    }

    const assetFilter =
      assetConditions.length > 0
        ? `WHERE ${assetConditions.join(" AND ")}`
        : "";

    const assetsResult = await pool.query(
      `
      SELECT
        COALESCE(SUM(a.quantity), 0) AS total
      FROM assets a
      ${assetFilter}
      `,
      assetValues
    );

    const closingBalance = Number(
      assetsResult.rows[0].total
    );

    // -----------------------------------
    // PURCHASES
    // -----------------------------------

    const purchaseValues = [];
    const purchaseConditions = [];

    if (selectedBaseId) {
      purchaseValues.push(selectedBaseId);

      purchaseConditions.push(
        `p.base_id = $${purchaseValues.length}`
      );
    }

    if (equipmentTypeId) {
      purchaseValues.push(equipmentTypeId);

      purchaseConditions.push(
        `p.equipment_type_id = $${purchaseValues.length}`
      );
    }

    if (from) {
      purchaseValues.push(from);

      purchaseConditions.push(
        `p.purchase_date >= $${purchaseValues.length}::date`
      );
    }

    if (to) {
      purchaseValues.push(to);

      purchaseConditions.push(
        `p.purchase_date < ($${purchaseValues.length}::date + INTERVAL '1 day')`
      );
    }

    const purchaseFilter =
      purchaseConditions.length > 0
        ? `WHERE ${purchaseConditions.join(" AND ")}`
        : "";

    const purchasesResult = await pool.query(
      `
      SELECT
        COALESCE(SUM(p.quantity), 0) AS total
      FROM purchases p
      ${purchaseFilter}
      `,
      purchaseValues
    );

    const purchases = Number(
      purchasesResult.rows[0].total
    );

    // -----------------------------------
    // TRANSFERS IN
    // -----------------------------------

    const transferInValues = [];
    const transferInConditions = [
      "t.status = 'COMPLETED'"
    ];

    if (selectedBaseId) {
      transferInValues.push(selectedBaseId);

      transferInConditions.push(
        `t.destination_base_id = $${transferInValues.length}`
      );
    }

    if (equipmentTypeId) {
      transferInValues.push(equipmentTypeId);

      transferInConditions.push(
        `t.equipment_type_id = $${transferInValues.length}`
      );
    }

    if (from) {
      transferInValues.push(from);

      transferInConditions.push(
        `t.timestamp >= $${transferInValues.length}::date`
      );
    }

    if (to) {
      transferInValues.push(to);

      transferInConditions.push(
        `t.timestamp < ($${transferInValues.length}::date + INTERVAL '1 day')`
      );
    }

    const transfersInResult = await pool.query(
      `
      SELECT
        COALESCE(SUM(t.quantity), 0) AS total
      FROM transfers t
      WHERE ${transferInConditions.join(" AND ")}
      `,
      transferInValues
    );

    const transfersIn = Number(
      transfersInResult.rows[0].total
    );

    // -----------------------------------
    // TRANSFERS OUT
    // -----------------------------------

    const transferOutValues = [];
    const transferOutConditions = [
      "t.status = 'COMPLETED'"
    ];

    if (selectedBaseId) {
      transferOutValues.push(selectedBaseId);

      transferOutConditions.push(
        `t.source_base_id = $${transferOutValues.length}`
      );
    }

    if (equipmentTypeId) {
      transferOutValues.push(equipmentTypeId);

      transferOutConditions.push(
        `t.equipment_type_id = $${transferOutValues.length}`
      );
    }

    if (from) {
      transferOutValues.push(from);

      transferOutConditions.push(
        `t.timestamp >= $${transferOutValues.length}::date`
      );
    }

    if (to) {
      transferOutValues.push(to);

      transferOutConditions.push(
        `t.timestamp < ($${transferOutValues.length}::date + INTERVAL '1 day')`
      );
    }

    const transfersOutResult = await pool.query(
      `
      SELECT
        COALESCE(SUM(t.quantity), 0) AS total
      FROM transfers t
      WHERE ${transferOutConditions.join(" AND ")}
      `,
      transferOutValues
    );

    const transfersOut = Number(
      transfersOutResult.rows[0].total
    );

    // -----------------------------------
    // ASSIGNMENTS
    // -----------------------------------

    const assignmentValues = [];
    const assignmentConditions = [];

    if (selectedBaseId) {
      assignmentValues.push(selectedBaseId);

      assignmentConditions.push(
        `a.base_id = $${assignmentValues.length}`
      );
    }

    if (equipmentTypeId) {
      assignmentValues.push(equipmentTypeId);

      assignmentConditions.push(
        `a.equipment_type_id = $${assignmentValues.length}`
      );
    }

    if (from) {
      assignmentValues.push(from);

      assignmentConditions.push(
        `a.assigned_at >= $${assignmentValues.length}::date`
      );
    }

    if (to) {
      assignmentValues.push(to);

      assignmentConditions.push(
        `a.assigned_at < ($${assignmentValues.length}::date + INTERVAL '1 day')`
      );
    }

    const assignmentFilter =
      assignmentConditions.length > 0
        ? `WHERE ${assignmentConditions.join(" AND ")}`
        : "";

    const assignmentsResult = await pool.query(
      `
      SELECT
        COALESCE(SUM(a.quantity), 0) AS total
      FROM assignments a
      ${assignmentFilter}
      `,
      assignmentValues
    );

    const assigned = Number(
      assignmentsResult.rows[0].total
    );

    // -----------------------------------
    // EXPENDITURES
    // -----------------------------------

    const expenditureValues = [];
    const expenditureConditions = [];

    if (selectedBaseId) {
      expenditureValues.push(selectedBaseId);

      expenditureConditions.push(
        `e.base_id = $${expenditureValues.length}`
      );
    }

    if (equipmentTypeId) {
      expenditureValues.push(equipmentTypeId);

      expenditureConditions.push(
        `e.equipment_type_id = $${expenditureValues.length}`
      );
    }

    if (from) {
      expenditureValues.push(from);

      expenditureConditions.push(
        `e.expended_at >= $${expenditureValues.length}::date`
      );
    }

    if (to) {
      expenditureValues.push(to);

      expenditureConditions.push(
        `e.expended_at < ($${expenditureValues.length}::date + INTERVAL '1 day')`
      );
    }

    const expenditureFilter =
      expenditureConditions.length > 0
        ? `WHERE ${expenditureConditions.join(" AND ")}`
        : "";

    const expendituresResult = await pool.query(
      `
      SELECT
        COALESCE(SUM(e.quantity), 0) AS total
      FROM expenditures e
      ${expenditureFilter}
      `,
      expenditureValues
    );

    const expended = Number(
      expendituresResult.rows[0].total
    );

    // -----------------------------------
    // Net Movement
    // -----------------------------------

    const netMovement =
      purchases +
      transfersIn -
      transfersOut;

    // -----------------------------------
    // Opening Balance
    // -----------------------------------

    const openingBalance =
      closingBalance -
      netMovement +
      assigned +
      expended;

    // -----------------------------------
    // Base Inventory
    // -----------------------------------

    const baseValues = [];
    const baseConditions = [];

    if (selectedBaseId) {
      baseValues.push(selectedBaseId);

      baseConditions.push(
        `b.id = $${baseValues.length}`
      );
    }

    const baseFilter =
      baseConditions.length > 0
        ? `WHERE ${baseConditions.join(" AND ")}`
        : "";

    const baseInventoryResult = await pool.query(
      `
      SELECT
        b.id AS base_id,
        b.name AS base_name,
        COALESCE(SUM(a.quantity), 0) AS total_quantity
      FROM bases b
      LEFT JOIN assets a
        ON b.id = a.base_id
      ${
        equipmentTypeId
          ? `AND a.equipment_type_id = $${baseValues.length + 1}`
          : ""
      }
      ${baseFilter}
      GROUP BY b.id, b.name
      ORDER BY b.id
      `,
      equipmentTypeId
        ? [
            ...baseValues,
            equipmentTypeId
          ]
        : baseValues
    );

    // -----------------------------------
    // Response
    // -----------------------------------

    res.json({
      filters: {
        base_id: selectedBaseId,
        equipment_type_id: equipmentTypeId,
        from: from || null,
        to: to || null
      },

      summary: {
        opening_balance: openingBalance,
        net_movement: netMovement,
        closing_balance: closingBalance,

        total_purchased: purchases,

        transfers_in: transfersIn,
        transfers_out: transfersOut,

        total_assigned: assigned,
        total_expended: expended,

        total_assets: closingBalance,
        total_transferred: transfersOut
      },

      base_inventory: baseInventoryResult.rows
    });

  } catch (error) {
    console.error(
      "Dashboard error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to load dashboard"
    });
  }
};