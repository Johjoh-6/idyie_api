/**
 * Check if the email and username is already used
 * @param {number} id id of the user
 * @param {string} email
 * @param {string} username
 * @returns {Promise<{emailExist: Boolean, usernameExist: Boolean}>}
 */
const checkEmailAndUsername = (client, idParams = false) => {
	return async (request, reply) => {
		const { email, username } = request.body;

		let queryEmail = "SELECT * FROM users WHERE email = $1";
		const emailCheck = [email];
		let queryUsername = "SELECT * FROM users WHERE username = $1";
		const usernameCheck = [username];
		const id = idParams ? request.params.id : request.userId;
		if (id) {
			queryEmail += " AND id != $2";
			emailCheck.push(id);
			queryUsername += " AND id != $2";
			usernameCheck.push(id);
		}

		const emailExist = await client.query(queryEmail, emailCheck);
		const usernameExist = await client.query(queryUsername, usernameCheck);

		if (emailExist.rows.length > 0) {
			reply.status(400).send({ error: "Email already used" });
		}
		if (usernameExist.rows.length > 0) {
			reply.status(400).send({ error: "Username already used" });
		}
	};
};

module.exports = checkEmailAndUsername;
