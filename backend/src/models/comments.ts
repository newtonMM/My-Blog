import sql from "../config/db-config";

interface ICommentsDetails {
  id: number;
  comment: string;
}

export class Comments {
  comment: string;
  article_id: string;
  user_prof_id: string;

  constructor(comment: string, article_id: string, user_prof_id: string) {
    this.comment = comment;
    this.article_id = article_id;
    this.user_prof_id = user_prof_id;
  }

  async save() {
    const query =
      "INSERT INTO comments (comment, article_id,user_prof_id) VALUES (?,?,?)";
    return new Promise(async (resolve, reject) => {
      sql.query(
        query,
        [this.comment, this.article_id, this.user_prof_id],
        (err, results) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        }
      );
    }).catch((err) => {
      const error = { code: err.code, failed: true, message: err.sqlMessage };
      throw error;
    });
  }

  static async delete(id: number) {
    const query = `DELETE FROM comments 
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
  }
  static async findAll(article_id: string) {
    const query = `SELECT * FROM comments WHERE article_id = "${article_id}"`;
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
  }
  static async findOne(id: number) {
    const query = `SELECT * FROM comments WHERE id="${id}"`;
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
  }
  static async update(params: ICommentsDetails) {
    const { comment, id } = params;

    const query = `UPDATE comments SET  comment = ? WHERE id=${id}`;
    return new Promise(async (resolve, reject) => {
      sql.query(query, [comment], (err, results) => {
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
}
