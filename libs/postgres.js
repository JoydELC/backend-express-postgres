const { Pool } = require('pg');
const { config } = require('./../config/config');

// Validar variables de entorno
if (!config.dbUser || !config.dbPassword) {
  throw new Error('❌ Error: Faltan credenciales de base de datos en el .env');
}

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

class PostgresPool {
  static instance = null;

  static async getInstance() {
    if (!PostgresPool.instance) {
      try {
        PostgresPool.instance = new Pool({ connectionString: URI });
        console.log('🔗 PostgreSQL Pool creado');
        console.log('✅ Conexión establecida con PostgreSQL');
      } catch (error) {
        console.error('❌ Error conectando a PostgreSQL:', error);
        PostgresPool.instance = null; // Evitar instancia defectuosa
      }
    }
    return PostgresPool.instance;
  }

  static async query(text, params = []) {
    try {
      const pool = await PostgresPool.getInstance();
      if (!pool) throw new Error('❌ No hay conexión a PostgreSQL');
      const result = await pool.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('❌ Error ejecutando consulta:', error);
      return null;
    }
  }

  static async close() {
    if (PostgresPool.instance) {
      await PostgresPool.instance.end();
      PostgresPool.instance = null;
      console.log('🔌 Conexión cerrada');
    }
  }
}

module.exports = PostgresPool;
