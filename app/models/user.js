"use strict";

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('appId', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING}
  }, {
    classMethods: {
      associate: function (sequelize, models) {
      }
    },
    indexes: [{fields: ['name'], method: 'BTREE'}]
  });
};
