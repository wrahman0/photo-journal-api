"use strict";

var Promise = require('bluebird');
var _ = require('lodash');
var httpErrors = require('restify').errors;

module.exports = function (entryHelpers) {

    var index = function index(req, res, next) {
        entryHelpers.getEntries().then(function (entries) {
            res.json(entries);
            next();
        });
    };

    return {index: index};
};
