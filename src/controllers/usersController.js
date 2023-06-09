const hashPassword = require("../utils/hashPaswword");

class UsersController {
    constructor(dbClient) {
        this.client = dbClient;
    }

    async getAllUsers() {
        const { rows } = await this.client.query('SELECT * FROM users ORDER BY id ASC');
        return rows;
    }

    async getUser(id) {
        const { rows } = await this.client.query('SELECT * FROM users WHERE id=$1', [id])
        return rows[0];
    }

    async createUser(username, f_name, l_name, email, password, role, avatar) {
		const hashedPassword = await hashPassword(password);
        const { rows } = await this.client.query('INSERT INTO users (username, f_name, l_name, email, password, role, avatar, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *', [username, f_name, l_name, email, hashedPassword, role, avatar])
        return rows;
    }

    async updateUser(id, username, f_name, l_name, email, password, role, avatar) {
        const query = `
          UPDATE users SET
            username = COALESCE(\$1, username),
            f_name = COALESCE(\$2, f_name),
            l_name = COALESCE(\$3, l_name),
            email = COALESCE(\$4, email),
            password = COALESCE(\$5, password),
            role = COALESCE(\$6, role),
            avatar = COALESCE(\$7, avatar),
            updated_at = NOW()
          WHERE id = \$8
          RETURNING *`;
        try {
            const hashedPassword = await hashPassword(password);
          const { rows } = await this.client.query(query, [username, f_name, l_name, email, hashedPassword, role, avatar, id]);
          return rows;
        } catch (err) {
          throw new Error(err);
        }
    }

    async deleteUser(id) {
        const  rows  = await this.client.query('DELETE FROM users WHERE id=$1', [id]);
        return rows.rowCount;
    }
}

module.exports = UsersController;

