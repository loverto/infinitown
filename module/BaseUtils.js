import '@tweenjs/tween.js';
window._ = require('lodash');
/**
 * 线性插值
 * @param minIn
 * @param maxIn
 * @returns {number}
 */
Number.prototype.lerp = function(minIn, maxIn) {
    return this + (minIn - this) * maxIn;
};
// 给String 扩展endsWith方法
if (!String.prototype.endsWith) {

    String.prototype.endsWith = function(value, offset) {
        var buffer = this.toString();
        if ('number' != typeof offset || !isFinite(offset) || Math.floor(offset) !== offset || offset > buffer.length) {
            offset = buffer.length;
        }
        offset = offset - value.length;
        var count = buffer.indexOf(value, offset);
        return count !== -1 && count === offset;
    };
}

/**
 * 给函数扩展继承办法
 * @param target
 * @param obj
 */
Function.prototype.inherit = function(target, obj) {
    if (!target || !_.isFunction(target)) {
        throw 'parent argument must be a function';
    }
    this.prototype = _.extend(Object.create(target.prototype), obj);
};

/**
 * 混入
 * @param name
 */
Function.prototype.mixin = function(name) {
    _.each(name, function(fn, methodName) {
        if (undefined === this.prototype[methodName]) {
            self.prototype[methodName] = fn;
        }
    },this);
};
window.WIDTH = window.innerWidth;
window.HEIGHT = window.innerHeight;
window.mouseX = 0;
window.mouseY = 0;
window.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
window.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
