const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');

const identifyUser = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ message: 'Please log in to access cart.' });
  }
  req.userId = userId;
  next();
};

router.get('/', identifyUser, async (req, res) => {
  const origin = req.get('Origin') || req.get('Referer');
  if (origin && !origin.includes('localhost:5173')) {
    return res.status(403).json({ message: 'Forbidden - Invalid origin' });
  }
  
  try {
    const cartItems = await Cart.findAll({ where: { userId: req.userId } });
    res.json({ userId: req.userId, items: cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
});

router.post('/add', identifyUser, async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId || (typeof productId !== 'string' && typeof productId !== 'number') || 
      (typeof productId === 'string' && productId.trim() === '')) {
    return res.status(400).json({ message: 'Valid product ID is required' });
  }
  
  // Convert to string for consistency
  const productIdStr = String(productId).trim();
  
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive integer' });
  }

  try {
    const product = await Product.findByPk(productIdStr);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.countInStock <= 0) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    const existingItem = await Cart.findOne({ 
      where: { userId: req.userId, productId: productIdStr } 
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      await Cart.create({
        userId: req.userId,
        productId: productIdStr,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: quantity
      });
    }

    const cartItems = await Cart.findAll({ where: { userId: req.userId } });
    res.status(201).json({ userId: req.userId, items: cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding to cart' });
  }
});

router.put('/update', identifyUser, async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || !Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({ message: 'Invalid input' });
    }
    
    const productIdStr = String(productId).trim();

    try {
        const cartItem = await Cart.findOne({ 
          where: { userId: req.userId, productId: productIdStr } 
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            await cartItem.destroy();
        } else {
            cartItem.quantity = quantity;
            await cartItem.save();
        }
        
        const cartItems = await Cart.findAll({ where: { userId: req.userId } });
        return res.json({ userId: req.userId, items: cartItems });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/remove/:productId', identifyUser, async (req, res) => {
  if (!req.params.productId) {
    return res.status(400).json({ message: 'Valid product ID is required' });
  }
  
  const productIdStr = String(req.params.productId).trim();
  
  try {
    await Cart.destroy({ 
      where: { userId: req.userId, productId: productIdStr } 
    });
      
    const cartItems = await Cart.findAll({ where: { userId: req.userId } });
    return res.json({ userId: req.userId, items: cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error removing item' });
  }
});

router.post('/purchase', identifyUser, async (req, res) => {
  try {
    // Get user's cart items
    const cartItems = await Cart.findAll({ where: { userId: req.userId } });
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update product stock for each item in cart
    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        if (product.countInStock >= item.quantity) {
          product.countInStock -= item.quantity;
          await product.save();
        } else {
          return res.status(400).json({ 
            message: `Insufficient stock for ${item.name}. Available: ${product.countInStock}, Requested: ${item.quantity}` 
          });
        }
      }
    }

    // Create order record with random ID and delivery date
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const baseOrderId = `ST${randomLetter}${randomNum}`;
    
    // Generate random delivery date (1-10 days from now)
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 10) + 1;
    const deliveryDate = new Date(today.getTime() + randomDays * 24 * 60 * 60 * 1000);
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Create single order record with all items
    await Order.create({
      userId: req.userId,
      orderId: baseOrderId,
      items: JSON.stringify(cartItems),
      productId: cartItems[0]?.productId || 0,
      productName: `${cartItems.length} item${cartItems.length > 1 ? 's' : ''}`,
      quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      price: totalAmount,
      totalAmount: totalAmount,
      deliveryDate: formattedDeliveryDate
    });

    // Clear the user's cart after successful purchase
    await Cart.destroy({ where: { userId: req.userId } });

    res.json({ 
      message: 'Purchase completed successfully',
      orderId: baseOrderId,
      deliveryDate: formattedDeliveryDate,
      items: cartItems.length
    });
  } catch (error) {
    console.error('Purchase error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      sql: error.sql || 'No SQL',
      original: error.original || 'No original error'
    });
    res.status(500).json({ 
      message: `Server error processing purchase: ${error.message}`,
      error: error.message,
      details: error.sql || error.original?.message || 'Unknown database error'
    });
  }
});

router.get('/orders', identifyUser, async (req, res) => {
  try {
    const orders = await Order.findAll({ 
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    
    const formattedOrders = orders.map(order => {
      const orderDate = new Date(order.createdAt);
      return {
        orderId: order.orderId,
        items: JSON.parse(order.items),
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        orderDate: orderDate.toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        deliveryDate: order.deliveryDate
      };
    });
    
    res.json(formattedOrders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

module.exports = router;