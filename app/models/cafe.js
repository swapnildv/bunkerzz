var mongoose = require('mongoose');

var cafeSchema = new Schema({
    name: { type: String, required: true, validate: nameValidator },
    address: { type: String, lowercase: true, required: true, unique: true, validate: usernameValidator },
    permission: { type: String, required: true, default: 'admin' }
});

module.exports = mongoose.model('Cafe', cafeSchema);