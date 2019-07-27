import * as THREE from 'three';

// promise 工具类
import bluebird from 'bluebird';

import parseUrl from 'module/parseUrl';
import LoadSceneManager from 'module/LoadSceneManager';
import BaseDataTextureLoader from 'module/BaseDataTextureLoader';
import AbstrctCompressedTextureLoader from 'module/AbstrctCompressedTextureLoader';
import FileLoaderUtils from 'module/FileLoaderUtils';
import BaseFileLoader from 'module/BaseFileLoader';
// 加载管理
var loadingManager = new THREE.LoadingManager;
// 场景加载管理
var loadSceneManager = new LoadSceneManager(loadingManager);
var cacheResult = {};
// 标准化纹理加载器
var textureLoaderNoralize = normalize(new THREE.TextureLoader(loadingManager), cacheResult);
// 标准化数据纹理加载器
var dataTextureLoaderExternNoralize = normalize(new BaseDataTextureLoader(1024, false, loadingManager), cacheResult);
// 标准化压缩纹理加载器
var compressedTextureLoaderExternNoralize = normalize(new AbstrctCompressedTextureLoader(256, false, loadingManager), cacheResult);
// sh 的
var shs = {};
// 数据帧渲染
var dataFrameReader = new FileLoaderUtils(loadingManager);
var geometriesCache = {};
// 标准化文件加载器
var geometries = normalize(new BaseFileLoader(loadingManager), geometriesCache);
var LoaderUtils = {
    environmentPath : 'assets/environments',
    geometryPath : 'assets/scenes/data/',
    manager : loadingManager,
    sceneLoader : loadSceneManager
};

/**
 * 把load格式标准化
 * @param loader
 * @param cacheResult
 * @returns {{load: load, get: (function(*=)), _cache: (*|{})}}
 */
function normalize(loader, cacheResult) {
    return {
        /**
         * 缓存
         */
        _cache : cacheResult || {},
        /**
         * 用加载器加载数据
         * @param url
         * @param m
         * @param onProgress
         * @param onError
         * @param path
         */
        load : function(url, m, onProgress, onError, path) {
            // 获取当前的缓存
            var cache = this._cache;
            // 判断缓存中是否有该元素
            if (_.has(cache, path)) {
                resolve(cache[path]);
            } else {
                loader.load(url, function(tmpl) {
                    cache[path] = tmpl;
                    m.apply(this, arguments);
                }, onProgress, onError);
            }
        },
        /**
         * 读取元素
         * @param path
         * @returns {*}
         */
        get : function(path) {
            // 从缓存中读取内容
            if(!_.has(this._cache, path)){
                console.error('Resource not found: ' + path)
            }
            return this._cache[path];
        }
    };
}

/**
 *
 * @param resources 资源数组或资源
 * @param uri 服务器路径 示例 http:// | ftp:// | https
 * @param normalizeLoader 规范化之后的加载器
 * @param load 加载
 * @returns {Promise<[any, any, any, any, any, any, any, any, any, any]>}
 */
function exec(resources, uri, normalizeLoader, load) {
    // 如果参数不是数组，自动转换为数组
    _.isArray(resources) || (resources = [resources])
    return  bluebird.all(_.map(resources, function(uriResource) {
        if (load) {
            return load(parseUrl(uri, uriResource), uriResource, normalizeLoader);
        }
    }));
}

/**
 * 加载
 * @param url 加载路径
 * @param name web资源
 * @param loader 规范化之后的加载器
 * @returns {Promise}
 */
function load(url, name, loader) {
    return new bluebird(function(resolve, reject) {
        loader.load(url, function(object) {
            // 文件名称赋值
            object.filename = name;
            resolve(arguments.length > 1 ? _.toArray(arguments) : object);
        }, function() {
        }, function() {
            reject(new Error('Resource was not found: ' + url));
        }, name);
    });
}

/**
 *
 * @param resourcesArray 资源数组
 * @param uri 服务器路径 示例 http:// | ftp://| https://
 * @param normalizeLoader 规范化之后的loader 加载器
 */
function fn(resourcesArray, uri, normalizeLoader) {
    // 如果arrays未定义，则初始化空数组
    resourcesArray = resourcesArray || []
    return exec(resourcesArray, uri, normalizeLoader, load);
}

// 定义纹理路径
var temp = '';
Object.defineProperty(LoaderUtils, 'texturePath', {
    get : function() {
        return temp;
    },
    set : function(dir) {
        temp = dir;
        loadSceneManager.setTexturePath(dir);
    }
});

