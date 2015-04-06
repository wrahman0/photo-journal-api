"use strict";

var util = require("util");
var _ = require("lodash");

function UserExists(appKeyName) {
    this.message = "Cannot resolve default AppId for AppKey: " + appKeyName;
}
util.inherits(UserExists, Error);

module.exports = {
    UserExistsError: UserExists
};

