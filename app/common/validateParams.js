"use strict";

var Promise = require('bluebird');
var _ = require('lodash');
var errors = require('./errors');

/**
 * Validates a number of parameters for a request handler. Can handle params in the request route, query or body (or
 * anything else), and also handles asynchronous validators.
 *
 * All validators should be paired with an error type to include in the ValidationError. (see errors.js)
 * All parameter validation descriptions should have at least one of required: true or a validator/error pair. Both are
 * allowed on the same property.
 *
 * Usage:
 * validateParams([
 *     // Ensure that req.params.testParam exists, otherwise throws a MissingArgumentError
 *     {name: 'testParam', in: req.params, required: true},
 *     // Ensure that if the version exists, the version is valid semver, otherwise throw an InvalidSemverFormatError
 *     {name: 'version', in: req.body, validator: semver.valid, error: InvalidSemverFormatError},
 * ]).then(function() {
 *     // All validations passed! Handle the request and response
 * }).catch(ValidationError, function(err) {
 *     // Handle the validation errors. Probably want to respond with a 400
 * });
 *
 * @param params The list of parameters to validate
 * @returns {Promise<R[]>} A promise of a list of asynchronous validation checks. Will complete when all validations have.
 */
module.exports = function (params) {
    var exists = function (value) {
        return !(_.isUndefined(value) || _.isNull(value) || _.isEmpty(value));
    };

    if (process.env.NODE_ENV !== "production") {
        _.forEach(params, function (param) {
            if (!_.has(param, "required") && !(_.has(param, "validator") && _.has(param, "error"))) {
                throw "Validator for " + param.name + " must be required and/or define a validator.";
            }
        });
    }

    var validate = function (param) {
        var value = param.in[param.name];
        if (exists(value) && param.validator) {
            return Promise.resolve(param.validator(value)).then(function (result) {
                if (!result) {
                    return Promise.reject(new param.error(param.name));
                }
                return result;
            });
        } else if (param.required && !exists(value)) {
            return Promise.reject(new errors.MissingArgumentError(param.name));
        } else {
            return true;
        }
    };

    return Promise.settle(_.map(params, validate)).then(function (results) {
        var rejections = _.filter(results, function (r) {
            return r.isRejected();
        });
        if (!_.isEmpty(rejections)) {
            throw new errors.ValidationError(_.map(rejections, function (r) {
                return r.reason();
            }));
        }
    });
};
