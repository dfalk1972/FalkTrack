const usersModel = require("../models/usersModel");

async function requireProfile(req, res, next) {
  //get user profile with their id from users table
  try {
    const profile = await usersModel.getProfile({ id: req.user.id });

    //if profile is not active error
    if (profile.status !== "active") {
      return res.status(403).json({ error: "Account pending approval" });
    }

    //attach the profile to the request and continue
    req.profile = profile;
    next();
  } catch (error) {
    //catch any other errors
    return res.status(403).json({ error: "User not approved" });
  }
}

module.exports = requireProfile;
