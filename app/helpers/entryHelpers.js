"use strict";

var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function (models) {

    var getEntries = function getEntries() {
        /*
         TODO: Format like this:
         {
            2015-04-07: {
                entries: [
                    { ... },
                    { ... }
                ]
            }
         }
          */
        return models.Entry.findAll();
    };

    var createEntry = function createEntry() {

    };

    return {
        getEntries: getEntries,
        createEntry: createEntry
    };
};