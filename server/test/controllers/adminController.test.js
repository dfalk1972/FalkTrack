const express = require("express");
const request = require("supertest");
const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

function loadAdminController({ usersModel = {}, timeEntriesModel = {} } = {}) {
  return proxyquire("../../controllers/adminController", {
    // @noCallThru - see jobsController.test.js for why this matters.
    "../models/usersModel": { ...usersModel, "@noCallThru": true },
    "../models/timeEntriesModel": { ...timeEntriesModel, "@noCallThru": true },
  });
}

// Stands in for requireAuth + requireProfile + requireAdmin having
// already run - an active admin in company co-1. Those three middlewares
// have their own tests; this file is only about adminController's logic.
function buildTestApp(adminController) {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.user = { id: "admin-1" };
    req.profile = { company_id: "co-1", role: "admin", status: "active" };
    next();
  });
  app.post("/users/:id/approve", adminController.approveUser);
  app.post("/users/:id/reject", adminController.rejectUser);
  app.get("/time-logs", adminController.listTimeLogs);
  return app;
}

describe("adminController", () => {
  describe("POST /users/:id/approve", () => {
    it("approves the user and returns the updated row", async () => {
      const updateStatusStub = sinon
        .stub()
        .resolves({ id: "worker-1", status: "active" });
      const adminController = loadAdminController({
        usersModel: { updateStatus: updateStatusStub },
      });
      const app = buildTestApp(adminController);

      const res = await request(app).post("/users/worker-1/approve");

      expect(res.status).to.equal(200);
      expect(res.body.user.status).to.equal("active");
      // The controller must pass the ADMIN's own company_id, not
      // anything from the request - that's what stops an admin from
      // approving a user outside their company.
      expect(
        updateStatusStub.calledWith({
          id: "worker-1",
          company_id: "co-1",
          status: "active",
        })
      ).to.be.true;
    });

    it("responds 404 when the user id doesn't belong to this admin's company", async () => {
      const adminController = loadAdminController({
        usersModel: { updateStatus: sinon.stub().rejects(new Error("no rows")) },
      });
      const app = buildTestApp(adminController);

      const res = await request(app).post("/users/someone-elses-user/approve");

      expect(res.status).to.equal(404);
    });
  });

  describe("POST /users/:id/reject", () => {
    it("rejects the user with status 'rejected', not a delete", async () => {
      const updateStatusStub = sinon
        .stub()
        .resolves({ id: "worker-2", status: "rejected" });
      const adminController = loadAdminController({
        usersModel: { updateStatus: updateStatusStub },
      });
      const app = buildTestApp(adminController);

      const res = await request(app).post("/users/worker-2/reject");

      expect(res.status).to.equal(200);
      expect(
        updateStatusStub.calledWith({
          id: "worker-2",
          company_id: "co-1",
          status: "rejected",
        })
      ).to.be.true;
    });
  });

  describe("GET /time-logs", () => {
    it("flattens the joined job/worker data for the frontend table", async () => {
      const adminController = loadAdminController({
        timeEntriesModel: {
          getAllForCompany: sinon.stub().resolves([
            {
              id: "entry-1",
              clock_in: "2026-08-23T10:00:00.000Z",
              clock_out: "2026-08-23T11:30:00.000Z",
              duration_minutes: 90,
              jobs: { id: "job-1", title: "Mow lawn", company_id: "co-1" },
              users: { id: "user-1", full_name: "Test Worker" },
            },
          ]),
        },
      });
      const app = buildTestApp(adminController);

      const res = await request(app).get("/time-logs");

      expect(res.status).to.equal(200);
      expect(res.body.timeLogs).to.deep.equal([
        {
          id: "entry-1",
          job_title: "Mow lawn",
          worker_name: "Test Worker",
          clock_in: "2026-08-23T10:00:00.000Z",
          clock_out: "2026-08-23T11:30:00.000Z",
          duration_minutes: 90,
        },
      ]);
    });
  });
});
