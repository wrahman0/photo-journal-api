"use strict";

var _ = require('lodash');
var errors = require('../common/errors');

module.exports = function (models) {

    var getUsers = function getUsers() {
        return models.User.findAll();
    };

    var getUser = function getUser(name) {
        return models.User.findAll({
            where: {name: name}
        }).then(function (user) {
            if (user.length === 0) return null;
            else return user[0];
        });
    };

    var createUser = function createUser(userInfo) {
        return getUser(userInfo.name)
            .then(function (user) {
                if (!_.isNull(user)){
                    throw new errors.UserExistsError(userInfo.name);
                }else{
                    return models.User.create(userInfo);
                }
            });
    };

    var deleteUser = function deleteUser(userName) {
        return models.User.find({where: {name: userName}})
            .then(function (user) {
                if (!_.isNull(user)) {
                    return user.destroy();
                }
            });
    };

    return {getUsers: getUsers, getUser: getUser, createUser: createUser, deleteUser: deleteUser};
};