import { rejects } from "assert";
import sql from "../config/db-config";
import { resolve } from "path";
import { error } from "console";

interface ISeriesDetails {
  id: string;
  name: string;
  description: string;
}

export class Series {
  id: string;
  name: string;
  description: string;

  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  async save() {
    const query = `INSERT INTO series (id, name, description) VALUES (?,?,?) `;
    const values = [this.id, this.name, this.description];

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

  static async update(params: ISeriesDetails) {
    const { name, description, id } = params;

    const query = `UPDATE series SET  name = ?, description =? WHERE id="${id}"`;
    return new Promise(async (resolve, reject) => {
      sql.query(query, [name, description], (err, results) => {
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

  static deleteSeries = async (id: string) => {
    const query = `DELETE FROM series 
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
    const query = `SELECT * FROM series`;
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
    const query = `SELECT * FROM series WHERE id="${id}"`;
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
