var https = require('https');
var fs = require('fs');
var finalHandler = require('finalhandler');
var http = require('http');
var serveIndex = require('serve-index');
var serveStatic = require('serve-static');

var httpsOptions = {
    key: fs.readFileSync(__dirname+'/keys/nikhil-key.pem'),
    cert: fs.readFileSync(__dirname+'/keys/nikhil-cert.pem')
};

// Serve directory indexes for public/ftp folder (with icons)
var index = serveIndex(__dirname + '/hosted', {'icons': true});

// Serve up public/ftp folder files
var serve = serveStatic(__dirname + '/hosted');

// Create HTTPS Server
var httpsServer = https.createServer(httpsOptions,function onRequest(req, res) {
    var done = finalHandler(req, res);
    serve(req, res, function onNext(err) {
        if (err) {
            return done(err);
        }
        index(req, res, done)
    })
});
httpsServer.listen(443);
// Create HTTP Server
var httpServer = http.createServer(function onRequest(req, res) {
    var done = finalHandler(req, res);
    serve(req, res, function onNext(err) {
        if (err) {
            return done(err);
        }
        index(req, res, done)
    })
});
httpServer.listen(80);

