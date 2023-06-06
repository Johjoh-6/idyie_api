module.exports = async function (fastify) {
	fastify.register(require("./users"));
	fastify.register(require("./auth"));
	// Add other route files here as needed
};
