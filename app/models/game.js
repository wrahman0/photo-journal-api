"use strict";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('game', {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        game: {type: DataTypes.STRING},
        token: {type: DataTypes.STRING},
        player: {type: DataTypes.STRING},

    }, {
        timestamps: true,
        classMethods: {
            associate: function (sequelize, models) {
            }
        },
        indexes: [
            {fields: ['game'], method: 'BTREE'},
            {fields: ['id'], method: 'BTREE'},
            {fields: ['token'], method: 'BTREE'}
        ]
    });
};
