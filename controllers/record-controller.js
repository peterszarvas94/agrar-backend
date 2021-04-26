const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Record = require('../models/record');
const Operation = require('../models/operation');

async function getRecord(req, res, next) {
    const recordId = req.params.id;
    let record;
    try {
        record = await Record.findById(recordId);
    } catch(err) {
        return next(
            new HttpError('Could not search for record', 500)
        );
    }

    res.status(200).json({
        record: record.toObject({ getters: true })
    });
}

async function getRecordsByEntrie(req, res, next) {
    const entrieId = req.params.id;
    let records;
    try {
        records = await Record.find({ entrie: entrieId});
    } catch(err) {
        return next(
            new HttpError('Could not search for records')
        );
    }

    res.json({
        records: records.map(record => record.toObject({ getters: true }))
    });
}

async function addRecord(req, res, next) {
    
    const { operation, entrie, quantity } = req.body;

    const recordObject = {
        entrie,
        quantity
    }

    if (req.body.price) {
        recordObject.price = req.body.price
    }

    let createdRecord = new Record({...recordObject});
    try {
        await createdRecord.save();
    } catch(err) {
        return next(
            new HttpError('Could not save record', 500)
        );
    }

    let updatedOperation
    try {
        updatedOperation = await Operation.findById(operation);
    } catch(err) {
        return next(
            new HttpError('Could not find parent operation', 500)
        );
    }

    updatedOperation.records.push(createdRecord);
    try {
        await updatedOperation.save();
    } catch(err) {
        return next(
            new HttpError('Could not save to parent operation', 500)
        );
    }

    res.status(201).json({
        record: createdRecord.toObject({ getters: true }),
        message: 'Record saved'
    });
}

async function editRecord(req, res, next) {
    
    const { entrie, quantity } = req.body;
    const recordId = req.params.id;
    let price;

    if (req.body.price) {
        price = req.body.price;
    }

    let record;
    try {
        record = await Record.findById(recordId);
    } catch(err) {
        return next(
            new HttpError('Could not serach for record', 500)
        );
    }

    if(!record) {
        return next(
            new HttpError('Could not find record', 404)
        );
    }

    Object.assign(record, {
        entrie,
        quantity 
    });

    if(price) {
        record.price = price;
    } else {
        record.price = undefined;
    }

    try {
        await record.save();
    } catch(err) {
        return next(
            new HttpError('Could not save record', 500)
        );
    }

    res.status(201).json({
        record: record.toObject({ getters: true }),
        message: 'Record updated'
    });

}

async function removeRecord(req, res, next) {
    const recordId = req.params.id;

    const { operation } = req.body;

    let record;
    try {
        record = await Record.findById(recordId);
    } catch(err) {
        return next(
            new HttpError('Could not search for record', 500)
        );
    }

    if(!record) {
        return next(
            new HttpError('Could not find record', 404)
        );
    }

    try {
        await record.remove();
    } catch(err) {
        return next(
            new HttpError('Could not delete record', 500)
        );
    }

    let updatedOperation
    try {
        updatedOperation = await Operation.findById(operation);
    } catch(err) {
        return next(
            new HttpError('Could not find parent operation', 500)
        );
    }

    updatedOperation.records.pull(recordId);
    try {
        await updatedOperation.save();
    } catch(err) {
        return next(
            new HttpError('Could not save to parent operation', 500)
        );
    }

    res.status(200).json({
        message: 'Record deleted'
    })
}

exports.getRecord = getRecord;
exports.getRecordsByEntrie = getRecordsByEntrie;
exports.addRecord = addRecord;
exports.editRecord = editRecord;
exports.removeRecord = removeRecord;