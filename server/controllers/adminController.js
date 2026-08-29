const usersModel = require("../models/usersModel");
const timeEntriesModel = require("../models/timeEntriesModel");

async function listPendingUsers(req, res) {
  try {
    const pendingUsers = await usersModel.getPendingForCompany(
      req.profile.company_id
    );
    return res.status(200).json({ pendingUsers });
  } catch (err) {
    return res.status(500).json({ error: "Could not load pending users" });
  }
}

async function approveUser(req, res) {
  try {
    const user = await usersModel.updateStatus({
      id: req.params.id,
      company_id: req.profile.company_id,
      status: "active",
    });
    return res.status(200).json({ user });
  } catch (err) {
    // updateStatus throws if no row matched this id + company_id - same
    // "don't reveal whether it exists for someone else" reasoning as jobs.
    return res.status(404).json({ error: "User not found" });
  }
}

async function rejectUser(req, res) {
  try {
    const user = await usersModel.updateStatus({
      id: req.params.id,
      company_id: req.profile.company_id,
      status: "rejected",
    });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(404).json({ error: "User not found" });
  }
}

async function listTimeLogs(req, res) {
  try {
    const rawEntries = await timeEntriesModel.getAllForCompany(
      req.profile.company_id
    );

    // Flatten the joined jobs/users objects into a simple shape the
    // frontend table can render directly, instead of reaching into
    // nested fields itself.
    const timeLogs = rawEntries.map((entry) => ({
      id: entry.id,
      job_title: entry.jobs.title,
      worker_name: entry.users.full_name,
      clock_in: entry.clock_in,
      clock_out: entry.clock_out,
      duration_minutes: entry.duration_minutes,
    }));

    return res.status(200).json({ timeLogs });
  } catch (err) {
    return res.status(500).json({ error: "Could not load time logs" });
  }
}

module.exports = { listPendingUsers, approveUser, rejectUser, listTimeLogs };
