class RatingController {
	constructor(dbClient) {
		this.client = dbClient;
	}

	async getAllRating() {
		const query = ` SELECT r.id, r.rating_value, r.created_at, r.updated_at,
        u.id as "id_user", u.username, u.avatar,
        t.id as "id_tutorial", t.title, t.created_at as "created_at_tutorial"
        FROM rating r
        JOIN users u ON r.id_user = u.id
        JOIN tutorial t ON r.id_tutorial = t.id`;

		const { rows } = await this.client.query(query);
		console.log(rows);
		const ratings = rows.map((rating) => {
			const { id, rating_value, created_at, id_user, username, avatar, id_tutorial, title, updated_at, created_at_tutorial } = rating;
			return {
				id,
				value: rating_value,
				user: {
					id: id_user,
					username,
					avatar,
				},
				tutorial: {
					id: id_tutorial,
					title,
					created_at: created_at_tutorial,
				},
				created_at,
				updated_at
			};
		});
		return ratings;
	}

	async getRating(id) {
		const query = ` SELECT r.id, r.rating_value, r.created_at, r.updated_at,
        u.id as "id_user", u.username, u.avatar,
        t.id as "id_tutorial", t.title, t.created_at as "created_at_tutorial"
        FROM rating r
        JOIN users u ON r.id_user = u.id
        JOIN tutorial t ON r.id_tutorial = t.id
        WHERE r.id = $1`;

		const { rows } = await this.client.query(query, [id]);
		const ratings = rows.map((rating) => {
			const { id, rating_value, created_at, id_user, username, avatar, id_tutorial, title,  updated_at, created_at_tutorial  } = rating;
			return {
				id,
				value: rating_value,
				user: {
					id: id_user,
					username,
					avatar,
				},
				tutorial: {
					id: id_tutorial,
					title,
					created_at: created_at_tutorial,
				},
				created_at,
				updated_at
			};
		});
		return ratings;
	}

	async getRatingByTutorial(id) {
		const query = ` SELECT r.id, r.rating_value, r.created_at, r.updated_at,
		u.id as "id_user", u.username, u.avatar,
		t.id as "id_tutorial", t.title, t.created_at as "created_at_tutorial"
		FROM rating r
		JOIN users u ON r.id_user = u.id
		JOIN tutorial t ON r.id_tutorial = t.id
		WHERE r.id_tutorial = $1`;

		const { rows } = await this.client.query(query, [id]);
		if(rows.length <= 0) {
			return undefined;
		}
		const ratings = rows.map((rating) => {
			const { id, rating_value, created_at, id_user, username, avatar, id_tutorial, title,  updated_at, created_at_tutorial  } = rating;
			return {
				id,
				value: rating_value,
				user: {
					id: id_user,
					username,
					avatar,
				},
				tutorial: {
					id: id_tutorial,
					title,
					created_at: created_at_tutorial,
				},
				created_at,
				updated_at
			};
		});
		return ratings[0];
	}

	async createRating(rating_value, id_users, id_tutorial) {
		const exist = await this.client.query("SELECT * FROM rating WHERE id_user = $1 AND id_tutorial = $2", [
			id_users,
			id_tutorial,
		]);
		if (exist.rows.length > 0) {
			throw new Error("Rating already exist");
		}
		const query =
			"INSERT INTO rating (rating_value, id_user, id_tutorial, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *";
		const values = [rating_value, id_users, id_tutorial];
		const { rows } = await this.client.query(query, values);
		return rows[0];
	}

	async updateRating(id, value) {
		const query = "UPDATE rating SET rating_value = $1, updated_at = NOW() WHERE id = $2 RETURNING *";
		const values = [value, id];
		const { rows } = await this.client.query(query, values);
		return rows[0];
	}

	async deleteRating(id) {
		const query = "DELETE FROM rating WHERE id = $1 RETURNING *";
		const values = [id];
		const { rows } = await this.client.query(query, values);
		return rows;
	}
}

module.exports = RatingController;
