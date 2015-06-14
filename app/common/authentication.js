"use strict";

var _ = require('lodash');
var bcrypt = require('bcryptjs');
//var jwt = require('jwt-simple');
var jwt = require('jsonwebtoken');
var errors = require('./errors');
var Promise = require('bluebird');

module.exports = function (config) {

    var secret = config.auth.secret;

    var generateHashedPassword = function (unhashedPassword) {
        return bcrypt.hashSync(unhashedPassword, bcrypt.genSaltSync(10));
    };

    var isValidPassword = function (plaintext, hashed) {
        return bcrypt.compareSync(plaintext, hashed);
    };

    var encodePayload = function (payload) {
        return jwt.sign(payload, secret, {expiresInMinutes: 10});
    };

    var decodePayload = function (payload) {
        return jwt.decode(payload, secret);
    };

    var isValidToken = function (token) {
        return new Promise ( function (resolve, reject){
            jwt.verify(token, secret, function (err, decode) {
                if (err !== null && err.name === 'TokenExpiredError'){
                    reject (new errors.TokenExpiredError());
                }else{
                    resolve();
                }
            });
        });
    };

    /**
     *
     * Returns true is the users are the same.
     * Returns false if the users are different.
     *
     * @param authUser - The user that is passed by passport. Must be a sequelize object.
     * @param dataUser - The user that is retrieved from the db. Must be a sequelize object.
     */
    var validateUser = function (authUser, dataUser) {
        var authJSON = authUser.dataValues;
        var dataJSON = dataUser.dataValues;
        return (authJSON.email === dataJSON.email &&
        authJSON.name === dataJSON.name &&
        authJSON.password === dataJSON.password &&
        authJSON.token === dataJSON.token);
    };

    return {
        generateHashedPassword: generateHashedPassword,
        isValidPassword: isValidPassword,
        isValidToken: isValidToken,
        encodePayload: encodePayload,
        decodePayload: decodePayload,
        validateUser: validateUser
    }

};