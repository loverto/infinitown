import * as THREE from 'three';
import 'module/BaseUtils';
import Events from 'module/Events';
import LoaderManager from 'module/LoaderManager';
import loaderUtils from 'module/LoaderUtils';
import instance from 'module/instance';
import Scene from 'module/SceneManager';
import Config from 'module/GlobalConfig';
import texturesResources from 'module/textures';
$('canvas');
var sceneCanvas;

/**
 * 初始化方法
 * @param name
 * @param scene
 * @param env
 * @param callback
 */
function initialize(name, scene, env, callback) {
    // 配置信息
    var configOptions = {
        geometries : [name],
        textures : texturesResources,
        sh : [env]
    };
    // 加载资源
    var loaderManager = new LoaderManager(configOptions);
    // 通过promise控制静态资源和几何体还有纹理贴片第一部加载
    loaderManager.load().then(function(response) {
        // 设置纹理的相对路径
        loaderUtils.texturePath = 'assets/' + name + '/';
        // 加载场景
        instance.loadScene(name, 'assets/scenes/', scene).then(callback);
    });
}
/**
 * 加载入口
 * @return {undefined}
 */
function load() {
    var container = 'main';
    var env = 'envProbe';
    let canvas = document.querySelector('canvas');
    sceneCanvas = new Scene({
        canvas : canvas,
        autoClear : false,
        profiling : false,
        fps : Config.FPS || false,
        logCalls : Config.LOG_CALLS || false,
        maxPixelRatio : Config.MAX_PIXEL_RATIO || 2
    });
    initialize(container, sceneCanvas, env, function(objects) {
        window.api.trigger('loaded');
        setTimeout(function() {
            sceneCanvas.start(objects);
            window.api.trigger('started');
        }, 20);
    });
    $(document).on('click', function() {
        window.api.trigger('click');
    });
}


loaderUtils.manager.onProgress = function(status, e, i) {
    var patternLen = 57;
    var modifiedEventData = Math.ceil(e / patternLen * 100);
    window.api.trigger('loadingprogress', modifiedEventData);
};
// 如果是顶级窗口就执行
if (window.parent === window) {
    load();
}

class utils extends Events{
    static pause() {
        sceneCanvas.pause();
    }
    static resume() {
        sceneCanvas.resume();
    }

};

utils.load = load
window.api = new utils;
