const UsersController = require("../controllers/usersController");
const isAuthenticated = require("../middlewares/isAuthentificate");
const requireRole = require("../middlewares/requiredRole");
const createSchema = require("../models/user.model");
const checkLenght = require("../utils/checkLenght");
const verifyEmail = require("../utils/verifyEmail");
const checkEmailAndUsername = require("../middlewares/checkEmailAndUsername");

async function users(fastify) {
	const client = fastify.db.client;
	const usersController = new UsersController(client);
	const {
		getAllUserSchema,
		getUserSchema,
		getUserAdminSchema,
		createUserSchema,
		updateUserSchema,
		updateUserSelfSchema,
	} = createSchema(fastify);

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
		{
			schema: getUserAdminSchema,
			preHandler: requireRole(["ADMIN", "MODERATOR"], client),
		},
		async (request, reply) => {
			const users = await usersController.getUser(request.params.id);
			if (users === undefined) {
				reply.status(404).send({ error: "User not found" });
			}
			reply.send(users);
		},
	);
	fastify.get("/users/me", { preHandler: isAuthenticated(client), schema: getUserSchema }, async (request, reply) => {
		const id_user = request.userId;
		const users = await usersController.getUser(id_user);
		reply.send(users);
	});
	fastify.post(
		"/users",
		{ schema: createUserSchema, preHandler: [requireRole(["ADMIN"], client), checkEmailAndUsername(client)] },
		async (request, reply) => {
			try {
				const { username, f_name, l_name, email, password, role, avatar } = request.body;
				const users = await usersController.createUser(username, f_name, l_name, email, password, role, avatar);
				const user = users[0];
				reply.status(201);
				reply.send(user);
			} catch (error) {
				reply.status(400).send({ error: error.message });
			}
		},
	);

	fastify.put(
		"/users/:id",
		{
			schema: updateUserSchema,
			preHandler: [requireRole(["ADMIN", "MODERATOR"], client), checkEmailAndUsername(client, true)],
		},
		async (request, reply) => {
			try {
				const { username, f_name, l_name, email, password, role, avatar, ban } = request.body;

				if (email !== "") {
					if (!verifyEmail(email)) {
						reply.status(400).send({ error: "Email is not valid" });
					}
				}
				if (password !== "") {
					if (!checkLenght(password, 6, 255)) {
						reply.status(400).send({ error: "Password is too short" });
					}
				}

				const users = await usersController.updateUser(
					request.params.id,
					username,
					f_name,
					l_name,
					email,
					password,
					role,
					avatar,
					ban,
				);
				const user = users[0];
				reply.status(200);
				reply.send(user);
			} catch (error) {
				reply.status(400).send({ error: error.message });
			}
		},
	);
	fastify.put(
		"/users/me",
		{ schema: updateUserSelfSchema, preHandler: [isAuthenticated(client), checkEmailAndUsername(client)] },
		async (request, reply) => {
			try {
				const { username, f_name, l_name, email, password, avatar } = request.body;
				const id_user = request.userId;
				if (email !== "") {
					if (!verifyEmail(email)) {
						reply.status(400).send({ error: "Email is not valid" });
					}
				}
				if (password !== "") {
					if (!checkLenght(password, 6, 255)) {
						reply.status(400).send({ error: "Password is too short" });
					}
				}

				const users = await usersController.updateUser(id_user, username, f_name, l_name, email, password, avatar);
				const user = users[0];
				reply.status(200);
				reply.send(user);
			} catch (err) {
				console.log(err);
				reply.status(500).send({ error: "Internal server error" });
			}
		},
	);

	fastify.delete("/users/:id", { preHandler: requireRole(["ADMIN"], client) }, async (request, reply) => {
		const user = await usersController.deleteUser(request.params.id);
		if (!user) {
			reply.status(404).send({ error: "User not found" });
		} else {
			reply.status(204).send({ message: "User deleted" });
		}
	});

	fastify.put("/users/:id/ban", { preHandler: requireRole(["ADMIN", "MODERATOR"], client) }, async (request, reply) => {
		const user = await usersController.banUser(request.params.id);
		if (!user) {
			reply.status(404).send({ error: "User not found" });
		} else {
			reply.status(200).send({
				message: "User banned",
			});
		}
	});
}

module.exports = users;
