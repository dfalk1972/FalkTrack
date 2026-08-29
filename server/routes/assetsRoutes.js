const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const requireProfile = require("../middleware/requireProfile");
const assetsController = require("../controllers/assetsController");

router.use(requireAuth, requireProfile);

router.get("/", assetsController.listAssets);
router.post("/", assetsController.createAsset);
router.get("/:id", assetsController.getAsset);
router.post("/:id/maintenance", assetsController.addMaintenanceRecord);

module.exports = router;
