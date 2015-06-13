"use strict";

var _ = require('lodash');
var Promise = require('bluebird');
var errors = require('../common/errors');

module.exports = function (models) {

    // Assuming its been eager loaded by the user helper
    var getEntries = function getEntries(user) {
        return new Promise(function (resolve) {
            resolve(user.entries);
        });
    };

    var getEntryById = function getEntryById(user, id) {
        return getEntries(user)
            .then(function (entries) {
                for (var i = 0; i < entries.length; ++i) {
                    if (entries[i].dataValues.id == id) {
                        return entries[i];
                    }
                }
                throw new errors.InvalidEntryError(id);
            });
    };

    var createEntry = function createEntry(entryInfo, user) {
        return user.getEntries({where: {title: entryInfo.title}})
            .then(function (entry) {
                if (!_.isEmpty(entry)) {
                    throw new errors.DuplicateEntryError(entryInfo.title);
                } else {
                    return models.Entry.create({
                        title: entryInfo.title,
                        notes: entryInfo.notes,
                        tags: entryInfo.tags,
                        location: entryInfo.location
                    }).then(function (entry) {
                        user.addEntry(entry);
                    });
                }
            });
    };

    var deleteEntry = function deleteEntry(entryId, user) {
        return user.getEntries({where: {id: entryId}})
            .then(function (entry) {
                if (_.isEmpty(entry)) {
                    throw new errors.InvalidEntryError(entryId);
                } else {
                    return getEntryById(entryId)
                        .then(function (entry) {
                            return entry.destroy();
                        });
                }
            })
    };

    return {
        getEntries: getEntries,
        createEntry: createEntry,
        getEntryById: getEntryById,
        deleteEntry: deleteEntry
    };
};