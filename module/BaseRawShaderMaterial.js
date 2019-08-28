import {RawShaderMaterial} from "three";
import {Material} from "three";

const keys = ['side', 'alphaTest', 'transparent', 'depthWrite', 'shading', 'wireframe'];

class BaseRawShaderMaterial extends RawShaderMaterial{
    /**
     * 原始着色器扩展
     * @param obj
     * @constructor
     */
    constructor(obj) {
        obj = obj || {};
        super(obj);
        const self = this;
        _.each(keys, function(property) {
            const method = obj[property];
            if (undefined !== method) {
                self[property] = method;
            }
        });
    }

    /**
     * 属性改变
     * @param e
     * @param prop
     */
    onPropertyChange(e, prop) {
        Object.defineProperty(this, e, {
            get : function() {
                return this['_' + e];
            },
            set : function(result) {
                this['_' + e] = result;
                prop.call(this, result);
            }
        });
    }

    /**
     * 克隆
     * @param materialTmp
     * @returns {*|Material}
     */
    clone(materialTmp) {
        const material = materialTmp || new Material();
        super.clone(material)
        // 设置阴影
        material.shading = this.shading
        // 设置线框
        material.wireframe = this.wireframe
        // 设置线框宽度
        material.wireframeLinewidth = this.wireframeLinewidth
        // 雾
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
}

export default BaseRawShaderMaterial;

