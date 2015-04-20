"use strict";

var _ = require('lodash');
var errors = require('../common/errors');
var sendError = require('../common/sendError');
var httpErrors = require('restify').errors;

module.exports = function (entryHelpers) {

    var index = function index(req, res, next) {
        res.json(entryHelpers.getEntries(req.user));
        next();
    };

    var createEntry = function createEntry(req, res, next) {
        var entryInfo = _.pick(req.body, 'title', 'notes', 'tags', 'location');
        entryHelpers.createEntry(entryInfo, req.user)
            .then(function () {
                res.send(201);
                next();
            }).catch(errors.DuplicateEntryError, sendError(httpErrors.ConflictError, next));
    };

    var del = function del (req, res, next){
        entryHelpers.deleteEntry(req.params.id, req.user)
            .then(function(){
                res.send(204);
                next();
            }).catch(errors.InvalidEntryError, sendError(httpErrors.ResourceNotFoundError, next));
    };

    return {
        index: index,
        createEntry: createEntry,
        del: del
    };
};