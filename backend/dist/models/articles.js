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
exports.Articles = void 0;
const db_config_1 = __importDefault(require("../config/db-config"));
class Articles {
    constructor(id, image_url, content, category_id, series_id, author_id, title) {
        this.id = id;
        this.image_url = image_url;
        this.content = content;
        this.category_id = category_id;
        this.series_id = series_id;
        this.author_id = author_id;
        this.title = title;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            var query;
            var values;
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
                query = `INSERT INTO articles (id, image_url,title, content,category_id,author_id,date_published,date_updated) VALUES (?,?,?,?,?,?,NOw(),NOW())`;
                values = [
                    this.id,
                    this.image_url,
                    this.title,
                    this.content,
                    this.category_id,
                    this.author_id,
                ];
            }
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                db_config_1.default.query(query, values, (err, results) => {
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
    static update(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, image_url, content, title, category_id } = params;
            const query = `UPDATE articles SET  image_url = ?, content = ?, title = ?, category_id = ?, date_updated=NOW() WHERE id="${id}"`;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                db_config_1.default.query(query, [image_url, content, title, category_id], (err, results) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(results);
                });
            })).catch((err) => {
                const error = { code: err.code, message: err.sqlMessage };
                throw error;
            });
        });
    }
}
_a = Articles;
Articles.deleteArticle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `DELETE FROM articles 
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
Articles.findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM articles`;
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
Articles.findByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM articles WHERE id="${id}"`;
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
exports.Articles = Articles;
