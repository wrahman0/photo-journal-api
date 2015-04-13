"use strict";

var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var errors = require('../common/errors');
var httpErrors = require('restify').errors;
var _ = require('lodash');

module.exports = function (userHelpers, authenticationHelpers){

    var Basic = new BasicStrategy(
        function (username, password, done) {
            // TODO: instead of getUserByFilter, make it getUserByName. Expose less functionality
            userHelpers.getUserByFilter({name: username})
                .then(function (user) {
                    if (authenticationHelpers.isValidPassword(password, user.password)) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                })
                .catch(errors.UserNotFoundError, function (){
                    done(new httpErrors.InvalidCredentialsError("Unauthorized request"));
                });
        }
    );

    var Bearer = new BearerStrategy(
        function (token, done) {
            // TODO: instead of getUserByFilter, make it getUserByToken. Expose less functionality
            userHelpers.getUserByFilter({token: token})
                .then(function (user) {
                    if (_.isNull(user)) {
                        done(null, false);
                    } else {
                        done(null, user);
                    }
                })
                .catch(errors.UserNotFoundError, function (){
                    done(new httpErrors.InvalidCredentialsError("Unauthorized request"));
                });
        }
    );

    return {
        BasicStrategy: Basic,
        BearerStrategy: Bearer
    };
};
