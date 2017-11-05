var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menuSchema = new Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    cafeId: { type: Schema.Types.ObjectId, required: true, ref: 'Cafe' }
});

module.exports = mongoose.model('Menu', menuSchema);