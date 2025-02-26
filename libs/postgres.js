const { Pool } = require('pg');
const { config } = require('./../config/config');

class PostgresPool {
  static instance = null;

  static async getInstance() {
    if (!PostgresPool.instance) {
      try {
        let options = {};
        
        // Configuración para producción usando DATABASE_URL
        if (config.isProd && config.dbUrl) {
          options = {
            connectionString: config.dbUrl,
            ssl: {
              rejectUnauthorized: false // Necesario para algunas bases de datos en la nube como Heroku, Railway o Render
            }
          };
          console.log('🔗 Conectando a PostgreSQL en producción');
        } 
        // Configuración para desarrollo local
        else {
          // Validar variables de entorno
          if (!config.dbUser || !config.dbPassword) {
            throw new Error('❌ Error: Faltan credenciales de base de datos en el .env');
          }
          
          const USER = encodeURIComponent(config.dbUser);
          const PASSWORD = encodeURIComponent(config.dbPassword);
          const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;
          
          options = { connectionString: URI };
          console.log('🔗 Conectando a PostgreSQL en desarrollo local');
        }
        
        PostgresPool.instance = new Pool(options);
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
      throw error; // Es mejor lanzar el error para manejarlo en el controlador
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