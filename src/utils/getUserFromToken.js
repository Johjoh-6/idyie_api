const jwt = require("jsonwebtoken");
const env = require("dotenv").config().parsed;

function getUserFromToken(token) {
	try {
		const decoded = jwt.verify(token, env.JWT_SECRET);
		return {
			isAuthenticated: true,
			role: decoded.role,
		};
	} catch (err) {
		return {
			isAuthenticated: false,
		};
	}
}

module.exports = getUserFromToken;
