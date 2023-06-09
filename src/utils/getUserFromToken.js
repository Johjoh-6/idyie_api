const jwt = require("jsonwebtoken");
const env = require("dotenv").config().parsed;

function getUserFromToken(tokenRaw) {
	try {
		const token = tokenRaw.replace("Bearer ", "");
		const decoded = jwt.verify(token, env.JWT_SECRET);
		return {
			authenticated: true,
			role: decoded.role,
			id: decoded.id,
			token: token,
		};
	} catch (err) {
		return {
			authenticated: false,
		};
	}
}

module.exports = getUserFromToken;
