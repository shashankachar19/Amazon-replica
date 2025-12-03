const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite connected successfully');
    await sequelize.sync();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };