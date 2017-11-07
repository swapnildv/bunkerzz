
var User = require('../models/user');
var Cafe = require('../models/cafe');
var Menu = require('../models/menu');

var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var secret = 'bunkerzz';

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cafebunkerz@gmail.com',
        pass: 'CafeBunkerz1989'
    }
});


module.exports = function (router) {
    //http:localhost/api/users
    //Registration Route
    router.post('/users', function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.name = req.body.name;
        user.email = req.body.email;
        if (req.body.username == null || req.body.username == "" || req.body.password == null || req.body.password == "" ||
            req.body.name == null || req.body.name == "" || req.body.email == null || req.body.email == "") {
            res.json({ success: false, message: 'Ensure username ,email,name and password were provided' })
        }
        else {
            user.save(function (err) {
                if (err) {
                    if (err.errors != null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message })
                        }
                        else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message })
                        }
                        else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message })
                        }
                        else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message })
                        }
                        else {
                            res.json({ success: false, message: err })
                        }
                    }
                    else if (err) {
                        if (err.code == 11000)
                            res.json({ success: false, message: 'Username or e-mail already taken.' });
                        else
                            res.json({ success: false, message: err });

                    }
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

    router.post('/checkusername', function (req, res) {

        User.findOne({ username: req.body.username }).select('username').exec(function (err, user) {
            if (err) throw err;
            if (user) {
                res.send({ success: false, message: 'Username is already taken.' });
            }
            else {
                res.send({ success: true, message: 'Valid username.' });
            }
        });
    });

    router.post('/checkemail', function (req, res) {

        User.findOne({ email: req.body.email }).select('email').exec(function (err, user) {
            if (err) throw err;
            if (user) {
                res.send({ success: false, message: 'E-mail is already taken.' });
            }
            else {
                res.send({ success: false, message: 'Valid e-mail.' });
            }
        });
    });

    router.get('/test', function (req, res) {

        const mailOptions = {
            from: 'cafebunkerz@gmail.com', // sender address
            to: 'swapnilv@diipl.com', // list of receivers
            subject: 'Subject of your test email', // Subject line
            html: '<p>Your html here</p>'// plain text body
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else {
                console.log('mail successfully sent');
                console.log(info);
            }

        });
        res.send({ success: true, message: 'test email' });

    });

    router.put('/resetpassword', function (req, res) {

        User.findOne({ email: req.body.email }).select('email name username resettoken').exec(function (err, user) {


            if (err) {
                res.send({ success: false, message: err });
            } else {

                if (!req.body.email) {
                    res.send({ success: false, message: 'No e-mail was provided.' });
                }

                if (!user) {
                    res.send({ success: false, message: 'E-mail was not found!' });
                } else {

                    user.resettoken = jwt.sign({ username: user.username }, secret, { expiresIn: '24h' });
                    user.save(function (err) {
                        if (err) {

                            res.send({ success: false, message: err });
                        } else {
                            const mailOptions = {
                                from: 'cafebunkerz@gmail.com', // sender address
                                to: user.email, // list of receivers
                                subject: 'Bunkerzz Reset Password Request', // Subject line
                                text: 'Hello ' + user.username + ', You recently requested a password reset link.Please click on the link below to reset your password : ' +
                                '<br><br><a href="http://localhost:8080/reset/' + user.resettoken + '">http://localhost:8080/reset/</a>',
                                html: 'Hello <strong>' + user.username + '</strong>,<br><br>You recently requested a password reset link.Please click on the link below to reset your password : ' +
                                '<br><br><a href="http://localhost:8080/reset/' + user.resettoken + '">http://localhost:8080/reset/</a>'
                            };

                            transporter.sendMail(mailOptions, function (err, info) {
                                if (err)
                                    console.log(err)
                                else {
                                    console.log('mail successfully sent');
                                    //console.log(info);
                                }

                            });
                            res.send({ success: true, message: 'Please check your e-mail for password reset Link.' });
                        }
                    });




                }
            }
        });

    });
    router.get('/resetpassword/:token', function (req, res) {
        User.findOne({ resettoken: req.params.token }).select('email name username resettoken').exec(function (err, user) {
            if (err) throw err;
            var token = req.params.token;

            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.send({ success: false, message: 'Password link has expired' });
                } else {
                    if (!user) {
                        res.send({ success: false, message: 'Password link has expired' });
                    } else {
                        res.send({ success: true, user: user });
                    }

                    // req.decoded = decoded;
                    // next();
                }
            });
        });
    });

    router.put('/savepassword', function (req, res) {
        User.findOne({ username: req.body.username }).select('username name password resettoken email').exec(function (err, user) {
            if (err) throw err;

            if (req.body.password == null || req.body.password == '') {
                res.send({ success: false, message: 'Password not provided.' });
            }
            else {

                if (!user) {
                    res.send({ success: false, message: 'Something went wrong!' });
                } else {
                    user.password = req.body.password;
                    user.resettoken = false;
                    user.save(function (err) {
                        if (err) {
                            res.send({ success: false, message: err });
                        }
                        else {
                            const mailOptions = {
                                from: 'cafebunkerz@gmail.com', // sender address
                                to: user.email, // list of receivers
                                subject: 'Bunkerzz Reset Password', // Subject line
                                text: 'Hello ' + user.username + ', This e-mail is to notify that your password was recently reset at Bunkerz.com.',
                                html: 'Hello <strong>' + user.username + '</strong>,<br><br>This e-mail is to notify that your password was recently reset at Bunkerz.com.' +
                                '<br><br>Regards,<br>Bunkerz Team.'
                            };

                            transporter.sendMail(mailOptions, function (err, info) {
                                if (err)
                                    console.log(err)
                                else {
                                    console.log('mail successfully sent');
                                    //console.log(info);
                                }

                            });

                            res.send({ success: true, message: 'Password has been reset!' });
                        }
                    });
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

    router.get('/permission', function (req, res) {
        User.findOne({ username: req.decoded.username }).select('permission').exec(function (err, user) {
            if (err) throw err;
            if (!user) {
                res.send({ success: false, message: 'No user was found!' });
            } else {
                res.send({ success: true, permission: user.permission });
            }
        });
    });

    router.get('/management', function (req, res) {
        User.find({}, function (err, users) {
            if (err) throw err;
            User.findOne({ username: req.decoded.username }).select('permission').exec(function (err, mainUser) {
                if (err) throw err;
                if (!mainUser) {
                    res.send({ success: false, message: 'No user found!' });
                } else {
                    if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                        if (!users) {
                            res.send({ success: false, message: 'Users not found!' });
                        } else {
                            res.send({ success: true, users: users, permission: mainUser.permission });
                        }
                    } else {
                        res.send({ success: false, message: 'Insifficient permissions.' });
                    }
                }
            });
        });
    });


    //create new cafe.
    router.post('/cafe', function (req, res) {
        var cafe = new Cafe();
        cafe.name = req.body.name;
        cafe.address = req.body.address;
        if (req.body.name == null || req.body.name == "" || req.body.address == null || req.body.address == "") {
            res.json({ success: false, message: 'Ensure cafe name and address were provided' })
        }
        else {
            cafe.save(function (err) {
                if (err) {
                    if (err.errors != null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message })
                        }
                        else if (err.errors.address) {
                            res.json({ success: false, message: err.errors.address.message })
                        }
                        else {
                            res.json({ success: false, message: err })
                        }
                    }
                    else if (err) {
                        res.json({ success: false, message: err });
                    }
                } else {
                    res.json({ success: true, message: 'Cafe succesfully created', cafe: cafe });
                }
            });
        }
    });

    //get list of cafe.
    router.get('/cafe', function (req, res) {
        Cafe.find({}, function (err, cafes) {
            if (err) throw err;
            User.findOne({ username: req.decoded.username }).select('permission').exec(function (err, mainUser) {
                if (err) throw err;
                if (!mainUser) {
                    res.send({ success: false, message: 'No user found!' });
                } else {
                    if (mainUser.permission === 'admin') {
                        if (!cafes) {
                            res.send({ success: false, message: 'Cafes not found!' });
                        } else {
                            res.send({ success: true, cafes: cafes, permission: mainUser.permission });
                        }
                    } else {
                        res.send({ success: false, message: 'Insifficient permissions.' });
                    }
                }
            });
        });
    });

    //create new menu.
    router.post('/menu', function (req, res) {
        var menu = new Menu();
        menu.name = req.body.name;
        menu.cafeid = req.body.cafeid;

        //create submenu 
        menu.submenus.push({ name: 'Cheese', craetedDate: new Date(), price: 10 });
        menu.submenus.push({ name: 'Mayo', craetedDate: new Date(), price: 10 });
        if (req.body.name == null || req.body.name == "") {
            res.json({ success: false, message: 'Ensure menu name is provided!' })
        }
        else {
            User.findOne({ username: req.decoded.username }).select('permission').exec(function (err, mainUser) {
                if (err) throw err;
                if (!mainUser) {
                    res.send({ success: false, message: 'No user found!' });
                } else {
                    if (mainUser.permission === 'admin') {
                        //save menu.
                        menu.save(function (err) {
                            if (err) {
                                if (err.errors != null) {
                                    if (err.errors.name) {
                                        res.json({ success: false, message: err.errors.name.message })
                                    }
                                    else {
                                        res.json({ success: false, message: err })
                                    }
                                }
                                else if (err) {
                                    res.json({ success: false, message: err });
                                }
                            } else {
                                res.json({ success: true, message: 'Menu succesfully created', menu: menu });
                            }
                        });
                    } else {
                        res.send({ success: false, message: 'Insifficient permissions.' });
                    }

                }
            });
        }
    });

    router.get('/menu/:cafeid', function (req, res) {
        Menu.find({ cafeid: req.params.cafeid }).select('').exec(function (err, menus) {
            if (err) throw err;
            if (!menus) {
                res.send({ success: false, message: 'No menus found!' });
            } else {
                res.send({ success: true, menus: menus });
            }
        })
    });


    return router;
}

