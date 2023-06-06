 /**
     * Check if the email and username is already used
     * @param {string} email
     * @param {string} username
     * @returns {Promise<{emailExist: Boolean, usernameExist: Boolean}>}
     */
 const checkEmailAndUsername = async (email, username, client) =>{
    const queryEmail = 'SELECT * FROM users WHERE email = \$1';
    const queryUsername = 'SELECT * FROM users WHERE username = \$1';

    const emailExist = await client.query(queryEmail, [email]);
    const usernameExist = await client.query(queryUsername, [username]);

    return {
        emailExist: emailExist.rowCount > 0,
        usernameExist: usernameExist.rowCount > 0
    };
}

module.exports = checkEmailAndUsername;