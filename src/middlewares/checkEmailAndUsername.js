 /**
     * Check if the email and username is already used
     * @param {number} id id of the user
     * @param {string} email
     * @param {string} username
     * @returns {Promise<{emailExist: Boolean, usernameExist: Boolean}>}
     */
 const checkEmailAndUsername = ( client ) =>{
    return async (request, reply) => {
    const { email, username } = request.body;
    const id = request.userId;
    const queryEmail = 'SELECT * FROM users WHERE email = \$1 AND id != \$2';
    const queryUsername = 'SELECT * FROM users WHERE username = \$1 AND id != \$2';

    const emailExist = await client.query(queryEmail, [email, id]);
    const usernameExist = await client.query(queryUsername, [username, id]);

    if (emailExist.rows.length > 0) {
        reply.status(400).send({ error: "Email already used" });
    }
    if (usernameExist.rows.length > 0) {
        reply.status(400).send({ error: "Username already used" });
    }
}
}

module.exports = checkEmailAndUsername;