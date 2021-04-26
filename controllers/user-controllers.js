const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

async function getUser(req, res, next) {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        return next(
            new HttpError('Fetching users failed', 500)
        );
    }
    res.json({ users: users.map(user => user.toObject({ getters: true })) });
}

async function signup(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed', 422)
        );
    }

    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch(err) {
        return next(
            new HttpError('Signup failed', 500)
        );
    }

    if (existingUser) {
        return next(
            new HttpError('Email already exists', 422)
        );
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch(err) {
        return next(
            new HttpError('Could not hash password', 500)
        );
    }

    let createdUser = new User({
        name,
        email,
        password: hashedPassword
    });
    try{
        await createdUser.save();
    } catch(err) {
        return next(
            new HttpError('Could not save user', 500)
        );
    }

    res.status(201).json({
        userId: createdUser.id,
        email: createdUser.email,
        message: 'Signed up'
    });
}

async function login(req, res, next) {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch(err) {
        return next(
            new HttpError('Could not search for user', 500)
        );
    }

    if(!existingUser) {
        return next(
            new HttpError('Could not find user', 404)
        );
    }

    let isValidPassword;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch(err) {
        return next(
            new HttpError('Could not check credentials', 500)
        );
    }

    if(!isValidPassword) {
        return next(
            new HttpError('Invalid credentials', 403)
        );
    }

    res.status(201).json({
        userId: existingUser.id,
        email: existingUser.email,
        message: 'Logged in'
    });
}

exports.getUser = getUser;
exports.signup = signup;
exports.login = login;