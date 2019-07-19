import * as THREE  from 'three';
import Events from 'module/Events';
import timers from 'module/timers';
import Stats from 'module/Stats';
/**
 * @param {?} allOrId
 * @return {undefined}
 */
function update(allOrId) {
    /** @type {number} */
    var width = window.WIDTH = window.innerWidth;
    /** @type {number} */
    var height = window.HEIGHT = window.innerHeight;
    if (window.parent) {
    /** @type {number} */
        width = window.parent.innerWidth;
        /** @type {number} */
        height = window.parent.innerHeight;
    }
    this.setSize(width, height);
}
/**
 * @param {string} t
 * @return {undefined}
 */
function attachVisibilityEvent(t) {
    var propertyName;
    var visibilityChange;
    // 获取不同浏览器上的隐藏和展示的属性和事件
    if ('undefined' != typeof document.hidden) {
    /** @type {string} */
        propertyName = 'hidden';
        /** @type {string} */
        visibilityChange = 'visibilitychange';
    } else {
        if ('undefined' != typeof document.mozHidden) {
            /** @type {string} */
            propertyName = 'mozHidden';
            /** @type {string} */
            visibilityChange = 'mozvisibilitychange';
        } else {
            if ('undefined' != typeof document.msHidden) {
                /** @type {string} */
                propertyName = 'msHidden';
                /** @type {string} */
                visibilityChange = 'msvisibilitychange';
            } else {
                if ('undefined' != typeof document.webkitHidden) {
                    /** @type {string} */
                    propertyName = 'webkitHidden';
                    /** @type {string} */
                    visibilityChange = 'webkitvisibilitychange';
                }
            }
        }
    }
    // 如果支持事件注册，就注册
    if ('undefined' != typeof document.addEventListener) {
        document.addEventListener(visibilityChange, function() {
            // 如果有属性，则掉用方法
            if (document[propertyName]) {
                t.onLeaveTab();
            } else {
                // 没有该属性，50毫秒后自动解绑
                setTimeout(t.onFocusTab.bind(t), 50);
            }
        }, false);
    }
}
/**
 * @param {?} _options
 * @return {undefined}
 */
function Slatebox(_options) {
}

/**
 * @param {!Object} options
 * @return {undefined}
 */
