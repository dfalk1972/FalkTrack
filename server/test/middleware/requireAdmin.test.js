const { expect } = require("chai");
const sinon = require("sinon");
const requireAdmin = require("../../middleware/requireAdmin");

// requireAdmin has no dependencies of its own (it just reads
// req.profile.role, which requireProfile is what sets earlier in the
// chain) - so no proxyquire/fakes needed here, just fake req/res/next.
function makeMockReqRes(profile) {
  const req = { profile };
  const res = {
    status: sinon.stub().returnsThis(),
    json: sinon.stub().returnsThis(),
  };
  const next = sinon.stub();
  return { req, res, next };
}

describe("requireAdmin", () => {
  it("calls next() and does not touch res when the caller is an admin", () => {
    const { req, res, next } = makeMockReqRes({ role: "admin" });

    requireAdmin(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(res.status.called).to.be.false;
  });

  it("responds 403 and does NOT call next() when the caller is a worker", () => {
    const { req, res, next } = makeMockReqRes({ role: "worker" });

    requireAdmin(req, res, next);

    expect(next.called).to.be.false;
    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWith({ error: "Admin access required" })).to.be.true;
  });
});
