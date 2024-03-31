"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
/* eslint-disable @typescript-eslint/no-explicit-any */
var custom_card_helpers_1 = require("custom-card-helpers"); // This is a community maintained npm module with common helper functions/types. https://github.com/custom-cards/custom-card-helpers
var lit_1 = require("lit");
var class_map_1 = require("lit/directives/class-map");
var if_defined_1 = require("lit/directives/if-defined");
var action_handler_directive_1 = require("./action-handler-directive");
var find_entities_1 = require("./find-entities");
var types_1 = require("./types");
var package_json_1 = require("../package.json");
/* eslint no-console: 0 */
console.info("%c  Minimalistic Area Card  %c ".concat(package_json_1.version, " "), 'color: orange; font-weight: bold; background: black', 'color: white; font-weight: bold; background: dimgray');
var STATE_NOT_RUNNING = "NOT_RUNNING";
var SENSORS = [
    "sensor",
    "binary_sensor"
];
var DOMAINS_TOGGLE = [
    "fan",
    "input_boolean",
    "light",
    "switch",
    "group",
    "automation",
    "humidifier",
];
var createEntityNotFoundWarning = function (hass, entityId) {
    return hass.config.state !== STATE_NOT_RUNNING
        ? hass.localize("ui.panel.lovelace.warning.entity_not_found", "entity", entityId || "[empty]")
        : hass.localize("ui.panel.lovelace.warning.starting");
};
var MinimalisticAreaCard = /** @class */ (function (_super) {
    __extends(MinimalisticAreaCard, _super);
    function MinimalisticAreaCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._entitiesDialog = [];
        _this._entitiesToggle = [];
        _this._entitiesSensor = [];
        return _this;
    }
    MinimalisticAreaCard.prototype.performUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setArea();
                        this.setEntities();
                        return [4 /*yield*/, _super.prototype.performUpdate.call(this)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MinimalisticAreaCard.prototype.setArea = function () {
        var _a;
        if ((_a = this.hass) === null || _a === void 0 ? void 0 : _a.connected) {
            if (this.config && this.config.area) {
                var area = this.hass.areas[this.config.area];
                if (area) {
                    this.area = area;
                    this.areaEntities = MinimalisticAreaCard.findAreaEntities(this.hass, area.area_id);
                }
                else {
                    this.area = undefined;
                    this.areaEntities = undefined;
                }
            }
            else {
                this.area = undefined;
                this.areaEntities = undefined;
            }
        }
        else {
            console.error("Invalid hass connection");
        }
    };
    MinimalisticAreaCard.prototype.setEntities = function () {
        var _this = this;
        var _a;
        this._entitiesDialog = [];
        this._entitiesToggle = [];
        this._entitiesSensor = [];
        var entities = ((_a = this.config) === null || _a === void 0 ? void 0 : _a.entities) || this.areaEntities || [];
        entities.forEach(function (item) {
            var _a;
            var entity = _this.parseEntity(item);
            var _b = entity.entity.split('.'), domain = _b[0], _ = _b[1];
            if (SENSORS.indexOf(domain) !== -1 || entity.attribute) {
                _this._entitiesSensor.push(entity);
            }
            else if (((_a = _this.config) === null || _a === void 0 ? void 0 : _a.force_dialog) ||
                DOMAINS_TOGGLE.indexOf(domain) === -1) {
                _this._entitiesDialog.push(entity);
            }
            else {
                _this._entitiesToggle.push(entity);
            }
        });
    };
    MinimalisticAreaCard.prototype.parseEntity = function (item) {
        if (typeof item === "string")
            return {
                entity: item
            };
        else
            return item;
    };
    MinimalisticAreaCard.prototype._handleEntityAction = function (ev) {
        var config = ev.currentTarget.config;
        (0, custom_card_helpers_1.handleAction)(this, this.hass, config, ev.detail.action);
    };
    MinimalisticAreaCard.prototype._handleThisAction = function (ev) {
        var _a, _b;
        var parent = (_b = (_a = ev.currentTarget.getRootNode()) === null || _a === void 0 ? void 0 : _a.host) === null || _b === void 0 ? void 0 : _b.parentElement;
        if (this.hass && this.config && ev.detail.action && (!parent || parent.tagName !== "HUI-CARD-PREVIEW")) {
            (0, custom_card_helpers_1.handleAction)(this, this.hass, this.config, ev.detail.action);
        }
    };
    // The user supplied configuration. Throw an exception and Home Assistant
    // will render an error card.
    MinimalisticAreaCard.prototype.setConfig = function (config) {
        if (!config ||
            (config.entities &&
                !Array.isArray(config.entities))) {
            throw new Error("Invalid configuration");
        }
        this.config = __assign({ hold_action: { action: "more-info" } }, config);
    };
    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    MinimalisticAreaCard.prototype.getCardSize = function () {
        return 3;
    };
    MinimalisticAreaCard.prototype.render = function () {
        var _this = this;
        var _a, _b;
        if (!this.config || !this.hass) {
            return (0, lit_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject([""], [""])));
        }
        var background_color = this.config.background_color ? "background-color: ".concat(this.config.background_color) : "";
        var font_color = this.config.font_color ? "color: ".concat(this.config.font_color) : "";
        var icon_color = this.config.icon_color ? "color: ".concat(this.config.icon_color) : "";
        var image_position = this.config.image_position ? "background-position: ".concat(this.config.image_position) : "";
        var imageUrl = undefined;
        if (!this.config.camera_image && (this.config.image || ((_a = this.area) === null || _a === void 0 ? void 0 : _a.picture))) {
            imageUrl = (new URL(this.config.image || ((_b = this.area) === null || _b === void 0 ? void 0 : _b.picture) || "", this.hass.auth.data.hassUrl)).toString();
        }
        return (0, lit_1.html)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n        <ha-card @action=", " style=", " .actionHandler=", "\n            tabindex=", ">\n            ", "\n            ", "\n        \n            <div class=\"box\">\n                <div class=\"card-header\" style=", " >", "</div>\n                <div class=\"sensors\" style=", " >\n                    ", "\n                </div>\n                <div class=\"buttons\">\n                    ", "\n                    ", "\n                </div>\n            </div>\n        </ha-card>\n    "], ["\n        <ha-card @action=", " style=", " .actionHandler=", "\n            tabindex=", ">\n            ", "\n            ", "\n        \n            <div class=\"box\">\n                <div class=\"card-header\" style=", " >", "</div>\n                <div class=\"sensors\" style=", " >\n                    ", "\n                </div>\n                <div class=\"buttons\">\n                    ", "\n                    ", "\n                </div>\n            </div>\n        </ha-card>\n    "])), this._handleThisAction, background_color, (0, action_handler_directive_1.actionHandler)({
            hasHold: (0, custom_card_helpers_1.hasAction)(this.config.hold_action), hasDoubleClick: (0, custom_card_helpers_1.hasAction)(this.config.double_tap_action),
        }), (0, if_defined_1.ifDefined)((0, custom_card_helpers_1.hasAction)(this.config.tap_action) ? "0" : undefined), imageUrl ? (0, lit_1.html)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<img src=", " style=", " class=", " />"], ["<img src=", " style=", " class=", " />"])), imageUrl, image_position, (0, class_map_1.classMap)({
            "darken": this.config.darken_image === undefined ? false : this.config.darken_image,
        })) : null, this.config.camera_image ? (0, lit_1.html)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["<div class=", ">\n                <hui-image\n                    .hass=", " \n                    .cameraImage=", " \n                    .entity=", "\n                    .cameraView=", " \n                    .width=\"100%\"></hui-image>\n            </div>"], ["<div class=", ">\n                <hui-image\n                    .hass=", " \n                    .cameraImage=", " \n                    .entity=", "\n                    .cameraView=", " \n                    .width=\"100%\"></hui-image>\n            </div>"])), (0, class_map_1.classMap)({
            "camera": true,
            "darken": this.config.darken_image === undefined ? false : this.config.darken_image,
        }), this.hass, this.config.camera_image, this.config.camera_image, this.config.camera_view || "auto") : null, font_color, this.config.title, icon_color, this._entitiesSensor.map(function (entityConf) { return _this.renderEntity(entityConf, true, true); }), this._entitiesDialog.map(function (entityConf) { return _this.renderEntity(entityConf, true, false); }), this._entitiesToggle.map(function (entityConf) { return _this.renderEntity(entityConf, false, false); }));
    };
    MinimalisticAreaCard.prototype.renderEntity = function (entityConf, dialog, isSensor) {
        var _a, _b, _c;
        var stateObj = this.hass.states[entityConf.entity];
        entityConf = __assign({ tap_action: { action: dialog ? "more-info" : "toggle" }, hold_action: { action: "more-info" }, show_state: entityConf.show_state === undefined ? true : !!entityConf.show_state }, entityConf);
        if ((!stateObj || stateObj.state === types_1.UNAVAILABLE) && !this.config.hide_unavailable) {
            return (0, lit_1.html)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n            <div class=\"wrapper\">\n                <hui-warning-element .label=", " class=", "></hui-warning-element>\n            </div>\n      "], ["\n            <div class=\"wrapper\">\n                <hui-warning-element .label=", " class=", "></hui-warning-element>\n            </div>\n      "])), createEntityNotFoundWarning(this.hass, entityConf.entity), (0, class_map_1.classMap)({
                "shadow": this.config.shadow === undefined ? false : this.config.shadow,
            }));
        }
        else if ((!stateObj || stateObj.state === types_1.UNAVAILABLE) && this.config.hide_unavailable) {
            return (0, lit_1.html)(templateObject_6 || (templateObject_6 = __makeTemplateObject([""], [""])));
        }
        var active = stateObj && stateObj.state && types_1.STATES_OFF.indexOf(stateObj.state.toString().toLowerCase()) === -1;
        var title = "".concat(((_a = stateObj.attributes) === null || _a === void 0 ? void 0 : _a.friendly_name) || stateObj.entity_id, ": ").concat((0, custom_card_helpers_1.computeStateDisplay)((_b = this.hass) === null || _b === void 0 ? void 0 : _b.localize, stateObj, (_c = this.hass) === null || _c === void 0 ? void 0 : _c.locale));
        return (0, lit_1.html)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n    <div class=\"wrapper\">\n        <ha-icon-button @action=", " .actionHandler=", "\n            .config=", " class=", ">\n            <state-badge .hass=", " .stateObj=", " .title=", " .overrideIcon=", "\n                .stateColor=", " class=", "></state-badge>\n        </ha-icon-button>\n        ", "\n    </div>\n    "], ["\n    <div class=\"wrapper\">\n        <ha-icon-button @action=", " .actionHandler=", "\n            .config=", " class=", ">\n            <state-badge .hass=", " .stateObj=", " .title=", " .overrideIcon=", "\n                .stateColor=", " class=", "></state-badge>\n        </ha-icon-button>\n        ", "\n    </div>\n    "])), this._handleEntityAction, (0, action_handler_directive_1.actionHandler)({
            hasHold: (0, custom_card_helpers_1.hasAction)(entityConf.hold_action), hasDoubleClick: (0, custom_card_helpers_1.hasAction)(entityConf.double_tap_action),
        }), entityConf, (0, class_map_1.classMap)({ "state-on": active, }), this.hass, stateObj, title, entityConf.icon, entityConf.state_color !== undefined ? entityConf.state_color : this.config.state_color
            !== undefined ? this.config.state_color : true, (0, class_map_1.classMap)({
            "shadow": this.config.shadow === undefined
                ? false : this.config.shadow,
        }), isSensor && entityConf.show_state ? (0, lit_1.html)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n        <div class=\"state\">\n            ", "\n        </div>\n        "], ["\n        <div class=\"state\">\n            ", "\n        </div>\n        "])), entityConf.attribute
            ? (0, lit_1.html)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n            ", "\n            ", "\n            ", "\n            "], ["\n            ", "\n            ", "\n            ", "\n            "])), entityConf.prefix, stateObj.attributes[entityConf.attribute], entityConf.suffix) : this.computeStateValue(stateObj)) : null);
    };
    MinimalisticAreaCard.prototype.isNumericState = function (stateObj) {
        return !!stateObj.attributes.unit_of_measurement ||
            !!stateObj.attributes.state_class;
    };
    MinimalisticAreaCard.prototype.computeStateValue = function (stateObj) {
        var _a = stateObj.entity_id.split("."), domain = _a[0], _ = _a[1];
        if (this.isNumericState(stateObj)) {
            var value = Number(stateObj.state);
            if (isNaN(value))
                return null;
            else
                return "".concat(value).concat(stateObj.attributes.unit_of_measurement
                    ? " " + stateObj.attributes.unit_of_measurement
                    : "");
        }
        else if (domain !== "binary_sensor" && stateObj.state !== "unavailable" && stateObj.state !== "idle") {
            return stateObj.state;
        }
        else {
            return null;
        }
    };
    MinimalisticAreaCard.prototype.shouldUpdate = function (changedProps) {
        if ((0, custom_card_helpers_1.hasConfigOrEntityChanged)(this, changedProps, false)) {
            return true;
        }
        var oldHass = changedProps.get("hass");
        if (!oldHass ||
            oldHass.themes !== this.hass.themes ||
            oldHass.locale !== this.hass.locale) {
            return true;
        }
        for (var _i = 0, _a = __spreadArray(__spreadArray(__spreadArray([], this._entitiesDialog, true), this._entitiesToggle, true), this._entitiesSensor, true); _i < _a.length; _i++) {
            var entity = _a[_i];
            if (oldHass.states[entity.entity] !== this.hass.states[entity.entity]) {
                return true;
            }
        }
        return false;
    };
    MinimalisticAreaCard.findAreaEntities = function (hass, area_id) {
        var area = hass.areas && hass.areas[area_id];
        var areaEntities = hass.entities && area &&
            Object.keys(hass.entities)
                .filter(function (e) {
                var _a;
                return !hass.entities[e].disabled_by &&
                    !hass.entities[e].hidden &&
                    hass.entities[e].entity_category !== "diagnostic" &&
                    hass.entities[e].entity_category !== "config" && (hass.entities[e].area_id === area.area_id ||
                    ((_a = hass.devices[hass.entities[e].device_id || ""]) === null || _a === void 0 ? void 0 : _a.area_id) === area.area_id);
            })
                .map(function (x) { return x; });
        return areaEntities;
    };
    MinimalisticAreaCard.getStubConfig = function (hass, entities, entitiesFallback) {
        var area = hass.areas && hass.areas[Object.keys(hass.areas)[0]];
        var areaEntities = MinimalisticAreaCard.findAreaEntities(hass, area.area_id);
        var lights = (0, find_entities_1.findEntities)(hass, 2, (areaEntities === null || areaEntities === void 0 ? void 0 : areaEntities.length) ? areaEntities : entities, entitiesFallback, ["light"]);
        var switches = (0, find_entities_1.findEntities)(hass, 2, (areaEntities === null || areaEntities === void 0 ? void 0 : areaEntities.length) ? areaEntities : entities, entitiesFallback, ["switch"]);
        var sensors = (0, find_entities_1.findEntities)(hass, 2, (areaEntities === null || areaEntities === void 0 ? void 0 : areaEntities.length) ? areaEntities : entities, entitiesFallback, ["sensor"]);
        var binary_sensors = (0, find_entities_1.findEntities)(hass, 2, (areaEntities === null || areaEntities === void 0 ? void 0 : areaEntities.length) ? areaEntities : entities, entitiesFallback, ["binary_sensor"]);
        var obj = {
            title: "Kitchen",
            image: "https://demo.home-assistant.io/stub_config/kitchen.png",
            area: "",
            hide_unavailable: false,
            tap_action: {
                action: "navigate",
                navigation_path: "/lovelace-kitchen"
            },
            entities: __spreadArray(__spreadArray(__spreadArray(__spreadArray([], lights, true), switches, true), sensors, true), binary_sensors, true),
        };
        if (area) {
            obj.area = area.area_id;
            obj.title = area.name;
            obj.tap_action.navigation_path = "/config/areas/area/" + area.area_id;
            delete obj.image;
        }
        else {
            delete obj.area;
        }
        return obj;
    };
    Object.defineProperty(MinimalisticAreaCard, "styles", {
        get: function () {
            return (0, lit_1.css)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n      * {\n        box-sizing: border-box;\n      }\n      ha-card {\n        position: relative;\n        min-height: 48px;\n        height: 100%;\n        z-index: 0;\n      }\n\n      img {\n          display: block;\n          height: 100%;\n          width: 100%;\n          \n          object-fit: cover;\n\n          position: absolute;\n          z-index: -1;\n          pointer-events: none;\n          border-radius: var(--ha-card-border-radius, 12px)\n      }\n\n      .darken {\n        filter: brightness(0.55);\n      }\n\n      div.camera {\n          height: 100%;\n          width: 100%;\n          overflow: hidden;\n         \n          position: absolute; \n          left: 0; top: 0; \n          \n          z-index: -1;\n          pointer-events: none;\n          border-radius: var(--ha-card-border-radius, 12px);\n      }\n\n      div.camera hui-image {\n          position: relative; \n          top: 50%;\n          transform: translateY(-50%);\n      }\n\n      .box {\n        text-shadow: 1px 1px 2px black;\n        background-color: transparent;\n\n        display: flex;\n        flex-flow: column nowrap;\n        justify-content: flex-start;\n\n        width: 100%; height: 100%;\n\n        padding: 0;\n        font-size: 14px;\n        color: var(--ha-picture-card-text-color, white);\n        z-index: 1;\n      }\n\n      .box .card-header {\n        padding: 10px 15px;\n        font-weight: bold;\n        font-size: 1.2em;\n      }\n\n      .box .sensors {\n          margin-top: -8px;\n          margin-bottom: -8px;\n          min-height: var(--minimalistic-area-card-sensors-min-height, 10px);\n          margin-left: 5px;\n          font-size: 0.9em;\n          line-height: 13px;\n      }\n\n      .box .buttons {\n          display: block;\n          background-color: var( --ha-picture-card-background-color, rgba(0, 0, 0, 0.1) );\n          background-color: transparent;\n          text-align: right;\n          padding-top: 10px;\n          padding-bottom: 10px;\n          min-height: 10px;\n          width: 100%;\n\n          margin-top:auto;\n      }\n\n      .box .buttons ha-icon-button {\n            margin-left: -8px;\n            margin-right: -6px;\n      }\n      .box .sensors ha-icon-button {\n            -moz-transform: scale(0.67);\n            zoom: 0.67;\n            vertical-align: middle;\n      }\n    \n      .box .wrapper {\n          display: inline-block;\n          vertical-align: middle;\n          margin-bottom: -8px;\n      }\n      .box ha-icon-button state-badge {\n          line-height: 0px;\n          color: var(--ha-picture-icon-button-color, #a9a9a9);\n      }\n      .box ha-icon-button state-badge.shadow {\n          filter: drop-shadow(2px 2px 2px gray);\n      }\n      .box ha-icon-button.state-on state-badge {\n          color: var(--ha-picture-icon-button-on-color, white);\n      }\n\n      .box .sensors .wrapper > * {\n          display: inline-block;\n          vertical-align: middle;\n      }\n      .box .sensors .state {\n          margin-left: -9px;\n      }\n\n      .box .wrapper hui-warning-element {\n          display: block;\n      }\n      .box .wrapper hui-warning-element.shadow {\n          filter: drop-shadow(2px 2px 2px gray);\n      }\n    "], ["\n      * {\n        box-sizing: border-box;\n      }\n      ha-card {\n        position: relative;\n        min-height: 48px;\n        height: 100%;\n        z-index: 0;\n      }\n\n      img {\n          display: block;\n          height: 100%;\n          width: 100%;\n          \n          object-fit: cover;\n\n          position: absolute;\n          z-index: -1;\n          pointer-events: none;\n          border-radius: var(--ha-card-border-radius, 12px)\n      }\n\n      .darken {\n        filter: brightness(0.55);\n      }\n\n      div.camera {\n          height: 100%;\n          width: 100%;\n          overflow: hidden;\n         \n          position: absolute; \n          left: 0; top: 0; \n          \n          z-index: -1;\n          pointer-events: none;\n          border-radius: var(--ha-card-border-radius, 12px);\n      }\n\n      div.camera hui-image {\n          position: relative; \n          top: 50%;\n          transform: translateY(-50%);\n      }\n\n      .box {\n        text-shadow: 1px 1px 2px black;\n        background-color: transparent;\n\n        display: flex;\n        flex-flow: column nowrap;\n        justify-content: flex-start;\n\n        width: 100%; height: 100%;\n\n        padding: 0;\n        font-size: 14px;\n        color: var(--ha-picture-card-text-color, white);\n        z-index: 1;\n      }\n\n      .box .card-header {\n        padding: 10px 15px;\n        font-weight: bold;\n        font-size: 1.2em;\n      }\n\n      .box .sensors {\n          margin-top: -8px;\n          margin-bottom: -8px;\n          min-height: var(--minimalistic-area-card-sensors-min-height, 10px);\n          margin-left: 5px;\n          font-size: 0.9em;\n          line-height: 13px;\n      }\n\n      .box .buttons {\n          display: block;\n          background-color: var( --ha-picture-card-background-color, rgba(0, 0, 0, 0.1) );\n          background-color: transparent;\n          text-align: right;\n          padding-top: 10px;\n          padding-bottom: 10px;\n          min-height: 10px;\n          width: 100%;\n\n          margin-top:auto;\n      }\n\n      .box .buttons ha-icon-button {\n            margin-left: -8px;\n            margin-right: -6px;\n      }\n      .box .sensors ha-icon-button {\n            -moz-transform: scale(0.67);\n            zoom: 0.67;\n            vertical-align: middle;\n      }\n    \n      .box .wrapper {\n          display: inline-block;\n          vertical-align: middle;\n          margin-bottom: -8px;\n      }\n      .box ha-icon-button state-badge {\n          line-height: 0px;\n          color: var(--ha-picture-icon-button-color, #a9a9a9);\n      }\n      .box ha-icon-button state-badge.shadow {\n          filter: drop-shadow(2px 2px 2px gray);\n      }\n      .box ha-icon-button.state-on state-badge {\n          color: var(--ha-picture-icon-button-on-color, white);\n      }\n\n      .box .sensors .wrapper > * {\n          display: inline-block;\n          vertical-align: middle;\n      }\n      .box .sensors .state {\n          margin-left: -9px;\n      }\n\n      .box .wrapper hui-warning-element {\n          display: block;\n      }\n      .box .wrapper hui-warning-element.shadow {\n          filter: drop-shadow(2px 2px 2px gray);\n      }\n    "])));
        },
        enumerable: false,
        configurable: true
    });
    MinimalisticAreaCard.properties = {
        hass: { attribute: false },
        config: { state: true }
    };
    return MinimalisticAreaCard;
}(lit_1.LitElement));
customElements.define(types_1.cardType, MinimalisticAreaCard);
var theWindow = window;
theWindow.customCards = theWindow.customCards || [];
theWindow.customCards.push({
    type: types_1.cardType,
    name: "Minimalistic Area",
    preview: true, // Optional - defaults to false
    description: "Minimalistic Area Card" // Optional
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
