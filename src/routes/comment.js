const CommentController = require("../controllers/commentController");
const isAuthenticated = require("../middlewares/isAuthentificate");
const requireRole = require("../middlewares/requiredRole");
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
        { schema: getAllCommentSchema, preHandler: requireRole(['ADMIN', 'MODERATOR'], client)},
        async (request, reply) => {
        const comment = await commentController.getAllComment();
        reply.send(comment);
    });

    fastify.get(
        "/comment/:id",
        { schema: getCommentSchema, preHandler: requireRole(['ADMIN', 'MODERATOR'], client)},
        async (request, reply) => {
            const comment = await commentController.getComment(request.params.id);
            if(comment === undefined) {
				reply.status(404).send({error: "Comment not found"});
			}
            reply.send(comment);
        }
    );

    fastify.get(
        "/comment/tutorial/:id",
        { schema: getCommentByTutorialSchema},
        async (request, reply) => {
            const comment = await commentController.getCommentByTutorial(request.params.id);
            if(comment === undefined) {
                reply.status(404).send({error: "Comment of this tutorial not found"});
            }
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
            try{
            const { id_tutorial, content, parent_id } = request.body;
            const id_users = request.userId;
            const parent = !isNaN(parent_id) ? parent_id : null;
            const comment = await commentController.createComment(id_users, id_tutorial, content, parent);
            reply.status(201);
            reply.send(comment);
        } catch (error) {
            reply.status(400).send({ error: error.message });
        }
        }
    );

    fastify.put(
        "/comment/:id",
        { schema: updateCommentSchema,
            preHandler: isAuthenticated(client)
        },
        async (request, reply) => {
            try{
            const { content } = request.body;
            const comment = await commentController.updateComment(request.params.id, content);
            reply.send(comment);
        } catch (error) {
            reply.status(400).send({ error: error.message });
        }
        }
    );

    fastify.delete(
        "/comment/:id",
        { preHandler: requireRole(['ADMIN', 'MODERATOR'], client)},
        async (request, reply) => {
            const comment = await commentController.deleteComment(request.params.id);
            if(comment === undefined) {
                reply.status(404).send({error: "Comment not found"});
            } else {
            reply.status(200).send({message: "Comment deleted"});
            }
        }
    );

}

module.exports = comment;
