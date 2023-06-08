const getAllCommentSchema = {
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                required: ["id", "tutorial", "user", "content", "date"],
                properties: {
                    id: { type: "integer" },
                    tutorial: {
                        type: "object",
                        required: ["id", "title"],
                        properties: {
                            id: { type: "integer" },
                            title: { type: "string", minLength: 3, maxLength: 255 },
                        },
                    },
                    user: {
                        type: "object",
                        required: ["id", "username", "avatar"],
                        properties: {
                            id: { type: "integer" },
                            username: { type: "string", minLength: 3, maxLength: 255 },
                            avatar: { type: "string", format: "uri", maxLength: 255 },
                        },
                    },
                    content: { type: "string" },
                    date: { type: "string", format: "date-time" },
                }
            }
        }
    }
};


const getCommentSchema = {
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
                $ref: "comment",
                properties: {
                    tutorial: {
                        type: "object",
                        required: ["id", "title"],
                        properties: {
                            id: { type: "integer", minimum: 1 },
                            title: { type: "string" },
                        },
                    },
                },
            },
        },
    },
};


const getCommentByTutorialSchema = {
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
          allOf: [
            { $ref: "comment" },
            {
              properties: {
                tutorial: { type: "integer" },
                res: {
                  type: 'array',
                  nullable: true,
                  items: { $ref: 'comment' },
                },
              },
              required: ["tutorial", "res"],
            },
          ],
        },
      },
    },
  };
  

const createCommentSchema = {
    body: {
        type: "object",
        required: ["content", "id_tutorial"],
        properties: {
            content: { type: "string", minLength: 3, maxLength: 2000 },
            parent_id: { type: "integer", nullable: true },
            id_tutorial: { type: "integer" },
        },
    },
    response: {
        201: {
            type: "object",
            required: ["id", "id_tutorial", "id_user", "parent_id", "content", "created_at"],
            properties: {
                id: { type: "integer" },
                id_tutorial: {
                    type: "integer"
                },
                id_user: {
                    type: "integer"
                },
                content: { type: "string" },
                created_at: { type: "string", format: "date-time" },
            },
        },
    },
};

const updateCommentSchema = {
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "integer", minimum: 1 },
        },
    },
    body: {
        type: "object",
        required: ["content"],
        properties: {
            content: { type: "string", minLength: 3, maxLength: 2000 },
            parent_id: { type: "integer", nullable: true },
        },
    },
    response: {
        200: {
            type: "object",
            required: ["id", "id_tutorial", "user", "content", "date"],
            properties: {
                id: { type: "integer" },
                id_tutorial: {
                    type: "integer",

                },
                user: {
                    type: "object",
                    required: ["id", "username", "avatar"],
                    properties: {
                        id: { type: "integer" },
                        username: { type: "string", minLength: 3, maxLength: 255 },
                        avatar: { type: "string", format: "uri", maxLength: 255 },
                    },
                },
                content: { type: "string" },
                date: { type: "string", format: "date-time" },
            },
        },
    }
};

module.exports = function (fastify) {
    fastify.addSchema({
        $id: 'comment',
        type: 'object',
        required: ['id', 'user', 'content', 'date'],
        properties: {
            id: { type: 'integer' },
            user: {
                type: 'object',
                required: ['id', "username", "avatar"],
                properties: {
                    id: { type: 'integer' },
                    username: { type: 'string' },
                    avatar: { type: 'string' },
                },
            },
            content: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
        },
    });

    return {
        getAllCommentSchema,
        getCommentSchema,
        getCommentByTutorialSchema,
        createCommentSchema,
        updateCommentSchema,
    };
};


