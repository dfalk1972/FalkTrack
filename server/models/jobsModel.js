const supabase = require("../config/supabaseClient");

async function getAllForCompany(company_id) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("company_id", company_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

async function create({ company_id, title, description }) {
  const { data, error } = await supabase
    .from("jobs")
    .insert({ company_id, title, description })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Scoped lookup - only returns the job if it belongs to this company.
// This IS the security boundary for jobs, since RLS doesn't apply to
// anything Express queries (see requireProfile.js). Every job lookup
// anywhere in this app should go through this function, never a plain
// "select by id" with no company_id filter.
async function getById({ id, company_id }) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("company_id", company_id)
    .single();

  if (error) throw error;
  return data;
}

async function updateStatus({ id, company_id, status }) {
  const { data, error } = await supabase
    .from("jobs")
    .update({ status })
    .eq("id", id)
    .eq("company_id", company_id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function complete({ id, company_id, total_minutes }) {
  const { data, error } = await supabase
    .from("jobs")
    .update({
      status: "completed",
      total_minutes,
      completed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("company_id", company_id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = { getAllForCompany, create, getById, updateStatus, complete };
