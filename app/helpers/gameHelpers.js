"use strict";

var _ = require('lodash');
var errors = require('../common/errors');
var Promise = require ('bluebird');

module.exports = function (models, authenticationHelpers, userHelpers) {

    var startGame = function startGame(token, game, player) {
        return models.Game.create ({
            game: game,
            token: token,
            player: player
        });
    };

    var getGameId = function getGameId(game) {
        return new Promise (function (resolve, reject){
            switch (game.toLowerCase()) {
                case "tictactoe":
                    resolve ('ttt');
                    break;
                default :
                    reject (new errors.InvalidGameError(game));
            }
        });
    };

    return {
        startGame: startGame,
        getGameId: getGameId
    };
};