require("dotenv").config();
const cors = require("cors");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const companiesRoutes = require("./routes/companiesRoutes");
const jobsRoutes = require("./routes/jobsRoutes");
const assetsRoutes = require("./routes/assetsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const requireAuth = require("./middleware/authMiddleware");
const requireProfile = require("./middleware/requireProfile");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/assets", assetsRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("FalkTrack API running");
});

//runs the Middleware authMiddleware and returns the user if they are authorized. Then runs the requireProfile and returns the profile if they are active
app.get("/api/me", requireAuth, requireProfile, (req, res) => {
  res.json({ user: req.user, profile: req.profile });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
