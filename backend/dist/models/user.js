"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const db_config_1 = __importDefault(require(".././config/db-config"));
class User {
    constructor(id, first_name, last_name, email, password, username, cover_image_url, profile_image_url) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.username = username;
        this.cover_image_url = cover_image_url;
        this.profile_image_url = profile_image_url;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("we are getting here");
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                db_config_1.default.db.getConnection((err, connection) => {
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
                        connection.query(profileQuery, [
                            this.id,
                            this.first_name,
                            this.last_name,
                            this.email,
                            this.cover_image_url,
                            this.profile_image_url,
                        ], (error, results, fields) => {
                            if (error) {
                                connection.rollback(() => {
                                    console.log("Transaction rollbacked !!!!");
                                    connection.release();
                                    reject(error);
                                });
                            }
                            console.log("this are the results", results);
                            connection.query(credentialsQuery, [this.id, this.username, this.password], (error, results, fields) => {
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
                            });
                        });
                    });
                });
            })).catch((err) => {
                const error = { code: err.code, failed: true, message: err.sqlMessage };
                throw error;
            });
        });
    }
    static findUserByUserName(username) {
        const query = `SELECT * FROM user_credentials WHERE username = "${username}"`;
        var values;
        return new Promise((resolve, reject) => {
            db_config_1.default.query(query, values, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results.rows[0]);
            });
        });
    }
    static findUserCredentials(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM user_credentials WHERE user_id="${id}"`;
            var values;
            return new Promise((resolve, reject) => {
                console.log(query);
                db_config_1.default.query(query, values, (err, results) => {
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
        });
    }
}
_a = User;
User.updateUserDetails = (userDetails, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, username, hashedPw, cover_image_url, profile_image_url, } = userDetails;
    var query;
    var values;
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
        db_config_1.default.db.getConnection((err, connection) => {
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
                    connection.query(credentialsQuery, [username, hashedPw], (error, results, fields) => {
                        if (error) {
                            connection.rollback(() => {
                                console.log("Transaction rollbacked on credentials update !!!!");
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
                    });
                });
            });
        });
    }).catch((err) => {
        const error = { code: err.code, failed: true, message: err.sqlMessage };
        throw error;
    });
});
User.findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM user_profile`;
    var values;
    return new Promise((resolve, reject) => {
        console.log(query);
        db_config_1.default.query(query, values, (err, results) => {
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
});
User.findByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM user_profile WHERE id="${id}"`;
    var values;
    return new Promise((resolve, reject) => {
        console.log(query);
        db_config_1.default.query(query, values, (err, results) => {
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
});
User.deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `DELETE FROM user_profile 
    WHERE id = "${id}"`;
    var values;
    return new Promise((resolve, reject) => {
        db_config_1.default.query(query, values, (err, results) => {
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
});
exports.User = User;
