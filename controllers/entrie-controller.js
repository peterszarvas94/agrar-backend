const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Entrie = require('../models/entrie');

async function getEntrie(req, res, next) {
    const entrieId = req.params.id;
    let entrie;
    try {
        entrie = await Entrie.findById(entrieId);
    } catch(err) {
        return next(
            new HttpError('Could not search for entrie', 500)
        );
    }

    res.status(200).json({
        entrie: entrie.toObject({ getters: true })
    });
}

async function getEntriesByCategory(req, res, next) {
    const categoryId = req.params.id;
    let entries;
    try {
        entries = await Entrie.find({ category: categoryId});
    } catch(err) {
        return next(
            new HttpError('Could not search for entries')
        );
    }

    res.json({
        entries: entries.map(entrie => entrie.toObject({ getters: true }))
    });
}

async function addEntrie(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Invalid inputs passed', 422)
        );
    }
    
    const { name, price, category, type } = req.body;
    
    let existingEntire;
    try {
        existingEntire = await Entrie.findOne({ name });
    } catch(err) {
        return next(
            new HttpError('Could not serach for entrie', 500)
        );
    }

    if(existingEntire) {
        return next(
            new HttpError('Entrie already exists', 422)
        );
    }

    let createdEntrie = new Entrie({
        name,
        price,
        category,
        type
    });
    try {
        await createdEntrie.save();
    } catch(err) {
        return next(
            new HttpError('Could not save entrie', 500)
        );
    }

    res.status(201).json({
        name,
        message: 'Entrie saved'
    });
}

async function editEntrie(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed', 422)
        );
    }
    
    const { name, price, categoryId, type } = req.body;
    const entrieId = req.params.id;

    let entrie;
    try {
        entrie = await Entrie.findById(entrieId);
    } catch(err) {
        return next(
            new HttpError('Could not serach for entrie', 500)
        );
    }

    if(!entrie) {
        return next(
            new HttpError('Could not find entrie', 404)
        );
    }

    Object.assign(entrie, {
        name,
        price,
        categoryId,
        type 
    });

    try {
        await entrie.save();
    } catch(err) {
        return next(
            new HttpError('Could not save entrie', 500)
        );
    }

    res.status(201).json({
        entrie: entrie.toObject({ getters: true }),
        message: 'Entire updated'
    });

}

async function removeEntrie(req, res, next) {
    const entrieId = req.params.id;

    let entrie;
    try {
        entrie = await Entrie.findById(entrieId);
    } catch(err) {
        return next(
            new HttpError('Could not search for entrie', 500)
        );
    }

    if(!entrie) {
        return next(
            new HttpError('Could not find entrie', 404)
        );
    }

    try {
        await entrie.remove();
    } catch(err) {
        return next(
            new HttpError('Could not delete entrie', 500)
        );
    }

    res.status(200).json({
        message: 'Entrie deleted'
    })
}

exports.getEntrie = getEntrie;
exports.getEntriesByCategory = getEntriesByCategory;
exports.addEntrie = addEntrie;
exports.editEntrie = editEntrie;
exports.removeEntrie = removeEntrie;