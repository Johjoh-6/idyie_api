class CategorieController {
    constructor(dbClient) {
        this.client = dbClient;
    }

    async getAllCategories() {
        const { rows } = await this.client.query('SELECT * FROM categorie ORDER BY id ASC');
        return rows;
    }

    async getCategorie(id) {
        const { rows } = await this.client.query('SELECT * FROM categorie WHERE id=$1', [id])
        return rows;
    }

    async getCategoryRecursive(id) {
        const { rows } = await this.client.query('WITH RECURSIVE subcategories AS (SELECT * FROM categorie WHERE id=$1 UNION ALL SELECT c.* FROM categorie c JOIN subcategories s ON c.id_category_parent = s.id) SELECT * FROM subcategories', [id])
        return rows;
    }

    async createCategorie(name, parent = null) {
        const  exist  = await this.client.query('SELECT * FROM categorie WHERE name=$1', [id]);
        if (exist.rowCount > 0) {
            throw new Error("Categorie already exist");
        }
        const { rows } = await this.client.query('INSERT INTO categorie (name, id_category_parent) VALUES ($1, $2) RETURNING *', [name, parent])
        return rows;
    }

    async updateCategorie(id, name, parent = null) {
        const  exist  = await this.client.query('SELECT * FROM categorie WHERE name=$1', [id]);
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
        
        const  rows  = await this.client.query('DELETE FROM categorie WHERE id=$1', [id]);
        return rows.rowCount;
    }
}

module.exports = CategorieController;