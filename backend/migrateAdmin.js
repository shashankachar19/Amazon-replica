const { connectDB, sequelize } = require('./config/database');
const User = require('./models/User');
const Order = require('./models/Order');

const migrateDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Running database migrations...');
    
    // Add isAdmin column to Users table if it doesn't exist
    try {
      await sequelize.query('ALTER TABLE Users ADD COLUMN isAdmin BOOLEAN DEFAULT 0');
      console.log('Added isAdmin column to Users table');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('isAdmin column already exists');
      } else {
        console.log('Error adding isAdmin column:', error.message);
      }
    }
    
    // Add new columns to Orders table if they don't exist
    const newColumns = [
      { name: 'productId', type: 'INTEGER' },
      { name: 'productName', type: 'TEXT' },
      { name: 'quantity', type: 'INTEGER' },
      { name: 'price', type: 'DECIMAL(10,2)' }
    ];
    
    for (const column of newColumns) {
      try {
        await sequelize.query(`ALTER TABLE Orders ADD COLUMN ${column.name} ${column.type}`);
        console.log(`Added ${column.name} column to Orders table`);
      } catch (error) {
        if (error.message.includes('duplicate column name')) {
          console.log(`${column.name} column already exists`);
        } else {
          console.log(`Error adding ${column.name} column:`, error.message);
        }
      }
    }
    
    console.log('Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateDatabase();