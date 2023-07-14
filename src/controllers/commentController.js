class CommentController {
	constructor(dbClient) {
		this.client = dbClient;
	}

	async getAllComment(pageNumber, limit=25) {
		let query = `
        SELECT c.id, c.content, 
        CASE
          WHEN c.created_at > c.updated_at THEN c.created_at
          ELSE c.updated_at
        END AS date,
        u.id as "id_user", u.username, u.avatar,
        t.id as "id_tutorial", t.title
        FROM commentary c
        JOIN users u ON c.id_user = u.id
        JOIN tutorial t ON c.id_tutorial = t.id
		ORDER BY date DESC`;
		const params = [];
		if(limit && pageNumber){
			const offset = (pageNumber - 1) * limit;
			query += ` ORDER BY t.created_at ${order} LIMIT \$1 OFFSET \$2`;
			params.push(limit);
			params.push(offset);
		}

		const { rows } = await this.client.query(query);
		const comments = rows.map((comment) => {
			const { id, content, date, id_user, username, avatar, id_tutorial, title } = comment;
			return {
				id,
				content,
				date,
				user: {
					id: id_user,
					username,
					avatar,
				},
				tutorial: {
					id: id_tutorial,
					title,
				},
			};
		});
		return comments;
	}

	async getComment(id) {
		const query = `
        SELECT c.id, c.content, 
        CASE
          WHEN c.created_at > c.updated_at THEN c.created_at
          ELSE c.updated_at
        END AS date,
        u.id as "id_user", u.username, u.avatar,
        t.id as "id_tutorial", t.title
        FROM commentary c
        JOIN users u ON c.id_user = u.id
        JOIN tutorial t ON c.id_tutorial = t.id
        WHERE c.id = $1`;

		const { rows } = await this.client.query(query, [id]);
		const comments = rows.map((comment) => {
			const { id, content, date, id_user, username, avatar, id_tutorial, title } = comment;
			return {
				id,
				content,
				date,
				user: {
					id: id_user,
					username,
					avatar,
				},
				tutorial: {
					id: id_tutorial,
					title,
				},
			};
		});
		return comments;
	}

	async getCommentByTutorial(id) {
		const query = `
        SELECT
        c.id,
        c.id_tutorial,
        u.id AS "id_users",
        u.username,
        u.avatar,
        c.content,
        CASE
          WHEN c.created_at > c.updated_at THEN c.created_at
          ELSE c.updated_at
        END AS date,
        c.parent_id
      FROM
        commentary c
        INNER JOIN users u ON c.id_user = u.id
      WHERE c.id_tutorial = \$1
      ORDER BY
        date DESC;      
        `;
		const { rows } = await this.client.query(query, [id]);
		const comments = this.buildCommentTree(rows);
		return comments;
	}

	async createComment(id_user, id_tutorial, content, parent_id) {
		const query = `
        INSERT INTO commentary (id_user, id_tutorial, content, parent_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id, id_user, id_tutorial, content, parent_id, created_at
        `;
		const { rows } = await this.client.query(query, [id_user, id_tutorial, content, parent_id]);
		return rows[0];
	}

	async updateComment(id, content) {
		const query = `
        UPDATE commentary
        SET content = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, id_user, id_tutorial, content, parent_id, updated_at`;
		const { rows } = await this.client.query(query, [content, id]);
		return rows[0];
	}

	async deleteComment(id) {
		const query = `
        DELETE FROM commentary
        WHERE id = $1`;
		await this.client.query(query, [id]);
	}

	// recursive function to build tree
	buildCommentTree(comments, parentId = null) {
		const tree = [];

		comments
			.filter((comment) => comment.parent_id == parentId)
			.forEach((comment) => {
				console.log(comment);
				const node = {
					id: comment.id,
					tutorial: comment.id_tutorial,
					user: {
						id: comment.id_users,
						username: comment.username,
						avatar: comment.avatar,
					},
					content: comment.content,
					date: comment.date,
					res: this.buildCommentTree(comments, comment.id),
				};
				tree.push(node);
			});

		return tree;
	}
}

module.exports = CommentController;
