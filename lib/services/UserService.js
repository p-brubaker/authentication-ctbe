const User = require('../models/User.js');
const bcrypt = require('bcryptjs');

module.exports = class UserService {
    static async create({ email, password }) {
        const userExists = await User.findByEmail(email);

        if (userExists) {
            throw new Error('There is already a user with this email');
        }

        const passwordHash = await bcrypt.hash(
            password,
            Number(process.env.SALT_ROUNDS)
        );

        const user = await User.insert({
            email,
            passwordHash,
        });

        return user;
    }
};
