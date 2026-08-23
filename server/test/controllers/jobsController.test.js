const express = require("express");
const request = require("supertest");
const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

// Loads the REAL jobsController, with fake jobsModel/timeEntriesModel
// swapped in for whatever this particular test needs to control. This
// tests real Express request/response handling, real validation, and
// real status codes - only the database layer underneath is faked.
function loadJobsController({ jobsModel = {}, timeEntriesModel = {} } = {}) {
  return proxyquire("../../controllers/jobsController", {
    // @noCallThru: don't let proxyquire fall back to the real models
    // (and the real Supabase client behind them) for anything this
    // test didn't explicitly stub.
    "../models/jobsModel": { ...jobsModel, "@noCallThru": true },
    "../models/timeEntriesModel": { ...timeEntriesModel, "@noCallThru": true },
  });
}

// A tiny Express app standing in for "after requireAuth + requireProfile
// have already run" - it sets req.user/req.profile the same way those
// two middlewares would for a logged-in, active worker, so this file can
// test jobsController's OWN logic in isolation. requireAuth/requireProfile
// have their own dedicated tests.
function buildTestApp(jobsController) {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.user = { id: "user-1" };
    req.profile = { company_id: "co-1", role: "worker", status: "active" };
    next();
  });
  app.get("/jobs", jobsController.listJobs);
  app.post("/jobs", jobsController.createJob);
  app.get("/jobs/:id", jobsController.getJob);
  return app;
}

describe("jobsController", () => {
  describe("POST /jobs", () => {
    it("responds 400 when description is missing", async () => {
      const jobsController = loadJobsController();
      const app = buildTestApp(jobsController);

      const res = await request(app).post("/jobs").send({ title: "Mow lawn" });

      expect(res.status).to.equal(400);
      expect(res.body.error).to.exist;
    });

    it("creates the job scoped to the caller's company and returns 201", async () => {
      const createStub = sinon
        .stub()
        .resolves({ id: "job-1", title: "Mow lawn", company_id: "co-1" });
      const jobsController = loadJobsController({
        jobsModel: { create: createStub },
      });
      const app = buildTestApp(jobsController);

      const res = await request(app)
        .post("/jobs")
        .send({ title: "Mow lawn", description: "Front and back" });

      expect(res.status).to.equal(201);
      expect(res.body.job.id).to.equal("job-1");
      // The important part: company_id came from req.profile, not from
      // anything the client sent in the body.
      expect(
        createStub.calledWith({
          company_id: "co-1",
          title: "Mow lawn",
          description: "Front and back",
        })
      ).to.be.true;
    });
  });

  describe("GET /jobs/:id", () => {
    it("responds 404 when the job isn't found for this company", async () => {
      // Covers both "bad id" and "real id, but belongs to a different
      // company" - jobsModel.getById throws for both, on purpose (see
      // its own comments), and the controller should turn that into a
      // generic 404 either way rather than leaking which case it was.
      const jobsController = loadJobsController({
        jobsModel: { getById: sinon.stub().rejects(new Error("no rows")) },
      });
      const app = buildTestApp(jobsController);

      const res = await request(app).get("/jobs/does-not-exist");

      expect(res.status).to.equal(404);
    });

    it("returns the job plus the caller's own open timer, if any", async () => {
      const jobsController = loadJobsController({
        jobsModel: {
          getById: sinon.stub().resolves({ id: "job-1", title: "Mow lawn" }),
        },
        timeEntriesModel: {
          getOpenEntry: sinon.stub().resolves({ id: "entry-1", job_id: "job-1" }),
        },
      });
      const app = buildTestApp(jobsController);

      const res = await request(app).get("/jobs/job-1");

      expect(res.status).to.equal(200);
      expect(res.body.job.id).to.equal("job-1");
      expect(res.body.myOpenEntry.id).to.equal("entry-1");
    });
  });
});
