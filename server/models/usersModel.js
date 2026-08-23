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

module.exports = { createProfile };
