"use strict";

var Promise = require('bluebird');
var _ = require('lodash');
var httpErrors = require('restify').errors;

module.exports = function (userHelpers) {
  var index = function listAllAppIds(req, res, next) {
    res.json({status: "Working"});
  };

  return {index: index};
};
