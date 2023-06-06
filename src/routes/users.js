const UsersController = require("../controllers/usersController");
const requireRole = require("../middlewares/requiredRole");
const checkSelfOrAdmin = require("../middlewares/checkSelfOrAdmin");
const { getAllUserSchema, getUserSchema, createUserSchema, updateUserSchema } = require("../models/user.model");

async function users(fastify) {
	const client = fastify.db.client;
	const usersController = new UsersController(client);

	fastify.get(
		"/users",
		{ schema: getAllUserSchema, preHandler: await requireRole(["ADMIN", "MODERATOR"]) },
		async (request, reply) => {
			const users = await usersController.getAllUsers();
			reply.send(users);
		},
	);

	fastify.get(
		"/users/:id",
		{ schema: getUserSchema, preHandler: await requireRole(["ADMIN", "MODERATOR"]) },
		async (request, reply) => {
			const users = await usersController.getUser(request.params.id);
			reply.send(users);
		},
	);
	fastify.get("/users/me", { preHandler: await checkSelfOrAdmin() }, async (request, reply) => {
		const users = await usersController.getUser(request.user.id);
		reply.send(users);
	});
	fastify.post(
		"/users",
		{ schema: createUserSchema, preHandler: await requireRole(["ADMIN"]) },
		async (request, reply) => {
			const { username, f_name, l_name, email, password, role, avatar } = request.body;
			const users = await usersController.createUser(username, f_name, l_name, email, password, role, avatar);
			const user = users[0];
			reply.status(201);
			return reply.send(user);
		},
	);

	fastify.put(
		"/users/:id",
		{ schema: updateUserSchema, preHandler: await requireRole(["ADMIN", "MODERATOR"]) },
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
			return reply.send(user);
		},
	);
	fastify.put("/users/me", { preHandler: await checkSelfOrAdmin() }, async (request, reply) => {
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
		return reply.send(user);
	});

	fastify.delete("/users/:id", { preHandler: await requireRole(["ADMIN"]) }, async (request, reply) => {
		const user = await usersController.deleteUser(request.params.id);
		if (!user) {
			reply.status(404).send({ error: "User not found" });
		} else {
			reply.status(204).send();
		}
	});
}

module.exports = users;
