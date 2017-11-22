var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testSchema = new Schema({
    name: { type: String, required: true },
    raceevntid: { type: Number, required: true }
});

module.exports = mongoose.model('Test', testSchema);