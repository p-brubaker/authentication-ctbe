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

    afterAll(() => {
        pool.end();
    });
});