/**
 * 场景加载
 * @param url 资源路径
 * @param filename 文件名称
 * @returns {Promise}
 */
LoaderUtils.loadScene = function(url, filename) {
    return load(url, filename, loadSceneManager);
};

/**
 * 加載Objs對象
 * @param objsArray objs资源数组
 * @param uri 服务器路径 示例 http:// | ftp://| https://
 * @returns {Promise<(any)[]>}
 */
LoaderUtils.loadOBJs = function(resourceArray, url) {
    return fn(resourceArray, url, objLoader);
};
/**
 * 加载纹理
 * @param texturesArrays 纹理资源数组
 * @param uri 服务器路径 示例 http:// | ftp://| https://
 * @returns {?}
 */
LoaderUtils.loadTextures = function(texturesArrays, uri) {
    return fn(texturesArrays, uri || LoaderUtils.texturePath, textureLoaderNoralize);
};

/**
 *
 * @param brdfsArray brdf资源数组
 * @param uri 服务器路径 示例 http:// | ftp://| https://
 * @returns {Promise<(any)[]>}
 */
LoaderUtils.loadBRDFs = function(brdfsArray, uri) {
    return fn(brdfsArray, uri, brdfLoader);
};

/**
 * 加载全景资源数组
 * @param panoramasArray 全景资源数组
 * @param uri 服务器路径 示例 http:// | ftp://| https://
 * @returns {Promise<(any)[]>}
 */
LoaderUtils.loadPanoramas = function(panoramasArray, uri) {
    return fn(panoramasArray, uri || LoaderUtils.environmentPath, dataTextureLoaderExternNoralize);
};

/**
 * 加载光斑
 * @param specularCubemapsArray 光斑资源数组
 * @param uri 服务器路径 示例 http:// | ftp://| https://
 * @returns {Promise<(any)[]>}
 */
LoaderUtils.loadSpecularCubemaps = function(specularCubemapsArray, uri) {
    return fn(specularCubemapsArray, uri || LoaderUtils.environmentPath, compressedTextureLoaderExternNoralize);
};

/**
 * 加载Sh
 * @param env
 * @returns {Promise<[any, any, any, any, any, any, any, any, any, any]>}
 */
LoaderUtils.loadSH = function(env) {
    return bluebird.all(_.map(env, function(item) {
        return new bluebird(function(resolve, reject) {
            // 辐照度
            var url = parseUrl(LoaderUtils.environmentPath, item + '/irradiance.json');
            // 加载json文件
            dataFrameReader.load(url, function(data) {
                shs[item] = data;
                resolve(data);
            }, function() {
            }, function() {
                reject(new Error('Resource was not found: ' + url));
            });
        });
    }));
};

/**
 * 加载几何体
 * @param geometriesArray 几何体数组
 * @param uri  服务器路径 示例 http:// | ftp://| https://
 */
LoaderUtils.loadGeometries = function(geometriesArray, uri) {
    return geometriesArray = _.map(geometriesArray, function(item) {
        return item + '.bin';
    }), fn(geometriesArray, uri || LoaderUtils.geometryPath, geometries);
};

/**
 * 根据key获取纹理
 * @param key
 * @returns {*}
 */
LoaderUtils.getTexture = function(key) {
    return textureLoaderNoralize.get(key);
};

/**
 * 根据key 获取brdf
 * @param t
 * @returns {*}
 */
LoaderUtils.getBRDF = function(t) {
    return brdfLoader.get(t);
};

/**
 * 根据key获取全景
 * @param prefix
 * @returns {*}
 */
LoaderUtils.getPanorama = function(prefix) {
    return dataTextureLoaderExternNoralize.get(prefix + '/panorama.bin');
};

/**
 * 根据key获取立方体
 * @param prefix
 * @returns {*}
 */
LoaderUtils.getCubemap = function(prefix) {
    return compressedTextureLoaderExternNoralize.get(prefix + '/cubemap.bin');
};

/**
 * 根据key 获取SH Spherical Harmonics，球面谐波
 * @param notebookID
 * @returns {*}
 */
LoaderUtils.getSH = function(notebookID) {
    return shs[notebookID];
};

/**
 * 根据key获取几何体
 * @param name
 * @returns {*}
 */
LoaderUtils.getGeometry = function(name) {
    return geometries.get(name + '.bin');
};
export default LoaderUtils;
