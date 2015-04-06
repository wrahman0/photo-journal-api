"use strict";

var util = require("util");
var _ = require("lodash");

function NoDefaultAppId(appKeyName) {
    this.message = "Cannot resolve default AppId for AppKey: " + appKeyName;
}
util.inherits(NoDefaultAppId, Error);

module.exports = {
    NoDefaultAppIdError: NoDefaultAppId
};

