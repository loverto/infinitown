import {ShaderMaterial} from "three";

const keys = ['side', 'alphaTest', 'transparent', 'depthWrite', 'shading', 'wireframe'];

class BaseShaderMaterial extends ShaderMaterial{
    /**
     * 着色器材料扩展
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

    clone(to) {
        const material = to || new BaseShaderMaterial;
        super.clone(material)
        material.shading = this.shading
        material.wireframe = this.wireframe
        material.wireframeLinewidth = this.wireframeLinewidth
        material.fog = this.fog
        material.lights = this.lights
        material.vertexColors = this.vertexColors
        material.skinning = this.skinning
        material.morphTargets = this.morphTargets
        material.morphNormals = this.morphNormals
        return material;
    }
}

export default BaseShaderMaterial;
