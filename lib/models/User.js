const pool = require('../utils/pool.js');

module.exports = class User {
    constructor(row) {
        this.id = row.id;
        this.email = row.email;
        this.passwordHash = row.password_hash;
    }

    static async insert({ email, passwordHash }) {
        const { rows } = await pool.query(
            `INSERT INTO users
            (email, password_hash)
            VALUES ($1, $2) 
            RETURNING *;`,
            [email, passwordHash]
        );

        return new User(rows[0]);
    }

    static async findByEmail(email) {
        const rows = await pool.query(
            `
        SELECT * FROM users
        WHERE email=$1;`,
            [email]
        );

        return rows[0] ? new User(rows[0]) : null;
    }

    toJSON() {
        return {
            id: this.id,
            email: this.email,
        };
    }
};