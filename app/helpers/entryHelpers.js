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

    var createEntry = function createEntry(entryInfo) {
        models.Entry.find({where: {title: entryInfo.title}})
            .then(function (entry){
                if (!_.isNull(entry)){
                    throw new Error('Duplicate entry title exists');
                }else{
                    return models.Entry.create(entryInfo);
                }
            });
    };

    return {
        getEntries: getEntries,
        createEntry: createEntry
    };
};