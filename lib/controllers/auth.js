const { Router } = require('express');
const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
    .post('/signup', async (req, res, next) => {
        try {
            const user = await UserService.create(req.body);
            res.send(user.toJSON());
        } catch (err) {
            if (err.message === 'There is already a user with this email') {
                err.status = 400;
            }
            next(err);
        }
    })
    .post('/signin', async (req, res, next) => {
        try {
            const user = await UserService.authorize(req.body);
            res.cookie('userId', user.id, {
                httpOnly: true,
                maxAge: ONE_DAY_IN_MS,
            });
            res.send(user);
        } catch (err) {
            err.status = 401;
            next(err);
        }
    });
