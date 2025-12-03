const { connectDB } = require('./config/database');
const Product = require('./models/Product');

const updateSchema = async () => {
  try {
    await connectDB();
    
    // Force sync to update the schema
    await Product.sync({ alter: true });
    
    console.log('Schema updated successfully');
    process.exit();
  } catch (error) {
    console.error('Error updating schema:', error);
    process.exit(1);
  }
};

updateSchema();