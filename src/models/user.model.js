const getAllUserSchema = {
	response: {
		200: {
			type: "array",
			items: {
				allOf: [
				{$ref: "user"},
				{
					properties: {
						role: { type: "string", enum: ["user", "moderator", "admin"] },
						ban : { type: "boolean" },
						created_at: { type: "string", format: "date-time" },
						updated_at: { type: "string", format: "date-time" },
					},
					required: ["role", "ban", "created_at", "updated_at"],
				},
				],
				}
			},
		},
};


const getUserSchema = {
	params: {
		type: "object",
		required: ["id"],
		properties: {
			id: { type: "integer", minimum: 1 },
		},
	},
	response: {
		200: {
			type: "array",
			items: {
				$ref: "user"
			},
		},
	},
};

const getUserAdminSchema = {
	params: {
		type: "object",
		required: ["id"],
		properties: {
			id: { type: "integer", minimum: 1 },
		},
	},
	response: {
		200: {
			type: "object",
			
				allOf: [
					{ $ref: "user" },
					{
					  properties: {
						role: { type: "string", enum: ["USER", "REDACTOR", "MODERATOR", "ADMIN"] },
						ban : { type: "boolean" },
						created_at: { type: "string", format: "date-time" },
						updated_at: { type: "string", format: "date-time" },
					  },
					  required: ["role", "ban", "created_at", "updated_at"],
					},
				  ]
		},
	},
};

const createUserSchema = {
	body: {
		type: "object",
		required: ["username", "email", "password"],
		properties: {
			username: { type: "string", minLength: 3, maxLength: 255 },
			f_name: { type: "string", minLength: 1, maxLength: 255 },
			l_name: { type: "string", minLength: 1, maxLength: 255 },
			email: { type: "string", format: "email", maxLength: 255 },
			password: { type: "string", minLength: 6, maxLength: 255 },
			avatar: { type: "string", format: "uri", maxLength: 255 },
			role: { type: "string", enum: ["USER", "REDACTOR", "MODERATOR", "ADMIN"] },
		},
	},
	response: {
		201: {
			type: "object",
			required: ["id", "username", "f_name", "l_name", "email", "avatar"],
			properties: {
				id: { type: "integer" },
				username: { type: "string", minLength: 3, maxLength: 255 },
				f_name: { type: "string", minLength: 1, maxLength: 255 },
				l_name: { type: "string", minLength: 1, maxLength: 255 },
				email: { type: "string", format: "email", maxLength: 255 },
				avatar: { type: "string", format: "uri", maxLength: 255 },
			},
		},
	},
};

const updateUserSchema = {
	params: {
		type: "object",
		required: ["id"],
		properties: {
			id: { type: "integer", minimum: 1 },
		},
	},
	body: {
		type: "object",
		properties: {
			username: { type: "string", minLength: 0, maxLength: 255, nullable: true },
			f_name: { type: "string", minLength: 0, maxLength: 255, nullable: true },
			l_name: { type: "string", minLength: 0, maxLength: 255, nullable: true },
			email: { type: "string", maxLength: 255, minLength: 0,nullable: true},
			password: { type: "string", minLength: 0, maxLength: 255 , nullable: true},
			avatar: { type: ["string", "null"], format: "uri", maxLength: 255, nullable: true },
			role: { type: "string", enum: ["USER", "REDACTOR", "MODERATOR", "ADMIN"], nullable: true },
			ban: { type: "boolean", nullable: true },
		},
	},
	response: {
		200: {
			type: "object",
			required: ["id", "username", "f_name", "l_name", "email", "avatar", "role", "ban"],
			properties: {
				id: { type: "integer" },
				username: { type: "string", minLength: 3, maxLength: 255 },
				f_name: { type: "string", minLength: 1, maxLength: 255 },
				l_name: { type: "string", minLength: 1, maxLength: 255 },
				email: { type: "string", format: "email", maxLength: 255 },
				avatar: { type: ["string", "null"], format: "uri", maxLength: 255 },
				role: { type: "string", enum: ["USER", "REDACTOR", "MODERATOR", "ADMIN"] },
				ban: { type: "boolean" },
			},
		},
	},
};
const updateUserSelfSchema = {
	body: {
		type: "object",
		properties: {
			username: { type: "string", minLength: 0, maxLength: 255, nullable: true },
			f_name: { type: "string", minLength: 0, maxLength: 255, nullable: true },
			l_name: { type: "string", minLength: 0, maxLength: 255, nullable: true },
			email: { type: "string", maxLength: 255, minLength: 0,nullable: true},
			password: { type: "string", minLength: 0, maxLength: 255, nullable: true },
			avatar: { type: ["string", "null"], format: "uri", maxLength: 255, nullable: true },
		},
	},
	response: {
		200: {
			type: "object",
			required: ["id", "username", "f_name", "l_name", "email", "avatar"],
			properties: {
				id: { type: "integer" },
				username: { type: "string", minLength: 3, maxLength: 255 },
				f_name: { type: "string", minLength: 1, maxLength: 255 },
				l_name: { type: "string", minLength: 1, maxLength: 255 },
				email: { type: "string", format: "email", maxLength: 255 },
				avatar: { type: ["string", "null"], format: "uri", maxLength: 255 },
			},
		},
	},
};

module.exports = function (fastify) {
	fastify.addSchema({
		$id: "user",
		type: "object",
		required: ["id", "username", "f_name", "l_name", "email", "avatar"],
		properties: {
			id: { type: "integer" },
			username: { type: "string", minLength: 3, maxLength: 255 },
			f_name: { type: "string", minLength: 1, maxLength: 255 },
			l_name: { type: "string", minLength: 1, maxLength: 255 },
			email: { type: "string", format: "email", maxLength: 255 },
			avatar: { type: ["string", "null"], format: "uri", maxLength: 255 },
		},
	})
	return {
	getAllUserSchema,
	getUserSchema,
	getUserAdminSchema,
	createUserSchema,
	updateUserSchema,
	updateUserSelfSchema
	};
};
