const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fieldSchema = new Schema({
    name: { type: String, required: true },
    area: { type: Number, required: true },
    expense: { type: Number },
    income: { type: Number },
    operations: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Operation' } ]
});

module.exports = mongoose.model('Field', fieldSchema);