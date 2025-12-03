const { connectDB } = require('./config/database');
const Product = require('./models/Product');
const products = require('./data/products');

const importData = async () => {
  try {
    await connectDB();
    
    await Product.destroy({ where: {} });
    await Product.bulkCreate(products);
    
    console.log('Data imported successfully');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    
    await Product.destroy({ where: {} });
    
    console.log('Data destroyed successfully');
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}