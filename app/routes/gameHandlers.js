"use strict";

var _ = require('lodash');
var httpErrors = require('restify').errors;
var errors = require('../common/errors');
var sendError = require('../common/sendError');
var validateParams = require('../common/validateParams');

var gameId = "tictactoe";

module.exports = function (gameHelpers) {

    // Assigns a token to the game
    /*
     {
     "token": <user token>
     }
     */
    var init = function init(req, res, next) {
        return gameHelpers.getGameId(req.params.game).then(function () {
            return gameHelpers.startGame(req.user.token, gameHelpers.getGameId(gameId));
        }).catch(errors.InvalidGameError, sendError(httpErrors.BadRequestError, next));
    };

    return {
        init: init
    };
};
