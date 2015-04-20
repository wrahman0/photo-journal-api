"use strict";

var _ = require('lodash');
var errors = require('../common/errors');

module.exports = function (models) {

    // Assuming its been eager loaded by the user helper
    var getEntries = function getEntries(user) {
        return user.entries;
    };

    var getEntryById = function getEntryById(id) {
        return models.Entry.find({where: {id: id}})
            .then(function(entry){
                if (entry === null){
                    throw new errors.InvalidEntryError(id);
                }else{
                    return entry;
                }
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
                    })
                        .then(function (entry) {
                            user.addEntry(entry);
                        });
                }
            });
    };

    var deleteEntry = function deleteEntry(entryId, user) {
        return user.getEntries({where: {id: entryId}})
            .then(function (entry) {
                console.log(entry);
                if (_.isEmpty(entry)) {
                    throw new errors.InvalidEntryError(entryId);
                } else {
                    return getEntryById(entryId)
                        .then(function(entry){
                            return entry.destroy();
                        });
                }
            })
    };

    return {
        getEntries: getEntries,
        createEntry: createEntry,
        deleteEntry: deleteEntry
    };
};