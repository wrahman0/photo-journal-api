"use strict";

var _ = require('lodash');

module.exports = function (models) {

    var getUsers = function getUsers() {
        return models.User.findAll();
    };

    var getUser = function getUser(name) {
        return models.User.findAll({
            where: {name: name}
        }).then(function (user){
            if (user.length === 0) return null;
            else return user[0];
        });
    };

    var createUser = function createUser(userInfo) {
        return models.User.create({name: userInfo.name, email: userInfo.email});
    };

    var deleteUser = function deleteUser(userName){

        return models.User.find({where: {name: userName}})
            .then(function (user){
                if (!_.isNull(user)){
                    return user.destroy();
                }
            });
    };

    return {getUsers: getUsers, getUser: getUser, createUser: createUser, deleteUser: deleteUser};
};