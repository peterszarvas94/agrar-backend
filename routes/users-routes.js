const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/user-controllers');

const router = express.Router();

router.get('/', usersControllers.getUser);

router.post('/signup',
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 6 })
    ],
    usersControllers.signup
);

router.post('/login', usersControllers.login);

module.exports = router;