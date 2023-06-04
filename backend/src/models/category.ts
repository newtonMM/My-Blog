import sql from "../config/db-config";

interface ICategoryDetails {
  id: string;
  name: string;
}

export class Category {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  async save() {
    const query = `INSERT INTO category (id, name) VALUES (?,?) `;
    const values = [this.id, this.name];

    return new Promise(async (resolve, reject) => {
      sql.query(query, values, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    }).catch((err) => {
      const error = { code: err.code, failed: true, message: err.sqlMessage };
      throw error;
    });
  }

  static async update(params: ICategoryDetails) {
    const { name, id } = params;

    const query = `UPDATE category SET  name = ?  WHERE id="${id}"`;
    return new Promise(async (resolve, reject) => {
      sql.query(query, [name], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    }).catch((err) => {
      const error = { code: err.code, failed: true, message: err.sqlMessage };
      throw error;
    });
  }

  static deleteSeries = async (id: string) => {
    const query = `DELETE FROM category 
    WHERE id = "${id}"`;
    var values: Array<string>;
    return new Promise((resolve, reject) => {
      sql.query(query, values, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    }).catch((err) => {
      const error = { code: err.code, failed: true, message: err.sqlMessage };
      throw error;
    });
  };

  static findAll = async () => {
    const query = `SELECT * FROM category`;
    var values: Array<string>;
    return new Promise((resolve, reject) => {
      console.log(query);
      sql.query(query, values, (err, results) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(results);
      });
    }).catch((err) => {
      const error = { code: err.code, failed: true, message: err.sqlMessage };
      throw error;
    });
  };

  static findByID = async (id: string) => {
    const query = `SELECT * FROM category WHERE id="${id}"`;
    var values: Array<string>;
    return new Promise((resolve, reject) => {
      console.log(query);
      sql.query(query, values, (err, results) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(results);
      });
    }).catch((err) => {
      const error = { code: err.code, failed: true, message: err.sqlMessage };
      throw error;
    });
  };
}
