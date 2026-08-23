const assetsModel = require("../models/assetsModel");
const maintenanceModel = require("../models/maintenanceModel");

async function listAssets(req, res) {
  try {
    const assets = await assetsModel.getAllForCompany(req.profile.company_id);
    return res.status(200).json({ assets });
  } catch (err) {
    return res.status(500).json({ error: "Could not load assets" });
  }
}

async function createAsset(req, res) {
  const { name, asset_number, category, make, model, year } = req.body;

  if (!name || !asset_number || !category || !make || !model || !year) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const asset = await assetsModel.create({
      company_id: req.profile.company_id,
      name,
      asset_number,
      category,
      make,
      model,
      year,
    });
    return res.status(201).json({ asset });
  } catch (err) {
    // Postgres unique_violation - asset_number already used by this
    // company (the UNIQUE(company_id, asset_number) constraint from
    // 01_schema.sql). Give a specific, useful message for this one
    // predictable case instead of a generic 500.
    if (err.code === "23505") {
      return res
        .status(400)
        .json({ error: "An asset with that asset number already exists" });
    }
    return res.status(500).json({ error: "Could not create asset" });
  }
}

async function getAsset(req, res) {
  try {
    const asset = await assetsModel.getById({
      id: req.params.id,
      company_id: req.profile.company_id,
    });

    const maintenanceRecords = await maintenanceModel.getForAsset(asset.id);

    return res.status(200).json({ asset, maintenanceRecords });
  } catch (err) {
    return res.status(404).json({ error: "Asset not found" });
  }
}

async function addMaintenanceRecord(req, res) {
  const { maintenance_type, notes, cost, next_due_date } = req.body;

  if (!maintenance_type || cost === undefined || cost === null || cost === "") {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Confirm the asset actually belongs to this company before
    // attaching a record to it - same reasoning as jobs.
    const asset = await assetsModel.getById({
      id: req.params.id,
      company_id: req.profile.company_id,
    });

    const record = await maintenanceModel.create({
      asset_id: asset.id,
      performed_by: req.user.id,
      maintenance_type,
      notes: notes || null,
      cost,
      next_due_date: next_due_date || null,
    });

    return res.status(201).json({ maintenanceRecord: record });
  } catch (err) {
    return res.status(404).json({ error: "Asset not found" });
  }
}

module.exports = { listAssets, createAsset, getAsset, addMaintenanceRecord };
