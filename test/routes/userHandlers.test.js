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

    describe('GET /api/users/', function () {

        var getEndpoint = function () {
            return '/api/users/';
        };

        describe('Users exist', function (){

            var test_info = {
                name: "test-user",
                email: "test@user.com"
            };

            before(function () {
                return Promise.all([
                    models.User.create(test_info)
                ]);
            });

            after(function(){
                return sequelize.sync({force: true});
            });

            it('should return an array with all the user info when users exist', function (done) {
                api.get(getEndpoint())
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect(function(res){
                        expect(res.body[0]).to.have.all.keys('name', 'email', 'createdAt', 'updatedAt', 'id');
                    })
                    .end(done);
            });

            it('should return an array with all the user info when users exist', function (done) {
                api.get(getEndpoint())
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect(function(res){
                        expect(res.body[0]).to.have.all.keys('name', 'email', 'createdAt', 'updatedAt', 'id');
                        expect(res.body[0]).to.have.property('name', test_info.name);
                        expect(res.body[0]).to.have.property('email', test_info.email);
                    })
                    .end(done);
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

});
