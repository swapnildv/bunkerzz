var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionDetail = new Schema({
    cost: { type: Number, required: true },
    qty: { type: Number, required: true },
    submenu_id: { type: Schema.Types.ObjectId, required: true, ref: 'Cafe' },
    submenu: { type: String, required: true },
    submenu_price: { type: Number, required: true }
});

var Transaction = new Schema({
    totalcost: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, required: false, ref: 'User' },
    cafeid: { type: Schema.Types.ObjectId, required: true, ref: 'Cafe' },
    createdDate: { type: Date, required: false },
    details: { type: [TransactionDetail], required: true }
});

module.exports = mongoose.model('Transaction', Transaction);