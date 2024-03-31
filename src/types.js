"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardType = exports.STATES_OFF = exports.UNAVAILABLE = void 0;
var custom_card_helpers_1 = require("custom-card-helpers");
var package_json_1 = require("../package.json");
exports.UNAVAILABLE = "unavailable";
exports.STATES_OFF = __spreadArray(__spreadArray([], custom_card_helpers_1.STATES_OFF, true), [exports.UNAVAILABLE, "idle",
    "disconnected"], false);
exports.cardType = package_json_1.name;
