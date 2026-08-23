const express = require("express");
const router = express.Router();
const companiesController = require("../controllers/companiesController");

// Deliberately no requireAuth here - this list has to be reachable by
// people who don't have an account yet (the Signup page).
router.get("/", companiesController.listCompanies);

module.exports = router;
