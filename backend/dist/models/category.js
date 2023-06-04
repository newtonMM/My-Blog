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
exports.Category = void 0;
const db_config_1 = __importDefault(require("../config/db-config"));
class Category {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO category (id, name) VALUES (?,?) `;
            const values = [this.id, this.name];
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
            const { name, id } = params;
            const query = `UPDATE category SET  name = ?  WHERE id="${id}"`;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                db_config_1.default.query(query, [name], (err, results) => {
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
_a = Category;
Category.deleteSeries = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `DELETE FROM category 
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
Category.findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM category`;
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
Category.findByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM category WHERE id="${id}"`;
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
exports.Category = Category;
