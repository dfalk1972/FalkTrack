// Must run AFTER requireAuth + requireProfile - it reads req.profile.role,
// which requireProfile is what attaches. Blocks anyone whose role isn't
// "admin" from every route on the router that uses this.
function requireAdmin(req, res, next) {
  if (req.profile.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
}

module.exports = requireAdmin;
