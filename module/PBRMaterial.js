import * as THREE  from 'three';
import RawShaderMaterialExtern from 'module/RawShaderMaterialExtern';
import component from 'module/LoaderUtils';
import DataTextureUtils from 'module/dataTextureUtils';
/**
 * @param {?} value
 * @param {string} defaultValue
 * @return {?}
 */
function optionalParameter(value, defaultValue) {
    return void 0 !== value ? value : defaultValue;
}

var options = {
    aoFactor : 'uAOPBRFactor',
    albedoFactor : 'uAlbedoPBRFactor',
    glossFactor : 'uGlossinessPBRFactor',
    metalFactor : 'uMetalnessPBRFactor',
    opacity : 'uOpacityFactor',
    normalMapFactor : 'uNormalMapFactor',
    f0Factor : 'uSpecularF0Factor',
    albedoMap : 'sTextureAlbedoMap',
    normalMap : 'sTextureNormalMap',
    normalMap2 : 'sTextureNormalMap2',
    aoMap : 'sTextureAOMap',
    aoMap2 : 'sTextureAOMap2',
    metalGlossMap : 'sTexturePBRMaps',
    emissiveMap : 'sTextureEmissiveMap',
    lightMap : 'sTextureLightMap',
    lightMapDir : 'sTextureLightMapDir',
    cubemap : 'sSpecularPBR',
    panorama : 'sPanoramaPBR',
    sph : 'uDiffuseSPH',
    exposure : 'uEnvironmentExposure',
    transform : 'uEnvironmentTransform',
    occludeSpecular : 'uOccludeSpecular',
    alphaTest : 'uAlphaTest',
    color : 'uColor',
    contrast : 'uContrast'
};
/**
 * @param {!Function} obj
 * @return {undefined}
 */
