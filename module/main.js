import 'module/BaseUtils';
require('module/es6-promise').polyfill();
import Events from 'module/Events';
import Renderer from 'module/Renderer';
import threejsInitional from 'module/LoaderUtils';
import instance from 'module/instance';
import Scene from 'module/sceneManager';
import Config from 'module/state';
import shadersResource from 'module/shaders';
import texturesResources from 'module/textures';
$('canvas');
var sceneCanvas;

/**
 * @param {string} name
 * @param {!Object} options
 * @param {string} env
 * @param {!Function} callback
 * @return {undefined}
 */
function initialize(name, options, env, callback) {
    var _infoMemory = {
        geometries : [name],
        textures : texturesResources,
        sh : [env]
    };
    // 加载资源
    var downloader = new Renderer(_infoMemory);
    downloader.load().then(function(n) {
    /** @type {string} */
        threejsInitional.texturePath = 'assets/' + name + '/';
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
    /** @type {string} */
    var container = 'main';
    /** @type {string} */
    var env = 'envProbe';
    sceneCanvas = new Scene({
        canvas : document.querySelector('canvas'),
        autoClear : false,
        fps : Config.FPS || false,
        logCalls : Config.LOG_CALLS || false,
        maxPixelRatio : Config.MAX_PIXEL_RATIO || 2
    });
    initialize(container, sceneCanvas, env, function(t) {
        window.api.trigger('loaded');
        setTimeout(function() {
            sceneCanvas.start(t);
            window.api.trigger('started');
        }, 20);
    });
    $(document).on('click', function() {
        window.api.trigger('click');
    });
}

/**
 * @param {?} status
 * @param {number} e
 * @param {?} i
 * @return {undefined}
 */
threejsInitional.manager.onProgress = function(status, e, i) {
    /** @type {number} */
    var patternLen = 57;
    /** @type {number} */
    var modifiedEventData = Math.ceil(e / patternLen * 100);
    window.api.trigger('loadingprogress', modifiedEventData);
};
// 如果是顶级窗口就执行
if (window.parent === window) {
    load();
}
/**
 * @return {undefined}
 */
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
