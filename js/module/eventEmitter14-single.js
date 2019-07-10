var r = require("24");
var scope = require("15");
/**
 * @param {!Object} obj
 * @return {undefined}
 */
var Renderer = function(obj) {
    if (obj.manager) {
        this.manager = obj.manager;
    }
    if (obj.cubemaps) {
        this.cubemaps = obj.cubemaps;
    }
    if (obj.sh) {
        this.sh = obj.sh;
    }
    if (obj.textures) {
        this.textures = obj.textures;
    }
    if (obj.panoramas) {
        this.panoramas = obj.panoramas;
    }
    if (obj.geometries) {
        this.geometries = obj.geometries;
    }
};
/**
 * @return {?}
 */
Renderer.prototype.load = function() {
    var params = {};
    return this.cubemaps && (params.cubemap = scope.loadSpecularCubemaps(this.cubemaps)), this.panoramas && (params.panorama = scope.loadPanoramas(this.panoramas)), this.sh && (params.sh = scope.loadSH(this.sh)), this.textures && (params.texture = scope.loadTextures(this.textures, "")), this.geometries && (params.geometry = scope.loadGeometries(this.geometries)), r.props(params);
};
/** @type {function(!Object): undefined} */
module.exports = Renderer;
