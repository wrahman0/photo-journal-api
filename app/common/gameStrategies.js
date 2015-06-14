"use strict";

var _ = require('lodash');
var Promise = require('bluebird');

module.exports = function (userHelpers, gameHelpers) {

    var TicTacToeStrategy = function TicTacToeStrategy(currentState, update, token) {
        return new Promise(function (resolve, reject){
            // parse the currentState
            console.log ("Current State: ", currentState, " update: ", update);
            currentState = JSON.parse(currentState);

            if (Object.keys(currentState).length === 0){
                currentState = {
                    board: [ [0,0,0], [0,0,0], [0,0,0] ]
                }
            }

            console.log ("Current State: ", currentState, " update: ", update);
            currentState.board[update.gridLoc[0]][[update.gridLoc[1]]] = 1;
            console.log ("Current State: ", currentState, " update: ", update);

            var result = "undetermined";

            // check if the player won
            if ((currentState.board[0][0] === 1 && currentState.board[1][0] === 1 && currentState.board[2][0] === 1)
                ||(currentState.board[0][1] === 1 && currentState.board[1][1] === 1 && currentState.board[2][1] === 1)
                ||(currentState.board[0][2] === 1 && currentState.board[1][2] === 1 && currentState.board[2][2] === 1)){
                result = "win";
            }

            // server's move
            var found = false;
            for (var i = 0; i < 3; ++i){
                for (var j = 0; j < 3; ++j){
                    if (!found && currentState.board[i][j] === 0){
                        currentState.board[i][j] = -1;
                        found = true;
                    }
                }
            }

            // check if the server won
            if ((currentState.board[0][0] === -1 && currentState.board[1][0] === -1 && currentState.board[2][0] === -1)
                || (currentState.board[0][1] === -1 && currentState.board[1][1] === -1 && currentState.board[2][1] === -1)
                || (currentState.board[0][2] === -1 && currentState.board[1][2] === -1 && currentState.board[2][2] === -1) ){
                result = "lose";
            }

            console.log ("Current State: ", currentState, " update: ", update);

            if (result === "win" || result === "lose"){
                return gameHelpers.endGame(token, 'tictactoe').then(function(){
                    currentState.result = result;
                    resolve(JSON.stringify(currentState));
                });
            }else{
                currentState.result = result;
                currentState = JSON.stringify(currentState);
                console.log ("Current State: ", currentState);
                return gameHelpers.updateState(token, 'tictactoe', currentState).then(function(){
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
