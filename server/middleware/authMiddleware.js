const supabase = require("../config/supabaseClient");

async function requireAuth(req, res, next) {
  //reads incoming header
  const authHeader = req.headers.authorization;

  //if it does not start with Bearer or no header at all it errors.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided." });
  }

  //breaks it up and grabs just the token - splits on the space after Bearer.
  const token = authHeader.split(" ")[1];

  //checks if this token belongs to a valid session and returns data or error
  const { data, error } = await supabase.auth.getUser(token);

  //if error or no user
  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = data.user;

  //if all is good it moves on with next
  next();
}

module.exports = requireAuth;
