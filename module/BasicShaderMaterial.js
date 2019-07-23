import ShaderMaterialExtern from 'module/ShaderMaterialExtern';
import shaders from 'module/shaders';

var BasicShaderMaterial = function(obj) {
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
    ShaderMaterialExtern.call(this, obj);
    Object.keys(this.uniforms).forEach(function(name) {
        this.onPropertyChange(name, function(initSBC) {
            this.uniforms[name].value = initSBC;
        });
    }, this);
};
BasicShaderMaterial.inherit(ShaderMaterialExtern, {
    clone : function(params) {
        var data = params || new BasicShaderMaterial;
        ShaderMaterialExtern.prototype.clone.call(this, data)
        data.name = this.name
        data.transparent = this.transparent
        _.each(this.uniforms, function(dom, name) {
            var value = dom.type;
            if ('v2' === value || 'm4' === value) {
                data.uniforms[name].value.copy(dom.value);
            } else {
                data.uniforms[name].value = dom.value;
            }
        }, this)
        return data;
    }
});
export {BasicShaderMaterial};
