const { expect } = require("chai");
const proxyquire = require("proxyquire");
const { makeFakeSupabase } = require("../helpers/fakeSupabase");

function loadJobsModel(fakeSupabase) {
  return proxyquire("../../models/jobsModel", {
    "../config/supabaseClient": fakeSupabase,
  });
}

describe("jobsModel", () => {
  describe("getById", () => {
    it("filters by both id and company_id - the security boundary for job lookups", async () => {
      const fakeSupabase = makeFakeSupabase({
        data: { id: "job-1", company_id: "co-1", title: "Mow lawn" },
        error: null,
      });
      const jobsModel = loadJobsModel(fakeSupabase);

      const job = await jobsModel.getById({ id: "job-1", company_id: "co-1" });

      expect(job.title).to.equal("Mow lawn");
      const eqCalls = fakeSupabase.calls.filter((call) => call.method === "eq");
      expect(eqCalls).to.deep.include({ method: "eq", args: ["id", "job-1"] });
      expect(eqCalls).to.deep.include({
        method: "eq",
        args: ["company_id", "co-1"],
      });
    });

    it("throws when no row matches (e.g. the job belongs to a different company)", async () => {
      const fakeSupabase = makeFakeSupabase({
        data: null,
        error: new Error("no rows"),
      });
      const jobsModel = loadJobsModel(fakeSupabase);

      try {
        await jobsModel.getById({ id: "job-1", company_id: "wrong-co" });
        expect.fail("expected getById to throw");
      } catch (err) {
        expect(err.message).to.equal("no rows");
      }
    });
  });

  describe("create", () => {
    it("inserts a job under the given company", async () => {
      const fakeSupabase = makeFakeSupabase({
        data: { id: "job-2", company_id: "co-1", title: "Fix fence" },
        error: null,
      });
      const jobsModel = loadJobsModel(fakeSupabase);

      const job = await jobsModel.create({
        company_id: "co-1",
        title: "Fix fence",
        description: "Back yard, east side",
      });

      expect(job.id).to.equal("job-2");
      expect(fakeSupabase.calls[0]).to.deep.equal({
        method: "from",
        args: ["jobs"],
      });
      expect(fakeSupabase.calls[1].method).to.equal("insert");
      expect(fakeSupabase.calls[1].args[0]).to.deep.equal({
        company_id: "co-1",
        title: "Fix fence",
        description: "Back yard, east side",
      });
    });
  });
});
