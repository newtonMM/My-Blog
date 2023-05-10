"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class DBConnection {
    constructor() {
        this.db = mysql2_1.default.createPool({
            host: process.env.HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: +process.env.DB_PORT,
        });
        this.checkConnection();
    }
    checkConnection() {
        console.log("we are checking connection");
        this.db.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                if (err.code === "PROTOCOL_CONNECTION_LOST") {
                    console.error("Database connection was closed");
                }
                if (err.code === "ER_CON_ERROR") {
                    console.error("Database has too many comnections");
                }
                if (err.code === "ECONNREFUSED") {
                    console.error("Database connection was refused ");
                }
            }
            if (connection) {
                connection.release();
                console.log("connected to db");
            }
            return;
        });
    }
    query(query, values, callback) {
        this.db.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                connection.release();
                throw err;
            }
            connection.query(query, values, function (err, rows) {
                connection.release();
                if (err) {
                    callback(err, { rows: rows });
                }
                if (!err) {
                    callback(null, { rows: rows });
                }
            });
            connection.once("error", function (err) {
                console.log("last", err);
                throw err;
            });
        });
    }
}
exports.default = new DBConnection();
