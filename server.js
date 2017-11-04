var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');

app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static(__dirname + '/public'));

app.use('/api', appRoutes); //API routes .


//mlab

<<<<<<< HEAD
mongoose.connect('mongodb://swapnil:swapnil@ds243325.mlab.com:43325/bunkerzz', function (err) {
    if (err) {
        console.log('not connected to DB:' + err);
    }
    else {
        console.log('connected to DB successfully.');
    }
});

// mongoose.connect('mongodb://localhost:27017/bunkerzz', function (err) {
=======
// mongoose.connect('mongodb://swapnil:swapnil@ds243325.mlab.com:43325/bunkerzz', function (err) {
>>>>>>> 7c9d157db847ed2035e6e0f3897347fff2188529
//     if (err) {
//         console.log('not connected to DB:' + err);
//     }
//     else {
//         console.log('connected to DB successfully.');
//     }
// });

<<<<<<< HEAD
=======
mongoose.connect('mongodb://localhost:27017/bunkerzz', function (err) {
    if (err) {
        console.log('not connected to DB:' + err);
    }
    else {
        console.log('connected to DB successfully.');
    }
});

>>>>>>> 7c9d157db847ed2035e6e0f3897347fff2188529
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})

app.listen(process.env.PORT || port, function () {
    console.log('listening');
});

