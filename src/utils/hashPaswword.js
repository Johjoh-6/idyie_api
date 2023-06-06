const bcrypt = require('bcrypt');
/**
 * Hash the password
 * @param {string} password
 * @returns {Promise<string>}
 */
const hashPassword = async (password) => {
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

module.exports = hashPassword;