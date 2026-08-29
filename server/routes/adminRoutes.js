const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const requireProfile = require("../middleware/requireProfile");
const requireAdmin = require("../middleware/requireAdmin");
const adminController = require("../controllers/adminController");

// Order matters - requireAdmin reads
// req.profile.role, which requireProfile is what sets, so it has to run
// after it.
router.use(requireAuth, requireProfile, requireAdmin);

router.get("/pending-users", adminController.listPendingUsers);
router.post("/users/:id/approve", adminController.approveUser);
router.post("/users/:id/reject", adminController.rejectUser);
router.get("/time-logs", adminController.listTimeLogs);

module.exports = router;
