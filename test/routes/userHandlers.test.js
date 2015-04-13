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

    var getBearerHeader = function (token){
        return "Bearer " + token;
    };

    before(function () {
        return sequelize.sync({force: true});
    });

    describe('GET /v1/users/', function () {

        var getEndpoint = function () {
            return '/v1/users/';
        };

        var postEndpoint = function (){
            return '/v1/users/register'
        };

        describe.only('Users exist', function (){

            var testVariables = {
                testUser: {
                    name: "test-user",
                    email: "test@user.com",
                    password: "test-password"
                },
                responseToken: null
            };

            before(function (done) {
                // TODO: Modify this to directly add it to the db instead of adding through the api call
                api.post(postEndpoint())
                    .send(testVariables.testUser)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res){
                        if (err) done(err);
                        else{
                            testVariables.responseToken = res.body.token;
                            done();
                        }
                    });
            });

            after(function(){
                return sequelize.sync({force: true});
            });

            it('should return an array with all the user info when users exist', function (done) {
                api.get(getEndpoint())
                    .set("Authorization", getBearerHeader(testVariables.responseToken))
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect(function(res){
                        expect(res.body[0]).to.have.all.keys('name', 'email', 'createdAt', 'updatedAt', 'id');
                        done();
                    });
            });

            it('should return an array with all the user info when users exist', function (done) {
                api.get(getEndpoint())
                    .set("Authorization", getBearerHeader(testVariables.responseToken))
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect(function(res){
                        expect(res.body[0]).to.have.all.keys('name', 'email', 'createdAt', 'updatedAt', 'id');
                        expect(res.body[0]).to.have.property('name', test_info.name);
                        expect(res.body[0]).to.have.property('email', test_info.email);
                        done();
                    });
            });


        });

        describe('Users does not exist', function (){

            after(function(){
                return sequelize.sync({force: true});
            });

            it('should return an empty array when user does not exist', function (done) {
                api.get(getEndpoint())
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect([])
                    .end(done);
            });
        });
    });

    describe('GET /api/users/:userName', function () {

        var getEndpoint = function (userName) {
            return '/v1/users/' + userName;
        };

        describe('Users exist', function () {

            var test_info = {
                name: "test-user",
                email: "test@user.com"
            };

            before(function () {
                return Promise.all([
                    models.User.create(test_info)
                ]);
            });

            after(function () {
                return sequelize.sync({force: true});
            });

            it('should return user object when the user exists', function (done) {
                api.get(getEndpoint(test_info.name))
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect(function (res) {
                        expect(res.body).to.have.all.keys('name', 'email', 'createdAt', 'updatedAt', 'id');
                        expect(res.body).to.have.property('name', test_info.name);
                        expect(res.body).to.have.property('email', test_info.email);
                    })
                    .end(done);
            });
        });

        describe('User does not exist', function () {

            var test_info = {
                name: "test-user",
                email: "test@user.com"
            };

            before(function () {
                return Promise.all([
                    models.User.create(test_info)
                ]);
            });

            after(function () {
                return sequelize.sync({force: true});
            });

            it('should throw error when the user does not exist', function (done) {
                api.get(getEndpoint('invalid'))
                    .expect('Content-Type', /json/)
                    .expect(404)
                    .end(done);
            });
        });
    });
});
