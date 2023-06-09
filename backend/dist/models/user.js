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
            })).catch((error) => {
                console.log("this is the error from catch", error);
            });
        });
    }
    static findUserByUserName(username) {
        const query = `SELECT * FROM user_credentials WHERE username = "${username}"`;
        return new Promise((resolve, reject) => {
            db_config_1.default.query(query, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results.rows[0]);
            });
        });
    }
}
_a = User;
User.updateUserDetails = (userDetails, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, username, cover_image_url, profile_image_url, } = userDetails;
    var query;
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
        db_config_1.default.query(query, (err, results) => {
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
});
User.findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM user_profile`;
    return new Promise((resolve, reject) => {
        console.log(query);
        db_config_1.default.query(query, (err, results) => {
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
});
User.findByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM user_profile WHERE id="${id}"`;
    return new Promise((resolve, reject) => {
        console.log(query);
        db_config_1.default.query(query, (err, results) => {
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
});
User.deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `DELETE FROM user_profile 
    WHERE id = "${id}"`;
    return new Promise((resolve, reject) => {
        db_config_1.default.query(query, (err, results) => {
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
});
exports.User = User;
