"use strict";

var _ = require('lodash');
var httpErrors = require('restify').errors;
var errors = require('../common/errors');
var sendError = require('../common/sendError');
var validateParams = require('../common/validateParams');

module.exports = function (gameHelpers, gameStrategies) {

    var startGame = function startGame (req, res, next){
        return gameHelpers.startGame(req.user.token, req.params.gameId)
            .then(function (){
                res.send(200);
                next();
            })
            .catch(errors.InvalidGameIdError, sendError(httpErrors.BadRequestError, next));
    };

    // Makes the move for a given game
    // Request: {
    //    "update": {               // Update holds any information that the game logic needs to update the game state
    //        "gridLoc": [x, y]     // Using a 3x3 tic tac toe board, x, y are elements of {0, 1, 2}
    //    }
    // }
    // Response: {
    //    "state": { // response returns the new game state, which will vary from game to game
    //        "board": [[-1,0,0], [1,-1,1], [0,0,0]], // for a tic tac toe game, we will let -1 represent Computers move, 1 represent player's move, and 0 means empty cell
    //        "result": <"win", "lose", "tie", "undetermined">
    //    },
    // }
    var updateState = function updateState(req, res, next){
        validateParams([
            {name: 'update', in: req.body, required: true}
        ]).then(function () {
            // Retrieve current state
            return gameHelpers.getCurrentGame(req.user.token, req.params.gameId).then(function (game){
                return gameStrategies.getGameStrategy(game.gameId)(game.state, req.body.update, req.user.token)
            }).then(function (state){
                res.json({state: state});
                next();
            }).catch (errors.GameDoesntExistError, sendError(httpErrors.BadRequestError, next));
        }).catch(errors.ValidationError, sendError(httpErrors.BadRequestError, next));
    };

    return {
        startGame: startGame,
        updateState: updateState
    };
};
