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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comments = void 0;
const db_config_1 = __importDefault(require("../config/db-config"));
class Comments {
    constructor(comment, article_id, user_prof_id) {
        this.comment = comment;
        this.article_id = article_id;
        this.user_prof_id = user_prof_id;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "INSERT INTO comments (comment, article_id,user_prof_id) VALUES (?,?,?)";
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                db_config_1.default.query(query, [this.comment, this.article_id, this.user_prof_id], (err, results) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(results);
                });
            })).catch((err) => {
                const error = { code: err.code, failed: true, message: err.sqlMessage };
                throw error;
            });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM comments 
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
    }
    static findAll(article_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM comments WHERE article_id = "${article_id}"`;
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
    static findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM comments WHERE id="${id}"`;
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
    static update(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { comment, id } = params;
            const query = `UPDATE comments SET  comment = ? WHERE id=${id}`;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                db_config_1.default.query(query, [comment], (err, results) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(results);
                });
            })).catch((err) => {
                const error = { code: err.code, failed: true, message: err.sqlMessage };
                throw error;
            });
        });
    }
}
exports.Comments = Comments;
