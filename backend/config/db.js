const mongoose = require('mongoose');

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true, // Use this instead of useNewUrlParser
  useCreateIndex: true,     // Ensure indexes are created properly
  useFindAndModify: false   // Disable deprecated findAndModify MongoDB function
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
