var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Submenu = new Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    price: { type: Number, required: true, default: 0 },
    craetedDate: { type: Date }
});

var menuSchema = new Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    cafeid: { type: Schema.Types.ObjectId, required: true, ref: 'Cafe' },
    craetedDate: { type: Date, required: false },
    submenus: { type: [Submenu], required: false }
});

module.exports = mongoose.model('Menu', menuSchema);