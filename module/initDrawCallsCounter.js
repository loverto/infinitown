import * as THREE  from 'three';
import Events from 'module/Events';
import timers from 'module/timers';
import Stats from 'module/Stats';

function update(allOrId) {
    var width = window.WIDTH = window.innerWidth;
    var height = window.HEIGHT = window.innerHeight;
    if (window.parent) {
        width = window.parent.innerWidth;
        height = window.parent.innerHeight;
    }
    this.setSize(width, height);
}

/**
 * 附加可见性事件
 * @param event
 */
function attachVisibilityEvent(event) {
    var propertyName;
    var visibilityChange;
    // 获取不同浏览器上的隐藏和展示的属性和事件
    if ('undefined' != typeof document.hidden) {
        propertyName = 'hidden';
        visibilityChange = 'visibilitychange';
    } else {
        if ('undefined' != typeof document.mozHidden) {
            propertyName = 'mozHidden';
            visibilityChange = 'mozvisibilitychange';
        } else {
            if ('undefined' != typeof document.msHidden) {
                propertyName = 'msHidden';
                visibilityChange = 'msvisibilitychange';
            } else {
                if ('undefined' != typeof document.webkitHidden) {
                    propertyName = 'webkitHidden';
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
                event.onLeaveTab();
            } else {
                // 没有该属性，50毫秒后自动解绑
                setTimeout(event.onFocusTab.bind(event), 50);
            }
        }, false);
    }
}

function Slatebox(_options) {
}


