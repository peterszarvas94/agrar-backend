const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Operator = require('../models/operator');

async function getOperators(req, res, next) {

    let operators;
    try {
        operators = await Operator.find({});
    } catch(err) {
        return next(
            new HttpError('Could not search for operators', 500)
        );
    }

    res.json({
        operators: operators.map(operator => operator.toObject({ getters: true }))
    });
}

async function getOperator(req, res, next) {
    
    let operatorId = req.params.id;    

    let operator;
    try {
        operator = await Operator.findById(operatorId);
    } catch(err) {
        return next(
            new HttpError('Could not search for operator', 500)
        );
    }

    res.json({
        operator: operator.toObject({ getters: true })
    });
}

async function addOperator(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed', 422)
        );
    }
    
    const { name } = req.body;
    
    let existingOperator;
    try {
        existingOperator = await Operator.findOne({ name });
    } catch(err) {
        return next(
            new HttpError('Could not serach for operator', 500)
        );
    }

    if(existingOperator) {
        return next(
            new HttpError('Operator already exists', 422)
        );
    }

    let createdOperator = new Operator({
        name
    });
    try {
        await createdOperator.save();
    } catch(err) {
        return next(
            new HttpError('Could not save operator', 500)
        );
    }

    res.status(201).json({
        name,
        message: 'Opearator saved'
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
    const operatorId = req.params.id;

    let operator;
    try {
        operator = await Operator.findById(operatorId);
    } catch(err) {
        return next(
            new HttpError('Could not serach for operator', 500)
        );
    }

    if(!operator) {
        return next(
            new HttpError('Could not find operator', 404)
        );
    }

    operator.name = name;

    try {
        await operator.save();
    } catch(err) {
        return next(
            new HttpError('Could not save operator', 500)
        );
    }

    res.status(201).json({
        operator: operator.toObject({ getters: true }),
        message: 'Operator updated'
    });

}

async function removeOperator(req, res, next) {
    const operatorId = req.params.id;

    let operator;
    try {
        operator = await Operator.findById(operatorId);
    } catch(err) {
        return next(
            new HttpError('Could not search for operator', 500)
        );
    }

    if(!operator) {
        return next(
            new HttpError('Could not find operator', 404)
        );
    }

    try {
        await operator.remove();
    } catch(err) {
        return next(
            new HttpError('Could not delete operator', 500)
        );
    }

    res.status(200).json({
        message: 'Operator deleted'
    })
}

exports.getOperators = getOperators;
exports.getOperator = getOperator;
exports.addOperator = addOperator;
exports.editOperator = editOperator;
exports.removeOperator = removeOperator;