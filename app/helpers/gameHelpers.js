"use strict";

var _ = require('lodash');
var errors = require('../common/errors');
var Promise = require('bluebird');

module.exports = function (models) {

    var startGame = function startGame(token, gameId, gameStrategies) {

        return isValidGameId(gameId).then(function(){
            return models.Game.create({
                token: token,
                gameId: gameId
            });
        });

    };

    var isValidGameId = function isValidGameId (gameId){
        var validIds = ['tictactoe'];

        return new Promise ( function ( resolve, reject ){
            if (_.includes(validIds, gameId)) {
                resolve(true);
            } else {
                reject (new errors.InvalidGameIdError(gameId));
            }
        });

    };

    // Retrieves the current game record from the db
    var getCurrentGame = function getCurrentGame(token, gameId){
        return models.Game.findAll({where: {token: token, gameId: gameId}})
            .then(function (games){
                if (games.length === 0){
                    throw new errors.GameDoesntExistError(gameId);
                }else{
                    return games[0];
                }
            });
    };

    var endGame = function endGame (token, gameId, won) {
        if (won){
            return models.User.find({token: token}).then(function(user){
                return user.updateAttributes({gamesWon: user.gamesWon+1});
            }).then(function (){
                return models.Game.findAll({where: {token: token, gameId: gameId}})
                    .then(function (games){
                        if (games.length === 0){
                            throw new errors.GameDoesntExistError(gameId);
                        }else{
                            return games[0].destroy();
                        }
                    });
            });
        }else{
            return models.Game.findAll({where: {token: token, gameId: gameId}})
                .then(function (games){
                    if (games.length === 0){
                        throw new errors.GameDoesntExistError(gameId);
                    }else{
                        return games[0].destroy();
                    }
                });
        }
    };

    var updateState = function updateState (token, gameId, state){
        return models.Game.findAll({where: {token: token, gameId: gameId}})
            .then(function (games){
                console.log("Here");
                if (games.length === 0){
                    throw new errors.GameDoesntExistError(gameId);
                }else{
                    return games[0].updateAttributes({
                        state: state
                    });
                }
            });
    };

    var increasePoints = function increasePoints (token, gameId){
        return models.Game.findAll({where: {token: token, gameId: gameId}})
            .then(function (games){
                if (games.length === 0){
                    throw new errors.GameDoesntExistError(gameId);
                }else{
                    return games[0].updateAttributes({
                        gamesWon: games[0].gamesWon + 1
                    });
                }
            });
    }

    return {
        startGame: startGame,
        getCurrentGame: getCurrentGame,
        endGame: endGame,
        updateState: updateState,
        increasePoints: increasePoints
    };
};