class CommentController {
    constructor(dbClient) {
        this.client = dbClient;
    }

    async getAllComment() {
        const query = `
        SELECT c.id, c.content, c.created_at,
        u.id as "id_user", u.username, u.avatar,
        t.id as "id_tutorial", t.title
        FROM commentary c
        JOIN users u ON c.id_user = u.id
        JOIN tutorial t ON c.id_tutorial = t.id`;

        const { rows } = await this.client.query(query);
        const comments = rows.map((comment) => {
            const { id, content, created_at, id_user, username, avatar, id_tutorial, title } = comment;
            return {
                id,
                content,
                created_at,
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
        }
        );
        return comments;
    }

    async getComment(id) {
        const query = `
        SELECT c.id, c.content, c.created_at,
        u.id as "id_user", u.username, u.avatar,
        t.id as "id_tutorial", t.title
        FROM commentary c
        JOIN users u ON c.id_user = u.id
        JOIN tutorial t ON c.id_tutorial = t.id
        WHERE c.id = $1`;

        const { rows } = await this.client.query(query, [id]);
        const comments = rows.map((comment) => {
            const { id, content, created_at, id_user, username, avatar, id_tutorial, title } = comment;
            return {
                id,
                content,
                created_at,
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
        u.id AS "user.id",
        u.username AS "user.username",
        u.avatar AS "user.avatar",
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
    
     // recursive function to build tree
     buildCommentTree(comments, parentId = null) {
        const tree = [];
      
        comments
        .filter(comment => comment.parent_id == parentId)
          .forEach(comment => {
            const node = {
              id: comment.id,
              tutorial: {
                id: comment.id_tutorial,
                title: comment.title,
              },
                user: {
                    id: comment.id_user,
                    username: comment.username,
                    avatar: comment.avatar,
                },
                content: comment.content,
                date: comment.date,
              response: this.buildCommentTree(comments, comment.id),
            };
            tree.push(node);
          });
      
        return tree;
      }
}

module.exports = CommentController;