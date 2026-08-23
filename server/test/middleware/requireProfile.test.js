const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

function loadRequireProfile(fakeUsersModel) {
  return proxyquire("../../middleware/requireProfile", {
    // @noCallThru stops proxyquire from also loading the REAL
    // usersModel (and through it, the real Supabase client) to fill in
    // anything this fake doesn't define - without it, requiring the
    // real config/supabaseClient.js throws in a test environment with
    // no .env file.
    "../models/usersModel": { ...fakeUsersModel, "@noCallThru": true },
  });
}

function makeMockReqRes() {
  const req = { user: { id: "user-1" } };
  const res = {
    status: sinon.stub().returnsThis(),
    json: sinon.stub().returnsThis(),
  };
  const next = sinon.stub();
  return { req, res, next };
}

describe("requireProfile", () => {
  it("attaches req.profile and calls next() for an active user", async () => {
    const fakeUsersModel = {
      getProfile: sinon
        .stub()
        .resolves({ company_id: "co-1", role: "worker", status: "active" }),
    };
    const requireProfile = loadRequireProfile(fakeUsersModel);
    const { req, res, next } = makeMockReqRes();

    await requireProfile(req, res, next);

    expect(req.profile).to.deep.equal({
      company_id: "co-1",
      role: "worker",
      status: "active",
    });
    expect(next.calledOnce).to.be.true;
  });

  it("responds 403 'Account pending approval' for a non-active user", async () => {
    const fakeUsersModel = {
      getProfile: sinon
        .stub()
        .resolves({ company_id: "co-1", role: "worker", status: "pending" }),
    };
    const requireProfile = loadRequireProfile(fakeUsersModel);
    const { req, res, next } = makeMockReqRes();

    await requireProfile(req, res, next);

    expect(next.called).to.be.false;
    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWith({ error: "Account pending approval" })).to.be.true;
  });

  it("responds 403 when the profile lookup itself fails", async () => {
    // e.g. a JWT for a user id that was never given a public.users row.
    const fakeUsersModel = {
      getProfile: sinon.stub().rejects(new Error("no matching row")),
    };
    const requireProfile = loadRequireProfile(fakeUsersModel);
    const { req, res, next } = makeMockReqRes();

    await requireProfile(req, res, next);

    expect(next.called).to.be.false;
    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWith({ error: "User not approved" })).to.be.true;
  });
});
