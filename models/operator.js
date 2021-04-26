const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const operatorSchema = new Schema({
    name: { type: String, required: true }
});

module.exports = mongoose.model('Operator', operatorSchema);