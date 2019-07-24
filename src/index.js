import * as THREE from 'three';
import 'module/BaseUtils';
import Events from 'module/Events';
import Renderer from 'module/Renderer';
import loaderUtils from 'module/LoaderUtils';
import instance from 'module/instance';
import Scene from 'module/sceneManager';
import Config from 'module/state';
import shadersResource from 'module/shaders';
import texturesResources from 'module/textures';
$('canvas');
var sceneCanvas;

/**
 * 初始化方法
 * @param name
 * @param options
 * @param env
 * @param callback
 */
function initialize(name, options, env, callback) {
    var configOptions = {
        geometries : [name],
        textures : texturesResources,
        sh : [env]
    };
    // 加载资源
    var downloader = new Renderer(configOptions);
    downloader.load().then(function(response) {
        loaderUtils.texturePath = 'assets/' + name + '/';
        THREE.MaterialLoader.setShaders(shadersResource);
        // 加载场景
        instance.loadScene(name, 'assets/scenes/', options).then(callback);
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

var utils = function() {
};
utils.inherit(Object, {
    pause : function() {
        sceneCanvas.pause();
    },
    resume : function() {
        sceneCanvas.resume();
    },
    load : load
});
utils.mixin(Events);
window.api = new utils;
