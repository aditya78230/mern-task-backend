const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://visitor:78230aditya@testingadi.6y5d5.mongodb.net/?retryWrites=true&w=majority&appName=testingadi', {});
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Failed:', err.message);
    process.exit(1);
  }
//  mongoose.set('debug', true);

};

module.exports = connectDB;
