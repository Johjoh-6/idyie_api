const UsersController = require("../controllers/usersController");
const isAuthenticated = require("./isAuthentificate");

const requireRole = (requiredRoles, client) => {
	return async (request, reply) => {
		await isAuthenticated(client)(request, reply);
		const { roleUser, userId } = request;

		const usersController = new UsersController(client);
		const user = await usersController.getUser(userId);

		if (!user || !requiredRoles.includes(roleUser) || user.role !== roleUser) {
			return reply.code(403).send({ error: "Permission denied" });
		}
		request.isAdmin = user.role === "ADMIN";
		request.isModerator = user.role === "MODERATOR";
		request.isBan = user.ban === true;
	};
};

module.exports = requireRole;
