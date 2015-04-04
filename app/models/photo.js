"use strict";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('photo', {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        caption: {type: DataTypes.STRING},
        location: {type: DataTypes.STRING}
    }, {
        timestamps: true,
        classMethods: {
            associate: function (sequelize, models) {
                models.Photo.belongsTo(models.Entry);
            }
        }
    });
};
