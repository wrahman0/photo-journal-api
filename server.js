"use strict";

var restify = require('restify');
var bunyan = require('bunyan');


var server = restify.createServer();

var restifyLogger = new bunyan({

});

server.on('uncaughtException', function (req, res, route, error){
  req.log.error(error);

});