const bcrypt = require('bcryptjs');
const { connectDB } = require('./config/database');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await connectDB();
    
    const adminEmail = 'admin@lec.com';
    const adminPassword = 'admin@1234';
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', adminEmail);
      console.log('Password: admin@1234');
      process.exit(0);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // Create admin user
    const admin = await User.create({
      username: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      address: 'Admin Office',
      isEmailVerified: true,
      isAdmin: true
    });
    
    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password: admin@1234');
    console.log('Admin ID:', admin.id);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();