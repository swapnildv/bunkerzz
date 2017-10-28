var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z\ ]+$/i,
        message: 'No special characters are allowed in Name field'
    })
];

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'Not a valid e-mail'
    })
];

var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Username should contain alpha-numeric characters only'
    })
];


var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
        message: 'Password needs to have atleast one lowercase, one number, one special character, and must be at least 8 character long but no more than 35.'
    })
];

var userSchema = new Schema({
    name: { type: String, required: true, validate: nameValidator },
    username: { type: String, lowercase: true, required: true, unique: true, validate: usernameValidator },
    email: { type: String, lowercase: true, required: true, unique: true, validate: emailValidator },
    password: { type: String, required: true, validate: passwordValidator },
    resettoken: { type: String, required: false },
    permission: { type: String, required: true, default: 'user' }

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

// Attach some mongoose hooks 
userSchema.plugin(titlize, {
    paths: ['name']
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);

