"use strict";

var _ = require('lodash');
var errors = require('../common/errors');
var sendError = require('../common/sendError');

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
            }).catch(errors.DuplicateEntryError, sendError(httpErrors.ResourceNotFoundError, next));
    };

    return {index: index, createEntry: createEntry};
};
