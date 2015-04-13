"use strict";

var _ = require('lodash');
var errors = require('../common/errors');

module.exports = function (models) {

    // Assuming its been eager loaded by the user helper
    var getEntries = function getEntries(user) {
        return user.entries;
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

    return {
        getEntries: getEntries,
        createEntry: createEntry
    };
};