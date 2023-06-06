const fastifyPlugin = require("fastify-plugin");
const { Client } = require("pg");
const env = require("dotenv").config().parsed;

const client = new Client({
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	host: env.DB_HOST,
	port: env.DB_PORT,
	database: env.DB_NAME,
});
async function dbconnector(fastify, options) {
	try {
		await client.connect();
		console.log("db connected succesfully");
		fastify.decorate("db", { client });
	} catch (err) {
		console.error(err);
	}
}
module.exports = fastifyPlugin(dbconnector);
