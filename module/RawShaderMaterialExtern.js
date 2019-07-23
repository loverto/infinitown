import * as THREE  from 'three';

var keys = ['side', 'alphaTest', 'transparent', 'depthWrite', 'shading', 'wireframe'];
/**
 * 原始着色器扩展
 * @param obj
 * @constructor
 */
var RawShaderMaterialExtern = function(obj) {
    obj = obj || {};
    THREE.RawShaderMaterial.call(this, obj);
    _.each(keys, function(property) {
        var method = obj[property];
        if (undefined !== method) {
            this[property] = method;
        }
    }, this);
};
RawShaderMaterialExtern.inherit(THREE.RawShaderMaterial, {
    /**
     * 属性改变
     * @param e
     * @param prop
     */
    onPropertyChange : function(e, prop) {
        Object.defineProperty(this, e, {
            get : function() {
                return this['_' + e];
            },
            set : function(result) {
                this['_' + e] = result;
                prop.call(this, result);
            }
        });
    },
    /**
     * 克隆
     * @param materialTmp
     * @returns {*|Material}
     */
    clone : function(materialTmp) {
        var material = materialTmp || new Material;
        THREE.RawShaderMaterial.prototype.clone.call(this, material)
        // 设置阴影
        material.shading = this.shading
        // 设置线框
        material.wireframe = this.wireframe
        // 设置线框宽度
        material.wireframeLinewidth = this.wireframeLinewidth
        // 牙
        material.fog = this.fog
        // 灯光
        material.lights = this.lights
        // 顶点颜色
        material.vertexColors = this.vertexColors
        // 皮肤
        material.skinning = this.skinning
        // 变形目标
        material.morphTargets = this.morphTargets
        // 变形法线
        material.morphNormals = this.morphNormals
        return material;
    }
});

export default RawShaderMaterialExtern;

