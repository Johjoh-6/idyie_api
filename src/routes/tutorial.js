const TutorialController = require("../controllers/tutorialController");
const requireRole = require("../middlewares/requiredRole");
const checkSelfOrAdmin = require("../middlewares/checkSelfOrAdmin");
const { getAllTutorialSchema, getTutorialSchema, createTutorialSchema, updateTutorialSchema } = require("../models/tutorial.model");

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

    fastify.post(
        "/tutorial",
        { schema: createTutorialSchema},
        async (request, reply) => {
            const { id_users, id_category, title, content, view_count, durate } = request.body;
            const tutorial = await tutorialController.createTutorial(id_users, id_category, title, content, view_count, durate);
            const tutorials = tutorial[0];
            reply.status(201);
            return reply.send(tutorials);
        }
    );

	
}

module.exports = tutorial;
