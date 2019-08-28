import * as THREE  from 'three';
import BaseShaderMaterial from 'module/BaseShaderMaterial';
import LoaderUtils from 'module/LoaderUtils';
var a = {
    normalMapFactor : 'uNormalMapFactor',
    normalMap : 'sTextureNormalMap',
    matcapMap : 'sTextureAOMap'
};

function optionalParameter(value, defaultValue) {
    return undefined !== value ? value : defaultValue;
}

class MatcapMaterial extends BaseShaderMaterial{
    constructor(data) {
        data = Object.assign({
            vertexShader : data.vertexShader,
            fragmentShader : data.fragmentShader,
            uniforms : {
                uNormalMapFactor : {
                    type : 'f',
                    value : 1
                },
                sTextureMatcapMap : {
                    type : 't',
                    value : null
                },
                sTextureNormalMap : {
                    type : 't',
                    value : null
                },
                uFlipY : {
                    type : 'i',
                    value : 0
                },
                uOutputLinear : {
                    type : 'i',
                    value : 0
                }
            }
        }, data);
        super(data);
        Object.keys(this.uniforms).forEach(function(name) {
            this.onPropertyChange(name, function(initSBC) {
                this.uniforms[name].value = initSBC;
            });
        }, this);
        var self = this
        _.each(a, function(javascriptName, prop) {
            self.onPropertyChange(prop, function(jsonName) {
                self[javascriptName] = jsonName;
            });
        });
        this.extensions = {
            derivatives : true
        };
    }

    clone(params) {
        var data = params || new MatcapMaterial;
        super.clone(data)
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
    static create(material) {
        var source = new MatcapMaterial;
        source.uuid = material.uuid;
        source.name = material.name;
        source.transparent = optionalParameter(material.transparent, false);
        source.polygonOffset = optionalParameter(material.polygonOffset, false);
        source.polygonOffsetUnits = optionalParameter(material.polygonOffsetUnits, 0);
        source.polygonOffsetFactor = optionalParameter(material.polygonOffsetFactor, 0);
        LoaderUtils.getTexture('white.png')
        var pm = material.normalMap;
        var color = material.matcapMap;
        source.uNormalMapFactor = optionalParameter(material.normalMapFactor, 1)
        source.uFlipY = optionalParameter(material.flipNormals, 0)
        source.side = optionalParameter(material.side, THREE.FrontSide)
        pm.needsUpdate = true
        color.needsUpdate = true
        source.sTextureNormalMap = pm
        source.sTextureMatcapMap = color
        return source;
    }
}

export default MatcapMaterial;