var init = function(options) {
    // 设置WebGL渲染引擎，（，，，）类似这样的写法的作用，是按顺序执行，并返回最后一个，如果不是返回的地方，那就是继续执行。
    if (options = void 0 !== options ? options : {}, this.renderer = new THREE.WebGLRenderer({
        alpha : true,
        antialias : true,
        canvas : options.canvas || document.querySelector('canvas'),
        preserveDrawingBuffer : void 0 !== options.preserveDrawingBuffer ? options.preserveDrawingBuffer : void 0
    }), THREE.Extensions = this.renderer.extensions, this.config = {
        fps : void 0 !== options.fps && options.fps,
        profiling : void 0 !== options.profiling && options.profiling,
        logCalls : void 0 !== options.logCalls && options.logCalls
    }, options && options.maxPixelRatio) {
    // 物理像素分辨率与CSS像素分辨率的比值
        var ratio = window.devicePixelRatio > options.maxPixelRatio ? options.maxPixelRatio : window.devicePixelRatio;
    } else {
    /** @type {number} */
        ratio = window.devicePixelRatio;
    }
    if (window.isMobile) {
        ratio = ratio > 1.5 ? 1.5 : ratio;
    }
    // 设置像素比例
    this.renderer.setPixelRatio(ratio);
    // 浏览器视口（viewport）宽度（单位：像素），如果存在垂直滚动条则包括它。
    // 浏览器视口（viewport）高度（单位：像素），如果存在垂直滚动条则包括它。
    this.setSize(options.width || window.innerWidth, options.height || window.innerHeight);
    // 是否自动清理
    if (void 0 !== options.autoClear) {
    // 定义渲染器是否应在渲染帧之前自动清除其输出。
        this.renderer.autoClear = options.autoClear;
    }
    if (void 0 !== options.clearColor) {
        this.renderer.setClearColor(options.clearColor);
    }
    if (!(void 0 !== options.supportsTextureLod && options.supportsTextureLod !== true)) {
        THREE.Extensions.get('EXT_shader_texture_lod');
    }
    // 创建时钟用来记录时间,传递参数true,设置自动开始记录.默认值为true
    this.clock = new THREE.Clock;
    /** @type {boolean} */
    this.paused = false;
    /** @type {!Array} */
    this.scenes = [];
    /** @type {null} */
    this.scene = null;
    // 重置窗口绑定事件，update 是啥
    window.onresize = update.bind(this);
    // 绑定键盘按下事件
    window.addEventListener('keyup', Slatebox.bind(this));
    // 绑定鼠标悬浮事件
    this.renderer.domElement.addEventListener('mousemove', function(event) {
    /** @type {number} */
        window.mouseX = event.pageX / WIDTH * 2 - 1;
        /** @type {number} */
        window.mouseY = 1 - event.pageY / HEIGHT * 2;
    });
    // 如果配置fps 则创建状态信息，并显示fps信息在界面上
    if (this.config.fps) {
        this.fpsCounter = new Stats;
        /** @type {!Element} */
        this.counter = document.createElement('div');
        document.querySelectorAll('body')[0].appendChild(this.counter);
        this.counter.setAttribute('style', 'position:absolute;top:20px;left:100px;color:#ff00ff;display:block !important;z-index:999999;');
    }
    // 附加可见的事件
    attachVisibilityEvent(this);
    // 处理日志
    if (this.config.logCalls) {
        this.initDrawCallsCounter();
    }
};
init.prototype = {
    initDrawCallsCounter : function() {
        var $panzoom = $("<div id='dc'></div>");
        $("body").append($panzoom);
        $panzoom.css("position", "absolute").css("display", "block !important").css("color", "yellow").css("top", "60px").css("left", "20px").css("padding", "3px").css("font-size", "2em").css("background-color", "black").css("z-index", "999999");
        this.dcCounter = $panzoom[0];
    },
    render : function(text) {
    /** @type {number} */
        var totalPlayers = 0;
        var mapFragmentAndProps = function() {
            if (this.config.logCalls) {
                totalPlayers = totalPlayers + this.renderer.info.render.calls;
            }
        }.bind(this);
        this.renderScene(this.scene, this.camera);
        mapFragmentAndProps();
        if (this.config.logCalls) {
            this.dcCounter.textContent = totalPlayers + ' DC';
        }
    },
    renderScene : function(scene, camera) {
        debugger
        this.renderer.render(scene, camera);
    },
    update : function(target) {
        if (this.camera) {
            this.camera.updateMatrixWorld(true);
            this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld);
        }
        _.each(this.scenes, function(camera) {
            this.updateCustomMaterials(camera);
            if (camera.update) {
                camera.updateMatrixWorld(true);
                camera.update(this.renderer, target);
            }
        }, this);
    },
    updateCustomMaterials : function(model, name) {
        _.each(model.materials, function(handler) {
            if (handler.pbr) {
                handler.refreshUniforms(name || this.camera, this.envRotation);
            }
        }, this);
    },
    doUpdate : function() {
        var data = {
            delta : 0,
            elapsed : 0
        };
        return function() {
            if (data.delta = this.clock.getDelta(), data.elapsed = this.clock.getElapsedTime(), !this.paused) {
                this.requestAnimationFrame(this.doUpdate.bind(this));
                /** @type {number} */
                var t = void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now();
                TWEEN.update(t);
                timers.updateTimers(data);
                if (this.config.profiling) {
                    console.time('update');
                }
                this.update(data);
                if (this.config.profiling) {
                    console.timeEnd('update');
                }
                this.render(data);
                if (!this.started) {
                    /** @type {boolean} */
                    this.started = true;
                }
                if (this.config.fps) {
                    this.fpsCounter.update(data, function(pctg) {
                        /** @type {string} */
                        this.counter.textContent = pctg + ' FPS';
                    }.bind(this));
                }
            }
        };
    }(),
    start : function() {
        // 执行更新
        this.doUpdate();
    },
    pause : function() {
        if (!this.paused) {
            this.clock.stop();
            /** @type {boolean} */
            this.paused = true;
            if (this.config.fps) {
                this.counter.textContent += ' (paused)';
            }
        }
    },
    resume : function() {
        if (this.paused) {
            this.clock.start();
            /** @type {boolean} */
            this.paused = false;
            if (this.started) {
                this.doUpdate();
            }
        }
    },
    onLeaveTab : function() {
        if (!this.paused) {
            this.pause();
            /** @type {boolean} */
            this.shouldResume = true;
        }
    },
    onFocusTab : function() {
        if (this.shouldResume) {
            this.resume();
            /** @type {boolean} */
            this.shouldResume = false;
        }
    },
    setAspectRatio : function(aspect) {
        if (this.camera) {
            /** @type {number} */
            this.camera.aspect = aspect;
            this.camera.updateProjectionMatrix();
        }
    },
    setSize : function(width, height) {
        if (this.started) {
            this.setAspectRatio(width / height);
        }
        this.renderer.setSize(width, height);
    },
    requestAnimationFrame : function(callback) {
        requestAnimationFrame(callback);
    }
};
init.mixin(Events);

/** @type {function(!Object): undefined} */
export default init;
