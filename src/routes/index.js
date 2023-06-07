module.exports = async function (fastify) {
	fastify.register(require("./users"));
	fastify.register(require("./auth"));
	fastify.register(require("./categorie"));
	fastify.register(require("./tutorial"));
	// Add other route files here as needed
};
