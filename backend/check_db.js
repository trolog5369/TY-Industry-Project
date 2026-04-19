import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function checkDB() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected.');

        const userCount = await User.countDocuments();
        console.log(`Total users in database: ${userCount}`);

        if (userCount > 0) {
            const users = await User.find({}, { name: 1, email: 1 });
            console.log('Users found:');
            users.forEach(u => console.log(`- ${u.name} (${u.email})`));
        } else {
            console.log('No users found in database.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error checking database:', error);
        process.exit(1);
    }
}

checkDB();
