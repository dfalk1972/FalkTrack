const supabase = require("../config/supabaseClient");

async function getAllForCompany(company_id) {
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("company_id", company_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

async function create({
  company_id,
  name,
  asset_number,
  category,
  make,
  model,
  year,
}) {
  const { data, error } = await supabase
    .from("assets")
    .insert({ company_id, name, asset_number, category, make, model, year })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Same scoped-lookup pattern as jobsModel.getById - the company_id
// filter here is the real security boundary, not RLS.
async function getById({ id, company_id }) {
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("id", id)
    .eq("company_id", company_id)
    .single();

  if (error) throw error;
  return data;
}

module.exports = { getAllForCompany, create, getById };
