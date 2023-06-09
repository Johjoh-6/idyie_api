class CategorieController {
	constructor(dbClient) {
		this.client = dbClient;
	}

	async getAllCategorie() {
		const { rows } = await this.client.query(`WITH RECURSIVE category_tree AS (
            SELECT id, name, id_category_parent, 0 as level
            FROM categorie
            WHERE id_category_parent IS NULL
            UNION ALL
            SELECT c.id, c.name, c.id_category_parent, ct.level + 1 as level
            FROM categorie c
            JOIN category_tree ct ON c.id_category_parent = ct.id
          )
          SELECT * FROM category_tree
          ORDER BY level, id;
          `);
		const categories = this.buildCategoryTree(rows);
		return categories;
	}

	async getCategorie(id) {
		const { rows } = await this.client.query("SELECT * FROM categorie WHERE id=$1", [id]);
		return rows;
	}

	async createCategorie(name, parent = null) {
		const exist = await this.client.query("SELECT * FROM categorie WHERE name=$1", [name]);
		if (exist.rowCount > 0) {
			throw new Error("Categorie already exist");
		}
		if (parent != null) {
			const existParent = await this.client.query("SELECT * FROM categorie WHERE id=$1", [parent]);
			if (existParent.rowCount === 0) {
				throw new Error("Parent categorie not exist");
			}
		}
		const { rows } = await this.client.query(
			"INSERT INTO categorie (name, id_category_parent) VALUES ($1, $2) RETURNING *",
			[name, parent],
		);
		return rows;
	}

	async updateCategorie(id, name, parent = null) {
		const exist = await this.client.query("SELECT * FROM categorie WHERE name=$1", [id]);
		if (exist.rowCount > 0) {
			throw new Error("Categorie already exist");
		}
		const query = `
          UPDATE categorie SET
            name = COALESCE(\$1, name),
            id_category_parent = COALESCE(\$2, id_category_parent)
          WHERE id = \$3
          RETURNING *`;
		try {
			const { rows } = await this.client.query(query, [name, parent, id]);
			return rows;
		} catch (err) {
			throw new Error(err);
		}
	}

	async deleteCategorie(id) {
		// delete in cascade if id exist in id_category_parent

		const rows = await this.client.query("DELETE FROM categorie WHERE id=$1", [id]);
		return rows.rowCount;
	}

	// recursive function to build tree
	buildCategoryTree(categories, parentId = null) {
		const tree = [];

		categories
			.filter((category) => category.id_category_parent == parentId)
			.forEach((category) => {
				const node = {
					id: category.id,
					name: category.name,
					sub: this.buildCategoryTree(categories, category.id),
				};
				tree.push(node);
			});

		return tree;
	}
}

module.exports = CategorieController;
