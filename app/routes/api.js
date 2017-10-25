
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'bunkerzz';

module.exports = function (router) {
    //http:localhost/api/users
    //Registration Route
    router.post('/users', function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        if (req.body.username == null || req.body.username == "" || req.body.password == null || req.body.password == "") {
            res.json({ success: false, message: 'Ensure username and password were provided' })
        }
        else {
            user.save(function (err) {
                if (err) {
                    res.json({ success: false, message: 'Username or Email already exists.' })
                } else {
                    res.json({ success: true, message: 'User succesfully created' })
                }
            });
        }

    });


    router.post('/authenticate', function (req, res) {

        User.findOne({ username: req.body.username }).select('username password').exec(function (err, user) {
            if (err) throw err;
            if (!user) {
                res.send({ success: false, message: 'Could not authenticate user' });
            } else if (user) {
                var validPassword;
                if (req.body.password) {
                    validPassword = user.comparePassword(req.body.password);
                } else {
                    res.send({ success: false, message: 'No password provided' });
                }

                if (!validPassword) {
                    res.send({ success: false, message: 'Could not authenticate password' });
                }
                else {
                    var _token = jwt.sign({ username: user.username }, secret, { expiresIn: '24h' });
                    res.send({ success: true, message: 'User authenticated!', token: _token });
                }
            }
        });
    });

    router.use(function (req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if (token) {
            //verify
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.send({ success: false, message: 'Token is invalid' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.send({ success: false, message: 'No token provided' });
        }
    });

    router.post('/me', function (req, res) {
        res.send(req.decoded);
    });

    return router;
}

