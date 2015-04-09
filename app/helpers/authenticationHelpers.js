"use strict";

var _ = require('lodash');
var passwordHash = require('password-hash');
var jwt = require('jwt-simple');

module.exports = function (config) {

    var secret = config.auth.secret;

    var generateHashedPassword = function (unhashedPassword) {
        return passwordHash.generate(unhashedPassword);
    };

    var encodePayload = function (payload) {
        return jwt.encode(payload, secret);
    };

    var decodePayload = function (payload) {
        return jwt.decode(payload, secret);
    };

    return {
        generateHashedPassword: generateHashedPassword,
        encodePayload: encodePayload,
        decodePayload: decodePayload
    }

};