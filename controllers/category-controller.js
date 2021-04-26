const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Category = require('../models/category');

async function getCategories(req, res, next) {

    let categories;
    try {
        categories = await Category.find({});
    } catch(err) {
        return next(
            new HttpError('Could not search for categories', 500)
        );
    }

    res.json({
        categories: categories.map(category => category.toObject({ getters: true }))
    });
}

async function getCategory(req, res, next) {
    const categoryId = req.params.id;
    let category;
    try {
        category = await Category.findById(categoryId);
    } catch(err) {
        return next(
            new HttpError('Could not search for category', 500)
        );
    }

    res.status(200).json({
        category: category.toObject({ getters: true })
    });
}

async function addCategory(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed', 422)
        );
    }
    
    const { name } = req.body;
    
    let existingCategory;
    try {
        existingCategory = await Category.findOne({ name });
    } catch(err) {
        return next(
            new HttpError('Could not serach for categor', 500)
        );
    }

    if(existingCategory) {
        return next(
            new HttpError('Category already exists', 422)
        );
    }

    let createdCategory = new Category({
        name
    });
    try {
        await createdCategory.save();
    } catch(err) {
        return next(
            new HttpError('Could not save category', 500)
        );
    }

    res.status(201).json({
        name,
        message: 'Category saved'
    });
}

async function editOperator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed', 422)
        );
    }
    
    const { name } = req.body;
    const categoryId = req.params.id;

    let category;
    try {
        category = await Category.findById(categoryId);
    } catch(err) {
        return next(
            new HttpError('Could not serach for category', 500)
        );
    }

    if(!category) {
        return next(
            new HttpError('Could not find category', 404)
        );
    }

    category.name = name;

    try {
        await category.save();
    } catch(err) {
        return next(
            new HttpError('Could not save category', 500)
        );
    }

    res.status(201).json({
        category: category.toObject({ getters: true }),
        message: 'Category updated'
    });

}

async function removeCategory(req, res, next) {
    const categoryId = req.params.id;

    let category;
    try {
        category = await Category.findById(categoryId);
    } catch(err) {
        return next(
            new HttpError('Could not search for category', 500)
        );
    }

    if(!category) {
        return next(
            new HttpError('Could not find category', 404)
        );
    }

    try {
        await category.remove();
    } catch(err) {
        return next(
            new HttpError('Could not delete category', 500)
        );
    }

    res.status(200).json({
        message: 'Category deleted'
    })
}

exports.getCategories = getCategories;
exports.getCategory = getCategory;
exports.addCategory = addCategory;
exports.editOperator = editOperator;
exports.removeCategory = removeCategory;