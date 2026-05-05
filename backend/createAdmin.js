require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    let mongoServer;
    if (process.env.USE_MEMORY_DB === 'true') {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
    } else {
      await mongoose.connect(process.env.MONGO_URI);
    }

    const existingAdmin = await User.findOne({ email: 'siddu@gmail.com' });
    if (existingAdmin) {
      console.log('Admin with this email already exists!');
      await mongoose.disconnect();
      process.exit(0);
    }

    const admin = await User.create({
      name: 'siddu',
      email: 'siddu@gmail.com',
      password: '1234',
      role: 'admin'
    });

    console.log('✓ Admin created successfully!');
    console.log(`  Name: ${admin.name}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Role: ${admin.role}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
