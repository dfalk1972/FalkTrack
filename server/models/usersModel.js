const supabase = require("../config/supabaseClient");

async function createProfile({ id, company_id, full_name, email }) {
  const { data, error } = await supabase
    .from("users")
    .insert({ id, company_id, full_name, email })
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
}

async function getProfile({ id }) {
  const { data, error } = await supabase
    .from("users")
    .select("company_id, role, status ")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

module.exports = { createProfile, getProfile };
