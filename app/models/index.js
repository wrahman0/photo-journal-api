"use strict";

module.exports = function (sequelize) {
    var models = {
        User: sequelize.import(__dirname + "/user"),
        Game: sequelize.import(__dirname + "/game")
    };

    Object.keys(models).forEach(function (modelName) {
        if (models[modelName].hasOwnProperty('associate')) {
            models[modelName].associate(sequelize, models);
        }
    });

    return models;
};