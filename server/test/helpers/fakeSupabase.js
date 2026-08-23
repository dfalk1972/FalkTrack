// A minimal stand-in for the supabase-js query builder that every model
// in this app uses. The real thing is "thenable": every chained method
// (.select(), .eq(), .order(), etc.) returns the SAME builder object,
// and awaiting the builder directly - or calling a terminal method like
// .single()/.maybeSingle() - is what actually produces { data, error }.
//
// This fake does the same thing, just returning whatever { data, error }
// you hand it up front, instead of making a real network call. That lets
// the model tests check "did this function ask the database for the
// right thing" (which table, which filters) without needing a live
// Supabase project or real credentials just to run `npm test`.
//
// It also records every call in `calls`, in order, so a test can assert
// on the exact query that got built - which matters here specifically
// because company_id filtering IS the security boundary for this app
// (see requireProfile.js / build-state notes) and that's worth testing
// directly, not just trusting it's there.
function makeFakeSupabase({ data = null, error = null } = {}) {
  const calls = [];

  function record(method, args) {
    calls.push({ method, args });
    return builder;
  }

  const builder = {
    from: (...args) => record("from", args),
    select: (...args) => record("select", args),
    insert: (...args) => record("insert", args),
    update: (...args) => record("update", args),
    eq: (...args) => record("eq", args),
    order: (...args) => record("order", args),
    is: (...args) => record("is", args),
    not: (...args) => record("not", args),
    single() {
      calls.push({ method: "single", args: [] });
      return Promise.resolve({ data, error });
    },
    maybeSingle() {
      calls.push({ method: "maybeSingle", args: [] });
      return Promise.resolve({ data, error });
    },
    // Covers calls like jobsModel.getAllForCompany, which chain
    // .eq()/.order() and then just `await` the builder directly, with
    // no terminal .single()/.maybeSingle() call.
    then(resolve, reject) {
      return Promise.resolve({ data, error }).then(resolve, reject);
    },
  };

  builder.calls = calls;

  // Tells proxyquire to use ONLY this fake and never fall back to the
  // real config/supabaseClient.js to fill in anything missing. Without
  // this, proxyquire's default "call-through" behavior still loads the
  // real module (to merge in whatever the stub didn't define), which
  // tries to build a real Supabase client and throws "supabaseUrl is
  // required" since no .env is present in the test environment.
  builder["@noCallThru"] = true;

  return builder;
}

module.exports = { makeFakeSupabase };
