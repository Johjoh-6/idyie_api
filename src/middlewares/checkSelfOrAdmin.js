const getUserFromToken = require("../utils/getUserFromToken");

const checkSelfOrAdmin = () => {
	return async (request, reply, done) => {
		const token = request.headers.authorization;
		const { isAuthenticated, role, id } = getUserFromToken(token);

		if (!isAuthenticated) {
			reply.code(401).send({ error: "Unauthorized" });
			return;
		}

		if (!(id === request.params.id || role === "ADMIN")) {
			reply.code(403).send({ error: "Permission denied" });
			return;
		}

		done();
	};
};

module.exports = checkSelfOrAdmin;
