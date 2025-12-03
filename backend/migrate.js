const { sequelize } = require('./config/database');
const User = require('./models/User');
const UnRegisteredUser = require('./models/UnRegisteredUser');

async function migrate() {
  try {
    console.log('Running database migration...');
    
    // Sync all models (this will create new tables and add missing columns)
    await sequelize.sync({ alter: true });
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();