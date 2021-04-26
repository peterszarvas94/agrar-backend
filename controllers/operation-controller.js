const HttpError = require('../models/http-error');

const Operation = require('../models/operation');
const Field = require('../models/field');
const { update } = require('../models/operation');

async function getOperation(req, res, next) {
    const operationId = req.params.id;
    let operation;
    try {
        operation = await Operation.findById(operationId);
    } catch(err) {
        return next(
            new HttpError('Could not search for operation', 500)
        );
    }

    res.status(200).json({
        operation: operation.toObject({ getters: true })
    });
}

async function getOperationByRecord(req, res, next) {
    const recordId = req.params.id;
    let operation;
    try {
        operation = await Operation.find({ records: { $all: [recordId] } } );
    } catch(err) {
        return next(
            new HttpError('Could not search for operator', 500)
        );
    }

    res.json({
        operation: operation[0].toObject({ getters: true })
    });
}

async function getOperationsByOperator(req, res, next) {
    const operatorId = req.params.id;
    let operations;
    try {
        operations = await Operation.find({ operator: operatorId});
    } catch(err) {
        return next(
            new HttpError('Could not search for operations', 500)
        );
    }

    res.json({
        operations: operations.map(operation => operation.toObject({ getters: true }))
    });
}

async function addOperation(req, res, next) {
    
    const { date, operator, field } = req.body;

    let createdOperation = new Operation({
        date,
        operator
    });

    try {
        await createdOperation.save();
    } catch(err) {
        return next(
            new HttpError('Could not save operation : ' + err, 500)
        );
    }

    let updatedField;
    try {
        updatedField = await Field.findById(field);
    } catch(err) {
        return next(
            new HttpError('Could not find parent field: ' + err, 500)
        );
    }

    updatedField.operations.push(createdOperation);
    try {
        await updatedField.save();
    } catch(err) {
        return next(
            new HttpError('Could not save to parant field: ' + err, 500)
        );
    }

    res.status(201).json({
        operation: createdOperation.toObject({ getters: true }),
        message: 'Operation saved'
    });
}

async function editOperation(req, res, next) {
    
    const { date, operator } = req.body;
    const operationId = req.params.id;

    let operation;
    try {
        operation = await Operation.findById(operationId);
    } catch(err) {
        return next(
            new HttpError('Could not serach for operation', 500)
        );
    }

    if(!operation) {
        return next(
            new HttpError('Could not find operation', 404)
        );
    }

    Object.assign(operation, {
        date,
        operator
    });

    try {
        await operation.save();
    } catch(err) {
        return next(
            new HttpError('Could not save operation', 500)
        );
    }

    res.status(201).json({
        operation: operation.toObject({ getters: true }),
        message: 'Operation updated'
    });

}

async function removeOperation(req, res, next) {
    const operationId = req.params.id;
    const { field } = req.body;

    let operation;
    try {
        operation = await Operation.findById(operationId);
    } catch(err) {
        return next(
            new HttpError('Could not search for operation', 500)
        );
    }

    if(!operation) {
        return next(
            new HttpError('Could not find operation', 404)
        );
    }

    try {
        await operation.remove();
    } catch(err) {
        return next(
            new HttpError('Could not delete operation', 500)
        );
    }   

    let updatedField;
    try {
        updatedField = await Field.findById(field);
    } catch(err) {
        return next(
            new HttpError('Could not find parent field: ' + err, 500)
        );
    }

    updatedField.operations.pull(operation);
    try {
        await updatedField.save();
    } catch(err) {
        return next(
            new HttpError('Could not save to parant field: ' + err, 500)
        );
    } 

    res.status(200).json({
        message: 'Operation deleted'
    })
}

exports.getOperation = getOperation;
exports.getOperationByRecord = getOperationByRecord;
exports.getOperationsByOperator = getOperationsByOperator;
exports.addOperation = addOperation;
exports.editOperation = editOperation;
exports.removeOperation = removeOperation;