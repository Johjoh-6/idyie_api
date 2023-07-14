const hashPassword = require("../utils/hashPaswword");

class UsersController {
	constructor(dbClient) {
		this.client = dbClient;
	}

	async getAllUsers(pageNumber, limit =25, order = 'DESC') {
		let query = "SELECT * FROM users";
		const params = [];
		if(limit && pageNumber){
			const offset = (pageNumber - 1) * limit;
			query += ` ORDER BY u.created_at ${order} LIMIT \$1 OFFSET \$2`;
			params.push(limit);
			params.push(offset);
		}
		const { rows } = await this.client.query();
		return rows;
	}

	async getUser(id) {
		const { rows } = await this.client.query("SELECT * FROM users WHERE id=$1", [id]);
		return rows[0];
	}

	async createUser(username, f_name, l_name, email, password, role, avatar) {
		const hashedPassword = await hashPassword(password);
		const { rows } = await this.client.query(
			"INSERT INTO users (username, f_name, l_name, email, password, role, avatar, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *",
			[username, f_name, l_name, email, hashedPassword, role, avatar],
		);
		return rows;
	}

	async updateUser(id, username, f_name, l_name, email, password,  avatar,role = null, ban = null) {
		console.log(avatar);
		const query = `
        UPDATE users SET
            username = COALESCE(\$1, username),
            f_name = COALESCE(\$2, f_name),
            l_name = COALESCE(\$3, l_name),
            email = CASE WHEN \$4 = '' THEN email ELSE COALESCE(\$4, email) END,
            password = CASE WHEN \$5 = '' THEN password ELSE COALESCE(\$5, password) END,
            avatar = COALESCE(\$6, avatar),
            role = COALESCE(\$7, role),
            updated_at = NOW(),
            ban = COALESCE(\$9, ban)
        WHERE id = \$8
        RETURNING *`;

		try {
			const hashedPassword = password ? await hashPassword(password) : null;
			const { rows } = await this.client.query(query, [
				username,
				f_name,
				l_name,
				email,
				hashedPassword,
				avatar,
				role,
				id,
				ban,
			]);
			return rows;
		} catch (err) {
			throw new Error(err);
		}
	}

	async deleteUser(id) {
		const rows = await this.client.query("DELETE FROM users WHERE id=$1", [id]);
		return rows.rowCount;
	}

	async banUser(id) {
		const rows = await this.client.query("UPDATE users SET ban = true WHERE id=$1 RETURNING *", [id]);
		return rows.rowCount;
	}
}

module.exports = UsersController;
