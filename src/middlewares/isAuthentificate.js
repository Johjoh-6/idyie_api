const getUserFromToken = require("../utils/getUserFromToken");

const isAuthenticated = (client) => {
	return async (request, reply) => {
		const rawToken = request.headers.authorization;
		const { authenticated, role, id, token } = getUserFromToken(rawToken);

		const tokenInDB = await client.query("SELECT * FROM jwt_tokens WHERE token = $1", [token]);
		if (tokenInDB.rowCount === 0) {
			return reply.code(401).send({ error: "Unauthorized" });
		}
		if (tokenInDB.rows[0].expires_at < Date.now()) {
			return reply.code(401).send({ error: "Token expired" });
		}
		if (!authenticated) {
			return reply.code(401).send({ error: "Unauthorized" });
		}
		request.roleUser = role;
		request.userId = id;
	};
};

module.exports = isAuthenticated;
