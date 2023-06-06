const usersController = require("../controllers/usersController");
const getUserFromToken = require("../utils/getUserFromToken");

const requireRole = async (requiredRoles) => {
	return async (request, reply, done) => {
		const token = request.headers.authorization;
		const { isAuthenticated, role } = getUserFromToken(token);

		if (!isAuthenticated) {
			reply.code(401).send({ error: "Unauthorized" });
			return;
		}

		const user = await usersController.getUserById(request.user.id);

		if (!user || !requiredRoles.includes(role)) {
			reply.code(403).send({ error: "Permission denied" });
			return;
		}

		done();
	};
};

module.exports = requireRole;
