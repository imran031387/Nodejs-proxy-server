var fs = require('fs');
var http = require('http');
var https = require('https');
var proxy = require('express-http-proxy');
var privateKey  = fs.readFileSync('/Users/mimran/.ssh/ssl/server-key.pem');
var certificate = fs.readFileSync('/Users/mimran/.ssh/ssl/server-crt.pem');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

// your express configuration here.
app.use(function(req, res, next) {
  //console.log(res);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","POST, GET, OPTIONS, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//  CORS and preflight filtering.
//  This is to fix the issue:CORS preflight channel did not succeed.
app.all('*', function(req, res, next){
//  preflight needs to return exact request-header.
res.set('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
  if ('OPTIONS' == req.method)
    return res.send(204);
  next();
});

app.use('/', proxy('www.content-store.local.com'));

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);

