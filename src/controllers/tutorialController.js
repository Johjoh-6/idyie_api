class TutorialController {
	constructor(dbClient) {
		this.client = dbClient;
	}

	async getAllTutorial(preference) {
		// select 3 tutorial from the same category as the user preference
		let query = `SELECT t.id, t.title, t.content, t.view_count, t.durate, t.created_at,
		u.id as "id_users", u.username, u.avatar,
		c.id as "category_id", c.name, r.avg_rating
		FROM tutorial t
		JOIN users u ON t.id_users = u.id
		JOIN categorie c ON t.id_category = c.id
		LEFT JOIN (
			SELECT id_tutorial, AVG(rating_value) as avg_rating
			FROM rating
			GROUP BY id_tutorial
		) r ON t.id = r.id_tutorial`;
		const params = [];
		if (preference) {
			query += " WHERE c.id = $1";
			params.push(preference);
		}

		const { rows } = await this.client.query(query, params);
		const tutorials = rows.map((tutorial) => {
			const {
				id,
				title,
				content,
				avg_rating,
				view_count,
				durate,
				created_at,
				id_users,
				username,
				avatar,
				category_id,
				name,
			} = tutorial;
			return {
				id,
				title,
				content,
				view_count,
				avg_rating,
				durate,
				created_at,
				user: {
					id: id_users,
					username,
					avatar,
				},
				categorie: {
					id: category_id,
					name,
				},
			};
		});
		return tutorials;
	}

	async getTutorialByCategory(id_category) {
		const query = `SELECT t.id, t.title, t.content, t.view_count, t.durate, t.created_at,
         u.id as "id_users", u.username, u.avatar,
            c.id as "category_id", c.name, r.avg_rating
            FROM tutorial t
            JOIN users u ON t.id_users = u.id
            JOIN categorie c ON t.id_category = c.id
            LEFT JOIN (
                SELECT id_tutorial, AVG(rating_value) as avg_rating
                FROM rating
                GROUP BY id_tutorial
            ) r ON t.id = r.id_tutorial
            WHERE c.id = $1`;
		const { rows } = await this.client.query(query, [id_category]);
		const tutorials = rows.map((tutorial) => {
			const {
				id,
				title,
				content,
				avg_rating,
				view_count,
				durate,
				created_at,
				id_users,
				username,
				avatar,
				category_id,
				name,
			} = tutorial;
			return {
				id,
				title,
				content,
				view_count,
				avg_rating,
				durate,
				created_at,
				user: {
					id: id_users,
					username,
					avatar,
				},
				categorie: {
					id: category_id,
					name,
				},
			};
		});
		return tutorials;
	}

	async getTutorial(id) {
		const query = `SELECT t.id, t.title, t.content, t.view_count, t.durate, t.created_at,
        u.id as "id_users", u.username, u.avatar,
        c.id as "category_id", c.name, r.avg_rating
        FROM tutorial t
        JOIN users u ON t.id_users = u.id
        JOIN categorie c ON t.id_category = c.id
        LEFT JOIN (
            SELECT id_tutorial, AVG(rating_value) as avg_rating
            FROM rating
            GROUP BY id_tutorial
        ) r ON t.id = r.id_tutorial
        WHERE t.id = $1`;

		const { rows } = await this.client.query(query, [id]);
		const tutorial = rows.map((tutorial) => {
			const {
				id,
				title,
				content,
				avg_rating,
				view_count,
				durate,
				created_at,
				id_users,
				username,
				avatar,
				category_id,
				name,
			} = tutorial;
			return {
				id,
				title,
				content,
				view_count,
				avg_rating,
				durate,
				created_at,
				user: {
					id: id_users,
					username,
					avatar,
				},
				categorie: {
					id: category_id,
					name,
				},
			};
		});
		return tutorial;
	}

	async createTutorial(id_users, id_category, title, content, durate) {
		const query =
			"INSERT INTO tutorial(id_users, id_category, title, content, view_count, durate, created_at, updated_at) VALUES($1, $2, $3, $4, 0, $5, NOW(), NOW()) RETURNING *";
		const { rows } = await this.client.query(query, [id_users, id_category, title, content, durate]);
		return rows;
	}

	async updateTutorial(id, id_category, title, content, durate) {
		const query = `UPDATE tutorial SET 
        id_category = COALESCE(\$1, id_category), 
        title = COALESCE(\$2,title), 
        content = COALESCE(\$3, content), 
        durate = COALESCE(\$4, durate),
        updated_at = NOW() WHERE id = $5 RETURNING *`;
		const { rows } = await this.client.query(query, [id_category, title, content, durate, id]);
		return rows;
	}

	async deleteTutorial(id) {
		const query = "DELETE FROM tutorial WHERE id = $1 RETURNING *";

		const { rows } = await this.client.query(query, [id]);

		return rows;
	}

	async addViewCount(id) {
		const query = "UPDATE tutorial SET view_count = view_count + 1 WHERE id = $1 RETURNING *";
		const rows = await this.client.query(query, [id]);
		return rows.rowCount > 0;
	}
}

module.exports = TutorialController;
