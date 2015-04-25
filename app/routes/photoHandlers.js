"use strict";

var _ = require('lodash');
var errors = require('../common/errors');
var sendError = require('../common/sendError');
var httpErrors = require('restify').errors;

module.exports = function (entryHelpers, photoHelpers) {

    var view = function view(req, res, next) {
        var photos = photoHelpers.getPhotosByEntryId(req.params.id);
        res.json(photos);
        next();
    };

    var createPhoto = function createPhoto(req, res, next){
        validateParams([
            {name: 'caption', in: req.body, required: true},
            {name: 'encodedBitmap', in: req.body, required: true},
            {name: 'location', in: req.body, required: true}
        ]).then(function(){
            return photoHelpers.createPhoto(req.body.caption, req.body.encodedBitmap, req.body.location);
        }).then(function(photo){
            return photoHelpers.addPhotoToEntry(req.params.id, photo);
        }).then(function(){
            res.send(201);
            next();
        });
    };

    var del = function del(req, res, next){

    };

    return {
        view: view,
        createPhoto: createPhoto,
        del: del
    };
};