const { sequelize } = require('./config/database');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');

const seedCartData = async () => {
  try {
    await sequelize.authenticate();
    
    // Get first user and some products
    const user = await User.findOne();
    const products = await Product.findAll({ limit: 3 });
    
    if (user && products.length > 0) {
      // Add some items to cart
      await Cart.bulkCreate([
        {
          userId: user.id,
          productId: products[0].id,
          quantity: 2
        },
        {
          userId: user.id,
          productId: products[1].id,
          quantity: 1
        },
        {
          userId: user.id,
          productId: products[2].id,
          quantity: 3
        }
      ]);
      
      console.log('Cart data seeded successfully!');
    } else {
      console.log('No users or products found. Please create some first.');
    }
  } catch (error) {
    console.error('Error seeding cart:', error);
  } finally {
    process.exit();
  }
};

seedCartData();