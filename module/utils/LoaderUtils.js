// promise 工具类
import bluebird from 'bluebird';

import urlUtils from 'module/utils/UrlUtils';
import LoadSceneManager from 'module/scene/LoadSceneManager';
import BasePanoramasLoader from 'module/loader/BasePanoramasLoader';
import AbstrctCompressedTextureLoader from 'module/loader/AbstrctCompressedTextureLoader';
import FileLoaderUtils from 'module/utils/FileLoaderUtils';
import BaseFileLoader from 'module/loader/BaseFileLoader';
import {LoadingManager} from "three";
import {TextureLoader} from "three";
// 加载管理
var loadingManager = new LoadingManager;
// 场景加载管理
var loadSceneManager = new LoadSceneManager(loadingManager);
var cacheResult = {};
// 标准化纹理加载器
var textureLoaderNoralize = normalize(new TextureLoader(loadingManager), cacheResult);
// 标准化全景加载器
var panoramasLoaderExternNoralize = normalize(new BasePanoramasLoader(1024, false, loadingManager), cacheResult);
// 标准化压缩纹理加载器
var compressedTextureLoaderExternNoralize = normalize(new AbstrctCompressedTextureLoader(256, false, loadingManager), cacheResult);
// sh 的
var shs = {};
// 数据帧渲染
var dataFrameReader = new FileLoaderUtils(loadingManager);
var geometriesCache = {};
// 标准化文件加载器
var geometries = normalize(new BaseFileLoader(loadingManager), geometriesCache);


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
            return load(urlUtils(uri, uriResource), uriResource, normalizeLoader);
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

let temp = ''

class LoaderUtils{


    /**
     * 定义纹理路径
     * @returns {*}
     */
    static get texturePath() {
        return temp;
    }
    /**
     * 定义纹理路径
     * @returns {*}
     */
    static set texturePath(dir) {
        temp = dir;
        loadSceneManager.setTexturePath(dir);
    }

    /**
     * 场景加载
     * @param url 资源路径
     * @param filename 文件名称
     * @returns {Promise}
     */
    static loadScene(url, filename) {
        return load(url, filename, loadSceneManager);
    }


    /**
     * 加載Objs對象
     * @param objsArray objs资源数组
     * @param uri 服务器路径 示例 http:// | ftp://| https://
     * @returns {Promise<(any)[]>}
     */
    static loadOBJs(resourceArray, url) {
        return fn(resourceArray, url, objLoader);
    }




    /**
     * 加载纹理
     * @param texturesArrays 纹理资源数组
     * @param uri 服务器路径 示例 http:// | ftp://| https://
     * @returns {?}
     */
    static loadTextures(texturesArrays, uri) {
        return fn(texturesArrays, uri || LoaderUtils.texturePath, textureLoaderNoralize);
    }


    /**
     *
     * @param brdfsArray brdf资源数组
     * @param uri 服务器路径 示例 http:// | ftp://| https://
     * @returns {Promise<(any)[]>}
     */
    static loadBRDFs(brdfsArray, uri) {
        return fn(brdfsArray, uri, brdfLoader);
    }


    /**
     * 加载全景资源数组
     * @param panoramasArray 全景资源数组
     * @param uri 服务器路径 示例 http:// | ftp://| https://
     * @returns {Promise<(any)[]>}
     */
    static loadPanoramas(panoramasArray, uri) {
        return fn(panoramasArray, uri || LoaderUtils.environmentPath, panoramasLoaderExternNoralize);
    }

    /**
     * 加载光斑
     * @param specularCubemapsArray 光斑资源数组
     * @param uri 服务器路径 示例 http:// | ftp://| https://
     * @returns {Promise<(any)[]>}
     */
    static loadSpecularCubemaps(specularCubemapsArray, uri) {
        return fn(specularCubemapsArray, uri || LoaderUtils.environmentPath, compressedTextureLoaderExternNoralize);
    }


    /**
     * 加载环境辐照信息 Sh
     * @param env
     * @returns {Promise<[any, any, any, any, any, any, any, any, any, any]>}
     */
    static loadSH(env) {
        return bluebird.all(_.map(env, function(item) {
            return new bluebird(function(resolve, reject) {
                // 环境辐照度
                var url = urlUtils(LoaderUtils.environmentPath, item + '/irradiance.json');
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
    }


    /**
     * 加载几何体
     * @param geometriesArray 几何体数组
     * @param uri  服务器路径 示例 http:// | ftp://| https://
     */
    static loadGeometries(geometriesArray, uri) {
        return geometriesArray = _.map(geometriesArray, function(item) {
            return item + '.bin';
        }), fn(geometriesArray, uri || LoaderUtils.geometryPath, geometries);
    }




    /**
     * 根据key获取纹理
     * @param key
     * @returns {*}
     */
    static getTexture(key) {
        return textureLoaderNoralize.get(key);
    }


    /**
     * 根据key 获取brdf
     * @param t
     * @returns {*}
     */
    static getBRDF(t) {
        return brdfLoader.get(t);
    }


    /**
     * 根据key获取全景
     * @param prefix
     * @returns {*}
     */
    static getPanorama(prefix) {
        return panoramasLoaderExternNoralize.get(prefix + '/panorama.bin');
    }



    /**
     * 根据key获取立方体
     * @param prefix
     * @returns {*}
     */
    static getCubemap(prefix) {
        return compressedTextureLoaderExternNoralize.get(prefix + '/cubemap.bin');
    }



    /**
     * 根据key 获取SH Spherical Harmonics，球面谐波
     * @param notebookID
     * @returns {*}
     */
    static getSH(notebookID) {
        return shs[notebookID];
    };


    /**
     * 根据key获取几何体
     * @param name
     * @returns {*}
     */
    static getGeometry(name) {
        return geometries.get(name + '.bin');
    };


}



LoaderUtils.environmentPath = 'assets/environments'
LoaderUtils.geometryPath = 'assets/scenes/data/'
LoaderUtils.manager = loadingManager
LoaderUtils.sceneLoader = loadSceneManager

export default LoaderUtils;
