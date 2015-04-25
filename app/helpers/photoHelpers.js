"use strict";

var _ = require('lodash');
var errors = require('../common/errors');

module.exports = function (models, entryHelpers) {

    var getPhotosByEntryId = function getPhotosByEntryId(id) {
        entryHelpers.getEntryById(id).then(function(entry){
            return entry.getPhotos();
        });
    };

    var addPhotoToEntry = function addPhotoToEntry(entryId, photo){
        getEntryById(entryId)
            .then(function(entry){
                return entry.addPhoto(photo);
            });
    };

    var createPhoto = function createPhoto(caption, encodedBitmap, location){
        return models.Photo.create({ caption: caption, encodedBitmap: encodedBitmap, location: location });
    };

    return {
        getPhotosByEntryId: getPhotosByEntryId,
        addPhotoToEntry: addPhotoToEntry,
        createPhoto: createPhoto
    };
};