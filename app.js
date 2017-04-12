var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var socketIo = require('./utils/socket-connection.js');
var privateKey = fs.readFileSync('/etc/letsencrypt/live/dev.hugefantacy.in/privkey.pem');
var cert = fs.readFileSync('/etc/letsencrypt/live/dev.hugefantacy.in/fullchain.pem');
mongoose.connect("mongodb://localhost:27017/hugefantacy");
var https_options = {
    key: privateKey,
    cert: cert
};
var server = https.createServer(https_options, app).listen(process.env.PORT || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    server.timeout = 720000;
});

var io = require('socket.io')(server);
io.on('connection', function(socket){
    setInterval(function(){
        socketIo.sessionWatch(io);
    },1000);
    socket.emit('app',"connected");
    socket.on('sessions',function(type, data) {

    });
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With,Content-Type, Accept,application/json-patch, Authorization, x-access-token, x-access-key, X-CSRF-Token");
    if (req.url.substr(-1) == '/') {
        return res.send({
            message: "welcome to hugefantacy.in"
        });
    }
    next();
});

app.use(bodyParser.json({limit: '1000mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '1000mb', extended: true}));

app.use('/', require('./routes'));
