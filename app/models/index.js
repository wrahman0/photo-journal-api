"use strict";

module.exports = function (sequelize) {
    var models = {
        User: sequelize.import(__dirname + "/user"),
        Entry: sequelize.import(__dirname + "/entry"),
        Photo: sequelize.import(__dirname + "/photo")
    };

    Object.keys(models).forEach(function (modelName) {
        if (models[modelName].hasOwnProperty('associate')) {
            models[modelName].associate(sequelize, models);
        }
    });

    return models;
};