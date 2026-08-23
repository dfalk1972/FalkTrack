const express = require("express");
const request = require("supertest");
const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

function loadAuthController({ supabase, usersModel = {} } = {}) {
  return proxyquire("../../controllers/authController", {
    // @noCallThru - see jobsController.test.js for why this matters:
    // without it, proxyquire still loads the REAL supabaseClient.js
    // (which needs real env vars) to fill in anything the fake didn't
    // define.
    "../config/supabaseClient": { ...supabase, "@noCallThru": true },
    "../models/usersModel": { ...usersModel, "@noCallThru": true },
  });
}

function buildTestApp(authController) {
  const app = express();
  app.use(express.json());
  app.post("/signup", authController.signup);
  return app;
}

// A fake for the piece of the real Supabase client that authController
// actually uses: supabase.auth.admin.createUser/deleteUser. Everything
// else this app does with Supabase goes through the models (see
// fakeSupabase.js) - signup is the one place that talks to auth.admin
// directly, so it gets its own small fake here.
function makeFakeAuthAdmin({ createUserResult, deleteUserStub } = {}) {
  return {
    auth: {
      admin: {
        createUser: sinon.stub().resolves(createUserResult),
        deleteUser: deleteUserStub || sinon.stub().resolves({}),
      },
    },
  };
}

describe("authController.signup", () => {
  it("responds 400 when required fields are missing", async () => {
    const authController = loadAuthController({ supabase: makeFakeAuthAdmin() });
    const app = buildTestApp(authController);

    const res = await request(app)
      .post("/signup")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).to.equal(400);
  });

  it("creates the auth user and the profile row, and returns 201", async () => {
    const supabase = makeFakeAuthAdmin({
      createUserResult: { data: { user: { id: "auth-user-1" } }, error: null },
    });
    const createProfileStub = sinon
      .stub()
      .resolves({ id: "auth-user-1", full_name: "Test Worker", status: "pending" });
    const authController = loadAuthController({
      supabase,
      usersModel: { createProfile: createProfileStub },
    });
    const app = buildTestApp(authController);

    const res = await request(app).post("/signup").send({
      company_id: "co-1",
      full_name: "Test Worker",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).to.equal(201);
    expect(res.body.user.status).to.equal("pending");
    expect(
      createProfileStub.calledWith({
        id: "auth-user-1",
        company_id: "co-1",
        full_name: "Test Worker",
        email: "test@example.com",
      })
    ).to.be.true;
  });

  it("rolls back the auth user if creating the profile row fails", async () => {
    // This is the important behavior to lock in: signup shouldn't be
    // able to leave a "ghost" auth user with no matching profile row.
    const deleteUserStub = sinon.stub().resolves({});
    const supabase = makeFakeAuthAdmin({
      createUserResult: { data: { user: { id: "auth-user-2" } }, error: null },
      deleteUserStub,
    });
    const authController = loadAuthController({
      supabase,
      usersModel: {
        createProfile: sinon.stub().rejects(new Error("insert failed")),
      },
    });
    const app = buildTestApp(authController);

    const res = await request(app).post("/signup").send({
      company_id: "co-1",
      full_name: "Test Worker",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).to.equal(500);
    expect(deleteUserStub.calledWith("auth-user-2")).to.be.true;
  });

  it("responds 400 with Supabase's message when auth user creation itself fails", async () => {
    const supabase = makeFakeAuthAdmin({
      createUserResult: {
        data: { user: null },
        error: { message: "Email already registered" },
      },
    });
    const authController = loadAuthController({ supabase });
    const app = buildTestApp(authController);

    const res = await request(app).post("/signup").send({
      company_id: "co-1",
      full_name: "Test Worker",
      email: "taken@example.com",
      password: "password123",
    });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal("Email already registered");
  });
});
