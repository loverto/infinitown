import * as THREE from 'three';
import 'module/utils/BaseUtils';
import Events from 'module/event/Events';
import LoaderManager from 'module/loader/LoaderManager';
import loaderUtils from 'module/utils/LoaderUtils';
import Instance from 'module/Instance';
import Scene from 'module/scene/SceneManager';
import Config from 'module/config/GlobalConfig';
import texturesResources from 'module/render/textures';
$('canvas');


class InfinitownManager extends Events{
    /**
     * 构造函数
     */
    constructor() {
        super();
        this.sceneCanvas = null;
    }

    pause() {
        this.sceneCanvas.pause();
    }
    resume() {
        this.sceneCanvas.resume();
    }
    /**
     * 初始化方法
     * @param name {string} 名称
     * @param scene {Scene} 场景
     * @param env {string} 环境
     * @param callback {function} 回调函数
     */
    initialize(name, scene, env, callback) {
        // 配置信息
        const configOptions = {
            geometries: [name],
            textures: texturesResources,
            sh: [env]
        };
        // 加载资源
        const loaderManager = new LoaderManager(configOptions);
        // 通过promise控制静态资源和几何体还有纹理贴片第一部加载
        loaderManager.load().then(function(response) {
            // 设置纹理的相对路径
            loaderUtils.texturePath = 'assets/' + name + '/';
            // 加载场景
            Instance.loadScene(name, 'assets/scenes/', scene).then(callback);
        });
    }

    /**
     * 加载入口
     * @return {undefined}
     */
    load() {
        const container = 'main';
        const env = 'envProbe';
        let canvas = document.querySelector('canvas');
        // 初始化场景
        this.sceneCanvas = new Scene({
            canvas : canvas,
            autoClear : false,
            profiling : false,
            fps : Config.FPS || false,
            logCalls : Config.LOG_CALLS || false,
            maxPixelRatio : Config.MAX_PIXEL_RATIO || 2
        });
        let sc = this.sceneCanvas;
        this.initialize(container, sc, env, function(objects) {
            window.api.trigger('loaded');
            setTimeout(function() {
                sc.start(objects);
                window.api.trigger('started');
            }, 20);
        });
        $(document).on('click', function() {
            window.api.trigger('click');
        });
    }

};

window.api = new InfinitownManager;

// 如果是顶级窗口就执行
if (window.parent === window) {
    window.api.load();
}

loaderUtils.manager.onProgress = function(status, e, i) {
    const patternLen = 57;
    const modifiedEventData = Math.ceil(e / patternLen * 100);
    window.api.trigger('loadingprogress', modifiedEventData);
};


