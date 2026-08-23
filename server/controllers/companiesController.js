const companiesModel = require("../models/companiesModel");

async function listCompanies(req, res) {
  try {
    const companies = await companiesModel.getAllCompanies();
    return res.status(200).json({ companies });
  } catch (err) {
    return res.status(500).json({ error: "Could not load companies" });
  }
}

module.exports = { listCompanies };
