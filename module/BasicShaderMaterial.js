import parent from 'module/ShaderMaterialExtern';
import shaders from 'module/shaders';
/**
 * @param {!Function} obj
 * @return {undefined}
 */
var BasicShaderMaterial = function(obj) {
    /** @type {!Object} */
    obj = Object.assign({
        vertexShader : shaders['basic.vs'],
        fragmentShader : shaders['basic.fs'],
        uniforms : {
            diffuse : {
                value : new THREE.Color(0xff00ff)
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
    var self = this;
    Object.keys(this.uniforms).forEach(function(name) {
        self.onPropertyChange(name, function(initSBC) {
            /** @type {!Object} */
            self.uniforms[name].value = initSBC;
        });
    }, this);
};
BasicShaderMaterial.inherit(parent, {
    clone : function(params) {
        var data = params || new BasicShaderMaterial;
        return parent.prototype.clone.call(this, data), data.name = this.name, data.transparent = this.transparent, _.each(this.uniforms, function(dom, name) {
            var value = dom.type;
            if ('v2' === value || 'm4' === value) {
                data.uniforms[name].value.copy(dom.value);
            } else {
                data.uniforms[name].value = dom.value;
            }
        }, this), data;
    }
});
/** @type {function(!Function): undefined} */
export {BasicShaderMaterial};
