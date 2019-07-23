import bluebird from 'bluebird';
import loaderUtils from 'module/LoaderUtils';


var Renderer = function (obj) {
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

Renderer.prototype.load = function () {
    var params = {};
    if (this.cubemaps) {
        (params.cubemap = loaderUtils.loadSpecularCubemaps(this.cubemaps))
    }
    if (this.panoramas) {
        (params.panorama = loaderUtils.loadPanoramas(this.panoramas))
    }
    if (this.sh) {
        (params.sh = loaderUtils.loadSH(this.sh))
    }
    if (this.textures) {
        (params.texture = loaderUtils.loadTextures(this.textures, ''))
    }
    if (this.geometries) {
        (params.geometry = loaderUtils.loadGeometries(this.geometries))
    }
    return bluebird.props(params);
};

export default Renderer;
