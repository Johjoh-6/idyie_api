const CategorieController = require("../controllers/categorieController");
const requireRole = require("../middlewares/requiredRole");
const { getAllCategorieSchema, getCategorieSchema, createCategorieSchema, updateCategorieSchema } = require("../models/categorie.model");

async function categorie(fastify) {
	const client = fastify.db.client;
    const categorieController = new CategorieController(client);
	

	fastify.get(
		"/categorie",
		{ schema: getAllCategorieSchema},
		async (request, reply) => {
			const categorie = await categorieController.getAllCategorie();
			reply.send(categorie);
		},
	);

    fastify.get(
        "/categorie/:id",
        { schema: getCategorieSchema},
        async (request, reply) => {
            const categorie = await categorieController.getCategorie(request.params.id);
            reply.send(categorie);
        }
    );

    fastify.post(
        "/categorie",
        { schema: createCategorieSchema, preHandler: requireRole(['ADMIN', 'MODERATOR'], client)},
        async (request, reply) => {
            const { name, parent } = request.body;
            const categorie = await categorieController.createCategorie(name, parent);
            const categories = categorie[0];
            reply.status(201);
            reply.send(categories);
        }
    );

    fastify.put(
        "/categorie/:id",
        { schema: updateCategorieSchema, preHandler: requireRole(['ADMIN', 'MODERATOR'], client) },
        async (request, reply) => {
            const { name, parent } = request.body;
            const categorie = await categorieController.updateCategorie(request.params.id, name, parent);
            const categories = categorie[0];
            reply.status(200);
            reply.send(categories);
        }
    );

    fastify.delete(
        "/categorie/:id", { preHandler: requireRole(['USER','ADMIN'], client) },async (request, reply) => {
            const categorie = await categorieController.deleteCategorie(request.params.id);
            reply.status(204);
            reply.send(categorie);
        }
    );


	
}

module.exports = categorie;
