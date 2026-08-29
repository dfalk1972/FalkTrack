const supabase = require("../config/supabaseClient");

async function getForAsset(asset_id) {
  const { data, error } = await supabase
    .from("maintenance_records")
    .select("*")
    .eq("asset_id", asset_id)
    .order("performed_at", { ascending: false });

  if (error) throw error;
  return data;
}

// photo_url intentionally never set here - deferred the column is nullable so this is a complete,
// working feature without it.
async function create({
  asset_id,
  performed_by,
  maintenance_type,
  notes,
  cost,
  next_due_date,
}) {
  const { data, error } = await supabase
    .from("maintenance_records")
    .insert({
      asset_id,
      performed_by,
      maintenance_type,
      notes,
      cost,
      next_due_date,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = { getForAsset, create };
