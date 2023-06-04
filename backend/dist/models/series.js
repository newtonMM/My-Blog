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
exports.Series = void 0;
const db_config_1 = __importDefault(require("../config/db-config"));
class Series {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO series (id, name, description) VALUES (?,?,?) `;
            const values = [this.id, this.name, this.description];
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
            const { name, description, id } = params;
            const query = `UPDATE series SET  name = ?, description =? WHERE id="${id}"`;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                db_config_1.default.query(query, [name, description], (err, results) => {
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
_a = Series;
Series.deleteSeries = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `DELETE FROM series 
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
Series.findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM series`;
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
Series.findByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM series WHERE id="${id}"`;
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
exports.Series = Series;