var PBRMaterial = function(obj) {
    var self = this;
    /** @type {!Object} */
    obj = Object.assign({
        uniforms : {
            uAOPBRFactor : {
                type : 'f',
                value : 1
            },
            uAlbedoPBRFactor : {
                type : 'f',
                value : 1
            },
            uGlossinessPBRFactor : {
                type : 'f',
                value : 1
            },
            uMetalnessPBRFactor : {
                type : 'f',
                value : 1
            },
            uNormalMapFactor : {
                type : 'f',
                value : 1
            },
            uSpecularF0Factor : {
                type : 'f',
                value : 1
            },
            uEnvironmentExposure : {
                type : 'f',
                value : 1
            },
            uOpacityFactor : {
                type : 'f',
                value : 1
            },
            sTextureAlbedoMap : {
                type : 't',
                value : null
            },
            sTextureAlbedoMap2 : {
                type : 't',
                value : null
            },
            sTextureNormalMap : {
                type : 't',
                value : null
            },
            sTextureNormalMap2 : {
                type : 't',
                value : null
            },
            sTextureAOMap : {
                type : 't',
                value : null
            },
            sTextureAOMap2 : {
                type : 't',
                value : null
            },
            sTexturePBRMaps : {
                type : 't',
                value : null
            },
            sTextureEmissiveMap : {
                type : 't',
                value : null
            },
            sTextureLightMap : {
                type : 't',
                value : null
            },
            sTextureLightMapDir : {
                type : 't',
                value : null
            },
            sSpecularPBR : {
                type : 't',
                value : null
            },
            sPanoramaPBR : {
                type : 't',
                value : null
            },
            uTextureEnvironmentSpecularPBRLodRange : {
                type : 'v2',
                value : new THREE.Vector2(10, 5)
            },
            uTextureEnvironmentSpecularPBRTextureSize : {
                type : 'v2',
                value : new THREE.Vector2
            },
            uDiffuseSPH : {
                type : '3fv',
                value : null
            },
            uFlipY : {
                type : 'i',
                value : 0
            },
            uOccludeSpecular : {
                type : 'i',
                value : 0
            },
            uOutputLinear : {
                type : 'i',
                value : 0
            },
            uEnvironmentTransform : {
                type : 'm4',
                value : new THREE.Matrix4
            },
            uMode : {
                type : 'i',
                value : 0
            },
            uColor : {
                type : 'c',
                value : null
            },
            uAlphaTest : {
                type : 'f',
                value : 0
            },
            uContrast : {
                type : 'f',
                value : 1.1
            },
            offsetRepeat : {
                type : 'v4',
                value : new THREE.Vector4(0, 0, 1, 1)
            },
            offsetRepeatDetail : {
                type : 'v4',
                value : new THREE.Vector4(0, 0, 1, 1)
            },
            viewLightDir : {
                type : 'v3',
                value : new THREE.Vector3
            },
            specularHighlights : {
                type : 'i',
                value : 1
            },
            ambientLightColor : {
                value : []
            },
            lightProbe : {
                value : []
            },
            directionalLights : {
                value : [],
                properties : {
                    direction : {},
                    color : {},
                    shadow : {},
                    shadowBias : {},
                    shadowRadius : {},
                    shadowMapSize : {}
                }
            },
            directionalShadowMap : {
                value : []
            },
            directionalShadowMatrix : {
                value : []
            },
            spotLights : {
                value : [],
                properties : {
                    color : {},
                    position : {},
                    direction : {},
                    distance : {},
                    coneCos : {},
                    penumbraCos : {},
                    decay : {},
                    shadow : {},
                    shadowBias : {},
                    shadowRadius : {},
                    shadowMapSize : {}
                }
            },
            spotShadowMap : {
                value : []
            },
            spotShadowMatrix : {
                value : []
            },
            pointLights : {
                value : [],
                properties : {
                    color : {},
                    position : {},
                    decay : {},
                    distance : {},
                    shadow : {},
                    shadowBias : {},
                    shadowRadius : {},
                    shadowMapSize : {},
                    shadowCameraNear : {},
                    shadowCameraFar : {}
                }
            },
            pointShadowMap : {
                value : []
            },
            pointShadowMatrix : {
                value : []
            },
            hemisphereLights : {
                value : [],
                properties : {
                    direction : {},
                    skyColor : {},
                    groundColor : {}
                }
            },
            rectAreaLights : {
                value : [],
                properties : {
                    color : {},
                    position : {},
                    width : {},
                    height : {}
                }
            },
            fogNear : {
                type : 'f',
                value : 225
            },
            fogFar : {
                type : 'f',
                value : 325
            },
            fogColor : {
                type : 'c',
                value : new THREE.Color(0xa2e8ff)
            }
        }
    }, obj);
    RawShaderMaterialExtern.call(this, obj);
    Object.keys(this.uniforms).forEach(function(name) {
        self.onPropertyChange(name, function(initSBC) {
            console.log("PBRMaterial construct",name,initSBC)

            /** @type {!Object} */
            self.uniforms[name].value = initSBC;
        });
    }, this);
    _.each(options, function(javascriptName, prop) {
        self.onPropertyChange(prop, function(jsonName) {
            self[javascriptName] = jsonName;
        });
    }, this);
    this.extensions = {
        derivatives : true,
        shaderTextureLOD : null !== THREE.Extensions.get('EXT_shader_texture_lod')
    };
    /** @type {boolean} */
    this.pbr = true;
    /** @type {boolean} */
    this.lights = true;
};
PBRMaterial.inherit(RawShaderMaterialExtern, {
    _clone : function(options) {
        var data = options || new PBRMaterial;
        return RawShaderMaterialExtern.prototype.clone.call(this, data), data.name = this.name, data.transparent = this.transparent, _.each(this.uniforms, function(dom, name) {
            var value = dom.type;
            if ('v2' === value || 'm4' === value) {
                data.uniforms[name].value.copy(dom.value);
            } else {
                data.uniforms[name].value = dom.value;
            }
        }, this), data;
    },
    clone : function() {
        var rvm3 = PBRMaterial.create(this.createOptions);
        return rvm3.uuid = THREE.Math.generateUUID(), rvm3;
    },
    updateEnvironmentTransform : function() {
        var q = new THREE.Quaternion;
        var matrix = new THREE.Matrix4;
        return function(uri2, options) {
            uri2.getWorldQuaternion(q).inverse();
            matrix.makeRotationY(options || 0);
            this.uniforms.uEnvironmentTransform.value.makeRotationFromQuaternion(q).multiply(matrix);
        };
    }(),
    refreshOffsetRepeat : function() {
        var uvScaleMap;
        if (this.defines.USE_ALBEDOMAP ? uvScaleMap = this.sTextureAlbedoMap : this.defines.USE_NORMALMAP ? uvScaleMap = this.sTextureNormalMap : this.defines.USE_AOMAP && (uvScaleMap = this.sTextureAOMap), void 0 !== uvScaleMap) {
            var offset = uvScaleMap.offset;
            var repeat = uvScaleMap.repeat;
            this.uniforms.offsetRepeat.value.set(offset.x, offset.y, repeat.x, repeat.y);
        }
    },
    refreshOffsetRepeatDetail : function() {
        var uvScaleMap = this.sTextureNormalMap2;
        if (void 0 !== uvScaleMap) {
            var offset = uvScaleMap.offset;
            var repeat = uvScaleMap.repeat;
            this.uniforms.offsetRepeatDetail.value.set(offset.x, offset.y, repeat.x, repeat.y);
        }
    },
    refreshUniforms : function(mmCoreSplitViewBlock, $state) {
        this.updateEnvironmentTransform(mmCoreSplitViewBlock, $state);
    }
});
/**
 * @param {!Object} material
 * @return {?}
 */
