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
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionHandler = exports.actionHandlerBind = void 0;
var lit_1 = require("lit");
var directive_1 = require("lit/directive");
var custom_card_helpers_1 = require("custom-card-helpers");
var types_1 = require("./types");
var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.maxTouchPoints > 0;
var ActionHandler = /** @class */ (function (_super) {
    __extends(ActionHandler, _super);
    function ActionHandler() {
        var _this = _super.call(this) || this;
        _this.holdTime = 500;
        _this.held = false;
        _this.ripple = document.createElement('mwc-ripple');
        return _this;
    }
    ActionHandler.prototype.connectedCallback = function () {
        var _this = this;
        Object.assign(this.style, {
            position: 'absolute',
            width: isTouch ? '100px' : '50px',
            height: isTouch ? '100px' : '50px',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: '999',
        });
        this.appendChild(this.ripple);
        this.ripple.primary = true;
        ['touchcancel', 'mouseout', 'mouseup', 'touchmove', 'mousewheel', 'wheel', 'scroll'].forEach(function (ev) {
            document.addEventListener(ev, function () {
                clearTimeout(_this.timer);
                _this.stopAnimation();
                _this.timer = undefined;
            }, { passive: true });
        });
    };
    ActionHandler.prototype.bind = function (element, options) {
        var _this = this;
        if (element.actionHandler) {
            return;
        }
        element.actionHandler = true;
        element.addEventListener('contextmenu', function (ev) {
            var e = ev || window.event;
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            e.cancelBubble = true;
            e.returnValue = false;
            return false;
        });
        var start = function (ev) {
            _this.held = false;
            var x;
            var y;
            if (ev.touches) {
                x = ev.touches[0].pageX;
                y = ev.touches[0].pageY;
            }
            else {
                x = ev.pageX;
                y = ev.pageY;
            }
            _this.timer = window.setTimeout(function () {
                _this.startAnimation(x, y);
                _this.held = true;
            }, _this.holdTime);
        };
        var end = function (ev) {
            // Prevent mouse event if touch event
            ev.preventDefault();
            ev.stopPropagation();
            if (['touchend', 'touchcancel'].includes(ev.type) && _this.timer === undefined) {
                return;
            }
            clearTimeout(_this.timer);
            _this.stopAnimation();
            _this.timer = undefined;
            if (_this.held) {
                (0, custom_card_helpers_1.fireEvent)(element, 'action', { action: 'hold' }, { bubbles: false });
            }
            else if (options.hasDoubleClick) {
                if ((ev.type === 'click' && ev.detail < 2) || !_this.dblClickTimeout) {
                    _this.dblClickTimeout = window.setTimeout(function () {
                        _this.dblClickTimeout = undefined;
                        (0, custom_card_helpers_1.fireEvent)(element, 'action', { action: 'tap' }, { bubbles: false });
                    }, 250);
                }
                else {
                    clearTimeout(_this.dblClickTimeout);
                    _this.dblClickTimeout = undefined;
                    (0, custom_card_helpers_1.fireEvent)(element, 'action', { action: 'double_tap' }, { bubbles: false });
                }
            }
            else {
                (0, custom_card_helpers_1.fireEvent)(element, 'action', { action: 'tap' }, { bubbles: false });
            }
        };
        var handleEnter = function (ev) {
            if (ev.keyCode !== 13) {
                return;
            }
            end(ev);
        };
        element.addEventListener('touchstart', start, { passive: true });
        element.addEventListener('touchend', end);
        element.addEventListener('touchcancel', end);
        element.addEventListener('mousedown', start, { passive: true });
        element.addEventListener('click', end);
        element.addEventListener('keyup', handleEnter);
    };
    ActionHandler.prototype.startAnimation = function (x, y) {
        Object.assign(this.style, {
            left: "".concat(x, "px"),
            top: "".concat(y, "px"),
            display: null,
        });
        this.ripple.disabled = false;
        this.ripple.active = true;
        this.ripple.unbounded = true;
    };
    ActionHandler.prototype.stopAnimation = function () {
        this.ripple.active = false;
        this.ripple.disabled = true;
        this.style.display = 'none';
    };
    return ActionHandler;
}(HTMLElement));
customElements.define('action-handler-' + types_1.cardType, ActionHandler);
var getActionHandler = function () {
    var body = document.body;
    if (body.querySelector('action-handler-' + types_1.cardType)) {
        return body.querySelector('action-handler-' + types_1.cardType);
    }
    var actionhandler = document.createElement('action-handler-' + types_1.cardType);
    body.appendChild(actionhandler);
    return actionhandler;
};
var actionHandlerBind = function (element, options) {
    var actionhandler = getActionHandler();
    if (!actionhandler) {
        return;
    }
    actionhandler.bind(element, options);
};
exports.actionHandlerBind = actionHandlerBind;
exports.actionHandler = (0, directive_1.directive)(/** @class */ (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    class_1.prototype.update = function (part, _a) {
        var options = _a[0];
        (0, exports.actionHandlerBind)(part.element, options);
        return lit_1.noChange;
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    class_1.prototype.render = function (_options) { };
    return class_1;
}(directive_1.Directive)));
