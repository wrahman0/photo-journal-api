"use strict";

var request = require('supertest');
var Promise = require('bluebird');

var server = require('../../server');
var sequelize = server.db.sequelize;
var models = server.db.models;
var _ = require('lodash');
var expect = require('chai').expect;

describe('API - User Handler', function () {
    var api = request(server);

    before(function () {
        return sequelize.sync({force: true});
    });

    afterEach(function () {
        return sequelize.sync({force: true});
    });

    describe('GET /v1/users/', function () {

        var getEndpoint = function () {
            return '/v1/users/';
        };

        var test_info = {
            hashedPassword: "$2a$10$rk0xPfrcfLkUwPyUuWBqpeE6FEX1WqrT.uVq6zbLnjNuJbKl3UhSO",
            name: "test-user",
            email: "test@user.com",
            unHashedPassword: "password",
            token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGVzdDEiLCJwYXNzd29yZCI6InBhc3N3b3JkIiwiZW1haWwiOiJ3cmFobWFuMEBnbWFpbC5jb20ifQ.dEfp5Gwe7t4ERDWu9T5KMOgKU8VM1emL6JMC8VPH4mY"
        };

        before(function () {
            return models.User.create({
                name: test_info.name,
                password: test_info.hashedPassword,
                email: test_info.email,
                token: test_info.token
            });
        });

        it('should return a user object when the credentials are valid', function (done) {
            api.get(getEndpoint())
                .auth(test_info.name, test_info.unHashedPassword)
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function (res) {
                    expect(res.body).to.have.all.keys('name', 'email', 'createdAt', 'updatedAt', 'id', 'password', 'token', 'entries');
                })
                .end(done);
        });

        it('should return 401 when the username is invalid', function (done) {
            api.get(getEndpoint())
                .auth('invalid', test_info.unHashedPassword)
                .expect('Content-Type', /json/)
                .expect(401, done);
        });

        it('should return 401 when the password is invalid', function (done) {
            api.get(getEndpoint())
                .auth(test_info.name, 'invalid')
                .expect('Content-Type', /json/)
                .expect(401, done);
        });
    });

    //describe('GET /api/users/:userName', function () {
    //
    //    var getEndpoint = function (userName) {
    //        return '/v1/users/' + userName;
    //    };
    //
    //    describe('Users exist', function () {
    //
    //        var test_info = {
    //            name: "test-user",
    //            email: "test@user.com"
    //        };
    //
    //        before(function () {
    //            return Promise.all([
    //                models.User.create(test_info)
    //            ]);
    //        });
    //
    //        after(function () {
    //            return sequelize.sync({force: true});
    //        });
    //
    //        it('should return user object when the user exists', function (done) {
    //            api.get(getEndpoint(test_info.name))
    //                .expect('Content-Type', /json/)
    //                .expect(200)
    //                .expect(function (res) {
    //                    expect(res.body).to.have.all.keys('name', 'email', 'createdAt', 'updatedAt', 'id');
    //                    expect(res.body).to.have.property('name', test_info.name);
    //                    expect(res.body).to.have.property('email', test_info.email);
    //                })
    //                .end(done);
    //        });
    //    });
    //
    //    describe('User does not exist', function () {
    //
    //        var test_info = {
    //            name: "test-user",
    //            email: "test@user.com"
    //        };
    //
    //        before(function () {
    //            return Promise.all([
    //                models.User.create(test_info)
    //            ]);
    //        });
    //
    //        after(function () {
    //            return sequelize.sync({force: true});
    //        });
    //
    //        it('should throw error when the user does not exist', function (done) {
    //            api.get(getEndpoint('invalid'))
    //                .expect('Content-Type', /json/)
    //                .expect(404)
    //                .end(done);
    //        });
    //    });
    //});
});
