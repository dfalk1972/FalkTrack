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

// Everyone in this company still waiting on admin approval. Company-
// scoped, same as every other list query in this app - an admin should
// only ever see their own company's pending workers.
async function getPendingForCompany(company_id) {
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, email, role, status, created_at")
    .eq("company_id", company_id)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

// Company-scoped status update - this IS the security boundary here,
// same pattern as jobsModel.updateStatus. Without the company_id filter
// an admin could approve/reject a user in a DIFFERENT company just by
// guessing a user id. If the id/company_id pair doesn't match a row,
// .single() throws and the controller turns that into a 404.
async function updateStatus({ id, company_id, status }) {
  const { data, error } = await supabase
    .from("users")
    .update({ status })
    .eq("id", id)
    .eq("company_id", company_id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  createProfile,
  getProfile,
  getPendingForCompany,
  updateStatus,
};
