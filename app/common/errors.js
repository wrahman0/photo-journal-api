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

function InvalidEntry(id) {
    this.message = "Entry with id " + id + " does not exist";
}
util.inherits(InvalidEntry, Error);

function InvalidPhoto(id) {
    this.message = "Photo with id " + id + " does not exist";
}
util.inherits(InvalidPhoto, Error);

function InvalidGame(id) {
    this.message = "Photo with id " + id + " does not exist";
}
util.inherits(InvalidGame, Error);

module.exports = {
    UserExistsError: UserExists,
    DuplicateEntryError: DuplicateEntry,
    UserNotFoundError: UserNotFound,
    ValidationError: Validation,
    MissingArgumentError: MissingArgument,
    InvalidEntryError: InvalidEntry,
    InvalidPhotoError: InvalidPhoto,
    InvalidGameError: InvalidGame
};

