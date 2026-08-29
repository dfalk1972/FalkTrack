const supabase = require("../config/supabaseClient");
const usersModel = require("../models/usersModel");

async function signup(req, res) {
  const { company_id, full_name, email, password } = req.body;

  if (!company_id || !full_name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
  if (authError) {
    return res.status(400).json({ error: authError.message });
  }
  try {
    const profile = await usersModel.createProfile({
      id: authData.user.id,
      company_id,
      full_name,
      email,
    });
    return res.status(201).json({ user: profile });
  } catch (profileError) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    return res.status(500).json({ error: "Signup failed, please try again" });
  }
}

module.exports = { signup };
