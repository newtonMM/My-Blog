import { error } from "console";
import sql from ".././config/db-config";
import { Query } from "mysql2";

interface UpdatedUserInterface {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  cover_image_url: string | null;
  profile_image_url: string | null;
}

export class User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  username: string;
  cover_image_url: string | null;
  profile_image_url: string | null;

  constructor(
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    username: string,
    cover_image_url: string | null,
    profile_image_url: string | null
  ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.username = username;
    this.cover_image_url = cover_image_url;
    this.profile_image_url = profile_image_url;
  }

  async save() {
    console.log("we are getting here");
    return new Promise(async (resolve, reject) => {
      sql.db.getConnection((err, connection) => {
        if (err) {
          reject(err);
        }
        connection.beginTransaction((err) => {
          if (err) {
            reject(err);
          }
          const profileQuery = `INSERT INTO user_profile (id, first_name, last_name, email, cover_image, profile_image, created_at, updated_at) VALUES ('${this.id}', '${this.first_name}', '${this.last_name}', '${this.email}', '${this.cover_image_url}', '${this.profile_image_url}', NOW(), NOW())`;
          console.log(profileQuery);
          const credentialsQuery = `INSERT INTO user_credentials (user_id, username, password) VALUES (?, ?, ?)`;
          console.log(credentialsQuery);

          connection.query(profileQuery, (error, results, fields) => {
            if (error) {
              connection.rollback(() => {
                console.log("Transaction rollbacked !!!!");
                connection.release();
                reject(error);
              });
            }
            console.log("this are the results", results);

            connection.query(
              credentialsQuery,
              [this.id, this.username, this.password],
              (error, results, fields) => {
                if (error) {
                  connection.rollback(() => {
                    console.log("Transaction rollbacked !!!!");
                    connection.release();
                    reject(error);
                  });
                }
                console.log("trying to", results);
                connection.commit((error) => {
                  if (error) {
                    connection.rollback(() => {
                      console.log("Transaction rollbacked !!!!");
                      connection.release();
                      reject(error);
                    });
                  }
                  connection.release();
                  resolve({ message: "user saved ok " });
                });
              }
            );
          });
        });
      });
    }).catch((error) => {
      console.log("this is the error from catch", error);
    });
  }

  static updateUserDetails = async (
    userDetails: UpdatedUserInterface,
    id: string
  ) => {
    const {
      first_name,
      last_name,
      email,
      username,
      cover_image_url,
      profile_image_url,
    } = userDetails;
    var query: string;
    if (cover_image_url === undefined && profile_image_url === undefined) {
      query = `UPDATE user_profile SET first_name = '${first_name}', last_name='${last_name}', email='${email}' WHERE id="${id}" `;
    }
    if (profile_image_url !== undefined && cover_image_url === undefined) {
      query = `UPDATE user_profile SET first_name = '${first_name}', last_name='${last_name}', email='${email}', profile_image ="${profile_image_url}" WHERE id="${id}" `;
    }
    if (cover_image_url !== undefined && profile_image_url === undefined) {
      query = `UPDATE user_profile SET first_name = '${first_name}', last_name='${last_name}', email='${email}', cover_image ="${cover_image_url}" WHERE id="${id}" `;
    }
    if (cover_image_url !== undefined && profile_image_url !== undefined) {
      query = `UPDATE user_profile SET first_name = '${first_name}', last_name='${last_name}', email='${email}', profile_image ="${profile_image_url}", cover_image ="${cover_image_url}" WHERE id="${id}" `;
    }

    return new Promise((resolve, reject) => {
      console.log(query);
      sql.query(query, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(results);
        resolve(results);
      });
    }).catch((err) => {
      const error = { code: err.code, failed: true, message: err.sqlMessage };
      return error;
    });
  };

  static findUserByUserName(username: string) {
    const query = `SELECT * FROM user_credentials WHERE username = "${username}"`;

    return new Promise((resolve, reject) => {
      sql.query(query, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results.rows[0]);
      });
    });
  }

  static findAll = async () => {
    const query = `SELECT * FROM user_profile`;
    return new Promise((resolve, reject) => {
      console.log(query);
      sql.query(query, (err, results) => {
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
    const query = `SELECT * FROM user_profile WHERE id="${id}"`;
    return new Promise((resolve, reject) => {
      console.log(query);
      sql.query(query, (err, results) => {
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

  static deleteUser = async (id: string) => {
    const query = `DELETE FROM user_profile 
    WHERE id = "${id}"`;
    return new Promise((resolve, reject) => {
      sql.query(query, (err, results) => {
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
