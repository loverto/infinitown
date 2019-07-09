var parent = require("Set");
var shaders = require("module/shaders");
/**
 * @param {!Function} obj
 * @return {undefined}
 */
var Class = function(obj) {
    /** @type {!Object} */
    obj = Object.assign({
        vertexShader : shaders["basic.vs"],
        fragmentShader : shaders["basic.fs"],
        uniforms : {
            diffuse : {
                value : new THREE.Color(16711935)
            },
            map : {
                value : null
            },
            offsetRepeat : {
                value : new THREE.Vector4(0, 0, 1, 1)
            },
            opacity : {
                value : 1
            }
        }
    }, obj);
    parent.call(this, obj);
    Object.keys(this.uniforms).forEach(function(name) {
        this.onPropertyChange(name, function(initSBC) {
            /** @type {!Object} */
            this.uniforms[name].value = initSBC;
        });
    }, this);
};
Class.inherit(parent, {
    clone : function(params) {
        var data = params || new Class;
        return parent.prototype.clone.call(this, data), data.name = this.name, data.transparent = this.transparent, _.each(this.uniforms, function(dom, name) {
            var value = dom.type;
            if ("v2" === value || "m4" === value) {
                data.uniforms[name].value.copy(dom.value);
            } else {
                data.uniforms[name].value = dom.value;
            }
        }, this), data;
    }
});
/** @type {function(!Function): undefined} */
globalContext.exports = Class;
var town54=function(require, globalContext, n) {
        var parent = require("21");
        var shaders = require("module/shaders");
        /**
         * @param {!Function} obj
         * @return {undefined}
         */
        var Class = function(obj) {
            /** @type {!Object} */
            obj = Object.assign({
                vertexShader : shaders["basic.vs"],
                fragmentShader : shaders["basic.fs"],
                uniforms : {
                    diffuse : {
                        value : new THREE.Color(16711935)
                    },
                    map : {
                        value : null
                    },
                    offsetRepeat : {
                        value : new THREE.Vector4(0, 0, 1, 1)
                    },
                    opacity : {
                        value : 1
                    }
                }
            }, obj);
            parent.call(this, obj);
            Object.keys(this.uniforms).forEach(function(name) {
                this.onPropertyChange(name, function(initSBC) {
                    /** @type {!Object} */
                    this.uniforms[name].value = initSBC;
                });
            }, this);
        };
        Class.inherit(parent, {
            clone : function(params) {
                var data = params || new Class;
                return parent.prototype.clone.call(this, data), data.name = this.name, data.transparent = this.transparent, _.each(this.uniforms, function(dom, name) {
                    var value = dom.type;
                    if ("v2" === value || "m4" === value) {
                        data.uniforms[name].value.copy(dom.value);
                    } else {
                        data.uniforms[name].value = dom.value;
                    }
                }, this), data;
            }
        });
        /** @type {function(!Function): undefined} */
        globalContext.exports = Class;
    }
