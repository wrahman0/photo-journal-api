"use strict";

var util = require("util");
var _ = require("lodash");

function UserExists(userName) {
    this.message = "User exists: " + userName;
}
util.inherits(UserExists, Error);

function DuplicateEntry(title) {
    this.message = "Entry with the following title exists: " + title;
}
util.inherits(DuplicateEntry, Error);

module.exports = {
    UserExistsError: UserExists,
    DuplicateEntryError: DuplicateEntry
};

