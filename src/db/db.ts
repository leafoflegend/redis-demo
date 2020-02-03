import { Sequelize } from 'sequelize';

const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/redis-demo', {
  logging: false,
});

export default db;
