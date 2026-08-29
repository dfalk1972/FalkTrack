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

    then(resolve, reject) {
      return Promise.resolve({ data, error }).then(resolve, reject);
    },
  };

  builder.calls = calls;

  builder["@noCallThru"] = true;

  return builder;
}

module.exports = { makeFakeSupabase };
