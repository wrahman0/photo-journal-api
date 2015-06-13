"use strict";

var restify = require('restify');
var bunyan = require('bunyan');
var config = require('./config/default');
var sequelize = require('./config/db')(config);
var models = require('./app/models')(sequelize);
var _ = require('lodash');

var authenticationHelpers = require('./app/common/authentication')(config);

var userHelpers = require('./app/helpers/userHelpers')(models, authenticationHelpers);
var userHandlers = require('./app/routes/userHandlers')(userHelpers);

var gameHelpers = require('./app/helpers/gameHelpers')(models, authenticationHelpers, userHelpers);
var ticTacToeHandlers = require('./app/routes/gameHandlers')(gameHelpers);

var passport = require('passport');
var strategies = require('./app/authentication/strategies')(userHelpers, authenticationHelpers);

passport.use(strategies.BasicStrategy);
passport.use(strategies.BearerStrategy);

var restifyLogger = new bunyan({
    name: 'restify',
    streams: [
        {
            level: 'error',
            stream: process.stdout
        },
        {
            level: 'info',
            stream: process.stdout
        }
    ]
});

// Create an HTTP Server
var server = restify.createServer({
    log: restifyLogger
});

// Add audit logging
server.on('after', restify.auditLogger({
    log: restifyLogger
}));

// Log uncaught exceptions
server.on('uncaughtException', function (req, res, route, error) {
    req.log.error(error);
    res.send(500, new Error(error));
});

// Restify config
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(passport.initialize());

server.pre(restify.sanitizePath());
server.use(function (req, res, next) {
    if ((req.method === "PUT" || req.method === "POST") && _.isUndefined(req.body)) {
        req.body = {};
    }
    next();
});

// Routes
server.get('/v1/users/', passport.authenticate(['basic', 'bearer'], {session: false}), userHandlers.view);
server.post('/v1/users/register', userHandlers.createUser);
server.del('/v1/users/', passport.authenticate(['basic', 'bearer'], {session: false}), userHandlers.del);

server.post('/v1/:game/start', passport.authenticate(['basic', 'bearer'], {session: false}), gameHelpers.startGame);

sequelize.authenticate().then(function () {
    console.log('Connection has been established successfully');
    sequelize.sync().then(function () {
        server.listen(config.port, function () {
            console.log(' --- Listening to %s --- ', server.url);
        });
    });
}).catch(function (err) {
    console.log('Unable to connect to db: ', err);
});

server.db = {};
server.db.sequelize = sequelize;
server.db.models = models;
module.exports = server;
