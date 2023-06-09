const hashPassword = require("../utils/hashPaswword");

class UsersController {
	constructor(dbClient) {
		this.client = dbClient;
	}

	async getAllUsers() {
		const { rows } = await this.client.query("SELECT * FROM users ORDER BY id ASC");
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

	async updateUser(id, username, f_name, l_name, email, password, role, avatar, ban = "") {
		const query = `
        UPDATE users SET
            username = COALESCE(\$1, username),
            f_name = COALESCE(\$2, f_name),
            l_name = COALESCE(\$3, l_name),
            email = CASE WHEN \$4 = '' THEN email ELSE COALESCE(\$4, email) END,
            password = CASE WHEN \$5 = '' THEN password ELSE COALESCE(\$5, password) END,
            role = COALESCE(\$6, role),
            avatar = COALESCE(\$7, avatar),
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
				role,
				avatar,
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
