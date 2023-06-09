const RatingController = require("../controllers/ratingController");
const requireRole = require("../middlewares/requiredRole");
const { getAllRatingSchema, getRatingSchema, createRatingSchema, updateRatingSchema } = require("../models/rating.model");

async function rating(fastify) {
	const client = fastify.db.client;
    const ratingController = new RatingController(client);
	

	fastify.get(
        "/rating",
        { schema: getAllRatingSchema, preHandler: requireRole(['ADMIN', 'MODERATOR'], client)},
        async (request, reply) => {
            const rating = await ratingController.getAllRating();
            reply.send(rating);
        }
    );

    fastify.get(
        "/rating/:id",
        { schema: getRatingSchema, preHandler: requireRole(['ADMIN', 'MODERATOR'],  client)},
        async (request, reply) => {
            const rating = await ratingController.getRating(request.params.id);
            reply.send(rating);
        }
    );

    fastify.post(
        "/rating",
        { schema: createRatingSchema, onRequest: requireRole(['ADMIN', 'MODERATOR', 'REDACTOR', 'USER'],  client)},
        async (request, reply) => {
            console.log('Route handler called');
            const { id_tutorial, rating_value } = request.body;
            const id_user = request.userId;
            const rating = await ratingController.createRating(rating_value, id_user, id_tutorial);
            reply.status(201);
            reply.send(rating);
        }
    );

    fastify.put(
        "/rating/:id",
        { schema: updateRatingSchema},
        async (request, reply) => {
            const {  rating_value } = request.body;
            const rating = await ratingController.updateRating(request.params.id, rating_value);
            reply.status(200);
            reply.send(rating);
        }
    );

    fastify.delete(
        "/rating/:id", { preHandler: requireRole(['ADMIN', 'MODERATOR'],  client) },async (request, reply) => {
            const rating = await ratingController.deleteRating(request.params.id);
            reply.status(204);
            reply.send(rating);
        }
    );



}

module.exports = rating;
