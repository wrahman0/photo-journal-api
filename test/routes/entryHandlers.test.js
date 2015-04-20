"use strict";

var request = require('supertest');

var server = require('../../server');
var sequelize = server.db.sequelize;
var models = server.db.models;
var _ = require('lodash');
var expect = require('chai').expect;

describe.only('API - Entry Handler', function () {
    var api = request(server);

    before(function () {
        return sequelize.sync({force: true});
    });

    afterEach(function () {
        return sequelize.sync({force: true});
    });

    describe('GET /v1/entries/', function () {

        var getEndpoint = function () {
            return '/v1/entries/';
        };

        var testVariables = {
            hashedPassword: "$2a$10$rk0xPfrcfLkUwPyUuWBqpeE6FEX1WqrT.uVq6zbLnjNuJbKl3UhSO",
            name: "test-user",
            email: "test@user.com",
            unHashedPassword: "password",
            token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGVzdDEiLCJwYXNzd29yZCI6InBhc3N3b3JkIiwiZW1haWwiOiJ3cmFobWFuMEBnbWFpbC5jb20ifQ.dEfp5Gwe7t4ERDWu9T5KMOgKU8VM1emL6JMC8VPH4mY",
            entry: {
                title: "test-title",
                notes: "test note",
                tags: "test-tag",
                location: "21,24"
            }
        };

        before(function () {
            return models.User.create({
                name: testVariables.name,
                password: testVariables.hashedPassword,
                email: testVariables.email,
                token: testVariables.token
            }).then(function (user) {
                return models.Entry.create({
                    title: testVariables.entry.title,
                    notes: testVariables.entry.notes,
                    tags: testVariables.entry.tags,
                    location: testVariables.entry.location
                }).then(function (entry) {
                    user.addEntry(entry);
                })
            });
        });

        it('should return the user\'s entries when the credentials are valid', function (done) {
            api.get(getEndpoint())
                .auth(testVariables.name, testVariables.unHashedPassword)
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function (res) {
                    expect(res.body[0]).to.have.all.keys('id', 'title', 'notes', 'tags', 'location', 'createdAt', 'updatedAt', 'userId');
                    expect(res.body[0].title).to.equal(testVariables.entry.title);
                    expect(res.body[0].notes).to.equal(testVariables.entry.notes);
                    expect(res.body[0].tags).to.equal(testVariables.entry.tags);
                    expect(res.body[0].location).to.equal(testVariables.entry.location);
                }).end(done);
        });

        it('should return 401 when the username is invalid', function (done) {
            api.get(getEndpoint())
                .auth('invalid', testVariables.unHashedPassword)
                .expect('Content-Type', /json/)
                .expect(401, done);
        });

        it('should return 401 when the password is invalid', function (done) {
            api.get(getEndpoint())
                .auth(testVariables.name, 'invalid')
                .expect('Content-Type', /json/)
                .expect(401, done);
        });
    });

    describe('POST /v1/entries/', function () {

        var getEndpoint = function () {
            return '/v1/entries/';
        };

        var testVariables = {
            hashedPassword: "$2a$10$rk0xPfrcfLkUwPyUuWBqpeE6FEX1WqrT.uVq6zbLnjNuJbKl3UhSO",
            name: "test-user",
            email: "test@user.com",
            unHashedPassword: "password",
            token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGVzdDEiLCJwYXNzd29yZCI6InBhc3N3b3JkIiwiZW1haWwiOiJ3cmFobWFuMEBnbWFpbC5jb20ifQ.dEfp5Gwe7t4ERDWu9T5KMOgKU8VM1emL6JMC8VPH4mY",
            entry: {
                title: "test-title",
                notes: "test note",
                tags: "test-tag",
                location: "21,24"
            }
        };

        before(function () {
            return models.User.create({
                name: testVariables.name,
                password: testVariables.hashedPassword,
                email: testVariables.email,
                token: testVariables.token
            }).then(function(user){
                console.log(user);
            });
        });

        it('should post an entry when the user credentials are valid', function (done) {
            api.post(getEndpoint())
                .auth(testVariables.name, testVariables.unHashedPassword)
                .send(testVariables.entry)
                .expect(201, done);
        });

        it('should send error when the title is not sent', function (done) {
            api.post(getEndpoint())
                .auth(testVariables.name, testVariables.unHashedPassword)
                .send(_.pick(testVariables.entry, ['notes', 'tags', 'locations']))
                .expect(400, done);
        });

        it('should send error when the notes are not sent', function (done) {
            api.post(getEndpoint())
                .auth(testVariables.name, testVariables.unHashedPassword)
                .send(_.pick(testVariables.entry, ['title', 'tags', 'locations']))
                .expect(400, done);
        });

        it('should send error when the tags are not sent', function (done) {
            api.post(getEndpoint())
                .auth(testVariables.name, testVariables.unHashedPassword)
                .send(_.pick(testVariables.entry, ['title', 'notes', 'locations']))
                .expect(400, done);
        });

        it('should send error when the location is not sent', function (done) {
            api.post(getEndpoint())
                .auth(testVariables.name, testVariables.unHashedPassword)
                .send(_.pick(testVariables.entry, ['notes', 'tags', 'title']))
                .expect(400, done);
        });
    });
});
