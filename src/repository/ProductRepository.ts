import sqlite3 from "sqlite3";
import crypto from "crypto";
import { release } from "os";

interface Product {
  id: string;
  name: string;
  type: string;
  brand: string;
}

interface Search {
  name?: string;
  type?: string;
  brand?: string;
}

export class ProductRepository {
  constructor(private db: sqlite3.Database) {}

  //função para criar tabela.
  async createTableProduct() {
    this.db.run(
      "CREATE TABLE IF NOT EXISTS Product (id TEXT, name TEXT, type TEXT, brand TEXT)"
    );
  }

  //função de inserir produtos na tabela
  async insertProduct(
    name: string,
    type: string,
    brand: string
  ): Promise<Product> {
    const id = crypto.randomBytes(16).toString("hex");
    const sql = `INSERT INTO product (id, name, type, brand) values (?, ?, ?, ?)`;
    const params = [id, name, type, brand];

    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        }
        resolve({ id, name, type, brand });
      });
    });
  }

  async executeSql<T>(sql: string, params: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row as T);
      });
    });
  }

  //função de encontrar e autenticar usuários
  async getProductByBrand(brand: string): Promise<Product> {
    const sql = `SELECT * FROM Product WHERE brand = ?`;
    const params = [brand];

    return this.executeSql<Product>(sql, params);
  }

  async getProductByDynamicSearch(search: Search): Promise<Product> {
    let sql = "SELECT * FROM Product WHERE 1 = 1";
    const params: any[] = [];

    for (const key in search) {
      sql += ` AND ${key} = ?`;
      params.push(search[key]);
    }

    return this.executeSql<Product>(sql, params);
  }
}
