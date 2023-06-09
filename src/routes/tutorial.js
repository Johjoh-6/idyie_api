const TutorialController = require("../controllers/tutorialController");
const isAuthenticated = require("../middlewares/isAuthentificate");
const requireRole = require("../middlewares/requiredRole");
const { getAllTutorialSchema, getTutorialSchema, createTutorialSchema, updateTutorialSchema } = require("../models/tutorial.model");
const checkSelf = require("../utils/checkSelft");

async function tutorial(fastify) {
	const client = fastify.db.client;
    const tutorialController = new TutorialController(client);
	

	fastify.get(
		"/tutorial",
		{ schema: getAllTutorialSchema},
		async (request, reply) => {
			const tutorials = await tutorialController.getAllTutorial();
			reply.send(tutorials);
		},
	);

    fastify.get(
        "/tutorial/:id",
        { schema: getTutorialSchema},
        async (request, reply) => {
            const tutorial = await tutorialController.getTutorial(request.params.id);
            reply.send(tutorial);
        }
    );

    fastify.get(
        "/tutorial/:id/view",
        { preHandler: isAuthenticated( client)},
        async (request, reply) => {
            const tutorial = await tutorialController.addViewCount(request.params.id);
            reply.send(tutorial);
        }
    );

    fastify.get(
        "/tutorial/category/:id_category",
        { schema: getAllTutorialSchema},
        async (request, reply) => {
            const tutorials = await tutorialController.getTutorialByCategory(request.params.id_category);
            reply.send(tutorials);
        }
    );

    fastify.post(
        "/tutorial",
        { 
            schema: createTutorialSchema,
             preHandler: requireRole(["ADMIN", "MODERATOR", "REDACTOR"], client)},
        async (request, reply) => {
            const {  id_category, title, content, durate } = request.body;
            const id_users = request.userId;
            const tutorial = await tutorialController.createTutorial(id_users, id_category, title, content, durate);
            const tutorials = tutorial[0];
            reply.status(201);
            reply.send(tutorials);
        }
    );

    fastify.put(
        "/tutorial/:id",
        { schema: updateTutorialSchema, preHandler: requireRole(["ADMIN", "MODERATOR"], client)},
        async (request, reply) => {
            const { id_category, title, content, durate } = request.body;
            const existTuto = await tutorialController.getTutorial(request.params.id);
            const allow = checkSelf(request, existTuto.id_users, true);
            if (!allow) {
                reply.status(403).send({message: "You can't update this tutorial"});
            }

            const tutorial = await tutorialController.updateTutorial(request.params.id, id_category, title, content, durate);
            const tutorials = tutorial[0];
            reply.send(tutorials);
        }
    );

    fastify.delete(
        "/tutorial/:id",
        { preHandler: requireRole(["ADMIN", "MODERATOR"], client)},
        async (request, reply) => {
            const tutorial = await tutorialController.deleteTutorial(request.params.id);
            reply.send(tutorial);
        }
    );

	
}

module.exports = tutorial;
