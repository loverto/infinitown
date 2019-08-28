import bluebird from 'bluebird';
import loaderUtils from 'module/LoaderUtils';

class LoaderManager {
    /**
     * 加载资源管理器
     * @param configOptions 配置信息
     * @constructor
     */
    constructor(configOptions) {
        // 加载器
        if (configOptions.manager) {
            this.manager = configOptions.manager;
        }
        // 立方体贴图
        if (configOptions.cubemaps) {
            this.cubemaps = configOptions.cubemaps;
        }
        // env 资源
        if (configOptions.sh) {
            this.sh = configOptions.sh;
        }
        // 纹理
        if (configOptions.textures) {
            this.textures = configOptions.textures;
        }
        // 全景
        if (configOptions.panoramas) {
            this.panoramas = configOptions.panoramas;
        }
        // 几何体
        if (configOptions.geometries) {
            this.geometries = configOptions.geometries;
        }
    }

    load() {
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
    }
}

export default LoaderManager;
