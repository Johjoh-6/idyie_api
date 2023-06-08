const UsersController = require("../controllers/usersController");
const getUserFromToken = require("../utils/getUserFromToken");

const requireRole = (requiredRoles, client ) => {
	return async (request, reply) => {
	  const rawToken = request.headers.authorization;
	  const { isAuthenticated, role, id, token } = getUserFromToken(rawToken);
  
	  const tokenInDB = await client.query("SELECT * FROM jwt_tokens WHERE token = $1", [token]);
	  if (tokenInDB.rowCount === 0) {
		return reply.code(401).send({ error: "Unauthorized" });
	  }
	  if(tokenInDB.rows[0].expires_at < Date.now()){
		return reply.code(401).send({ error: "Token expired" });
	  }
	  if (!isAuthenticated) {
		return reply.code(401).send({ error: "Unauthorized" });
	  }
  
	  const usersController = new UsersController(client);
	  const user = await usersController.getUser(id);
  
	  if (!user || !requiredRoles.includes(role) || user.role !== role) {
		return reply.code(403).send({ error: "Permission denied" });
	  }
	  if(user.role === "ADMIN"){
		request.isAdmin = true;
	  } else {
		request.isAdmin = false;
	  }
	  request.userId = id;
	};
  };
  
  module.exports = requireRole;
  