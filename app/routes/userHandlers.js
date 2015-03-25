"use strict";

var Promise = require('bluebird');
var _ = require('lodash');
var httpErrors = require('restify').errors;

module.exports = function (userHelpers) {

    var index = function index(req, res, next) {
        userHelpers.getUsers().then(function (users) {
            res.json(users);
            next();
        });
    };

    var view = function view(req, res, next) {
        userHelpers.getUser(req.params.userId).then(function (user) {
            res.json(user);
            next();
        });
    };

    var create = function create(req, res, next) {
        // TODO: Validation

        var userInfo = _.pick(req.body, 'name', 'description');

        userHelpers.createUser(userInfo).then(function (user){
            console.log("Created: ", user);
            res.json(user);
            next();
        });
    };

    return {index: index, view: view, create: create};
};
