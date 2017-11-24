var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static(__dirname + '/public'));

app.use('/api', appRoutes); //API routes .


//aws

mongoose.connect('mongodb://swapnil:swapnil@52.15.136.147/bunkerzz', function (err) {
    if (err) {
        console.log('not connected to DB:' + err);
    }
    else {
        console.log('connected to DB successfully.');
    }
});

//atlas
// mongoose.connect('mongodb://swapnildv:swap1989@cluster0-shard-00-00-7mscv.mongodb.net:27017,cluster0-shard-00-01-7mscv.mongodb.net:27017,cluster0-shard-00-02-7mscv.mongodb.net:27017/bunkerzz?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin', function (err) {
//     if (err) {
//         console.log('not connected to DB:' + err);
//     }
//     else {
//         console.log('connected to DB successfully.');
//     }
// });



//mlab
// mongoose.connect('mongodb://swapnil:swapnil@ds243325.mlab.com:43325/bunkerzz', function (err) {
//     if (err) {
//         console.log('not connected to DB:' + err);
//     }
//     else {
//         console.log('connected to DB successfully.');
//     }
// });

//local
// mongoose.connect('mongodb://localhost:27017/bunkerzz', function (err) {
//     if (err) {
//         console.log('not connected to DB:' + err);
//     }
//     else {
//         console.log('connected to DB successfully.');
//     }
// });

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})
process.on('uncaughtException', function (err) {
    console.log(err);
})
app.listen(process.env.PORT || port, function () {
    console.log('listening');
});

