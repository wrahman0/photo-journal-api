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

function Validation(errs) {
    this.message = _.pluck(errs, "message").join("; ");
}
util.inherits(Validation, Error);

function MissingArgument(argName) {
    this.message = "Missing argument: " + argName;
}
util.inherits(MissingArgument, Error);

function InvalidGameId (gameId){
    this.message = "Invalid Game ID: " + gameId;
}
util.inherits(InvalidGameId, Error);

function GameDoesntExist (gameId){
    this.message = "No game in progress with gameId: " + gameId + " for this user.";
}
util.inherits(GameDoesntExist, Error);

function InvalidMove (){
    this.message = "Invalid Move!";
}
util.inherits(InvalidMove, Error);

function TokenExpired (){
    this.message = "Current Token has Expired. Please request for another token";
}
util.inherits(TokenExpired, Error);

module.exports = {
    UserExistsError: UserExists,
    UserNotFoundError: UserNotFound,
    ValidationError: Validation,
    MissingArgumentError: MissingArgument,
    InvalidGameIdError: InvalidGameId,
    GameDoesntExistError: GameDoesntExist,
    InvalidMoveError: InvalidMove,
    TokenExpiredError: TokenExpired
};

