import sql from ".././config/db-config";

interface UpdatedUserInterface {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  hashedPw: string;
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
          const profileQuery = `INSERT INTO user_profile (id, first_name, last_name, email, cover_image, profile_image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
          console.log(profileQuery);
          const credentialsQuery = `INSERT INTO user_credentials (user_id, username, password) VALUES (?, ?, ?)`;
          console.log(credentialsQuery);

          connection.query(
            profileQuery,
            [
              this.id,
              this.first_name,
              this.last_name,
              this.email,
              this.cover_image_url,
              this.profile_image_url,
            ],
            (error, results, fields) => {
              if (error) {
                connection.rollback(() => {
                  console.log("Transaction rollbacked !!!!");
                  connection.release();
                  reject(error);
                  return;
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
                      return;
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
            }
          );
        });
      });
    }).catch((err) => {
      const error = { code: err.code, failed: true, message: err.sqlMessage };
      throw error;
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
      hashedPw,
      cover_image_url,
      profile_image_url,
    } = userDetails;

    var query: string;
    var values: Array<string | null>;
    if (cover_image_url === undefined && profile_image_url === undefined) {
      query = `UPDATE user_profile SET first_name = ?, last_name= ?, email= ?  WHERE id="${id}" `;
      values = [first_name, last_name, email];
    }
    if (profile_image_url !== undefined && cover_image_url === undefined) {
      query = `UPDATE user_profile SET first_name = ?, last_name= ?, email= ? , profile_image = ? WHERE id="${id}" `;
      values = [first_name, last_name, email, profile_image_url];
    }
    if (cover_image_url !== undefined && profile_image_url === undefined) {
      query = `UPDATE user_profile SET first_name = ?, last_name= ?, email= ? , cover_image = ? WHERE id="${id}" `;
      values = [first_name, last_name, email, cover_image_url];
    }
    if (cover_image_url !== undefined && profile_image_url !== undefined) {
      query = `UPDATE user_profile SET first_name = ?, last_name= ?, email= ? , profile_image = ?, cover_image = ? WHERE id="${id}" `;
      values = [
        first_name,
        last_name,
        email,
        profile_image_url,
        cover_image_url,
      ];
    }
    var credentialsQuery = `UPDATE user_credentials SET username = ?, password = ? `;

    return new Promise((resolve, reject) => {
      sql.db.getConnection((err, connection) => {
        connection.beginTransaction((err) => {
          if (err) {
            reject(err);
          }
          connection.query(query, values, (error, results, fields) => {
            if (error) {
              connection.rollback(() => {
                console.log("Transaction rollbacked on profile details !!!!");
                connection.release();
                reject(error);
              });
            }

            connection.query(
              credentialsQuery,
              [username, hashedPw],
              (error, results, fields) => {
                if (error) {
                  connection.rollback(() => {
                    console.log(
                      "Transaction rollbacked on credentials update !!!!"
                    );
                    connection.release();
                    reject(error);
                  });
                }
                connection.commit((error) => {
                  if (error) {
                    connection.rollback(() => {
                      console.log("Transaction rollbacked !!!!");
                      connection.release();
                      reject(error);
                    });
                  }
                  connection.release();
                  resolve({ message: "user updated ok " });
                });
              }
            );
          });
        });
      });
    }).catch((err) => {
      const error = { code: err.code, failed: true, message: err.sqlMessage };
      throw error;
    });
  };

  static findUserByUserName(username: string) {
    const query = `SELECT * FROM user_credentials WHERE username = "${username}"`;
    var values: Array<string>;

    return new Promise((resolve, reject) => {
      sql.query(query, values, (err, results) => {
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
    const query = `SELECT * FROM user_profile WHERE id="${id}"`;
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

  static deleteUser = async (id: string) => {
    const query = `DELETE FROM user_profile 
    WHERE id = "${id}"`;
    var values: Array<string>;
    return new Promise((resolve, reject) => {
      sql.query(query, null, (err, results) => {
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

  static async findUserCredentials(id: string) {
    const query = `SELECT * FROM user_credentials WHERE user_id="${id}"`;
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
}
