const getAllCategorieSchema = {
	response: {
		200: {
			type: "array",
			items: { $ref: "category"},
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
		404: {
			type: "object",
			properties: {
				error: { type: "string" },
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
		400: {
			type: "object",
			properties: {
				error: { type: "string" },
				message: { type: "string" },
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
		400: {
			type: "object",
			properties: {
				error: { type: "string" },
				message: { type: "string" },
			},
		},
	},
};

module.exports = function (fastify) {
	fastify.addSchema({
		$id: 'category',
		type: 'object',
		required: ['id', 'name', 'sub'],
		properties: {
		  id: { type: 'integer' },
		  name: { type: 'string', minLength: 3, maxLength: 255 },
		  sub: {
			type: 'array',
			nullable: true,
			items: { $ref: 'category' }, // Reference to the same schema for nested categories
		  },
		},
	  });
  
	return {
	  getAllCategorieSchema,
	  getCategorieSchema,
	  createCategorieSchema,
	  updateCategorieSchema,
	};
  };
  