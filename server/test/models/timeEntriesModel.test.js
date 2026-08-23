const { expect } = require("chai");
const proxyquire = require("proxyquire");
const { makeFakeSupabase } = require("../helpers/fakeSupabase");

function loadTimeEntriesModel(fakeSupabase) {
  return proxyquire("../../models/timeEntriesModel", {
    "../config/supabaseClient": fakeSupabase,
  });
}

describe("timeEntriesModel", () => {
  describe("sumDurationsForJob", () => {
    // This is the actual "hour aggregation" rubric feature - worth
    // testing the math directly, not just that a query got sent.
    it("adds up duration_minutes across every completed entry", async () => {
      const fakeSupabase = makeFakeSupabase({
        data: [{ duration_minutes: 30 }, { duration_minutes: 90 }, { duration_minutes: 15 }],
        error: null,
      });
      const timeEntriesModel = loadTimeEntriesModel(fakeSupabase);

      const total = await timeEntriesModel.sumDurationsForJob("job-1");

      expect(total).to.equal(135);
    });

    it("returns 0 when a job has no completed entries yet", async () => {
      const fakeSupabase = makeFakeSupabase({ data: [], error: null });
      const timeEntriesModel = loadTimeEntriesModel(fakeSupabase);

      const total = await timeEntriesModel.sumDurationsForJob("job-2");

      expect(total).to.equal(0);
    });
  });

  describe("getOpenEntry", () => {
    it("returns null (not an error) when nobody has an open timer", async () => {
      // maybeSingle() is used here specifically because "no open entry"
      // is a normal outcome, not an error case - this test locks that
      // behavior in.
      const fakeSupabase = makeFakeSupabase({ data: null, error: null });
      const timeEntriesModel = loadTimeEntriesModel(fakeSupabase);

      const entry = await timeEntriesModel.getOpenEntry({
        user_id: "user-1",
        job_id: "job-1",
      });

      expect(entry).to.equal(null);
    });
  });
});
