const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user || !user.isAdmin) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// Get sales analytics
router.get('/sales', adminAuth, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = { createdAt: { [Op.gte]: weekAgo } };
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = { createdAt: { [Op.gte]: monthAgo } };
        break;
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        dateFilter = { createdAt: { [Op.gte]: yearAgo } };
        break;
    }

    const orders = await Order.findAll({ where: dateFilter });
    
    // Calculate sales by product
    const productSales = {};
    let totalRevenue = 0;
    
    orders.forEach(order => {
      const items = JSON.parse(order.items);
      items.forEach(item => {
        const productId = item.id || item.productId;
        const productName = item.name || item.productName;
        const quantity = item.quantity || 1;
        const price = parseFloat(item.price || order.totalAmount);
        
        if (!productSales[productId]) {
          productSales[productId] = {
            productId,
            productName,
            totalQuantity: 0,
            totalRevenue: 0
          };
        }
        
        productSales[productId].totalQuantity += quantity;
        productSales[productId].totalRevenue += price * quantity;
        totalRevenue += price * quantity;
      });
    });
    
    const salesData = Object.values(productSales).sort((a, b) => b.totalRevenue - a.totalRevenue);
    
    res.json({
      period,
      totalOrders: orders.length,
      totalRevenue,
      productSales: salesData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Product Management
router.get('/products', adminAuth, async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const { name, price, countInStock, category } = req.body;
    await Product.update(
      { name, price, countInStock, category },
      { where: { id: req.params.id } }
    );
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order Management
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderId: order.orderId,
      userId: order.userId,
      items: JSON.parse(order.items),
      productName: order.productName,
      quantity: order.quantity,
      price: order.price,
      totalAmount: order.totalAmount,
      status: order.status,
      deliveryDate: order.deliveryDate,
      createdAt: order.createdAt
    }));
    
    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    await Order.update(
      { status },
      { where: { id: req.params.id } }
    );
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Advanced Analytics
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const orders = await Order.findAll();
    const users = await User.findAll({ where: { isAdmin: false } });
    
    // Daily revenue for last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= dayStart && orderDate <= dayEnd;
      });
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      
      last7Days.push({
        date: dayStart.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        revenue: dayRevenue,
        orders: dayOrders.length
      });
    }
    
    // Top customers
    const customerSpending = {};
    orders.forEach(order => {
      if (!customerSpending[order.userId]) {
        customerSpending[order.userId] = {
          userId: order.userId,
          totalSpent: 0,
          orderCount: 0
        };
      }
      customerSpending[order.userId].totalSpent += parseFloat(order.totalAmount);
      customerSpending[order.userId].orderCount += 1;
    });
    
    const topCustomers = Object.values(customerSpending)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
    
    // Add user details to top customers
    for (let customer of topCustomers) {
      const user = users.find(u => u.id.toString() === customer.userId);
      customer.username = user ? user.username : 'Unknown User';
      customer.email = user ? user.email : 'N/A';
    }
    
    res.json({
      dailyRevenue: last7Days,
      topCustomers,
      totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0),
      totalOrders: orders.length,
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0) / orders.length : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear all data
router.delete('/clear-data', adminAuth, async (req, res) => {
  try {
    await Order.destroy({ where: {} });
    res.json({ message: 'All sales data cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard data
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'address', 'createdAt', 'isAdmin']
    });
    
    const products = await Product.findAll();
    const orders = await Order.findAll();
    
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
    
    res.json({
      users: users.filter(u => !u.isAdmin),
      products,
      orders,
      totalUsers: users.filter(u => !u.isAdmin).length,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;