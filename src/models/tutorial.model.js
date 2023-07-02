const getAllTutorialSchema = {
	response: {
		200: {
			type: "array",
			items: {
				type: "object",
				required: ["id", "user", "categorie", "avg_rating", "title", "content", "view_count", "comment_count", "durate", "created_at"],
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
					},
					categorie: {
						type: "object",
						required: ["id", "name"],
						properties: {
							id: { type: "integer" },
							name: { type: "string", minLength: 3, maxLength: 255 },
						},
					},
					avg_rating: { type: "number" },
					title: { type: "string", minLength: 3, maxLength: 255 },
					content: { type: "string" },
					view_count: { type: "integer" },
					comment_count: { type: "integer" },
					durate: { type: "integer" },
					created_at: { type: "string", format: "date-time" },
					draft: { type: "boolean" },
				},
			},
		},
	},
};

const getTutorialSchema = {
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
				type: "object",
				required: ["id", "user", "categorie", "avg_rating", "title", "content", "view_count", "durate", "created_at"],
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
					},
					categorie: {
						type: "object",
						required: ["id", "name"],
						properties: {
							id: { type: "integer" },
							name: { type: "string", minLength: 3, maxLength: 255 },
						},
					},
					avg_rating: { type: "number" },
					title: { type: "string", minLength: 3, maxLength: 255 },
					content: { type: "string" },
					view_count: { type: "integer" },
					durate: { type: "integer" },
					created_at: { type: "string", format: "date-time" },
					draft: { type: "boolean" },
				},
			},
		},
		404: {
			type: "object",
			required: ["message"],
			properties: {
				message: { type: "string" },
			},
		},
	},
};

const createTutorialSchema = {
	body: {
		type: "object",
		required: ["id_category", "title", "content", "durate"],
		properties: {
			id_category: { type: "integer" },
			title: { type: "string", minLength: 3, maxLength: 255 },
			content: { type: "string" },
			durate: { type: "integer" },
		},
	},
	response: {
		201: {
			type: "object",
			required: ["id", "id_users", "id_category", "title", "content", "view_count", "durate", "created_at"],
			properties: {
				id: { type: "integer" },
				id_users: { type: "integer" },
				id_category: { type: "integer" },
				title: { type: "string", minLength: 3, maxLength: 255 },
				content: { type: "string" },
				view_count: { type: "integer" },
				durate: { type: "integer" },
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

const updateTutorialSchema = {
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
			id_category: { type: "integer", nullable: true },
			title: { type: "string", minLength: 0, maxLength: 255, nullable: true },
			content: { type: "string", minLength: 0, nullable: true },
			durate: { type: "integer", nullable: true },
			draft: { type: "boolean", nullable: true },
		},
	},
	response: {
		200: {
			type: "object",
			required: [
				"id",
				"id_users",
				"id_category",
				"title",
				"content",
				"view_count",
				"durate",
				"draft",
				"created_at",
				"updated_at",
			],
			properties: {
				id: { type: "integer" },
				id_users: { type: "integer" },
				id_category: { type: "integer" },
				title: { type: "string", minLength: 3, maxLength: 255 },
				content: { type: "string" },
				view_count: { type: "integer" },
				durate: { type: "integer" },
				draft: { type: "boolean" },
				created_at: { type: "string", format: "date-time" },
				update_at: { type: "string", format: "date-time" },
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
	getAllTutorialSchema,
	getTutorialSchema,
	createTutorialSchema,
	updateTutorialSchema,
};
