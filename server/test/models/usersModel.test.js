const { expect } = require("chai");
const proxyquire = require("proxyquire");
const { makeFakeSupabase } = require("../helpers/fakeSupabase");

function loadUsersModel(fakeSupabase) {
  return proxyquire("../../models/usersModel", {
    "../config/supabaseClient": fakeSupabase,
  });
}

describe("usersModel", () => {
  describe("getProfile", () => {
    it("returns the profile row for the given id", async () => {
      const fakeSupabase = makeFakeSupabase({
        data: { company_id: "co-1", role: "admin", status: "active" },
        error: null,
      });
      const usersModel = loadUsersModel(fakeSupabase);

      const profile = await usersModel.getProfile({ id: "user-1" });

      expect(profile).to.deep.equal({
        company_id: "co-1",
        role: "admin",
        status: "active",
      });
      expect(fakeSupabase.calls[0]).to.deep.equal({
        method: "from",
        args: ["users"],
      });
    });

    it("throws when Supabase returns an error", async () => {
      const fakeSupabase = makeFakeSupabase({
        data: null,
        error: new Error("row not found"),
      });
      const usersModel = loadUsersModel(fakeSupabase);

      try {
        await usersModel.getProfile({ id: "missing-user" });
        expect.fail("expected getProfile to throw");
      } catch (err) {
        expect(err.message).to.equal("row not found");
      }
    });
  });

  describe("updateStatus", () => {
    it("scopes the update by BOTH id and company_id", async () => {
      // This is the actual multi-tenancy security boundary the whole
      // app relies on - an admin approving/
      // rejecting a user must only ever be able to touch a user in
      // their OWN company. If this ever regresses to filtering by id
      // alone, this test should fail.
      const fakeSupabase = makeFakeSupabase({
        data: { id: "user-2", status: "active" },
        error: null,
      });
      const usersModel = loadUsersModel(fakeSupabase);

      await usersModel.updateStatus({
        id: "user-2",
        company_id: "co-1",
        status: "active",
      });

      const eqCalls = fakeSupabase.calls.filter((call) => call.method === "eq");
      expect(eqCalls).to.deep.include({ method: "eq", args: ["id", "user-2"] });
      expect(eqCalls).to.deep.include({
        method: "eq",
        args: ["company_id", "co-1"],
      });
    });
  });
});
