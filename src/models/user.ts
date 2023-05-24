import { rejects } from "assert";
import { createHash } from "crypto";
import { resolve } from "path";
import sqlite3 from "sqlite3";

export class UserModel {
  db: sqlite3.Database;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  //criação da tabela usuário
  createTable() {
    this.db.run("CREATE TABLE IF NOT EXISTS User (email TEXT, password TEXT)");
  }

  //função que adiciona o usuário na tabela
  insertUser(email: string, password: string) {
    this.db.run("INSERT INTO User (email, password) VALUES (?, ?)", [
      email,
      password,
    ]);
  }

  getUser(email: string, password: string) {
    /* const hashedPassword = createHash(password); */

    const sql = `SELECT * FROM User WHERE email = ? AND password = ?`;
    const params = [email, password];

    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        }

        resolve(row);
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