var init = function(options) {
    // 设置WebGL渲染引擎，（，，，）类似这样的写法的作用，是按顺序执行，并返回最后一个，如果不是返回的地方，那就是继续执行。
    if (undefined === options){
        options = {}
    }
    // webGl渲染
    this.renderer = new THREE.WebGLRenderer({
        alpha : true,
        antialias : true,
        canvas : options.canvas || document.querySelector('canvas'),
        preserveDrawingBuffer : undefined !== options.preserveDrawingBuffer ? options.preserveDrawingBuffer : undefined
    })
    // 用来存储Three中Webgl的extensions
    THREE.Extensions = this.renderer.extensions
    // 配置信息
    this.config = {
        fps : undefined !== options.fps && options.fps,
        profiling : undefined !== options.profiling && options.profiling,
        logCalls : undefined !== options.logCalls && options.logCalls
    }
    // 比率
    var ratio = .0
    if (options && options.maxPixelRatio){
        // 物理像素分辨率与CSS像素分辨率的比值
        if (window.devicePixelRatio > options.maxPixelRatio){
            ratio = options.maxPixelRatio
        } else {
            ratio = window.devicePixelRatio;
        }
    } else {
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
    if (undefined !== options.autoClear) {
    // 定义渲染器是否应在渲染帧之前自动清除其输出。
        this.renderer.autoClear = options.autoClear;
    }
    if (undefined !== options.clearColor) {
        this.renderer.setClearColor(options.clearColor);
    }
    if (!(undefined !== options.supportsTextureLod && options.supportsTextureLod !== true)) {
        THREE.Extensions.get('EXT_shader_texture_lod');
    }
    // 创建时钟用来记录时间,传递参数true,设置自动开始记录.默认值为true
    this.clock = new THREE.Clock;
    this.paused = false;
    this.scenes = [];
    this.scene = null;
    // bind()方法创建一个新的函数，在bind()被调用时，这个新函数的this被bind的第一个参数指定，其余的参数将作为新函数的参数供调用时使用。
    // 重置窗口绑定事件，update 是啥
    window.onresize = update.bind(this);
    // 绑定键盘按下事件
    window.addEventListener('keyup', Slatebox.bind(this));
    // 绑定鼠标悬浮事件
    this.renderer.domElement.addEventListener('mousemove', function(event) {
        window.mouseX = event.pageX / WIDTH * 2 - 1;
        window.mouseY = 1 - event.pageY / HEIGHT * 2;
    });
    // 如果配置fps 则创建状态信息，并显示fps信息在界面上
    if (this.config.fps) {
        this.fpsCounter = new Stats;
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
    /**
     * 初始化绘制调用计算
     */
    initDrawCallsCounter : function() {
        var $panzoom = $("<div id='dc'></div>");
        $("body").append($panzoom);
        $panzoom.css("position", "absolute").css("display", "block !important").css("color", "yellow").css("top", "60px").css("left", "20px").css("padding", "3px").css("font-size", "2em").css("background-color", "black").css("z-index", "999999");
        this.dcCounter = $panzoom[0];
    },
    /**
     * 渲染
     * @param text
     */
    render : function(text) {
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
    /**
     * 渲染场景
     * @param scene
     * @param camera
     */
    renderScene : function(scene, camera) {
        this.renderer.render(scene, camera);
    },
    /**
     * 更新
     * @param target
     */
    update : function(target) {
        var self = this
        if (this.camera) {
            this.camera.updateMatrixWorld(true);
            this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld);
        }
        _.each(this.scenes, function(camera) {
            this.updateCustomMaterials(camera);
            if (camera.update) {
                camera.updateMatrixWorld(true);
                camera.update(self.renderer, target);
            }
        });
    },
    /**
     * 更新自定义材料
     * @param model
     * @param name
     */
    updateCustomMaterials : function(model, name) {
        var self = this
        _.each(model.materials, function(material) {
            if (material.pbr) {
                material.refreshUniforms(name || self.camera, self.envRotation);
            }
        });
    },
    /**
     * 执行更新
     */
    doUpdate : function() {
        var data = {
            delta : 0,
            elapsed : 0
        };
        return function() {
            // 延迟
            data.delta = this.clock.getDelta()
            // 获取过时时间
            data.elapsed = this.clock.getElapsedTime()
            if (!this.paused) {
                // 请求动画帧
                this.requestAnimationFrame(this.doUpdate.bind(this));
                var now = 0
                // 获取当前时间戳
                if (undefined !== window.performance && undefined !== window.performance.now){
                    now = window.performance.now()
                } else {
                    now = Date.now();
                }

                TWEEN.update(now);
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
                    this.started = true;
                }
                if (this.config.fps) {
                    this.fpsCounter.update(data, function(pctg) {
                        this.counter.textContent = pctg + ' FPS';
                    }.bind(this));
                }
            }
        };
    }(),
    /**
     * 开始
     */
    start : function() {
        // 执行更新
        this.doUpdate();
    },
    /**
     * 暂停
     */
    pause : function() {
        if (!this.paused) {
            this.clock.stop();
            this.paused = true;
            if (this.config.fps) {
                this.counter.textContent += ' (paused)';
            }
        }
    },
    /**
     * 恢复
     */
    resume : function() {
        if (this.paused) {
            this.clock.start();
            this.paused = false;
            if (this.started) {
                this.doUpdate();
            }
        }
    },
    /**
     * 在离开标签上
     */
    onLeaveTab : function() {
        if (!this.paused) {
            this.pause();
            this.shouldResume = true;
        }
    },
    /**
     * 在获取焦点上
     */
    onFocusTab : function() {
        if (this.shouldResume) {
            this.resume();
            this.shouldResume = false;
        }
    },
    /**
     * 设置宽高比
     * @param aspect 方面
     */
    setAspectRatio : function(aspect) {
        if (this.camera) {
            this.camera.aspect = aspect;
            this.camera.updateProjectionMatrix();
        }
    },
    /**
     * 设置大小
     * @param width
     * @param height
     */
    setSize : function(width, height) {
        if (this.started) {
            this.setAspectRatio(width / height);
        }
        this.renderer.setSize(width, height);
    },
    /**
     * 请求动画帧
     * @param callback
     */
    requestAnimationFrame : function(callback) {
        requestAnimationFrame(callback);
    }
};
init.mixin(Events);

export default init;
