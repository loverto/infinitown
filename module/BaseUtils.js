require("module/TWEEN");
window._ = require("module/lodash");
/**
 * @param {number} minIn
 * @param {number} maxIn
 * @return {?}
 * @this {!Number}
 */
Number.prototype.lerp = function(minIn, maxIn) {
    return this + (minIn - this) * maxIn;
};
// 给String 扩展endsWith方法
if (!String.prototype.endsWith) {
    /**
     * @param {string} value
     * @param {number=} offset
     * @return {boolean}
     * @this {!String}
     */
    String.prototype.endsWith = function(value, offset) {
        /** @type {string} */
        var buffer = this.toString();
        if ("number" != typeof offset || !isFinite(offset) || Math.floor(offset) !== offset || offset > buffer.length) {
            /** @type {number} */
            offset = buffer.length;
        }
        /** @type {number} */
        offset = offset - value.length;
        /** @type {number} */
        var count = buffer.indexOf(value, offset);
        return count !== -1 && count === offset;
    };
}
/**
 * @param {!Function} target
 * @param {?} obj
 * @return {undefined}
 */
Function.prototype.inherit = function(target, obj) {
    if (!target || !_.isFunction(target)) {
        throw "parent argument must be a function";
    }
    this.prototype = _.extend(Object.create(target.prototype), obj);
};
/**
 * @param {!Function} name
 * @return {undefined}
 */
Function.prototype.mixin = function(name) {
    _.each(name, function(fn, methodName) {
        if (void 0 === this.prototype[methodName]) {
            /** @type {!Function} */
            this.prototype[methodName] = fn;
        }
    }, this);
};
/** @type {number} */
window.WIDTH = window.innerWidth;
/** @type {number} */
window.HEIGHT = window.innerHeight;
/** @type {number} */
window.mouseX = 0;
/** @type {number} */
window.mouseY = 0;
/** @type {boolean} */
window.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
/** @type {boolean} */
window.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

var town18=function(require, canCreateDiscussions, n) {
        require("19");
        window._ = require("module/lodash");
        /**
         * @param {number} minIn
         * @param {number} maxIn
         * @return {?}
         * @this {!Number}
         */
        Number.prototype.lerp = function(minIn, maxIn) {
            return this + (minIn - this) * maxIn;
        };
        if (!String.prototype.endsWith) {
            /**
             * @param {string} value
             * @param {number=} offset
             * @return {boolean}
             * @this {!String}
             */
            String.prototype.endsWith = function(value, offset) {
                /** @type {string} */
                var buffer = this.toString();
                if ("number" != typeof offset || !isFinite(offset) || Math.floor(offset) !== offset || offset > buffer.length) {
                    /** @type {number} */
                    offset = buffer.length;
                }
                /** @type {number} */
                offset = offset - value.length;
                /** @type {number} */
                var count = buffer.indexOf(value, offset);
                return count !== -1 && count === offset;
            };
        }
        /**
         * @param {!Function} target
         * @param {?} obj
         * @return {undefined}
         */
        Function.prototype.inherit = function(target, obj) {
            if (!target || !_.isFunction(target)) {
                throw "parent argument must be a function";
            }
            this.prototype = _.extend(Object.create(target.prototype), obj);
        };
        /**
         * @param {!Function} name
         * @return {undefined}
         */
        Function.prototype.mixin = function(name) {
            _.each(name, function(fn, methodName) {
                if (void 0 === this.prototype[methodName]) {
                    /** @type {!Function} */
                    this.prototype[methodName] = fn;
                }
            }, this);
        };
        /** @type {number} */
        window.WIDTH = window.innerWidth;
        /** @type {number} */
        window.HEIGHT = window.innerHeight;
        /** @type {number} */
        window.mouseX = 0;
        /** @type {number} */
        window.mouseY = 0;
        /** @type {boolean} */
        window.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        /** @type {boolean} */
        window.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
