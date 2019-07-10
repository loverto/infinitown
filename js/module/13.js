var town13 = function ($, canCreateDiscussions, n) {
    var data = ($("21"), $("22"));
    var images = $("20");
    /** @type {function(!Object): ?} */
    var RandomBaseTimeSeriesDataModel = ($("15"), THREE.MaterialLoader.prototype.parse);
    /** @type {null} */
    var shaders = null;
    /**
     * @param {!Object} trackInfoUrl
     * @return {undefined}
     */
    THREE.MaterialLoader.setShaders = function(trackInfoUrl) {
        /** @type {!Object} */
        shaders = trackInfoUrl;
    };
    /**
     * @param {!Object} options
     * @return {?}
     */
    THREE.MaterialLoader.prototype.parse = function(options) {
        var json = RandomBaseTimeSeriesDataModel.call(this, options);
        if (options.customType && "MatcapMaterial" === options.customType) {
            return images.create({
                uuid : options.uuid,
                name : options.name,
                normalMap : json.normalMap,
                matcapMap : THREE.ImageUtils.loadTexture("textures/matcap.jpg"),
                normalMapFactor : 1
            });
        }
        if (options.customType && "PBRMaterial" === options.customType) {
            var n = options.metalGlossMap ? this.getTexture(options.metalGlossMap) : null;
            var s = options.map2 ? this.getTexture(options.map2) : null;
            var c = options.normalMap2 ? this.getTexture(options.normalMap2) : null;
            var u = options.aoMap2 ? this.getTexture(options.aoMap2) : null;
            var l = options.lightMapM ? this.getTexture(options.lightMapM) : null;
            var f = options.lightMapDir ? this.getTexture(options.lightMapDir) : null;
            var materialEmissiveMapRow = options.emissiveMap ? this.getTexture(options.emissiveMap) : null;
            var p = options.packedPBRMap ? this.getTexture(options.packedPBRMap) : null;
            return data.create({
                vertexShader : shaders["pbr.vs"],
                fragmentShader : shaders["pbr.fs"],
                uuid : options.uuid,
                name : options.name,
                color : options.color,
                opacity : json.opacity,
                transparent : json.transparent,
                alphaTest : json.alphaTest,
                environment : options.environment,
                exposure : options.exposure,
                albedoMap : json.map,
                albedoMap2 : s,
                metalGlossMap : n,
                packedMap : p,
                metalFactor : options.metalFactor,
                glossFactor : options.glossFactor,
                normalMapFactor : options.normalFactor,
                normalMap : json.normalMap,
                normalMap2 : c,
                lightMap : json.lightMap,
                lightMapM : l,
                lightMapDir : f,
                aoMap : json.aoMap,
                aoMap2 : u,
                aoFactor : options.aoFactor,
                occludeSpecular : options.occludeSpecular,
                emissiveMap : materialEmissiveMapRow
            });
        }
        if ("SkyboxMaterial" === options.customType) {
            var shader = THREE.ShaderLib.cube;
            json.vertexShader = shaders["skybox.vs"];
            json.fragmentShader = shaders["skybox.fs"];
            json.uniforms = THREE.UniformsUtils.clone(shader.uniforms);
            json.uniforms.tCube.value = this.getTexture(options.cubemap);
        }
        return json;
    };
}