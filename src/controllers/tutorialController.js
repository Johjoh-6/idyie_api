class TutorialController {
	constructor(dbClient) {
		this.client = dbClient;
	}

	async getAllTutorial( pageNumber, draft = false, limit = 25 , order = 'DESC') {
		let query = `SELECT t.id, t.title, t.content, t.view_count, t.durate, t.created_at, t.draft,
		u.id as "id_users", u.username, u.avatar,
		c.id as "category_id", c.name, r.avg_rating, cmt.comment_count
		FROM tutorial t
		JOIN users u ON t.id_users = u.id
		JOIN categorie c ON t.id_category = c.id
		LEFT JOIN (
			SELECT id_tutorial, AVG(rating_value) as avg_rating
			FROM rating
			GROUP BY id_tutorial
		) r ON t.id = r.id_tutorial
		LEFT JOIN (
			SELECT commentary.id_tutorial, COUNT(commentary.id) as comment_count
			FROM commentary
			GROUP BY commentary.id_tutorial
		)	cmt ON t.id = cmt.id_tutorial
		WHERE banned = false`;
		const params = [];
		if(draft){
			query += " AND t.draft = false";
		}
		if(limit && pageNumber){
			const offset = (pageNumber - 1) * limit;
			query += ` ORDER BY t.created_at ${order} LIMIT \$1 OFFSET \$2`;
			params.push(limit);
			params.push(offset);
		}
	
		const { rows } = await this.client.query(query, params);
		const tutorials = this.setTutorialModel(rows);
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
            WHERE c.id = $1 AND t.draft = false AND banned = false`;
		const { rows } = await this.client.query(query, [id_category]);
		const tutorials = this.setTutorialModel(rows);
		return tutorials;
	}

	async getTutorial(id) {
		const query = `SELECT t.id, t.title, t.content, t.view_count, t.durate, t.created_at, t.draft,
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
		const tutorial = this.setTutorialModel(rows);
		return tutorial;
	}

	async createTutorial(id_users, id_category, title, content, durate) {
		const query =
			"INSERT INTO tutorial(id_users, id_category, title, content, view_count, durate, created_at, updated_at) VALUES($1, $2, $3, $4, 0, $5, NOW(), NOW()) RETURNING *";
		const { rows } = await this.client.query(query, [id_users, id_category, title, content, durate]);
		return rows;
	}

	async updateTutorial(id, id_category, title, content, durate, draft = false) {
		const query = `UPDATE tutorial SET 
        id_category = COALESCE(\$1, id_category), 
        title = COALESCE(\$2,title), 
        content = COALESCE(\$3, content), 
        durate = COALESCE(\$4, durate),
        updated_at = NOW(),
		draft = COALESCE(\$5, draft) WHERE id = $6 RETURNING *`;
		const { rows } = await this.client.query(query, [id_category, title, content, durate, draft, id]);
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

	async getTutorialByUser(id_users) {
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
		WHERE u.id = $1 AND banned = false`;
		const { rows } = await this.client.query(query, [id_users]);
		const tutorials = this.setTutorialModel(rows);
		return tutorials;
	}

	setTutorialModel = (rows) => {
		return rows.map((tutorial) => {
			const {
				id,
				title,
				content,
				avg_rating,
				view_count,
				comment_count,
				durate,
				created_at,
				id_users,
				username,
				avatar,
				category_id,
				name,
				draft,
			} = tutorial;
			return {
				id,
				title,
				content,
				view_count,
				avg_rating,
				comment_count : comment_count || 0,
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
				draft,
			};
		});
	};
}

module.exports = TutorialController;
