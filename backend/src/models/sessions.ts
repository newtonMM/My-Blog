import session from "express-session";
import sql from "../config/db-config";
import { SessionData } from "express-session";

export const sessionStore = new (class extends session.Store {
  constructor() {
    super();
    // Initialize the database connection
  }

  get(sid: string, callback: (err: any, session?: SessionData | null) => void) {
    console.log("this is the", { session });
    const query = "SELECT data FROM sessions WHERE sid = ?";
    sql.query(query, [sid], (err, result) => {
      if (err) return callback(err);
      if (result.rows.length === 0) return callback(null, null);
      try {
        const session = JSON.parse(result.rows[0].data);
        return callback(null, session);
      } catch (e) {
        return callback(e);
      }
    });
  }

  set(
    sid: string,
    session: SessionData,
    callback: (err?: any, session?: SessionData | null) => void
  ) {
    const query = "REPLACE INTO sessions(sid, data, expires) VALUES (?, ?, ?)";
    const expires = session.cookie.maxAge;

    const data = JSON.stringify(session);
    sql.query(query, [sid, data, expires!], (err, result) => {
      if (err) return callback(err);
      return callback(null, session);
    });
  }

  destroy(sid: string, callback: (err?: any) => void) {
    const query = "DELETE FROM sessions WHERE sid = ?";
    sql.query(query, [sid], (err, results) => {
      if (err) {
        console.log(err);
      }
      return results;
    });
  }
})();
