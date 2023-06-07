const getAllTutorialSchema = {
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                required: ["id", "user",  "categorie", "title", "content", "view_count", "durate", "created_at" ],
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
                    title: { type: "string", minLength: 3, maxLength: 255 },
                    content: { type: "string"},
                    view_count: { type: "integer" },
                    durate: { type: "integer" },
                    created_at: { type: "string", format: "date-time" }
                },
            },
        },
    }
}

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
                required: ["id", "user", "categorie", "title", "content", "view_count", "durate", "created_at" ],
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
                    title: { type: "string", minLength: 3, maxLength: 255 },
                    content: { type: "string"},
                    view_count: { type: "integer" },
                    durate: { type: "integer" },
                    created_at: { type: "string", format: "date-time" }
                },
            },
        },
    }
}

const createTutorialSchema = {
    body: {
        type: "object",
        required: ["id_users", "id_category", "title", "content", "view_count", "durate" ],
        properties: {
            id_users: { type: "integer" },
            id_category: { type: "integer" },
            title: { type: "string", minLength: 3, maxLength: 255 },
            content: { type: "string"},
            view_count: { type: "integer" },
            durate: { type: "integer" }
        },
    },
    response: {
        201: {
            type: "object",
            required: ["id", "id_users", "id_category", "title", "content", "view_count", "durate", "created_at" ],
            properties: {
                id: { type: "integer" },
                id_users: { type: "integer" },
                id_category: { type: "integer" },
                title: { type: "string", minLength: 3, maxLength: 255 },
                content: { type: "string"},
                view_count: { type: "integer" },
                durate: { type: "integer" },
                created_at: { type: "string", format: "date-time" }
            },
        },
    },
}

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
        required: ["id_users", "id_category", "title", "content", "view_count", "durate" ],
        properties: {
            id_users: { type: "integer" },
            id_category: { type: "integer" },
            title: { type: "string", minLength: 3, maxLength: 255 },
            content: { type: "string"},
            view_count: { type: "integer" },
            durate: { type: "integer" }
        },
    },
    response: {
        200: {
            type: "object",
            required: ["id", "id_users", "id_category", "title", "content", "view_count", "durate", "created_at", "updated_at" ],
            properties: {
                id: { type: "integer" },
                id_users: { type: "integer" },
                id_category: { type: "integer" },
                title: { type: "string", minLength: 3, maxLength: 255 },
                content: { type: "string"},
                view_count: { type: "integer" },
                durate: { type: "integer" },
                created_at: { type: "string", format: "date-time" },
                update_at: { type: "string", format: "date-time" }
            },
        },
    },
}

module.exports = {
    getAllTutorialSchema,
    getTutorialSchema,
    createTutorialSchema,
    updateTutorialSchema
}
