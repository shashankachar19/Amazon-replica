// backend/config/db.js
let mongoose;

const loadMongoose = () => {
  if (!mongoose) {
    mongoose = require('mongoose');
  }
  return mongoose;
};

const connectDB = async () => {
  try {
    const mongoose = loadMongoose();
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Note: Use of useCreateIndex and useFindAndModify are often deprecated 
      // in newer Mongoose versions (v6+), so they are omitted here.
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;