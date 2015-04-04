"use strict";

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

        // TODO: move this logic into the helper
        userHelpers.getUser(userInfo.name)
            .then(function(user){
                if (_.isEmpty(user) || _.isUndefined(user)){
                    return userHelpers.createUser(userInfo);
                }else{
                    // TODO: Central error.js
                    throw new Error("User exists");
                }
            }).then(function (user){
                res.send(201);
                next();
            }).catch(function (){
                res.send(new httpErrors.ConflictError('User Exists'));
                next();
            });

    };

    var del = function del(req, res, next){
        var name = req.params.userName;
        userHelpers.deleteUser(name).then(function (){
            res.send(204);
            next();
        });
    };

    return {index: index, view: view, create: create, del: del};
};
