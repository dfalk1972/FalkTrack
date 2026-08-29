const jobsModel = require("../models/jobsModel");
const timeEntriesModel = require("../models/timeEntriesModel");

async function listJobs(req, res) {
  try {
    const jobs = await jobsModel.getAllForCompany(req.profile.company_id);
    return res.status(200).json({ jobs });
  } catch (err) {
    return res.status(500).json({ error: "Could not load jobs" });
  }
}

async function createJob(req, res) {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const job = await jobsModel.create({
      company_id: req.profile.company_id,
      title,
      description,
    });
    return res.status(201).json({ job });
  } catch (err) {
    return res.status(500).json({ error: "Could not create job" });
  }
}

async function getJob(req, res) {
  try {
    const job = await jobsModel.getById({
      id: req.params.id,
      company_id: req.profile.company_id,
    });

    // Also tell the frontend whether THIS user currently has a timer
    // running on this job, so it knows whether to show "Clock In" or
    // "Clock Out".
    const myOpenEntry = await timeEntriesModel.getOpenEntry({
      user_id: req.user.id,
      job_id: job.id,
    });

    return res.status(200).json({ job, myOpenEntry });
  } catch (err) {
    // getById throws if no row matched - either a bad id, or a real job id that belongs to a DIFFERENT company. Either
    // way, respond 404, not a more specific error - don't reveal whether
    // the job exists for someone else.
    return res.status(404).json({ error: "Job not found" });
  }
}

async function clockIn(req, res) {
  try {
    const job = await jobsModel.getById({
      id: req.params.id,
      company_id: req.profile.company_id,
    });

    const existingOpen = await timeEntriesModel.getOpenEntry({
      user_id: req.user.id,
      job_id: job.id,
    });

    if (existingOpen) {
      return res.status(400).json({ error: "Already clocked in on this job" });
    }

    const entry = await timeEntriesModel.clockIn({
      user_id: req.user.id,
      job_id: job.id,
    });

    // First clock-in on a brand new job flips it out of "created".
    if (job.status === "created") {
      await jobsModel.updateStatus({
        id: job.id,
        company_id: req.profile.company_id,
        status: "in process",
      });
    }

    return res.status(201).json({ timeEntry: entry });
  } catch (err) {
    return res.status(404).json({ error: "Job not found" });
  }
}

async function clockOut(req, res) {
  try {
    const job = await jobsModel.getById({
      id: req.params.id,
      company_id: req.profile.company_id,
    });

    const openEntry = await timeEntriesModel.getOpenEntry({
      user_id: req.user.id,
      job_id: job.id,
    });

    if (!openEntry) {
      return res
        .status(400)
        .json({ error: "Not currently clocked in on this job" });
    }

    const clockOutTime = new Date();
    const clockInTime = new Date(openEntry.clock_in);
    const durationMinutes = Math.round((clockOutTime - clockInTime) / 60000);

    const updatedEntry = await timeEntriesModel.clockOut({
      id: openEntry.id,
      clock_out: clockOutTime.toISOString(),
      duration_minutes: durationMinutes,
    });

    return res.status(200).json({ timeEntry: updatedEntry });
  } catch (err) {
    return res.status(404).json({ error: "Job not found" });
  }
}

async function completeJob(req, res) {
  try {
    const job = await jobsModel.getById({
      id: req.params.id,
      company_id: req.profile.company_id,
    });

    // Safety check across EVERY worker on this job, not just the
    // current user - aggregation has to wait until every timer on the
    // job is actually closed out.
    const openEntries = await timeEntriesModel.getOpenEntriesForJob(job.id);

    if (openEntries.length > 0) {
      return res.status(400).json({
        error: "Someone is still clocked in on this job",
      });
    }

    const totalMinutes = await timeEntriesModel.sumDurationsForJob(job.id);

    const completedJob = await jobsModel.complete({
      id: job.id,
      company_id: req.profile.company_id,
      total_minutes: totalMinutes,
    });

    return res.status(200).json({ job: completedJob });
  } catch (err) {
    return res.status(500).json({ error: "Could not complete job" });
  }
}

module.exports = {
  listJobs,
  createJob,
  getJob,
  clockIn,
  clockOut,
  completeJob,
};
