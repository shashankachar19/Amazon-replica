const { sequelize } = require('./config/database');

async function migrateUserTable() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
    
    // Add missing columns to User table
    await sequelize.query(`
      ALTER TABLE Users ADD COLUMN googleId VARCHAR(255);
    `).catch(() => console.log('googleId column already exists'));
    
    await sequelize.query(`
      ALTER TABLE Users ADD COLUMN isEmailVerified BOOLEAN DEFAULT 0;
    `).catch(() => console.log('isEmailVerified column already exists'));
    
    await sequelize.query(`
      ALTER TABLE Users ADD COLUMN emailVerificationToken VARCHAR(255);
    `).catch(() => console.log('emailVerificationToken column already exists'));
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateUserTable();