/** @type {!Array} */
var keys = ["side", "alphaTest", "transparent", "depthWrite", "shading", "wireframe"];
/**
 * @param {!Array} obj
 * @return {undefined}
 */
var Link = function(obj) {
    obj = obj || {};
    THREE.RawShaderMaterial.call(this, obj);
    _.each(keys, function(property) {
        var method = obj[property];
        if (void 0 !== method) {
            this[property] = method;
        }
    }, this);
};
Link.inherit(THREE.RawShaderMaterial, {
    onPropertyChange : function(e, prop) {
        Object.defineProperty(this, e, {
            get : function() {
                return this["_" + e];
            },
            set : function(result) {
                /** @type {number} */
                this["_" + e] = result;
                prop.call(this, result);
            }
        });
    },
    clone : function(dataAndEvents) {
        var material = dataAndEvents || new Material;
        return THREE.RawShaderMaterial.prototype.clone.call(this, material), material.shading = this.shading, material.wireframe = this.wireframe, material.wireframeLinewidth = this.wireframeLinewidth, material.fog = this.fog, material.lights = this.lights, material.vertexColors = this.vertexColors, material.skinning = this.skinning, material.morphTargets = this.morphTargets, material.morphNormals = this.morphNormals, material;
    }
});
/** @type {function(!Array): undefined} */
module.exports = Link;
var town23=function(require, module, n) {
        /** @type {!Array} */
        var keys = ["side", "alphaTest", "transparent", "depthWrite", "shading", "wireframe"];
        /**
         * @param {!Array} obj
         * @return {undefined}
         */
        var Link = function(obj) {
            obj = obj || {};
            THREE.RawShaderMaterial.call(this, obj);
            _.each(keys, function(property) {
                var method = obj[property];
                if (void 0 !== method) {
                    this[property] = method;
                }
            }, this);
        };
        Link.inherit(THREE.RawShaderMaterial, {
            onPropertyChange : function(e, prop) {
                Object.defineProperty(this, e, {
                    get : function() {
                        return this["_" + e];
                    },
                    set : function(result) {
                        /** @type {number} */
                        this["_" + e] = result;
                        prop.call(this, result);
                    }
                });
            },
            clone : function(dataAndEvents) {
                var material = dataAndEvents || new Material;
                return THREE.RawShaderMaterial.prototype.clone.call(this, material), material.shading = this.shading, material.wireframe = this.wireframe, material.wireframeLinewidth = this.wireframeLinewidth, material.fog = this.fog, material.lights = this.lights, material.vertexColors = this.vertexColors, material.skinning = this.skinning, material.morphTargets = this.morphTargets, material.morphNormals = this.morphNormals, material;
            }
        });
        /** @type {function(!Array): undefined} */
        module.exports = Link;
    }
