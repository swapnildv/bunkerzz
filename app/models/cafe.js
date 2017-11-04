var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cafeSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, lowercase: true, required: true},
    permission: { type: String, required: true, default: 'admin' }
});

module.exports = mongoose.model('Cafe', cafeSchema);