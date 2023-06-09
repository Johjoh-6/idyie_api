const getAllRatingSchema = {
	response: {
		200: {
			type: "array",
			items: {
				type: "object",
				required: ["id", "user", "tutorial", "rating_value", "created_at", "updated_at"],
				properties: {
					id: { type: "integer" },
					user: {
						type: "object",
						required: ["id", "username", "avatar"],
						properties: {
							id: { type: "integer" },
							username: { type: "string", minLength: 3, maxLength: 255 },
							avatar: { type: "string", format: "uri", maxLength: 255 },
						},
						tutorial: {
							type: "object",
							required: ["id", "title", "created_at"],
							properties: {
								id: { type: "integer" },
								title: { type: "string", minLength: 3, maxLength: 255 },
								created_at: { type: "string", format: "date-time" },
							},
						},
						rating_value: { type: "integer" },
						created_at: { type: "string", format: "date-time" },
						updated_at: { type: "string", format: "date-time" },
					},
				},
			},
		},
	},
};

const getRatingSchema = {
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
			required: ["id", "user", "tutorial", "rating_value", "created_at", "updated_at"],
			properties: {
				id: { type: "integer" },
				user: {
					type: "object",
					required: ["id", "username", "avatar"],
					properties: {
						id: { type: "integer" },
						username: { type: "string", minLength: 3, maxLength: 255 },
						avatar: { type: "string", format: "uri", maxLength: 255 },
					},
					tutorial: {
						type: "object",
						required: ["id", "title", "created_at"],
						properties: {
							id: { type: "integer" },
							title: { type: "string", minLength: 3, maxLength: 255 },
							created_at: { type: "string", format: "date-time" },
						},
					},
					rating_value: { type: "integer" },
					created_at: { type: "string", format: "date-time" },
					updated_at: { type: "string", format: "date-time" },
				},
			},
		},
	},
};

const createRatingSchema = {
	body: {
		type: "object",
		required: ["id_tutorial", "rating_value"],
		properties: {
			id_tutorial: { type: "integer" },
			rating_value: { type: "integer", minimum: 1, maximum: 5 },
		},
	},
	response: {
		201: {
			type: "object",
			required: ["id", "id_user", "id_tutorial", "rating_value", "created_at"],
			properties: {
				id: { type: "integer" },
				id_user: { type: "integer" },
				id_tutorial: { type: "integer" },
				rating_value: { type: "integer" },
				created_at: { type: "string", format: "date-time" },
			},
		},
		400: {
			type: "object",
			properties: {
				error: { type: "string" },
				message: { type: "string" },
			},
		},
	},
};

const updateRatingSchema = {
	params: {
		type: "object",
		required: ["id"],
		properties: {
			id: { type: "integer", minimum: 1 },
		},
	},
	body: {
		type: "object",
		required: ["rating_value"],
		properties: {
			rating_value: { type: "integer", minimum: 1, maximum: 5 },
		},
	},
	response: {
		200: {
			type: "object",
			required: ["id", "id_user", "id_tutorial", "rating_value", "created_at", "updated_at"],
			properties: {
				id: { type: "integer" },
				id_user: { type: "integer" },
				id_tutorial: { type: "integer" },
				rating_value: { type: "integer" },
				created_at: { type: "string", format: "date-time" },
				updated_at: { type: "string", format: "date-time" },
			},
		},
		400: {
			type: "object",
			properties: {
				error: { type: "string" },
				message: { type: "string" },
			},
		},
	},
};

module.exports = {
	getAllRatingSchema,
	getRatingSchema,
	createRatingSchema,
	updateRatingSchema,
};
