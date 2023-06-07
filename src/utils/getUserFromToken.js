const jwt = require("jsonwebtoken");
const env = require("dotenv").config().parsed;

function getUserFromToken(tokenRaw) {
	try {
		const token = tokenRaw.replace("Bearer ", "");
		const decoded = jwt.verify(token, env.JWT_SECRET);
		return {
			isAuthenticated: true,
			role: decoded.role,
			id: decoded.id,
		};
	} catch (err) {
		// TODO remove console.error
		console.error(err);
		return {
			isAuthenticated: false,
		};
	}
}

module.exports = getUserFromToken;
