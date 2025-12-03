const { sequelize } = require('./config/database');

async function clearOrders() {
  try {
    await sequelize.query('DELETE FROM Orders');
    console.log('✅ All orders cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing orders:', error);
    process.exit(1);
  }
}

clearOrders();