PBRMaterial.create = function(material) {
    var pbrMaterial = new PBRMaterial({
        vertexShader : material.vertexShader,
        fragmentShader : material.fragmentShader
    });
    /** @type {!Object} */
    pbrMaterial.createOptions = material;
    pbrMaterial.uuid = material.uuid;
    pbrMaterial.name = material.name;
    pbrMaterial.transparent = optionalParameter(material.transparent, false);
    pbrMaterial.polygonOffset = optionalParameter(material.polygonOffset, false);
    pbrMaterial.polygonOffsetUnits = optionalParameter(material.polygonOffsetUnits, 0);
    pbrMaterial.polygonOffsetFactor = optionalParameter(material.polygonOffsetFactor, 0);
    var whiteTexture = DataTextureUtils.CreateWhiteTexture();
    var normalTexture = DataTextureUtils.CreateNormalTexture();
    var options = material.albedoMap || whiteTexture;
    var directLoginReference = material.albedoMap2 || whiteTexture;
    var flag = material.normalMap || normalTexture;
    var cloudDistance = material.normalMap2 || normalTexture;
    var hyperParameters = material.aoMap || whiteTexture;
    var picture_right_map = material.aoMap2 || whiteTexture;
    var picture_below_map = material.metalGlossMap || whiteTexture;
    var topTexture = material.emissiveMap || whiteTexture;
    var defTexture = material.lightMap || whiteTexture;
    var reconnectTimeIncrease = material.lightMapDir || whiteTexture;
    var value = component.getSH(material.environment);
    return material.normalMap && (pbrMaterial.defines.USE_NORMALMAP = true), material.normalMap2 && (pbrMaterial.defines.USE_NORMALMAP2 = true), material.aoMap && (pbrMaterial.defines.USE_AOMAP = true), material.aoMap2 && (pbrMaterial.defines.USE_AOMAP2 = true), material.emissiveMap && (pbrMaterial.defines.USE_EMISSIVEMAP = true), material.lightMap && (pbrMaterial.defines.USE_LIGHTMAP = true), material.lightMapDir && (pbrMaterial.defines.USE_LIGHTMAP_DIR = true), material.albedoMap && (pbrMaterial.defines.USE_ALBEDOMAP =
        true), material.albedoMap2 && (pbrMaterial.defines.USE_ALBEDOMAP2 = true), pbrMaterial.uAlbedoPBRFactor = optionalParameter(material.albedoFactor, 1), pbrMaterial.uNormalMapFactor = optionalParameter(material.normalMapFactor, 1), pbrMaterial.uMetalnessPBRFactor = optionalParameter(material.metalFactor, 1), pbrMaterial.uGlossinessPBRFactor = optionalParameter(material.glossFactor, 1), pbrMaterial.uAOPBRFactor = optionalParameter(material.aoFactor, 1), pbrMaterial.uSpecularF0Factor = optionalParameter(material.f0Factor,
        .5), pbrMaterial.uEnvironmentExposure = optionalParameter(material.exposure, 1), pbrMaterial.occludeSpecular = optionalParameter(material.occludeSpecular ? 1 : 0, 1), pbrMaterial.uFlipY = optionalParameter(material.flipNormals, 0), pbrMaterial.opacity = optionalParameter(material.opacity, 1), pbrMaterial.color = (new THREE.Color).setHex(void 0 !== material.color ? material.color : 16777215), pbrMaterial.side = optionalParameter(material.side, THREE.FrontSide), options.needsUpdate = true, directLoginReference.needsUpdate =
        true, flag.needsUpdate = true, cloudDistance.needsUpdate = true, hyperParameters.needsUpdate = true, picture_right_map.needsUpdate = true, picture_below_map.needsUpdate = true, topTexture.needsUpdate = true, defTexture.needsUpdate = true, reconnectTimeIncrease.needsUpdate = true, pbrMaterial.sTextureAlbedoMap = options, pbrMaterial.sTextureAlbedoMap2 = directLoginReference, pbrMaterial.sTextureNormalMap = flag, pbrMaterial.sTextureNormalMap2 = cloudDistance, pbrMaterial.sTextureAOMap = hyperParameters,
    pbrMaterial.sTextureAOMap2 = picture_right_map, pbrMaterial.sTexturePBRMaps = picture_below_map, pbrMaterial.sTextureEmissiveMap = topTexture, pbrMaterial.sTextureLightMap = defTexture, pbrMaterial.sTextureLightMapDir = reconnectTimeIncrease, value && (pbrMaterial.uDiffuseSPH = new Float32Array(value, 27)), pbrMaterial.uEnvironmentTransform = new THREE.Matrix4, material.alphaTest && (pbrMaterial.alphaTest = material.alphaTest, pbrMaterial.defines.ALPHATEST = true), pbrMaterial.refreshOffsetRepeat(),
    pbrMaterial.refreshOffsetRepeatDetail(), pbrMaterial;
};

/** @type {function(!Function): undefined} */
export default PBRMaterial;

