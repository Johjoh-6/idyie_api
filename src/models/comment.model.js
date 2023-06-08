const getAllCommentSchema = {
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                required: ["id", "id_tutorial", "id_user", "content", "created_at", "updated_at"],
                properties: {
                    id: { type: "integer" },
                    id_tutorial: { type: "integer" },
                    id_user: { type: "integer" },
                    content: { type: "string" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" }
                }
            }
        }
    }
};

const getAllCategorieSchema = {
    response: {
        200: {
            type: "array",
            items: { $ref: "category" },
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

module.exports = function (fastify) {
    fastify.addSchema({
        $id: 'comment',
        type: 'object',
        required: ['id', 'tutorial', 'user', 'content', 'date', 'response'],
        properties: {
            id: { type: 'integer' },
            tutorial: {
                type: 'object',
                required: ['id', "title"],
                properties: {
                    id: { type: 'integer' },
                    title: { type: 'string' },
                }
            },
            user: {
                type: 'object',
                required: ['id', "username", "avatar"],
                properties: {
                    id: { type: 'integer' },
                    username: { type: 'string' },
                    avatar: { type: 'string' },
                },
                content: { type: 'string' },
                date: { type: 'string', format: 'date-time' },
                response: {
                    type: 'array',
                    nullable: true,
                    items: { $ref: 'comment' }, // Reference to the same schema for nested categories
                },
            },
        },
    });

    return {

    };
};


