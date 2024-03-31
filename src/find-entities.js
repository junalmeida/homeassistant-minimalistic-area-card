"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeAreas = exports.findEntities = void 0;
var custom_card_helpers_1 = require("custom-card-helpers");
var arrayFilter = function (array, conditions, maxSize) {
    if (!maxSize || maxSize > array.length) {
        maxSize = array.length;
    }
    var filteredArray = [];
    for (var i = 0; i < array.length && filteredArray.length < maxSize; i++) {
        var meetsConditions = true;
        for (var _i = 0, conditions_1 = conditions; _i < conditions_1.length; _i++) {
            var condition = conditions_1[_i];
            if (!condition(array[i])) {
                meetsConditions = false;
                break;
            }
        }
        if (meetsConditions) {
            filteredArray.push(array[i]);
        }
    }
    return filteredArray;
};
var findEntities = function (hass, maxEntities, entities, entitiesFallback, includeDomains, entityFilter) {
    var conditions = [];
    if (includeDomains === null || includeDomains === void 0 ? void 0 : includeDomains.length) {
        conditions.push(function (eid) { return includeDomains.includes((0, custom_card_helpers_1.computeDomain)(eid)); });
    }
    if (entityFilter) {
        conditions.push(function (eid) { return hass.states[eid] && entityFilter(hass.states[eid]); });
    }
    var entityIds = arrayFilter(entities, conditions, maxEntities);
    if (entityIds.length < maxEntities && entitiesFallback.length) {
        var fallbackEntityIds = (0, exports.findEntities)(hass, maxEntities - entityIds.length, entitiesFallback, [], includeDomains, entityFilter);
        entityIds.push.apply(entityIds, fallbackEntityIds);
    }
    return entityIds;
};
exports.findEntities = findEntities;
function subscribeAreas(hass) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(!hass || !hass.connection || !hass.connected)) return [3 /*break*/, 1];
                    return [2 /*return*/, undefined];
                case 1: return [4 /*yield*/, hass.connection.sendMessagePromise({
                        type: 'config/area_registry/list'
                    })];
                case 2:
                    result = (_a.sent());
                    if (!result)
                        return [2 /*return*/, undefined];
                    else
                        return [2 /*return*/, result];
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.subscribeAreas = subscribeAreas;
