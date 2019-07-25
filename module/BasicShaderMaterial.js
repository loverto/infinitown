import ShaderMaterialExtern from 'module/ShaderMaterialExtern';
import shaders from 'module/shaders';

/**
 * 基本着色器材质
 * @param obj
 * @constructor
 */
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
    /**
     * 克隆
     * @param params
     * @returns {*|BasicShaderMaterial}
     */
    clone : function(params) {
        var data = params || new BasicShaderMaterial;
        ShaderMaterialExtern.prototype.clone.call(this, data)
        // 设置名字哦
        data.name = this.name
        // 设置透明度
        data.transparent = this.transparent
        _.each(this.uniforms, function(value, key) {
            var type = value.type;
            if ('v2' === type || 'm4' === type) {
                data.uniforms[key].value.copy(value.value);
            } else {
                data.uniforms[key].value = value.value;
            }
        }, this)
        return data;
    }
});
export {BasicShaderMaterial};
