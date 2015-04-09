"use strict";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        name: {type: DataTypes.STRING},
        password: {type: DataTypes.STRING},
        email: {type: DataTypes.STRING}
    }, {
        timestamps: true,
        classMethods: {
            associate: function (sequelize, models) {
                models.User.hasMany(models.Entry, {as: 'Entries'});
            }
        },
        indexes: [{fields: ['name', 'id'], method: 'BTREE'}]
    });
};
