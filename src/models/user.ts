import sqlite3 from "sqlite3";
import crypto from "crypto";

interface User {
  id: string;
  email: string;
  password: string;
}

export class UserModel {
  db: sqlite3.Database;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  //criação da tabela usuário
  createTable() {
    this.db.run(
      "CREATE TABLE IF NOT EXISTS User (id TEXT, email TEXT, password TEXT)"
    );
  }

  //função que adiciona o usuário na tabela
  async insertUser(email: string, password: string): Promise<User> {
    const id = crypto.randomBytes(16).toString("hex");
    const sql = `INSERT INTO user (id, email, password) values (?, ?, ?)`;
    const params = [id, email, password];

    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        }
        resolve({ id, email, password });
      });
    });
  }

  getUser(email: string): Promise<User> {
    /* const hashedPassword = createHash(password); */

    const sql = `SELECT * FROM User WHERE email = ?`;
    const params = [email];

    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        }

        resolve(row as User);
      });
    });
  }

  getAllUser() {
    const sql = `SELECT * FROM User`;

    return new Promise((resolve, reject) => {
      this.db.get(sql, (err, row) => {
        if (err) {
          reject(err);
        }

        resolve(row);
      });
    });
  }
}
