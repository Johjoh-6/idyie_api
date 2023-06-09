const envToLogger = require("./utils/logger");
const env = require("dotenv").config().parsed;

const fastify = require("fastify")({
	logger: envToLogger[env.ENV] ?? true,
	pluginTimeout: 10000, // defaults to true if no entry matches in the map
});

const dbconnector = require("./db");
const route = require("./routes");
const cookiePlugin = require("@fastify/cookie");
const middie = require("@fastify/middie");

fastify.register(middie);
fastify.register(dbconnector);
fastify.register(route, { prefix: "/api" });
fastify.register(cookiePlugin, {
	secret: env.COOKIE_SECRET,
});

const start = async () => {
	try {
		await fastify.listen({ port: env.PORT });
		fastify.log.info(`server listening on ${fastify.server.address().port}`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
