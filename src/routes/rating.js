const RatingController = require("../controllers/ratingController");
const requireRole = require("../middlewares/requiredRole");
const {
	getAllRatingSchema,
	getRatingSchema,
	createRatingSchema,
	updateRatingSchema,
} = require("../models/rating.model");
const checkSelf = require("../utils/checkSelft");

async function rating(fastify) {
	const client = fastify.db.client;
	const ratingController = new RatingController(client);

	fastify.get(
		"/rating",
		{ schema: getAllRatingSchema, preHandler: requireRole(["ADMIN", "MODERATOR"], client) },
		async (request, reply) => {
			const rating = await ratingController.getAllRating();
			reply.send(rating);
		},
	);

	fastify.get(
		"/rating/:id",
		{ schema: getRatingSchema, preHandler: requireRole(["ADMIN", "MODERATOR"], client) },
		async (request, reply) => {
			const rating = await ratingController.getRating(request.params.id);
			if(rating === undefined) {
				reply.status(404).send({ message: "Rating not found" });
			}
			reply.send(rating);
		},
	);

	fastify.get(
		"/rating/me/:id",
		{ 
			schema: getRatingSchema, 
			preHandler: requireRole(["ADMIN", "MODERATOR", "REDACTOR", "USER"], client) },
		async (request, reply) => {
			const id_user = request.userId;
			console.log(request.params.id);
			const rating = await ratingController.getRatingByTutorial(request.params.id, id_user);
			console.log(rating)
			if(rating === undefined) {
				reply.status(404).send({ message: "Rating not found" });
			}
			reply.send(rating);
		},
	);

	fastify.post(
		"/rating",
		{ schema: createRatingSchema, onRequest: requireRole(["ADMIN", "MODERATOR", "REDACTOR", "USER"], client) },
		async (request, reply) => {
			try{
			console.log("Route handler called");
			const { id_tutorial, rating_value } = request.body;
			const id_user = request.userId;
			const rating = await ratingController.createRating(rating_value, id_user, id_tutorial);
			reply.status(201);
			reply.send(rating);
		} catch (error) {
			reply.status(400).send({ error: error.message });
		}
		},
	);

	fastify.put(
		"/rating/:id",
		{ schema: updateRatingSchema, preHandler: requireRole(["ADMIN", "MODERATOR", "REDACTOR", "USER"], client) },
		async (request, reply) => {
			try{
			const { rating_value } = request.body;
			const existRating = await ratingController.getRating(request.params.id);
			const allow = checkSelf(request, existRating.id_user);
			if (!allow) {
				reply.status(403).send({ message: "You can't update this rating" });
			}
			const rating = await ratingController.updateRating(request.params.id, rating_value);
			reply.status(200);
			reply.send(rating);
		} catch (error) {
			reply.status(400).send({ error: error.message });
		}
		},
		
	);

	fastify.delete("/rating/:id", { preHandler: requireRole(["ADMIN", "MODERATOR"], client) }, async (request, reply) => {
		const rating = await ratingController.deleteRating(request.params.id);
		console.log(rating);
		if (!rating) {
			reply.status(404).send({ message: "Rating not found" });
		} else {
			reply.status(204).send({ message: "Rating deleted" });
		}
	});
}

module.exports = rating;
