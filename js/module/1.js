var town1 = function (context, def, n) {
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
        if ("undefined" != typeof document.hidden) {
            /** @type {string} */
            propertyName = "hidden";
            /** @type {string} */
            visibilityChange = "visibilitychange";
        } else {
            if ("undefined" != typeof document.mozHidden) {
                /** @type {string} */
                propertyName = "mozHidden";
                /** @type {string} */
                visibilityChange = "mozvisibilitychange";
            } else {
                if ("undefined" != typeof document.msHidden) {
                    /** @type {string} */
                    propertyName = "msHidden";
                    /** @type {string} */
                    visibilityChange = "msvisibilitychange";
                } else {
                    if ("undefined" != typeof document.webkitHidden) {
                        /** @type {string} */
                        propertyName = "webkitHidden";
                        /** @type {string} */
                        visibilityChange = "webkitvisibilitychange";
                    }
                }
            }
        }
        if ("undefined" != typeof document.addEventListener) {
            document.addEventListener(visibilityChange, function() {
                if (document[propertyName]) {
                    t.onLeaveTab();
                } else {
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
    var a = context("3");
    var that = context("6");
    var Store = context("2");
    /**
     * @param {!Object} options
     * @return {undefined}
     */
    var init = function(options) {
        if (options = void 0 !== options ? options : {}, this.renderer = new THREE.WebGLRenderer({
            alpha : true,
            antialias : true,
            canvas : options.canvas || document.querySelector("canvas"),
            preserveDrawingBuffer : void 0 !== options.preserveDrawingBuffer ? options.preserveDrawingBuffer : void 0
        }), THREE.Extensions = this.renderer.extensions, this.config = {
            fps : void 0 !== options.fps && options.fps,
            profiling : void 0 !== options.profiling && options.profiling,
            logCalls : void 0 !== options.logCalls && options.logCalls
        }, options && options.maxPixelRatio) {
            var ratio = window.devicePixelRatio > options.maxPixelRatio ? options.maxPixelRatio : window.devicePixelRatio;
        } else {
            /** @type {number} */
            ratio = window.devicePixelRatio;
        }
        if (window.isMobile) {
            ratio = ratio > 1.5 ? 1.5 : ratio;
        }
        this.renderer.setPixelRatio(ratio);
        this.setSize(options.width || window.innerWidth, options.height || window.innerHeight);
        if (void 0 !== options.autoClear) {
            this.renderer.autoClear = options.autoClear;
        }
        if (void 0 !== options.clearColor) {
            this.renderer.setClearColor(options.clearColor);
        }
        if (!(void 0 !== options.supportsTextureLod && options.supportsTextureLod !== true)) {
            THREE.Extensions.get("EXT_shader_texture_lod");
        }
        this.clock = new THREE.Clock;
        /** @type {boolean} */
        this.paused = false;
        /** @type {!Array} */
        this.scenes = [];
        /** @type {null} */
        this.scene = null;
        window.onresize = update.bind(this);
        window.addEventListener("keyup", Slatebox.bind(this));
        this.renderer.domElement.addEventListener("mousemove", function(event) {
            /** @type {number} */
            window.mouseX = event.pageX / WIDTH * 2 - 1;
            /** @type {number} */
            window.mouseY = 1 - event.pageY / HEIGHT * 2;
        });
        if (this.config.fps) {
            this.fpsCounter = new Store;
            /** @type {!Element} */
            this.counter = document.createElement("div");
            document.querySelectorAll("body")[0].appendChild(this.counter);
            this.counter.setAttribute("style", "position:absolute;top:20px;left:100px;color:#ff00ff;display:block !important;z-index:999999;");
        }
        attachVisibilityEvent(this);
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
                this.dcCounter.textContent = totalPlayers + " DC";
            }
        },
        renderScene : function(scene, camera) {
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
                    that.updateTimers(data);
                    if (this.config.profiling) {
                        console.time("update");
                    }
                    this.update(data);
                    if (this.config.profiling) {
                        console.timeEnd("update");
                    }
                    this.render(data);
                    if (!this.started) {
                        /** @type {boolean} */
                        this.started = true;
                    }
                    if (this.config.fps) {
                        this.fpsCounter.update(data, function(pctg) {
                            /** @type {string} */
                            this.counter.textContent = pctg + " FPS";
                        }.bind(this));
                    }
                }
            };
        }(),
        start : function() {
            this.doUpdate();
        },
        pause : function() {
            if (!this.paused) {
                this.clock.stop();
                /** @type {boolean} */
                this.paused = true;
                if (this.config.fps) {
                    this.counter.textContent += " (paused)";
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
    init.mixin(a);
    /** @type {function(!Object): undefined} */
    def.exports = init;
}