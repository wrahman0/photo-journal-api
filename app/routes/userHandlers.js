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
        userHelpers.getUser(req.params.userName).then(function (user) {
            res.json(user);
            next();
        });
    };

    var create = function create(req, res, next) {
        var userInfo = _.pick(req.body, 'name', 'email');
        userHelpers.getUser(userInfo.name)
            .then(function(user){
                if (user === null){
                    // User doesnt exist
                    return userHelpers.createUser(userInfo);
                }else{
                    // TODO: Error
                    throw new Error("User exists");
                }
            }).then(function (user){
                console.log ("Created User: ", user);
                res.json(201);
                next();
            }).catch(function (err){
                console.log (err);
            });

    };

    return {index: index, view: view, create: create};
};
