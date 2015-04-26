"use strict";

var _ = require('lodash');
var errors = require('../common/errors');
var sendError = require('../common/sendError');
var httpErrors = require('restify').errors;

module.exports = function (entryHelpers, photoHelpers) {

    var view = function view(req, res, next) {
        photoHelpers.getPhotosByEntryId(req.user, req.params.id)
            .then(function(photos){
                res.json(photos);
                next();
            }).catch(errors.InvalidEntryError, sendError(httpErrors.ResourceNotFoundError, next));
    };

    var createPhoto = function createPhoto(req, res, next) {
        validateParams([
            {name: 'caption', in: req.body, required: true},
            {name: 'encodedBitmap', in: req.body, required: true},
            {name: 'location', in: req.body, required: true}
        ]).then(function () {
            return entryHelpers.getEntryById(req.user, req.id);
        }).then(function (entry) {
            var photoInfo = {
                caption: req.body.caption,
                encodedBitmap: req.body.encodedBitmap,
                location: req.body.location
            };
            return photoHelpers.createPhoto(photoInfo, entry);
        }).then(function () {
            res.send(201);
            next();
        }).catch(errors.InvalidEntryError, sendError(httpErrors.ResourceNotFoundError, next))
            .catch(errors.ValidationError, sendError(httpErrors.BadRequestError, next));
    };

    var del = function del(req, res, next) {
        photoHelpers.deletePhoto(req.params.photoId)
            .then(function () {
                res.send(204);
                next();
            }).catch(errors.InvalidPhotoError, sendError(httpErrors.ResourceNotFoundError, next));
    };

    return {
        view: view,
        createPhoto: createPhoto,
        del: del
    };
};