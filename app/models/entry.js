"use strict";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('entry', {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        title: {type: DataTypes.STRING},
        notes: {type: DataTypes.STRING},
        tags: {type: DataTypes.STRING},
        location: {type: DataTypes.STRING}
    }, {
        timestamps: true,
        classMethods: {
            associate: function (sequelize, models) {
                models.Entry.belongsTo(models.User);
                models.Entry.hasMany(models.Photo);
            }
        },
        indexes: [
            {fields: ['userId'], method: 'BTREE'},
            {fields: ['title'], method: 'BTREE'}
        ]
    });
};
