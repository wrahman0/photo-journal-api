"use strict";

var util = require("util");
var _ = require("lodash");

function UserExists(userName) {
    this.message = "User exists: " + userName;
}
util.inherits(UserExists, Error);

function UserNotFound(userName) {
    this.message = "User does not exist: " + userName;
}
util.inherits(UserNotFound, Error);

function DuplicateEntry(title) {
    this.message = "Entry with the following title exists: " + title;
}
util.inherits(DuplicateEntry, Error);

function Validation(errs) {
    this.message = _.pluck(errs, "message").join("; ");
}
util.inherits(Validation, Error);

function MissingArgument(argName) {
    this.message = "Missing argument: " + argName;
}
util.inherits(MissingArgument, Error);

function InvalidGameId (gameId){
    this.message = "Missing argument: " + gameId;
}
util.inherits(InvalidGameId, Error);

module.exports = {
    UserExistsError: UserExists,
    DuplicateEntryError: DuplicateEntry,
    UserNotFoundError: UserNotFound,
    ValidationError: Validation,
    MissingArgumentError: MissingArgument,
    InvalidGameIdError: InvalidGameId
};

