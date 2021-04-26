const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Field = require('../models/field');

async function getFields(req, res, next) {

    let fields;
    try {
        fields = await Field.find({});
    } catch(err) {
        return next(
            new HttpError('Could not search for fields', 500)
        );
    }

    res.json({
        fields: fields.map(field => field.toObject({ getters: true }))
    });
}

async function getField(req, res, next) {
    const fieldId = req.params.id;
    let field;
    try {
        field = await Field.findById(fieldId);
    } catch(err) {
        return next(
            new HttpError('Could not search for field', 500)
        );
    }

    res.status(200).json({
        field: field.toObject({ getters: true })
    });
}

async function getFieldByOperation(req, res, next) {
    const operationId = req.params.id;
    let field;
    try {
        field = await Field.find({ operations: { $all: [operationId] } });
    } catch(err) {
        return next(
            new HttpError('Could not serach for field', 500)
        );
    }

    res.status(200).json({
        field: field[0].toObject({ getters: true })
    });
}

async function addField(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Invalid inputs passed', 422)
        );
    }
    
    const { name, area } = req.body;
    
    let existingField;
    try {
        existingField = await Field.findOne({ name });
    } catch(err) {
        return next(
            new HttpError('Could not serach for field', 500)
        );
    }

    if(existingField) {
        return next(
            new HttpError('Field name already exists', 422)
        );
    }

    let createdField = new Field({
        name,
        area
    });

    try {
        await createdField.save();
    } catch(err) {
        return next(
            new HttpError('Could not save field:' + err , 500)
        );
    }

    res.status(201).json({
        createdField: createdField.toObject({ getters: true }),
        message: 'New field saved'
    });
}

async function editField(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed', 422)
        );
    }
    
    const { name, area, expense, income, operations } = req.body;
    const fieldId = req.params.id;

    let field;
    try {
        field = await Field.findById(fieldId);
    } catch(err) {
        return next(
            new HttpError('Could not serach for field', 500)
        );
    }

    if(!field) {
        return next(
            new HttpError('Could not find field', 404)
        );
    }

    Object.assign(field, {
        name,
        area,
        expense,
        income,
        operations
    });

    try {
        await field.save();
    } catch(err) {
        return next(
            new HttpError('Could not save field', 500)
        );
    }

    res.status(201).json({
        field: field.toObject({ getters: true }),
        message: 'Field updated'
    });

}

async function removeField(req, res, next) {
    const fieldId = req.params.id;

    let field;
    try {
        field = await Field.findById(fieldId);
    } catch(err) {
        return next(
            new HttpError('Could not search for field', 500)
        );
    }

    if(!field) {
        return next(
            new HttpError('Could not find field', 404)
        );
    }

    try {
        await field.remove();
    } catch(err) {
        return next(
            new HttpError('Could not delete field', 500)
        );
    }

    res.status(200).json({
        message: 'Field deleted'
    })
}

exports.getFields = getFields;
exports.getField = getField;
exports.getFieldByOperation = getFieldByOperation;
exports.addField = addField;
exports.editField = editField;
exports.removeField = removeField;