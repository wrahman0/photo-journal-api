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
        console.log(userInfo);
        return models.User.create({name: userInfo.name, description: userInfo.description});
    };

    return {getUsers: getUsers, getUser: getUser, createUser: createUser};
};