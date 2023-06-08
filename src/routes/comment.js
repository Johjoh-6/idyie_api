const CommentController = require("../controllers/commentController");
const requireRole = require("../middlewares/requiredRole");
const checkSelfOrAdmin = require("../middlewares/checkSelfOrAdmin");
const createSchemas = require('../models/comment.model');

async function comment(fastify) {
	const client = fastify.db.client;
    const commentController = new CommentController(client);
    const {
        getAllCommentSchema,
        getCommentSchema,
        createCommentSchema,
        updateCommentSchema,
        getCommentByTutorialSchema
    } = createSchemas(fastify);
	
	fastify.get(
        "/comment",
        { schema: getAllCommentSchema},
        async (request, reply) => {

        const comment = await commentController.getAllComment();
        reply.send(comment);
    });

    fastify.get(
        "/comment/:id",
        { schema: getCommentSchema},
        async (request, reply) => {
            const comment = await commentController.getComment(request.params.id);
            reply.send(comment);
        }
    );

    fastify.get(
        "/comment/tutorial/:id",
        { schema: getCommentByTutorialSchema},
        async (request, reply) => {
            const comment = await commentController.getCommentByTutorial(request.params.id);
            reply.send(comment);
        }
    );

    fastify.post(
        "/comment",
        { 
            schema: createCommentSchema,
            preHandler: requireRole(['ADMIN', 'MODERATOR', 'REDACTOR', 'USER'], client)
        },
        async (request, reply) => {
            const { id_tutorial, content, parent_id } = request.body;
            const id_users = request.userId;
            // check if parent_id an number
            
            const parent = !isNaN(parent_id) ? parent_id : null;
            const comment = await commentController.createComment(id_users, id_tutorial, content, parent);
            reply.status(201);
            reply.send(comment);
        }
    );

    fastify.put(
        "/comment/:id",
        { schema: updateCommentSchema, preHandler: checkSelfOrAdmin(client) },
        async (request, reply) => {
            const { content } = request.body;
            const comment = await commentController.updateComment(request.params.id, content);
            reply.send(comment);
        }
    );

    fastify.delete(
        "/comment/:id",
        { preHandler: checkSelfOrAdmin(client) },
        async (request, reply) => {
            const comment = await commentController.deleteComment(request.params.id);
            reply.send(comment);
        }
    );

}

module.exports = comment;
