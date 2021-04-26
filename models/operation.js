const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const operationSchema = new Schema({
    date: { type: Date, required: true },
    operator: { type: mongoose.Schema.Types.ObjectId, ref: 'Operator', required: true },
    records: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Record' } ]
});

module.exports = mongoose.model('Operation', operationSchema);