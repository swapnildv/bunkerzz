var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cafeSchema = new Schema({
    name: { type: String, required: true },
    address: {
        address1: { type: String, lowercase: true },
        address2: { type: String, lowercase: true },
        address3: { type: String, lowercase: true }
    },
    gst: {
        sgst: { type: Number, required: true },
        cgst: { type: Number, required: true },
        gstno: { type: String, lowercase: true, required: true }
    },
    email: { type: String, lowercase: true, required: true, unique: true },
    phone: { type: Number, required: true },
    permission: { type: String, required: true, default: 'admin' }
});

module.exports = mongoose.model('Cafe', cafeSchema);