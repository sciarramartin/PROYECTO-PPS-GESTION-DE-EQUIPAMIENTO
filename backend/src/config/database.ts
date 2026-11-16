import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

export interface IDatabase {
  query<T = any>(sql: string, params?: any[]): T[];
  queryOne<T = any>(sql: string, params?: any[]): T | null;
  execute(sql: string, params?: any[]): { changes: number; lastInsertRowid: number | bigint };
}

class SqliteDatabase implements IDatabase {
  private db: DatabaseSync;

  constructor() {
    // Buscar la BD local en database/clinica_biomedico.sqlite
    const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../../database/clinica_biomedico.sqlite');
    
    if (!fs.existsSync(dbPath)) {
      console.warn(`[DB] Archivo SQLite no encontrado en: ${dbPath}. Creando directorio si no existe.`);
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }

    this.db = new DatabaseSync(dbPath);
    console.log(`[DB] Conectado exitosamente a SQLite: ${dbPath}`);
  }

  query<T = any>(sql: string, params: any[] = []): T[] {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params) as T[];
  }

  queryOne<T = any>(sql: string, params: any[] = []): T | null {
    const stmt = this.db.prepare(sql);
    const result = stmt.get(...params);
    return (result || null) as T | null;
  }

  execute(sql: string, params: any[] = []): { changes: number; lastInsertRowid: number | bigint } {
    const stmt = this.db.prepare(sql);
    const result = stmt.run(...params);
    return {
      changes: Number(result.changes),
      lastInsertRowid: result.lastInsertRowid
    };
  }
}

// Instancia singleton de Base de Datos
// Arquitectura preparada: Para conectar a Microsoft SQL Server (selfcontrol)
// solo se requiere instanciar una clase MssqlDatabase que implemente IDatabase.
export const db: IDatabase = new SqliteDatabase();
