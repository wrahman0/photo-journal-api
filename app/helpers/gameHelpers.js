"use strict";

var _ = require('lodash');
var errors = require('../common/errors');

module.exports = function (models) {

    var startGame = function startGame(token, gameId) {



        return models.Game.create({
            token: token,
            gameId: gameId
        });
    };

    return {
        startGame: startGame
    };
};