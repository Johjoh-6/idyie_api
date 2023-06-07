const getUserFromToken = require("../utils/getUserFromToken");

const checkSelfOrAdmin = () => {
	return async (request, reply) => {
		const token = request.headers.authorization;
		const { isAuthenticated, role, id } = getUserFromToken(token);

		if (!isAuthenticated) {
			return reply.code(401).send({ error: "Unauthorized" });
		}

		if (!(id === request.params.id || role === "ADMIN")) {
			return reply.code(403).send({ error: "Permission denied" });
		}
	};
};

module.exports = checkSelfOrAdmin;
