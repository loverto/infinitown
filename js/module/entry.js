var town53 = function (require, canCreateDiscussions, n) {
    /**
     * 初始化
     * @param {string} name
     * @param {!Object} options
     * @param {string} time
     * @param {!Function} r
     * @return {undefined}
     */
    function initialize(name, options, time, r) {
        var _infoMemory = {
            geometries : [name],
            textures : p,
            sh : [time]
        };
        var downloader = new EventEmitter(_infoMemory);
        downloader.load().then(function(n) {
            /** @type {string} */
            scope.texturePath = "assets/" + name + "/";
            THREE.MaterialLoader.setShaders(albumInfoUrl);
            instance.loadScene(name, "assets/scenes/", options).then(r);
        });
    }
    /**
     * @return {undefined}
     */
    function load() {
        /** @type {string} */
        var container = "main";
        /** @type {string} */
        var step = "envProbe";
        options = new Scene({
            canvas : document.querySelector("canvas"),
            autoClear : false,
            fps : Config.FPS || false,
            logCalls : Config.LOG_CALLS || false,
            maxPixelRatio : Config.MAX_PIXEL_RATIO || 2
        });
        initialize(container, options, step, function(t) {
            window.api.trigger("loaded");
            setTimeout(function() {
                options.start(t);
                window.api.trigger("started");
            }, 20);
        });
        $(document).on("click", function() {
            window.api.trigger("click");
        });
    }
    require("18");
    require("28").polyfill();
    var o = require("3");
    var EventEmitter = require("14");
    var scope = require("15");
    var instance = require("17");
    var Scene = require("43");
    var Config = require("50");
    var albumInfoUrl = require("44");
    var p = require("51");
    $("canvas");
    /**
     * @param {?} status
     * @param {number} e
     * @param {?} i
     * @return {undefined}
     */
    scope.manager.onProgress = function(status, e, i) {
        /** @type {number} */
        var patternLen = 57;
        /** @type {number} */
        var modifiedEventData = Math.ceil(e / patternLen * 100);
        window.api.trigger("loadingprogress", modifiedEventData);
    };
    var options;
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
            options.pause();
        },
        resume : function() {
            options.resume();
        },
        load : load
    });
    utils.mixin(o);
    window.api = new utils;
}