const getAllCategorieSchema = {
	response: {
		200: {
			type: "array",
			items: {
				type: "object",
				required: ["id", "name", "id_category_parent"],
				properties: {
					id: { type: "integer" },
					name: { type: "string", minLength: 3, maxLength: 255 },
					id_category_parent: { type: "integer", minimum: 1, nullable: true },
				},
			},
		},
	},
};

const getCategorieSchema = {
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
				required: ["id", "name", "id_category_parent"],
				properties: {
					id: { type: "integer" },
					name: { type: "string", minLength: 3, maxLength: 255 },
					id_category_parent: { type: "integer", minimum: 1, nullable: true },
				},
			},
		},
	},
};

const createCategorieSchema = {
	body: {
		type: "object",
		required: ["name"],
		properties: {
			name: { type: "string", minLength: 3, maxLength: 255 },
			id_category_parent: { type: "integer", minimum: 1, nullable: true },
		},
	},
	reponse: {
		201: {
			type: "object",
			required: ["id", "name", "id_category_parent"],
			properties: {
				id: { type: "integer" },
				name: { type: "string", minLength: 3, maxLength: 255 },
				id_category_parent: { type: "integer", minimum: 1, nullable: true },
			},
		},
	},
};

const updateCategorieSchema = {
	params: {
		type: "object",
		required: ["id"],
		properties: {
			id: { type: "integer", minimum: 1 },
		},
	},
	body: {
		type: "object",
		required: ["name"],
		properties: {
			name: { type: "string", minLength: 3, maxLength: 255 },
			id_category_parent: { type: "integer", minimum: 1, nullable: true },
		},
	},
	response: {
		200: {
			type: "object",
			required: ["id", "name", "id_category_parent"],
			properties: {
				id: { type: "integer" },
				name: { type: "string", minLength: 3, maxLength: 255 },
				id_category_parent: { type: "integer", minimum: 1, nullable: true },
			},
		},
	},
};

module.exports = {
	getAllCategorieSchema,
	getCategorieSchema,
	createCategorieSchema,
	updateCategorieSchema,
};
