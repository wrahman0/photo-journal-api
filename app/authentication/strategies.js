"use strict";

var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var errors = require('../common/errors');
var httpErrors = require('restify').errors;
var _ = require('lodash');

module.exports = function (userHelpers, authenticationHelpers) {

    // Separated the logic because it will be easier to test
    var BasicStrategyLogic = function (username, password, done) {
        userHelpers.getUserByFilter({name: username})
            .then(function (user) {
                if (authenticationHelpers.isValidPassword(password, user.password)) {
                    done(null, user);
                } else {
                    throw new errors.UserNotFoundError(user.name);
                }
            })
            .catch(errors.UserNotFoundError, function () {
                done(new httpErrors.InvalidCredentialsError("Unauthorized request"));
            });
    };

    var BearerStrategyLogic = function (token, done) {
        userHelpers.getUserByFilter({token: token})
            .then(function (user) {
                if (_.isNull(user)) {
                    done(null, false);
                } else {
                    done(null, user);
                }
            })
            .catch(errors.UserNotFoundError, function () {
                done(new httpErrors.InvalidCredentialsError("Unauthorized request"));
            });
    };

    var Basic = new BasicStrategy(BasicStrategyLogic);

    var Bearer = new BearerStrategy(BearerStrategyLogic);

    return {
        BasicStrategy: Basic,
        BearerStrategy: Bearer,
        BasicStrategyLogic: BasicStrategyLogic,
        BearerStrategyLogic: BearerStrategyLogic
    };
};
