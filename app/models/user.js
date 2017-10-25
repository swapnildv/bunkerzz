var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, lowercase: true, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.pre('save', function (next) {
    // do stuff

    var user = this;
    bcrypt.hash(user.password, null, null, function (err, hash) {

        if (err) return next(err);
        user.password = hash;
        console.log(user.password);
        next();
    });

});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);

