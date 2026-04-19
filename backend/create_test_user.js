import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcrypt';

dotenv.config();

async function createUser() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to DB');

        const email = 'testuser@example.com';
        const password = 'password123';
        
        // Remove if exists
        await User.deleteOne({ email });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name: 'Test User',
            email: email,
            password: hashedPassword,
            phoneNumber: '1234567890'
        });

        await user.save();
        console.log(`User created: ${email} / ${password}`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

createUser();
