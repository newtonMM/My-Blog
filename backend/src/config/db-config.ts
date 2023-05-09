import mysql from "mysql2";
import * as dotenv from "dotenv";

dotenv.config();

type query = string;
type callback = (error: Error | null, result: { rows: any }) => void;

class DBConnection {
  public db: mysql.Pool;

  constructor() {
    this.db = mysql.createPool({
      host: process.env.HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: +process.env.DB_PORT!,
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

  query(query: query, callback: callback) {
    this.db.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        connection.release();
        throw err;
      }
      connection.query(query, function (err, rows) {
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

export default new DBConnection();
