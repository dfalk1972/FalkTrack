const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const requireProfile = require("../middleware/requireProfile");
const jobsController = require("../controllers/jobsController");

router.use(requireAuth, requireProfile);

router.get("/", jobsController.listJobs);
router.post("/", jobsController.createJob);
router.get("/:id", jobsController.getJob);
router.post("/:id/clock-in", jobsController.clockIn);
router.post("/:id/clock-out", jobsController.clockOut);
router.post("/:id/complete", jobsController.completeJob);

module.exports = router;
