const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recordSchema = new Schema({
    entrie: { type: mongoose.Schema.Types.ObjectId, ref: 'Entrie' },
    price: { type: Number },
    quantity: { type: Number, required: true }
});

module.exports = mongoose.model('Record', recordSchema);