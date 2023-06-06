const UsersController = require("./usersController");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const hashPassword = require("../utils/hashPaswword");
const env = require("dotenv").config().parsed;
const checkEmailAndUsername = require("../utils/checkEmailAndUsername");

class AuthController {
	constructor(dbClient) {
		this.client = dbClient;
	}

	async login(email, password) {
		const { rows } = await this.client.query("SELECT * FROM users WHERE email=$1", [email]);
		if (!rows.length) {
			throw new Error("User not found");
		}
		const user = rows[0];
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new Error("Invalid password");
		}
    
        const { rowCount } = await this.client.query("DELETE FROM jwt_tokens WHERE user_id=$1 RETURNING *", [user.id]);

        const token = this.createToken(user);
        const expiration = new Date(Date.now() + 3600000);
        await this.client.query("INSERT INTO jwt_tokens (user_id, token, expiration) VALUES ($1, $2, $3) RETURNING *", [user.id, token, expiration]);
        
        return token;
	}

	async register(username, email, password) {
		const { emailExist, usernameExist} = await checkEmailAndUsername(email, username, this.client);
		console.info(emailExist, usernameExist);
		if (emailExist) {
			throw new Error("Email already used");
		}
        if (usernameExist) {
            throw new Error("Username already used");
        }
		const hashedPassword = await hashPassword(password);
		const { rows } = await this.client.query(
			"INSERT INTO users (username, email, password, role, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *",
			[username, email, hashedPassword, "USER"],
		);
		const user = rows[0];
        const token = this.createToken(user);
        const expiration = new Date(Date.now() + 3600000);
        await this.client.query("INSERT INTO jwt_tokens (user_id, token, expiration) VALUES ($1, $2, $3)", [user.id, token, expiration]);

        return token;
	}

    async logout(token) {
        // delete the token from the database
        const rows  = await this.client.query("DELETE FROM jwt_tokens WHERE token=$1", [token]);
        if (rows.rowCount > 0) {
            return true;
        } else {
            return false;
        }
    }

	createToken(user) {
		const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, env.JWT_SECRET, { expiresIn: "1h" });
		return token;
	}

}

module.exports = AuthController;
