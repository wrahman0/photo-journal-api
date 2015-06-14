"use strict";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('game', {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        token: {type: DataTypes.STRING},
        state: {type: DataTypes.STRING, defaultValue: "{}"},
        gameId: {type: DataTypes.STRING}
    }, {
        timestamps: true,
        indexes: [
            {fields: ['token'], method: 'BTREE'}
        ]
    });
};
