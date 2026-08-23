const supabase = require("../config/supabaseClient");

// Public list - no auth required, since this feeds the Signup page's
// company dropdown for people who don't have an account yet. Only
// exposes id/name, nothing sensitive.
async function getAllCompanies() {
  const { data, error } = await supabase
    .from("companies")
    .select("id, name")
    .order("name");

  if (error) {
    throw error;
  }

  return data;
}

module.exports = { getAllCompanies };
