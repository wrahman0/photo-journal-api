"use strict";

var _ = require('lodash');
var httpErrors = require('restify').errors;
var errors = require('../common/errors');
var sendError = require('../common/sendError');

module.exports = function (userHelpers, authenticationHelpers) {

    var index = function index(req, res, next) {
        userHelpers.getUsers().then(function (users) {
            res.json(users);
            next();
        });
    };

    var view = function view(req, res, next) {
        userHelpers.getUser(req.params.userName).then(function (user) {
            if (!authenticationHelpers.validateUser(req.user, user)){
                return next(new httpErrors.InvalidCredentialsError('Unauthorized request'));
            }
            res.json(user);
            next();
        }).catch(errors.UserNotFoundError, sendError(httpErrors.ResourceNotFoundError, next));
    };

    var createUser = function createUser(req, res, next) {
        var userInfo = _.pick(req.body, 'name', 'password', 'email');
        userInfo.token = authenticationHelpers.encodePayload(userInfo);
        userHelpers.createUser(userInfo)
            .then(function (user) {
                console.log('Created: ', user.dataValues);
                res.json(200, user);
                next();
            })
            .catch(errors.UserExistsError, sendError(httpErrors.ConflictError, next));
    };

    var del = function del(req, res, next) {
        var name = req.params.userName;
        userHelpers.getUser(name).then(function (user){
            if (!authenticationHelpers.validateUser(req.user, user)){
                return next(new httpErrors.InvalidCredentialsError('Unauthorized request'));
            }
            userHelpers.deleteUser(name)
                .then(function () {
                    res.send(204);
                    next();
                });
        });

    };

    return {index: index, view: view, createUser: createUser, del: del};
};
