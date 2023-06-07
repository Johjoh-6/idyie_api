const UsersController = require("../controllers/usersController");
const requireRole = require("../middlewares/requiredRole");
const checkSelfOrAdmin = require("../middlewares/checkSelfOrAdmin");
const { getAllUserSchema, getUserSchema, createUserSchema, updateUserSchema } = require("../models/user.model");

async function users(fastify) {
	const client = fastify.db.client;
	const usersController = new UsersController(client);

	fastify.get(
		"/users",
		{ schema: getAllUserSchema, preHandler: requireRole(["ADMIN", "MODERATOR"], client) },
		async (request, reply) => {
			const users = await usersController.getAllUsers();
			reply.send(users);
		},
	);

	fastify.get(
		"/users/:id",
		{ schema: getUserSchema, preHandler: requireRole(["ADMIN", "MODERATOR"], client) },
		async (request, reply) => {
			const users = await usersController.getUser(request.params.id);
			reply.send(users);
		},
	);
	fastify.get("/users/me", { preHandler: checkSelfOrAdmin() }, async (request, reply) => {
		const users = await usersController.getUser(request.user.id);
		reply.send(users);
	});
	fastify.post(
		"/users",
		{ schema: createUserSchema, preHandler: requireRole(["ADMIN"], client) },
		async (request, reply) => {
			const { username, f_name, l_name, email, password, role, avatar } = request.body;
			const users = await usersController.createUser(username, f_name, l_name, email, password, role, avatar);
			const user = users[0];
			reply.status(201);
			reply.send(user);
		},
	);

	fastify.put(
		"/users/:id",
		{ schema: updateUserSchema, preHandler: requireRole(["ADMIN", "MODERATOR"], client) },
		async (request, reply) => {
			const { username, f_name, l_name, email, password, role, avatar } = request.body;
			const users = await usersController.updateUser(
				request.params.id,
				username,
				f_name,
				l_name,
				email,
				password,
				role,
				avatar,
			);
			const user = users[0];
			reply.status(200);
			reply.send(user);
		},
	);
	fastify.put("/users/me", { preHandler: checkSelfOrAdmin() }, async (request, reply) => {
		const { username, f_name, l_name, email, password, role, avatar } = request.body;
		const users = await usersController.updateUser(
			request.user.id,
			username,
			f_name,
			l_name,
			email,
			password,
			role,
			avatar,
		);
		const user = users[0];
		reply.status(200);
		reply.send(user);
	});

	fastify.delete("/users/:id", { preHandler: requireRole(["ADMIN"], client) }, async (request, reply) => {
		const user = await usersController.deleteUser(request.params.id);
		if (!user) {
			reply.status(404).send({ error: "User not found" });
		} else {
			reply.status(204).send();
		}
	});
}

module.exports = users;
