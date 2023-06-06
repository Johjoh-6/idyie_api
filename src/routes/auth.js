const AuthController = require("../controllers/authController");
const env = require("dotenv").config().parsed;

async function auth(fastify) {
	const client = fastify.db.client;
	const authController = new AuthController(client);

	fastify.post("/login", async (request, reply) => {
        try{
            const { email, password } = request.body;
            const token = await authController.login(email, password);
            if (!token) {
                reply.status(401).send({ error: "Unauthorized" });
                return;
            }
            reply.setCookie('authToken', token, {
                httpOnly: true,
                secure: env.ENV === 'production',
                path: '/',
                sameSite: 'strict',
            });
            reply.status(200).send({ message: 'Loggin succesful' });
		} catch (error) {
            console.error(error);
			reply.status(400).send({ error: error.message });
		}
		
	});

	fastify.post("/register", async (request, reply) => {
		try {
			const { username, email, password } = request.body;
			const token = await authController.register(username, email, password);
            reply.setCookie('authToken', token, {
                httpOnly: true,
                secure: env.ENV === 'production',
                path: '/',
                sameSite: 'strict',
            });
            reply.status(200).send({ message: 'User created' });
		} catch (error) {
            console.error(error);
			reply.status(400).send({ error: error.message });
		}
	});

    fastify.post("/logout", async (request, reply) => {
        try {
            const token = request.cookies.authToken;
            const clear = await authController.logout(token);
            if(!clear) {
                reply.status(401).send({ error: "Unauthorized" });
                return;
            }
            reply.clearCookie('authToken', {
                httpOnly: true,
                secure: env.ENV === 'production',
                path: '/',
                sameSite: 'strict',
            });
            reply.status(200).send({ message: 'User logged out' });
        } catch (error) {
            console.error(error);
            reply.status(400).send({ error: error.message });
        }
    });
}

module.exports = auth;
