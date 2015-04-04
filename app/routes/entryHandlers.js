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

    var createEntry = function createEntry(req, res, next) {

        var entryInfo = _.pick(req.body, 'title', 'notes', 'tags', 'location');

        entryHelpers.createEntry(entryInfo)
            .then(function () {
                res.send(201);
                next();
            }).catch(function (err){
                res.send(400, err);
                next();
            });

    };

    return {index: index, createEntry: createEntry};
};
