"use strict";

var _ = require('lodash');
var errors = require('../common/errors');

module.exports = function (models, entryHelpers) {

    var getPhotosByEntryId = function getPhotosByEntryId(user, id) {
        return entryHelpers.getEntryById(user, id)
            .then(function(entry){
                return entry.getPhotos().then(function(photos){
                    return photos;
                });
            });

    };

    var getPhotosByPhotoId = function getPhotosByPhotoId(id) {
        return models.Photo.find({where: {id: id}});
    };

    var createPhoto = function createPhoto(photoInfo, entry) {
        return models.Photo.create({
            caption: photoInfo.caption,
            encodedBitmap: photoInfo.encodedBitmap,
            location: photoInfo.location
        })
            .then(function (photo) {
                return entry.addPhoto(photo);
            });
    };

    var deletePhoto = function deletePhoto(photoId) {
        getPhotosByPhotoId(photoId)
            .then(function (photo) {
                if (_.isNull(photo)) {
                    throw new errors.InvalidPhotoError(photoId);
                } else {
                    return photo.destroy();
                }
            })
    };

    return {
        getPhotosByEntryId: getPhotosByEntryId,
        getPhotosByPhotoId: getPhotosByPhotoId,
        createPhoto: createPhoto,
        deletePhoto: deletePhoto
    };
};