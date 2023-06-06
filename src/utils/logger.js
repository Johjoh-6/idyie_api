// Personalized logger for each environment
const envToLogger = {
	development: {
		transport: {
			target: "pino-pretty",
			options: {
				translateTime: "HH:MM:ss Z",
				ignore: "pid,hostname",
				colorize: true,
				messageFormat: "status:{res.statusCode} url:{req.url}",
			},
		},
	},
	production: true,
	test: false,
};

module.exports = envToLogger;
