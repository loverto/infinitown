import * as THREE  from 'three';
import 'module/ShaderMaterialExtern'
import PBRMaterial from 'module/PBRMaterial';
import MatcapMaterial from 'module/matcapMaterial';
import 'module/LoaderUtils'

// 获取MateriaLoader的原型用于扩展
var THREEMateriaLoaderparse = THREE.MaterialLoader.prototype.parse;
var shaders = null;
// 重写设置顶点的资源
/**
 * 重写设置顶点的资源
 * @param inShaders
 */
THREE.MaterialLoader.setShaders = function(inShaders) {
    shaders = inShaders;
};
/**
 * 重写MaterialLoader的parse方法
 * @param options
 * @returns {MatcapMaterial|Material|PBRMaterial}
 */
THREE.MaterialLoader.prototype.parse = function(options) {
    // 由于颜色，threejs106 这个版本无法正常识别，所以先置空，后赋值
    var col = options.color;
    options.color = undefined;
    // 首先调用MateriaLoader的parse方法转换参数
    var json = THREEMateriaLoaderparse.call(this, options);
    options.color = col;
    // 判断是否是自定义类型，并且类型的名称是Matcap材料
    if (options.customType && 'MatcapMaterial' === options.customType) {
        // 垫材质
        return MatcapMaterial.create({
            uuid : options.uuid,
            name : options.name,
            normalMap : json.normalMap,
            matcapMap : THREE.TextureLoader.load('textures/matcap.jpg'),
            normalMapFactor : 1
        });
    }
    // PBR材料
    if (options.customType && 'PBRMaterial' === options.customType) {
        // 金属光泽图
        var metalGlossMap = options.metalGlossMap ? this.getTexture(options.metalGlossMap) : null;
        // 反照率地图2
        var albedoMap2 = options.map2 ? this.getTexture(options.map2) : null;
        // 法线贴图2
        var normalMap2 = options.normalMap2 ? this.getTexture(options.normalMap2) : null;
        // 来图2
        var aoMap2 = options.aoMap2 ? this.getTexture(options.aoMap2) : null;
        // 光地图M.
        var lightMapM = options.lightMapM ? this.getTexture(options.lightMapM) : null;
        // 地图定向光
        var lightMapDir = options.lightMapDir ? this.getTexture(options.lightMapDir) : null;
        // 材料 发射的 Map 行
        var materialEmissiveMapRow = options.emissiveMap ? this.getTexture(options.emissiveMap) : null;
        // 打包地图
        var packedMap = options.packedPBRMap ? this.getTexture(options.packedPBRMap) : null;
        // 根据指定的参数创建
        return PBRMaterial.create({
            vertexShader : shaders['pbr.vs'],
            fragmentShader : shaders['pbr.fs'],
            uuid : options.uuid,
            name : options.name,
            color : options.color,
            opacity : json.opacity,
            transparent : json.transparent,
            alphaTest : json.alphaTest,
            environment : options.environment,
            exposure : options.exposure,
            albedoMap : json.map,
            albedoMap2 : albedoMap2,
            metalGlossMap : metalGlossMap,
            packedMap : packedMap,
            metalFactor : options.metalFactor,
            glossFactor : options.glossFactor,
            normalMapFactor : options.normalFactor,
            normalMap : json.normalMap,
            normalMap2 : normalMap2,
            lightMap : json.lightMap,
            lightMapM : lightMapM,
            lightMapDir : lightMapDir,
            aoMap : json.aoMap,
            aoMap2 : aoMap2,
            aoFactor : options.aoFactor,
            occludeSpecular : options.occludeSpecular,
            emissiveMap : materialEmissiveMapRow
        });
    }
    if ('SkyboxMaterial' === options.customType) {
        var shader = THREE.ShaderLib.cube;
        json.vertexShader = shaders['skyboxvs'];
        json.fragmentShader = shaders['skyboxfs'];
        json.uniforms = THREE.UniformsUtils.clone(shader.uniforms);
        json.uniforms.tCube.value = this.getTexture(options.cubemap);
    }
    return json;
};
