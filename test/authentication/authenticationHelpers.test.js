"use strict";

var _ = require('lodash');
var expect = require('chai').expect;
var authenticationHelpers = require('../../app/authentication/authenticationHelpers');
var bcrypt = require('bcryptjs');

describe.only('Authentication Helpers', function () {

    var testVariables = {
        password: 'password'
    };

    before(function () {
        var configMock = {};
        configMock.auth = {};
        configMock.auth.secret = 'testsuitesecret';
        authenticationHelpers = authenticationHelpers(configMock);
    });

    describe('Password hashing', function () {
        it ('should hash the password when a valid password is sent in', function(done){
            var hash = authenticationHelpers.generateHashedPassword(testVariables.password);
            expect(bcrypt.compareSync(testVariables.password, hash)).to.equal(true);
            done();
        });

        it ('should return true when the plaintext password and the corresponding hash is sent', function(done){
            var hash = authenticationHelpers.generateHashedPassword(testVariables.password);
            expect(authenticationHelpers.isValidPassword(testVariables.password, hash)).to.equal(true);
            done();
        });

        it ('should return false when the plaintext password doesnt match hash', function(done){
            var hash = authenticationHelpers.generateHashedPassword(testVariables.password);
            expect(authenticationHelpers.isValidPassword(testVariables.password, '')).to.equal(false);
            done();
        });
    });

});
