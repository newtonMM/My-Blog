"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionStore = void 0;
const express_session_1 = __importDefault(require("express-session"));
const db_config_1 = __importDefault(require("../config/db-config"));
exports.sessionStore = new (class extends express_session_1.default.Store {
    constructor() {
        super();
        // Initialize the database connection
    }
    get(sid, callback) {
        console.log("this is the", { session: express_session_1.default });
        const query = "SELECT data FROM sessions WHERE sid = ?";
        db_config_1.default.query(query, [sid], (err, result) => {
            if (err)
                return callback(err);
            if (result.rows.length === 0)
                return callback(null, null);
            try {
                const session = JSON.parse(result.rows[0].data);
                return callback(null, session);
            }
            catch (e) {
                return callback(e);
            }
        });
    }
    set(sid, session, callback) {
        const query = "REPLACE INTO sessions(sid, data, expires) VALUES (?, ?, ?)";
        const expires = session.cookie.maxAge;
        const data = JSON.stringify(session);
        db_config_1.default.query(query, [sid, data, expires], (err, result) => {
            if (err)
                return callback(err);
            return callback(null, session);
        });
    }
    destroy(sid, callback) {
        const query = "DELETE FROM sessions WHERE sid = ?";
        db_config_1.default.query(query, [sid], (err, results) => {
            if (err) {
                console.log(err);
            }
            return results;
        });
    }
})();
