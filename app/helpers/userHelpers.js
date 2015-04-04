"use strict";

var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function (models) {

    var getUsers = function getUsers() {
        return models.User.findAll();
    };

    var getUser = function getUser(name) {
        return models.User.findAll({
            where: {name: name}
        });
    };

    var createUser = function createUser(userInfo) {
        return models.User.create({name: userInfo.name, email: userInfo.email});
    };

    return {getUsers: getUsers, getUser: getUser, createUser: createUser};
};