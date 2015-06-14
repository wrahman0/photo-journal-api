"use strict";

var _ = require('lodash');
var Promise = require('bluebird');
var errors = require('./errors');

module.exports = function (userHelpers, gameHelpers) {

    var TicTacToeStrategy = function TicTacToeStrategy(currentState, update, token) {

        var boardMarker = {
            player: 1,
            computer: -1
        };

        var resultText = {
            winStatus: "win",
            loseStatus: "lose",
            tieStatus: "tie",
            undeterminedStatus: "undetermined"
        };

        var checkWinCondition = function checkWinCondition(board, value){
            return (board[0][0] === value && board[1][0] === value && board[2][0] === value)
            ||(board[0][1] === value && board[1][1] === value && board[2][1] === value)
            ||(board[0][2] === value && board[1][2] === value && board[2][2] === value)
            ||(board[0][0] === value && board[0][1] === value && board[0][2] === value)
            ||(board[1][0] === value && board[1][1] === value && board[1][2] === value)
            ||(board[2][0] === value && board[2][1] === value && board[2][2] === value)
            ||(board[0][0] === value && board[1][1] === value && board[2][2] === value)
            ||(board[2][0] === value && board[1][1] === value && board[0][2] === value)
        };

        var findNextLocation = function findNextLocation(board){
            var zeroLocations = [];
            for (var i = 0; i < 3; ++i){
                for (var j = 0; j < 3; ++j){
                    if (board[i][j] === 0){
                        zeroLocations.push([i,j]);
                    }
                }
            }
            return (zeroLocations.length === 0) ? -1 : zeroLocations[Math.floor(Math.random() * zeroLocations.length)];
        };

        return new Promise(function (resolve, reject){
            // parse the currentState
            currentState = JSON.parse(currentState);

            if (Object.keys(currentState).length === 0){
                currentState = {
                    board: [ [0,0,0], [0,0,0], [0,0,0] ]
                }
            }

            if (currentState.board[update.gridLoc[0]][[update.gridLoc[1]]] !== 0){
                reject (new errors.InvalidMoveError());
            }else{
                currentState.board[update.gridLoc[0]][[update.gridLoc[1]]] = boardMarker.player;
            }

            var result = resultText.undeterminedStatus;

            // check if the player won
            if (checkWinCondition(currentState.board, boardMarker.player)){
                result = resultText.winStatus;
            }

            // computer's move (this computer is dumb and therefore chooses the first empty cell)
            var loc = findNextLocation (currentState.board);

            if (loc === -1){
                result = resultText.tieStatus;
            }else{
                currentState.board[loc[0]][loc[1]] = boardMarker.computer;
            }

            // check if the server won
            if (checkWinCondition(currentState.board, boardMarker.computer)){
                result = resultText.loseStatus;
            }

            if (result === resultText.winStatus || result === resultText.loseStatus || result === resultText.tieStatus){
                return gameHelpers.endGame(token, 'tictactoe').then(function(){
                    currentState.result = result;
                    resolve(currentState);
                });
            }else{
                currentState.result = result;
                return gameHelpers.updateState(token, 'tictactoe', JSON.stringify(currentState)).then(function(){
                    resolve(currentState);
                });
            }
        })
    };

    var getGameStrategy = function getGameStrategy (gameId){
        if (gameId === 'tictactoe'){
            return TicTacToeStrategy;
        }
    };

    return {
        getGameStrategy: getGameStrategy
    };
};
