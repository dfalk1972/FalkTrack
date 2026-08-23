const supabase = require("../config/supabaseClient");

// The one OPEN entry for this specific user on this specific job, if any.
// Matches the DB's own uniqueness rule (one_open_timer_per_user_per_job)
// - a given user can only have one running timer per job at a time, but
// different users can each have their own simultaneously.
// maybeSingle() (not single()) because "no open entry" is a normal,
// expected result here, not an error.
async function getOpenEntry({ user_id, job_id }) {
  const { data, error } = await supabase
    .from("time_entries")
    .select("*")
    .eq("user_id", user_id)
    .eq("job_id", job_id)
    .is("clock_out", null)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// ALL open entries on a job, across every user - used as the safety
// check before marking a job complete. Aggregation should never run
// while someone, anyone, still has a timer running.
async function getOpenEntriesForJob(job_id) {
  const { data, error } = await supabase
    .from("time_entries")
    .select("id")
    .eq("job_id", job_id)
    .is("clock_out", null);

  if (error) throw error;
  return data;
}

async function clockIn({ user_id, job_id }) {
  const { data, error } = await supabase
    .from("time_entries")
    .insert({ user_id, job_id, clock_in: new Date().toISOString() })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function clockOut({ id, clock_out, duration_minutes }) {
  const { data, error } = await supabase
    .from("time_entries")
    .update({ clock_out, duration_minutes })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Sum of every completed (non-null duration) time entry on a job -
// this is the actual "hour aggregation" the rubric feature is named for.
async function sumDurationsForJob(job_id) {
  const { data, error } = await supabase
    .from("time_entries")
    .select("duration_minutes")
    .eq("job_id", job_id)
    .not("duration_minutes", "is", null);

  if (error) throw error;

  return data.reduce((sum, entry) => sum + entry.duration_minutes, 0);
}

// Every time entry across the WHOLE company, for the admin panel's time
// log view - not scoped to one job or one user like the functions above.
// time_entries has no company_id column of its own, so the company scope
// has to come through a join: jobs!inner(...) tells PostgREST "only
// return rows whose related job actually exists", and .eq("jobs.company_id", ...)
// filters on that joined row. This is the same company-scoping principle
// as everywhere else in this app, just expressed through a join instead
// of a plain column, because this table doesn't carry company_id directly.
async function getAllForCompany(company_id) {
  const { data, error } = await supabase
    .from("time_entries")
    .select(
      "id, clock_in, clock_out, duration_minutes, jobs!inner(id, title, company_id), users!inner(id, full_name)"
    )
    .eq("jobs.company_id", company_id)
    .order("clock_in", { ascending: false });

  if (error) throw error;
  return data;
}

module.exports = {
  getOpenEntry,
  getOpenEntriesForJob,
  clockIn,
  clockOut,
  sumDurationsForJob,
  getAllForCompany,
};
