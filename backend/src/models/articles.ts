import sql from "../config/db-config";

interface IArticleDetails {
  id: string;
  image_url: string;
  content: string;
  category_id: string | null;
  series_id: string | null;
  author_id: string;
  title: string;
}
interface IArticleUpdateDetails {
  id: string;
  image_url: string;
  content: string;
  category_id: string | null;
  title: string;
}

export class Articles {
  id: string;
  image_url: string;
  content: string;
  category_id: string;
  series_id: string | null;
  author_id: string;
  title: string;

  constructor(
    id: string,
    image_url: string,
    content: string,
    category_id: string,
    series_id: string | null,
    author_id: string,
    title: string
  ) {
    this.id = id;
    this.image_url = image_url;
    this.content = content;
    this.category_id = category_id;
    this.series_id = series_id;
    this.author_id = author_id;
    this.title = title;
  }

  async save() {
    var query: string;
    var values: Array<string | null>;

    if (this.series_id) {
      query = `INSERT INTO articles (id, image_url,title, content,category_id,series_id,author_id,date_published,date_updated) VALUES (?,?,?,?,?,?,?,NOw(),NOW())`;
      values = [
        this.id,
        this.image_url,
        this.title,
        this.content,
        this.category_id,
        this.series_id,
        this.author_id,
      ];
    }
    if (!this.series_id) {
      query = `INSERT INTO articles (id, image_url,title, content,category_id,author_id) VALUES (?,?,?,?,?,?)`;
      values = [
        this.id,
        this.image_url,
        this.title,
        this.content,
        this.category_id,
        this.author_id,
      ];
    }

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
      return error;
    });
  }

  static async update(params: IArticleUpdateDetails) {
    const { id, image_url, content, title, category_id } = params;

    const query = `UPDATE articles SET  image_url = ?, content = ?, title = ?, category_id = ?, date_updated=NOW() WHERE id="${id}"`;
    return new Promise(async (resolve, reject) => {
      sql.query(
        query,
        [image_url, content, title, category_id],
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
      return error;
    });
  }

  static deleteArticle = async (id: string) => {
    const query = `DELETE FROM articles 
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
      return error;
    });
  };

  static findAll = async () => {
    const query = `SELECT * FROM articles`;
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
      return error;
    });
  };

  static findByID = async (id: string) => {
    const query = `SELECT * FROM articles WHERE id="${id}"`;
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
      return error;
    });
  };
}
