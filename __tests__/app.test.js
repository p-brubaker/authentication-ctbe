const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');

describe('authentication-ctbe routes', () => {
    beforeEach(() => {
        return setup(pool);
    });

    it('should return a newly POSTed User id and email', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({ email: 'cow@moo.com', password: 'mooo' });
        expect(res.body).toEqual({
            id: expect.any(String),
            email: 'cow@moo.com',
        });
    });

    it('should return 400 upon signup w/ email already in use', async () => {
        await request(app)
            .post('/api/auth/signup')
            .send({ email: 'cow@moo.com', password: 'mooo' });
        const res = await request(app)
            .post('/api/auth/signup')
            .send({ email: 'cow@moo.com', password: 'Hi!' });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual(
            'There is already a user with this email'
        );
    });

    it('should login a user and respond with the existing users id', async () => {
        await request(app)
            .post('/api/auth/signup')
            .send({ email: 'cow@moo.com', password: 'mooo' });
        const res = await request(app)
            .post('/api/auth/signin')
            .send({ email: 'cow@moo.com', password: 'mooo' });
        expect(res.body).toEqual({
            email: 'cow@moo.com',
            id: expect.any(String),
        });
    });

    afterAll(() => {
        pool.end();
    });
});
