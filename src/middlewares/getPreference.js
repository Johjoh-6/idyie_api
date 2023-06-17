fastify.addHook('preHandler', (request, reply, done) => {
    const preference = request.cookies.preference;
    request.userPreference = preference;
    done();
  });
  