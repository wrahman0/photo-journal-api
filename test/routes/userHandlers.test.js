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

            it.only('should return an array of all the users when users exist', function (done) {
                api.get(getEndpoint())
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect(function(res){
                        expect(res.body[0]).to.have.all.keys('name', 'email', 'createdAt', 'updatedAt', 'id');
                    })
                    .end(done);
            });
        });

        describe('Users exist', function (){

            before(function(){
                return sequelize.sync({force: true});
            });

            after(function(){
                return sequelize.sync({force: true});
            });

            it('should return an array of all the users when users exist', function (done) {
                api.get(getEndpoint())
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect([])
                    .end(done);
            });
        });


    });

});
