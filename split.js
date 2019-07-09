var s = {
    1 : [function(context, def, n) {
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
    }, {
        2 : 2,
        3 : 3,
        6 : 6
    }],
    2 : [function(canCreateDiscussions, module, n) {
        /**
         * @return {undefined}
         */
        var Stats = function() {
            /** @type {number} */
            this.frames = 0;
            /** @type {number} */
            this.fps = 0;
            /** @type {number} */
            this.lastTime = 0;
        };
        Stats.prototype = {
            update : function(time, f) {
                /** @type {number} */
                time = 1E3 * time.elapsed;
                this.frames++;
                if (time > this.lastTime + 1E3) {
                    /** @type {number} */
                    this.fps = Math.round(1E3 * this.frames / (time - this.lastTime));
                    f(this.fps);
                    /** @type {number} */
                    this.lastTime = time;
                    /** @type {number} */
                    this.frames = 0;
                }
            }
        };
        /** @type {function(): undefined} */
        module.exports = Stats;
    }, {}],
    3 : [function(canCreateDiscussions, module, n) {
        var Events = {
            on : function(type, callback, context) {
                if (!eventsApi(this, "on", type, [callback, context]) || !callback) {
                    return this;
                }
                if (!this._events) {
                    this._events = {};
                }
                var handlers = this._events[type] || (this._events[type] = []);
                return handlers.push({
                    callback : callback,
                    context : context,
                    ctx : context || this
                }), this;
            },
            once : function(type, callback, context) {
                if (!eventsApi(this, "once", type, [callback, context]) || !callback) {
                    return this;
                }
                var self = this;
                var onceListener = _.once(function() {
                    self.off(type, onceListener);
                    callback.apply(this, arguments);
                });
                return onceListener._callback = callback, this.on(type, onceListener, context);
            },
            off : function(name, callback, context) {
                var listeners;
                var handler;
                var _ref2;
                var names;
                var j;
                var i;
                var _k;
                var _len2;
                if (!this._events || !eventsApi(this, "off", name, [callback, context])) {
                    return this;
                }
                if (!name && !callback && !context) {
                    return this._events = void 0, this;
                }
                names = name ? [name] : _.keys(this._events);
                /** @type {number} */
                j = 0;
                i = names.length;
                for (; j < i; j++) {
                    if (name = names[j], _ref2 = this._events[name]) {
                        if (this._events[name] = listeners = [], callback || context) {
                            /** @type {number} */
                            _k = 0;
                            _len2 = _ref2.length;
                            for (; _k < _len2; _k++) {
                                handler = _ref2[_k];
                                if (callback && callback !== handler.callback && callback !== handler.callback._callback || context && context !== handler.context) {
                                    listeners.push(handler);
                                }
                            }
                        }
                        if (!listeners.length) {
                            delete this._events[name];
                        }
                    }
                }
                return this;
            },
            trigger : function(type) {
                if (!this._events) {
                    return this;
                }
                /** @type {!Array<?>} */
                var args = slice.call(arguments, 1);
                if (!eventsApi(this, "trigger", type, args)) {
                    return this;
                }
                var obj = this._events[type];
                var fn = this._events.all;
                return obj && check(obj, args), fn && check(fn, arguments), this;
            },
            stopListening : function(obj, name, callback) {
                var listeningTo = this._listeningTo;
                if (!listeningTo) {
                    return this;
                }
                /** @type {boolean} */
                var i = !name && !callback;
                if (!(callback || "object" != typeof name)) {
                    callback = this;
                }
                if (obj) {
                    /** @type {!Object} */
                    (listeningTo = {})[obj._listenId] = obj;
                }
                var id;
                for (id in listeningTo) {
                    obj = listeningTo[id];
                    obj.off(name, callback, this);
                    if (i || _.isEmpty(obj._events)) {
                        delete this._listeningTo[id];
                    }
                }
                return this;
            }
        };
        /** @type {!RegExp} */
        var i = /\s+/;
        /** @type {!Array} */
        var prototypeOfArray = [];
        /** @type {function(this:(IArrayLike<T>|string), *=, *=): !Array<T>} */
        var slice = prototypeOfArray.slice;
        /**
         * @param {!Object} obj
         * @param {string} action
         * @param {string} name
         * @param {!Array} rest
         * @return {?}
         */
        var eventsApi = function(obj, action, name, rest) {
            if (!name) {
                return true;
            }
            if ("object" == typeof name) {
                var template;
                for (template in name) {
                    obj[action].apply(obj, [template, name[template]].concat(rest));
                }
                return false;
            }
            if (i.test(name)) {
                var a = name.split(i);
                /** @type {number} */
                var j = 0;
                var startLen = a.length;
                for (; j < startLen; j++) {
                    obj[action].apply(obj, [a[j]].concat(rest));
                }
                return false;
            }
            return true;
        };
        /**
         * @param {!NodeList} f
         * @param {!Array} a
         * @return {undefined}
         */
        var check = function(f, a) {
            var self;
            /** @type {number} */
            var j = -1;
            var m = f.length;
            var i = a[0];
            var ac = a[1];
            var c2 = a[2];
            switch(a.length) {
                case 0:
                    for (; ++j < m;) {
                        (self = f[j]).callback.call(self.ctx);
                    }
                    return;
                case 1:
                    for (; ++j < m;) {
                        (self = f[j]).callback.call(self.ctx, i);
                    }
                    return;
                case 2:
                    for (; ++j < m;) {
                        (self = f[j]).callback.call(self.ctx, i, ac);
                    }
                    return;
                case 3:
                    for (; ++j < m;) {
                        (self = f[j]).callback.call(self.ctx, i, ac, c2);
                    }
                    return;
                default:
                    for (; ++j < m;) {
                        (self = f[j]).callback.apply(self.ctx, a);
                    }
                    return;
            }
        };
        var collection = {
            listenTo : "on",
            listenToOnce : "once"
        };
        _.each(collection, function(implementation, method) {
            /**
             * @param {!NodeList} obj
             * @param {?} name
             * @param {!Object} callback
             * @return {?}
             */
            Events[method] = function(obj, name, callback) {
                var listeningTo = this._listeningTo || (this._listeningTo = {});
                var id = obj._listenId || (obj._listenId = _.uniqueId("l"));
                return listeningTo[id] = obj, callback || "object" != typeof name || (callback = this), obj[implementation](name, callback, this), this;
            };
        });
        module.exports = Events;
    }, {}],
    4 : [function(canCreateDiscussions, module, n) {
        var console = {};
        /**
         * @param {undefined} message
         * @param {undefined} callback
         * @return {?}
         */
        console.CreateWhiteTexture = function(message, callback) {
            var request = console.CreateDataTexture(message, callback);
            /** @type {number} */
            var i = 0;
            for (; i < request.image.data.length; i++) {
                /** @type {number} */
                request.image.data[i] = 255;
            }
            return request;
        };
        /**
         * @param {undefined} s
         * @param {undefined} e
         * @return {?}
         */
        console.CreateBlackTexture = function(s, e) {
            var div = console.CreateDataTexture(s, e);
            /** @type {number} */
            var i = 0;
            for (; i < div.image.data.length; i++) {
                /** @type {number} */
                div.image.data[i] = 0;
            }
            return div;
        };
        /**
         * @param {undefined} s
         * @param {undefined} e
         * @return {?}
         */
        console.CreateNormalTexture = function(s, e) {
            var div = console.CreateDataTexture(s, e);
            /** @type {number} */
            var i = 0;
            for (; i < div.image.data.length; i = i + 3) {
                /** @type {number} */
                div.image.data[i] = 128;
                /** @type {number} */
                div.image.data[i + 1] = 128;
                /** @type {number} */
                div.image.data[i + 2] = 255;
            }
            return div;
        };
        /**
         * @param {number} size
         * @param {number} width
         * @return {?}
         */
        console.CreateDataTexture = function(size, width) {
            if (void 0 === size) {
                /** @type {number} */
                size = 4;
            }
            if (void 0 === width) {
                /** @type {number} */
                width = 4;
            }
            /** @type {number} */
            var calculated_mac = size * width * 3;
            /** @type {!Uint8Array} */
            var a = new Uint8Array(calculated_mac);
            var texture = new THREE.DataTexture(a, size, width, THREE.RGBFormat);
            return texture.needsUpdate = true, texture;
        };
        module.exports = console;
    }, {}],
    5 : [function(canCreateDiscussions, module, n) {
        /**
         * @param {!Object} options
         * @return {undefined}
         */
        var $ = function(options) {
            options = _.extend({}, {
                duration : 1E3,
                repeat : false,
                onStart : function() {
                },
                onEnd : function() {
                }
            }, options);
            this.duration = options.duration;
            this.repeat = options.repeat;
            this.startCallback = options.onStart;
            this.endCallback = options.onEnd;
            this.reset();
        };
        $.inherit(Object, {
            reset : function() {
                return this.started = false, this.paused = false, this.ended = false, this.elapsedTime = 0, this;
            },
            start : function() {
                return this.started || this.ended ? this : (this.started = true, this.startCallback(), this);
            },
            stop : function() {
                return this.started ? this.reset() : this;
            },
            pause : function() {
                return this.paused = true, this;
            },
            resume : function() {
                return this.paused = false, this;
            },
            update : function(prop) {
                return !this.started || this.paused || this.ended ? this : (this.elapsedTime += 1E3 * prop.delta, this.elapsedTime > this.duration && (this.endCallback(), this.ended = true), this);
            }
        });
        /** @type {function(!Object): undefined} */
        module.exports = $;
    }, {}],
    6 : [function(require, module, n) {
        var TimeoutError = require("5");
        var self = {
            _timers : {}
        };
        /**
         * @param {?} timeout
         * @return {?}
         */
        self.createTimer = function(timeout) {
            var i = _.uniqueId("timer_");
            var e = new TimeoutError(timeout);
            return e.id = i, self._timers[i] = e, e;
        };
        /**
         * @param {!Function} dt
         * @param {!Function} n
         * @param {?} o
         * @return {?}
         */
        self.delay = function(dt, n, o) {
            var m = self.createTimer({
                duration : dt,
                onEnd : function() {
                    n.call(o);
                    delete self._timers[this.id];
                }
            }).start();
            return m;
        };
        /**
         * @param {undefined} object
         * @return {undefined}
         */
        self.updateTimers = function(object) {
            _.each(self._timers, function(e) {
                e.update(object);
            });
        };
        /**
         * @return {undefined}
         */
        self.clearTimers = function() {
            _.each(self._timers, function(options) {
                /** @type {null} */
                options.onEnd = null;
            });
            self._timers = {};
        };
        module.exports = self;
    }, {
        5 : 5
    }],
    7 : [function(canCreateDiscussions, mixin, n) {
        !function() {
            /**
             * @param {!Object} object
             * @return {undefined}
             */
            function OrbitConstraint(object) {
                /** @type {!Object} */
                this.object = object;
                this.target = new THREE.Vector3;
                /** @type {number} */
                this.minDistance = 0;
                /** @type {number} */
                this.maxDistance = 1 / 0;
                /** @type {number} */
                this.minZoom = 0;
                /** @type {number} */
                this.maxZoom = 1 / 0;
                /** @type {number} */
                this.minPolarAngle = 0;
                /** @type {number} */
                this.maxPolarAngle = Math.PI;
                /** @type {number} */
                this.minAzimuthAngle = -(1 / 0);
                /** @type {number} */
                this.maxAzimuthAngle = 1 / 0;
                /** @type {boolean} */
                this.enableDamping = false;
                /** @type {number} */
                this.dampingFactor = .25;
                var theta;
                var phi;
                var scope = this;
                /** @type {number} */
                var EPS = 1E-6;
                /** @type {number} */
                var phiDelta = 0;
                /** @type {number} */
                var thetaDelta = 0;
                /** @type {number} */
                var scale = 1;
                var view = new THREE.Vector3;
                /** @type {boolean} */
                var zoomChanged = false;
                /**
                 * @return {?}
                 */
                this.getPolarAngle = function() {
                    return phi;
                };
                /**
                 * @return {?}
                 */
                this.getAzimuthalAngle = function() {
                    return theta;
                };
                /**
                 * @param {number} angle
                 * @return {undefined}
                 */
                this.rotateLeft = function(angle) {
                    /** @type {number} */
                    thetaDelta = thetaDelta - angle;
                };
                /**
                 * @param {number} angle
                 * @return {undefined}
                 */
                this.rotateUp = function(angle) {
                    /** @type {number} */
                    phiDelta = phiDelta - angle;
                };
                this.panLeft = function() {
                    var t = new THREE.Vector3;
                    return function(size) {
                        var values = this.object.matrix.elements;
                        t.set(values[0], values[1], values[2]);
                        t.multiplyScalar(-size);
                        view.add(t);
                    };
                }();
                this.panUp = function() {
                    var t = new THREE.Vector3;
                    return function(u) {
                        var values = this.object.matrix.elements;
                        t.set(values[4], values[5], values[6]);
                        t.multiplyScalar(u);
                        view.add(t);
                    };
                }();
                /**
                 * @param {number} deltaX
                 * @param {number} deltaY
                 * @param {number} screenWidth
                 * @param {number} screenHeight
                 * @return {undefined}
                 */
                this.pan = function(deltaX, deltaY, screenWidth, screenHeight) {
                    if (scope.object instanceof THREE.PerspectiveCamera) {
                        var oldPosition = scope.object.position;
                        var expRecords = oldPosition.clone().sub(scope.target);
                        var targetDistance = expRecords.length();
                        /** @type {number} */
                        targetDistance = targetDistance * Math.tan(scope.object.fov / 2 * Math.PI / 180);
                        scope.panLeft(2 * deltaX * targetDistance / screenHeight);
                        scope.panUp(2 * deltaY * targetDistance / screenHeight);
                    } else {
                        if (scope.object instanceof THREE.OrthographicCamera) {
                            scope.panLeft(deltaX * (scope.object.right - scope.object.left) / screenWidth);
                            scope.panUp(deltaY * (scope.object.top - scope.object.bottom) / screenHeight);
                        } else {
                            console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.");
                        }
                    }
                };
                /**
                 * @param {?} dollyScale
                 * @return {undefined}
                 */
                this.dollyIn = function(dollyScale) {
                    if (scope.object instanceof THREE.PerspectiveCamera) {
                        /** @type {number} */
                        scale = scale / dollyScale;
                    } else {
                        if (scope.object instanceof THREE.OrthographicCamera) {
                            /** @type {number} */
                            scope.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom * dollyScale));
                            scope.object.updateProjectionMatrix();
                            /** @type {boolean} */
                            zoomChanged = true;
                        } else {
                            console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.");
                        }
                    }
                };
                /**
                 * @param {?} dollyScale
                 * @return {undefined}
                 */
                this.dollyOut = function(dollyScale) {
                    if (scope.object instanceof THREE.PerspectiveCamera) {
                        /** @type {number} */
                        scale = scale * dollyScale;
                    } else {
                        if (scope.object instanceof THREE.OrthographicCamera) {
                            /** @type {number} */
                            scope.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / dollyScale));
                            scope.object.updateProjectionMatrix();
                            /** @type {boolean} */
                            zoomChanged = true;
                        } else {
                            console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.");
                        }
                    }
                };
                this.update = function() {
                    var offset = new THREE.Vector3;
                    var quat = (new THREE.Quaternion).setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
                    var quatInverse = quat.clone().inverse();
                    var lastPosition = new THREE.Vector3;
                    var lastQuaternion = new THREE.Quaternion;
                    return function() {
                        var position = this.object.position;
                        offset.copy(position).sub(this.target);
                        offset.applyQuaternion(quat);
                        /** @type {number} */
                        theta = Math.atan2(offset.x, offset.z);
                        /** @type {number} */
                        phi = Math.atan2(Math.sqrt(offset.x * offset.x + offset.z * offset.z), offset.y);
                        theta = theta + thetaDelta;
                        phi = phi + phiDelta;
                        /** @type {number} */
                        this.object.theta = theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, theta));
                        /** @type {number} */
                        phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, phi));
                        /** @type {number} */
                        this.object.phi = phi = Math.max(EPS, Math.min(Math.PI - EPS, phi));
                        /** @type {number} */
                        var radius = offset.length() * scale;
                        return radius = Math.max(this.minDistance, Math.min(this.maxDistance, radius)), this.target.add(view), offset.x = radius * Math.sin(phi) * Math.sin(theta), offset.y = radius * Math.cos(phi), offset.z = radius * Math.sin(phi) * Math.cos(theta), offset.applyQuaternion(quatInverse), position.copy(this.target).add(offset), this.object.lookAt(this.target), this.enableDamping === true ? (thetaDelta = thetaDelta * (1 - this.dampingFactor), phiDelta = phiDelta * (1 - this.dampingFactor)) : (thetaDelta =
                            0, phiDelta = 0), scale = 1, view.set(0, 0, 0), !!(zoomChanged || lastPosition.distanceToSquared(this.object.position) > EPS || 8 * (1 - lastQuaternion.dot(this.object.quaternion)) > EPS) && (lastPosition.copy(this.object.position), lastQuaternion.copy(this.object.quaternion), zoomChanged = false, true);
                    };
                }();
            }
            /**
             * @param {!Event} event
             * @return {?}
             */
            function withinClickDistance(event) {
                /** @type {boolean} */
                var e = event.clientX == end && event.clientY == begin;
                return end = event.clientX, begin = event.clientY, e;
            }
            var end;
            var begin;
            /**
             * @param {!Function} object
             * @param {!Object} options
             * @return {undefined}
             */
            var OrbitControls = function(object, options) {
                /**
                 * @param {number} deltaX
                 * @param {number} deltaY
                 * @return {undefined}
                 */
                function pan(deltaX, deltaY) {
                    var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
                    constraint.pan(deltaX, deltaY, element.clientWidth, element.clientHeight);
                }
                /**
                 * @return {?}
                 */
                function getAutoRotationAngle() {
                    return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
                }
                /**
                 * @return {?}
                 */
                function getZoomScale() {
                    return Math.pow(.95, scope.zoomSpeed);
                }
                /**
                 * @param {!Event} event
                 * @return {undefined}
                 */
                function onMouseDown(event) {
                    if (scope.enabled !== false) {
                        if (end = event.clientX, begin = event.clientY, event.preventDefault(), event.button === scope.mouseButtons.ORBIT) {
                            if (scope.enableRotate === false) {
                                return;
                            }
                            /** @type {number} */
                            state = STATE.ROTATE;
                            rotateStart.set(event.clientX, event.clientY);
                        } else {
                            if (event.button === scope.mouseButtons.ZOOM) {
                                if (scope.enableZoom === false) {
                                    return;
                                }
                                /** @type {number} */
                                state = STATE.DOLLY;
                                b.set(event.clientX, event.clientY);
                            } else {
                                if (event.button === scope.mouseButtons.PAN) {
                                    if (scope.enablePan === false) {
                                        return;
                                    }
                                    /** @type {number} */
                                    state = STATE.PAN;
                                    panStart.set(event.clientX, event.clientY);
                                }
                            }
                        }
                        if (state !== STATE.NONE) {
                            document.addEventListener("mousemove", onMouseMove, false);
                            document.addEventListener("mouseup", onMouseUp, false);
                            scope.dispatchEvent(objectChangeEvent);
                        }
                        scope.onMouseDown();
                    }
                }
                /**
                 * @param {!Event} event
                 * @return {undefined}
                 */
                function onMouseMove(event) {
                    if (scope.enabled !== false && !withinClickDistance(event)) {
                        event.preventDefault();
                        var htmlElt = scope.domElement === document ? scope.domElement.body : scope.domElement;
                        if (state === STATE.ROTATE) {
                            if (scope.enableRotate === false) {
                                return;
                            }
                            /** @type {boolean} */
                            scope.isRotating = true;
                            rotateEnd.set(event.clientX, event.clientY);
                            rotateDelta.subVectors(rotateEnd, rotateStart);
                            constraint.rotateLeft(2 * Math.PI * rotateDelta.x / htmlElt.clientWidth * scope.rotateSpeed);
                            constraint.rotateUp(2 * Math.PI * rotateDelta.y / htmlElt.clientHeight * scope.rotateSpeed);
                            rotateStart.copy(rotateEnd);
                        } else {
                            if (state === STATE.DOLLY) {
                                if (scope.enableZoom === false) {
                                    return;
                                }
                                target.set(event.clientX, event.clientY);
                                result.subVectors(target, b);
                                if (result.y > 0) {
                                    constraint.dollyIn(getZoomScale());
                                } else {
                                    if (result.y < 0) {
                                        constraint.dollyOut(getZoomScale());
                                    }
                                }
                                b.copy(target);
                            } else {
                                if (state === STATE.PAN) {
                                    if (scope.enablePan === false) {
                                        return;
                                    }
                                    panEnd.set(event.clientX, event.clientY);
                                    panDelta.subVectors(panEnd, panStart);
                                    pan(panDelta.x, panDelta.y);
                                    panStart.copy(panEnd);
                                }
                            }
                        }
                        if (state !== STATE.NONE) {
                            scope.update();
                        }
                        scope.onMouseMove();
                    }
                }
                /**
                 * @return {undefined}
                 */
                function onMouseUp() {
                    if (scope.enabled !== false) {
                        document.removeEventListener("mousemove", onMouseMove, false);
                        document.removeEventListener("mouseup", onMouseUp, false);
                        scope.dispatchEvent(fooEvent);
                        /** @type {number} */
                        state = STATE.NONE;
                        /** @type {boolean} */
                        scope.isRotating = false;
                        scope.onMouseUp();
                    }
                }
                /**
                 * @param {!Event} event
                 * @return {undefined}
                 */
                function onMouseWheel(event) {
                    if (scope.enabled !== false && scope.enableZoom !== false && state === STATE.NONE) {
                        event.preventDefault();
                        event.stopPropagation();
                        /** @type {number} */
                        var delta = 0;
                        if (void 0 !== event.wheelDelta) {
                            delta = event.wheelDelta;
                        } else {
                            if (void 0 !== event.detail) {
                                /** @type {number} */
                                delta = -event.detail;
                            }
                        }
                        if (delta > 0) {
                            constraint.dollyOut(getZoomScale());
                        } else {
                            if (delta < 0) {
                                constraint.dollyIn(getZoomScale());
                            }
                        }
                        scope.update();
                        scope.dispatchEvent(objectChangeEvent);
                        scope.dispatchEvent(fooEvent);
                    }
                }
                /**
                 * @param {!Event} event
                 * @return {undefined}
                 */
                function onKeyDown(event) {
                    if (scope.enabled !== false && scope.enableKeys !== false && scope.enablePan !== false) {
                        switch(event.keyCode) {
                            case scope.keys.UP:
                                pan(0, scope.keyPanSpeed);
                                scope.update();
                                break;
                            case scope.keys.BOTTOM:
                                pan(0, -scope.keyPanSpeed);
                                scope.update();
                                break;
                            case scope.keys.LEFT:
                                pan(scope.keyPanSpeed, 0);
                                scope.update();
                                break;
                            case scope.keys.RIGHT:
                                pan(-scope.keyPanSpeed, 0);
                                scope.update();
                        }
                    }
                }
                /**
                 * @param {!Event} event
                 * @return {undefined}
                 */
                function touchstart(event) {
                    if (scope.enabled !== false) {
                        switch(event.touches.length) {
                            case 1:
                                if (scope.enableRotate === false) {
                                    return;
                                }
                                /** @type {number} */
                                state = STATE.TOUCH_ROTATE;
                                rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
                                break;
                            case 2:
                                if (scope.enableZoom === false) {
                                    return;
                                }
                                /** @type {number} */
                                state = STATE.TOUCH_DOLLY;
                                /** @type {number} */
                                var lightI = event.touches[0].pageX - event.touches[1].pageX;
                                /** @type {number} */
                                var lightJ = event.touches[0].pageY - event.touches[1].pageY;
                                /** @type {number} */
                                var cos = Math.sqrt(lightI * lightI + lightJ * lightJ);
                                b.set(0, cos);
                                break;
                            case 3:
                                if (scope.enablePan === false) {
                                    return;
                                }
                                /** @type {number} */
                                state = STATE.TOUCH_PAN;
                                panStart.set(event.touches[0].pageX, event.touches[0].pageY);
                                break;
                            default:
                                /** @type {number} */
                                state = STATE.NONE;
                        }
                        if (state !== STATE.NONE) {
                            scope.dispatchEvent(objectChangeEvent);
                        }
                    }
                }
                /**
                 * @param {!Event} event
                 * @return {undefined}
                 */
                function touchmove(event) {
                    if (scope.enabled !== false) {
                        event.preventDefault();
                        event.stopPropagation();
                        var htmlElt = scope.domElement === document ? scope.domElement.body : scope.domElement;
                        switch(event.touches.length) {
                            case 1:
                                if (scope.enableRotate === false) {
                                    return;
                                }
                                if (state !== STATE.TOUCH_ROTATE) {
                                    return;
                                }
                                /** @type {boolean} */
                                scope.isRotating = true;
                                rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
                                rotateDelta.subVectors(rotateEnd, rotateStart);
                                constraint.rotateLeft(2 * Math.PI * rotateDelta.x / htmlElt.clientWidth * scope.rotateSpeed);
                                constraint.rotateUp(2 * Math.PI * rotateDelta.y / htmlElt.clientHeight * scope.rotateSpeed);
                                rotateStart.copy(rotateEnd);
                                scope.update();
                                break;
                            case 2:
                                if (scope.enableZoom === false) {
                                    return;
                                }
                                if (state !== STATE.TOUCH_DOLLY) {
                                    return;
                                }
                                /** @type {number} */
                                var lightI = event.touches[0].pageX - event.touches[1].pageX;
                                /** @type {number} */
                                var lightJ = event.touches[0].pageY - event.touches[1].pageY;
                                /** @type {number} */
                                var y = Math.sqrt(lightI * lightI + lightJ * lightJ);
                                target.set(0, y);
                                result.subVectors(target, b);
                                if (result.y > 0) {
                                    constraint.dollyOut(getZoomScale());
                                } else {
                                    if (result.y < 0) {
                                        constraint.dollyIn(getZoomScale());
                                    }
                                }
                                b.copy(target);
                                scope.update();
                                break;
                            case 3:
                                if (scope.enablePan === false) {
                                    return;
                                }
                                if (state !== STATE.TOUCH_PAN) {
                                    return;
                                }
                                panEnd.set(event.touches[0].pageX, event.touches[0].pageY);
                                panDelta.subVectors(panEnd, panStart);
                                pan(panDelta.x, panDelta.y);
                                panStart.copy(panEnd);
                                scope.update();
                                break;
                            default:
                                /** @type {number} */
                                state = STATE.NONE;
                        }
                    }
                }
                /**
                 * @return {undefined}
                 */
                function touchend() {
                    if (scope.enabled !== false) {
                        scope.dispatchEvent(fooEvent);
                        /** @type {number} */
                        state = STATE.NONE;
                        /** @type {boolean} */
                        scope.isRotating = false;
                    }
                }
                /**
                 * @param {!Event} event
                 * @return {undefined}
                 */
                function contextmenu(event) {
                    event.preventDefault();
                }
                var constraint = new OrbitConstraint(object);
                this.domElement = void 0 !== options ? options : document;
                Object.defineProperty(this, "constraint", {
                    get : function() {
                        return constraint;
                    }
                });
                /**
                 * @return {?}
                 */
                this.getPolarAngle = function() {
                    return constraint.getPolarAngle();
                };
                /**
                 * @return {?}
                 */
                this.getAzimuthalAngle = function() {
                    return constraint.getAzimuthalAngle();
                };
                /** @type {boolean} */
                this.enabled = true;
                this.center = this.target;
                /** @type {boolean} */
                this.enableZoom = true;
                /** @type {number} */
                this.zoomSpeed = 1;
                /** @type {boolean} */
                this.enableRotate = true;
                /** @type {number} */
                this.rotateSpeed = 1;
                /** @type {boolean} */
                this.enablePan = true;
                /** @type {number} */
                this.keyPanSpeed = 7;
                /** @type {boolean} */
                this.autoRotate = false;
                /** @type {number} */
                this.autoRotateSpeed = 2;
                /** @type {boolean} */
                this.enableKeys = true;
                this.keys = {
                    LEFT : 37,
                    UP : 38,
                    RIGHT : 39,
                    BOTTOM : 40
                };
                this.mouseButtons = {
                    ORBIT : THREE.MOUSE.LEFT,
                    ZOOM : THREE.MOUSE.MIDDLE,
                    PAN : THREE.MOUSE.RIGHT
                };
                var scope = this;
                var rotateStart = new THREE.Vector2;
                var rotateEnd = new THREE.Vector2;
                var rotateDelta = new THREE.Vector2;
                var panStart = new THREE.Vector2;
                var panEnd = new THREE.Vector2;
                var panDelta = new THREE.Vector2;
                var b = new THREE.Vector2;
                var target = new THREE.Vector2;
                var result = new THREE.Vector2;
                var STATE = {
                    NONE : -1,
                    ROTATE : 0,
                    DOLLY : 1,
                    PAN : 2,
                    TOUCH_ROTATE : 3,
                    TOUCH_DOLLY : 4,
                    TOUCH_PAN : 5
                };
                /** @type {number} */
                var state = STATE.NONE;
                this.target0 = this.target.clone();
                this.position0 = this.object.position.clone();
                this.zoom0 = this.object.zoom;
                var modelChangedEvent = {
                    type : "change"
                };
                var objectChangeEvent = {
                    type : "start"
                };
                var fooEvent = {
                    type : "end"
                };
                /**
                 * @return {undefined}
                 */
                this.update = function() {
                    if (this.autoRotate && state === STATE.NONE) {
                        constraint.rotateLeft(getAutoRotationAngle());
                    }
                    if (constraint.update() === true) {
                        this.dispatchEvent(modelChangedEvent);
                    }
                };
                /**
                 * @return {undefined}
                 */
                this.reset = function() {
                    /** @type {number} */
                    state = STATE.NONE;
                    this.target.copy(this.target0);
                    this.object.position.copy(this.position0);
                    this.object.zoom = this.zoom0;
                    this.object.updateProjectionMatrix();
                    this.dispatchEvent(modelChangedEvent);
                    this.update();
                };
                /**
                 * @return {undefined}
                 */
                this.dispose = function() {
                    this.domElement.removeEventListener("contextmenu", contextmenu, false);
                    this.domElement.removeEventListener("mousedown", onMouseDown, false);
                    this.domElement.removeEventListener("mousewheel", onMouseWheel, false);
                    this.domElement.removeEventListener("MozMousePixelScroll", onMouseWheel, false);
                    this.domElement.removeEventListener("touchstart", touchstart, false);
                    this.domElement.removeEventListener("touchend", touchend, false);
                    this.domElement.removeEventListener("touchmove", touchmove, false);
                    document.removeEventListener("mousemove", onMouseMove, false);
                    document.removeEventListener("mouseup", onMouseUp, false);
                    window.removeEventListener("keydown", onKeyDown, false);
                };
                this.domElement.addEventListener("contextmenu", contextmenu, false);
                this.domElement.addEventListener("mousedown", onMouseDown, false);
                this.domElement.addEventListener("mousewheel", onMouseWheel, false);
                this.domElement.addEventListener("MozMousePixelScroll", onMouseWheel, false);
                this.domElement.addEventListener("touchstart", touchstart, false);
                this.domElement.addEventListener("touchend", touchend, false);
                this.domElement.addEventListener("touchmove", touchmove, false);
                window.addEventListener("keydown", onKeyDown, false);
                this.update();
            };
            /** @type {!Object} */
            OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
            /** @type {function(!Function, !Object): undefined} */
            OrbitControls.prototype.constructor = OrbitControls;
            /**
             * @return {undefined}
             */
            OrbitControls.prototype.onMouseDown = function() {
            };
            /**
             * @return {undefined}
             */
            OrbitControls.prototype.onMouseMove = function() {
            };
            /**
             * @return {undefined}
             */
            OrbitControls.prototype.onMouseUp = function() {
            };
            Object.defineProperties(OrbitControls.prototype, {
                object : {
                    get : function() {
                        return this.constraint.object;
                    }
                },
                target : {
                    get : function() {
                        return this.constraint.target;
                    },
                    set : function(result) {
                        console.warn("OrbitControls: target is now immutable. Use target.set() instead.");
                        this.constraint.target.copy(result);
                    }
                },
                minDistance : {
                    get : function() {
                        return this.constraint.minDistance;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.minDistance = value;
                    }
                },
                maxDistance : {
                    get : function() {
                        return this.constraint.maxDistance;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.maxDistance = value;
                    }
                },
                minZoom : {
                    get : function() {
                        return this.constraint.minZoom;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.minZoom = value;
                    }
                },
                maxZoom : {
                    get : function() {
                        return this.constraint.maxZoom;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.maxZoom = value;
                    }
                },
                minPolarAngle : {
                    get : function() {
                        return this.constraint.minPolarAngle;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.minPolarAngle = value;
                    }
                },
                maxPolarAngle : {
                    get : function() {
                        return this.constraint.maxPolarAngle;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.maxPolarAngle = value;
                    }
                },
                minAzimuthAngle : {
                    get : function() {
                        return this.constraint.minAzimuthAngle;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.minAzimuthAngle = value;
                    }
                },
                maxAzimuthAngle : {
                    get : function() {
                        return this.constraint.maxAzimuthAngle;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.maxAzimuthAngle = value;
                    }
                },
                enableDamping : {
                    get : function() {
                        return this.constraint.enableDamping;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.enableDamping = value;
                    }
                },
                dampingFactor : {
                    get : function() {
                        return this.constraint.dampingFactor;
                    },
                    set : function(value) {
                        /** @type {number} */
                        this.constraint.dampingFactor = value;
                    }
                },
                noZoom : {
                    get : function() {
                        return console.warn("OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."), !this.enableZoom;
                    },
                    set : function(value) {
                        console.warn("OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.");
                        /** @type {boolean} */
                        this.enableZoom = !value;
                    }
                },
                noRotate : {
                    get : function() {
                        return console.warn("OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."), !this.enableRotate;
                    },
                    set : function(value) {
                        console.warn("OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.");
                        /** @type {boolean} */
                        this.enableRotate = !value;
                    }
                },
                noPan : {
                    get : function() {
                        return console.warn("OrbitControls: .noPan has been deprecated. Use .enablePan instead."), !this.enablePan;
                    },
                    set : function(value) {
                        console.warn("OrbitControls: .noPan has been deprecated. Use .enablePan instead.");
                        /** @type {boolean} */
                        this.enablePan = !value;
                    }
                },
                noKeys : {
                    get : function() {
                        return console.warn("OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."), !this.enableKeys;
                    },
                    set : function(value) {
                        console.warn("OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.");
                        /** @type {boolean} */
                        this.enableKeys = !value;
                    }
                },
                staticMoving : {
                    get : function() {
                        return console.warn("OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."), !this.constraint.enableDamping;
                    },
                    set : function(value) {
                        console.warn("OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.");
                        /** @type {boolean} */
                        this.constraint.enableDamping = !value;
                    }
                },
                dynamicDampingFactor : {
                    get : function() {
                        return console.warn("OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."), this.constraint.dampingFactor;
                    },
                    set : function(value) {
                        console.warn("OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.");
                        /** @type {number} */
                        this.constraint.dampingFactor = value;
                    }
                }
            });
            /** @type {function(!Function, !Object): undefined} */
            mixin.exports = OrbitControls;
        }();
    }, {}],
    8 : [function(canCreateDiscussions, context, n) {
        /**
         * @param {!Object} obj
         * @return {undefined}
         */
        var init = function(obj) {
            obj = _.extend({
                size : 100,
                step : 10,
                color : 0,
                opacity : .2
            }, obj);
            var lineGeometry = new THREE.Geometry;
            var size = obj.size;
            /** @type {number} */
            var i = -size;
            for (; i <= size; i = i + obj.step) {
                lineGeometry.vertices.push(new THREE.Vector3(-size, 0, i));
                lineGeometry.vertices.push(new THREE.Vector3(size, 0, i));
                lineGeometry.vertices.push(new THREE.Vector3(i, 0, -size));
                lineGeometry.vertices.push(new THREE.Vector3(i, 0, size));
            }
            var throw42 = new THREE.LineBasicMaterial({
                color : obj.color,
                opacity : obj.opacity,
                transparent : true
            });
            THREE.LineSegments.call(this, lineGeometry, throw42);
        };
        init.inherit(THREE.LineSegments);
        /** @type {function(!Object): undefined} */
        context.exports = init;
    }, {}],
    9 : [function(canCreateDiscussions, module, n) {
        /**
         * @param {number} t
         * @param {?} data
         * @param {?} array
         * @return {undefined}
         */
        function findErrorByList(t, data, array) {
            /** @type {number} */
            var d = t * t;
            /** @type {number} */
            var x = 2 * t * t;
            /** @type {number} */
            var index = 3 * t * t;
            /** @type {number} */
            var item = 0;
            /** @type {number} */
            var i = 0;
            for (; i < d; i++) {
                array[item++] = data[i];
                array[item++] = data[i + d];
                array[item++] = data[i + x];
                array[item++] = data[i + index];
            }
        }
        /**
         * @param {number} options
         * @param {boolean} value
         * @param {string} manager
         * @return {undefined}
         */
        var MTLLoader = function(options, value, manager) {
            this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
            /** @type {number} */
            this._size = options;
            /** @type {boolean} */
            this._interleaved = value;
        };
        /** @type {!Object} */
        MTLLoader.prototype = Object.create(THREE.CompressedTextureLoader.prototype);
        /**
         * @param {!ArrayBuffer} buffer
         * @return {?}
         */
        MTLLoader.prototype._parser = function(buffer) {
            /** @type {!Array} */
            var e = [];
            /** @type {number} */
            var order = Math.log2(this._size);
            /** @type {number} */
            var dataOffset = 0;
            /** @type {number} */
            var i = 0;
            for (; i <= order; i++) {
                /** @type {number} */
                var r = Math.pow(2, order - i);
                /** @type {number} */
                var dataLength = r * r * 4;
                if (dataOffset >= buffer.byteLength) {
                    break;
                }
                /** @type {number} */
                var startKey = 0;
                for (; startKey < 6; startKey++) {
                    if (e[startKey] || (e[startKey] = []), this._interleaved) {
                        /** @type {!Uint8Array} */
                        var srcBuffer = new Uint8Array(buffer, dataOffset, dataLength);
                        /** @type {!Uint8Array} */
                        var byteArray = new Uint8Array(dataLength);
                        findErrorByList(r, srcBuffer, byteArray);
                    } else {
                        /** @type {!Uint8Array} */
                        byteArray = new Uint8Array(buffer, dataOffset, dataLength);
                    }
                    e[startKey].push({
                        data : byteArray,
                        width : r,
                        height : r
                    });
                    /** @type {number} */
                    dataOffset = dataOffset + dataLength;
                }
            }
            return {
                isCubemap : true,
                mipmaps : _.flatten(e),
                mipmapCount : order + 1,
                width : this._size,
                height : this._size,
                format : THREE.RGBAFormat,
                minFilter : THREE.LinearMipMapLinearFilter,
                magFilter : THREE.LinearFilter,
                wrapS : THREE.ClampToEdgeWrapping,
                wrapT : THREE.ClampToEdgeWrapping,
                type : THREE.UnsignedByteType
            };
        };
        /** @type {function(number): number} */
        Math.log2 = Math.log2 || function(score) {
            return Math.log(score) * Math.LOG2E;
        };
        /** @type {function(number, boolean, string): undefined} */
        module.exports = MTLLoader;
    }, {}],
    10 : [function(canCreateDiscussions, m, n) {
        /**
         * @param {string} data
         * @return {undefined}
         */
        var load = function(data) {
            THREE.XHRLoader.call(this);
            this.setResponseType("arraybuffer");
            this.manager = void 0 !== data ? data : THREE.DefaultLoadingManager;
        };
        /** @type {!Object} */
        load.prototype = Object.create(THREE.XHRLoader.prototype);
        /** @type {function(string): undefined} */
        m.exports = load;
    }, {}],
    11 : [function(canCreateDiscussions, module, n) {
        /**
         * @param {number} t
         * @param {?} data
         * @param {!Object} obj
         * @return {undefined}
         */
        function normalize(t, data, obj) {
            /** @type {number} */
            var d = t * t;
            /** @type {number} */
            var index = 2 * t * t;
            /** @type {number} */
            var x = 3 * t * t;
            /** @type {number} */
            var objCursor = 0;
            /** @type {number} */
            var i = 0;
            for (; i < d; i++) {
                obj[objCursor++] = data[i];
                obj[objCursor++] = data[i + d];
                obj[objCursor++] = data[i + index];
                obj[objCursor++] = data[i + x];
            }
        }
        /**
         * @param {number} value
         * @param {!Object} options
         * @param {string} manager
         * @return {undefined}
         */
        var MTLLoader = function(value, options, manager) {
            this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
            /** @type {number} */
            this._size = value;
            /** @type {!Object} */
            this._interleaving = options;
        };
        /** @type {!Object} */
        MTLLoader.prototype = Object.create(THREE.BinaryTextureLoader.prototype);
        /**
         * @param {?} size
         * @return {?}
         */
        MTLLoader.prototype._parser = function(size) {
            var result;
            var r = this._size;
            if (this._interleaving) {
                /** @type {number} */
                var outputByteCount = r * r * 4;
                /** @type {!Uint8Array} */
                var out = new Uint8Array(size);
                /** @type {!Uint8Array} */
                result = new Uint8Array(outputByteCount);
                normalize(r, out, result);
            } else {
                /** @type {!Uint8Array} */
                result = new Uint8Array(size);
            }
            return {
                width : r,
                height : r,
                data : result,
                format : THREE.RGBAFormat,
                minFilter : THREE.LinearFilter,
                magFilter : THREE.LinearFilter,
                wrapS : THREE.ClampToEdgeWrapping,
                wrapT : THREE.ClampToEdgeWrapping,
                type : THREE.UnsignedByteType
            };
        };
        /** @type {function(number, !Object, string): undefined} */
        module.exports = MTLLoader;
    }, {}],
    12 : [function(canCreateDiscussions, module, n) {
        /**
         * @param {!Array} tests
         * @return {?}
         */
        function r(tests) {
            var delta = tests.slice(0, 27);
            /** @type {number} */
            var a = 1 / (2 * Math.sqrt(Math.PI));
            /** @type {number} */
            var e = -(.5 * Math.sqrt(3 / Math.PI));
            /** @type {number} */
            var i = -e;
            /** @type {number} */
            var abcd = e;
            /** @type {number} */
            var knobHalf = .5 * Math.sqrt(15 / Math.PI);
            /** @type {number} */
            var currentRelations = -knobHalf;
            /** @type {number} */
            var c = .25 * Math.sqrt(5 / Math.PI);
            /** @type {number} */
            var addedRelations = currentRelations;
            /** @type {number} */
            var l = .25 * Math.sqrt(15 / Math.PI);
            /** @type {!Array} */
            var array = [a, a, a, e, e, e, i, i, i, abcd, abcd, abcd, knobHalf, knobHalf, knobHalf, currentRelations, currentRelations, currentRelations, c, c, c, addedRelations, addedRelations, addedRelations, l, l, l];
            return array.map(function(position, i) {
                return position * delta[i];
            });
        }
        /**
         * @param {string} data
         * @return {undefined}
         */
        var DataFrameReader = function(data) {
            THREE.XHRLoader.call(this);
            this.manager = void 0 !== data ? data : THREE.DefaultLoadingManager;
        };
        /** @type {!Object} */
        DataFrameReader.prototype = Object.create(THREE.XHRLoader.prototype);
        /**
         * @param {string} f
         * @param {!Function} m
         * @param {!Function} data
         * @param {!Function} xhr
         * @return {undefined}
         */
        DataFrameReader.prototype.load = function(f, m, data, xhr) {
            THREE.XHRLoader.prototype.load.call(this, f, function(dir) {
                /** @type {*} */
                var n = JSON.parse(dir);
                var x = r(n);
                m(x);
            }, data, xhr);
        };
        /** @type {function(string): undefined} */
        module.exports = DataFrameReader;
    }, {}],
    13 : [function($, canCreateDiscussions, n) {
        var data = ($("21"), $("22"));
        var images = $("20");
        /** @type {function(!Object): ?} */
        var RandomBaseTimeSeriesDataModel = ($("15"), THREE.MaterialLoader.prototype.parse);
        /** @type {null} */
        var shaders = null;
        /**
         * @param {!Object} trackInfoUrl
         * @return {undefined}
         */
        THREE.MaterialLoader.setShaders = function(trackInfoUrl) {
            /** @type {!Object} */
            shaders = trackInfoUrl;
        };
        /**
         * @param {!Object} options
         * @return {?}
         */
        THREE.MaterialLoader.prototype.parse = function(options) {
            var json = RandomBaseTimeSeriesDataModel.call(this, options);
            if (options.customType && "MatcapMaterial" === options.customType) {
                return images.create({
                    uuid : options.uuid,
                    name : options.name,
                    normalMap : json.normalMap,
                    matcapMap : THREE.ImageUtils.loadTexture("textures/matcap.jpg"),
                    normalMapFactor : 1
                });
            }
            if (options.customType && "PBRMaterial" === options.customType) {
                var n = options.metalGlossMap ? this.getTexture(options.metalGlossMap) : null;
                var s = options.map2 ? this.getTexture(options.map2) : null;
                var c = options.normalMap2 ? this.getTexture(options.normalMap2) : null;
                var u = options.aoMap2 ? this.getTexture(options.aoMap2) : null;
                var l = options.lightMapM ? this.getTexture(options.lightMapM) : null;
                var f = options.lightMapDir ? this.getTexture(options.lightMapDir) : null;
                var materialEmissiveMapRow = options.emissiveMap ? this.getTexture(options.emissiveMap) : null;
                var p = options.packedPBRMap ? this.getTexture(options.packedPBRMap) : null;
                return data.create({
                    vertexShader : shaders["pbr.vs"],
                    fragmentShader : shaders["pbr.fs"],
                    uuid : options.uuid,
                    name : options.name,
                    color : options.color,
                    opacity : json.opacity,
                    transparent : json.transparent,
                    alphaTest : json.alphaTest,
                    environment : options.environment,
                    exposure : options.exposure,
                    albedoMap : json.map,
                    albedoMap2 : s,
                    metalGlossMap : n,
                    packedMap : p,
                    metalFactor : options.metalFactor,
                    glossFactor : options.glossFactor,
                    normalMapFactor : options.normalFactor,
                    normalMap : json.normalMap,
                    normalMap2 : c,
                    lightMap : json.lightMap,
                    lightMapM : l,
                    lightMapDir : f,
                    aoMap : json.aoMap,
                    aoMap2 : u,
                    aoFactor : options.aoFactor,
                    occludeSpecular : options.occludeSpecular,
                    emissiveMap : materialEmissiveMapRow
                });
            }
            if ("SkyboxMaterial" === options.customType) {
                var shader = THREE.ShaderLib.cube;
                json.vertexShader = shaders["skybox.vs"];
                json.fragmentShader = shaders["skybox.fs"];
                json.uniforms = THREE.UniformsUtils.clone(shader.uniforms);
                json.uniforms.tCube.value = this.getTexture(options.cubemap);
            }
            return json;
        };
    }, {
        15 : 15,
        20 : 20,
        21 : 21,
        22 : 22
    }],
    14 : [function(require, module, n) {
        var r = require("24");
        var $ = require("15");
        /**
         * @param {!Object} obj
         * @return {undefined}
         */
        var Renderer = function(obj) {
            if (obj.manager) {
                this.manager = obj.manager;
            }
            if (obj.cubemaps) {
                this.cubemaps = obj.cubemaps;
            }
            if (obj.sh) {
                this.sh = obj.sh;
            }
            if (obj.textures) {
                this.textures = obj.textures;
            }
            if (obj.panoramas) {
                this.panoramas = obj.panoramas;
            }
            if (obj.geometries) {
                this.geometries = obj.geometries;
            }
        };
        /**
         * @return {?}
         */
        Renderer.prototype.load = function() {
            var params = {};
            return this.cubemaps && (params.cubemap = $.loadSpecularCubemaps(this.cubemaps)), this.panoramas && (params.panorama = $.loadPanoramas(this.panoramas)), this.sh && (params.sh = $.loadSH(this.sh)), this.textures && (params.texture = $.loadTextures(this.textures, "")), this.geometries && (params.geometry = $.loadGeometries(this.geometries)), r.props(params);
        };
        /** @type {function(!Object): undefined} */
        module.exports = Renderer;
    }, {
        15 : 15,
        24 : 24
    }],
    15 : [function(_dereq_, module, n) {
        /**
         * @param {!Object} tree
         * @param {!Object} event
         * @return {?}
         */
        function normalize(tree, event) {
            return {
                _cache : event || {},
                load : function(f, m, callback, options, path) {
                    var cache = this._cache;
                    if (_.has(cache, path)) {
                        resolve(cache[path]);
                    } else {
                        tree.load(f, function(tmpl) {
                            cache[path] = tmpl;
                            m.apply(this, arguments);
                        }, callback, options);
                    }
                },
                get : function(path) {
                    return _.has(this._cache, path) || console.error("Resource not found: " + path), this._cache[path];
                }
            };
        }
        /**
         * @param {?} selector
         * @param {?} name
         * @param {?} close
         * @param {!Function} callback
         * @return {?}
         */
        function exec(selector, name, close, callback) {
            return _.isArray(selector) || (selector = [selector]), $.all(_.map(selector, function(ext) {
                if (callback) {
                    return callback(require(name, ext), ext, close);
                }
            }));
        }
        /**
         * @param {string} url
         * @param {string} name
         * @param {!Object} type
         * @return {?}
         */
        function load(url, name, type) {
            return new $(function(i, stepCallback) {
                type.load(url, function(t) {
                    /** @type {string} */
                    t.filename = name;
                    i(arguments.length > 1 ? _.toArray(arguments) : t);
                }, function() {
                }, function() {
                    stepCallback(new Error("Resource was not found: " + url));
                }, name);
            });
        }
        /**
         * @param {!Array} c
         * @param {?} b
         * @param {?} a
         * @return {?}
         */
        function fn(c, b, a) {
            return c = c || [], exec(c, b, a, load);
        }
        var $ = _dereq_("24");
        var require = _dereq_("29");
        var ImageLoader = _dereq_("16");
        var Big = _dereq_("11");
        var List = _dereq_("9");
        var Type = _dereq_("12");
        var Connection = _dereq_("10");
        var manager = new THREE.LoadingManager;
        var loader = new ImageLoader(manager);
        var name = {};
        var target = normalize(new THREE.TextureLoader(manager), name);
        var list = normalize(new Big(1024, false, manager), name);
        var y = normalize(new List(256, false, manager), name);
        var nsListById = {};
        var scope = new Type(manager);
        var schema = {};
        var c = normalize(new Connection(manager), schema);
        var self = {
            environmentPath : "assets/environments",
            geometryPath : "assets/scenes/data/",
            manager : manager,
            sceneLoader : loader
        };
        /** @type {string} */
        var temp = "";
        Object.defineProperty(self, "texturePath", {
            get : function() {
                return temp;
            },
            set : function(dir) {
                temp = dir;
                loader.setTexturePath(dir);
            }
        });
        /**
         * @param {string} url
         * @param {string} key
         * @return {?}
         */
        self.loadScene = function(url, key) {
            return load(url, key, loader);
        };
        /**
         * @param {!Array} t
         * @param {?} i
         * @return {?}
         */
        self.loadOBJs = function(t, i) {
            return fn(t, i, objLoader);
        };
        /**
         * @param {!Array} selected
         * @param {!Object} options
         * @return {?}
         */
        self.loadTextures = function(selected, options) {
            return fn(selected, options || self.texturePath, target);
        };
        /**
         * @param {!Array} t
         * @param {?} i
         * @return {?}
         */
        self.loadBRDFs = function(t, i) {
            return fn(t, i, brdfLoader);
        };
        /**
         * @param {!Array} args
         * @param {string} options
         * @return {?}
         */
        self.loadPanoramas = function(args, options) {
            return fn(args, options || self.environmentPath, list);
        };
        /**
         * @param {!Array} args
         * @param {string} options
         * @return {?}
         */
        self.loadSpecularCubemaps = function(args, options) {
            return fn(args, options || self.environmentPath, y);
        };
        /**
         * @param {!Function} fn
         * @return {?}
         */
        self.loadSH = function(fn) {
            return $.all(_.map(fn, function(id) {
                return new $(function(e, stepCallback) {
                    var r = require(self.environmentPath, id + "/irradiance.json");
                    scope.load(r, function(n) {
                        nsListById[id] = n;
                        e(n);
                    }, function() {
                    }, function() {
                        stepCallback(new Error("Resource was not found: " + r));
                    });
                });
            }));
        };
        /**
         * @param {?} e
         * @param {string} options
         * @return {?}
         */
        self.loadGeometries = function(e, options) {
            return e = _.map(e, function(canCreateDiscussions) {
                return canCreateDiscussions + ".bin";
            }), fn(e, options || self.geometryPath, c);
        };
        /**
         * @param {string} key
         * @return {?}
         */
        self.getTexture = function(key) {
            return target.get(key);
        };
        /**
         * @param {string} t
         * @return {?}
         */
        self.getBRDF = function(t) {
            return brdfLoader.get(t);
        };
        /**
         * @param {string} name
         * @return {?}
         */
        self.getPanorama = function(name) {
            return list.get(name + "/panorama.bin");
        };
        /**
         * @param {string} i
         * @return {?}
         */
        self.getCubemap = function(i) {
            return y.get(i + "/cubemap.bin");
        };
        /**
         * @param {?} notebookID
         * @return {?}
         */
        self.getSH = function(notebookID) {
            return nsListById[notebookID];
        };
        /**
         * @param {string} name
         * @return {?}
         */
        self.getGeometry = function(name) {
            return c.get(name + ".bin");
        };
        module.exports = self;
    }, {
        10 : 10,
        11 : 11,
        12 : 12,
        16 : 16,
        24 : 24,
        29 : 29,
        9 : 9
    }],
    16 : [function(canCreateDiscussions, module, n) {
        /**
         * @param {string} data
         * @return {undefined}
         */
        var MTLLoader = function(data) {
            this.manager = void 0 !== data ? data : THREE.DefaultLoadingManager;
            /** @type {string} */
            this.texturePath = "";
        };
        Object.assign(MTLLoader.prototype, {
            load : function(f, e, data, options) {
                if ("" === this.texturePath) {
                    this.texturePath = f.substring(0, f.lastIndexOf("/") + 1);
                }
                var scope = this;
                var helpers = new THREE.XHRLoader(scope.manager);
                helpers.load(f, function(response) {
                    /** @type {*} */
                    var value = JSON.parse(response);
                    scope.parse(value, e);
                }, data, options);
            },
            setTexturePath : function(path) {
                /** @type {string} */
                this.texturePath = path;
            },
            setCrossOrigin : function(value) {
                /** @type {!Object} */
                this.crossOrigin = value;
            },
            parse : function(json, fn) {
                var geometries;
                geometries = json.binary ? this.parseBinaryGeometries(json.geometries) : this.parseGeometries(json.geometries);
                var images = this.parseImages(json.images, function() {
                    if (void 0 !== fn) {
                        fn(object, json);
                    }
                });
                var textures = this.parseTextures(json.textures, images);
                var materials = this.parseMaterials(json.materials, textures);
                var object = this.parseObject(json.object, geometries, materials);
                return json.animations && (object.animations = this.parseAnimations(json.animations)), json.cameras && (object.cameras = this.parseCameras(object, json.cameras)), void 0 !== json.images && 0 !== json.images.length || void 0 !== fn && fn(object, json), object;
            },
            parseCameras : function(object, options) {
                /** @type {!Array} */
                var onSelectionCalls = [];
                /** @type {number} */
                var index = 0;
                for (; index < options.length; index++) {
                    var e = object.getObjectByProperty("uuid", options[index]);
                    if (e) {
                        onSelectionCalls.push(e);
                    }
                }
                return onSelectionCalls;
            },
            parseGeometries : function(json) {
                var geometries = {};
                if (void 0 !== json) {
                    var geometryLoader = new THREE.JSONLoader;
                    var primParser = new THREE.BufferGeometryLoader;
                    /** @type {number} */
                    var i = 0;
                    var jsonLength = json.length;
                    for (; i < jsonLength; i++) {
                        var geometry;
                        var data = json[i];
                        switch(data.type) {
                            case "PlaneGeometry":
                            case "PlaneBufferGeometry":
                                geometry = new THREE[data.type](data.width, data.height, data.widthSegments, data.heightSegments);
                                break;
                            case "BoxGeometry":
                            case "BoxBufferGeometry":
                            case "CubeGeometry":
                                geometry = new THREE[data.type](data.width, data.height, data.depth, data.widthSegments, data.heightSegments, data.depthSegments);
                                break;
                            case "CircleGeometry":
                            case "CircleBufferGeometry":
                                geometry = new THREE[data.type](data.radius, data.segments, data.thetaStart, data.thetaLength);
                                break;
                            case "CylinderGeometry":
                            case "CylinderBufferGeometry":
                                geometry = new THREE[data.type](data.radiusTop, data.radiusBottom, data.height, data.radialSegments, data.heightSegments, data.openEnded, data.thetaStart, data.thetaLength);
                                break;
                            case "ConeGeometry":
                            case "ConeBufferGeometry":
                                geometry = new THREE[data.type](data.radius, data.height, data.radialSegments, data.heightSegments, data.openEnded, data.thetaStart, data.thetaLength);
                                break;
                            case "SphereGeometry":
                            case "SphereBufferGeometry":
                                geometry = new THREE[data.type](data.radius, data.widthSegments, data.heightSegments, data.phiStart, data.phiLength, data.thetaStart, data.thetaLength);
                                break;
                            case "DodecahedronGeometry":
                            case "IcosahedronGeometry":
                            case "OctahedronGeometry":
                            case "TetrahedronGeometry":
                                geometry = new THREE[data.type](data.radius, data.detail);
                                break;
                            case "RingGeometry":
                            case "RingBufferGeometry":
                                geometry = new THREE[data.type](data.innerRadius, data.outerRadius, data.thetaSegments, data.phiSegments, data.thetaStart, data.thetaLength);
                                break;
                            case "TorusGeometry":
                            case "TorusBufferGeometry":
                                geometry = new THREE[data.type](data.radius, data.tube, data.radialSegments, data.tubularSegments, data.arc);
                                break;
                            case "TorusKnotGeometry":
                            case "TorusKnotBufferGeometry":
                                geometry = new THREE[data.type](data.radius, data.tube, data.tubularSegments, data.radialSegments, data.p, data.q);
                                break;
                            case "LatheGeometry":
                            case "LatheBufferGeometry":
                                geometry = new THREE[data.type](data.points, data.segments, data.phiStart, data.phiLength);
                                break;
                            case "BufferGeometry":
                                geometry = primParser.parse(data);
                                break;
                            case "Geometry":
                                geometry = geometryLoader.parse(data.data, this.texturePath).geometry;
                                break;
                            default:
                                console.warn('THREE.ObjectLoader: Unsupported geometry type "' + data.type + '"');
                                continue;
                        }
                        geometry.uuid = data.uuid;
                        if (void 0 !== data.name) {
                            geometry.name = data.name;
                        }
                        geometries[data.uuid] = geometry;
                    }
                }
                return geometries;
            },
            setBinaryGeometryBuffer : function(addedRenderer) {
                /** @type {!Object} */
                this.geometryBuffer = addedRenderer;
            },
            parseBinaryGeometries : function(result) {
                var geometries = {};
                if (void 0 !== result) {
                    /** @type {number} */
                    var i = (new THREE.BufferGeometryLoader, 0);
                    var length = result.length;
                    for (; i < length; i++) {
                        var geometry = new THREE.BufferGeometry;
                        var data = result[i];
                        var key;
                        for (key in data.offsets) {
                            if (data.offsets.hasOwnProperty(key)) {
                                var tex = data.offsets[key];
                                var c = tex[0];
                                var n = tex[1] + 1;
                                var len = this.geometryBuffer.slice(c, n);
                                if ("index" === key) {
                                    /** @type {!Uint32Array} */
                                    var indices = new Uint32Array(len);
                                    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
                                } else {
                                    var size;
                                    /** @type {!Float32Array} */
                                    indices = new Float32Array(len);
                                    if ("uv" === key || "uv2" === key) {
                                        /** @type {number} */
                                        size = 2;
                                    } else {
                                        if ("position" === key || "normal" === key || "color" === key) {
                                            /** @type {number} */
                                            size = 3;
                                        } else {
                                            if ("tangent" === key) {
                                                /** @type {number} */
                                                size = 4;
                                            }
                                        }
                                    }
                                    geometry.addAttribute(key, new THREE.BufferAttribute(indices, size));
                                }
                            }
                        }
                        geometry.uuid = data.uuid;
                        if (void 0 !== data.name) {
                            geometry.name = data.name;
                        }
                        geometries[data.uuid] = geometry;
                    }
                    this.setBinaryGeometryBuffer(null);
                }
                return geometries;
            },
            parseMaterials : function(json, textures) {
                var materials = {};
                if (void 0 !== json) {
                    var loader = new THREE.MaterialLoader;
                    loader.setTextures(textures);
                    /** @type {number} */
                    var i = 0;
                    var jsonLength = json.length;
                    for (; i < jsonLength; i++) {
                        var material = loader.parse(json[i]);
                        materials[material.uuid] = material;
                    }
                }
                return materials;
            },
            parseAnimations : function(json) {
                /** @type {!Array} */
                var t_chksum = [];
                /** @type {number} */
                var i = 0;
                for (; i < json.length; i++) {
                    var r = THREE.AnimationClip.parse(json[i]);
                    t_chksum.push(r);
                }
                return t_chksum;
            },
            parseImages : function(json, onLoad) {
                /**
                 * @param {string} url
                 * @return {?}
                 */
                function loadImage(url) {
                    return scope.manager.itemStart(url), loader.load(url, function() {
                        scope.manager.itemEnd(url);
                    });
                }
                var scope = this;
                var images = {};
                if (void 0 !== json && json.length > 0) {
                    var manager = new THREE.LoadingManager(onLoad);
                    var loader = new THREE.ImageLoader(manager);
                    loader.setCrossOrigin(this.crossOrigin);
                    /** @type {number} */
                    var i = 0;
                    var jsonLength = json.length;
                    for (; i < jsonLength; i++) {
                        var image = json[i];
                        var url = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(image.url) ? image.url : scope.texturePath + image.url;
                        images[image.uuid] = loadImage(url);
                    }
                }
                return images;
            },
            parseTextures : function(json, images) {
                /**
                 * @param {(Object|string)} value
                 * @return {?}
                 */
                function parseConstant(value) {
                    return "number" == typeof value ? value : (console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.", value), THREE[value]);
                }
                var textures = {};
                if (void 0 !== json) {
                    /** @type {number} */
                    var i = 0;
                    var jsonLength = json.length;
                    for (; i < jsonLength; i++) {
                        var texture;
                        var data = json[i];
                        if (data.images) {
                            /** @type {!Array} */
                            var c = [];
                            /** @type {number} */
                            var i = 0;
                            var l = data.images.length;
                            for (; i < l; i++) {
                                if (void 0 === images[data.images[i]]) {
                                    console.warn("THREE.ObjectLoader: Undefined image", data.images[i]);
                                }
                                c.push(images[data.images[i]]);
                            }
                            texture = new THREE.CubeTexture(c);
                        } else {
                            if (void 0 === data.image) {
                                console.warn('THREE.ObjectLoader: No "image" specified for', data.uuid);
                            }
                            if (void 0 === images[data.image]) {
                                console.warn("THREE.ObjectLoader: Undefined image", data.image);
                            }
                            texture = new THREE.Texture(images[data.image]);
                        }
                        /** @type {boolean} */
                        texture.needsUpdate = true;
                        texture.uuid = data.uuid;
                        if (void 0 !== data.name) {
                            texture.name = data.name;
                        }
                        if (void 0 !== data.mapping) {
                            texture.mapping = parseConstant(data.mapping);
                        }
                        if (void 0 !== data.offset) {
                            texture.offset.fromArray(data.offset);
                        }
                        if (void 0 !== data.repeat) {
                            texture.repeat.fromArray(data.repeat);
                        }
                        if (void 0 !== data.wrap) {
                            texture.wrapS = parseConstant(data.wrap[0]);
                            texture.wrapT = parseConstant(data.wrap[1]);
                        }
                        if (void 0 !== data.minFilter) {
                            texture.minFilter = parseConstant(data.minFilter);
                        }
                        if (void 0 !== data.magFilter) {
                            texture.magFilter = parseConstant(data.magFilter);
                        }
                        if (void 0 !== data.anisotropy) {
                            texture.anisotropy = data.anisotropy;
                        }
                        if (void 0 !== data.flipY) {
                            texture.flipY = data.flipY;
                        }
                        textures[data.uuid] = texture;
                    }
                }
                return textures;
            },
            parseObject : function() {
                var matrix = new THREE.Matrix4;
                return function(data, geometries, materials) {
                    /**
                     * @param {undefined} name
                     * @return {?}
                     */
                    function getGeometry(name) {
                        return void 0 === geometries[name] && console.warn("THREE.ObjectLoader: Undefined geometry", name), geometries[name];
                    }
                    /**
                     * @param {?} name
                     * @return {?}
                     */
                    function getMaterial(name) {
                        if (void 0 !== name) {
                            return void 0 === materials[name] && console.warn("THREE.ObjectLoader: Undefined material", name), materials[name];
                        }
                    }
                    var object;
                    switch(data.type) {
                        case "Scene":
                            object = new THREE.Scene;
                            break;
                        case "PerspectiveCamera":
                            object = new THREE.PerspectiveCamera(data.fov, data.aspect, data.near, data.far);
                            if (void 0 !== data.focus) {
                                object.focus = data.focus;
                            }
                            if (void 0 !== data.zoom) {
                                object.zoom = data.zoom;
                            }
                            if (void 0 !== data.filmGauge) {
                                object.filmGauge = data.filmGauge;
                            }
                            if (void 0 !== data.filmOffset) {
                                object.filmOffset = data.filmOffset;
                            }
                            if (void 0 !== data.view) {
                                /** @type {!Object} */
                                object.view = Object.assign({}, data.view);
                            }
                            break;
                        case "OrthographicCamera":
                            object = new THREE.OrthographicCamera(data.left, data.right, data.top, data.bottom, data.near, data.far);
                            break;
                        case "AmbientLight":
                            object = new THREE.AmbientLight(data.color, data.intensity);
                            break;
                        case "DirectionalLight":
                            object = new THREE.DirectionalLight(data.color, data.intensity);
                            break;
                        case "PointLight":
                            object = new THREE.PointLight(data.color, data.intensity, data.distance, data.decay);
                            break;
                        case "SpotLight":
                            object = new THREE.SpotLight(data.color, data.intensity, data.distance, data.angle, data.penumbra, data.decay);
                            break;
                        case "HemisphereLight":
                            object = new THREE.HemisphereLight(data.color, data.groundColor, data.intensity);
                            break;
                        case "Mesh":
                            var geometry = getGeometry(data.geometry);
                            var material = getMaterial(data.material);
                            object = geometry.bones && geometry.bones.length > 0 ? new THREE.SkinnedMesh(geometry, material) : new THREE.Mesh(geometry, material);
                            break;
                        case "LOD":
                            object = new THREE.LOD;
                            break;
                        case "Line":
                            object = new THREE.Line(getGeometry(data.geometry), getMaterial(data.material), data.mode);
                            break;
                        case "LineSegments":
                            object = new THREE.LineSegments(getGeometry(data.geometry), getMaterial(data.material));
                            break;
                        case "PointCloud":
                        case "Points":
                            object = new THREE.Points(getGeometry(data.geometry), getMaterial(data.material));
                            break;
                        case "Sprite":
                            object = new THREE.Sprite(getMaterial(data.material));
                            break;
                        case "Group":
                            object = new THREE.Group;
                            break;
                        default:
                            object = new THREE.Object3D;
                    }
                    if (object.uuid = data.uuid, void 0 !== data.name && (object.name = data.name), void 0 !== data.matrix ? (matrix.fromArray(data.matrix), matrix.decompose(object.position, object.quaternion, object.scale)) : (void 0 !== data.position && object.position.fromArray(data.position), void 0 !== data.rotation && object.rotation.fromArray(data.rotation), void 0 !== data.scale && object.scale.fromArray(data.scale)), void 0 !== data.castShadow && (object.castShadow = data.castShadow), void 0 !== data.receiveShadow &&
                    (object.receiveShadow = data.receiveShadow), void 0 !== data.visible && (object.visible = data.visible), void 0 !== data.userData && (object.userData = data.userData), void 0 !== data.children) {
                        var child;
                        for (child in data.children) {
                            object.add(this.parseObject(data.children[child], geometries, materials));
                        }
                    }
                    if ("LOD" === data.type) {
                        var levels = data.levels;
                        /** @type {number} */
                        var i = 0;
                        for (; i < levels.length; i++) {
                            var level = levels[i];
                            child = object.getObjectByProperty("uuid", level.object);
                            if (void 0 !== child) {
                                object.addLevel(child, level.distance);
                            }
                        }
                    }
                    return void 0 !== data.layers && (object.layers.mask = data.layers), object;
                };
            }()
        });
        /** @type {function(string): undefined} */
        module.exports = MTLLoader;
    }, {}],
    17 : [function(create, module, n) {
        var _getServer = create("24");
        create("13");
        var shape = create("15");
        var instance = (create("22"), create("16"), {});
        /**
         * @param {string} name
         * @param {string} data
         * @param {!Object} options
         * @param {string} callback
         * @return {?}
         */
        instance.loadScene = function(name, data, options, callback) {
            return new _getServer(function(_emscripten_bind_Vector___destroy___0, a) {
                var addedRenderer = (options.renderer, shape.getGeometry(name));
                if (addedRenderer) {
                    shape.sceneLoader.setBinaryGeometryBuffer(addedRenderer);
                }
                shape.loadScene(data + name + (callback || ".json")).spread(function(self, canCreateDiscussions) {
                    var camera;
                    self.materials = {};
                    if (self.cameras && self.cameras.length > 0) {
                        camera = self.cameras[0];
                    }
                    if (camera) {
                        /** @type {number} */
                        camera.aspect = window.innerWidth / window.innerHeight;
                        camera.updateProjectionMatrix();
                    } else {
                        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, .01, 2E3);
                        camera.position.set(-3.5, 2, 3);
                    }
                    /** @type {number} */
                    var size = 100;
                    /** @type {number} */
                    var step = 10;
                    var grid = new THREE.GridHelper(size, step);
                    self.add(grid);
                    var s = new THREE.AxisHelper(5);
                    self.add(s);
                    /** @type {!Array} */
                    self.dirLights = [];
                    self.traverse(function(camera) {
                        if (camera instanceof THREE.DirectionalLight) {
                            camera.position.set(0, 0, 5);
                            camera.quaternion.normalize();
                            camera.position.applyQuaternion(camera.quaternion);
                            camera.quaternion.set(0, 0, 0, 0);
                            camera.scale.set(1, 1, 1);
                            self.dirLights.push(camera);
                        }
                    });
                    mixer = new THREE.AnimationMixer(self);
                    /** @type {number} */
                    var i = 0;
                    for (; i < self.animations.length; i++) {
                        mixer.clipAction(self.animations[i]).play();
                    }
                    self.traverse(function(options) {
                        var material = options.material;
                        if (material && material.aoMap) {
                            !material.map;
                        }
                    });
                    self.traverse(function(box1) {
                        if ("Line" === box1.name) {
                            /** @type {number} */
                            box1.material.linewidth = 10;
                            box1.material.color.setRGB(1, 0, 1);
                        }
                    });
                    self.traverse(function(node) {
                        if (node instanceof THREE.SpotLight) {
                            var p = new THREE.Vector3(0, 0, -1);
                            var sprite = new THREE.Object3D;
                            node.updateMatrixWorld();
                            node.localToWorld(p);
                            sprite.position.copy(p);
                            self.add(sprite);
                            node.target = sprite;
                        }
                        if (node.material) {
                            if (node.material.materials) {
                                node.material.materials.forEach(function(b) {
                                    /** @type {number} */
                                    self.materials[b.uuid] = b;
                                });
                            } else {
                                self.materials[node.material.uuid] = node.material;
                            }
                        }
                    });
                    _emscripten_bind_Vector___destroy___0(self);
                });
            });
        };
        module.exports = instance;
    }, {
        13 : 13,
        15 : 15,
        16 : 16,
        22 : 22,
        24 : 24
    }],
    18 : [function(fn, canCreateDiscussions, n) {
        fn("19");
        window._ = fn("34");
        /**
         * @param {number} minIn
         * @param {number} maxIn
         * @return {?}
         * @this {!Number}
         */
        Number.prototype.lerp = function(minIn, maxIn) {
            return this + (minIn - this) * maxIn;
        };
        if (!String.prototype.endsWith) {
            /**
             * @param {string} value
             * @param {number=} offset
             * @return {boolean}
             * @this {!String}
             */
            String.prototype.endsWith = function(value, offset) {
                /** @type {string} */
                var buffer = this.toString();
                if ("number" != typeof offset || !isFinite(offset) || Math.floor(offset) !== offset || offset > buffer.length) {
                    /** @type {number} */
                    offset = buffer.length;
                }
                /** @type {number} */
                offset = offset - value.length;
                /** @type {number} */
                var count = buffer.indexOf(value, offset);
                return count !== -1 && count === offset;
            };
        }
        /**
         * @param {!Function} target
         * @param {?} obj
         * @return {undefined}
         */
        Function.prototype.inherit = function(target, obj) {
            if (!target || !_.isFunction(target)) {
                throw "parent argument must be a function";
            }
            this.prototype = _.extend(Object.create(target.prototype), obj);
        };
        /**
         * @param {!Function} name
         * @return {undefined}
         */
        Function.prototype.mixin = function(name) {
            _.each(name, function(fn, methodName) {
                if (void 0 === this.prototype[methodName]) {
                    /** @type {!Function} */
                    this.prototype[methodName] = fn;
                }
            }, this);
        };
        /** @type {number} */
        window.WIDTH = window.innerWidth;
        /** @type {number} */
        window.HEIGHT = window.innerHeight;
        /** @type {number} */
        window.mouseX = 0;
        /** @type {number} */
        window.mouseY = 0;
        /** @type {boolean} */
        window.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        /** @type {boolean} */
        window.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }, {
        19 : 19,
        34 : 34
    }],
    19 : [function(canCreateDiscussions, module, n) {
        if (void 0 === Date.now) {
            /**
             * @return {number}
             */
            Date.now = function() {
                return (new Date).valueOf();
            };
        }
        window.TWEEN = function() {
            /** @type {!Array} */
            var tags = [];
            /** @type {!Array} */
            var e = [];
            /** @type {!Array} */
            var arrUrls = [];
            return {
                REVISION : "14",
                getAll : function() {
                    return tags;
                },
                removeAll : function() {
                    /** @type {!Array} */
                    tags = [];
                },
                add : function(type) {
                    e.push(type);
                },
                remove : function(url) {
                    arrUrls.push(url);
                },
                update : function(value) {
                    /** @type {number} */
                    var i = 0;
                    value = void 0 !== value ? value : "undefined" != typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now();
                    for (; i < tags.length;) {
                        if (tags[i].update(value)) {
                            i++;
                        } else {
                            tags.splice(i, 1);
                        }
                    }
                    return arrUrls.length > 0 && (arrUrls.forEach(function(i) {
                        var n = tags.indexOf(i);
                        if (n !== -1) {
                            tags.splice(n, 1);
                        }
                    }), arrUrls = []), e.length > 0 && (e.forEach(function(transform) {
                        tags.push(transform);
                    }), e = []), true;
                }
            };
        }();
        /**
         * @param {number} delay
         * @return {undefined}
         */
        TWEEN.Tween = function(delay) {
            var a;
            var percentage;
            var a1;
            var range;
            var nonDuplicateIds;
            var c;
            var tRecord;
            var modeswitches;
            var u;
            var l;
            var encoding;
            var i;
            var token;
            var type;
            var color;
            var debug;
            var g;
            var b;
            var constraint;
            var now;
            /**
             * @param {number} name
             * @return {?}
             */
            this.reset = function(name) {
                return a = name, percentage = 0, a1 = {}, range = {}, nonDuplicateIds = {}, c = 1E3, tRecord = 0, modeswitches = false, u = false, l = false, encoding = 0, i = null, token = TWEEN.Easing.Linear.None, type = TWEEN.Interpolation.Linear, color = [], debug = null, g = false, b = null, constraint = null, now = null, this;
            };
            /**
             * @param {!Array} fn
             * @param {number} value
             * @return {?}
             */
            this.to = function(fn, value) {
                return void 0 !== value && (c = value), range = fn, this;
            };
            /**
             * @param {number} n
             * @return {?}
             */
            this.start = function(n) {
                TWEEN.add(this);
                /** @type {boolean} */
                u = true;
                /** @type {boolean} */
                g = false;
                i = void 0 !== n ? n : "undefined" != typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now();
                i = i + encoding;
                var j;
                for (j in range) {
                    a1[j] = a[j];
                    nonDuplicateIds[j] = a1[j] || 0;
                }
                return this;
            };
            /**
             * @return {?}
             */
            this.stop = function() {
                return u ? (TWEEN.remove(this), u = false, null !== now && now.call(a), this.stopChainedTweens(), this) : this;
            };
            /**
             * @return {undefined}
             */
            this.stopChainedTweens = function() {
                /** @type {number} */
                var i = 0;
                var colorLength = color.length;
                for (; i < colorLength; i++) {
                    color[i].stop();
                }
            };
            /**
             * @param {string} object
             * @return {?}
             */
            this.delay = function(object) {
                return encoding = object, this;
            };
            /**
             * @param {string} t
             * @return {?}
             */
            this.repeat = function(t) {
                return tRecord = t, this;
            };
            /**
             * @param {boolean} value
             * @return {?}
             */
            this.yoyo = function(value) {
                return modeswitches = value, this;
            };
            /**
             * @param {number} t
             * @return {?}
             */
            this.easing = function(t) {
                return token = t, this;
            };
            /**
             * @param {?} method
             * @return {?}
             */
            this.interpolation = function(method) {
                return type = method, this;
            };
            /**
             * @return {?}
             */
            this.chain = function() {
                return color = arguments, this;
            };
            /**
             * @param {?} state
             * @return {?}
             */
            this.onStart = function(state) {
                return debug = state, this;
            };
            /**
             * @param {?} data
             * @return {?}
             */
            this.onUpdate = function(data) {
                return b = data, this;
            };
            /**
             * @param {?} width
             * @return {?}
             */
            this.onComplete = function(width) {
                return constraint = width, this;
            };
            /**
             * @param {?} to
             * @return {?}
             */
            this.onStop = function(to) {
                return now = to, this;
            };
            /**
             * @param {number} x
             * @return {?}
             */
            this.update = function(x) {
                var j;
                if (x < i) {
                    return true;
                }
                if (!u) {
                    return false;
                }
                if (g === false) {
                    if (null !== debug) {
                        debug.call(a);
                    }
                    /** @type {boolean} */
                    g = true;
                }
                /** @type {number} */
                var p = (x - i) / c;
                /** @type {number} */
                p = p > 1 ? 1 : p;
                /** @type {number} */
                percentage = p;
                var val = token(p);
                for (j in range) {
                    var min = a1[j] || 0;
                    var max = range[j];
                    a[j] = min + (max - min) * val;
                }
                if (null !== b && b.call(a, val), 1 == p) {
                    if (null !== constraint) {
                        constraint.call(a);
                    }
                    /** @type {number} */
                    var i = 0;
                    var colorLength = color.length;
                    for (; i < colorLength; i++) {
                        color[i].start(x);
                    }
                    return false;
                }
                return true;
            };
            /**
             * @return {?}
             */
            this.getProgress = function() {
                return percentage;
            };
            if (void 0 !== delay) {
                this.reset(delay);
            }
        };
        TWEEN.Easing = {
            Linear : {
                None : function(to) {
                    return to;
                }
            },
            Quadratic : {
                In : function(b) {
                    return b * b;
                },
                Out : function(d) {
                    return d * (2 - d);
                },
                InOut : function(t) {
                    return (t = t * 2) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1);
                }
            },
            Cubic : {
                In : function(t) {
                    return t * t * t;
                },
                Out : function(t) {
                    return --t * t * t + 1;
                },
                InOut : function(t) {
                    return (t = t * 2) < 1 ? .5 * t * t * t : .5 * ((t = t - 2) * t * t + 2);
                }
            },
            Quartic : {
                In : function(t) {
                    return t * t * t * t;
                },
                Out : function(t) {
                    return 1 - --t * t * t * t;
                },
                InOut : function(t) {
                    return (t = t * 2) < 1 ? .5 * t * t * t * t : -.5 * ((t = t - 2) * t * t * t - 2);
                }
            },
            Quintic : {
                In : function(t) {
                    return t * t * t * t * t;
                },
                Out : function(t) {
                    return --t * t * t * t * t + 1;
                },
                InOut : function(t) {
                    return (t = t * 2) < 1 ? .5 * t * t * t * t * t : .5 * ((t = t - 2) * t * t * t * t + 2);
                }
            },
            Sinusoidal : {
                In : function(t) {
                    return 1 - Math.cos(t * Math.PI / 2);
                },
                Out : function(t) {
                    return Math.sin(t * Math.PI / 2);
                },
                InOut : function(t) {
                    return .5 * (1 - Math.cos(Math.PI * t));
                }
            },
            Exponential : {
                In : function(b) {
                    return 0 === b ? 0 : Math.pow(1024, b - 1);
                },
                Out : function(t) {
                    return 1 === t ? 1 : 1 - Math.pow(2, -10 * t);
                },
                InOut : function(t) {
                    return 0 === t ? 0 : 1 === t ? 1 : (t = t * 2) < 1 ? .5 * Math.pow(1024, t - 1) : .5 * (-Math.pow(2, -10 * (t - 1)) + 2);
                }
            },
            Circular : {
                In : function(b) {
                    return 1 - Math.sqrt(1 - b * b);
                },
                Out : function(t) {
                    return Math.sqrt(1 - --t * t);
                },
                InOut : function(t) {
                    return (t = t * 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t = t - 2) * t) + 1);
                }
            },
            Elastic : {
                In : function(t) {
                    var n;
                    /** @type {number} */
                    var r = .1;
                    /** @type {number} */
                    var l = .4;
                    return 0 === t ? 0 : 1 === t ? 1 : (!r || r < 1 ? (r = 1, n = l / 4) : n = l * Math.asin(1 / r) / (2 * Math.PI), -(r * Math.pow(2, 10 * (t = t - 1)) * Math.sin((t - n) * (2 * Math.PI) / l)));
                },
                Out : function(t) {
                    var p;
                    /** @type {number} */
                    var h = .1;
                    /** @type {number} */
                    var n = .4;
                    return 0 === t ? 0 : 1 === t ? 1 : (!h || h < 1 ? (h = 1, p = n / 4) : p = n * Math.asin(1 / h) / (2 * Math.PI), h * Math.pow(2, -10 * t) * Math.sin((t - p) * (2 * Math.PI) / n) + 1);
                },
                InOut : function(t) {
                    var p;
                    /** @type {number} */
                    var h = .1;
                    /** @type {number} */
                    var n = .4;
                    return 0 === t ? 0 : 1 === t ? 1 : (!h || h < 1 ? (h = 1, p = n / 4) : p = n * Math.asin(1 / h) / (2 * Math.PI), (t = t * 2) < 1 ? -.5 * (h * Math.pow(2, 10 * (t = t - 1)) * Math.sin((t - p) * (2 * Math.PI) / n)) : h * Math.pow(2, -10 * (t = t - 1)) * Math.sin((t - p) * (2 * Math.PI) / n) * .5 + 1);
                }
            },
            Back : {
                In : function(t) {
                    /** @type {number} */
                    var s = 1.70158;
                    return t * t * ((s + 1) * t - s);
                },
                Out : function(t) {
                    /** @type {number} */
                    var s = 1.70158;
                    return --t * t * ((s + 1) * t + s) + 1;
                },
                InOut : function(t) {
                    /** @type {number} */
                    var s = 2.5949095;
                    return (t = t * 2) < 1 ? .5 * (t * t * ((s + 1) * t - s)) : .5 * ((t = t - 2) * t * ((s + 1) * t + s) + 2);
                }
            },
            Bounce : {
                In : function(a) {
                    return 1 - TWEEN.Easing.Bounce.Out(1 - a);
                },
                Out : function(t) {
                    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t = t - 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t = t - 2.25 / 2.75) * t + .9375 : 7.5625 * (t = t - 2.625 / 2.75) * t + .984375;
                },
                InOut : function(a) {
                    return a < .5 ? .5 * TWEEN.Easing.Bounce.In(2 * a) : .5 * TWEEN.Easing.Bounce.Out(2 * a - 1) + .5;
                }
            }
        };
        TWEEN.Interpolation = {
            Linear : function(a, c) {
                /** @type {number} */
                var b = a.length - 1;
                /** @type {number} */
                var d = b * c;
                /** @type {number} */
                var e = Math.floor(d);
                var g = TWEEN.Interpolation.Utils.Linear;
                return c < 0 ? g(a[0], a[1], d) : c > 1 ? g(a[b], a[b - 1], b - d) : g(a[e], a[e + 1 > b ? b : e + 1], d - e);
            },
            Bezier : function(a, k) {
                var i;
                /** @type {number} */
                var b = 0;
                /** @type {number} */
                var n = a.length - 1;
                /** @type {function(?, ?): number} */
                var pw = Math.pow;
                var bn = TWEEN.Interpolation.Utils.Bernstein;
                /** @type {number} */
                i = 0;
                for (; i <= n; i++) {
                    /** @type {number} */
                    b = b + pw(1 - k, n - i) * pw(k, i) * a[i] * bn(n, i);
                }
                return b;
            },
            CatmullRom : function(v, k) {
                /** @type {number} */
                var m = v.length - 1;
                /** @type {number} */
                var f = m * k;
                /** @type {number} */
                var i = Math.floor(f);
                var fn = TWEEN.Interpolation.Utils.CatmullRom;
                return v[0] === v[m] ? (k < 0 && (i = Math.floor(f = m * (1 + k))), fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i)) : k < 0 ? v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]) : k > 1 ? v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]) : fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
            },
            Utils : {
                Linear : function(a, b, t) {
                    return (b - a) * t + a;
                },
                Bernstein : function(a, c) {
                    var b = TWEEN.Interpolation.Utils.Factorial;
                    return b(a) / b(c) / b(a - c);
                },
                Factorial : function() {
                    /** @type {!Array} */
                    var subwikiListsCache = [1];
                    return function(wikiId) {
                        var HeaderContentBonusMultiplier;
                        /** @type {number} */
                        var headerScore = 1;
                        if (subwikiListsCache[wikiId]) {
                            return subwikiListsCache[wikiId];
                        }
                        /** @type {number} */
                        HeaderContentBonusMultiplier = wikiId;
                        for (; HeaderContentBonusMultiplier > 1; HeaderContentBonusMultiplier--) {
                            /** @type {number} */
                            headerScore = headerScore * HeaderContentBonusMultiplier;
                        }
                        return subwikiListsCache[wikiId] = headerScore;
                    };
                }(),
                CatmullRom : function(p0, p1, p2, p3, t) {
                    /** @type {number} */
                    var c = .5 * (p2 - p0);
                    /** @type {number} */
                    var b = .5 * (p3 - p1);
                    /** @type {number} */
                    var d = t * t;
                    /** @type {number} */
                    var u = t * d;
                    return (2 * p1 - 2 * p2 + c + b) * u + (-3 * p1 + 3 * p2 - 2 * c - b) * d + c * t + p1;
                }
            }
        };
        if ("undefined" != typeof module && module.exports) {
            module.exports = TWEEN;
        }
    }, {}],
    20 : [function(encodeURIComponent, module, n) {
        /**
         * @param {?} value
         * @param {string} defaultValue
         * @return {?}
         */
        function optionalParameter(value, defaultValue) {
            return void 0 !== value ? value : defaultValue;
        }
        var t = encodeURIComponent("21");
        var value = encodeURIComponent("15");
        var a = {
            normalMapFactor : "uNormalMapFactor",
            normalMap : "sTextureNormalMap",
            matcapMap : "sTextureAOMap"
        };
        /**
         * @param {!Function} data
         * @return {undefined}
         */
        var update = function(data) {
            /** @type {!Object} */
            data = Object.assign({
                vertexShader : data.vertexShader,
                fragmentShader : data.fragmentShader,
                uniforms : {
                    uNormalMapFactor : {
                        type : "f",
                        value : 1
                    },
                    sTextureMatcapMap : {
                        type : "t",
                        value : null
                    },
                    sTextureNormalMap : {
                        type : "t",
                        value : null
                    },
                    uFlipY : {
                        type : "i",
                        value : 0
                    },
                    uOutputLinear : {
                        type : "i",
                        value : 0
                    }
                }
            }, data);
            t.call(this, data);
            Object.keys(this.uniforms).forEach(function(name) {
                this.onPropertyChange(name, function(initSBC) {
                    /** @type {!Object} */
                    this.uniforms[name].value = initSBC;
                });
            }, this);
            _.each(a, function(javascriptName, prop) {
                this.onPropertyChange(prop, function(jsonName) {
                    this[javascriptName] = jsonName;
                });
            }, this);
            this.extensions = {
                derivatives : true
            };
        };
        update.inherit(t, {
            clone : function(params) {
                var data = params || new update;
                return t.prototype.clone.call(this, data), data.name = this.name, data.transparent = this.transparent, _.each(this.uniforms, function(dom, name) {
                    var value = dom.type;
                    if ("v2" === value || "m4" === value) {
                        data.uniforms[name].value.copy(dom.value);
                    } else {
                        data.uniforms[name].value = dom.value;
                    }
                }, this), data;
            }
        });
        /**
         * @param {!Object} material
         * @return {?}
         */
        update.create = function(material) {
            var source = new update;
            source.uuid = material.uuid;
            source.name = material.name;
            source.transparent = optionalParameter(material.transparent, false);
            source.polygonOffset = optionalParameter(material.polygonOffset, false);
            source.polygonOffsetUnits = optionalParameter(material.polygonOffsetUnits, 0);
            source.polygonOffsetFactor = optionalParameter(material.polygonOffsetFactor, 0);
            var pm = (value.getTexture("white.png"), material.normalMap);
            var color = material.matcapMap;
            return source.uNormalMapFactor = optionalParameter(material.normalMapFactor, 1), source.uFlipY = optionalParameter(material.flipNormals, 0), source.side = optionalParameter(material.side, THREE.FrontSide), pm.needsUpdate = true, color.needsUpdate = true, source.sTextureNormalMap = pm, source.sTextureMatcapMap = color, source;
        };
        /** @type {function(!Function): undefined} */
        module.exports = update;
    }, {
        15 : 15,
        21 : 21
    }],
    21 : [function(canCreateDiscussions, module, n) {
        /** @type {!Array} */
        var keys = ["side", "alphaTest", "transparent", "depthWrite", "shading", "wireframe"];
        /**
         * @param {!Array} obj
         * @return {undefined}
         */
        var Set = function(obj) {
            obj = obj || {};
            THREE.ShaderMaterial.call(this, obj);
            _.each(keys, function(property) {
                var method = obj[property];
                if (void 0 !== method) {
                    this[property] = method;
                }
            }, this);
        };
        Set.inherit(THREE.ShaderMaterial, {
            onPropertyChange : function(e, prop) {
                Object.defineProperty(this, e, {
                    get : function() {
                        return this["_" + e];
                    },
                    set : function(result) {
                        /** @type {number} */
                        this["_" + e] = result;
                        prop.call(this, result);
                    }
                });
            },
            clone : function(to) {
                var material = to || new Set;
                return THREE.Material.prototype.clone.call(this, material), material.shading = this.shading, material.wireframe = this.wireframe, material.wireframeLinewidth = this.wireframeLinewidth, material.fog = this.fog, material.lights = this.lights, material.vertexColors = this.vertexColors, material.skinning = this.skinning, material.morphTargets = this.morphTargets, material.morphNormals = this.morphNormals, material;
            }
        });
        /** @type {function(!Array): undefined} */
        module.exports = Set;
    }, {}],
    22 : [function(__webpack_require__, context, n) {
        /**
         * @param {?} value
         * @param {string} defaultValue
         * @return {?}
         */
        function optionalParameter(value, defaultValue) {
            return void 0 !== value ? value : defaultValue;
        }
        var object = __webpack_require__("23");
        var component = __webpack_require__("15");
        var __WEBPACK_IMPORTED_MODULE_11_date_fns_end_of_month__ = __webpack_require__("4");
        var options = {
            aoFactor : "uAOPBRFactor",
            albedoFactor : "uAlbedoPBRFactor",
            glossFactor : "uGlossinessPBRFactor",
            metalFactor : "uMetalnessPBRFactor",
            opacity : "uOpacityFactor",
            normalMapFactor : "uNormalMapFactor",
            f0Factor : "uSpecularF0Factor",
            albedoMap : "sTextureAlbedoMap",
            normalMap : "sTextureNormalMap",
            normalMap2 : "sTextureNormalMap2",
            aoMap : "sTextureAOMap",
            aoMap2 : "sTextureAOMap2",
            metalGlossMap : "sTexturePBRMaps",
            emissiveMap : "sTextureEmissiveMap",
            lightMap : "sTextureLightMap",
            lightMapDir : "sTextureLightMapDir",
            cubemap : "sSpecularPBR",
            panorama : "sPanoramaPBR",
            sph : "uDiffuseSPH",
            exposure : "uEnvironmentExposure",
            transform : "uEnvironmentTransform",
            occludeSpecular : "uOccludeSpecular",
            alphaTest : "uAlphaTest",
            color : "uColor",
            contrast : "uContrast"
        };
        /**
         * @param {!Function} obj
         * @return {undefined}
         */
        var init = function(obj) {
            /** @type {!Object} */
            obj = Object.assign({
                uniforms : {
                    uAOPBRFactor : {
                        type : "f",
                        value : 1
                    },
                    uAlbedoPBRFactor : {
                        type : "f",
                        value : 1
                    },
                    uGlossinessPBRFactor : {
                        type : "f",
                        value : 1
                    },
                    uMetalnessPBRFactor : {
                        type : "f",
                        value : 1
                    },
                    uNormalMapFactor : {
                        type : "f",
                        value : 1
                    },
                    uSpecularF0Factor : {
                        type : "f",
                        value : 1
                    },
                    uEnvironmentExposure : {
                        type : "f",
                        value : 1
                    },
                    uOpacityFactor : {
                        type : "f",
                        value : 1
                    },
                    sTextureAlbedoMap : {
                        type : "t",
                        value : null
                    },
                    sTextureAlbedoMap2 : {
                        type : "t",
                        value : null
                    },
                    sTextureNormalMap : {
                        type : "t",
                        value : null
                    },
                    sTextureNormalMap2 : {
                        type : "t",
                        value : null
                    },
                    sTextureAOMap : {
                        type : "t",
                        value : null
                    },
                    sTextureAOMap2 : {
                        type : "t",
                        value : null
                    },
                    sTexturePBRMaps : {
                        type : "t",
                        value : null
                    },
                    sTextureEmissiveMap : {
                        type : "t",
                        value : null
                    },
                    sTextureLightMap : {
                        type : "t",
                        value : null
                    },
                    sTextureLightMapDir : {
                        type : "t",
                        value : null
                    },
                    sSpecularPBR : {
                        type : "t",
                        value : null
                    },
                    sPanoramaPBR : {
                        type : "t",
                        value : null
                    },
                    uTextureEnvironmentSpecularPBRLodRange : {
                        type : "v2",
                        value : new THREE.Vector2(10, 5)
                    },
                    uTextureEnvironmentSpecularPBRTextureSize : {
                        type : "v2",
                        value : new THREE.Vector2
                    },
                    uDiffuseSPH : {
                        type : "3fv",
                        value : null
                    },
                    uFlipY : {
                        type : "i",
                        value : 0
                    },
                    uOccludeSpecular : {
                        type : "i",
                        value : 0
                    },
                    uOutputLinear : {
                        type : "i",
                        value : 0
                    },
                    uEnvironmentTransform : {
                        type : "m4",
                        value : new THREE.Matrix4
                    },
                    uMode : {
                        type : "i",
                        value : 0
                    },
                    uColor : {
                        type : "c",
                        value : null
                    },
                    uAlphaTest : {
                        type : "f",
                        value : 0
                    },
                    uContrast : {
                        type : "f",
                        value : 1.1
                    },
                    offsetRepeat : {
                        type : "v4",
                        value : new THREE.Vector4(0, 0, 1, 1)
                    },
                    offsetRepeatDetail : {
                        type : "v4",
                        value : new THREE.Vector4(0, 0, 1, 1)
                    },
                    viewLightDir : {
                        type : "v3",
                        value : new THREE.Vector3
                    },
                    specularHighlights : {
                        type : "i",
                        value : 1
                    },
                    ambientLightColor : {
                        value : []
                    },
                    directionalLights : {
                        value : [],
                        properties : {
                            direction : {},
                            color : {},
                            shadow : {},
                            shadowBias : {},
                            shadowRadius : {},
                            shadowMapSize : {}
                        }
                    },
                    directionalShadowMap : {
                        value : []
                    },
                    directionalShadowMatrix : {
                        value : []
                    },
                    spotLights : {
                        value : [],
                        properties : {
                            color : {},
                            position : {},
                            direction : {},
                            distance : {},
                            coneCos : {},
                            penumbraCos : {},
                            decay : {},
                            shadow : {},
                            shadowBias : {},
                            shadowRadius : {},
                            shadowMapSize : {}
                        }
                    },
                    spotShadowMap : {
                        value : []
                    },
                    spotShadowMatrix : {
                        value : []
                    },
                    pointLights : {
                        value : [],
                        properties : {
                            color : {},
                            position : {},
                            decay : {},
                            distance : {},
                            shadow : {},
                            shadowBias : {},
                            shadowRadius : {},
                            shadowMapSize : {},
                            shadowCameraNear : {},
                            shadowCameraFar : {}
                        }
                    },
                    pointShadowMap : {
                        value : []
                    },
                    pointShadowMatrix : {
                        value : []
                    },
                    hemisphereLights : {
                        value : [],
                        properties : {
                            direction : {},
                            skyColor : {},
                            groundColor : {}
                        }
                    },
                    rectAreaLights : {
                        value : [],
                        properties : {
                            color : {},
                            position : {},
                            width : {},
                            height : {}
                        }
                    },
                    fogNear : {
                        type : "f",
                        value : 225
                    },
                    fogFar : {
                        type : "f",
                        value : 325
                    },
                    fogColor : {
                        type : "c",
                        value : new THREE.Color(10676479)
                    }
                }
            }, obj);
            object.call(this, obj);
            Object.keys(this.uniforms).forEach(function(name) {
                this.onPropertyChange(name, function(initSBC) {
                    /** @type {!Object} */
                    this.uniforms[name].value = initSBC;
                });
            }, this);
            _.each(options, function(javascriptName, prop) {
                this.onPropertyChange(prop, function(jsonName) {
                    this[javascriptName] = jsonName;
                });
            }, this);
            this.extensions = {
                derivatives : true,
                shaderTextureLOD : null !== THREE.Extensions.get("EXT_shader_texture_lod")
            };
            /** @type {boolean} */
            this.pbr = true;
            /** @type {boolean} */
            this.lights = true;
        };
        init.inherit(object, {
            _clone : function(options) {
                var data = options || new init;
                return object.prototype.clone.call(this, data), data.name = this.name, data.transparent = this.transparent, _.each(this.uniforms, function(dom, name) {
                    var value = dom.type;
                    if ("v2" === value || "m4" === value) {
                        data.uniforms[name].value.copy(dom.value);
                    } else {
                        data.uniforms[name].value = dom.value;
                    }
                }, this), data;
            },
            clone : function() {
                var rvm3 = init.create(this.createOptions);
                return rvm3.uuid = THREE.Math.generateUUID(), rvm3;
            },
            updateEnvironmentTransform : function() {
                var q = new THREE.Quaternion;
                var matrix = new THREE.Matrix4;
                return function(uri2, options) {
                    uri2.getWorldQuaternion(q).inverse();
                    matrix.makeRotationY(options || 0);
                    this.uniforms.uEnvironmentTransform.value.makeRotationFromQuaternion(q).multiply(matrix);
                };
            }(),
            refreshOffsetRepeat : function() {
                var uvScaleMap;
                if (this.defines.USE_ALBEDOMAP ? uvScaleMap = this.sTextureAlbedoMap : this.defines.USE_NORMALMAP ? uvScaleMap = this.sTextureNormalMap : this.defines.USE_AOMAP && (uvScaleMap = this.sTextureAOMap), void 0 !== uvScaleMap) {
                    var offset = uvScaleMap.offset;
                    var repeat = uvScaleMap.repeat;
                    this.uniforms.offsetRepeat.value.set(offset.x, offset.y, repeat.x, repeat.y);
                }
            },
            refreshOffsetRepeatDetail : function() {
                var uvScaleMap = this.sTextureNormalMap2;
                if (void 0 !== uvScaleMap) {
                    var offset = uvScaleMap.offset;
                    var repeat = uvScaleMap.repeat;
                    this.uniforms.offsetRepeatDetail.value.set(offset.x, offset.y, repeat.x, repeat.y);
                }
            },
            refreshUniforms : function(mmCoreSplitViewBlock, $state) {
                this.updateEnvironmentTransform(mmCoreSplitViewBlock, $state);
            }
        });
        /**
         * @param {!Object} material
         * @return {?}
         */
        init.create = function(material) {
            var parameters = new init({
                vertexShader : material.vertexShader,
                fragmentShader : material.fragmentShader
            });
            /** @type {!Object} */
            parameters.createOptions = material;
            parameters.uuid = material.uuid;
            parameters.name = material.name;
            parameters.transparent = optionalParameter(material.transparent, false);
            parameters.polygonOffset = optionalParameter(material.polygonOffset, false);
            parameters.polygonOffsetUnits = optionalParameter(material.polygonOffsetUnits, 0);
            parameters.polygonOffsetFactor = optionalParameter(material.polygonOffsetFactor, 0);
            var DEFAULT_RECONNECT_TIME_INCREASE = __WEBPACK_IMPORTED_MODULE_11_date_fns_end_of_month__.CreateWhiteTexture();
            var r = __WEBPACK_IMPORTED_MODULE_11_date_fns_end_of_month__.CreateNormalTexture();
            var options = material.albedoMap || DEFAULT_RECONNECT_TIME_INCREASE;
            var directLoginReference = material.albedoMap2 || DEFAULT_RECONNECT_TIME_INCREASE;
            var flag = material.normalMap || r;
            var cloudDistance = material.normalMap2 || r;
            var hyperParameters = material.aoMap || DEFAULT_RECONNECT_TIME_INCREASE;
            var picture_right_map = material.aoMap2 || DEFAULT_RECONNECT_TIME_INCREASE;
            var picture_below_map = material.metalGlossMap || DEFAULT_RECONNECT_TIME_INCREASE;
            var topTexture = material.emissiveMap || DEFAULT_RECONNECT_TIME_INCREASE;
            var defTexture = material.lightMap || DEFAULT_RECONNECT_TIME_INCREASE;
            var reconnectTimeIncrease = material.lightMapDir || DEFAULT_RECONNECT_TIME_INCREASE;
            var value = component.getSH(material.environment);
            return material.normalMap && (parameters.defines.USE_NORMALMAP = true), material.normalMap2 && (parameters.defines.USE_NORMALMAP2 = true), material.aoMap && (parameters.defines.USE_AOMAP = true), material.aoMap2 && (parameters.defines.USE_AOMAP2 = true), material.emissiveMap && (parameters.defines.USE_EMISSIVEMAP = true), material.lightMap && (parameters.defines.USE_LIGHTMAP = true), material.lightMapDir && (parameters.defines.USE_LIGHTMAP_DIR = true), material.albedoMap && (parameters.defines.USE_ALBEDOMAP =
                true), material.albedoMap2 && (parameters.defines.USE_ALBEDOMAP2 = true), parameters.uAlbedoPBRFactor = optionalParameter(material.albedoFactor, 1), parameters.uNormalMapFactor = optionalParameter(material.normalMapFactor, 1), parameters.uMetalnessPBRFactor = optionalParameter(material.metalFactor, 1), parameters.uGlossinessPBRFactor = optionalParameter(material.glossFactor, 1), parameters.uAOPBRFactor = optionalParameter(material.aoFactor, 1), parameters.uSpecularF0Factor = optionalParameter(material.f0Factor,
                .5), parameters.uEnvironmentExposure = optionalParameter(material.exposure, 1), parameters.occludeSpecular = optionalParameter(material.occludeSpecular ? 1 : 0, 1), parameters.uFlipY = optionalParameter(material.flipNormals, 0), parameters.opacity = optionalParameter(material.opacity, 1), parameters.color = (new THREE.Color).setHex(void 0 !== material.color ? material.color : 16777215), parameters.side = optionalParameter(material.side, THREE.FrontSide), options.needsUpdate = true, directLoginReference.needsUpdate =
                true, flag.needsUpdate = true, cloudDistance.needsUpdate = true, hyperParameters.needsUpdate = true, picture_right_map.needsUpdate = true, picture_below_map.needsUpdate = true, topTexture.needsUpdate = true, defTexture.needsUpdate = true, reconnectTimeIncrease.needsUpdate = true, parameters.sTextureAlbedoMap = options, parameters.sTextureAlbedoMap2 = directLoginReference, parameters.sTextureNormalMap = flag, parameters.sTextureNormalMap2 = cloudDistance, parameters.sTextureAOMap = hyperParameters,
                parameters.sTextureAOMap2 = picture_right_map, parameters.sTexturePBRMaps = picture_below_map, parameters.sTextureEmissiveMap = topTexture, parameters.sTextureLightMap = defTexture, parameters.sTextureLightMapDir = reconnectTimeIncrease, value && (parameters.uDiffuseSPH = new Float32Array(value, 27)), parameters.uEnvironmentTransform = new THREE.Matrix4, material.alphaTest && (parameters.alphaTest = material.alphaTest, parameters.defines.ALPHATEST = true), parameters.refreshOffsetRepeat(),
                parameters.refreshOffsetRepeatDetail(), parameters;
        };
        /** @type {function(!Function): undefined} */
        context.exports = init;
    }, {
        15 : 15,
        23 : 23,
        4 : 4
    }],
    23 : [function(canCreateDiscussions, module, n) {
        /** @type {!Array} */
        var keys = ["side", "alphaTest", "transparent", "depthWrite", "shading", "wireframe"];
        /**
         * @param {!Array} obj
         * @return {undefined}
         */
        var Link = function(obj) {
            obj = obj || {};
            THREE.RawShaderMaterial.call(this, obj);
            _.each(keys, function(property) {
                var method = obj[property];
                if (void 0 !== method) {
                    this[property] = method;
                }
            }, this);
        };
        Link.inherit(THREE.RawShaderMaterial, {
            onPropertyChange : function(e, prop) {
                Object.defineProperty(this, e, {
                    get : function() {
                        return this["_" + e];
                    },
                    set : function(result) {
                        /** @type {number} */
                        this["_" + e] = result;
                        prop.call(this, result);
                    }
                });
            },
            clone : function(dataAndEvents) {
                var material = dataAndEvents || new Material;
                return THREE.RawShaderMaterial.prototype.clone.call(this, material), material.shading = this.shading, material.wireframe = this.wireframe, material.wireframeLinewidth = this.wireframeLinewidth, material.fog = this.fog, material.lights = this.lights, material.vertexColors = this.vertexColors, material.skinning = this.skinning, material.morphTargets = this.morphTargets, material.morphNormals = this.morphNormals, material;
            }
        });
        /** @type {function(!Array): undefined} */
        module.exports = Link;
    }, {}],
    24 : [function(moment, module, val) {
        (function(options, global) {
            !function(f) {
                if ("object" == typeof val && "undefined" != typeof module) {
                    module.exports = f();
                } else {
                    if ("function" == typeof define && define.amd) {
                        define([], f);
                    } else {
                        var g;
                        if ("undefined" != typeof window) {
                            /** @type {!Window} */
                            g = window;
                        } else {
                            if ("undefined" != typeof global) {
                                /** @type {!Object} */
                                g = global;
                            } else {
                                if ("undefined" != typeof self) {
                                    /** @type {!Window} */
                                    g = self;
                                }
                            }
                        }
                        g.Promise = f();
                    }
                }
            }(function() {
                var e;
                var n;
                var i;
                return function e(t, n, r) {
                    /**
                     * @param {string} o
                     * @param {?} u
                     * @return {?}
                     */
                    function s(o, u) {
                        if (!n[o]) {
                            if (!t[o]) {
                                var a = "function" == typeof _dereq_ && _dereq_;
                                if (!u && a) {
                                    return a(o, true);
                                }
                                if (i) {
                                    return i(o, true);
                                }
                                /** @type {!Error} */
                                var f = new Error("Cannot find module '" + o + "'");
                                throw f.code = "MODULE_NOT_FOUND", f;
                            }
                            var u = n[o] = {
                                exports : {}
                            };
                            t[o][0].call(u.exports, function(e) {
                                var n = t[o][1][e];
                                return s(n ? n : e);
                            }, u, u.exports, e, t, n, r);
                        }
                        return n[o].exports;
                    }
                    var i = "function" == typeof _dereq_ && _dereq_;
                    /** @type {number} */
                    var o = 0;
                    for (; o < r.length; o++) {
                        s(r[o]);
                    }
                    return s;
                }({
                    1 : [function(canCreateDiscussions, mixin, n) {
                        /**
                         * @param {!Object} Promise
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise) {
                            /**
                             * @param {?} promises
                             * @return {?}
                             */
                            function any(promises) {
                                var ret = new SomePromiseArray(promises);
                                var r = ret.promise();
                                return ret.setHowMany(1), ret.setUnwrap(), ret.init(), r;
                            }
                            var SomePromiseArray = Promise._SomePromiseArray;
                            /**
                             * @param {?} promises
                             * @return {?}
                             */
                            Promise.any = function(promises) {
                                return any(promises);
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype.any = function() {
                                return any(this);
                            };
                        };
                    }, {}],
                    2 : [function(require, module, canCreateDiscussions) {
                        /**
                         * @return {undefined}
                         */
                        function Async() {
                            /** @type {boolean} */
                            this._customScheduler = false;
                            /** @type {boolean} */
                            this._isTickUsed = false;
                            this._lateQueue = new Queue(16);
                            this._normalQueue = new Queue(16);
                            /** @type {boolean} */
                            this._haveDrainedQueues = false;
                            /** @type {boolean} */
                            this._trampolineEnabled = true;
                            var self = this;
                            /**
                             * @return {undefined}
                             */
                            this.drainQueues = function() {
                                self._drainQueues();
                            };
                            this._schedule = fn;
                        }
                        /**
                         * @param {!Object} fn
                         * @param {!Function} receiver
                         * @param {!Object} arg
                         * @return {undefined}
                         */
                        function AsyncInvokeLater(fn, receiver, arg) {
                            this._lateQueue.push(fn, receiver, arg);
                            this._queueTick();
                        }
                        /**
                         * @param {!Object} fn
                         * @param {!Function} receiver
                         * @param {!Object} arg
                         * @return {undefined}
                         */
                        function AsyncInvoke(fn, receiver, arg) {
                            this._normalQueue.push(fn, receiver, arg);
                            this._queueTick();
                        }
                        /**
                         * @param {!Function} promise
                         * @return {undefined}
                         */
                        function AsyncSettlePromises(promise) {
                            this._normalQueue._pushOne(promise);
                            this._queueTick();
                        }
                        var firstLineError;
                        try {
                            throw new Error;
                        } catch (e) {
                            firstLineError = e;
                        }
                        var fn = require("./schedule");
                        var Queue = require("./queue");
                        var util = require("./util");
                        /**
                         * @param {string} fn
                         * @return {?}
                         */
                        Async.prototype.setScheduler = function(fn) {
                            var prev = this._schedule;
                            return this._schedule = fn, this._customScheduler = true, prev;
                        };
                        /**
                         * @return {?}
                         */
                        Async.prototype.hasCustomScheduler = function() {
                            return this._customScheduler;
                        };
                        /**
                         * @return {undefined}
                         */
                        Async.prototype.enableTrampoline = function() {
                            /** @type {boolean} */
                            this._trampolineEnabled = true;
                        };
                        /**
                         * @return {undefined}
                         */
                        Async.prototype.disableTrampolineIfNecessary = function() {
                            if (util.hasDevTools) {
                                /** @type {boolean} */
                                this._trampolineEnabled = false;
                            }
                        };
                        /**
                         * @return {?}
                         */
                        Async.prototype.haveItemsQueued = function() {
                            return this._isTickUsed || this._haveDrainedQueues;
                        };
                        /**
                         * @param {string} e
                         * @param {?} isNode
                         * @return {undefined}
                         */
                        Async.prototype.fatalError = function(e, isNode) {
                            if (isNode) {
                                options.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) + "\n");
                                options.exit(2);
                            } else {
                                this.throwLater(e);
                            }
                        };
                        /**
                         * @param {!Object} fn
                         * @param {!Function} error
                         * @return {undefined}
                         */
                        Async.prototype.throwLater = function(fn, error) {
                            if (1 === arguments.length && (error = fn, fn = function() {
                                throw error;
                            }), "undefined" != typeof setTimeout) {
                                setTimeout(function() {
                                    fn(error);
                                }, 0);
                            } else {
                                try {
                                    this._schedule(function() {
                                        fn(error);
                                    });
                                } catch (n) {
                                    throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
                                }
                            }
                        };
                        if (util.hasDevTools) {
                            /**
                             * @param {!Function} fn
                             * @param {?} receiver
                             * @param {?} arg
                             * @return {undefined}
                             */
                            Async.prototype.invokeLater = function(fn, receiver, arg) {
                                if (this._trampolineEnabled) {
                                    AsyncInvokeLater.call(this, fn, receiver, arg);
                                } else {
                                    this._schedule(function() {
                                        setTimeout(function() {
                                            fn.call(receiver, arg);
                                        }, 100);
                                    });
                                }
                            };
                            /**
                             * @param {!Function} fn
                             * @param {?} receiver
                             * @param {!Object} arg
                             * @return {undefined}
                             */
                            Async.prototype.invoke = function(fn, receiver, arg) {
                                if (this._trampolineEnabled) {
                                    AsyncInvoke.call(this, fn, receiver, arg);
                                } else {
                                    this._schedule(function() {
                                        fn.call(receiver, arg);
                                    });
                                }
                            };
                            /**
                             * @param {?} promise
                             * @return {undefined}
                             */
                            Async.prototype.settlePromises = function(promise) {
                                if (this._trampolineEnabled) {
                                    AsyncSettlePromises.call(this, promise);
                                } else {
                                    this._schedule(function() {
                                        promise._settlePromises();
                                    });
                                }
                            };
                        } else {
                            /** @type {function(!Object, !Function, !Object): undefined} */
                            Async.prototype.invokeLater = AsyncInvokeLater;
                            /** @type {function(!Object, !Function, !Object): undefined} */
                            Async.prototype.invoke = AsyncInvoke;
                            /** @type {function(!Function): undefined} */
                            Async.prototype.settlePromises = AsyncSettlePromises;
                        }
                        /**
                         * @param {!Array} queue
                         * @return {undefined}
                         */
                        Async.prototype._drainQueue = function(queue) {
                            for (; queue.length() > 0;) {
                                var fn = queue.shift();
                                if ("function" == typeof fn) {
                                    var promise = queue.shift();
                                    var event = queue.shift();
                                    fn.call(promise, event);
                                } else {
                                    fn._settlePromises();
                                }
                            }
                        };
                        /**
                         * @return {undefined}
                         */
                        Async.prototype._drainQueues = function() {
                            this._drainQueue(this._normalQueue);
                            this._reset();
                            /** @type {boolean} */
                            this._haveDrainedQueues = true;
                            this._drainQueue(this._lateQueue);
                        };
                        /**
                         * @return {undefined}
                         */
                        Async.prototype._queueTick = function() {
                            if (!this._isTickUsed) {
                                /** @type {boolean} */
                                this._isTickUsed = true;
                                this._schedule(this.drainQueues);
                            }
                        };
                        /**
                         * @return {undefined}
                         */
                        Async.prototype._reset = function() {
                            /** @type {boolean} */
                            this._isTickUsed = false;
                        };
                        /** @type {function(): undefined} */
                        module.exports = Async;
                        module.exports.firstLineError = firstLineError;
                    }, {
                        "./queue" : 26,
                        "./schedule" : 29,
                        "./util" : 36
                    }],
                    3 : [function(canCreateDiscussions, mixin, n) {
                        /**
                         * @param {!Function} Promise
                         * @param {!Object} INTERNAL
                         * @param {!Object} tryConvertToPromise
                         * @param {?} debug
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise, INTERNAL, tryConvertToPromise, debug) {
                            /** @type {boolean} */
                            var i = false;
                            /**
                             * @param {?} array
                             * @param {undefined} e
                             * @return {undefined}
                             */
                            var completed = function(array, e) {
                                this._reject(e);
                            };
                            /**
                             * @param {!Object} e
                             * @param {?} context
                             * @return {undefined}
                             */
                            var targetRejected = function(e, context) {
                                /** @type {boolean} */
                                context.promiseRejectionQueued = true;
                                context.bindingPromise._then(completed, completed, null, this, e);
                            };
                            /**
                             * @param {?} thisArg
                             * @param {!Event} context
                             * @return {undefined}
                             */
                            var bindingResolved = function(thisArg, context) {
                                if (0 === (50397184 & this._bitField)) {
                                    this._resolveCallback(context.target);
                                }
                            };
                            /**
                             * @param {undefined} e
                             * @param {?} context
                             * @return {undefined}
                             */
                            var bindingRejected = function(e, context) {
                                if (!context.promiseRejectionQueued) {
                                    this._reject(e);
                                }
                            };
                            /**
                             * @param {string} value
                             * @return {?}
                             */
                            Promise.prototype.bind = function(value) {
                                if (!i) {
                                    /** @type {boolean} */
                                    i = true;
                                    Promise.prototype._propagateFrom = debug.propagateFromFunction();
                                    Promise.prototype._boundValue = debug.boundValueFunction();
                                }
                                var maybePromise = tryConvertToPromise(value);
                                var ret = new Promise(INTERNAL);
                                ret._propagateFrom(this, 1);
                                var target = this._target();
                                if (ret._setBoundTo(maybePromise), maybePromise instanceof Promise) {
                                    var context = {
                                        promiseRejectionQueued : false,
                                        promise : ret,
                                        target : target,
                                        bindingPromise : maybePromise
                                    };
                                    target._then(INTERNAL, targetRejected, void 0, ret, context);
                                    maybePromise._then(bindingResolved, bindingRejected, void 0, ret, context);
                                    ret._setOnCancel(maybePromise);
                                } else {
                                    ret._resolveCallback(target);
                                }
                                return ret;
                            };
                            /**
                             * @param {number} obj
                             * @return {undefined}
                             */
                            Promise.prototype._setBoundTo = function(obj) {
                                if (void 0 !== obj) {
                                    /** @type {number} */
                                    this._bitField = 2097152 | this._bitField;
                                    /** @type {number} */
                                    this._boundTo = obj;
                                } else {
                                    /** @type {number} */
                                    this._bitField = this._bitField & -2097153;
                                }
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype._isBound = function() {
                                return 2097152 === (2097152 & this._bitField);
                            };
                            /**
                             * @param {string} type
                             * @param {!Object} data
                             * @return {?}
                             */
                            Promise.bind = function(type, data) {
                                return Promise.resolve(data).bind(type);
                            };
                        };
                    }, {}],
                    4 : [function(saveNotifs, module, n) {
                        /**
                         * @return {?}
                         */
                        function noConflict() {
                            try {
                                if (Promise === bluebird) {
                                    Promise = globalPromise;
                                }
                            } catch (t) {
                            }
                            return bluebird;
                        }
                        var globalPromise;
                        if ("undefined" != typeof Promise) {
                            /** @type {function(new:Promise, function(function((IThenable<TYPE>|TYPE|Thenable|null)=): ?, function(*=): ?): ?): ?} */
                            globalPromise = Promise;
                        }
                        var bluebird = saveNotifs("./promise")();
                        /** @type {function(): ?} */
                        bluebird.noConflict = noConflict;
                        module.exports = bluebird;
                    }, {
                        "./promise" : 22
                    }],
                    5 : [function(require, mixin, n) {
                        /** @type {function((Object|null), (Object|null)=): !Object} */
                        var nativeCreate = Object.create;
                        if (nativeCreate) {
                            /** @type {!Object} */
                            var erodeNoise = nativeCreate(null);
                            /** @type {!Object} */
                            var ruggedNoise = nativeCreate(null);
                            /** @type {number} */
                            erodeNoise[" size"] = ruggedNoise[" size"] = 0;
                        }
                        /**
                         * @param {!Function} Promise
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise) {
                            /**
                             * @param {?} obj
                             * @param {boolean} key
                             * @return {?}
                             */
                            function ensureMethod(obj, key) {
                                var fn;
                                if (null != obj && (fn = obj[key]), "function" != typeof fn) {
                                    /** @type {string} */
                                    var message = "Object " + util.classString(obj) + " has no method '" + util.toString(key) + "'";
                                    throw new Promise.TypeError(message);
                                }
                                return fn;
                            }
                            /**
                             * @param {?} obj
                             * @return {?}
                             */
                            function caller(obj) {
                                var methodName = this.pop();
                                var fn = ensureMethod(obj, methodName);
                                return fn.apply(obj, this);
                            }
                            /**
                             * @param {!Window} b
                             * @return {?}
                             */
                            function R(b) {
                                return b[this];
                            }
                            /**
                             * @param {!NodeList} array
                             * @return {?}
                             */
                            function first(array) {
                                /** @type {number} */
                                var i = +this;
                                return i < 0 && (i = Math.max(0, i + array.length)), array[i];
                            }
                            var checkAndAddDescendantIfModel;
                            var util = require("./util");
                            var canEvaluate = util.canEvaluate;
                            util.isIdentifier;
                            /**
                             * @param {?} obj
                             * @return {?}
                             */
                            Promise.prototype.call = function(obj) {
                                /** @type {!Array<?>} */
                                var args = [].slice.call(arguments, 1);
                                return args.push(obj), this._then(caller, void 0, void 0, args, void 0);
                            };
                            /**
                             * @param {string} value
                             * @return {?}
                             */
                            Promise.prototype.get = function(value) {
                                var r;
                                /** @type {boolean} */
                                var hasDefault = "number" == typeof value;
                                if (hasDefault) {
                                    /** @type {function(!NodeList): ?} */
                                    r = first;
                                } else {
                                    if (canEvaluate) {
                                        var c = checkAndAddDescendantIfModel(value);
                                        r = null !== c ? c : R;
                                    } else {
                                        /** @type {function(!Window): ?} */
                                        r = R;
                                    }
                                }
                                return this._then(r, void 0, void 0, value, void 0);
                            };
                        };
                    }, {
                        "./util" : 36
                    }],
                    6 : [function(require, mixin, n) {
                        /**
                         * @param {!Function} Promise
                         * @param {!Object} obj
                         * @param {!Object} prop
                         * @param {?} config
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise, obj, prop, config) {
                            var util = require("./util");
                            var tryCatch = util.tryCatch;
                            var errorObj = util.errorObj;
                            var async = Promise._async;
                            /** @type {function(): ?} */
                            Promise.prototype["break"] = Promise.prototype.cancel = function() {
                                if (!config.cancellation()) {
                                    return this._warn("cancellation is disabled");
                                }
                                var promise = this;
                                var child = promise;
                                for (; promise._isCancellable();) {
                                    if (!promise._cancelBy(child)) {
                                        if (child._isFollowing()) {
                                            child._followee().cancel();
                                        } else {
                                            child._cancelBranched();
                                        }
                                        break;
                                    }
                                    var parent = promise._cancellationParent;
                                    if (null == parent || !parent._isCancellable()) {
                                        if (promise._isFollowing()) {
                                            promise._followee().cancel();
                                        } else {
                                            promise._cancelBranched();
                                        }
                                        break;
                                    }
                                    if (promise._isFollowing()) {
                                        promise._followee().cancel();
                                    }
                                    promise._setWillBeCancelled();
                                    child = promise;
                                    promise = parent;
                                }
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._branchHasCancelled = function() {
                                this._branchesRemainingToCancel--;
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype._enoughBranchesHaveCancelled = function() {
                                return void 0 === this._branchesRemainingToCancel || this._branchesRemainingToCancel <= 0;
                            };
                            /**
                             * @param {?} canceller
                             * @return {?}
                             */
                            Promise.prototype._cancelBy = function(canceller) {
                                return canceller === this ? (this._branchesRemainingToCancel = 0, this._invokeOnCancel(), true) : (this._branchHasCancelled(), !!this._enoughBranchesHaveCancelled() && (this._invokeOnCancel(), true));
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._cancelBranched = function() {
                                if (this._enoughBranchesHaveCancelled()) {
                                    this._cancel();
                                }
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._cancel = function() {
                                if (this._isCancellable()) {
                                    this._setCancelled();
                                    async.invoke(this._cancelPromises, this, void 0);
                                }
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._cancelPromises = function() {
                                if (this._length() > 0) {
                                    this._settlePromises();
                                }
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._unsetOnCancel = function() {
                                this._onCancelField = void 0;
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype._isCancellable = function() {
                                return this.isPending() && !this._isCancelled();
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype.isCancellable = function() {
                                return this.isPending() && !this.isCancelled();
                            };
                            /**
                             * @param {?} onCancelCallback
                             * @param {string} internalOnly
                             * @return {undefined}
                             */
                            Promise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
                                if (util.isArray(onCancelCallback)) {
                                    /** @type {number} */
                                    var i = 0;
                                    for (; i < onCancelCallback.length; ++i) {
                                        this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
                                    }
                                } else {
                                    if (void 0 !== onCancelCallback) {
                                        if ("function" == typeof onCancelCallback) {
                                            if (!internalOnly) {
                                                var e = tryCatch(onCancelCallback).call(this._boundValue());
                                                if (e === errorObj) {
                                                    this._attachExtraTrace(e.e);
                                                    async.throwLater(e.e);
                                                }
                                            }
                                        } else {
                                            onCancelCallback._resultCancelled(this);
                                        }
                                    }
                                }
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._invokeOnCancel = function() {
                                var onCancelCallback = this._onCancel();
                                this._unsetOnCancel();
                                async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._invokeInternalOnCancel = function() {
                                if (this._isCancellable()) {
                                    this._doInvokeOnCancel(this._onCancel(), true);
                                    this._unsetOnCancel();
                                }
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._resultCancelled = function() {
                                this.cancel();
                            };
                        };
                    }, {
                        "./util" : 36
                    }],
                    7 : [function(_dereq_, mixin, n) {
                        /**
                         * @param {!Function} obj
                         * @return {?}
                         */
                        mixin.exports = function(obj) {
                            /**
                             * @param {!NodeList} instances
                             * @param {!Function} cb
                             * @param {?} promise
                             * @return {?}
                             */
                            function catchFilter(instances, cb, promise) {
                                return function(e) {
                                    var boundTo = promise._boundValue();
                                    /** @type {number} */
                                    var i = 0;
                                    t: for (; i < instances.length; ++i) {
                                        var item = instances[i];
                                        if (item === Error || null != item && item.prototype instanceof Error) {
                                            if (e instanceof item) {
                                                return tryCatch(cb).call(boundTo, e);
                                            }
                                        } else {
                                            if ("function" == typeof item) {
                                                var matchesPredicate = tryCatch(item).call(boundTo, e);
                                                if (matchesPredicate === errorObj) {
                                                    return matchesPredicate;
                                                }
                                                if (matchesPredicate) {
                                                    return tryCatch(cb).call(boundTo, e);
                                                }
                                            } else {
                                                if (util.isObject(e)) {
                                                    var obj = isObject(item);
                                                    /** @type {number} */
                                                    var i = 0;
                                                    for (; i < obj.length; ++i) {
                                                        var key = obj[i];
                                                        if (item[key] != e[key]) {
                                                            continue t;
                                                        }
                                                    }
                                                    return tryCatch(cb).call(boundTo, e);
                                                }
                                            }
                                        }
                                    }
                                    return obj;
                                };
                            }
                            var util = _dereq_("./util");
                            var isObject = _dereq_("./es5").keys;
                            var tryCatch = util.tryCatch;
                            var errorObj = util.errorObj;
                            return catchFilter;
                        };
                    }, {
                        "./es5" : 13,
                        "./util" : 36
                    }],
                    8 : [function(canCreateDiscussions, mixin, n) {
                        /**
                         * @param {!Function} Promise
                         * @return {?}
                         */
                        mixin.exports = function(Promise) {
                            /**
                             * @return {undefined}
                             */
                            function Context() {
                                this._trace = new Context.CapturedTrace(peekContext());
                            }
                            /**
                             * @return {?}
                             */
                            function createContext() {
                                if (i) {
                                    return new Context;
                                }
                            }
                            /**
                             * @return {?}
                             */
                            function peekContext() {
                                /** @type {number} */
                                var i = contextStack.length - 1;
                                if (i >= 0) {
                                    return contextStack[i];
                                }
                            }
                            /** @type {boolean} */
                            var i = false;
                            /** @type {!Array} */
                            var contextStack = [];
                            return Promise.prototype._promiseCreated = function() {
                            }, Promise.prototype._pushContext = function() {
                            }, Promise.prototype._popContext = function() {
                                return null;
                            }, Promise._peekContext = Promise.prototype._peekContext = function() {
                            }, Context.prototype._pushContext = function() {
                                if (void 0 !== this._trace) {
                                    /** @type {null} */
                                    this._trace._promiseCreated = null;
                                    contextStack.push(this._trace);
                                }
                            }, Context.prototype._popContext = function() {
                                if (void 0 !== this._trace) {
                                    var trace = contextStack.pop();
                                    var ret = trace._promiseCreated;
                                    return trace._promiseCreated = null, ret;
                                }
                                return null;
                            }, Context.CapturedTrace = null, Context.create = createContext, Context.deactivateLongStackTraces = function() {
                            }, Context.activateLongStackTraces = function() {
                                var Promise_pushContext = Promise.prototype._pushContext;
                                var Promise_popContext = Promise.prototype._popContext;
                                var Promise_PeekContext = Promise._peekContext;
                                var Promise_peekContext = Promise.prototype._peekContext;
                                /** @type {function(): undefined} */
                                var Promise_promiseCreated = Promise.prototype._promiseCreated;
                                /**
                                 * @return {undefined}
                                 */
                                Context.deactivateLongStackTraces = function() {
                                    Promise.prototype._pushContext = Promise_pushContext;
                                    Promise.prototype._popContext = Promise_popContext;
                                    Promise._peekContext = Promise_PeekContext;
                                    Promise.prototype._peekContext = Promise_peekContext;
                                    /** @type {function(): undefined} */
                                    Promise.prototype._promiseCreated = Promise_promiseCreated;
                                    /** @type {boolean} */
                                    i = false;
                                };
                                /** @type {boolean} */
                                i = true;
                                /** @type {function(): undefined} */
                                Promise.prototype._pushContext = Context.prototype._pushContext;
                                /** @type {function(): ?} */
                                Promise.prototype._popContext = Context.prototype._popContext;
                                /** @type {function(): ?} */
                                Promise._peekContext = Promise.prototype._peekContext = peekContext;
                                /**
                                 * @return {undefined}
                                 */
                                Promise.prototype._promiseCreated = function() {
                                    var ctx = this._peekContext();
                                    if (ctx && null == ctx._promiseCreated) {
                                        ctx._promiseCreated = this;
                                    }
                                };
                            }, Context;
                        };
                    }, {}],
                    9 : [function(_dereq_, mixin, canCreateDiscussions) {
                        /**
                         * @param {!Object} Promise
                         * @param {!Object} Context
                         * @return {?}
                         */
                        mixin.exports = function(Promise, Context) {
                            /**
                             * @param {?} name
                             * @param {!Object} promise
                             * @return {?}
                             */
                            function generatePromiseLifecycleEventObject(name, promise) {
                                return {
                                    promise : promise
                                };
                            }
                            /**
                             * @return {?}
                             */
                            function defaultFireEvent() {
                                return false;
                            }
                            /**
                             * @param {!Function} executor
                             * @param {!Function} resolve
                             * @param {!Function} reject
                             * @return {?}
                             */
                            function cancellationExecute(executor, resolve, reject) {
                                var promise = this;
                                try {
                                    executor(resolve, reject, function(onCancel) {
                                        if ("function" != typeof onCancel) {
                                            throw new TypeError("onCancel must be a function, got: " + util.toString(onCancel));
                                        }
                                        promise._attachCancellationCallback(onCancel);
                                    });
                                } catch (e) {
                                    return e;
                                }
                            }
                            /**
                             * @param {!Array} onCancel
                             * @return {?}
                             */
                            function cancellationAttachCancellationCallback(onCancel) {
                                if (!this._isCancellable()) {
                                    return this;
                                }
                                var previousOnCancel = this._onCancel();
                                if (void 0 !== previousOnCancel) {
                                    if (util.isArray(previousOnCancel)) {
                                        previousOnCancel.push(onCancel);
                                    } else {
                                        this._setOnCancel([previousOnCancel, onCancel]);
                                    }
                                } else {
                                    this._setOnCancel(onCancel);
                                }
                            }
                            /**
                             * @return {?}
                             */
                            function cancellationOnCancel() {
                                return this._onCancelField;
                            }
                            /**
                             * @param {!Object} obj
                             * @return {undefined}
                             */
                            function cancellationSetOnCancel(obj) {
                                /** @type {!Object} */
                                this._onCancelField = obj;
                            }
                            /**
                             * @return {undefined}
                             */
                            function cancellationClearCancellationData() {
                                this._cancellationParent = void 0;
                                this._onCancelField = void 0;
                            }
                            /**
                             * @param {!Object} parent
                             * @param {number} flags
                             * @return {undefined}
                             */
                            function cancellationPropagateFrom(parent, flags) {
                                if (0 !== (1 & flags)) {
                                    /** @type {!Object} */
                                    this._cancellationParent = parent;
                                    var branchesRemainingToCancel = parent._branchesRemainingToCancel;
                                    if (void 0 === branchesRemainingToCancel) {
                                        /** @type {number} */
                                        branchesRemainingToCancel = 0;
                                    }
                                    parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
                                }
                                if (0 !== (2 & flags) && parent._isBound()) {
                                    this._setBoundTo(parent._boundTo);
                                }
                            }
                            /**
                             * @param {!Object} parent
                             * @param {number} flags
                             * @return {undefined}
                             */
                            function bindingPropagateFrom(parent, flags) {
                                if (0 !== (2 & flags) && parent._isBound()) {
                                    this._setBoundTo(parent._boundTo);
                                }
                            }
                            /**
                             * @return {?}
                             */
                            function boundValueFunction() {
                                var ret = this._boundTo;
                                return void 0 !== ret && ret instanceof Promise ? ret.isFulfilled() ? ret.value() : void 0 : ret;
                            }
                            /**
                             * @return {undefined}
                             */
                            function longStackTracesCaptureStackTrace() {
                                this._trace = new CapturedTrace(this._peekContext());
                            }
                            /**
                             * @param {!Object} error
                             * @param {boolean} ignoreSelf
                             * @return {undefined}
                             */
                            function longStackTracesAttachExtraTrace(error, ignoreSelf) {
                                if (canAttachTrace(error)) {
                                    var trace = this._trace;
                                    if (void 0 !== trace && ignoreSelf && (trace = trace._parent), void 0 !== trace) {
                                        trace.attachExtraTrace(error);
                                    } else {
                                        if (!error.__stackCleaned__) {
                                            var parsed = parseStackAndMessage(error);
                                            util.notEnumerableProp(error, "stack", parsed.message + "\n" + parsed.stack.join("\n"));
                                            util.notEnumerableProp(error, "__stackCleaned__", true);
                                        }
                                    }
                                }
                            }
                            /**
                             * @param {number} returnValue
                             * @param {number} promiseCreated
                             * @param {string} name
                             * @param {!Function} promise
                             * @param {number} parent
                             * @return {undefined}
                             */
                            function checkForgottenReturns(returnValue, promiseCreated, name, promise, parent) {
                                if (void 0 === returnValue && null !== promiseCreated && wForgottenReturn) {
                                    if (void 0 !== parent && parent._returnedNonUndefined()) {
                                        return;
                                    }
                                    if (0 === (65535 & promise._bitField)) {
                                        return;
                                    }
                                    if (name) {
                                        /** @type {string} */
                                        name = name + " ";
                                    }
                                    /** @type {string} */
                                    var th_field = "";
                                    /** @type {string} */
                                    var creatorLine = "";
                                    if (promiseCreated._trace) {
                                        var traceLines = promiseCreated._trace.stack.split("\n");
                                        var stack = cleanStack(traceLines);
                                        /** @type {number} */
                                        var i = stack.length - 1;
                                        for (; i >= 0; --i) {
                                            var line = stack[i];
                                            if (!MULTI_LINE_COMMENT_REGEX.test(line)) {
                                                var scheduledStuff = line.match(scheduledRE);
                                                if (scheduledStuff) {
                                                    /** @type {string} */
                                                    th_field = "at " + scheduledStuff[1] + ":" + scheduledStuff[2] + ":" + scheduledStuff[3] + " ";
                                                }
                                                break;
                                            }
                                        }
                                        if (stack.length > 0) {
                                            var firstUserLine = stack[0];
                                            /** @type {number} */
                                            i = 0;
                                            for (; i < traceLines.length; ++i) {
                                                if (traceLines[i] === firstUserLine) {
                                                    if (i > 0) {
                                                        creatorLine = "\n" + traceLines[i - 1];
                                                    }
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    /** @type {string} */
                                    var msg = "a promise was created in a " + name + "handler " + th_field + "but was not returned from it, see http://goo.gl/rRqMUw" + creatorLine;
                                    promise._warn(msg, true, promiseCreated);
                                }
                            }
                            /**
                             * @param {string} name
                             * @param {string} res
                             * @return {?}
                             */
                            function deprecated(name, res) {
                                /** @type {string} */
                                var message = name + " is deprecated and will be removed in a future version.";
                                return res && (message = message + (" Use " + res + " instead.")), warn(message);
                            }
                            /**
                             * @param {string} text
                             * @param {!Object} type
                             * @param {?} promise
                             * @return {undefined}
                             */
                            function warn(text, type, promise) {
                                if (config.warnings) {
                                    var ctx;
                                    var warning = new Warning(text);
                                    if (type) {
                                        promise._attachExtraTrace(warning);
                                    } else {
                                        if (config.longStackTraces && (ctx = Promise._peekContext())) {
                                            ctx.attachExtraTrace(warning);
                                        } else {
                                            var parsed = parseStackAndMessage(warning);
                                            warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
                                        }
                                    }
                                    if (!activeFireEvent("warning", warning)) {
                                        formatAndLogError(warning, "", true);
                                    }
                                }
                            }
                            /**
                             * @param {string} message
                             * @param {!Array} stacks
                             * @return {?}
                             */
                            function reconstructStack(message, stacks) {
                                /** @type {number} */
                                var i = 0;
                                for (; i < stacks.length - 1; ++i) {
                                    stacks[i].push("From previous event:");
                                    stacks[i] = stacks[i].join("\n");
                                }
                                return i < stacks.length && (stacks[i] = stacks[i].join("\n")), message + "\n" + stacks.join("\n");
                            }
                            /**
                             * @param {!Array} stacks
                             * @return {undefined}
                             */
                            function removeDuplicateOrEmptyJumps(stacks) {
                                /** @type {number} */
                                var i = 0;
                                for (; i < stacks.length; ++i) {
                                    if (0 === stacks[i].length || i + 1 < stacks.length && stacks[i][0] === stacks[i + 1][0]) {
                                        stacks.splice(i, 1);
                                        i--;
                                    }
                                }
                            }
                            /**
                             * @param {!Array} stacks
                             * @return {undefined}
                             */
                            function removeCommonRoots(stacks) {
                                var current = stacks[0];
                                /** @type {number} */
                                var i = 1;
                                for (; i < stacks.length; ++i) {
                                    var prev = stacks[i];
                                    /** @type {number} */
                                    var currentLastIndex = current.length - 1;
                                    var currentLastLine = current[currentLastIndex];
                                    /** @type {number} */
                                    var aWeightIndex = -1;
                                    /** @type {number} */
                                    var j = prev.length - 1;
                                    for (; j >= 0; --j) {
                                        if (prev[j] === currentLastLine) {
                                            /** @type {number} */
                                            aWeightIndex = j;
                                            break;
                                        }
                                    }
                                    /** @type {number} */
                                    j = aWeightIndex;
                                    for (; j >= 0; --j) {
                                        var line = prev[j];
                                        if (current[currentLastIndex] !== line) {
                                            break;
                                        }
                                        current.pop();
                                        currentLastIndex--;
                                    }
                                    current = prev;
                                }
                            }
                            /**
                             * @param {!NodeList} stack
                             * @return {?}
                             */
                            function cleanStack(stack) {
                                /** @type {!Array} */
                                var ret = [];
                                /** @type {number} */
                                var i = 0;
                                for (; i < stack.length; ++i) {
                                    var line = stack[i];
                                    var isTraceLine = "    (No stack trace)" === line || copy.test(line);
                                    var isInternalFrame = isTraceLine && shouldIgnore(line);
                                    if (isTraceLine && !isInternalFrame) {
                                        if (Y && " " !== line.charAt(0)) {
                                            /** @type {string} */
                                            line = "    " + line;
                                        }
                                        ret.push(line);
                                    }
                                }
                                return ret;
                            }
                            /**
                             * @param {!Object} error
                             * @return {?}
                             */
                            function stackFramesAsArray(error) {
                                var currentArray = error.stack.replace(/\s+$/g, "").split("\n");
                                /** @type {number} */
                                var i = 0;
                                for (; i < currentArray.length; ++i) {
                                    var obj = currentArray[i];
                                    if ("    (No stack trace)" === obj || copy.test(obj)) {
                                        break;
                                    }
                                }
                                return i > 0 && "SyntaxError" != error.name && (currentArray = currentArray.slice(i)), currentArray;
                            }
                            /**
                             * @param {!Object} error
                             * @return {?}
                             */
                            function parseStackAndMessage(error) {
                                var stack = error.stack;
                                var msg_obj = error.toString();
                                return stack = "string" == typeof stack && stack.length > 0 ? stackFramesAsArray(error) : ["    (No stack trace)"], {
                                    message : msg_obj,
                                    stack : "SyntaxError" == error.name ? stack : cleanStack(stack)
                                };
                            }
                            /**
                             * @param {string} error
                             * @param {string} title
                             * @param {string} isSoft
                             * @return {undefined}
                             */
                            function formatAndLogError(error, title, isSoft) {
                                if ("undefined" != typeof console) {
                                    var message;
                                    if (util.isObject(error)) {
                                        var stack = error.stack;
                                        message = title + log(stack, error);
                                    } else {
                                        /** @type {string} */
                                        message = title + String(error);
                                    }
                                    if ("function" == typeof printWarning) {
                                        printWarning(message, isSoft);
                                    } else {
                                        if (!("function" != typeof console.log && "object" != typeof console.log)) {
                                            console.log(message);
                                        }
                                    }
                                }
                            }
                            /**
                             * @param {string} name
                             * @param {?} localHandler
                             * @param {string} reason
                             * @param {?} promise
                             * @return {undefined}
                             */
                            function fireRejectionEvent(name, localHandler, reason, promise) {
                                /** @type {boolean} */
                                var defaultType = false;
                                try {
                                    if ("function" == typeof localHandler) {
                                        /** @type {boolean} */
                                        defaultType = true;
                                        if ("rejectionHandled" === name) {
                                            localHandler(promise);
                                        } else {
                                            localHandler(reason, promise);
                                        }
                                    }
                                } catch (e) {
                                    async.throwLater(e);
                                }
                                if ("unhandledRejection" === name) {
                                    if (!(activeFireEvent(name, reason, promise) || defaultType)) {
                                        formatAndLogError(reason, "Unhandled rejection ");
                                    }
                                } else {
                                    activeFireEvent(name, promise);
                                }
                            }
                            /**
                             * @param {string} value
                             * @return {?}
                             */
                            function find(value) {
                                var r;
                                if ("function" == typeof value) {
                                    /** @type {string} */
                                    r = "[function " + (value.name || "anonymous") + "]";
                                } else {
                                    r = value && "function" == typeof value.toString ? value.toString() : util.toString(value);
                                    /** @type {!RegExp} */
                                    var n = /\[object [a-zA-Z0-9$_]+\]/;
                                    if (n.test(r)) {
                                        try {
                                            /** @type {string} */
                                            var len = JSON.stringify(value);
                                            /** @type {string} */
                                            r = len;
                                        } catch (i) {
                                        }
                                    }
                                    if (0 === r.length) {
                                        /** @type {string} */
                                        r = "(empty array)";
                                    }
                                }
                                return "(<" + S(r) + ">, no stack trace)";
                            }
                            /**
                             * @param {string} t
                             * @return {?}
                             */
                            function S(t) {
                                /** @type {number} */
                                var c = 41;
                                return t.length < c ? t : t.substr(0, c - 3) + "...";
                            }
                            /**
                             * @return {?}
                             */
                            function longStackTracesIsSupported() {
                                return "function" == typeof captureStackTrace;
                            }
                            /**
                             * @param {string} line
                             * @return {?}
                             */
                            function parseLineInfo(line) {
                                var matches = line.match(moduleRe);
                                if (matches) {
                                    return {
                                        fileName : matches[1],
                                        line : parseInt(matches[2], 10)
                                    };
                                }
                            }
                            /**
                             * @param {!Error} firstLineError
                             * @param {!Error} lastLineError
                             * @return {undefined}
                             */
                            function setBounds(firstLineError, lastLineError) {
                                if (longStackTracesIsSupported()) {
                                    var firstFileName;
                                    var lastFileName;
                                    var firstStackLines = firstLineError.stack.split("\n");
                                    var lastStackLines = lastLineError.stack.split("\n");
                                    /** @type {number} */
                                    var firstIndex = -1;
                                    /** @type {number} */
                                    var lastIndex = -1;
                                    /** @type {number} */
                                    var i = 0;
                                    for (; i < firstStackLines.length; ++i) {
                                        var result = parseLineInfo(firstStackLines[i]);
                                        if (result) {
                                            firstFileName = result.fileName;
                                            firstIndex = result.line;
                                            break;
                                        }
                                    }
                                    /** @type {number} */
                                    i = 0;
                                    for (; i < lastStackLines.length; ++i) {
                                        result = parseLineInfo(lastStackLines[i]);
                                        if (result) {
                                            lastFileName = result.fileName;
                                            lastIndex = result.line;
                                            break;
                                        }
                                    }
                                    if (!(firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName || firstFileName !== lastFileName || firstIndex >= lastIndex)) {
                                        /**
                                         * @param {string} line
                                         * @return {?}
                                         */
                                        shouldIgnore = function(line) {
                                            if (nullRe.test(line)) {
                                                return true;
                                            }
                                            var info = parseLineInfo(line);
                                            return !!(info && info.fileName === firstFileName && firstIndex <= info.line && info.line <= lastIndex);
                                        };
                                    }
                                }
                            }
                            /**
                             * @param {number} parent
                             * @return {undefined}
                             */
                            function CapturedTrace(parent) {
                                /** @type {number} */
                                this._parent = parent;
                                /** @type {number} */
                                this._promisesCreated = 0;
                                var length = this._length = 1 + (void 0 === parent ? 0 : parent._length);
                                captureStackTrace(this, CapturedTrace);
                                if (length > 32) {
                                    this.uncycle();
                                }
                            }
                            var possiblyUnhandledRejection;
                            var unhandledRejectionHandled;
                            var printWarning;
                            var getDomain = Promise._getDomain;
                            var async = Promise._async;
                            var Warning = _dereq_("./errors").Warning;
                            var util = _dereq_("./util");
                            var canAttachTrace = util.canAttachTrace;
                            /** @type {!RegExp} */
                            var nullRe = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
                            /** @type {!RegExp} */
                            var MULTI_LINE_COMMENT_REGEX = /\((?:timers\.js):\d+:\d+\)/;
                            /** @type {!RegExp} */
                            var scheduledRE = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
                            /** @type {null} */
                            var copy = null;
                            /** @type {null} */
                            var log = null;
                            /** @type {boolean} */
                            var Y = false;
                            /** @type {boolean} */
                            var q = !(0 == util.env("BLUEBIRD_DEBUG"));
                            /** @type {boolean} */
                            var warnings = !(0 == util.env("BLUEBIRD_WARNINGS") || !q && !util.env("BLUEBIRD_WARNINGS"));
                            /** @type {boolean} */
                            var Z = !(0 == util.env("BLUEBIRD_LONG_STACK_TRACES") || !q && !util.env("BLUEBIRD_LONG_STACK_TRACES"));
                            /** @type {boolean} */
                            var wForgottenReturn = 0 != util.env("BLUEBIRD_W_FORGOTTEN_RETURN") && (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype.suppressUnhandledRejections = function() {
                                var target = this._target();
                                /** @type {number} */
                                target._bitField = target._bitField & -1048577 | 524288;
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._ensurePossibleRejectionHandled = function() {
                                if (0 === (524288 & this._bitField)) {
                                    this._setRejectionIsUnhandled();
                                    var method = this;
                                    setTimeout(function() {
                                        method._notifyUnhandledRejection();
                                    }, 1);
                                }
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._notifyUnhandledRejectionIsHandled = function() {
                                fireRejectionEvent("rejectionHandled", possiblyUnhandledRejection, void 0, this);
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._setReturnedNonUndefined = function() {
                                /** @type {number} */
                                this._bitField = 268435456 | this._bitField;
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype._returnedNonUndefined = function() {
                                return 0 !== (268435456 & this._bitField);
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._notifyUnhandledRejection = function() {
                                if (this._isRejectionUnhandled()) {
                                    var reason = this._settledValue();
                                    this._setUnhandledRejectionIsNotified();
                                    fireRejectionEvent("unhandledRejection", unhandledRejectionHandled, reason, this);
                                }
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._setUnhandledRejectionIsNotified = function() {
                                /** @type {number} */
                                this._bitField = 262144 | this._bitField;
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._unsetUnhandledRejectionIsNotified = function() {
                                /** @type {number} */
                                this._bitField = this._bitField & -262145;
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype._isUnhandledRejectionNotified = function() {
                                return (262144 & this._bitField) > 0;
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._setRejectionIsUnhandled = function() {
                                /** @type {number} */
                                this._bitField = 1048576 | this._bitField;
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._unsetRejectionIsUnhandled = function() {
                                /** @type {number} */
                                this._bitField = this._bitField & -1048577;
                                if (this._isUnhandledRejectionNotified()) {
                                    this._unsetUnhandledRejectionIsNotified();
                                    this._notifyUnhandledRejectionIsHandled();
                                }
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype._isRejectionUnhandled = function() {
                                return (1048576 & this._bitField) > 0;
                            };
                            /**
                             * @param {string} file
                             * @param {string} msg
                             * @param {number} promise
                             * @return {?}
                             */
                            Promise.prototype._warn = function(file, msg, promise) {
                                return warn(file, msg, promise || this);
                            };
                            /**
                             * @param {string} fn
                             * @return {undefined}
                             */
                            Promise.onPossiblyUnhandledRejection = function(fn) {
                                var string = getDomain();
                                unhandledRejectionHandled = "function" == typeof fn ? null === string ? fn : util.domainBind(string, fn) : void 0;
                            };
                            /**
                             * @param {string} fn
                             * @return {undefined}
                             */
                            Promise.onUnhandledRejectionHandled = function(fn) {
                                var string = getDomain();
                                possiblyUnhandledRejection = "function" == typeof fn ? null === string ? fn : util.domainBind(string, fn) : void 0;
                            };
                            /**
                             * @return {undefined}
                             */
                            var disableLongStackTraces = function() {
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.longStackTraces = function() {
                                if (async.haveItemsQueued() && !config.longStackTraces) {
                                    throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
                                }
                                if (!config.longStackTraces && longStackTracesIsSupported()) {
                                    var Promise_captureStackTrace = Promise.prototype._captureStackTrace;
                                    var Promise_attachExtraTrace = Promise.prototype._attachExtraTrace;
                                    /** @type {boolean} */
                                    config.longStackTraces = true;
                                    /**
                                     * @return {undefined}
                                     */
                                    disableLongStackTraces = function() {
                                        if (async.haveItemsQueued() && !config.longStackTraces) {
                                            throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
                                        }
                                        Promise.prototype._captureStackTrace = Promise_captureStackTrace;
                                        Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
                                        Context.deactivateLongStackTraces();
                                        async.enableTrampoline();
                                        /** @type {boolean} */
                                        config.longStackTraces = false;
                                    };
                                    /** @type {function(): undefined} */
                                    Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
                                    /** @type {function(!Object, boolean): undefined} */
                                    Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
                                    Context.activateLongStackTraces();
                                    async.disableTrampolineIfNecessary();
                                }
                            };
                            /**
                             * @return {?}
                             */
                            Promise.hasLongStackTraces = function() {
                                return config.longStackTraces && longStackTracesIsSupported();
                            };
                            var fireDomEvent = function() {
                                try {
                                    if ("function" == typeof CustomEvent) {
                                        /** @type {!CustomEvent} */
                                        var event = new CustomEvent("CustomEvent");
                                        return util.global.dispatchEvent(event), function(p_Interval, data) {
                                            /** @type {!CustomEvent} */
                                            var wdoYoutubePlayerReadyEvent = new CustomEvent(p_Interval.toLowerCase(), {
                                                detail : data,
                                                cancelable : true
                                            });
                                            return !util.global.dispatchEvent(wdoYoutubePlayerReadyEvent);
                                        };
                                    }
                                    if ("function" == typeof Event) {
                                        /** @type {!Event} */
                                        event = new Event("CustomEvent");
                                        return util.global.dispatchEvent(event), function(p_Interval, event) {
                                            /** @type {!Event} */
                                            var domEvent = new Event(p_Interval.toLowerCase(), {
                                                cancelable : true
                                            });
                                            return domEvent.detail = event, !util.global.dispatchEvent(domEvent);
                                        };
                                    }
                                    /** @type {(Event|null)} */
                                    event = document.createEvent("CustomEvent");
                                    return event.initCustomEvent("testingtheevent", false, true, {}), util.global.dispatchEvent(event), function(p_Interval, data) {
                                        /** @type {(Event|null)} */
                                        var event = document.createEvent("CustomEvent");
                                        return event.initCustomEvent(p_Interval.toLowerCase(), false, true, data), !util.global.dispatchEvent(event);
                                    };
                                } catch (e) {
                                }
                                return function() {
                                    return false;
                                };
                            }();
                            var fireGlobalEvent = function() {
                                return util.isNode ? function() {
                                    return options.emit.apply(options, arguments);
                                } : util.global ? function(p_Interval) {
                                    var methodName = "on" + p_Interval.toLowerCase();
                                    var method = util.global[methodName];
                                    return !!method && (method.apply(util.global, [].slice.call(arguments, 1)), true);
                                } : function() {
                                    return false;
                                };
                            }();
                            var eventToObjectGenerator = {
                                promiseCreated : generatePromiseLifecycleEventObject,
                                promiseFulfilled : generatePromiseLifecycleEventObject,
                                promiseRejected : generatePromiseLifecycleEventObject,
                                promiseResolved : generatePromiseLifecycleEventObject,
                                promiseCancelled : generatePromiseLifecycleEventObject,
                                promiseChained : function(name, promise, child) {
                                    return {
                                        promise : promise,
                                        child : child
                                    };
                                },
                                warning : function(name, warning) {
                                    return {
                                        warning : warning
                                    };
                                },
                                unhandledRejection : function(name, reason, promise) {
                                    return {
                                        reason : reason,
                                        promise : promise
                                    };
                                },
                                rejectionHandled : generatePromiseLifecycleEventObject
                            };
                            /**
                             * @param {string} name
                             * @return {?}
                             */
                            var activeFireEvent = function(name) {
                                /** @type {boolean} */
                                var globalEventFired = false;
                                try {
                                    globalEventFired = fireGlobalEvent.apply(null, arguments);
                                } catch (e) {
                                    async.throwLater(e);
                                    /** @type {boolean} */
                                    globalEventFired = true;
                                }
                                /** @type {boolean} */
                                var domEventFired = false;
                                try {
                                    domEventFired = fireDomEvent(name, eventToObjectGenerator[name].apply(null, arguments));
                                } catch (e) {
                                    async.throwLater(e);
                                    /** @type {boolean} */
                                    domEventFired = true;
                                }
                                return domEventFired || globalEventFired;
                            };
                            /**
                             * @param {!Object} opts
                             * @return {?}
                             */
                            Promise.config = function(opts) {
                                if (opts = Object(opts), "longStackTraces" in opts && (opts.longStackTraces ? Promise.longStackTraces() : !opts.longStackTraces && Promise.hasLongStackTraces() && disableLongStackTraces()), "warnings" in opts) {
                                    var warningsOption = opts.warnings;
                                    /** @type {boolean} */
                                    config.warnings = !!warningsOption;
                                    /** @type {boolean} */
                                    wForgottenReturn = config.warnings;
                                    if (util.isObject(warningsOption) && "wForgottenReturn" in warningsOption) {
                                        /** @type {boolean} */
                                        wForgottenReturn = !!warningsOption.wForgottenReturn;
                                    }
                                }
                                if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
                                    if (async.haveItemsQueued()) {
                                        throw new Error("cannot enable cancellation after promises are in use");
                                    }
                                    /** @type {function(): undefined} */
                                    Promise.prototype._clearCancellationData = cancellationClearCancellationData;
                                    /** @type {function(!Object, number): undefined} */
                                    Promise.prototype._propagateFrom = cancellationPropagateFrom;
                                    /** @type {function(): ?} */
                                    Promise.prototype._onCancel = cancellationOnCancel;
                                    /** @type {function(!Object): undefined} */
                                    Promise.prototype._setOnCancel = cancellationSetOnCancel;
                                    /** @type {function(!Array): ?} */
                                    Promise.prototype._attachCancellationCallback = cancellationAttachCancellationCallback;
                                    /** @type {function(!Function, !Function, !Function): ?} */
                                    Promise.prototype._execute = cancellationExecute;
                                    /** @type {function(!Object, number): undefined} */
                                    propagateFromFunction = cancellationPropagateFrom;
                                    /** @type {boolean} */
                                    config.cancellation = true;
                                }
                                return "monitoring" in opts && (opts.monitoring && !config.monitoring ? (config.monitoring = true, Promise.prototype._fireEvent = activeFireEvent) : !opts.monitoring && config.monitoring && (config.monitoring = false, Promise.prototype._fireEvent = defaultFireEvent)), Promise;
                            };
                            /** @type {function(): ?} */
                            Promise.prototype._fireEvent = defaultFireEvent;
                            /**
                             * @param {!Function} executor
                             * @param {!Function} resolve
                             * @param {!Function} reject
                             * @return {?}
                             */
                            Promise.prototype._execute = function(executor, resolve, reject) {
                                try {
                                    executor(resolve, reject);
                                } catch (e) {
                                    return e;
                                }
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._onCancel = function() {
                            };
                            /**
                             * @param {!Array} handler
                             * @return {undefined}
                             */
                            Promise.prototype._setOnCancel = function(handler) {
                            };
                            /**
                             * @param {!Object} onCancel
                             * @return {undefined}
                             */
                            Promise.prototype._attachCancellationCallback = function(onCancel) {
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._captureStackTrace = function() {
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._attachExtraTrace = function() {
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._clearCancellationData = function() {
                            };
                            /**
                             * @param {!Object} parent
                             * @param {number} flags
                             * @return {undefined}
                             */
                            Promise.prototype._propagateFrom = function(parent, flags) {
                            };
                            /** @type {function(!Object, number): undefined} */
                            var propagateFromFunction = bindingPropagateFrom;
                            /**
                             * @return {?}
                             */
                            var shouldIgnore = function() {
                                return false;
                            };
                            /** @type {!RegExp} */
                            var moduleRe = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
                            util.inherits(CapturedTrace, Error);
                            /** @type {function(number): undefined} */
                            Context.CapturedTrace = CapturedTrace;
                            /**
                             * @return {undefined}
                             */
                            CapturedTrace.prototype.uncycle = function() {
                                var length = this._length;
                                if (!(length < 2)) {
                                    /** @type {!Array} */
                                    var nodes = [];
                                    var stackToIndex = {};
                                    /** @type {number} */
                                    var i = 0;
                                    var cur = this;
                                    for (; void 0 !== cur; ++i) {
                                        nodes.push(cur);
                                        cur = cur._parent;
                                    }
                                    /** @type {number} */
                                    length = this._length = i;
                                    /** @type {number} */
                                    i = length - 1;
                                    for (; i >= 0; --i) {
                                        var stack = nodes[i].stack;
                                        if (void 0 === stackToIndex[stack]) {
                                            /** @type {number} */
                                            stackToIndex[stack] = i;
                                        }
                                    }
                                    /** @type {number} */
                                    i = 0;
                                    for (; i < length; ++i) {
                                        var currentStack = nodes[i].stack;
                                        var index = stackToIndex[currentStack];
                                        if (void 0 !== index && index !== i) {
                                            if (index > 0) {
                                                nodes[index - 1]._parent = void 0;
                                                /** @type {number} */
                                                nodes[index - 1]._length = 1;
                                            }
                                            nodes[i]._parent = void 0;
                                            /** @type {number} */
                                            nodes[i]._length = 1;
                                            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;
                                            if (index < length - 1) {
                                                cycleEdgeNode._parent = nodes[index + 1];
                                                cycleEdgeNode._parent.uncycle();
                                                cycleEdgeNode._length = cycleEdgeNode._parent._length + 1;
                                            } else {
                                                cycleEdgeNode._parent = void 0;
                                                /** @type {number} */
                                                cycleEdgeNode._length = 1;
                                            }
                                            var currentChildLength = cycleEdgeNode._length + 1;
                                            /** @type {number} */
                                            var j = i - 2;
                                            for (; j >= 0; --j) {
                                                nodes[j]._length = currentChildLength;
                                                currentChildLength++;
                                            }
                                            return;
                                        }
                                    }
                                }
                            };
                            /**
                             * @param {!Object} error
                             * @return {undefined}
                             */
                            CapturedTrace.prototype.attachExtraTrace = function(error) {
                                if (!error.__stackCleaned__) {
                                    this.uncycle();
                                    var parsed = parseStackAndMessage(error);
                                    var message = parsed.message;
                                    /** @type {!Array} */
                                    var stacks = [parsed.stack];
                                    var trace = this;
                                    for (; void 0 !== trace;) {
                                        stacks.push(cleanStack(trace.stack.split("\n")));
                                        trace = trace._parent;
                                    }
                                    removeCommonRoots(stacks);
                                    removeDuplicateOrEmptyJumps(stacks);
                                    util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
                                    util.notEnumerableProp(error, "__stackCleaned__", true);
                                }
                            };
                            var captureStackTrace = function() {
                                /** @type {!RegExp} */
                                var o = /^\s*at\s*/;
                                /**
                                 * @param {string} type
                                 * @param {string} event
                                 * @return {?}
                                 */
                                var print = function(type, event) {
                                    return "string" == typeof type ? type : void 0 !== event.name && void 0 !== event.message ? event.toString() : find(event);
                                };
                                if ("number" == typeof Error.stackTraceLimit && "function" == typeof Error.captureStackTrace) {
                                    Error.stackTraceLimit += 6;
                                    /** @type {!RegExp} */
                                    copy = o;
                                    /** @type {function(string, string): ?} */
                                    log = print;
                                    /** @type {function((Object|null), (!Function|null)=): undefined} */
                                    var captureStackTrace = Error.captureStackTrace;
                                    return shouldIgnore = function(line) {
                                        return nullRe.test(line);
                                    }, function(receiver, ignoreUntil) {
                                        Error.stackTraceLimit += 6;
                                        captureStackTrace(receiver, ignoreUntil);
                                        Error.stackTraceLimit -= 6;
                                    };
                                }
                                /** @type {!Error} */
                                var err = new Error;
                                if ("string" == typeof err.stack && err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
                                    return copy = /@/, log = print, Y = true, function(to) {
                                        /** @type {string} */
                                        to.stack = (new Error).stack;
                                    };
                                }
                                var hasStackAfterThrow;
                                try {
                                    throw new Error;
                                } catch (e) {
                                    /** @type {boolean} */
                                    hasStackAfterThrow = "stack" in e;
                                }
                                return "stack" in err || !hasStackAfterThrow || "number" != typeof Error.stackTraceLimit ? (log = function(type, a) {
                                    return "string" == typeof type ? type : "object" != typeof a && "function" != typeof a || void 0 === a.name || void 0 === a.message ? find(a) : a.toString();
                                }, null) : (copy = o, log = print, function(err2) {
                                    Error.stackTraceLimit += 6;
                                    try {
                                        throw new Error;
                                    } catch (err) {
                                        err2.stack = err.stack;
                                    }
                                    Error.stackTraceLimit -= 6;
                                });
                            }([]);
                            if ("undefined" != typeof console && "undefined" != typeof console.warn) {
                                /**
                                 * @param {string} message
                                 * @return {undefined}
                                 */
                                printWarning = function(message) {
                                    console.warn(message);
                                };
                                if (util.isNode && options.stderr.isTTY) {
                                    /**
                                     * @param {string} message
                                     * @param {string} isSoft
                                     * @return {undefined}
                                     */
                                    printWarning = function(message, isSoft) {
                                        /** @type {string} */
                                        var color = isSoft ? "\u001b[33m" : "\u001b[31m";
                                        console.warn(color + message + "\u001b[0m\n");
                                    };
                                } else {
                                    if (!(util.isNode || "string" != typeof(new Error).stack)) {
                                        /**
                                         * @param {string} message
                                         * @param {string} isSoft
                                         * @return {undefined}
                                         */
                                        printWarning = function(message, isSoft) {
                                            console.warn("%c" + message, isSoft ? "color: darkorange" : "color: red");
                                        };
                                    }
                                }
                            }
                            var config = {
                                warnings : warnings,
                                longStackTraces : false,
                                cancellation : false,
                                monitoring : false
                            };
                            return Z && Promise.longStackTraces(), {
                                longStackTraces : function() {
                                    return config.longStackTraces;
                                },
                                warnings : function() {
                                    return config.warnings;
                                },
                                cancellation : function() {
                                    return config.cancellation;
                                },
                                monitoring : function() {
                                    return config.monitoring;
                                },
                                propagateFromFunction : function() {
                                    return propagateFromFunction;
                                },
                                boundValueFunction : function() {
                                    return boundValueFunction;
                                },
                                checkForgottenReturns : checkForgottenReturns,
                                setBounds : setBounds,
                                warn : warn,
                                deprecated : deprecated,
                                CapturedTrace : CapturedTrace,
                                fireDomEvent : fireDomEvent,
                                fireGlobalEvent : fireGlobalEvent
                            };
                        };
                    }, {
                        "./errors" : 12,
                        "./util" : 36
                    }],
                    10 : [function(canCreateDiscussions, mixin, n) {
                        /**
                         * @param {!Function} Promise
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise) {
                            /**
                             * @return {?}
                             */
                            function returner() {
                                return this.value;
                            }
                            /**
                             * @return {?}
                             */
                            function thrower() {
                                throw this.reason;
                            }
                            /** @type {function(!Object): ?} */
                            Promise.prototype["return"] = Promise.prototype.thenReturn = function(value) {
                                return value instanceof Promise && value.suppressUnhandledRejections(), this._then(returner, void 0, void 0, {
                                    value : value
                                }, void 0);
                            };
                            /** @type {function(string): ?} */
                            Promise.prototype["throw"] = Promise.prototype.thenThrow = function(reason) {
                                return this._then(thrower, void 0, void 0, {
                                    reason : reason
                                }, void 0);
                            };
                            /**
                             * @param {string} reason
                             * @return {?}
                             */
                            Promise.prototype.catchThrow = function(reason) {
                                if (arguments.length <= 1) {
                                    return this._then(void 0, thrower, void 0, {
                                        reason : reason
                                    }, void 0);
                                }
                                var matched_check = arguments[1];
                                /**
                                 * @return {?}
                                 */
                                var handler = function() {
                                    throw matched_check;
                                };
                                return this.caught(reason, handler);
                            };
                            /**
                             * @param {!Object} value
                             * @return {?}
                             */
                            Promise.prototype.catchReturn = function(value) {
                                if (arguments.length <= 1) {
                                    return value instanceof Promise && value.suppressUnhandledRejections(), this._then(void 0, returner, void 0, {
                                        value : value
                                    }, void 0);
                                }
                                var _value = arguments[1];
                                if (_value instanceof Promise) {
                                    _value.suppressUnhandledRejections();
                                }
                                /**
                                 * @return {?}
                                 */
                                var handler = function() {
                                    return _value;
                                };
                                return this.caught(value, handler);
                            };
                        };
                    }, {}],
                    11 : [function(canCreateDiscussions, mixin, n) {
                        /**
                         * @param {!Object} Promise
                         * @param {!Array} INTERNAL
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise, INTERNAL) {
                            /**
                             * @return {?}
                             */
                            function mapper() {
                                return all(this);
                            }
                            /**
                             * @param {!Arguments} promises
                             * @param {!Array} fn
                             * @return {?}
                             */
                            function PromiseMapSeries(promises, fn) {
                                return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
                            }
                            var PromiseReduce = Promise.reduce;
                            var all = Promise.all;
                            /**
                             * @param {!Function} fn
                             * @return {?}
                             */
                            Promise.prototype.each = function(fn) {
                                return PromiseReduce(this, fn, INTERNAL, 0)._then(mapper, void 0, void 0, this, void 0);
                            };
                            /**
                             * @param {!Array} fn
                             * @return {?}
                             */
                            Promise.prototype.mapSeries = function(fn) {
                                return PromiseReduce(this, fn, INTERNAL, INTERNAL);
                            };
                            /**
                             * @param {!Function} value
                             * @param {!Function} fn
                             * @return {?}
                             */
                            Promise.each = function(value, fn) {
                                return PromiseReduce(value, fn, INTERNAL, 0)._then(mapper, void 0, void 0, value, void 0);
                            };
                            /** @type {function(!Arguments, !Array): ?} */
                            Promise.mapSeries = PromiseMapSeries;
                        };
                    }, {}],
                    12 : [function(require, module, n) {
                        /**
                         * @param {string} nameProperty
                         * @param {string} defaultMessage
                         * @return {?}
                         */
                        function subError(nameProperty, defaultMessage) {
                            /**
                             * @param {string} message
                             * @return {?}
                             */
                            function SubError(message) {
                                return this instanceof SubError ? (notEnumerableProp(this, "message", "string" == typeof message ? message : defaultMessage), notEnumerableProp(this, "name", nameProperty), void(Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : Error.call(this))) : new SubError(message);
                            }
                            return inherits(SubError, Error), SubError;
                        }
                        /**
                         * @param {number} message
                         * @return {?}
                         */
                        function OperationalError(message) {
                            return this instanceof OperationalError ? (notEnumerableProp(this, "name", "OperationalError"), notEnumerableProp(this, "message", message), this.cause = message, this.isOperational = true, void(message instanceof Error ? (notEnumerableProp(this, "message", message.message), notEnumerableProp(this, "stack", message.stack)) : Error.captureStackTrace && Error.captureStackTrace(this, this.constructor))) : new OperationalError(message);
                        }
                        var _TypeError;
                        var _RangeError;
                        var es5 = require("./es5");
                        var Objectfreeze = es5.freeze;
                        var util = require("./util");
                        var inherits = util.inherits;
                        var notEnumerableProp = util.notEnumerableProp;
                        var Warning = subError("Warning", "warning");
                        var CancellationError = subError("CancellationError", "cancellation error");
                        var TimeoutError = subError("TimeoutError", "timeout error");
                        var AggregateError = subError("AggregateError", "aggregate error");
                        try {
                            /** @type {function(new:TypeError, *=, *=, *=): !TypeError} */
                            _TypeError = TypeError;
                            /** @type {function(new:RangeError, *=, *=, *=): !RangeError} */
                            _RangeError = RangeError;
                        } catch (m) {
                            _TypeError = subError("TypeError", "type error");
                            _RangeError = subError("RangeError", "range error");
                        }
                        /** @type {!Array<string>} */
                        var methods = "join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" ");
                        /** @type {number} */
                        var i = 0;
                        for (; i < methods.length; ++i) {
                            if ("function" == typeof Array.prototype[methods[i]]) {
                                AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
                            }
                        }
                        es5.defineProperty(AggregateError.prototype, "length", {
                            value : 0,
                            configurable : false,
                            writable : true,
                            enumerable : true
                        });
                        /** @type {boolean} */
                        AggregateError.prototype.isOperational = true;
                        /** @type {number} */
                        var length = 0;
                        /**
                         * @return {?}
                         */
                        AggregateError.prototype.toString = function() {
                            /** @type {string} */
                            var strStart = Array(4 * length + 1).join(" ");
                            /** @type {string} */
                            var seed_to_use_for_salt = "\n" + strStart + "AggregateError of:\n";
                            length++;
                            /** @type {string} */
                            strStart = Array(4 * length + 1).join(" ");
                            /** @type {number} */
                            var i = 0;
                            for (; i < this.length; ++i) {
                                var _ = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
                                var dataA = _.split("\n");
                                /** @type {number} */
                                var b = 0;
                                for (; b < dataA.length; ++b) {
                                    dataA[b] = strStart + dataA[b];
                                }
                                _ = dataA.join("\n");
                                /** @type {string} */
                                seed_to_use_for_salt = seed_to_use_for_salt + (_ + "\n");
                            }
                            return length--, seed_to_use_for_salt;
                        };
                        inherits(OperationalError, Error);
                        var errorTypes = Error.__BluebirdErrorTypes__;
                        if (!errorTypes) {
                            errorTypes = Objectfreeze({
                                CancellationError : CancellationError,
                                TimeoutError : TimeoutError,
                                OperationalError : OperationalError,
                                RejectionError : OperationalError,
                                AggregateError : AggregateError
                            });
                            es5.defineProperty(Error, "__BluebirdErrorTypes__", {
                                value : errorTypes,
                                writable : false,
                                enumerable : false,
                                configurable : false
                            });
                        }
                        module.exports = {
                            Error : Error,
                            TypeError : _TypeError,
                            RangeError : _RangeError,
                            CancellationError : errorTypes.CancellationError,
                            OperationalError : errorTypes.OperationalError,
                            TimeoutError : errorTypes.TimeoutError,
                            AggregateError : errorTypes.AggregateError,
                            Warning : Warning
                        };
                    }, {
                        "./es5" : 13,
                        "./util" : 36
                    }],
                    13 : [function(canCreateDiscussions, module, n) {
                        var isES5 = function() {
                            return void 0 === this;
                        }();
                        if (isES5) {
                            module.exports = {
                                freeze : Object.freeze,
                                defineProperty : Object.defineProperty,
                                getDescriptor : Object.getOwnPropertyDescriptor,
                                keys : Object.keys,
                                names : Object.getOwnPropertyNames,
                                getPrototypeOf : Object.getPrototypeOf,
                                isArray : Array.isArray,
                                isES5 : isES5,
                                propertyIsWritable : function(obj, prop) {
                                    /** @type {(ObjectPropertyDescriptor<?>|undefined)} */
                                    var desc = Object.getOwnPropertyDescriptor(obj, prop);
                                    return !(desc && !desc.writable && !desc.set);
                                }
                            };
                        } else {
                            /** @type {function(this:Object, *): boolean} */
                            var hasOwnProperty = {}.hasOwnProperty;
                            /** @type {function(this:*): string} */
                            var objToString = {}.toString;
                            var prototypeOfObject = {}.constructor.prototype;
                            /**
                             * @param {?} o
                             * @return {?}
                             */
                            var ObjectKeys = function(o) {
                                /** @type {!Array} */
                                var ret = [];
                                var key;
                                for (key in o) {
                                    if (hasOwnProperty.call(o, key)) {
                                        ret.push(key);
                                    }
                                }
                                return ret;
                            };
                            /**
                             * @param {!Object} date
                             * @param {string} name
                             * @return {?}
                             */
                            var c = function(date, name) {
                                return {
                                    value : date[name]
                                };
                            };
                            /**
                             * @param {!Function} o
                             * @param {string} key
                             * @param {!Object} obj
                             * @return {?}
                             */
                            var ObjectDefineProperty = function(o, key, obj) {
                                return o[key] = obj.value, o;
                            };
                            /**
                             * @param {?} s
                             * @return {?}
                             */
                            var bv_trim = function(s) {
                                return s;
                            };
                            /**
                             * @param {?} o
                             * @return {?}
                             */
                            var getPrototypeOf = function(o) {
                                try {
                                    return Object(o).constructor.prototype;
                                } catch (e) {
                                    return prototypeOfObject;
                                }
                            };
                            /**
                             * @param {!Array} obj
                             * @return {?}
                             */
                            var _isArray = function(obj) {
                                try {
                                    return "[object Array]" === objToString.call(obj);
                                } catch (e) {
                                    return false;
                                }
                            };
                            module.exports = {
                                isArray : _isArray,
                                keys : ObjectKeys,
                                names : ObjectKeys,
                                defineProperty : ObjectDefineProperty,
                                getDescriptor : c,
                                freeze : bv_trim,
                                getPrototypeOf : getPrototypeOf,
                                isES5 : isES5,
                                propertyIsWritable : function() {
                                    return true;
                                }
                            };
                        }
                    }, {}],
                    14 : [function(canCreateDiscussions, mixin, n) {
                        /**
                         * @param {string} obj
                         * @param {!Object} a
                         * @return {undefined}
                         */
                        mixin.exports = function(obj, a) {
                            var callback = obj.map;
                            /**
                             * @param {!Function} target
                             * @param {(Object|string)} data
                             * @return {?}
                             */
                            obj.prototype.filter = function(target, data) {
                                return callback(this, target, data, a);
                            };
                            /**
                             * @param {!Function} fn
                             * @param {undefined} data
                             * @param {(Object|string)} target
                             * @return {?}
                             */
                            obj.filter = function(fn, data, target) {
                                return callback(fn, data, target, a);
                            };
                        };
                    }, {}],
                    15 : [function(require, mixin, n) {
                        /**
                         * @param {string} Promise
                         * @param {!Object} tryConvertToPromise
                         * @param {!Object} NEXT_FILTER
                         * @return {?}
                         */
                        mixin.exports = function(Promise, tryConvertToPromise, NEXT_FILTER) {
                            /**
                             * @param {!Object} promise
                             * @param {string} type
                             * @param {!Function} handler
                             * @return {undefined}
                             */
                            function PassThroughHandlerContext(promise, type, handler) {
                                /** @type {!Object} */
                                this.promise = promise;
                                /** @type {string} */
                                this.type = type;
                                /** @type {!Function} */
                                this.handler = handler;
                                /** @type {boolean} */
                                this.called = false;
                                /** @type {null} */
                                this.cancelPromise = null;
                            }
                            /**
                             * @param {?} finallyHandler
                             * @return {undefined}
                             */
                            function FinallyHandlerCancelReaction(finallyHandler) {
                                this.finallyHandler = finallyHandler;
                            }
                            /**
                             * @param {?} ctx
                             * @param {string} reason
                             * @return {?}
                             */
                            function checkCancel(ctx, reason) {
                                return null != ctx.cancelPromise && (arguments.length > 1 ? ctx.cancelPromise._reject(reason) : ctx.cancelPromise._cancel(), ctx.cancelPromise = null, true);
                            }
                            /**
                             * @return {?}
                             */
                            function succeed() {
                                return finallyHandler.call(this, this.promise._target()._settledValue());
                            }
                            /**
                             * @param {string} reason
                             * @return {?}
                             */
                            function fail(reason) {
                                if (!checkCancel(this, reason)) {
                                    return errorObj.e = reason, errorObj;
                                }
                            }
                            /**
                             * @param {!Function} reasonOrValue
                             * @return {?}
                             */
                            function finallyHandler(reasonOrValue) {
                                var promise = this.promise;
                                var handler = this.handler;
                                if (!this.called) {
                                    /** @type {boolean} */
                                    this.called = true;
                                    var ret = this.isFinallyHandler() ? handler.call(promise._boundValue()) : handler.call(promise._boundValue(), reasonOrValue);
                                    if (ret === NEXT_FILTER) {
                                        return ret;
                                    }
                                    if (void 0 !== ret) {
                                        promise._setReturnedNonUndefined();
                                        var maybePromise = tryConvertToPromise(ret, promise);
                                        if (maybePromise instanceof Promise) {
                                            if (null != this.cancelPromise) {
                                                if (maybePromise._isCancelled()) {
                                                    var reason = new CancellationError("late cancellation observer");
                                                    return promise._attachExtraTrace(reason), errorObj.e = reason, errorObj;
                                                }
                                                if (maybePromise.isPending()) {
                                                    maybePromise._attachCancellationCallback(new FinallyHandlerCancelReaction(this));
                                                }
                                            }
                                            return maybePromise._then(succeed, fail, void 0, this, void 0);
                                        }
                                    }
                                }
                                return promise.isRejected() ? (checkCancel(this), errorObj.e = reasonOrValue, errorObj) : (checkCancel(this), reasonOrValue);
                            }
                            var util = require("./util");
                            var CancellationError = Promise.CancellationError;
                            var errorObj = util.errorObj;
                            var catchFilter = require("./catch_filter")(NEXT_FILTER);
                            return PassThroughHandlerContext.prototype.isFinallyHandler = function() {
                                return 0 === this.type;
                            }, FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
                                checkCancel(this.finallyHandler);
                            }, Promise.prototype._passThrough = function(handler, type, success, fail) {
                                return "function" != typeof handler ? this.then() : this._then(success, fail, void 0, new PassThroughHandlerContext(this, type, handler), void 0);
                            }, Promise.prototype.lastly = Promise.prototype["finally"] = function(handlerOrPredicate) {
                                return this._passThrough(handlerOrPredicate, 0, finallyHandler, finallyHandler);
                            }, Promise.prototype.tap = function(handler) {
                                return this._passThrough(handler, 1, finallyHandler);
                            }, Promise.prototype.tapCatch = function(handlerOrPredicate) {
                                /** @type {number} */
                                var l = arguments.length;
                                if (1 === l) {
                                    return this._passThrough(handlerOrPredicate, 1, void 0, finallyHandler);
                                }
                                var i;
                                /** @type {!Array} */
                                var catchInstances = new Array(l - 1);
                                /** @type {number} */
                                var j = 0;
                                /** @type {number} */
                                i = 0;
                                for (; i < l - 1; ++i) {
                                    var item = arguments[i];
                                    if (!util.isObject(item)) {
                                        return Promise.reject(new TypeError("tapCatch statement predicate: expecting an object but got " + util.classString(item)));
                                    }
                                    catchInstances[j++] = item;
                                }
                                /** @type {number} */
                                catchInstances.length = j;
                                var handler = arguments[i];
                                return this._passThrough(catchFilter(catchInstances, handler, this), 1, void 0, finallyHandler);
                            }, PassThroughHandlerContext;
                        };
                    }, {
                        "./catch_filter" : 7,
                        "./util" : 36
                    }],
                    16 : [function(require, mixin, n) {
                        /**
                         * @param {!Object} Promise
                         * @param {!Object} fn
                         * @param {!Object} INTERNAL
                         * @param {?} tryConvertToPromise
                         * @param {!Function} Proxyable
                         * @param {!Object} debug
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise, fn, INTERNAL, tryConvertToPromise, Proxyable, debug) {
                            /**
                             * @param {?} value
                             * @param {!NodeList} yieldHandlers
                             * @param {?} traceParent
                             * @return {?}
                             */
                            function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
                                /** @type {number} */
                                var i = 0;
                                for (; i < yieldHandlers.length; ++i) {
                                    traceParent._pushContext();
                                    var ret = tryCatch(yieldHandlers[i])(value);
                                    if (traceParent._popContext(), ret === errorObj) {
                                        traceParent._pushContext();
                                        var s = Promise.reject(errorObj.e);
                                        return traceParent._popContext(), s;
                                    }
                                    var maybePromise = tryConvertToPromise(ret, traceParent);
                                    if (maybePromise instanceof Promise) {
                                        return maybePromise;
                                    }
                                }
                                return null;
                            }
                            /**
                             * @param {string} generatorFunction
                             * @param {!Function} receiver
                             * @param {?} yieldHandler
                             * @param {string} stack
                             * @return {undefined}
                             */
                            function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
                                if (debug.cancellation()) {
                                    var promise = new Promise(INTERNAL);
                                    var _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
                                    this._promise = promise.lastly(function() {
                                        return _finallyPromise;
                                    });
                                    promise._captureStackTrace();
                                    promise._setOnCancel(this);
                                } else {
                                    var promise = this._promise = new Promise(INTERNAL);
                                    promise._captureStackTrace();
                                }
                                /** @type {string} */
                                this._stack = stack;
                                /** @type {string} */
                                this._generatorFunction = generatorFunction;
                                /** @type {!Function} */
                                this._receiver = receiver;
                                this._generator = void 0;
                                /** @type {!Array<?>} */
                                this._yieldHandlers = "function" == typeof yieldHandler ? [yieldHandler].concat(s) : s;
                                /** @type {null} */
                                this._yieldedPromise = null;
                                /** @type {boolean} */
                                this._cancellationPhase = false;
                            }
                            var errors = require("./errors");
                            var TypeError = errors.TypeError;
                            var util = require("./util");
                            var errorObj = util.errorObj;
                            var tryCatch = util.tryCatch;
                            /** @type {!Array} */
                            var s = [];
                            util.inherits(PromiseSpawn, Proxyable);
                            /**
                             * @return {?}
                             */
                            PromiseSpawn.prototype._isResolved = function() {
                                return null === this._promise;
                            };
                            /**
                             * @return {undefined}
                             */
                            PromiseSpawn.prototype._cleanup = function() {
                                /** @type {null} */
                                this._promise = this._generator = null;
                                if (debug.cancellation() && null !== this._finallyPromise) {
                                    this._finallyPromise._fulfill();
                                    /** @type {null} */
                                    this._finallyPromise = null;
                                }
                            };
                            /**
                             * @return {undefined}
                             */
                            PromiseSpawn.prototype._promiseCancelled = function() {
                                if (!this._isResolved()) {
                                    var result;
                                    /** @type {boolean} */
                                    var refresh = "undefined" != typeof this._generator["return"];
                                    if (refresh) {
                                        this._promise._pushContext();
                                        result = tryCatch(this._generator["return"]).call(this._generator, void 0);
                                        this._promise._popContext();
                                    } else {
                                        var reason = new Promise.CancellationError("generator .return() sentinel");
                                        Promise.coroutine.returnSentinel = reason;
                                        this._promise._attachExtraTrace(reason);
                                        this._promise._pushContext();
                                        result = tryCatch(this._generator["throw"]).call(this._generator, reason);
                                        this._promise._popContext();
                                    }
                                    /** @type {boolean} */
                                    this._cancellationPhase = true;
                                    /** @type {null} */
                                    this._yieldedPromise = null;
                                    this._continue(result);
                                }
                            };
                            /**
                             * @param {string} value
                             * @return {undefined}
                             */
                            PromiseSpawn.prototype._promiseFulfilled = function(value) {
                                /** @type {null} */
                                this._yieldedPromise = null;
                                this._promise._pushContext();
                                var result = tryCatch(this._generator.next).call(this._generator, value);
                                this._promise._popContext();
                                this._continue(result);
                            };
                            /**
                             * @param {!Object} reason
                             * @return {undefined}
                             */
                            PromiseSpawn.prototype._promiseRejected = function(reason) {
                                /** @type {null} */
                                this._yieldedPromise = null;
                                this._promise._attachExtraTrace(reason);
                                this._promise._pushContext();
                                var result = tryCatch(this._generator["throw"]).call(this._generator, reason);
                                this._promise._popContext();
                                this._continue(result);
                            };
                            /**
                             * @return {undefined}
                             */
                            PromiseSpawn.prototype._resultCancelled = function() {
                                if (this._yieldedPromise instanceof Promise) {
                                    var promise = this._yieldedPromise;
                                    /** @type {null} */
                                    this._yieldedPromise = null;
                                    promise.cancel();
                                }
                            };
                            /**
                             * @return {?}
                             */
                            PromiseSpawn.prototype.promise = function() {
                                return this._promise;
                            };
                            /**
                             * @return {undefined}
                             */
                            PromiseSpawn.prototype._run = function() {
                                this._generator = this._generatorFunction.call(this._receiver);
                                this._receiver = this._generatorFunction = void 0;
                                this._promiseFulfilled(void 0);
                            };
                            /**
                             * @param {!Object} result
                             * @return {?}
                             */
                            PromiseSpawn.prototype._continue = function(result) {
                                var promise = this._promise;
                                if (result === errorObj) {
                                    return this._cleanup(), this._cancellationPhase ? promise.cancel() : promise._rejectCallback(result.e, false);
                                }
                                var value = result.value;
                                if (result.done === true) {
                                    return this._cleanup(), this._cancellationPhase ? promise.cancel() : promise._resolveCallback(value);
                                }
                                var maybePromise = tryConvertToPromise(value, this._promise);
                                if (!(maybePromise instanceof Promise) && (maybePromise = promiseFromYieldHandler(maybePromise, this._yieldHandlers, this._promise), null === maybePromise)) {
                                    return void this._promiseRejected(new TypeError("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s", String(value)) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")));
                                }
                                maybePromise = maybePromise._target();
                                var bitField = maybePromise._bitField;
                                if (0 === (50397184 & bitField)) {
                                    this._yieldedPromise = maybePromise;
                                    maybePromise._proxy(this, null);
                                } else {
                                    if (0 !== (33554432 & bitField)) {
                                        Promise._async.invoke(this._promiseFulfilled, this, maybePromise._value());
                                    } else {
                                        if (0 !== (16777216 & bitField)) {
                                            Promise._async.invoke(this._promiseRejected, this, maybePromise._reason());
                                        } else {
                                            this._promiseCancelled();
                                        }
                                    }
                                }
                            };
                            /**
                             * @param {!Function} value
                             * @param {?} options
                             * @return {?}
                             */
                            Promise.coroutine = function(value, options) {
                                if ("function" != typeof value) {
                                    throw new TypeError("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
                                }
                                var yieldHandler = Object(options).yieldHandler;
                                /** @type {function(string, !Function, ?, string): undefined} */
                                var PromiseSpawn$ = PromiseSpawn;
                                /** @type {string} */
                                var stack = (new Error).stack;
                                return function() {
                                    var generator = value.apply(this, arguments);
                                    var spawn = new PromiseSpawn$(void 0, void 0, yieldHandler, stack);
                                    var a = spawn.promise();
                                    return spawn._generator = generator, spawn._promiseFulfilled(void 0), a;
                                };
                            };
                            /**
                             * @param {(Object|string)} fn
                             * @return {undefined}
                             */
                            Promise.coroutine.addYieldHandler = function(fn) {
                                if ("function" != typeof fn) {
                                    throw new TypeError("expecting a function but got " + util.classString(fn));
                                }
                                s.push(fn);
                            };
                            /**
                             * @param {string} generatorFunction
                             * @return {?}
                             */
                            Promise.spawn = function(generatorFunction) {
                                if (debug.deprecated("Promise.spawn()", "Promise.coroutine()"), "function" != typeof generatorFunction) {
                                    return fn("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
                                }
                                var spawn = new PromiseSpawn(generatorFunction, this);
                                var i = spawn.promise();
                                return spawn._run(Promise.spawn), i;
                            };
                        };
                    }, {
                        "./errors" : 12,
                        "./util" : 36
                    }],
                    17 : [function(require, mixin, n) {
                        /**
                         * @param {!Array} Promise
                         * @param {!Object} PromiseArray
                         * @param {!Object} INTERNAL
                         * @param {?} apiRejection
                         * @param {?} tryConvertToPromise
                         * @param {?} NEXT_FILTER
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise, PromiseArray, INTERNAL, apiRejection, tryConvertToPromise, NEXT_FILTER) {
                            var util = require("./util");
                            util.canEvaluate;
                            util.tryCatch;
                            util.errorObj;
                            /**
                             * @return {?}
                             */
                            Promise.join = function() {
                                var fn;
                                /** @type {number} */
                                var length = arguments.length - 1;
                                if (length > 0 && "function" == typeof arguments[length]) {
                                    fn = arguments[length];
                                    var exports;
                                }
                                /** @type {!Array<?>} */
                                var args = [].slice.call(arguments);
                                if (fn) {
                                    args.pop();
                                }
                                exports = (new PromiseArray(args)).promise();
                                return void 0 !== fn ? exports.spread(fn) : exports;
                            };
                        };
                    }, {
                        "./util" : 36
                    }],
                    18 : [function(require, mixin, n) {
                        /**
                         * @param {string} Promise
                         * @param {!Object} PromiseArray
                         * @param {!Object} apiRejection
                         * @param {?} tryConvertToPromise
                         * @param {?} INTERNAL
                         * @param {?} debug
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
                            /**
                             * @param {?} promises
                             * @param {!Function} fn
                             * @param {number} limit
                             * @param {?} _filter
                             * @return {undefined}
                             */
                            function MappingPromiseArray(promises, fn, limit, _filter) {
                                this.constructor$(promises);
                                this._promise._captureStackTrace();
                                var string = getDomain();
                                this._callback = null === string ? fn : util.domainBind(string, fn);
                                /** @type {(Array|null)} */
                                this._preservedValues = _filter === INTERNAL ? new Array(this.length()) : null;
                                /** @type {number} */
                                this._limit = limit;
                                /** @type {number} */
                                this._inFlight = 0;
                                /** @type {!Array} */
                                this._queue = [];
                                async.invoke(this._asyncInit, this, void 0);
                            }
                            /**
                             * @param {!Function} promises
                             * @param {string} fn
                             * @param {!Object} options
                             * @param {!Function} _filter
                             * @return {?}
                             */
                            function map(promises, fn, options, _filter) {
                                if ("function" != typeof fn) {
                                    return apiRejection("expecting a function but got " + util.classString(fn));
                                }
                                /** @type {number} */
                                var limit = 0;
                                if (void 0 !== options) {
                                    if ("object" != typeof options || null === options) {
                                        return Promise.reject(new TypeError("options argument must be an object but it is " + util.classString(options)));
                                    }
                                    if ("number" != typeof options.concurrency) {
                                        return Promise.reject(new TypeError("'concurrency' must be a number but it is " + util.classString(options.concurrency)));
                                    }
                                    /** @type {number} */
                                    limit = options.concurrency;
                                }
                                return limit = "number" == typeof limit && isFinite(limit) && limit >= 1 ? limit : 0, (new MappingPromiseArray(promises, fn, limit, _filter)).promise();
                            }
                            var getDomain = Promise._getDomain;
                            var util = require("./util");
                            var tryCatch = util.tryCatch;
                            var errorObj = util.errorObj;
                            var async = Promise._async;
                            util.inherits(MappingPromiseArray, PromiseArray);
                            /**
                             * @return {undefined}
                             */
                            MappingPromiseArray.prototype._asyncInit = function() {
                                this._init$(void 0, -2);
                            };
                            /**
                             * @return {undefined}
                             */
                            MappingPromiseArray.prototype._init = function() {
                            };
                            /**
                             * @param {string} value
                             * @param {number} index
                             * @return {?}
                             */
                            MappingPromiseArray.prototype._promiseFulfilled = function(value, index) {
                                var values = this._values;
                                var length = this.length();
                                var preservedValues = this._preservedValues;
                                var limit = this._limit;
                                if (index < 0) {
                                    if (index = index * -1 - 1, values[index] = value, limit >= 1 && (this._inFlight--, this._drainQueue(), this._isResolved())) {
                                        return true;
                                    }
                                } else {
                                    if (limit >= 1 && this._inFlight >= limit) {
                                        return values[index] = value, this._queue.push(index), false;
                                    }
                                    if (null !== preservedValues) {
                                        /** @type {string} */
                                        preservedValues[index] = value;
                                    }
                                    var promise = this._promise;
                                    var fn = this._callback;
                                    var p = promise._boundValue();
                                    promise._pushContext();
                                    var ret = tryCatch(fn).call(p, value, index, length);
                                    var promiseCreated = promise._popContext();
                                    if (debug.checkForgottenReturns(ret, promiseCreated, null !== preservedValues ? "Promise.filter" : "Promise.map", promise), ret === errorObj) {
                                        return this._reject(ret.e), true;
                                    }
                                    var maybePromise = tryConvertToPromise(ret, this._promise);
                                    if (maybePromise instanceof Promise) {
                                        maybePromise = maybePromise._target();
                                        var bitField = maybePromise._bitField;
                                        if (0 === (50397184 & bitField)) {
                                            return limit >= 1 && this._inFlight++, values[index] = maybePromise, maybePromise._proxy(this, (index + 1) * -1), false;
                                        }
                                        if (0 === (33554432 & bitField)) {
                                            return 0 !== (16777216 & bitField) ? (this._reject(maybePromise._reason()), true) : (this._cancel(), true);
                                        }
                                        ret = maybePromise._value();
                                    }
                                    values[index] = ret;
                                }
                                /** @type {number} */
                                var totalResolved = ++this._totalResolved;
                                return totalResolved >= length && (null !== preservedValues ? this._filter(values, preservedValues) : this._resolve(values), true);
                            };
                            /**
                             * @return {undefined}
                             */
                            MappingPromiseArray.prototype._drainQueue = function() {
                                var queue = this._queue;
                                var limit = this._limit;
                                var values = this._values;
                                for (; queue.length > 0 && this._inFlight < limit;) {
                                    if (this._isResolved()) {
                                        return;
                                    }
                                    var index = queue.pop();
                                    this._promiseFulfilled(values[index], index);
                                }
                            };
                            /**
                             * @param {!NodeList} array
                             * @param {!NodeList} values
                             * @return {undefined}
                             */
                            MappingPromiseArray.prototype._filter = function(array, values) {
                                var length = values.length;
                                /** @type {!Array} */
                                var value = new Array(length);
                                /** @type {number} */
                                var key = 0;
                                /** @type {number} */
                                var i = 0;
                                for (; i < length; ++i) {
                                    if (array[i]) {
                                        value[key++] = values[i];
                                    }
                                }
                                /** @type {number} */
                                value.length = key;
                                this._resolve(value);
                            };
                            /**
                             * @return {?}
                             */
                            MappingPromiseArray.prototype.preservedValues = function() {
                                return this._preservedValues;
                            };
                            /**
                             * @param {!Function} fn
                             * @param {string} cb
                             * @return {?}
                             */
                            Promise.prototype.map = function(fn, cb) {
                                return map(this, fn, cb, null);
                            };
                            /**
                             * @param {!Function} key
                             * @param {!Function} cb
                             * @param {(Object|string)} options
                             * @param {!Object} _filter
                             * @return {?}
                             */
                            Promise.map = function(key, cb, options, _filter) {
                                return map(key, cb, options, _filter);
                            };
                        };
                    }, {
                        "./util" : 36
                    }],
                    19 : [function(require, mixin, n) {
                        /**
                         * @param {!Object} Promise
                         * @param {!Object} url
                         * @param {!Object} media
                         * @param {?} done
                         * @param {!Object} debug
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise, url, media, done, debug) {
                            var util = require("./util");
                            var tryCatch = util.tryCatch;
                            /**
                             * @param {?} fn
                             * @return {?}
                             */
                            Promise.method = function(fn) {
                                if ("function" != typeof fn) {
                                    throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
                                }
                                return function() {
                                    var ret = new Promise(url);
                                    ret._captureStackTrace();
                                    ret._pushContext();
                                    var value = tryCatch(fn).apply(this, arguments);
                                    var promiseCreated = ret._popContext();
                                    return debug.checkForgottenReturns(value, promiseCreated, "Promise.method", ret), ret._resolveFromSyncValue(value), ret;
                                };
                            };
                            /** @type {function(?): ?} */
                            Promise.attempt = Promise["try"] = function(fn) {
                                if ("function" != typeof fn) {
                                    return done("expecting a function but got " + util.classString(fn));
                                }
                                var ret = new Promise(url);
                                ret._captureStackTrace();
                                ret._pushContext();
                                var value;
                                if (arguments.length > 1) {
                                    debug.deprecated("calling Promise.try with more than 1 argument");
                                    var b = arguments[1];
                                    var a = arguments[2];
                                    value = util.isArray(b) ? tryCatch(fn).apply(a, b) : tryCatch(fn).call(a, b);
                                } else {
                                    value = tryCatch(fn)();
                                }
                                var promiseCreated = ret._popContext();
                                return debug.checkForgottenReturns(value, promiseCreated, "Promise.try", ret), ret._resolveFromSyncValue(value), ret;
                            };
                            /**
                             * @param {!Object} value
                             * @return {undefined}
                             */
                            Promise.prototype._resolveFromSyncValue = function(value) {
                                if (value === util.errorObj) {
                                    this._rejectCallback(value.e, false);
                                } else {
                                    this._resolveCallback(value, true);
                                }
                            };
                        };
                    }, {
                        "./util" : 36
                    }],
                    20 : [function(require, module, n) {
                        /**
                         * @param {?} obj
                         * @return {?}
                         */
                        function isUntypedError(obj) {
                            return obj instanceof Error && es5.getPrototypeOf(obj) === Error.prototype;
                        }
                        /**
                         * @param {?} obj
                         * @return {?}
                         */
                        function wrapAsOperationalError(obj) {
                            var ret;
                            if (isUntypedError(obj)) {
                                ret = new OperationalError(obj);
                                ret.name = obj.name;
                                ret.message = obj.message;
                                ret.stack = obj.stack;
                                var composable = es5.keys(obj);
                                /** @type {number} */
                                var i = 0;
                                for (; i < composable.length; ++i) {
                                    var field = composable[i];
                                    if (!rxIsInt.test(field)) {
                                        ret[field] = obj[field];
                                    }
                                }
                                return ret;
                            }
                            return util.markAsOriginatingFromRejection(obj), obj;
                        }
                        /**
                         * @param {!Function} promise
                         * @param {!Object} expected
                         * @return {?}
                         */
                        function nodebackForPromise(promise, expected) {
                            return function(err, value) {
                                if (null !== promise) {
                                    if (err) {
                                        var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
                                        promise._attachExtraTrace(wrapped);
                                        promise._reject(wrapped);
                                    } else {
                                        if (expected) {
                                            /** @type {!Array<?>} */
                                            var ret = [].slice.call(arguments, 1);
                                            promise._fulfill(ret);
                                        } else {
                                            promise._fulfill(value);
                                        }
                                    }
                                    /** @type {null} */
                                    promise = null;
                                }
                            };
                        }
                        var util = require("./util");
                        var maybeWrapAsError = util.maybeWrapAsError;
                        var errors = require("./errors");
                        var OperationalError = errors.OperationalError;
                        var es5 = require("./es5");
                        /** @type {!RegExp} */
                        var rxIsInt = /^(?:name|message|stack|cause)$/;
                        /** @type {function(!Function, !Object): ?} */
                        module.exports = nodebackForPromise;
                    }, {
                        "./errors" : 12,
                        "./es5" : 13,
                        "./util" : 36
                    }],
                    21 : [function(require, mixin, n) {
                        /**
                         * @param {!Function} Promise
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise) {
                            /**
                             * @param {!Array} val
                             * @param {!Function} nodeback
                             * @return {?}
                             */
                            function spreadAdapter(val, nodeback) {
                                var promise = this;
                                if (!util.isArray(val)) {
                                    return successAdapter.call(promise, val, nodeback);
                                }
                                var ret = tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
                                if (ret === errorObj) {
                                    async.throwLater(ret.e);
                                }
                            }
                            /**
                             * @param {!Array} val
                             * @param {!Function} nodeback
                             * @return {undefined}
                             */
                            function successAdapter(val, nodeback) {
                                var promise = this;
                                var separateCaches = promise._boundValue();
                                var ret = void 0 === val ? tryCatch(nodeback).call(separateCaches, null) : tryCatch(nodeback).call(separateCaches, null, val);
                                if (ret === errorObj) {
                                    async.throwLater(ret.e);
                                }
                            }
                            /**
                             * @param {number} reason
                             * @param {!Function} nodeback
                             * @return {undefined}
                             */
                            function errorAdapter(reason, nodeback) {
                                var promise = this;
                                if (!reason) {
                                    /** @type {!Error} */
                                    var newReason = new Error(reason + "");
                                    /** @type {number} */
                                    newReason.cause = reason;
                                    /** @type {!Error} */
                                    reason = newReason;
                                }
                                var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
                                if (ret === errorObj) {
                                    async.throwLater(ret.e);
                                }
                            }
                            var util = require("./util");
                            var async = Promise._async;
                            var tryCatch = util.tryCatch;
                            var errorObj = util.errorObj;
                            /** @type {function(!Object, number): ?} */
                            Promise.prototype.asCallback = Promise.prototype.nodeify = function(nodeback, options) {
                                if ("function" == typeof nodeback) {
                                    /** @type {function(!Array, !Function): undefined} */
                                    var adapter = successAdapter;
                                    if (void 0 !== options && Object(options).spread) {
                                        /** @type {function(!Array, !Function): ?} */
                                        adapter = spreadAdapter;
                                    }
                                    this._then(adapter, errorAdapter, void 0, this, nodeback);
                                }
                                return this;
                            };
                        };
                    }, {
                        "./util" : 36
                    }],
                    22 : [function(require, module, canCreateDiscussions) {
                        /**
                         * @return {?}
                         */
                        module.exports = function() {
                            /**
                             * @return {undefined}
                             */
                            function Proxyable() {
                            }
                            /**
                             * @param {!Object} self
                             * @param {(!Function|string)} fn
                             * @return {undefined}
                             */
                            function check(self, fn) {
                                if (null == self || self.constructor !== Promise) {
                                    throw new TypeError("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");
                                }
                                if ("function" != typeof fn) {
                                    throw new TypeError("expecting a function but got " + util.classString(fn));
                                }
                            }
                            /**
                             * @param {!Function} name
                             * @return {undefined}
                             */
                            function Promise(name) {
                                if (name !== INTERNAL) {
                                    check(this, name);
                                }
                                /** @type {number} */
                                this._bitField = 0;
                                this._fulfillmentHandler0 = void 0;
                                this._rejectionHandler0 = void 0;
                                this._promise0 = void 0;
                                this._receiver0 = void 0;
                                this._resolveFromExecutor(name);
                                this._promiseCreated();
                                this._fireEvent("promiseCreated", this);
                            }
                            /**
                             * @param {!Object} value
                             * @return {undefined}
                             */
                            function resolve(value) {
                                this.promise._resolveCallback(value);
                            }
                            /**
                             * @param {!Error} reason
                             * @return {undefined}
                             */
                            function reject(reason) {
                                this.promise._rejectCallback(reason, false);
                            }
                            /**
                             * @param {!Function} value
                             * @return {undefined}
                             */
                            function fillTypes(value) {
                                var p = new Promise(INTERNAL);
                                /** @type {!Function} */
                                p._fulfillmentHandler0 = value;
                                /** @type {!Function} */
                                p._rejectionHandler0 = value;
                                /** @type {!Function} */
                                p._promise0 = value;
                                /** @type {!Function} */
                                p._receiver0 = value;
                            }
                            var getDomain;
                            /**
                             * @return {?}
                             */
                            var makeSelfResolutionError = function() {
                                return new TypeError("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n");
                            };
                            /**
                             * @return {?}
                             */
                            var reflectHandler = function() {
                                return new Promise.PromiseInspection(this._target());
                            };
                            /**
                             * @param {?} msg
                             * @return {?}
                             */
                            var apiRejection = function(msg) {
                                return Promise.reject(new TypeError(msg));
                            };
                            var undefined = {};
                            var util = require("./util");
                            /** @type {function(): ?} */
                            getDomain = util.isNode ? function() {
                                var domain = options.domain;
                                return void 0 === domain && (domain = null), domain;
                            } : function() {
                                return null;
                            };
                            util.notEnumerableProp(Promise, "_getDomain", getDomain);
                            var es5 = require("./es5");
                            var Async = require("./async");
                            var async = new Async;
                            es5.defineProperty(Promise, "_async", {
                                value : async
                            });
                            var errors = require("./errors");
                            var TypeError = Promise.TypeError = errors.TypeError;
                            Promise.RangeError = errors.RangeError;
                            var CancellationError = Promise.CancellationError = errors.CancellationError;
                            Promise.TimeoutError = errors.TimeoutError;
                            Promise.OperationalError = errors.OperationalError;
                            Promise.RejectionError = errors.OperationalError;
                            Promise.AggregateError = errors.AggregateError;
                            /**
                             * @return {undefined}
                             */
                            var INTERNAL = function() {
                            };
                            var APPLY = {};
                            var NEXT_FILTER = {};
                            var tryConvertToPromise = require("./thenables")(Promise, INTERNAL);
                            var PromiseArray = require("./promise_array")(Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable);
                            var Context = require("./context")(Promise);
                            var createContext = Context.create;
                            var debug = require("./debuggability")(Promise, Context);
                            var RpcProxy = (debug.CapturedTrace, require("./finally")(Promise, tryConvertToPromise, NEXT_FILTER));
                            var catchFilter = require("./catch_filter")(NEXT_FILTER);
                            var nodebackForPromise = require("./nodeback");
                            var errorObj = util.errorObj;
                            var tryCatch = util.tryCatch;
                            return Promise.prototype.toString = function() {
                                return "[object Promise]";
                            }, Promise.prototype.caught = Promise.prototype["catch"] = function(fn) {
                                /** @type {number} */
                                var l = arguments.length;
                                if (l > 1) {
                                    var i;
                                    /** @type {!Array} */
                                    var catchInstances = new Array(l - 1);
                                    /** @type {number} */
                                    var j = 0;
                                    /** @type {number} */
                                    i = 0;
                                    for (; i < l - 1; ++i) {
                                        var item = arguments[i];
                                        if (!util.isObject(item)) {
                                            return apiRejection("Catch statement predicate: expecting an object but got " + util.classString(item));
                                        }
                                        catchInstances[j++] = item;
                                    }
                                    return catchInstances.length = j, fn = arguments[i], this.then(void 0, catchFilter(catchInstances, fn, this));
                                }
                                return this.then(void 0, fn);
                            }, Promise.prototype.reflect = function() {
                                return this._then(reflectHandler, reflectHandler, void 0, this, void 0);
                            }, Promise.prototype.then = function(fn, didReject) {
                                if (debug.warnings() && arguments.length > 0 && "function" != typeof fn && "function" != typeof didReject) {
                                    var msg = ".then() only accepts functions but was passed: " + util.classString(fn);
                                    if (arguments.length > 1) {
                                        msg = msg + (", " + util.classString(didReject));
                                    }
                                    this._warn(msg);
                                }
                                return this._then(fn, didReject, void 0, void 0, void 0);
                            }, Promise.prototype.done = function(didFulfill, didReject) {
                                var promise = this._then(didFulfill, didReject, void 0, void 0, void 0);
                                promise._setIsFinal();
                            }, Promise.prototype.spread = function(fn) {
                                return "function" != typeof fn ? apiRejection("expecting a function but got " + util.classString(fn)) : this.all()._then(fn, void 0, void 0, APPLY, void 0);
                            }, Promise.prototype.toJSON = function() {
                                var ret = {
                                    isFulfilled : false,
                                    isRejected : false,
                                    fulfillmentValue : void 0,
                                    rejectionReason : void 0
                                };
                                return this.isFulfilled() ? (ret.fulfillmentValue = this.value(), ret.isFulfilled = true) : this.isRejected() && (ret.rejectionReason = this.reason(), ret.isRejected = true), ret;
                            }, Promise.prototype.all = function() {
                                return arguments.length > 0 && this._warn(".all() was passed arguments but it does not take any"), (new PromiseArray(this)).promise();
                            }, Promise.prototype.error = function(fn) {
                                return this.caught(util.originatesFromRejection, fn);
                            }, Promise.getNewLibraryCopy = module.exports, Promise.is = function(type) {
                                return type instanceof Promise;
                            }, Promise.fromNode = Promise.fromCallback = function(fn) {
                                var ret = new Promise(INTERNAL);
                                ret._captureStackTrace();
                                /** @type {boolean} */
                                var multiArgs = arguments.length > 1 && !!Object(arguments[1]).multiArgs;
                                var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
                                return result === errorObj && ret._rejectCallback(result.e, true), ret._isFateSealed() || ret._setAsyncGuaranteed(), ret;
                            }, Promise.all = function(args) {
                                return (new PromiseArray(args)).promise();
                            }, Promise.cast = function(obj) {
                                var ret = tryConvertToPromise(obj);
                                return ret instanceof Promise || (ret = new Promise(INTERNAL), ret._captureStackTrace(), ret._setFulfilled(), ret._rejectionHandler0 = obj), ret;
                            }, Promise.resolve = Promise.fulfilled = Promise.cast, Promise.reject = Promise.rejected = function(reason) {
                                var promise = new Promise(INTERNAL);
                                return promise._captureStackTrace(), promise._rejectCallback(reason, true), promise;
                            }, Promise.setScheduler = function(fn) {
                                if ("function" != typeof fn) {
                                    throw new TypeError("expecting a function but got " + util.classString(fn));
                                }
                                return async.setScheduler(fn);
                            }, Promise.prototype._then = function(didFulfill, didReject, _, receiver, internalData) {
                                /** @type {boolean} */
                                var haveInternalData = void 0 !== internalData;
                                var promise = haveInternalData ? internalData : new Promise(INTERNAL);
                                var target = this._target();
                                var bitField = target._bitField;
                                if (!haveInternalData) {
                                    promise._propagateFrom(this, 3);
                                    promise._captureStackTrace();
                                    if (void 0 === receiver && 0 !== (2097152 & this._bitField)) {
                                        receiver = 0 !== (50397184 & bitField) ? this._boundValue() : target === this ? void 0 : this._boundTo;
                                    }
                                    this._fireEvent("promiseChained", this, promise);
                                }
                                var domain = getDomain();
                                if (0 !== (50397184 & bitField)) {
                                    var handler;
                                    var value;
                                    var settler = target._settlePromiseCtx;
                                    if (0 !== (33554432 & bitField)) {
                                        value = target._rejectionHandler0;
                                        /** @type {!Function} */
                                        handler = didFulfill;
                                    } else {
                                        if (0 !== (16777216 & bitField)) {
                                            value = target._fulfillmentHandler0;
                                            /** @type {!Function} */
                                            handler = didReject;
                                            target._unsetRejectionIsUnhandled();
                                        } else {
                                            settler = target._settlePromiseLateCancellationObserver;
                                            value = new CancellationError("late cancellation observer");
                                            target._attachExtraTrace(value);
                                            /** @type {!Function} */
                                            handler = didReject;
                                        }
                                    }
                                    async.invoke(settler, target, {
                                        handler : null === domain ? handler : "function" == typeof handler && util.domainBind(domain, handler),
                                        promise : promise,
                                        receiver : receiver,
                                        value : value
                                    });
                                } else {
                                    target._addCallbacks(didFulfill, didReject, promise, receiver, domain);
                                }
                                return promise;
                            }, Promise.prototype._length = function() {
                                return 65535 & this._bitField;
                            }, Promise.prototype._isFateSealed = function() {
                                return 0 !== (117506048 & this._bitField);
                            }, Promise.prototype._isFollowing = function() {
                                return 67108864 === (67108864 & this._bitField);
                            }, Promise.prototype._setLength = function(v) {
                                /** @type {number} */
                                this._bitField = this._bitField & -65536 | 65535 & v;
                            }, Promise.prototype._setFulfilled = function() {
                                /** @type {number} */
                                this._bitField = 33554432 | this._bitField;
                                this._fireEvent("promiseFulfilled", this);
                            }, Promise.prototype._setRejected = function() {
                                /** @type {number} */
                                this._bitField = 16777216 | this._bitField;
                                this._fireEvent("promiseRejected", this);
                            }, Promise.prototype._setFollowing = function() {
                                /** @type {number} */
                                this._bitField = 67108864 | this._bitField;
                                this._fireEvent("promiseResolved", this);
                            }, Promise.prototype._setIsFinal = function() {
                                /** @type {number} */
                                this._bitField = 4194304 | this._bitField;
                            }, Promise.prototype._isFinal = function() {
                                return (4194304 & this._bitField) > 0;
                            }, Promise.prototype._unsetCancelled = function() {
                                /** @type {number} */
                                this._bitField = this._bitField & -65537;
                            }, Promise.prototype._setCancelled = function() {
                                /** @type {number} */
                                this._bitField = 65536 | this._bitField;
                                this._fireEvent("promiseCancelled", this);
                            }, Promise.prototype._setWillBeCancelled = function() {
                                /** @type {number} */
                                this._bitField = 8388608 | this._bitField;
                            }, Promise.prototype._setAsyncGuaranteed = function() {
                                if (!async.hasCustomScheduler()) {
                                    /** @type {number} */
                                    this._bitField = 134217728 | this._bitField;
                                }
                            }, Promise.prototype._receiverAt = function(index) {
                                var ret = 0 === index ? this._receiver0 : this[4 * index - 4 + 3];
                                if (ret !== undefined) {
                                    return void 0 === ret && this._isBound() ? this._boundValue() : ret;
                                }
                            }, Promise.prototype._promiseAt = function(index) {
                                return this[4 * index - 4 + 2];
                            }, Promise.prototype._fulfillmentHandlerAt = function(index) {
                                return this[4 * index - 4 + 0];
                            }, Promise.prototype._rejectionHandlerAt = function(index) {
                                return this[4 * index - 4 + 1];
                            }, Promise.prototype._boundValue = function() {
                            }, Promise.prototype._migrateCallback0 = function(follower) {
                                var fulfill = (follower._bitField, follower._fulfillmentHandler0);
                                var reject = follower._rejectionHandler0;
                                var promise = follower._promise0;
                                var receiver = follower._receiverAt(0);
                                if (void 0 === receiver) {
                                    receiver = undefined;
                                }
                                this._addCallbacks(fulfill, reject, promise, receiver, null);
                            }, Promise.prototype._migrateCallbackAt = function(follower, index) {
                                var fulfill = follower._fulfillmentHandlerAt(index);
                                var reject = follower._rejectionHandlerAt(index);
                                var promise = follower._promiseAt(index);
                                var receiver = follower._receiverAt(index);
                                if (void 0 === receiver) {
                                    receiver = undefined;
                                }
                                this._addCallbacks(fulfill, reject, promise, receiver, null);
                            }, Promise.prototype._addCallbacks = function(fulfill, reject, promise, receiver, domain) {
                                var index = this._length();
                                if (index >= 65531 && (index = 0, this._setLength(0)), 0 === index) {
                                    /** @type {number} */
                                    this._promise0 = promise;
                                    /** @type {string} */
                                    this._receiver0 = receiver;
                                    if ("function" == typeof fulfill) {
                                        this._fulfillmentHandler0 = null === domain ? fulfill : util.domainBind(domain, fulfill);
                                    }
                                    if ("function" == typeof reject) {
                                        this._rejectionHandler0 = null === domain ? reject : util.domainBind(domain, reject);
                                    }
                                } else {
                                    /** @type {number} */
                                    var a = 4 * index - 4;
                                    /** @type {number} */
                                    this[a + 2] = promise;
                                    /** @type {string} */
                                    this[a + 3] = receiver;
                                    if ("function" == typeof fulfill) {
                                        this[a + 0] = null === domain ? fulfill : util.domainBind(domain, fulfill);
                                    }
                                    if ("function" == typeof reject) {
                                        this[a + 1] = null === domain ? reject : util.domainBind(domain, reject);
                                    }
                                }
                                return this._setLength(index + 1), index;
                            }, Promise.prototype._proxy = function(proxyable, arg) {
                                this._addCallbacks(void 0, void 0, arg, proxyable, null);
                            }, Promise.prototype._resolveCallback = function(value, shouldBind) {
                                if (0 === (117506048 & this._bitField)) {
                                    if (value === this) {
                                        return this._rejectCallback(makeSelfResolutionError(), false);
                                    }
                                    var maybePromise = tryConvertToPromise(value, this);
                                    if (!(maybePromise instanceof Promise)) {
                                        return this._fulfill(value);
                                    }
                                    if (shouldBind) {
                                        this._propagateFrom(maybePromise, 2);
                                    }
                                    var promise = maybePromise._target();
                                    if (promise === this) {
                                        return void this._reject(makeSelfResolutionError());
                                    }
                                    var bitField = promise._bitField;
                                    if (0 === (50397184 & bitField)) {
                                        var len = this._length();
                                        if (len > 0) {
                                            promise._migrateCallback0(this);
                                        }
                                        /** @type {number} */
                                        var i = 1;
                                        for (; i < len; ++i) {
                                            promise._migrateCallbackAt(this, i);
                                        }
                                        this._setFollowing();
                                        this._setLength(0);
                                        this._setFollowee(promise);
                                    } else {
                                        if (0 !== (33554432 & bitField)) {
                                            this._fulfill(promise._value());
                                        } else {
                                            if (0 !== (16777216 & bitField)) {
                                                this._reject(promise._reason());
                                            } else {
                                                var reason = new CancellationError("late cancellation observer");
                                                promise._attachExtraTrace(reason);
                                                this._reject(reason);
                                            }
                                        }
                                    }
                                }
                            }, Promise.prototype._rejectCallback = function(reason, synchronous, ignoreNonErrorWarnings) {
                                var trace = util.ensureErrorObject(reason);
                                /** @type {boolean} */
                                var hasStack = trace === reason;
                                if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
                                    var msg = "a promise was rejected with a non-error: " + util.classString(reason);
                                    this._warn(msg, true);
                                }
                                this._attachExtraTrace(trace, !!synchronous && hasStack);
                                this._reject(reason);
                            }, Promise.prototype._resolveFromExecutor = function(executor) {
                                if (executor !== INTERNAL) {
                                    var promise = this;
                                    this._captureStackTrace();
                                    this._pushContext();
                                    /** @type {boolean} */
                                    var synchronous = true;
                                    var r = this._execute(executor, function(value) {
                                        promise._resolveCallback(value);
                                    }, function(reason) {
                                        promise._rejectCallback(reason, synchronous);
                                    });
                                    /** @type {boolean} */
                                    synchronous = false;
                                    this._popContext();
                                    if (void 0 !== r) {
                                        promise._rejectCallback(r, true);
                                    }
                                }
                            }, Promise.prototype._settlePromiseFromHandler = function(handler, receiver, value, promise) {
                                var bitField = promise._bitField;
                                if (0 === (65536 & bitField)) {
                                    promise._pushContext();
                                    var x;
                                    if (receiver === APPLY) {
                                        if (value && "number" == typeof value.length) {
                                            x = tryCatch(handler).apply(this._boundValue(), value);
                                        } else {
                                            x = errorObj;
                                            x.e = new TypeError("cannot .spread() a non-array: " + util.classString(value));
                                        }
                                    } else {
                                        x = tryCatch(handler).call(receiver, value);
                                    }
                                    var promiseCreated = promise._popContext();
                                    bitField = promise._bitField;
                                    if (0 === (65536 & bitField)) {
                                        if (x === NEXT_FILTER) {
                                            promise._reject(value);
                                        } else {
                                            if (x === errorObj) {
                                                promise._rejectCallback(x.e, false);
                                            } else {
                                                debug.checkForgottenReturns(x, promiseCreated, "", promise, this);
                                                promise._resolveCallback(x);
                                            }
                                        }
                                    }
                                }
                            }, Promise.prototype._target = function() {
                                var ret = this;
                                for (; ret._isFollowing();) {
                                    ret = ret._followee();
                                }
                                return ret;
                            }, Promise.prototype._followee = function() {
                                return this._rejectionHandler0;
                            }, Promise.prototype._setFollowee = function(promise) {
                                /** @type {!Object} */
                                this._rejectionHandler0 = promise;
                            }, Promise.prototype._settlePromise = function(promise, handler, receiver, value) {
                                /** @type {boolean} */
                                var isPromise = promise instanceof Promise;
                                var bitField = this._bitField;
                                /** @type {boolean} */
                                var c = 0 !== (134217728 & bitField);
                                if (0 !== (65536 & bitField)) {
                                    if (isPromise) {
                                        promise._invokeInternalOnCancel();
                                    }
                                    if (receiver instanceof RpcProxy && receiver.isFinallyHandler()) {
                                        /** @type {!Function} */
                                        receiver.cancelPromise = promise;
                                        if (tryCatch(handler).call(receiver, value) === errorObj) {
                                            promise._reject(errorObj.e);
                                        }
                                    } else {
                                        if (handler === reflectHandler) {
                                            promise._fulfill(reflectHandler.call(receiver));
                                        } else {
                                            if (receiver instanceof Proxyable) {
                                                receiver._promiseCancelled(promise);
                                            } else {
                                                if (isPromise || promise instanceof PromiseArray) {
                                                    promise._cancel();
                                                } else {
                                                    receiver.cancel();
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if ("function" == typeof handler) {
                                        if (isPromise) {
                                            if (c) {
                                                promise._setAsyncGuaranteed();
                                            }
                                            this._settlePromiseFromHandler(handler, receiver, value, promise);
                                        } else {
                                            handler.call(receiver, value, promise);
                                        }
                                    } else {
                                        if (receiver instanceof Proxyable) {
                                            if (!receiver._isResolved()) {
                                                if (0 !== (33554432 & bitField)) {
                                                    receiver._promiseFulfilled(value, promise);
                                                } else {
                                                    receiver._promiseRejected(value, promise);
                                                }
                                            }
                                        } else {
                                            if (isPromise) {
                                                if (c) {
                                                    promise._setAsyncGuaranteed();
                                                }
                                                if (0 !== (33554432 & bitField)) {
                                                    promise._fulfill(value);
                                                } else {
                                                    promise._reject(value);
                                                }
                                            }
                                        }
                                    }
                                }
                            }, Promise.prototype._settlePromiseLateCancellationObserver = function(ctx) {
                                var handler = ctx.handler;
                                var promise = ctx.promise;
                                var receiver = ctx.receiver;
                                var value = ctx.value;
                                if ("function" == typeof handler) {
                                    if (promise instanceof Promise) {
                                        this._settlePromiseFromHandler(handler, receiver, value, promise);
                                    } else {
                                        handler.call(receiver, value, promise);
                                    }
                                } else {
                                    if (promise instanceof Promise) {
                                        promise._reject(value);
                                    }
                                }
                            }, Promise.prototype._settlePromiseCtx = function(ctx) {
                                this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
                            }, Promise.prototype._settlePromise0 = function(handler, value, bitField) {
                                var promise = this._promise0;
                                var receiver = this._receiverAt(0);
                                this._promise0 = void 0;
                                this._receiver0 = void 0;
                                this._settlePromise(promise, handler, receiver, value);
                            }, Promise.prototype._clearCallbackDataAtIndex = function(index) {
                                /** @type {number} */
                                var e = 4 * index - 4;
                                this[e + 2] = this[e + 3] = this[e + 0] = this[e + 1] = void 0;
                            }, Promise.prototype._fulfill = function(value) {
                                var bitField = this._bitField;
                                if (!((117506048 & bitField) >>> 16)) {
                                    if (value === this) {
                                        var err = makeSelfResolutionError();
                                        return this._attachExtraTrace(err), this._reject(err);
                                    }
                                    this._setFulfilled();
                                    /** @type {!Object} */
                                    this._rejectionHandler0 = value;
                                    if ((65535 & bitField) > 0) {
                                        if (0 !== (134217728 & bitField)) {
                                            this._settlePromises();
                                        } else {
                                            async.settlePromises(this);
                                        }
                                    }
                                }
                            }, Promise.prototype._reject = function(reason) {
                                var bitField = this._bitField;
                                if (!((117506048 & bitField) >>> 16)) {
                                    return this._setRejected(), this._fulfillmentHandler0 = reason, this._isFinal() ? async.fatalError(reason, util.isNode) : void((65535 & bitField) > 0 ? async.settlePromises(this) : this._ensurePossibleRejectionHandled());
                                }
                            }, Promise.prototype._fulfillPromises = function(len, value) {
                                /** @type {number} */
                                var i = 1;
                                for (; i < len; i++) {
                                    var handler = this._fulfillmentHandlerAt(i);
                                    var promise = this._promiseAt(i);
                                    var receiver = this._receiverAt(i);
                                    this._clearCallbackDataAtIndex(i);
                                    this._settlePromise(promise, handler, receiver, value);
                                }
                            }, Promise.prototype._rejectPromises = function(len, reason) {
                                /** @type {number} */
                                var i = 1;
                                for (; i < len; i++) {
                                    var handler = this._rejectionHandlerAt(i);
                                    var promise = this._promiseAt(i);
                                    var receiver = this._receiverAt(i);
                                    this._clearCallbackDataAtIndex(i);
                                    this._settlePromise(promise, handler, receiver, reason);
                                }
                            }, Promise.prototype._settlePromises = function() {
                                var bitField = this._bitField;
                                /** @type {number} */
                                var len = 65535 & bitField;
                                if (len > 0) {
                                    if (0 !== (16842752 & bitField)) {
                                        var reason = this._fulfillmentHandler0;
                                        this._settlePromise0(this._rejectionHandler0, reason, bitField);
                                        this._rejectPromises(len, reason);
                                    } else {
                                        var value = this._rejectionHandler0;
                                        this._settlePromise0(this._fulfillmentHandler0, value, bitField);
                                        this._fulfillPromises(len, value);
                                    }
                                    this._setLength(0);
                                }
                                this._clearCancellationData();
                            }, Promise.prototype._settledValue = function() {
                                var bitField = this._bitField;
                                return 0 !== (33554432 & bitField) ? this._rejectionHandler0 : 0 !== (16777216 & bitField) ? this._fulfillmentHandler0 : void 0;
                            }, Promise.defer = Promise.pending = function() {
                                debug.deprecated("Promise.defer", "new Promise");
                                var promise = new Promise(INTERNAL);
                                return {
                                    promise : promise,
                                    resolve : resolve,
                                    reject : reject
                                };
                            }, util.notEnumerableProp(Promise, "_makeSelfResolutionError", makeSelfResolutionError), require("./method")(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug), require("./bind")(Promise, INTERNAL, tryConvertToPromise, debug), require("./cancel")(Promise, PromiseArray, apiRejection, debug), require("./direct_resolve")(Promise), require("./synchronous_inspection")(Promise), require("./join")(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async, getDomain), Promise.Promise =
                                Promise, Promise.version = "3.5.1", require("./map.js")(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug), require("./call_get.js")(Promise), require("./using.js")(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug), require("./timers.js")(Promise, INTERNAL, debug), require("./generators.js")(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug), require("./nodeify.js")(Promise), require("./promisify.js")(Promise, INTERNAL),
                                require("./props.js")(Promise, PromiseArray, tryConvertToPromise, apiRejection), require("./race.js")(Promise, INTERNAL, tryConvertToPromise, apiRejection), require("./reduce.js")(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug), require("./settle.js")(Promise, PromiseArray, debug), require("./some.js")(Promise, PromiseArray, apiRejection), require("./filter.js")(Promise, INTERNAL), require("./each.js")(Promise, INTERNAL), require("./any.js")(Promise), util.toFastProperties(Promise),
                                util.toFastProperties(Promise.prototype), fillTypes({
                                a : 1
                            }), fillTypes({
                                b : 2
                            }), fillTypes({
                                c : 3
                            }), fillTypes(1), fillTypes(function() {
                            }), fillTypes(void 0), fillTypes(false), fillTypes(new Promise(INTERNAL)), debug.setBounds(Async.firstLineError, util.lastLineError), Promise;
                        };
                    }, {
                        "./any.js" : 1,
                        "./async" : 2,
                        "./bind" : 3,
                        "./call_get.js" : 5,
                        "./cancel" : 6,
                        "./catch_filter" : 7,
                        "./context" : 8,
                        "./debuggability" : 9,
                        "./direct_resolve" : 10,
                        "./each.js" : 11,
                        "./errors" : 12,
                        "./es5" : 13,
                        "./filter.js" : 14,
                        "./finally" : 15,
                        "./generators.js" : 16,
                        "./join" : 17,
                        "./map.js" : 18,
                        "./method" : 19,
                        "./nodeback" : 20,
                        "./nodeify.js" : 21,
                        "./promise_array" : 23,
                        "./promisify.js" : 24,
                        "./props.js" : 25,
                        "./race.js" : 27,
                        "./reduce.js" : 28,
                        "./settle.js" : 30,
                        "./some.js" : 31,
                        "./synchronous_inspection" : 32,
                        "./thenables" : 33,
                        "./timers.js" : 34,
                        "./using.js" : 35,
                        "./util" : 36
                    }],
                    23 : [function(require, mixin, n) {
                        /**
                         * @param {!Function} Promise
                         * @param {!Object} INTERNAL
                         * @param {!Object} tryConvertToPromise
                         * @param {?} apiRejection
                         * @param {!Function} Proxyable
                         * @return {?}
                         */
                        mixin.exports = function(Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable) {
                            /**
                             * @param {?} val
                             * @return {?}
                             */
                            function toResolutionValue(val) {
                                switch(val) {
                                    case -2:
                                        return [];
                                    case -3:
                                        return {};
                                    case -6:
                                        return new Map;
                                }
                            }
                            /**
                             * @param {!Object} values
                             * @return {undefined}
                             */
                            function PromiseArray(values) {
                                var promise = this._promise = new Promise(INTERNAL);
                                if (values instanceof Promise) {
                                    promise._propagateFrom(values, 3);
                                }
                                promise._setOnCancel(this);
                                /** @type {!Object} */
                                this._values = values;
                                /** @type {number} */
                                this._length = 0;
                                /** @type {number} */
                                this._totalResolved = 0;
                                this._init(void 0, -2);
                            }
                            var util = require("./util");
                            util.isArray;
                            return util.inherits(PromiseArray, Proxyable), PromiseArray.prototype.length = function() {
                                return this._length;
                            }, PromiseArray.prototype.promise = function() {
                                return this._promise;
                            }, PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
                                var values = tryConvertToPromise(this._values, this._promise);
                                if (values instanceof Promise) {
                                    values = values._target();
                                    var bitField = values._bitField;
                                    if (this._values = values, 0 === (50397184 & bitField)) {
                                        return this._promise._setAsyncGuaranteed(), values._then(init, this._reject, void 0, this, resolveValueIfEmpty);
                                    }
                                    if (0 === (33554432 & bitField)) {
                                        return 0 !== (16777216 & bitField) ? this._reject(values._reason()) : this._cancel();
                                    }
                                    values = values._value();
                                }
                                if (values = util.asArray(values), null === values) {
                                    var reason = apiRejection("expecting an array or an iterable object but got " + util.classString(values)).reason();
                                    return void this._promise._rejectCallback(reason, false);
                                }
                                return 0 === values.length ? void(resolveValueIfEmpty === -5 ? this._resolveEmptyArray() : this._resolve(toResolutionValue(resolveValueIfEmpty))) : void this._iterate(values);
                            }, PromiseArray.prototype._iterate = function(values) {
                                var len = this.getActualLength(values.length);
                                this._length = len;
                                this._values = this.shouldCopyValues() ? new Array(len) : this._values;
                                var result = this._promise;
                                /** @type {boolean} */
                                var isResolved = false;
                                /** @type {null} */
                                var bitField = null;
                                /** @type {number} */
                                var i = 0;
                                for (; i < len; ++i) {
                                    var maybePromise = tryConvertToPromise(values[i], result);
                                    if (maybePromise instanceof Promise) {
                                        maybePromise = maybePromise._target();
                                        bitField = maybePromise._bitField;
                                    } else {
                                        /** @type {null} */
                                        bitField = null;
                                    }
                                    if (isResolved) {
                                        if (null !== bitField) {
                                            maybePromise.suppressUnhandledRejections();
                                        }
                                    } else {
                                        if (null !== bitField) {
                                            if (0 === (50397184 & bitField)) {
                                                maybePromise._proxy(this, i);
                                                this._values[i] = maybePromise;
                                            } else {
                                                isResolved = 0 !== (33554432 & bitField) ? this._promiseFulfilled(maybePromise._value(), i) : 0 !== (16777216 & bitField) ? this._promiseRejected(maybePromise._reason(), i) : this._promiseCancelled(i);
                                            }
                                        } else {
                                            isResolved = this._promiseFulfilled(maybePromise, i);
                                        }
                                    }
                                }
                                if (!isResolved) {
                                    result._setAsyncGuaranteed();
                                }
                            }, PromiseArray.prototype._isResolved = function() {
                                return null === this._values;
                            }, PromiseArray.prototype._resolve = function(value) {
                                /** @type {null} */
                                this._values = null;
                                this._promise._fulfill(value);
                            }, PromiseArray.prototype._cancel = function() {
                                if (!this._isResolved() && this._promise._isCancellable()) {
                                    /** @type {null} */
                                    this._values = null;
                                    this._promise._cancel();
                                }
                            }, PromiseArray.prototype._reject = function(reason) {
                                /** @type {null} */
                                this._values = null;
                                this._promise._rejectCallback(reason, false);
                            }, PromiseArray.prototype._promiseFulfilled = function(value, index) {
                                /** @type {string} */
                                this._values[index] = value;
                                /** @type {number} */
                                var totalResolved = ++this._totalResolved;
                                return totalResolved >= this._length && (this._resolve(this._values), true);
                            }, PromiseArray.prototype._promiseCancelled = function() {
                                return this._cancel(), true;
                            }, PromiseArray.prototype._promiseRejected = function(reason) {
                                return this._totalResolved++, this._reject(reason), true;
                            }, PromiseArray.prototype._resultCancelled = function() {
                                if (!this._isResolved()) {
                                    var values = this._values;
                                    if (this._cancel(), values instanceof Promise) {
                                        values.cancel();
                                    } else {
                                        /** @type {number} */
                                        var i = 0;
                                        for (; i < values.length; ++i) {
                                            if (values[i] instanceof Promise) {
                                                values[i].cancel();
                                            }
                                        }
                                    }
                                }
                            }, PromiseArray.prototype.shouldCopyValues = function() {
                                return true;
                            }, PromiseArray.prototype.getActualLength = function(len) {
                                return len;
                            }, PromiseArray;
                        };
                    }, {
                        "./util" : 36
                    }],
                    24 : [function(_dereq_, mixin, n) {
                        /**
                         * @param {!Function} Promise
                         * @param {!Object} handler
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise, handler) {
                            /**
                             * @param {?} key
                             * @return {?}
                             */
                            function propsFilter(key) {
                                return !x.test(key);
                            }
                            /**
                             * @param {?} fn
                             * @return {?}
                             */
                            function isPromisified(fn) {
                                try {
                                    return fn.__isPromisified__ === true;
                                } catch (e) {
                                    return false;
                                }
                            }
                            /**
                             * @param {?} obj
                             * @param {(Object|number)} key
                             * @param {!Object} suffix
                             * @return {?}
                             */
                            function hasPromisified(obj, key, suffix) {
                                var val = util.getDataPropertyOrDefault(obj, key + suffix, defaultPromisified);
                                return !!val && isPromisified(val);
                            }
                            /**
                             * @param {!Array} ret
                             * @param {!Object} suffix
                             * @param {!RegExp} suffixRegexp
                             * @return {undefined}
                             */
                            function checkValid(ret, suffix, suffixRegexp) {
                                /** @type {number} */
                                var i = 0;
                                for (; i < ret.length; i = i + 2) {
                                    var key = ret[i];
                                    if (suffixRegexp.test(key)) {
                                        var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
                                        /** @type {number} */
                                        var j = 0;
                                        for (; j < ret.length; j = j + 2) {
                                            if (ret[j] === keyWithoutAsyncSuffix) {
                                                throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s", suffix));
                                            }
                                        }
                                    }
                                }
                            }
                            /**
                             * @param {(Object|string)} obj
                             * @param {!Object} suffix
                             * @param {!RegExp} suffixRegexp
                             * @param {!Function} filter
                             * @return {?}
                             */
                            function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
                                var existingKeys = util.inheritedDataKeys(obj);
                                /** @type {!Array} */
                                var ret = [];
                                /** @type {number} */
                                var i = 0;
                                for (; i < existingKeys.length; ++i) {
                                    var key = existingKeys[i];
                                    var fn = obj[key];
                                    var curLoop = filter === defaultFilter || defaultFilter(key, fn, obj);
                                    if (!("function" != typeof fn || isPromisified(fn) || hasPromisified(obj, key, suffix) || !filter(key, fn, obj, curLoop))) {
                                        ret.push(key, fn);
                                    }
                                }
                                return checkValid(ret, suffix, suffixRegexp), ret;
                            }
                            /**
                             * @param {!Function} end
                             * @param {?} receiver
                             * @param {!Object} _
                             * @param {!Function} callback
                             * @param {!Object} __
                             * @param {boolean} multiArgs
                             * @return {?}
                             */
                            function makeNodePromisifiedClosure(end, receiver, _, callback, __, multiArgs) {
                                /**
                                 * @return {?}
                                 */
                                function promisified() {
                                    var _receiver = receiver;
                                    if (receiver === THIS) {
                                        _receiver = this;
                                    }
                                    var promise = new Promise(handler);
                                    promise._captureStackTrace();
                                    var callback = "string" == typeof method && this !== u ? this[method] : end;
                                    var fn = nodebackForPromise(promise, multiArgs);
                                    try {
                                        callback.apply(_receiver, withAppended(arguments, fn));
                                    } catch (e) {
                                        promise._rejectCallback(maybeWrapAsError(e), true, true);
                                    }
                                    return promise._isFateSealed() || promise._setAsyncGuaranteed(), promise;
                                }
                                var u = function() {
                                    return this;
                                }();
                                /** @type {!Function} */
                                var method = end;
                                return "string" == typeof method && (end = callback), util.notEnumerableProp(promisified, "__isPromisified__", true), promisified;
                            }
                            /**
                             * @param {!Object} obj
                             * @param {undefined} suffix
                             * @param {!Function} filter
                             * @param {?} promisifier
                             * @param {boolean} multiArgs
                             * @return {?}
                             */
                            function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
                                /** @type {!RegExp} */
                                var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
                                var methods = promisifiableMethods(obj, suffix, suffixRegexp, filter);
                                /** @type {number} */
                                var i = 0;
                                var l = methods.length;
                                for (; i < l; i = i + 2) {
                                    var key = methods[i];
                                    var fn = methods[i + 1];
                                    var promisifiedKey = key + suffix;
                                    if (promisifier === makeNodePromisified) {
                                        obj[promisifiedKey] = makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
                                    } else {
                                        var promisified = promisifier(fn, function() {
                                            return makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
                                        });
                                        util.notEnumerableProp(promisified, "__isPromisified__", true);
                                        obj[promisifiedKey] = promisified;
                                    }
                                }
                                return util.toFastProperties(obj), obj;
                            }
                            /**
                             * @param {?} callback
                             * @param {?} receiver
                             * @param {boolean} multiArgs
                             * @return {?}
                             */
                            function promisify(callback, receiver, multiArgs) {
                                return makeNodePromisified(callback, receiver, void 0, callback, null, multiArgs);
                            }
                            var makeNodePromisifiedEval;
                            var THIS = {};
                            var util = _dereq_("./util");
                            var nodebackForPromise = _dereq_("./nodeback");
                            var withAppended = util.withAppended;
                            var maybeWrapAsError = util.maybeWrapAsError;
                            var canEvaluate = util.canEvaluate;
                            var TypeError = _dereq_("./errors").TypeError;
                            /** @type {string} */
                            var defaultSuffix = "Async";
                            var defaultPromisified = {
                                __isPromisified__ : true
                            };
                            /** @type {!Array} */
                            var noCopyProps = ["arity", "length", "name", "arguments", "caller", "callee", "prototype", "__isPromisified__"];
                            /** @type {!RegExp} */
                            var x = new RegExp("^(?:" + noCopyProps.join("|") + ")$");
                            /**
                             * @param {string} name
                             * @return {?}
                             */
                            var defaultFilter = function(name) {
                                return util.isIdentifier(name) && "_" !== name.charAt(0) && "constructor" !== name;
                            };
                            /**
                             * @param {string} str
                             * @return {?}
                             */
                            var escapeIdentRegex = function(str) {
                                return str.replace(/([$])/, "\\$");
                            };
                            /** @type {(function(!Function, ?, !Object, !Function, !Object, boolean): ?|undefined)} */
                            var makeNodePromisified = canEvaluate ? makeNodePromisifiedEval : makeNodePromisifiedClosure;
                            /**
                             * @param {?} fn
                             * @param {!Object} obj
                             * @return {?}
                             */
                            Promise.promisify = function(fn, obj) {
                                if ("function" != typeof fn) {
                                    throw new TypeError("expecting a function but got " + util.classString(fn));
                                }
                                if (isPromisified(fn)) {
                                    return fn;
                                }
                                /** @type {!Object} */
                                obj = Object(obj);
                                var receiver = void 0 === obj.context ? THIS : obj.context;
                                /** @type {boolean} */
                                var multiArgs = !!obj.multiArgs;
                                var ret = promisify(fn, receiver, multiArgs);
                                return util.copyDescriptors(fn, ret, propsFilter), ret;
                            };
                            /**
                             * @param {!Object} obj
                             * @param {!Object} options
                             * @return {?}
                             */
                            Promise.promisifyAll = function(obj, options) {
                                if ("function" != typeof obj && "object" != typeof obj) {
                                    throw new TypeError("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");
                                }
                                /** @type {!Object} */
                                options = Object(options);
                                /** @type {boolean} */
                                var multiArgs = !!options.multiArgs;
                                var suffix = options.suffix;
                                if ("string" != typeof suffix) {
                                    /** @type {string} */
                                    suffix = defaultSuffix;
                                }
                                var filter = options.filter;
                                if ("function" != typeof filter) {
                                    /** @type {function(string): ?} */
                                    filter = defaultFilter;
                                }
                                var promisifier = options.promisifier;
                                if ("function" != typeof promisifier && (promisifier = makeNodePromisified), !util.isIdentifier(suffix)) {
                                    throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");
                                }
                                var props = util.inheritedDataKeys(obj);
                                /** @type {number} */
                                var i = 0;
                                for (; i < props.length; ++i) {
                                    var value = obj[props[i]];
                                    if ("constructor" !== props[i] && util.isClass(value)) {
                                        promisifyAll(value.prototype, suffix, filter, promisifier, multiArgs);
                                        promisifyAll(value, suffix, filter, promisifier, multiArgs);
                                    }
                                }
                                return promisifyAll(obj, suffix, filter, promisifier, multiArgs);
                            };
                        };
                    }, {
                        "./errors" : 12,
                        "./nodeback" : 20,
                        "./util" : 36
                    }],
                    25 : [function(require, mixin, n) {
                        /**
                         * @param {!Object} Promise
                         * @param {!Object} PromiseArray
                         * @param {!Object} tryConvertToPromise
                         * @param {?} apiRejection
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise, PromiseArray, tryConvertToPromise, apiRejection) {
                            /**
                             * @param {?} obj
                             * @return {undefined}
                             */
                            function PropertiesPromiseArray(obj) {
                                var entries;
                                /** @type {boolean} */
                                var isMap = false;
                                if (void 0 !== Es6Map && obj instanceof Es6Map) {
                                    entries = mapToEntries(obj);
                                    /** @type {boolean} */
                                    isMap = true;
                                } else {
                                    var r = objct.keys(obj);
                                    var n = r.length;
                                    /** @type {!Array} */
                                    entries = new Array(2 * n);
                                    /** @type {number} */
                                    var i = 0;
                                    for (; i < n; ++i) {
                                        var key = r[i];
                                        entries[i] = obj[key];
                                        entries[i + n] = key;
                                    }
                                }
                                this.constructor$(entries);
                                /** @type {boolean} */
                                this._isMap = isMap;
                                this._init$(void 0, isMap ? -6 : -3);
                            }
                            /**
                             * @param {?} promises
                             * @return {?}
                             */
                            function props(promises) {
                                var promise;
                                var castValue = tryConvertToPromise(promises);
                                return isObject(castValue) ? (promise = castValue instanceof Promise ? castValue._then(Promise.props, void 0, void 0, void 0, void 0) : (new PropertiesPromiseArray(castValue)).promise(), castValue instanceof Promise && promise._propagateFrom(castValue, 2), promise) : apiRejection("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n");
                            }
                            var Es6Map;
                            var util = require("./util");
                            var isObject = util.isObject;
                            var objct = require("./es5");
                            if ("function" == typeof Map) {
                                /** @type {function(new:Map, (Array<Array<(KEY|VALUE)>>|Iterable<Array<(KEY|VALUE)>>|null)=): ?} */
                                Es6Map = Map;
                            }
                            var mapToEntries = function() {
                                /**
                                 * @param {?} callback
                                 * @param {?} initialHash
                                 * @return {undefined}
                                 */
                                function hash(callback, initialHash) {
                                    this[message] = callback;
                                    this[message + num] = initialHash;
                                    message++;
                                }
                                /** @type {number} */
                                var message = 0;
                                /** @type {number} */
                                var num = 0;
                                return function(res) {
                                    num = res.size;
                                    /** @type {number} */
                                    message = 0;
                                    /** @type {!Array} */
                                    var value = new Array(2 * res.size);
                                    return res.forEach(hash, value), value;
                                };
                            }();
                            /**
                             * @param {!Array} entries
                             * @return {?}
                             */
                            var entriesToMap = function(entries) {
                                var ret = new Es6Map;
                                /** @type {number} */
                                var cache_ = entries.length / 2 | 0;
                                /** @type {number} */
                                var id = 0;
                                for (; id < cache_; ++id) {
                                    var value = entries[cache_ + id];
                                    var item = entries[id];
                                    ret.set(value, item);
                                }
                                return ret;
                            };
                            util.inherits(PropertiesPromiseArray, PromiseArray);
                            /**
                             * @return {undefined}
                             */
                            PropertiesPromiseArray.prototype._init = function() {
                            };
                            /**
                             * @param {string} value
                             * @param {!Function} index
                             * @return {?}
                             */
                            PropertiesPromiseArray.prototype._promiseFulfilled = function(value, index) {
                                /** @type {string} */
                                this._values[index] = value;
                                /** @type {number} */
                                var totalResolved = ++this._totalResolved;
                                if (totalResolved >= this._length) {
                                    var val;
                                    if (this._isMap) {
                                        val = entriesToMap(this._values);
                                    } else {
                                        val = {};
                                        var i = this.length();
                                        /** @type {number} */
                                        var index = 0;
                                        var length = this.length();
                                        for (; index < length; ++index) {
                                            val[this._values[index + i]] = this._values[index];
                                        }
                                    }
                                    return this._resolve(val), true;
                                }
                                return false;
                            };
                            /**
                             * @return {?}
                             */
                            PropertiesPromiseArray.prototype.shouldCopyValues = function() {
                                return false;
                            };
                            /**
                             * @param {number} len
                             * @return {?}
                             */
                            PropertiesPromiseArray.prototype.getActualLength = function(len) {
                                return len >> 1;
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype.props = function() {
                                return props(this);
                            };
                            /**
                             * @param {?} promises
                             * @return {?}
                             */
                            Promise.props = function(promises) {
                                return props(promises);
                            };
                        };
                    }, {
                        "./es5" : 13,
                        "./util" : 36
                    }],
                    26 : [function(canCreateDiscussions, module, n) {
                        /**
                         * @param {?} array
                         * @param {number} i
                         * @param {?} target
                         * @param {number} size
                         * @param {number} len
                         * @return {undefined}
                         */
                        function arrayMove(array, i, target, size, len) {
                            /** @type {number} */
                            var index = 0;
                            for (; index < len; ++index) {
                                target[index + size] = array[index + i];
                                array[index + i] = void 0;
                            }
                        }
                        /**
                         * @param {number} obj
                         * @return {undefined}
                         */
                        function Queue(obj) {
                            /** @type {number} */
                            this._capacity = obj;
                            /** @type {number} */
                            this._length = 0;
                            /** @type {number} */
                            this._front = 0;
                        }
                        /**
                         * @param {?} size
                         * @return {?}
                         */
                        Queue.prototype._willBeOverCapacity = function(size) {
                            return this._capacity < size;
                        };
                        /**
                         * @param {!Function} arg
                         * @return {undefined}
                         */
                        Queue.prototype._pushOne = function(arg) {
                            var length = this.length();
                            this._checkCapacity(length + 1);
                            /** @type {number} */
                            var lastOpt = this._front + length & this._capacity - 1;
                            /** @type {!Function} */
                            this[lastOpt] = arg;
                            this._length = length + 1;
                        };
                        /**
                         * @param {!Object} value
                         * @param {!Function} receiver
                         * @param {!Object} arg
                         * @return {?}
                         */
                        Queue.prototype.push = function(value, receiver, arg) {
                            var length = this.length() + 3;
                            if (this._willBeOverCapacity(length)) {
                                return this._pushOne(value), this._pushOne(receiver), void this._pushOne(arg);
                            }
                            /** @type {number} */
                            var j = this._front + length - 3;
                            this._checkCapacity(length);
                            /** @type {number} */
                            var wrapMask = this._capacity - 1;
                            /** @type {!Object} */
                            this[j + 0 & wrapMask] = value;
                            /** @type {!Function} */
                            this[j + 1 & wrapMask] = receiver;
                            /** @type {!Object} */
                            this[j + 2 & wrapMask] = arg;
                            this._length = length;
                        };
                        /**
                         * @return {?}
                         */
                        Queue.prototype.shift = function() {
                            var front = this._front;
                            var ret = this[front];
                            return this[front] = void 0, this._front = front + 1 & this._capacity - 1, this._length--, ret;
                        };
                        /**
                         * @return {?}
                         */
                        Queue.prototype.length = function() {
                            return this._length;
                        };
                        /**
                         * @param {?} size
                         * @return {undefined}
                         */
                        Queue.prototype._checkCapacity = function(size) {
                            if (this._capacity < size) {
                                this._resizeTo(this._capacity << 1);
                            }
                        };
                        /**
                         * @param {number} capacity
                         * @return {undefined}
                         */
                        Queue.prototype._resizeTo = function(capacity) {
                            var oldCapacity = this._capacity;
                            /** @type {number} */
                            this._capacity = capacity;
                            var front = this._front;
                            var length = this._length;
                            /** @type {number} */
                            var moveItemsCount = front + length & oldCapacity - 1;
                            arrayMove(this, 0, this, oldCapacity, moveItemsCount);
                        };
                        /** @type {function(number): undefined} */
                        module.exports = Queue;
                    }, {}],
                    27 : [function(require, mixin, n) {
                        /**
                         * @param {!Function} Promise
                         * @param {!Object} INTERNAL
                         * @param {!Object} tryConvertToPromise
                         * @param {?} apiRejection
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise, INTERNAL, tryConvertToPromise, apiRejection) {
                            /**
                             * @param {!Array} promises
                             * @param {?} parent
                             * @return {?}
                             */
                            function race(promises, parent) {
                                var maybePromise = tryConvertToPromise(promises);
                                if (maybePromise instanceof Promise) {
                                    return raceLater(maybePromise);
                                }
                                if (promises = util.asArray(promises), null === promises) {
                                    return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
                                }
                                var ret = new Promise(INTERNAL);
                                if (void 0 !== parent) {
                                    ret._propagateFrom(parent, 3);
                                }
                                var fn = ret._fulfill;
                                var reject = ret._reject;
                                /** @type {number} */
                                var i = 0;
                                var remaining = promises.length;
                                for (; i < remaining; ++i) {
                                    var val = promises[i];
                                    if (void 0 !== val || i in promises) {
                                        Promise.cast(val)._then(fn, reject, void 0, ret, null);
                                    }
                                }
                                return ret;
                            }
                            var util = require("./util");
                            /**
                             * @param {?} promise
                             * @return {?}
                             */
                            var raceLater = function(promise) {
                                return promise.then(function(promises) {
                                    return race(promises, promise);
                                });
                            };
                            /**
                             * @param {!Array} promises
                             * @return {?}
                             */
                            Promise.race = function(promises) {
                                return race(promises, void 0);
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype.race = function() {
                                return race(this, void 0);
                            };
                        };
                    }, {
                        "./util" : 36
                    }],
                    28 : [function(require, mixin, n) {
                        /**
                         * @param {!Function} Promise
                         * @param {!Object} PromiseArray
                         * @param {!Object} apiRejection
                         * @param {?} tryConvertToPromise
                         * @param {undefined} INTERNAL
                         * @param {?} debug
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
                            /**
                             * @param {?} promises
                             * @param {!Function} fn
                             * @param {string} initialValue
                             * @param {number} _each
                             * @return {undefined}
                             */
                            function ReductionPromiseArray(promises, fn, initialValue, _each) {
                                this.constructor$(promises);
                                var string = getDomain();
                                this._fn = null === string ? fn : util.domainBind(string, fn);
                                if (void 0 !== initialValue) {
                                    initialValue = Promise.resolve(initialValue);
                                    initialValue._attachCancellationCallback(this);
                                }
                                /** @type {string} */
                                this._initialValue = initialValue;
                                /** @type {null} */
                                this._currentCancellable = null;
                                if (_each === INTERNAL) {
                                    /** @type {!Array} */
                                    this._eachValues = Array(this._length);
                                } else {
                                    if (0 === _each) {
                                        /** @type {null} */
                                        this._eachValues = null;
                                    } else {
                                        this._eachValues = void 0;
                                    }
                                }
                                this._promise._captureStackTrace();
                                this._init$(void 0, -5);
                            }
                            /**
                             * @param {undefined} value
                             * @param {?} array
                             * @return {undefined}
                             */
                            function completed(value, array) {
                                if (this.isFulfilled()) {
                                    array._resolve(value);
                                } else {
                                    array._reject(value);
                                }
                            }
                            /**
                             * @param {?} promises
                             * @param {boolean} fn
                             * @param {boolean} initialValue
                             * @param {boolean} _each
                             * @return {?}
                             */
                            function reduce(promises, fn, initialValue, _each) {
                                if ("function" != typeof fn) {
                                    return apiRejection("expecting a function but got " + util.classString(fn));
                                }
                                var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
                                return array.promise();
                            }
                            /**
                             * @param {!Array} accum
                             * @return {?}
                             */
                            function gotAccum(accum) {
                                /** @type {!Array} */
                                this.accum = accum;
                                this.array._gotAccum(accum);
                                var value = tryConvertToPromise(this.value, this.array._promise);
                                return value instanceof Promise ? (this.array._currentCancellable = value, value._then(gotValue, void 0, void 0, this, void 0)) : gotValue.call(this, value);
                            }
                            /**
                             * @param {?} context
                             * @return {?}
                             */
                            function gotValue(context) {
                                var array = this.array;
                                var promise = array._promise;
                                var fn = tryCatch(array._fn);
                                promise._pushContext();
                                var value;
                                value = void 0 !== array._eachValues ? fn.call(promise._boundValue(), context, this.index, this.length) : fn.call(promise._boundValue(), this.accum, context, this.index, this.length);
                                if (value instanceof Promise) {
                                    array._currentCancellable = value;
                                }
                                var promiseCreated = promise._popContext();
                                return debug.checkForgottenReturns(value, promiseCreated, void 0 !== array._eachValues ? "Promise.each" : "Promise.reduce", promise), value;
                            }
                            var getDomain = Promise._getDomain;
                            var util = require("./util");
                            var tryCatch = util.tryCatch;
                            util.inherits(ReductionPromiseArray, PromiseArray);
                            /**
                             * @param {!Object} accum
                             * @return {undefined}
                             */
                            ReductionPromiseArray.prototype._gotAccum = function(accum) {
                                if (void 0 !== this._eachValues && null !== this._eachValues && accum !== INTERNAL) {
                                    this._eachValues.push(accum);
                                }
                            };
                            /**
                             * @param {!Object} value
                             * @return {?}
                             */
                            ReductionPromiseArray.prototype._eachComplete = function(value) {
                                return null !== this._eachValues && this._eachValues.push(value), this._eachValues;
                            };
                            /**
                             * @return {undefined}
                             */
                            ReductionPromiseArray.prototype._init = function() {
                            };
                            /**
                             * @return {undefined}
                             */
                            ReductionPromiseArray.prototype._resolveEmptyArray = function() {
                                this._resolve(void 0 !== this._eachValues ? this._eachValues : this._initialValue);
                            };
                            /**
                             * @return {?}
                             */
                            ReductionPromiseArray.prototype.shouldCopyValues = function() {
                                return false;
                            };
                            /**
                             * @param {!Object} value
                             * @return {undefined}
                             */
                            ReductionPromiseArray.prototype._resolve = function(value) {
                                this._promise._resolveCallback(value);
                                /** @type {null} */
                                this._values = null;
                            };
                            /**
                             * @param {string} sender
                             * @return {?}
                             */
                            ReductionPromiseArray.prototype._resultCancelled = function(sender) {
                                return sender === this._initialValue ? this._cancel() : void(this._isResolved() || (this._resultCancelled$(), this._currentCancellable instanceof Promise && this._currentCancellable.cancel(), this._initialValue instanceof Promise && this._initialValue.cancel()));
                            };
                            /**
                             * @param {!Object} values
                             * @return {undefined}
                             */
                            ReductionPromiseArray.prototype._iterate = function(values) {
                                /** @type {!Object} */
                                this._values = values;
                                var value;
                                var j;
                                var i = values.length;
                                if (void 0 !== this._initialValue ? (value = this._initialValue, j = 0) : (value = Promise.resolve(values[0]), j = 1), this._currentCancellable = value, !value.isRejected()) {
                                    for (; j < i; ++j) {
                                        var ctx = {
                                            accum : null,
                                            value : values[j],
                                            index : j,
                                            length : i,
                                            array : this
                                        };
                                        value = value._then(gotAccum, void 0, void 0, ctx, void 0);
                                    }
                                }
                                if (void 0 !== this._eachValues) {
                                    value = value._then(this._eachComplete, void 0, void 0, this, void 0);
                                }
                                value._then(completed, completed, void 0, value, this);
                            };
                            /**
                             * @param {!Array} array
                             * @param {!Array} value
                             * @return {?}
                             */
                            Promise.prototype.reduce = function(array, value) {
                                return reduce(this, array, value, null);
                            };
                            /**
                             * @param {(!Function|string)} array
                             * @param {!Array} fn
                             * @param {?} initialValue
                             * @param {?} _each
                             * @return {?}
                             */
                            Promise.reduce = function(array, fn, initialValue, _each) {
                                return reduce(array, fn, initialValue, _each);
                            };
                        };
                    }, {
                        "./util" : 36
                    }],
                    29 : [function(require, module, i) {
                        var sightglass;
                        var util = require("./util");
                        /**
                         * @return {?}
                         */
                        var value = function() {
                            throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
                        };
                        var field = util.getNativePromise();
                        if (util.isNode && "undefined" == typeof MutationObserver) {
                            var GlobalSetImmediate = global.setImmediate;
                            var defer = options.nextTick;
                            /** @type {function(!Function): undefined} */
                            sightglass = util.isRecentNode ? function(obj) {
                                GlobalSetImmediate.call(global, obj);
                            } : function(data) {
                                defer.call(options, data);
                            };
                        } else {
                            if ("function" == typeof field && "function" == typeof field.resolve) {
                                var f = field.resolve();
                                /**
                                 * @param {!Function} obj
                                 * @return {undefined}
                                 */
                                sightglass = function(obj) {
                                    f.then(obj);
                                };
                            } else {
                                sightglass = "undefined" == typeof MutationObserver || "undefined" != typeof window && window.navigator && (window.navigator.standalone || window.cordova) ? "undefined" != typeof setImmediate ? function(c) {
                                    setImmediate(c);
                                } : "undefined" != typeof setTimeout ? function(data) {
                                    setTimeout(data, 0);
                                } : value : function() {
                                    /** @type {!Element} */
                                    var t = document.createElement("div");
                                    var options = {
                                        attributes : true
                                    };
                                    /** @type {boolean} */
                                    var n = false;
                                    /** @type {!Element} */
                                    var r = document.createElement("div");
                                    /** @type {!MutationObserver} */
                                    var x = new MutationObserver(function() {
                                        t.classList.toggle("foo");
                                        /** @type {boolean} */
                                        n = false;
                                    });
                                    x.observe(r, options);
                                    /**
                                     * @return {undefined}
                                     */
                                    var handleToggledOrCodeOnly = function() {
                                        if (!n) {
                                            /** @type {boolean} */
                                            n = true;
                                            r.classList.toggle("foo");
                                        }
                                    };
                                    return function(saveNotifs) {
                                        /** @type {!MutationObserver} */
                                        var o = new MutationObserver(function() {
                                            o.disconnect();
                                            saveNotifs();
                                        });
                                        o.observe(t, options);
                                        handleToggledOrCodeOnly();
                                    };
                                }();
                            }
                        }
                        module.exports = sightglass;
                    }, {
                        "./util" : 36
                    }],
                    30 : [function(require, mixin, n) {
                        /**
                         * @param {!Function} Promise
                         * @param {!Object} name
                         * @param {!Object} provider
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise, name, provider) {
                            /**
                             * @param {?} values
                             * @return {undefined}
                             */
                            function SettledPromiseArray(values) {
                                this.constructor$(values);
                            }
                            var PromiseInspection = Promise.PromiseInspection;
                            var util = require("./util");
                            util.inherits(SettledPromiseArray, name);
                            /**
                             * @param {!Function} index
                             * @param {number} inspection
                             * @return {?}
                             */
                            SettledPromiseArray.prototype._promiseResolved = function(index, inspection) {
                                /** @type {number} */
                                this._values[index] = inspection;
                                /** @type {number} */
                                var totalResolved = ++this._totalResolved;
                                return totalResolved >= this._length && (this._resolve(this._values), true);
                            };
                            /**
                             * @param {string} value
                             * @param {!Function} index
                             * @return {?}
                             */
                            SettledPromiseArray.prototype._promiseFulfilled = function(value, index) {
                                var ret = new PromiseInspection;
                                return ret._bitField = 33554432, ret._settledValueField = value, this._promiseResolved(index, ret);
                            };
                            /**
                             * @param {string} reason
                             * @param {!Function} index
                             * @return {?}
                             */
                            SettledPromiseArray.prototype._promiseRejected = function(reason, index) {
                                var ret = new PromiseInspection;
                                return ret._bitField = 16777216, ret._settledValueField = reason, this._promiseResolved(index, ret);
                            };
                            /**
                             * @param {?} promises
                             * @return {?}
                             */
                            Promise.settle = function(promises) {
                                return provider.deprecated(".settle()", ".reflect()"), (new SettledPromiseArray(promises)).promise();
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype.settle = function() {
                                return Promise.settle(this);
                            };
                        };
                    }, {
                        "./util" : 36
                    }],
                    31 : [function(require, mixin, n) {
                        /**
                         * @param {string} Promise
                         * @param {!Object} name
                         * @param {!Object} func
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise, name, func) {
                            /**
                             * @param {?} values
                             * @return {undefined}
                             */
                            function SomePromiseArray(values) {
                                this.constructor$(values);
                                /** @type {number} */
                                this._howMany = 0;
                                /** @type {boolean} */
                                this._unwrap = false;
                                /** @type {boolean} */
                                this._initialized = false;
                            }
                            /**
                             * @param {?} promises
                             * @param {number} howMany
                             * @return {?}
                             */
                            function some(promises, howMany) {
                                if ((0 | howMany) !== howMany || howMany < 0) {
                                    return func("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");
                                }
                                var ret = new SomePromiseArray(promises);
                                var o = ret.promise();
                                return ret.setHowMany(howMany), ret.init(), o;
                            }
                            var util = require("./util");
                            var RangeError = require("./errors").RangeError;
                            var AggregateError = require("./errors").AggregateError;
                            var isArray = util.isArray;
                            var CANCELLATION = {};
                            util.inherits(SomePromiseArray, name);
                            /**
                             * @return {?}
                             */
                            SomePromiseArray.prototype._init = function() {
                                if (this._initialized) {
                                    if (0 === this._howMany) {
                                        return void this._resolve([]);
                                    }
                                    this._init$(void 0, -5);
                                    var isArrayResolved = isArray(this._values);
                                    if (!this._isResolved() && isArrayResolved && this._howMany > this._canPossiblyFulfill()) {
                                        this._reject(this._getRangeError(this.length()));
                                    }
                                }
                            };
                            /**
                             * @return {undefined}
                             */
                            SomePromiseArray.prototype.init = function() {
                                /** @type {boolean} */
                                this._initialized = true;
                                this._init();
                            };
                            /**
                             * @return {undefined}
                             */
                            SomePromiseArray.prototype.setUnwrap = function() {
                                /** @type {boolean} */
                                this._unwrap = true;
                            };
                            /**
                             * @return {?}
                             */
                            SomePromiseArray.prototype.howMany = function() {
                                return this._howMany;
                            };
                            /**
                             * @param {number} count
                             * @return {undefined}
                             */
                            SomePromiseArray.prototype.setHowMany = function(count) {
                                /** @type {number} */
                                this._howMany = count;
                            };
                            /**
                             * @param {!Object} value
                             * @return {?}
                             */
                            SomePromiseArray.prototype._promiseFulfilled = function(value) {
                                return this._addFulfilled(value), this._fulfilled() === this.howMany() && (this._values.length = this.howMany(), 1 === this.howMany() && this._unwrap ? this._resolve(this._values[0]) : this._resolve(this._values), true);
                            };
                            /**
                             * @param {!Object} reason
                             * @return {?}
                             */
                            SomePromiseArray.prototype._promiseRejected = function(reason) {
                                return this._addRejected(reason), this._checkOutcome();
                            };
                            /**
                             * @return {?}
                             */
                            SomePromiseArray.prototype._promiseCancelled = function() {
                                return this._values instanceof Promise || null == this._values ? this._cancel() : (this._addRejected(CANCELLATION), this._checkOutcome());
                            };
                            /**
                             * @return {?}
                             */
                            SomePromiseArray.prototype._checkOutcome = function() {
                                if (this.howMany() > this._canPossiblyFulfill()) {
                                    var e = new AggregateError;
                                    var i = this.length();
                                    for (; i < this._values.length; ++i) {
                                        if (this._values[i] !== CANCELLATION) {
                                            e.push(this._values[i]);
                                        }
                                    }
                                    return e.length > 0 ? this._reject(e) : this._cancel(), true;
                                }
                                return false;
                            };
                            /**
                             * @return {?}
                             */
                            SomePromiseArray.prototype._fulfilled = function() {
                                return this._totalResolved;
                            };
                            /**
                             * @return {?}
                             */
                            SomePromiseArray.prototype._rejected = function() {
                                return this._values.length - this.length();
                            };
                            /**
                             * @param {!Object} reason
                             * @return {undefined}
                             */
                            SomePromiseArray.prototype._addRejected = function(reason) {
                                this._values.push(reason);
                            };
                            /**
                             * @param {!Object} value
                             * @return {undefined}
                             */
                            SomePromiseArray.prototype._addFulfilled = function(value) {
                                /** @type {!Object} */
                                this._values[this._totalResolved++] = value;
                            };
                            /**
                             * @return {?}
                             */
                            SomePromiseArray.prototype._canPossiblyFulfill = function() {
                                return this.length() - this._rejected();
                            };
                            /**
                             * @param {number} count
                             * @return {?}
                             */
                            SomePromiseArray.prototype._getRangeError = function(count) {
                                /** @type {string} */
                                var errorMessage = "Input array must contain at least " + this._howMany + " items but contains only " + count + " items";
                                return new RangeError(errorMessage);
                            };
                            /**
                             * @return {undefined}
                             */
                            SomePromiseArray.prototype._resolveEmptyArray = function() {
                                this._reject(this._getRangeError(0));
                            };
                            /**
                             * @param {?} promises
                             * @param {undefined} howMany
                             * @return {?}
                             */
                            Promise.some = function(promises, howMany) {
                                return some(promises, howMany);
                            };
                            /**
                             * @param {undefined} howMany
                             * @return {?}
                             */
                            Promise.prototype.some = function(howMany) {
                                return some(this, howMany);
                            };
                            /** @type {function(?): undefined} */
                            Promise._SomePromiseArray = SomePromiseArray;
                        };
                    }, {
                        "./errors" : 12,
                        "./util" : 36
                    }],
                    32 : [function(canCreateDiscussions, mixin, n) {
                        /**
                         * @param {!Function} Promise
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise) {
                            /**
                             * @param {number} promise
                             * @return {undefined}
                             */
                            function PromiseInspection(promise) {
                                if (void 0 !== promise) {
                                    promise = promise._target();
                                    this._bitField = promise._bitField;
                                    this._settledValueField = promise._isFateSealed() ? promise._settledValue() : void 0;
                                } else {
                                    /** @type {number} */
                                    this._bitField = 0;
                                    this._settledValueField = void 0;
                                }
                            }
                            /**
                             * @return {?}
                             */
                            PromiseInspection.prototype._settledValue = function() {
                                return this._settledValueField;
                            };
                            /** @type {function(): ?} */
                            var value = PromiseInspection.prototype.value = function() {
                                if (!this.isFulfilled()) {
                                    throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");
                                }
                                return this._settledValue();
                            };
                            /** @type {function(): ?} */
                            var originalElementQuerySelector = PromiseInspection.prototype.error = PromiseInspection.prototype.reason = function() {
                                if (!this.isRejected()) {
                                    throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");
                                }
                                return this._settledValue();
                            };
                            /** @type {function(): ?} */
                            var isResolved = PromiseInspection.prototype.isFulfilled = function() {
                                return 0 !== (33554432 & this._bitField);
                            };
                            /** @type {function(): ?} */
                            var isFulfilled = PromiseInspection.prototype.isRejected = function() {
                                return 0 !== (16777216 & this._bitField);
                            };
                            /** @type {function(): ?} */
                            var isRejected = PromiseInspection.prototype.isPending = function() {
                                return 0 === (50397184 & this._bitField);
                            };
                            /** @type {function(): ?} */
                            var isPending = PromiseInspection.prototype.isResolved = function() {
                                return 0 !== (50331648 & this._bitField);
                            };
                            /**
                             * @return {?}
                             */
                            PromiseInspection.prototype.isCancelled = function() {
                                return 0 !== (8454144 & this._bitField);
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype.__isCancelled = function() {
                                return 65536 === (65536 & this._bitField);
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype._isCancelled = function() {
                                return this._target().__isCancelled();
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype.isCancelled = function() {
                                return 0 !== (8454144 & this._target()._bitField);
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype.isPending = function() {
                                return isRejected.call(this._target());
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype.isRejected = function() {
                                return isFulfilled.call(this._target());
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype.isFulfilled = function() {
                                return isResolved.call(this._target());
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype.isResolved = function() {
                                return isPending.call(this._target());
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype.value = function() {
                                return value.call(this._target());
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype.reason = function() {
                                var target = this._target();
                                return target._unsetRejectionIsUnhandled(), originalElementQuerySelector.call(target);
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype._value = function() {
                                return this._settledValue();
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype._reason = function() {
                                return this._unsetRejectionIsUnhandled(), this._settledValue();
                            };
                            /** @type {function(number): undefined} */
                            Promise.PromiseInspection = PromiseInspection;
                        };
                    }, {}],
                    33 : [function(require, mixin, n) {
                        /**
                         * @param {!Object} Promise
                         * @param {!Object} fn
                         * @return {?}
                         */
                        mixin.exports = function(Promise, fn) {
                            /**
                             * @param {!Object} obj
                             * @param {?} context
                             * @return {?}
                             */
                            function tryConvertToPromise(obj, context) {
                                if (isObject(obj)) {
                                    if (obj instanceof Promise) {
                                        return obj;
                                    }
                                    var then = reject(obj);
                                    if (then === errorObj) {
                                        if (context) {
                                            context._pushContext();
                                        }
                                        var ret = Promise.reject(then.e);
                                        return context && context._popContext(), ret;
                                    }
                                    if ("function" == typeof then) {
                                        if (isAnyBluebirdPromise(obj)) {
                                            ret = new Promise(fn);
                                            return obj._then(ret._fulfill, ret._reject, void 0, ret, null), ret;
                                        }
                                        return doThenable(obj, then, context);
                                    }
                                }
                                return obj;
                            }
                            /**
                             * @param {?} promise
                             * @return {?}
                             */
                            function getThen(promise) {
                                return promise.then;
                            }
                            /**
                             * @param {(Object|string)} value
                             * @return {?}
                             */
                            function reject(value) {
                                try {
                                    return getThen(value);
                                } catch (reason) {
                                    return errorObj.e = reason, errorObj;
                                }
                            }
                            /**
                             * @param {(Object|string)} obj
                             * @return {?}
                             */
                            function isAnyBluebirdPromise(obj) {
                                try {
                                    return hasProp.call(obj, "_promise0");
                                } catch (e) {
                                    return false;
                                }
                            }
                            /**
                             * @param {(Object|string)} x
                             * @param {!Function} then
                             * @param {?} context
                             * @return {?}
                             */
                            function doThenable(x, then, context) {
                                /**
                                 * @param {!Object} value
                                 * @return {undefined}
                                 */
                                function resolve(value) {
                                    if (promise) {
                                        promise._resolveCallback(value);
                                        /** @type {null} */
                                        promise = null;
                                    }
                                }
                                /**
                                 * @param {(Object|string)} reason
                                 * @return {undefined}
                                 */
                                function reject(reason) {
                                    if (promise) {
                                        promise._rejectCallback(reason, synchronous, true);
                                        /** @type {null} */
                                        promise = null;
                                    }
                                }
                                var promise = new Promise(fn);
                                var p = promise;
                                if (context) {
                                    context._pushContext();
                                }
                                promise._captureStackTrace();
                                if (context) {
                                    context._popContext();
                                }
                                /** @type {boolean} */
                                var synchronous = true;
                                var result = util.tryCatch(then).call(x, resolve, reject);
                                return synchronous = false, promise && result === errorObj && (promise._rejectCallback(result.e, true, true), promise = null), p;
                            }
                            var util = require("./util");
                            var errorObj = util.errorObj;
                            var isObject = util.isObject;
                            /** @type {function(this:Object, *): boolean} */
                            var hasProp = {}.hasOwnProperty;
                            return tryConvertToPromise;
                        };
                    }, {
                        "./util" : 36
                    }],
                    34 : [function(require, mixin, n) {
                        /**
                         * @param {!Function} Promise
                         * @param {!Object} val
                         * @param {!Object} opts
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise, val, opts) {
                            /**
                             * @param {!Function} handle
                             * @return {undefined}
                             */
                            function HandleWrapper(handle) {
                                /** @type {!Function} */
                                this.handle = handle;
                            }
                            /**
                             * @param {?} value
                             * @return {?}
                             */
                            function successClear(value) {
                                return clearTimeout(this.handle), value;
                            }
                            /**
                             * @param {?} errtype
                             * @return {?}
                             */
                            function fail(errtype) {
                                throw clearTimeout(this.handle), errtype;
                            }
                            var util = require("./util");
                            var TimeoutError = Promise.TimeoutError;
                            /**
                             * @return {undefined}
                             */
                            HandleWrapper.prototype._resultCancelled = function() {
                                clearTimeout(this.handle);
                            };
                            /**
                             * @param {!Object} value
                             * @return {?}
                             */
                            var afterValue = function(value) {
                                return delay(+this).thenReturn(value);
                            };
                            /** @type {function(!Function, ?): ?} */
                            var delay = Promise.delay = function(ms, value) {
                                var ret;
                                var handle;
                                return void 0 !== value ? (ret = Promise.resolve(value)._then(afterValue, null, null, ms, void 0), opts.cancellation() && value instanceof Promise && ret._setOnCancel(value)) : (ret = new Promise(val), handle = setTimeout(function() {
                                    ret._fulfill();
                                }, +ms), opts.cancellation() && ret._setOnCancel(new HandleWrapper(handle)), ret._captureStackTrace()), ret._setAsyncGuaranteed(), ret;
                            };
                            /**
                             * @param {!Function} val
                             * @return {?}
                             */
                            Promise.prototype.delay = function(val) {
                                return delay(val, this);
                            };
                            /**
                             * @param {!Object} promise
                             * @param {string} message
                             * @param {!Object} parent
                             * @return {undefined}
                             */
                            var afterTimeout = function(promise, message, parent) {
                                var reason;
                                reason = "string" != typeof message ? message instanceof Error ? message : new TimeoutError("operation timed out") : new TimeoutError(message);
                                util.markAsOriginatingFromRejection(reason);
                                promise._attachExtraTrace(reason);
                                promise._reject(reason);
                                if (null != parent) {
                                    parent.cancel();
                                }
                            };
                            /**
                             * @param {number} ms
                             * @param {string} message
                             * @return {?}
                             */
                            Promise.prototype.timeout = function(ms, message) {
                                /** @type {number} */
                                ms = +ms;
                                var ret;
                                var parent;
                                var value = new HandleWrapper(setTimeout(function() {
                                    if (ret.isPending()) {
                                        afterTimeout(ret, message, parent);
                                    }
                                }, ms));
                                return opts.cancellation() ? (parent = this.then(), ret = parent._then(successClear, fail, void 0, value, void 0), ret._setOnCancel(value)) : ret = this._then(successClear, fail, void 0, value, void 0), ret;
                            };
                        };
                    }, {
                        "./util" : 36
                    }],
                    35 : [function(_dereq_, mixin, n) {
                        /**
                         * @param {!Function} Promise
                         * @param {!Object} apiRejection
                         * @param {!Object} tryConvertToPromise
                         * @param {?} createContext
                         * @param {?} INTERNAL
                         * @param {?} debug
                         * @return {undefined}
                         */
                        mixin.exports = function(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug) {
                            /**
                             * @param {?} name
                             * @return {undefined}
                             */
                            function thrower(name) {
                                setTimeout(function() {
                                    throw name;
                                }, 0);
                            }
                            /**
                             * @param {?} thenable
                             * @return {?}
                             */
                            function castPreservingDisposable(thenable) {
                                var maybePromise = tryConvertToPromise(thenable);
                                return maybePromise !== thenable && "function" == typeof thenable._isDisposable && "function" == typeof thenable._getDisposer && thenable._isDisposable() && maybePromise._setDisposable(thenable._getDisposer()), maybePromise;
                            }
                            /**
                             * @param {!Object} resources
                             * @param {?} inspection
                             * @return {?}
                             */
                            function dispose(resources, inspection) {
                                /**
                                 * @return {?}
                                 */
                                function iterator() {
                                    if (siteVersion >= versionNumber) {
                                        return promise._fulfill();
                                    }
                                    var maybePromise = castPreservingDisposable(resources[siteVersion++]);
                                    if (maybePromise instanceof Promise && maybePromise._isDisposable()) {
                                        try {
                                            maybePromise = tryConvertToPromise(maybePromise._getDisposer().tryDispose(inspection), resources.promise);
                                        } catch (fetchCollection) {
                                            return thrower(fetchCollection);
                                        }
                                        if (maybePromise instanceof Promise) {
                                            return maybePromise._then(iterator, thrower, null, null, null);
                                        }
                                    }
                                    iterator();
                                }
                                /** @type {number} */
                                var siteVersion = 0;
                                var versionNumber = resources.length;
                                var promise = new Promise(INTERNAL);
                                return iterator(), promise;
                            }
                            /**
                             * @param {string} data
                             * @param {string} promise
                             * @param {string} context
                             * @return {undefined}
                             */
                            function Disposer(data, promise, context) {
                                /** @type {string} */
                                this._data = data;
                                /** @type {string} */
                                this._promise = promise;
                                /** @type {string} */
                                this._context = context;
                            }
                            /**
                             * @param {?} fn
                             * @param {?} promise
                             * @param {?} context
                             * @return {undefined}
                             */
                            function FunctionDisposer(fn, promise, context) {
                                this.constructor$(fn, promise, context);
                            }
                            /**
                             * @param {!Object} value
                             * @return {?}
                             */
                            function maybeUnwrapDisposer(value) {
                                return Disposer.isDisposer(value) ? (this.resources[this.index]._setDisposable(value), value.promise()) : value;
                            }
                            /**
                             * @param {number} length
                             * @return {undefined}
                             */
                            function ResourceList(length) {
                                /** @type {number} */
                                this.length = length;
                                /** @type {null} */
                                this.promise = null;
                                /** @type {null} */
                                this[length - 1] = null;
                            }
                            var util = _dereq_("./util");
                            var TypeError = _dereq_("./errors").TypeError;
                            var inherits = _dereq_("./util").inherits;
                            var errorObj = util.errorObj;
                            var tryCatch = util.tryCatch;
                            var NULL = {};
                            /**
                             * @return {?}
                             */
                            Disposer.prototype.data = function() {
                                return this._data;
                            };
                            /**
                             * @return {?}
                             */
                            Disposer.prototype.promise = function() {
                                return this._promise;
                            };
                            /**
                             * @return {?}
                             */
                            Disposer.prototype.resource = function() {
                                return this.promise().isFulfilled() ? this.promise().value() : NULL;
                            };
                            /**
                             * @param {?} inspection
                             * @return {?}
                             */
                            Disposer.prototype.tryDispose = function(inspection) {
                                var resource = this.resource();
                                var context = this._context;
                                if (void 0 !== context) {
                                    context._pushContext();
                                }
                                var r = resource !== NULL ? this.doDispose(resource, inspection) : null;
                                return void 0 !== context && context._popContext(), this._promise._unsetDisposable(), this._data = null, r;
                            };
                            /**
                             * @param {!Object} d
                             * @return {?}
                             */
                            Disposer.isDisposer = function(d) {
                                return null != d && "function" == typeof d.resource && "function" == typeof d.tryDispose;
                            };
                            inherits(FunctionDisposer, Disposer);
                            /**
                             * @param {?} resource
                             * @param {?} inspection
                             * @return {?}
                             */
                            FunctionDisposer.prototype.doDispose = function(resource, inspection) {
                                var fn = this.data();
                                return fn.call(resource, resource, inspection);
                            };
                            /**
                             * @return {undefined}
                             */
                            ResourceList.prototype._resultCancelled = function() {
                                var i = this.length;
                                /** @type {number} */
                                var j = 0;
                                for (; j < i; ++j) {
                                    var values = this[j];
                                    if (values instanceof Promise) {
                                        values.cancel();
                                    }
                                }
                            };
                            /**
                             * @return {?}
                             */
                            Promise.using = function() {
                                /** @type {number} */
                                var len = arguments.length;
                                if (len < 2) {
                                    return apiRejection("you must pass at least 2 arguments to Promise.using");
                                }
                                var fn = arguments[len - 1];
                                if ("function" != typeof fn) {
                                    return apiRejection("expecting a function but got " + util.classString(fn));
                                }
                                var args;
                                /** @type {boolean} */
                                var context = true;
                                if (2 === len && Array.isArray(arguments[0])) {
                                    args = arguments[0];
                                    len = args.length;
                                    /** @type {boolean} */
                                    context = false;
                                } else {
                                    /** @type {!Arguments} */
                                    args = arguments;
                                    len--;
                                }
                                var resources = new ResourceList(len);
                                /** @type {number} */
                                var i = 0;
                                for (; i < len; ++i) {
                                    var resource = args[i];
                                    if (Disposer.isDisposer(resource)) {
                                        var disposer = resource;
                                        resource = resource.promise();
                                        resource._setDisposable(disposer);
                                    } else {
                                        var maybePromise = tryConvertToPromise(resource);
                                        if (maybePromise instanceof Promise) {
                                            resource = maybePromise._then(maybeUnwrapDisposer, null, null, {
                                                resources : resources,
                                                index : i
                                            }, void 0);
                                        }
                                    }
                                    resources[i] = resource;
                                }
                                /** @type {!Array} */
                                var b = new Array(resources.length);
                                /** @type {number} */
                                i = 0;
                                for (; i < b.length; ++i) {
                                    b[i] = Promise.resolve(resources[i]).reflect();
                                }
                                var resultPromise = Promise.all(b).then(function(arr) {
                                    /** @type {number} */
                                    var i = 0;
                                    for (; i < arr.length; ++i) {
                                        var ret = arr[i];
                                        if (ret.isRejected()) {
                                            return errorObj.e = ret.error(), errorObj;
                                        }
                                        if (!ret.isFulfilled()) {
                                            return void resultPromise.cancel();
                                        }
                                        arr[i] = ret.value();
                                    }
                                    promise._pushContext();
                                    fn = tryCatch(fn);
                                    var value = context ? fn.apply(void 0, arr) : fn(arr);
                                    var promiseCreated = promise._popContext();
                                    return debug.checkForgottenReturns(value, promiseCreated, "Promise.using", promise), value;
                                });
                                var promise = resultPromise.lastly(function() {
                                    var inspection = new Promise.PromiseInspection(resultPromise);
                                    return dispose(resources, inspection);
                                });
                                return resources.promise = promise, promise._setOnCancel(resources), promise;
                            };
                            /**
                             * @param {!Object} disposer
                             * @return {undefined}
                             */
                            Promise.prototype._setDisposable = function(disposer) {
                                /** @type {number} */
                                this._bitField = 131072 | this._bitField;
                                /** @type {!Object} */
                                this._disposer = disposer;
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype._isDisposable = function() {
                                return (131072 & this._bitField) > 0;
                            };
                            /**
                             * @return {?}
                             */
                            Promise.prototype._getDisposer = function() {
                                return this._disposer;
                            };
                            /**
                             * @return {undefined}
                             */
                            Promise.prototype._unsetDisposable = function() {
                                /** @type {number} */
                                this._bitField = this._bitField & -131073;
                                this._disposer = void 0;
                            };
                            /**
                             * @param {string} fn
                             * @return {?}
                             */
                            Promise.prototype.disposer = function(fn) {
                                if ("function" == typeof fn) {
                                    return new FunctionDisposer(fn, this, createContext());
                                }
                                throw new TypeError;
                            };
                        };
                    }, {
                        "./errors" : 12,
                        "./util" : 36
                    }],
                    36 : [function(require, m, i) {
                        /**
                         * @return {?}
                         */
                        function $() {
                            try {
                                var complete = done;
                                return done = null, complete.apply(this, arguments);
                            } catch (reason) {
                                return errorObj.e = reason, errorObj;
                            }
                        }
                        /**
                         * @param {!Function} fn
                         * @return {?}
                         */
                        function tryCatch(fn) {
                            return done = fn, $;
                        }
                        /**
                         * @param {string} value
                         * @return {?}
                         */
                        function isPrimitive(value) {
                            return null == value || value === true || value === false || "string" == typeof value || "number" == typeof value;
                        }
                        /**
                         * @param {!Object} obj
                         * @return {?}
                         */
                        function isObject(obj) {
                            return "function" == typeof obj || "object" == typeof obj && null !== obj;
                        }
                        /**
                         * @param {string} value
                         * @return {?}
                         */
                        function maybeWrapAsError(value) {
                            return isPrimitive(value) ? new Error(safeToString(value)) : value;
                        }
                        /**
                         * @param {!Array} target
                         * @param {?} value
                         * @return {?}
                         */
                        function withAppended(target, value) {
                            var k;
                            var width = target.length;
                            /** @type {!Array} */
                            var result = new Array(width + 1);
                            /** @type {number} */
                            k = 0;
                            for (; k < width; ++k) {
                                result[k] = target[k];
                            }
                            return result[k] = value, result;
                        }
                        /**
                         * @param {?} obj
                         * @param {boolean} key
                         * @param {string} defaultValue
                         * @return {?}
                         */
                        function getDataPropertyOrDefault(obj, key, defaultValue) {
                            if (!es5.isES5) {
                                return {}.hasOwnProperty.call(obj, key) ? obj[key] : void 0;
                            }
                            /** @type {(ObjectPropertyDescriptor<?>|undefined)} */
                            var r = Object.getOwnPropertyDescriptor(obj, key);
                            return null != r ? null == r.get && null == r.set ? r.value : defaultValue : void 0;
                        }
                        /**
                         * @param {!Function} obj
                         * @param {string} name
                         * @param {!Object} value
                         * @return {?}
                         */
                        function notEnumerableProp(obj, name, value) {
                            if (isPrimitive(obj)) {
                                return obj;
                            }
                            var descriptor = {
                                value : value,
                                configurable : true,
                                enumerable : false,
                                writable : true
                            };
                            return es5.defineProperty(obj, name, descriptor), obj;
                        }
                        /**
                         * @param {?} errorConstructor
                         * @return {?}
                         */
                        function thrower(errorConstructor) {
                            throw errorConstructor;
                        }
                        /**
                         * @param {!Object} fn
                         * @return {?}
                         */
                        function isClass(fn) {
                            try {
                                if ("function" == typeof fn) {
                                    var expRecords = es5.names(fn.prototype);
                                    var canViewMyFiles = es5.isES5 && expRecords.length > 1;
                                    /** @type {boolean} */
                                    var canViewSiteFiles = expRecords.length > 0 && !(1 === expRecords.length && "constructor" === expRecords[0]);
                                    /** @type {boolean} */
                                    var canUploadFiles = rnative.test(fn + "") && es5.names(fn).length > 0;
                                    if (canViewMyFiles || canViewSiteFiles || canUploadFiles) {
                                        return true;
                                    }
                                }
                                return false;
                            } catch (o) {
                                return false;
                            }
                        }
                        /**
                         * @param {!Object} obj
                         * @return {?}
                         */
                        function toFastProperties(obj) {
                            /**
                             * @return {undefined}
                             */
                            function FakeConstructor() {
                            }
                            /** @type {!Object} */
                            FakeConstructor.prototype = obj;
                            /** @type {number} */
                            var n = 8;
                            for (; n--;) {
                                new FakeConstructor;
                            }
                            return obj;
                        }
                        /**
                         * @param {string} str
                         * @return {?}
                         */
                        function isIdentifier(str) {
                            return partten.test(str);
                        }
                        /**
                         * @param {number} count
                         * @param {number} prefix
                         * @param {?} suffix
                         * @return {?}
                         */
                        function filledRange(count, prefix, suffix) {
                            /** @type {!Array} */
                            var ret = new Array(count);
                            /** @type {number} */
                            var i = 0;
                            for (; i < count; ++i) {
                                ret[i] = prefix + i + suffix;
                            }
                            return ret;
                        }
                        /**
                         * @param {string} obj
                         * @return {?}
                         */
                        function safeToString(obj) {
                            try {
                                return obj + "";
                            } catch (e) {
                                return "[no string representation]";
                            }
                        }
                        /**
                         * @param {!Object} obj
                         * @return {?}
                         */
                        function isError(obj) {
                            return obj instanceof Error || null !== obj && "object" == typeof obj && "string" == typeof obj.message && "string" == typeof obj.name;
                        }
                        /**
                         * @param {!Object} e
                         * @return {undefined}
                         */
                        function markAsOriginatingFromRejection(e) {
                            try {
                                notEnumerableProp(e, "isOperational", true);
                            } catch (e) {
                            }
                        }
                        /**
                         * @param {?} e
                         * @return {?}
                         */
                        function isOperationalError(e) {
                            return null != e && (e instanceof Error.__BluebirdErrorTypes__.OperationalError || e.isOperational === true);
                        }
                        /**
                         * @param {!Object} obj
                         * @return {?}
                         */
                        function canAttachTrace(obj) {
                            return isError(obj) && es5.propertyIsWritable(obj, "stack");
                        }
                        /**
                         * @param {?} obj
                         * @return {?}
                         */
                        function classString(obj) {
                            return {}.toString.call(obj);
                        }
                        /**
                         * @param {?} from
                         * @param {!Function} to
                         * @param {!Function} filter
                         * @return {undefined}
                         */
                        function copyDescriptors(from, to, filter) {
                            var privateKeys = es5.names(from);
                            /** @type {number} */
                            var i = 0;
                            for (; i < privateKeys.length; ++i) {
                                var key = privateKeys[i];
                                if (filter(key)) {
                                    try {
                                        es5.defineProperty(to, key, es5.getDescriptor(from, key));
                                    } catch (a) {
                                    }
                                }
                            }
                        }
                        /**
                         * @param {string} key
                         * @return {?}
                         */
                        function env(key) {
                            return pallette ? options.env[key] : void 0;
                        }
                        /**
                         * @return {?}
                         */
                        function generate() {
                            if ("function" == typeof Promise) {
                                try {
                                    /** @type {!Promise} */
                                    var separateCaches = new Promise(function() {
                                    });
                                    if ("[object Promise]" === {}.toString.call(separateCaches)) {
                                        return Promise;
                                    }
                                } catch (e) {
                                }
                            }
                        }
                        /**
                         * @param {!Object} types
                         * @param {string} name
                         * @return {?}
                         */
                        function debuggerDecorator(types, name) {
                            return types.bind(name);
                        }
                        var es5 = require("./es5");
                        /** @type {boolean} */
                        var canEvaluate = "undefined" == typeof navigator;
                        var errorObj = {
                            e : {}
                        };
                        var done;
                        var globals = "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : void 0 !== this ? this : null;
                        /**
                         * @param {!Function} Child
                         * @param {!Function} Parent
                         * @return {?}
                         */
                        var inherits = function(Child, Parent) {
                            /**
                             * @return {undefined}
                             */
                            function T() {
                                /** @type {!Function} */
                                this.constructor = Child;
                                /** @type {!Function} */
                                this.constructor$ = Parent;
                                var propertyName;
                                for (propertyName in Parent.prototype) {
                                    if (hasProp.call(Parent.prototype, propertyName) && "$" !== propertyName.charAt(propertyName.length - 1)) {
                                        this[propertyName + "$"] = Parent.prototype[propertyName];
                                    }
                                }
                            }
                            /** @type {function(this:Object, *): boolean} */
                            var hasProp = {}.hasOwnProperty;
                            return T.prototype = Parent.prototype, Child.prototype = new T, Child.prototype;
                        };
                        var inheritedDataKeys = function() {
                            /** @type {!Array} */
                            var parts = [Array.prototype, Object.prototype, Function.prototype];
                            /**
                             * @param {?} event
                             * @return {?}
                             */
                            var e = function(event) {
                                /** @type {number} */
                                var i = 0;
                                for (; i < parts.length; ++i) {
                                    if (parts[i] === event) {
                                        return true;
                                    }
                                }
                                return false;
                            };
                            if (es5.isES5) {
                                /** @type {function(!Object): !Array<string>} */
                                var getKeys = Object.getOwnPropertyNames;
                                return function(obj) {
                                    /** @type {!Array} */
                                    var folderPathClone = [];
                                    /** @type {!Object} */
                                    var closedFrames = Object.create(null);
                                    for (; null != obj && !e(obj);) {
                                        var keys;
                                        try {
                                            /** @type {!Array<string>} */
                                            keys = getKeys(obj);
                                        } catch (a) {
                                            return folderPathClone;
                                        }
                                        /** @type {number} */
                                        var i = 0;
                                        for (; i < keys.length; ++i) {
                                            /** @type {string} */
                                            var key = keys[i];
                                            if (!closedFrames[key]) {
                                                /** @type {boolean} */
                                                closedFrames[key] = true;
                                                /** @type {(ObjectPropertyDescriptor<?>|undefined)} */
                                                var fooDescriptor = Object.getOwnPropertyDescriptor(obj, key);
                                                if (null != fooDescriptor && null == fooDescriptor.get && null == fooDescriptor.set) {
                                                    folderPathClone.push(key);
                                                }
                                            }
                                        }
                                        obj = es5.getPrototypeOf(obj);
                                    }
                                    return folderPathClone;
                                };
                            }
                            /** @type {function(this:Object, *): boolean} */
                            var validator = {}.hasOwnProperty;
                            return function(data) {
                                if (e(data)) {
                                    return [];
                                }
                                /** @type {!Array} */
                                var historyQueue = [];
                                var entry;
                                t: for (entry in data) {
                                    if (validator.call(data, entry)) {
                                        historyQueue.push(entry);
                                    } else {
                                        /** @type {number} */
                                        var i = 0;
                                        for (; i < parts.length; ++i) {
                                            if (validator.call(parts[i], entry)) {
                                                continue t;
                                            }
                                        }
                                        historyQueue.push(entry);
                                    }
                                }
                                return historyQueue;
                            };
                        }();
                        /** @type {!RegExp} */
                        var rnative = /this\s*\.\s*\S+\s*=/;
                        /** @type {!RegExp} */
                        var partten = /^[a-z$_][a-z$_0-9]*$/i;
                        var ensureErrorObject = function() {
                            return "stack" in new Error ? function(value) {
                                return canAttachTrace(value) ? value : new Error(safeToString(value));
                            } : function(value) {
                                if (canAttachTrace(value)) {
                                    return value;
                                }
                                try {
                                    throw new Error(safeToString(value));
                                } catch (e) {
                                    return e;
                                }
                            };
                        }();
                        /**
                         * @param {?} obj
                         * @return {?}
                         */
                        var asArray = function(obj) {
                            return es5.isArray(obj) ? obj : null;
                        };
                        if ("undefined" != typeof Symbol && Symbol.iterator) {
                            /** @type {function(?): ?} */
                            var isArray = "function" == typeof Array.from ? function(target) {
                                return Array.from(target);
                            } : function(newValues) {
                                var _s;
                                /** @type {!Array} */
                                var _arr = [];
                                var deletedChar = newValues[Symbol.iterator]();
                                for (; !(_s = deletedChar.next()).done;) {
                                    _arr.push(_s.value);
                                }
                                return _arr;
                            };
                            /**
                             * @param {?} obj
                             * @return {?}
                             */
                            asArray = function(obj) {
                                return es5.isArray(obj) ? obj : null != obj && "function" == typeof obj[Symbol.iterator] ? isArray(obj) : null;
                            };
                        }
                        /** @type {boolean} */
                        var isNode = "undefined" != typeof options && "[object process]" === classString(options).toLowerCase();
                        /** @type {boolean} */
                        var pallette = "undefined" != typeof options && "undefined" != typeof options.env;
                        var ret = {
                            isClass : isClass,
                            isIdentifier : isIdentifier,
                            inheritedDataKeys : inheritedDataKeys,
                            getDataPropertyOrDefault : getDataPropertyOrDefault,
                            thrower : thrower,
                            isArray : es5.isArray,
                            asArray : asArray,
                            notEnumerableProp : notEnumerableProp,
                            isPrimitive : isPrimitive,
                            isObject : isObject,
                            isError : isError,
                            canEvaluate : canEvaluate,
                            errorObj : errorObj,
                            tryCatch : tryCatch,
                            inherits : inherits,
                            withAppended : withAppended,
                            maybeWrapAsError : maybeWrapAsError,
                            toFastProperties : toFastProperties,
                            filledRange : filledRange,
                            toString : safeToString,
                            canAttachTrace : canAttachTrace,
                            ensureErrorObject : ensureErrorObject,
                            originatesFromRejection : isOperationalError,
                            markAsOriginatingFromRejection : markAsOriginatingFromRejection,
                            classString : classString,
                            copyDescriptors : copyDescriptors,
                            hasDevTools : "undefined" != typeof chrome && chrome && "function" == typeof chrome.loadTimes,
                            isNode : isNode,
                            hasEnvVariables : pallette,
                            env : env,
                            global : globals,
                            getNativePromise : generate,
                            domainBind : debuggerDecorator
                        };
                        ret.isRecentNode = ret.isNode && function() {
                            var e = options.versions.node.split(".").map(Number);
                            return 0 === e[0] && e[1] > 10 || e[0] > 0;
                        }();
                        if (ret.isNode) {
                            ret.toFastProperties(options);
                        }
                        try {
                            throw new Error;
                        } catch (e) {
                            ret.lastLineError = e;
                        }
                        m.exports = ret;
                    }, {
                        "./es5" : 13
                    }]
                }, {}, [4])(4);
            });
            if ("undefined" != typeof window && null !== window) {
                window.P = window.Promise;
            } else {
                if ("undefined" != typeof self && null !== self) {
                    self.P = self.Promise;
                }
            }
        }).call(this, moment("27"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
        27 : 27
    }],
    25 : [function(canCreateDiscussions, isSlidingUp, n) {
    }, {}],
    26 : [function(moment, canCreateDiscussions, exports) {
        (function(extra) {
            /**
             * @param {!Array} res
             * @param {boolean} parts
             * @return {?}
             */
            function normalizeArray(res, parts) {
                /** @type {number} */
                var n = 0;
                /** @type {number} */
                var level = res.length - 1;
                for (; level >= 0; level--) {
                    var code = res[level];
                    if ("." === code) {
                        res.splice(level, 1);
                    } else {
                        if (".." === code) {
                            res.splice(level, 1);
                            n++;
                        } else {
                            if (n) {
                                res.splice(level, 1);
                                n--;
                            }
                        }
                    }
                }
                if (parts) {
                    for (; n--; n) {
                        res.unshift("..");
                    }
                }
                return res;
            }
            /**
             * @param {!Array} a
             * @param {!Function} f
             * @return {?}
             */
            function filter(a, f) {
                if (a.filter) {
                    return a.filter(f);
                }
                /** @type {!Array} */
                var result = [];
                /** @type {number} */
                var i = 0;
                for (; i < a.length; i++) {
                    if (f(a[i], i, a)) {
                        result.push(a[i]);
                    }
                }
                return result;
            }
            /** @type {!RegExp} */
            var testFileRegex = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
            /**
             * @param {?} filename
             * @return {?}
             */
            var splitPath = function(filename) {
                return testFileRegex.exec(filename).slice(1);
            };
            /**
             * @return {?}
             */
            exports.resolve = function() {
                /** @type {string} */
                var resolvedPath = "";
                /** @type {boolean} */
                var resolvedAbsolute = false;
                /** @type {number} */
                var i = arguments.length - 1;
                for (; i >= -1 && !resolvedAbsolute; i--) {
                    var path = i >= 0 ? arguments[i] : extra.cwd();
                    if ("string" != typeof path) {
                        throw new TypeError("Arguments to path.resolve must be strings");
                    }
                    if (path) {
                        /** @type {string} */
                        resolvedPath = path + "/" + resolvedPath;
                        /** @type {boolean} */
                        resolvedAbsolute = "/" === path.charAt(0);
                    }
                }
                return resolvedPath = normalizeArray(filter(resolvedPath.split("/"), function(canCreateDiscussions) {
                    return !!canCreateDiscussions;
                }), !resolvedAbsolute).join("/"), (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
            };
            /**
             * @param {string} path
             * @return {?}
             */
            exports.normalize = function(path) {
                var isAbsolute = exports.isAbsolute(path);
                /** @type {boolean} */
                var synthetic = "/" === getInfoBoxData(path, -1);
                return path = normalizeArray(filter(path.split("/"), function(canCreateDiscussions) {
                    return !!canCreateDiscussions;
                }), !isAbsolute).join("/"), path || isAbsolute || (path = "."), path && synthetic && (path = path + "/"), (isAbsolute ? "/" : "") + path;
            };
            /**
             * @param {string} pathname
             * @return {?}
             */
            exports.isAbsolute = function(pathname) {
                return "/" === pathname.charAt(0);
            };
            /**
             * @return {?}
             */
            exports.join = function() {
                /** @type {!Array<?>} */
                var t = Array.prototype.slice.call(arguments, 0);
                return exports.normalize(filter(t, function(v, canCreateDiscussions) {
                    if ("string" != typeof v) {
                        throw new TypeError("Arguments to path.join must be strings");
                    }
                    return v;
                }).join("/"));
            };
            /**
             * @param {!Object} e
             * @param {!Object} parent
             * @return {?}
             */
            exports.relative = function(e, parent) {
                /**
                 * @param {!Array} s
                 * @return {?}
                 */
                function trim(s) {
                    /** @type {number} */
                    var i = 0;
                    for (; i < s.length && "" === s[i]; i++) {
                    }
                    /** @type {number} */
                    var k = s.length - 1;
                    for (; k >= 0 && "" === s[k]; k--) {
                    }
                    return i > k ? [] : s.slice(i, k - i + 1);
                }
                e = exports.resolve(e).substr(1);
                parent = exports.resolve(parent).substr(1);
                var fromParts = trim(e.split("/"));
                var toParts = trim(parent.split("/"));
                /** @type {number} */
                var KC = Math.min(fromParts.length, toParts.length);
                /** @type {number} */
                var t = KC;
                /** @type {number} */
                var i = 0;
                for (; i < KC; i++) {
                    if (fromParts[i] !== toParts[i]) {
                        /** @type {number} */
                        t = i;
                        break;
                    }
                }
                /** @type {!Array} */
                var args = [];
                /** @type {number} */
                i = t;
                for (; i < fromParts.length; i++) {
                    args.push("..");
                }
                return args = args.concat(toParts.slice(t)), args.join("/");
            };
            /** @type {string} */
            exports.sep = "/";
            /** @type {string} */
            exports.delimiter = ":";
            /**
             * @param {?} path
             * @return {?}
             */
            exports.dirname = function(path) {
                var result = splitPath(path);
                var type = result[0];
                var i = result[1];
                return type || i ? (i && (i = i.substr(0, i.length - 1)), type + i) : ".";
            };
            /**
             * @param {?} path
             * @param {string} ext
             * @return {?}
             */
            exports.basename = function(path, ext) {
                var font = splitPath(path)[2];
                return ext && font.substr(-1 * ext.length) === ext && (font = font.substr(0, font.length - ext.length)), font;
            };
            /**
             * @param {?} path
             * @return {?}
             */
            exports.extname = function(path) {
                return splitPath(path)[3];
            };
            /** @type {function(string, number, ?): ?} */
            var getInfoBoxData = "b" === "ab".substr(-1) ? function(t, e, n) {
                return t.substr(e, n);
            } : function(p, i, n) {
                return i < 0 && (i = p.length + i), p.substr(i, n);
            };
        }).call(this, moment("27"));
    }, {
        27 : 27
    }],
    27 : [function(canCreateDiscussions, mixin, n) {
        /**
         * @return {?}
         */
        function defaultSetTimout() {
            throw new Error("setTimeout has not been defined");
        }
        /**
         * @return {?}
         */
        function defaultClearTimeout() {
            throw new Error("clearTimeout has not been defined");
        }
        /**
         * @param {!Function} fun
         * @return {?}
         */
        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
                return setTimeout(fun, 0);
            }
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                return cachedSetTimeout = setTimeout, setTimeout(fun, 0);
            }
            try {
                return cachedSetTimeout(fun, 0);
            } catch (e) {
                try {
                    return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }
        }
        /**
         * @param {?} marker
         * @return {?}
         */
        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
                return clearTimeout(marker);
            }
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                return cachedClearTimeout = clearTimeout, clearTimeout(marker);
            }
            try {
                return cachedClearTimeout(marker);
            } catch (e) {
                try {
                    return cachedClearTimeout.call(null, marker);
                } catch (e) {
                    return cachedClearTimeout.call(this, marker);
                }
            }
        }
        /**
         * @return {undefined}
         */
        function cleanUpNextTick() {
            if (m && currentQueue) {
                /** @type {boolean} */
                m = false;
                if (currentQueue.length) {
                    queue = currentQueue.concat(queue);
                } else {
                    /** @type {number} */
                    queueIndex = -1;
                }
                if (queue.length) {
                    drainQueue();
                }
            }
        }
        /**
         * @return {undefined}
         */
        function drainQueue() {
            if (!m) {
                var timeout = runTimeout(cleanUpNextTick);
                /** @type {boolean} */
                m = true;
                var len = queue.length;
                for (; len;) {
                    currentQueue = queue;
                    /** @type {!Array} */
                    queue = [];
                    for (; ++queueIndex < len;) {
                        if (currentQueue) {
                            currentQueue[queueIndex].run();
                        }
                    }
                    /** @type {number} */
                    queueIndex = -1;
                    /** @type {number} */
                    len = queue.length;
                }
                /** @type {null} */
                currentQueue = null;
                /** @type {boolean} */
                m = false;
                runClearTimeout(timeout);
            }
        }
        /**
         * @param {(Object|string)} fun
         * @param {!Array} array
         * @return {undefined}
         */
        function Item(fun, array) {
            /** @type {(Object|string)} */
            this.fun = fun;
            /** @type {!Array} */
            this.array = array;
        }
        /**
         * @return {undefined}
         */
        function noop() {
        }
        var cachedSetTimeout;
        var cachedClearTimeout;
        var process = mixin.exports = {};
        !function() {
            try {
                /** @type {!Function} */
                cachedSetTimeout = "function" == typeof setTimeout ? setTimeout : defaultSetTimout;
            } catch (t) {
                /** @type {function(): ?} */
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                /** @type {!Function} */
                cachedClearTimeout = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
            } catch (t) {
                /** @type {function(): ?} */
                cachedClearTimeout = defaultClearTimeout;
            }
        }();
        var currentQueue;
        /** @type {!Array} */
        var queue = [];
        /** @type {boolean} */
        var m = false;
        /** @type {number} */
        var queueIndex = -1;
        /**
         * @param {!Function} task
         * @return {undefined}
         */
        process.nextTick = function(task) {
            /** @type {!Array} */
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
                /** @type {number} */
                var i = 1;
                for (; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }
            }
            queue.push(new Item(task, args));
            if (!(1 !== queue.length || m)) {
                runTimeout(drainQueue);
            }
        };
        /**
         * @return {undefined}
         */
        Item.prototype.run = function() {
            this.fun.apply(null, this.array);
        };
        /** @type {string} */
        process.title = "browser";
        /** @type {boolean} */
        process.browser = true;
        process.env = {};
        /** @type {!Array} */
        process.argv = [];
        /** @type {string} */
        process.version = "";
        process.versions = {};
        /** @type {function(): undefined} */
        process.on = noop;
        /** @type {function(): undefined} */
        process.addListener = noop;
        /** @type {function(): undefined} */
        process.once = noop;
        /** @type {function(): undefined} */
        process.off = noop;
        /** @type {function(): undefined} */
        process.removeListener = noop;
        /** @type {function(): undefined} */
        process.removeAllListeners = noop;
        /** @type {function(): undefined} */
        process.emit = noop;
        /** @type {function(): undefined} */
        process.prependListener = noop;
        /** @type {function(): undefined} */
        process.prependOnceListener = noop;
        /**
         * @param {?} type
         * @return {?}
         */
        process.listeners = function(type) {
            return [];
        };
        /**
         * @param {?} name
         * @return {?}
         */
        process.binding = function(name) {
            throw new Error("process.binding is not supported");
        };
        /**
         * @return {?}
         */
        process.cwd = function() {
            return "/";
        };
        /**
         * @param {?} dir
         * @return {?}
         */
        process.chdir = function(dir) {
            throw new Error("process.chdir is not supported");
        };
        /**
         * @return {?}
         */
        process.umask = function() {
            return 0;
        };
    }, {}],
    28 : [function(a, module, val) {
        (function(obj, global) {
            !function(global, factory) {
                if ("object" == typeof val && "undefined" != typeof module) {
                    module.exports = factory();
                } else {
                    if ("function" == typeof define && define.amd) {
                        define(factory);
                    } else {
                        global.ES6Promise = factory();
                    }
                }
            }(this, function() {
                /**
                 * @param {!Object} value
                 * @return {?}
                 */
                function isObject(value) {
                    /** @type {string} */
                    var type = typeof value;
                    return null !== value && ("object" === type || "function" === type);
                }
                /**
                 * @param {!Object} value
                 * @return {?}
                 */
                function isFunction(value) {
                    return "function" == typeof value;
                }
                /**
                 * @param {?} scheduleFn
                 * @return {undefined}
                 */
                function setScheduler(scheduleFn) {
                    customSchedulerFn = scheduleFn;
                }
                /**
                 * @param {?} asapFn
                 * @return {undefined}
                 */
                function setAsap(asapFn) {
                    asap = asapFn;
                }
                /**
                 * @return {?}
                 */
                function useNextTick() {
                    return function() {
                        return obj.nextTick(fn);
                    };
                }
                /**
                 * @return {?}
                 */
                function filter() {
                    return "undefined" != typeof callback ? function() {
                        callback(fn);
                    } : useVertxTimer();
                }
                /**
                 * @return {?}
                 */
                function lib$rsvp$asap$$useMutationObserver() {
                    /** @type {number} */
                    var t = 0;
                    var observer = new lib$rsvp$asap$$BrowserMutationObserver(fn);
                    /** @type {!Text} */
                    var event = document.createTextNode("");
                    return observer.observe(event, {
                        characterData : true
                    }), function() {
                        /** @type {number} */
                        event.data = t = ++t % 2;
                    };
                }
                /**
                 * @return {?}
                 */
                function useMessageChannel() {
                    /** @type {!MessageChannel} */
                    var channel = new MessageChannel;
                    return channel.port1.onmessage = fn, function() {
                        return channel.port2.postMessage(0);
                    };
                }
                /**
                 * @return {?}
                 */
                function useVertxTimer() {
                    /** @type {function((!Function|null|string), number=, ...*): number} */
                    var realSetTimeout = setTimeout;
                    return function() {
                        return realSetTimeout(fn, 1);
                    };
                }
                /**
                 * @return {undefined}
                 */
                function fn() {
                    /** @type {number} */
                    var i = 0;
                    for (; i < lib$rsvp$asap$$len; i = i + 2) {
                        var callback = lib$rsvp$asap$$queue[i];
                        var arg = lib$rsvp$asap$$queue[i + 1];
                        callback(arg);
                        lib$rsvp$asap$$queue[i] = void 0;
                        lib$rsvp$asap$$queue[i + 1] = void 0;
                    }
                    /** @type {number} */
                    lib$rsvp$asap$$len = 0;
                }
                /**
                 * @return {?}
                 */
                function attemptVertx() {
                    try {
                        var r = a;
                        var vertx = r("vertx");
                        return callback = vertx.runOnLoop || vertx.runOnContext, filter();
                    } catch (r) {
                        return useVertxTimer();
                    }
                }
                /**
                 * @param {!Function} fn
                 * @param {?} callback
                 * @return {?}
                 */
                function then(fn, callback) {
                    /** @type {!Arguments} */
                    var _arguments = arguments;
                    var parent = this;
                    var child = new this.constructor(noop);
                    if (void 0 === child[PROMISE_ID]) {
                        makePromise(child);
                    }
                    var _state = parent._state;
                    return _state ? !function() {
                        var callback = _arguments[_state - 1];
                        asap(function() {
                            return invokeCallback(_state, child, callback, parent._result);
                        });
                    }() : subscribe(parent, child, fn, callback), child;
                }
                /**
                 * @param {!Object} value
                 * @return {?}
                 */
                function resolve(value) {
                    var Promise = this;
                    if (value && "object" == typeof value && value.constructor === Promise) {
                        return value;
                    }
                    var promise = new Promise(noop);
                    return _resolve(promise, value), promise;
                }
                /**
                 * @return {undefined}
                 */
                function noop() {
                }
                /**
                 * @return {?}
                 */
                function selfFulfillment() {
                    return new TypeError("You cannot resolve a promise with itself");
                }
                /**
                 * @return {?}
                 */
                function cannotReturnOwn() {
                    return new TypeError("A promises callback cannot return that same promise.");
                }
                /**
                 * @param {!Object} promise
                 * @return {?}
                 */
                function getThen(promise) {
                    try {
                        return promise.then;
                    } catch (error) {
                        return GET_THEN_ERROR.error = error, GET_THEN_ERROR;
                    }
                }
                /**
                 * @param {!Function} then
                 * @param {(Object|string)} value
                 * @param {!Function} fulfillmentHandler
                 * @param {!Function} rejectionHandler
                 * @return {?}
                 */
                function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
                    try {
                        then.call(value, fulfillmentHandler, rejectionHandler);
                    } catch (e) {
                        return e;
                    }
                }
                /**
                 * @param {!Object} promise
                 * @param {!Object} thenable
                 * @param {!Object} then
                 * @return {undefined}
                 */
                function handleForeignThenable(promise, thenable, then) {
                    asap(function(promise) {
                        /** @type {boolean} */
                        var sealed = false;
                        var error = tryThen(then, thenable, function(value) {
                            if (!sealed) {
                                /** @type {boolean} */
                                sealed = true;
                                if (thenable !== value) {
                                    _resolve(promise, value);
                                } else {
                                    fulfill(promise, value);
                                }
                            }
                        }, function(value) {
                            if (!sealed) {
                                /** @type {boolean} */
                                sealed = true;
                                _reject(promise, value);
                            }
                        }, "Settle: " + (promise._label || " unknown promise"));
                        if (!sealed && error) {
                            /** @type {boolean} */
                            sealed = true;
                            _reject(promise, error);
                        }
                    }, promise);
                }
                /**
                 * @param {!Object} promise
                 * @param {!Object} thenable
                 * @return {undefined}
                 */
                function handleOwnThenable(promise, thenable) {
                    if (thenable._state === FULFILLED) {
                        fulfill(promise, thenable._result);
                    } else {
                        if (thenable._state === REJECTED) {
                            _reject(promise, thenable._result);
                        } else {
                            subscribe(thenable, void 0, function(value) {
                                return _resolve(promise, value);
                            }, function(value) {
                                return _reject(promise, value);
                            });
                        }
                    }
                }
                /**
                 * @param {!Object} promise
                 * @param {!Object} maybeThenable
                 * @param {!Object} then$$
                 * @return {undefined}
                 */
                function handleMaybeThenable(promise, maybeThenable, then$$) {
                    if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
                        handleOwnThenable(promise, maybeThenable);
                    } else {
                        if (then$$ === GET_THEN_ERROR) {
                            _reject(promise, GET_THEN_ERROR.error);
                            /** @type {null} */
                            GET_THEN_ERROR.error = null;
                        } else {
                            if (void 0 === then$$) {
                                fulfill(promise, maybeThenable);
                            } else {
                                if (isFunction(then$$)) {
                                    handleForeignThenable(promise, maybeThenable, then$$);
                                } else {
                                    fulfill(promise, maybeThenable);
                                }
                            }
                        }
                    }
                }
                /**
                 * @param {!Object} promise
                 * @param {!Object} value
                 * @return {undefined}
                 */
                function _resolve(promise, value) {
                    if (promise === value) {
                        _reject(promise, selfFulfillment());
                    } else {
                        if (isObject(value)) {
                            handleMaybeThenable(promise, value, getThen(value));
                        } else {
                            fulfill(promise, value);
                        }
                    }
                }
                /**
                 * @param {!Request} promise
                 * @return {undefined}
                 */
                function publishRejection(promise) {
                    if (promise._onerror) {
                        promise._onerror(promise._result);
                    }
                    publish(promise);
                }
                /**
                 * @param {!Object} promise
                 * @param {!Object} value
                 * @return {undefined}
                 */
                function fulfill(promise, value) {
                    if (promise._state === PENDING) {
                        /** @type {!Object} */
                        promise._result = value;
                        /** @type {number} */
                        promise._state = FULFILLED;
                        if (0 !== promise._subscribers.length) {
                            asap(publish, promise);
                        }
                    }
                }
                /**
                 * @param {!Object} promise
                 * @param {!Object} reason
                 * @return {undefined}
                 */
                function _reject(promise, reason) {
                    if (promise._state === PENDING) {
                        /** @type {number} */
                        promise._state = REJECTED;
                        /** @type {!Object} */
                        promise._result = reason;
                        asap(publishRejection, promise);
                    }
                }
                /**
                 * @param {!Object} parent
                 * @param {!Object} child
                 * @param {!Function} onFulfillment
                 * @param {!Function} onRejection
                 * @return {undefined}
                 */
                function subscribe(parent, child, onFulfillment, onRejection) {
                    var _subscribers = parent._subscribers;
                    var length = _subscribers.length;
                    /** @type {null} */
                    parent._onerror = null;
                    /** @type {!Object} */
                    _subscribers[length] = child;
                    /** @type {!Function} */
                    _subscribers[length + FULFILLED] = onFulfillment;
                    /** @type {!Function} */
                    _subscribers[length + REJECTED] = onRejection;
                    if (0 === length && parent._state) {
                        asap(publish, parent);
                    }
                }
                /**
                 * @param {!Request} promise
                 * @return {undefined}
                 */
                function publish(promise) {
                    var subscribers = promise._subscribers;
                    var settled = promise._state;
                    if (0 !== subscribers.length) {
                        var child = void 0;
                        var callback = void 0;
                        var detail = promise._result;
                        /** @type {number} */
                        var i = 0;
                        for (; i < subscribers.length; i = i + 3) {
                            child = subscribers[i];
                            callback = subscribers[i + settled];
                            if (child) {
                                invokeCallback(settled, child, callback, detail);
                            } else {
                                callback(detail);
                            }
                        }
                        /** @type {number} */
                        promise._subscribers.length = 0;
                    }
                }
                /**
                 * @return {undefined}
                 */
                function ErrorObject() {
                    /** @type {null} */
                    this.error = null;
                }
                /**
                 * @param {!Object} callback
                 * @param {number} detail
                 * @return {?}
                 */
                function tryCatch(callback, detail) {
                    try {
                        return callback(detail);
                    } catch (fn) {
                        return $.error = fn, $;
                    }
                }
                /**
                 * @param {number} settled
                 * @param {!Object} promise
                 * @param {!Object} callback
                 * @param {number} detail
                 * @return {?}
                 */
                function invokeCallback(settled, promise, callback, detail) {
                    var hasCallback = isFunction(callback);
                    var value = void 0;
                    var error = void 0;
                    var succeeded = void 0;
                    var u = void 0;
                    if (hasCallback) {
                        if (value = tryCatch(callback, detail), value === $ ? (u = true, error = value.error, value.error = null) : succeeded = true, promise === value) {
                            return void _reject(promise, cannotReturnOwn());
                        }
                    } else {
                        /** @type {number} */
                        value = detail;
                        /** @type {boolean} */
                        succeeded = true;
                    }
                    if (!(promise._state !== PENDING)) {
                        if (hasCallback && succeeded) {
                            _resolve(promise, value);
                        } else {
                            if (u) {
                                _reject(promise, error);
                            } else {
                                if (settled === FULFILLED) {
                                    fulfill(promise, value);
                                } else {
                                    if (settled === REJECTED) {
                                        _reject(promise, value);
                                    }
                                }
                            }
                        }
                    }
                }
                /**
                 * @param {!Object} promise
                 * @param {!Function} callback
                 * @return {undefined}
                 */
                function init(promise, callback) {
                    try {
                        callback(function(value) {
                            _resolve(promise, value);
                        }, function(value) {
                            _reject(promise, value);
                        });
                    } catch (reason) {
                        _reject(promise, reason);
                    }
                }
                /**
                 * @return {?}
                 */
                function nextId() {
                    return id++;
                }
                /**
                 * @param {!Object} promise
                 * @return {undefined}
                 */
                function makePromise(promise) {
                    /** @type {number} */
                    promise[PROMISE_ID] = id++;
                    promise._state = void 0;
                    promise._result = void 0;
                    /** @type {!Array} */
                    promise._subscribers = [];
                }
                /**
                 * @param {!Function} Constructor
                 * @param {!Array} input
                 * @return {undefined}
                 */
                function Enumerator(Constructor, input) {
                    /** @type {!Function} */
                    this._instanceConstructor = Constructor;
                    this.promise = new Constructor(noop);
                    if (!this.promise[PROMISE_ID]) {
                        makePromise(this.promise);
                    }
                    if (isArray(input)) {
                        this.length = input.length;
                        this._remaining = input.length;
                        /** @type {!Array} */
                        this._result = new Array(this.length);
                        if (0 === this.length) {
                            fulfill(this.promise, this._result);
                        } else {
                            this.length = this.length || 0;
                            this._enumerate(input);
                            if (0 === this._remaining) {
                                fulfill(this.promise, this._result);
                            }
                        }
                    } else {
                        _reject(this.promise, validationError());
                    }
                }
                /**
                 * @return {?}
                 */
                function validationError() {
                    return new Error("Array Methods must be provided an Array");
                }
                /**
                 * @param {!Array} object
                 * @return {?}
                 */
                function all(object) {
                    return (new Enumerator(this, object)).promise;
                }
                /**
                 * @param {!Array} entries
                 * @return {?}
                 */
                function race(entries) {
                    var Constructor = this;
                    return new Constructor(isArray(entries) ? function(n, fn) {
                        var length = entries.length;
                        /** @type {number} */
                        var i = 0;
                        for (; i < length; i++) {
                            Constructor.resolve(entries[i]).then(n, fn);
                        }
                    } : function(canCreateDiscussions, reject) {
                        return reject(new TypeError("You must pass an array to race."));
                    });
                }
                /**
                 * @param {!Error} reason
                 * @return {?}
                 */
                function reject(reason) {
                    var Constructor = this;
                    var promise = new Constructor(noop);
                    return _reject(promise, reason), promise;
                }
                /**
                 * @return {?}
                 */
                function needsResolver() {
                    throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
                }
                /**
                 * @return {?}
                 */
                function needsNew() {
                    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
                }
                /**
                 * @param {!Function} callback
                 * @return {undefined}
                 */
                function Promise(callback) {
                    this[PROMISE_ID] = nextId();
                    this._result = this._state = void 0;
                    /** @type {!Array} */
                    this._subscribers = [];
                    if (noop !== callback) {
                        if ("function" != typeof callback) {
                            needsResolver();
                        }
                        if (this instanceof Promise) {
                            init(this, callback);
                        } else {
                            needsNew();
                        }
                    }
                }
                /**
                 * @return {undefined}
                 */
                function polyfill() {
                    var local = void 0;
                    if ("undefined" != typeof global) {
                        /** @type {number} */
                        local = global;
                    } else {
                        if ("undefined" != typeof self) {
                            /** @type {!Window} */
                            local = self;
                        } else {
                            try {
                                local = Function("return this")();
                            } catch (e) {
                                throw new Error("polyfill failed because global object is unavailable in this environment");
                            }
                        }
                    }
                    var P = local.Promise;
                    if (P) {
                        /** @type {null} */
                        var r = null;
                        try {
                            /** @type {string} */
                            r = Object.prototype.toString.call(P.resolve());
                        } catch (e) {
                        }
                        if ("[object Promise]" === r && !P.cast) {
                            return;
                        }
                    }
                    /** @type {function(!Function): undefined} */
                    local.Promise = Promise;
                }
                var _isArray = void 0;
                /** @type {!Function} */
                _isArray = Array.isArray ? Array.isArray : function(obj) {
                    return "[object Array]" === Object.prototype.toString.call(obj);
                };
                /** @type {!Function} */
                var isArray = _isArray;
                /** @type {number} */
                var lib$rsvp$asap$$len = 0;
                var callback = void 0;
                var customSchedulerFn = void 0;
                /**
                 * @param {!Function} callback
                 * @param {!Object} arg
                 * @return {undefined}
                 */
                var asap = function(callback, arg) {
                    /** @type {!Function} */
                    lib$rsvp$asap$$queue[lib$rsvp$asap$$len] = callback;
                    /** @type {!Object} */
                    lib$rsvp$asap$$queue[lib$rsvp$asap$$len + 1] = arg;
                    lib$rsvp$asap$$len = lib$rsvp$asap$$len + 2;
                    if (2 === lib$rsvp$asap$$len) {
                        if (customSchedulerFn) {
                            customSchedulerFn(fn);
                        } else {
                            rawAsap();
                        }
                    }
                };
                /** @type {(Window|undefined)} */
                var R = "undefined" != typeof window ? window : void 0;
                /** @type {(Window|{})} */
                var V = R || {};
                var lib$rsvp$asap$$BrowserMutationObserver = V.MutationObserver || V.WebKitMutationObserver;
                /** @type {boolean} */
                var hasBlank = "undefined" == typeof self && "undefined" != typeof obj && "[object process]" === {}.toString.call(obj);
                /** @type {boolean} */
                var rawDataIsList = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel;
                /** @type {!Array} */
                var lib$rsvp$asap$$queue = new Array(1E3);
                var rawAsap = void 0;
                rawAsap = hasBlank ? useNextTick() : lib$rsvp$asap$$BrowserMutationObserver ? lib$rsvp$asap$$useMutationObserver() : rawDataIsList ? useMessageChannel() : void 0 === R && "function" == typeof a ? attemptVertx() : useVertxTimer();
                /** @type {string} */
                var PROMISE_ID = Math.random().toString(36).substring(16);
                var PENDING = void 0;
                /** @type {number} */
                var FULFILLED = 1;
                /** @type {number} */
                var REJECTED = 2;
                var GET_THEN_ERROR = new ErrorObject;
                var $ = new ErrorObject;
                /** @type {number} */
                var id = 0;
                return Enumerator.prototype._enumerate = function(input) {
                    /** @type {number} */
                    var i = 0;
                    for (; this._state === PENDING && i < input.length; i++) {
                        this._eachEntry(input[i], i);
                    }
                }, Enumerator.prototype._eachEntry = function(entry, i) {
                    var c = this._instanceConstructor;
                    var resolve$$ = c.resolve;
                    if (resolve$$ === resolve) {
                        var _then = getThen(entry);
                        if (_then === then && entry._state !== PENDING) {
                            this._settledAt(entry._state, i, entry._result);
                        } else {
                            if ("function" != typeof _then) {
                                this._remaining--;
                                /** @type {!Object} */
                                this._result[i] = entry;
                            } else {
                                if (c === Promise) {
                                    var promise = new c(noop);
                                    handleMaybeThenable(promise, entry, _then);
                                    this._willSettleAt(promise, i);
                                } else {
                                    this._willSettleAt(new c(function(resolve$$) {
                                        return resolve$$(entry);
                                    }), i);
                                }
                            }
                        }
                    } else {
                        this._willSettleAt(resolve$$(entry), i);
                    }
                }, Enumerator.prototype._settledAt = function(state, i, value) {
                    var promise = this.promise;
                    if (promise._state === PENDING) {
                        this._remaining--;
                        if (state === REJECTED) {
                            _reject(promise, value);
                        } else {
                            /** @type {!Object} */
                            this._result[i] = value;
                        }
                    }
                    if (0 === this._remaining) {
                        fulfill(promise, this._result);
                    }
                }, Enumerator.prototype._willSettleAt = function(promise, i) {
                    var enumerator = this;
                    subscribe(promise, void 0, function(value) {
                        return enumerator._settledAt(FULFILLED, i, value);
                    }, function(value) {
                        return enumerator._settledAt(REJECTED, i, value);
                    });
                }, Promise.all = all, Promise.race = race, Promise.resolve = resolve, Promise.reject = reject, Promise._setScheduler = setScheduler, Promise._setAsap = setAsap, Promise._asap = asap, Promise.prototype = {
                    constructor : Promise,
                    then : then,
                    "catch" : function(fn) {
                        return this.then(null, fn);
                    }
                }, Promise.polyfill = polyfill, Promise.Promise = Promise, Promise;
            });
        }).call(this, a("27"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
        27 : 27
    }],
    29 : [function($, mixin, utils) {
        var ref = $("26");
        var select = $("31");
        var _slic = $("30");
        var self = $("32");
        /** @type {function(): ?} */
        utils = mixin.exports = function() {
            var q = _slic(arguments).map(s);
            return self.isUri(q[0]) ? select.apply(select, q) : ref.join.apply(ref, q);
        };
        /** @type {function(!Array, ?, !Object): ?} */
        var s = (utils.isUrl = function(value) {
            return self.isUri(value) || "http://" === value || "https://" === value || "ftp://" === value;
        }, utils.replaceUndefined = function(t, value, key) {
            return void 0 === t || null === t ? self.isUri(key[0]) ? "/" : ref.sep : t;
        });
    }, {
        26 : 26,
        30 : 30,
        31 : 31,
        32 : 32
    }],
    30 : [function(canCreateDiscussions, mixin, n) {
        /**
         * @param {!Array} value
         * @return {?}
         */
        function eq(value) {
            return "[object Object]" === Object.prototype.toString.call(value);
        }
        /**
         * @param {!Array} value
         * @return {?}
         */
        function getStringTag(value) {
            return "[object Arguments]" === Object.prototype.toString.call(value);
        }
        /**
         * @param {!Array} cache
         * @return {?}
         */
        function makeStyleLoaders(cache) {
            return Object.keys(cache).map(function(colorSpace) {
                return cache[colorSpace];
            });
        }
        /**
         * @param {!Array} value
         * @param {!Object} result
         * @return {?}
         */
        mixin.exports = function(value, result) {
            return value || (value = []), getStringTag(value) && (value = [].splice.call(value, 0)), eq(value) && result && (value = makeStyleLoaders(value)), Array.isArray(value) ? value : [value];
        };
    }, {}],
    31 : [function(canCreateDiscussions, mixin, n) {
        /**
         * @param {string} name
         * @return {?}
         */
        function normalize(name) {
            return name.replace(/[\/]+/g, "/").replace(/\/\?/g, "?").replace(/\/#/g, "#").replace(/:\//g, "://");
        }
        /**
         * @return {?}
         */
        mixin.exports = function() {
            /** @type {string} */
            var joined = [].slice.call(arguments, 0).join("/");
            return normalize(joined);
        };
    }, {}],
    32 : [function(canCreateDiscussions, moduleTransport, n) {
        !function(module) {
            /**
             * @param {string} value
             * @return {?}
             */
            function is_iri(value) {
                if (value && !/[^a-z0-9:\/\?#\[\]@!\$&'\(\)\*\+,;=\.\-_~%]/i.test(value) && !/%[^0-9a-f]/i.test(value) && !/%[0-9a-f](:?[^0-9a-f]|$)/i.test(value)) {
                    /** @type {!Array} */
                    var result = [];
                    /** @type {string} */
                    var n = "";
                    /** @type {string} */
                    var lang = "";
                    /** @type {string} */
                    var expression = "";
                    /** @type {string} */
                    var body = "";
                    /** @type {string} */
                    var prefix = "";
                    /** @type {string} */
                    var s = "";
                    if (result = splitUri(value), n = result[1], lang = result[2], expression = result[3], body = result[4], prefix = result[5], n && n.length && expression.length >= 0) {
                        if (lang && lang.length) {
                            if (0 !== expression.length && !/^\//.test(expression)) {
                                return;
                            }
                        } else {
                            if (/^\/\//.test(expression)) {
                                return;
                            }
                        }
                        if (/^[a-z][a-z0-9\+\-\.]*$/.test(n.toLowerCase())) {
                            return s = s + (n + ":"), lang && lang.length && (s = s + ("//" + lang)), s = s + expression, body && body.length && (s = s + ("?" + body)), prefix && prefix.length && (s = s + ("#" + prefix)), s;
                        }
                    }
                }
            }
            /**
             * @param {string} value
             * @param {boolean} _flexdatalist
             * @return {?}
             */
            function is_http_iri(value, _flexdatalist) {
                if (is_iri(value)) {
                    /** @type {!Array} */
                    var m = [];
                    /** @type {string} */
                    var prefix = "";
                    /** @type {string} */
                    var val = "";
                    /** @type {string} */
                    var append = "";
                    /** @type {string} */
                    var key = "";
                    /** @type {string} */
                    var code = "";
                    /** @type {string} */
                    var current = "";
                    /** @type {string} */
                    var result = "";
                    if (m = splitUri(value), prefix = m[1], val = m[2], append = m[3], code = m[4], current = m[5], prefix) {
                        if (_flexdatalist) {
                            if ("https" != prefix.toLowerCase()) {
                                return;
                            }
                        } else {
                            if ("http" != prefix.toLowerCase()) {
                                return;
                            }
                        }
                        if (val) {
                            return /:(\d+)$/.test(val) && (key = val.match(/:(\d+)$/)[0], val = val.replace(/:\d+$/, "")), result = result + (prefix + ":"), result = result + ("//" + val), key && (result = result + key), result = result + append, code && code.length && (result = result + ("?" + code)), current && current.length && (result = result + ("#" + current)), result;
                        }
                    }
                }
            }
            /**
             * @param {string} value
             * @return {?}
             */
            function is_https_iri(value) {
                return is_http_iri(value, true);
            }
            /**
             * @param {string} value
             * @return {?}
             */
            function is_web_iri(value) {
                return is_http_iri(value) || is_https_iri(value);
            }
            /** @type {function(string): ?} */
            module.exports.is_uri = is_iri;
            /** @type {function(string, boolean): ?} */
            module.exports.is_http_uri = is_http_iri;
            /** @type {function(string): ?} */
            module.exports.is_https_uri = is_https_iri;
            /** @type {function(string): ?} */
            module.exports.is_web_uri = is_web_iri;
            /** @type {function(string): ?} */
            module.exports.isUri = is_iri;
            /** @type {function(string, boolean): ?} */
            module.exports.isHttpUri = is_http_iri;
            /** @type {function(string): ?} */
            module.exports.isHttpsUri = is_https_iri;
            /** @type {function(string): ?} */
            module.exports.isWebUri = is_web_iri;
            /**
             * @param {string} uri
             * @return {?}
             */
            var splitUri = function(uri) {
                var components = uri.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/);
                return components;
            };
        }(moduleTransport);
    }, {}],
    33 : [function(canCreateDiscussions, module, val) {
        !function(factory) {
            if ("function" == typeof define && define.amd) {
                define(["jquery"], factory);
            } else {
                if ("object" == typeof val) {
                    /** @type {function(!Object): undefined} */
                    module.exports = factory;
                } else {
                    factory(jQuery);
                }
            }
        }(function($) {
            /**
             * @param {!Object} event
             * @return {?}
             */
            function handler(event) {
                var orgEvent = event || window.event;
                /** @type {!Array<?>} */
                var args = slice.call(arguments, 1);
                /** @type {number} */
                var delta = 0;
                /** @type {number} */
                var deltaX = 0;
                /** @type {number} */
                var deltaY = 0;
                /** @type {number} */
                var absDelta = 0;
                /** @type {number} */
                var offsetX = 0;
                /** @type {number} */
                var offsetY = 0;
                if (event = $.event.fix(orgEvent), event.type = "mousewheel", "detail" in orgEvent && (deltaY = orgEvent.detail * -1), "wheelDelta" in orgEvent && (deltaY = orgEvent.wheelDelta), "wheelDeltaY" in orgEvent && (deltaY = orgEvent.wheelDeltaY), "wheelDeltaX" in orgEvent && (deltaX = orgEvent.wheelDeltaX * -1), "axis" in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS && (deltaX = deltaY * -1, deltaY = 0), delta = 0 === deltaY ? deltaX : deltaY, "deltaY" in orgEvent && (deltaY = orgEvent.deltaY *
                    -1, delta = deltaY), "deltaX" in orgEvent && (deltaX = orgEvent.deltaX, 0 === deltaY && (delta = deltaX * -1)), 0 !== deltaY || 0 !== deltaX) {
                    if (1 === orgEvent.deltaMode) {
                        var lineHeight = $.data(this, "mousewheel-line-height");
                        /** @type {number} */
                        delta = delta * lineHeight;
                        /** @type {number} */
                        deltaY = deltaY * lineHeight;
                        /** @type {number} */
                        deltaX = deltaX * lineHeight;
                    } else {
                        if (2 === orgEvent.deltaMode) {
                            var pageHeight = $.data(this, "mousewheel-page-height");
                            /** @type {number} */
                            delta = delta * pageHeight;
                            /** @type {number} */
                            deltaY = deltaY * pageHeight;
                            /** @type {number} */
                            deltaX = deltaX * pageHeight;
                        }
                    }
                    if (absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX)), (!lowestDelta || absDelta < lowestDelta) && (lowestDelta = absDelta, shouldAdjustOldDeltas(orgEvent, absDelta) && (lowestDelta = lowestDelta / 40)), shouldAdjustOldDeltas(orgEvent, absDelta) && (delta = delta / 40, deltaX = deltaX / 40, deltaY = deltaY / 40), delta = Math[delta >= 1 ? "floor" : "ceil"](delta / lowestDelta), deltaX = Math[deltaX >= 1 ? "floor" : "ceil"](deltaX / lowestDelta), deltaY = Math[deltaY >= 1 ? "floor" :
                        "ceil"](deltaY / lowestDelta), special.settings.normalizeOffset && this.getBoundingClientRect) {
                        var rect = this.getBoundingClientRect();
                        /** @type {number} */
                        offsetX = event.clientX - rect.left;
                        /** @type {number} */
                        offsetY = event.clientY - rect.top;
                    }
                    return event.deltaX = deltaX, event.deltaY = deltaY, event.deltaFactor = lowestDelta, event.offsetX = offsetX, event.offsetY = offsetY, event.deltaMode = 0, args.unshift(event, delta, deltaX, deltaY), timeout && clearTimeout(timeout), timeout = setTimeout(checkChanges, 200), ($.event.dispatch || $.event.handle).apply(this, args);
                }
            }
            /**
             * @return {undefined}
             */
            function checkChanges() {
                /** @type {null} */
                lowestDelta = null;
            }
            /**
             * @param {!Object} orgEvent
             * @param {number} absDelta
             * @return {?}
             */
            function shouldAdjustOldDeltas(orgEvent, absDelta) {
                return special.settings.adjustOldDeltas && "mousewheel" === orgEvent.type && absDelta % 120 === 0;
            }
            var timeout;
            var lowestDelta;
            /** @type {!Array} */
            var toFix = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"];
            /** @type {!Array} */
            var toBind = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"];
            /** @type {function(this:(IArrayLike<T>|string), *=, *=): !Array<T>} */
            var slice = Array.prototype.slice;
            if ($.event.fixHooks) {
                /** @type {number} */
                var i = toFix.length;
                for (; i;) {
                    $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
                }
            }
            var special = $.event.special.mousewheel = {
                version : "3.1.12",
                setup : function() {
                    if (this.addEventListener) {
                        /** @type {number} */
                        var i = toBind.length;
                        for (; i;) {
                            this.addEventListener(toBind[--i], handler, false);
                        }
                    } else {
                        /** @type {function(!Object): ?} */
                        this.onmousewheel = handler;
                    }
                    $.data(this, "mousewheel-line-height", special.getLineHeight(this));
                    $.data(this, "mousewheel-page-height", special.getPageHeight(this));
                },
                teardown : function() {
                    if (this.removeEventListener) {
                        /** @type {number} */
                        var i = toBind.length;
                        for (; i;) {
                            this.removeEventListener(toBind[--i], handler, false);
                        }
                    } else {
                        /** @type {null} */
                        this.onmousewheel = null;
                    }
                    $.removeData(this, "mousewheel-line-height");
                    $.removeData(this, "mousewheel-page-height");
                },
                getLineHeight : function(elem) {
                    var $elem = $(elem);
                    var d = $elem["offsetParent" in $.fn ? "offsetParent" : "parent"]();
                    return d.length || (d = $("body")), parseInt(d.css("fontSize"), 10) || parseInt($elem.css("fontSize"), 10) || 16;
                },
                getPageHeight : function(elem) {
                    return $(elem).height();
                },
                settings : {
                    adjustOldDeltas : true,
                    normalizeOffset : true
                }
            };
            $.fn.extend({
                mousewheel : function(fn) {
                    return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
                },
                unmousewheel : function(fn) {
                    return this.unbind("mousewheel", fn);
                }
            });
        });
    }, {}],
    34 : [function(canCreateDiscussions, module, exports) {
        (function(value) {
            (function() {
                /**
                 * @param {!Object} other
                 * @param {!Object} value
                 * @return {?}
                 */
                function compareAscending(other, value) {
                    if (other !== value) {
                        /** @type {boolean} */
                        var othIsNull = null === other;
                        /** @type {boolean} */
                        var othIsUndef = other === undefined;
                        /** @type {boolean} */
                        var othIsReflexive = other === other;
                        /** @type {boolean} */
                        var valIsNull = null === value;
                        /** @type {boolean} */
                        var valIsUndef = value === undefined;
                        /** @type {boolean} */
                        var valIsReflexive = value === value;
                        if (other > value && !valIsNull || !othIsReflexive || othIsNull && !valIsUndef && valIsReflexive || othIsUndef && valIsReflexive) {
                            return 1;
                        }
                        if (other < value && !othIsNull || !valIsReflexive || valIsNull && !othIsUndef && othIsReflexive || valIsUndef && othIsReflexive) {
                            return -1;
                        }
                    }
                    return 0;
                }
                /**
                 * @param {!Object} a
                 * @param {string} f
                 * @param {string} from
                 * @return {?}
                 */
                function indexOf(a, f, from) {
                    var max = a.length;
                    var i = from ? max : -1;
                    for (; from ? i-- : ++i < max;) {
                        if (f(a[i], i, a)) {
                            return i;
                        }
                    }
                    return -1;
                }
                /**
                 * @param {string} name
                 * @param {number} o
                 * @param {number} a
                 * @return {?}
                 */
                function find(name, o, a) {
                    if (o !== o) {
                        return apply(name, a);
                    }
                    /** @type {number} */
                    var j = a - 1;
                    var n = name.length;
                    for (; ++j < n;) {
                        if (name[j] === o) {
                            return j;
                        }
                    }
                    return -1;
                }
                /**
                 * @param {?} value
                 * @return {?}
                 */
                function e(value) {
                    return "function" == typeof value || false;
                }
                /**
                 * @param {string} name
                 * @return {?}
                 */
                function String(name) {
                    return null == name ? "" : name + "";
                }
                /**
                 * @param {string} input
                 * @param {string} s
                 * @return {?}
                 */
                function c(input, s) {
                    /** @type {number} */
                    var a = -1;
                    var len = input.length;
                    for (; ++a < len && s.indexOf(input.charAt(a)) > -1;) {
                    }
                    return a;
                }
                /**
                 * @param {string} object
                 * @param {string} paths
                 * @return {?}
                 */
                function filter(object, paths) {
                    var x = object.length;
                    for (; x-- && paths.indexOf(object.charAt(x)) > -1;) {
                    }
                    return x;
                }
                /**
                 * @param {!Object} object
                 * @param {!Object} other
                 * @return {?}
                 */
                function compare(object, other) {
                    return compareAscending(object.criteria, other.criteria) || object.index - other.index;
                }
                /**
                 * @param {!Object} object
                 * @param {!Object} other
                 * @param {!Object} n
                 * @return {?}
                 */
                function select(object, other, n) {
                    /** @type {number} */
                    var index = -1;
                    var objCriteria = object.criteria;
                    var othCriteria = other.criteria;
                    var length = objCriteria.length;
                    var count = n.length;
                    for (; ++index < length;) {
                        var result = compareAscending(objCriteria[index], othCriteria[index]);
                        if (result) {
                            if (index >= count) {
                                return result;
                            }
                            var last = n[index];
                            return result * ("asc" === last || last === true ? 1 : -1);
                        }
                    }
                    return object.index - other.index;
                }
                /**
                 * @param {?} hash
                 * @return {?}
                 */
                function h(hash) {
                    return deletedHashes[hash];
                }
                /**
                 * @param {?} trait
                 * @return {?}
                 */
                function from(trait) {
                    return traitsChosen[trait];
                }
                /**
                 * @param {string} t
                 * @param {!Function} x
                 * @param {string} y
                 * @return {?}
                 */
                function p(t, x, y) {
                    return x ? t = CHAR_MAP[t] : y && (t = transformed_points[t]), "\\" + t;
                }
                /**
                 * @param {?} t
                 * @return {?}
                 */
                function version(t) {
                    return "\\" + transformed_points[t];
                }
                /**
                 * @param {!Object} val
                 * @param {number} e
                 * @param {boolean} sign
                 * @return {?}
                 */
                function apply(val, e, sign) {
                    var k = val.length;
                    var o = e + (sign ? 0 : -1);
                    for (; sign ? o-- : ++o < k;) {
                        var obj = val[o];
                        if (obj !== obj) {
                            return o;
                        }
                    }
                    return -1;
                }
                /**
                 * @param {!Array} value
                 * @return {?}
                 */
                function isObjectLike(value) {
                    return !!value && "object" == typeof value;
                }
                /**
                 * @param {number} actual
                 * @return {?}
                 */
                function log(actual) {
                    return actual <= 160 && actual >= 9 && actual <= 13 || 32 == actual || 160 == actual || 5760 == actual || 6158 == actual || actual >= 8192 && (actual <= 8202 || 8232 == actual || 8233 == actual || 8239 == actual || 8287 == actual || 12288 == actual || 65279 == actual);
                }
                /**
                 * @param {number} array
                 * @param {string} value
                 * @return {?}
                 */
                function callback(array, value) {
                    /** @type {number} */
                    var i = -1;
                    var length = array.length;
                    /** @type {number} */
                    var ol = -1;
                    /** @type {!Array} */
                    var o = [];
                    for (; ++i < length;) {
                        if (array[i] === value) {
                            /** @type {string} */
                            array[i] = length;
                            /** @type {number} */
                            o[++ol] = i;
                        }
                    }
                    return o;
                }
                /**
                 * @param {number} data
                 * @param {!Object} callback
                 * @return {?}
                 */
                function next(data, callback) {
                    var _currDirection;
                    /** @type {number} */
                    var i = -1;
                    var l = data.length;
                    /** @type {number} */
                    var j = -1;
                    /** @type {!Array} */
                    var result = [];
                    for (; ++i < l;) {
                        var value = data[i];
                        var fadein = callback ? callback(value, i, data) : value;
                        if (!(i && _currDirection === fadein)) {
                            _currDirection = fadein;
                            result[++j] = value;
                        }
                    }
                    return result;
                }
                /**
                 * @param {string} val
                 * @return {?}
                 */
                function write(val) {
                    /** @type {number} */
                    var i = -1;
                    var l = val.length;
                    for (; ++i < l && log(val.charCodeAt(i));) {
                    }
                    return i;
                }
                /**
                 * @param {string} t
                 * @return {?}
                 */
                function map(t) {
                    var s = t.length;
                    for (; s-- && log(t.charCodeAt(s));) {
                    }
                    return s;
                }
                /**
                 * @param {?} component
                 * @return {?}
                 */
                function listener(component) {
                    return hooksByComponent[component];
                }
                /**
                 * @param {!Object} global
                 * @return {?}
                 */
                function runInContext(global) {
                    /**
                     * @param {!Function} value
                     * @return {?}
                     */
                    function exports(value) {
                        if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
                            if (value instanceof LodashWrapper) {
                                return value;
                            }
                            if (self.call(value, "__chain__") && self.call(value, "__wrapped__")) {
                                return wrapperClone(value);
                            }
                        }
                        return new LodashWrapper(value);
                    }
                    /**
                     * @return {undefined}
                     */
                    function lodash() {
                    }
                    /**
                     * @param {?} value
                     * @param {!Object} depth
                     * @param {number} actions
                     * @return {undefined}
                     */
                    function LodashWrapper(value, depth, actions) {
                        this.__wrapped__ = value;
                        this.__actions__ = actions || [];
                        /** @type {boolean} */
                        this.__chain__ = !!depth;
                    }
                    /**
                     * @param {?} value
                     * @return {undefined}
                     */
                    function LazyWrapper(value) {
                        this.__wrapped__ = value;
                        /** @type {!Array} */
                        this.__actions__ = [];
                        /** @type {number} */
                        this.__dir__ = 1;
                        /** @type {boolean} */
                        this.__filtered__ = false;
                        /** @type {!Array} */
                        this.__iteratees__ = [];
                        this.__takeCount__ = x;
                        /** @type {!Array} */
                        this.__views__ = [];
                    }
                    /**
                     * @return {?}
                     */
                    function lazyClone() {
                        var result = new LazyWrapper(this.__wrapped__);
                        return result.__actions__ = copyArray(this.__actions__), result.__dir__ = this.__dir__, result.__filtered__ = this.__filtered__, result.__iteratees__ = copyArray(this.__iteratees__), result.__takeCount__ = this.__takeCount__, result.__views__ = copyArray(this.__views__), result;
                    }
                    /**
                     * @return {?}
                     */
                    function lazyReverse() {
                        if (this.__filtered__) {
                            var result = new LazyWrapper(this);
                            /** @type {number} */
                            result.__dir__ = -1;
                            /** @type {boolean} */
                            result.__filtered__ = true;
                        } else {
                            result = this.clone();
                            result.__dir__ *= -1;
                        }
                        return result;
                    }
                    /**
                     * @return {?}
                     */
                    function lazyValue() {
                        var array = this.__wrapped__.value();
                        var dir = this.__dir__;
                        var isArr = isArray(array);
                        /** @type {boolean} */
                        var isRight = dir < 0;
                        var arrLength = isArr ? array.length : 0;
                        var view = getView(0, arrLength, this.__views__);
                        var start = view.start;
                        var end = view.end;
                        /** @type {number} */
                        var length = end - start;
                        var index = isRight ? end : start - 1;
                        var iteratees = this.__iteratees__;
                        var iterLength = iteratees.length;
                        /** @type {number} */
                        var resIndex = 0;
                        var takeCount = nativeMin(length, this.__takeCount__);
                        if (!isArr || arrLength < LARGE_ARRAY_SIZE || arrLength == length && takeCount == length) {
                            return func(isRight && isArr ? array.reverse() : array, this.__actions__);
                        }
                        /** @type {!Array} */
                        var result = [];
                        t: for (; length-- && resIndex < takeCount;) {
                            index = index + dir;
                            /** @type {number} */
                            var iterIndex = -1;
                            var v = array[index];
                            for (; ++iterIndex < iterLength;) {
                                var data = iteratees[iterIndex];
                                var iteratee = data.iteratee;
                                var ensureLastBaseIsRdpEditType = data.type;
                                var value = iteratee(v);
                                if (ensureLastBaseIsRdpEditType == Refurbishment) {
                                    v = value;
                                } else {
                                    if (!value) {
                                        if (ensureLastBaseIsRdpEditType == userData) {
                                            continue t;
                                        }
                                        break t;
                                    }
                                }
                            }
                            result[resIndex++] = v;
                        }
                        return result;
                    }
                    /**
                     * @return {undefined}
                     */
                    function MapCache() {
                        this.__data__ = {};
                    }
                    /**
                     * @param {undefined} key
                     * @return {?}
                     */
                    function hashDelete(key) {
                        return this.has(key) && delete this.__data__[key];
                    }
                    /**
                     * @param {string} key
                     * @return {?}
                     */
                    function listCacheGet(key) {
                        return "__proto__" == key ? undefined : this.__data__[key];
                    }
                    /**
                     * @param {string} object
                     * @return {?}
                     */
                    function groupBy(object) {
                        return "__proto__" != object && self.call(this.__data__, object);
                    }
                    /**
                     * @param {number} name
                     * @param {?} value
                     * @return {?}
                     */
                    function mapSet(name, value) {
                        return "__proto__" != name && (this.__data__[name] = value), this;
                    }
                    /**
                     * @param {!Object} values
                     * @return {undefined}
                     */
                    function SetCache(values) {
                        var value = values ? values.length : 0;
                        this.data = {
                            hash : nativeCreate(null),
                            set : new Set
                        };
                        for (; value--;) {
                            this.push(values[value]);
                        }
                    }
                    /**
                     * @param {!Object} cache
                     * @param {undefined} value
                     * @return {?}
                     */
                    function cacheIndexOf(cache, value) {
                        var data = cache.data;
                        var r = "string" == typeof value || isObject(value) ? data.set.has(value) : data.hash[value];
                        return r ? 0 : -1;
                    }
                    /**
                     * @param {!Object} value
                     * @return {undefined}
                     */
                    function cachePush(value) {
                        var user = this.data;
                        if ("string" == typeof value || isObject(value)) {
                            user.set.add(value);
                        } else {
                            /** @type {boolean} */
                            user.hash[value] = true;
                        }
                    }
                    /**
                     * @param {!NodeList} val
                     * @param {number} keys
                     * @return {?}
                     */
                    function serialize(val, keys) {
                        /** @type {number} */
                        var k = -1;
                        var len = val.length;
                        /** @type {number} */
                        var i = -1;
                        var offset = keys.length;
                        var data = Array(len + offset);
                        for (; ++k < len;) {
                            data[k] = val[k];
                        }
                        for (; ++i < offset;) {
                            data[k++] = keys[i];
                        }
                        return data;
                    }
                    /**
                     * @param {!Array} result
                     * @param {number} array
                     * @return {?}
                     */
                    function copyArray(result, array) {
                        /** @type {number} */
                        var i = -1;
                        var length = result.length;
                        if (!array) {
                            array = Array(length);
                        }
                        for (; ++i < length;) {
                            array[i] = result[i];
                        }
                        return array;
                    }
                    /**
                     * @param {!Array} object
                     * @param {!Function} f
                     * @return {?}
                     */
                    function forEach(object, f) {
                        /** @type {number} */
                        var i = -1;
                        var length = object.length;
                        for (; ++i < length && f(object[i], i, object) !== false;) {
                        }
                        return object;
                    }
                    /**
                     * @param {!Object} arr
                     * @param {?} fn
                     * @return {?}
                     */
                    function invoke(arr, fn) {
                        var i = arr.length;
                        for (; i-- && fn(arr[i], i, arr) !== false;) {
                        }
                        return arr;
                    }
                    /**
                     * @param {!Array} n
                     * @param {!Function} h
                     * @return {?}
                     */
                    function y(n, h) {
                        /** @type {number} */
                        var i = -1;
                        var length = n.length;
                        for (; ++i < length;) {
                            if (!h(n[i], i, n)) {
                                return false;
                            }
                        }
                        return true;
                    }
                    /**
                     * @param {!Array} options
                     * @param {string} value
                     * @param {!Function} n
                     * @param {!Object} from
                     * @return {?}
                     */
                    function render(options, value, n, from) {
                        /** @type {number} */
                        var i = -1;
                        var length = options.length;
                        /** @type {!Object} */
                        var dir = from;
                        var str = dir;
                        for (; ++i < length;) {
                            var item = options[i];
                            /** @type {number} */
                            var left = +value(item);
                            if (n(left, dir)) {
                                /** @type {number} */
                                dir = left;
                                str = item;
                            }
                        }
                        return str;
                    }
                    /**
                     * @param {!Array} t
                     * @param {string} f
                     * @return {?}
                     */
                    function a(t, f) {
                        /** @type {number} */
                        var i = -1;
                        var diff = t.length;
                        /** @type {number} */
                        var callbackCount = -1;
                        /** @type {!Array} */
                        var g = [];
                        for (; ++i < diff;) {
                            var value = t[i];
                            if (f(value, i, t)) {
                                g[++callbackCount] = value;
                            }
                        }
                        return g;
                    }
                    /**
                     * @param {!Array} data
                     * @param {!Function} value
                     * @return {?}
                     */
                    function normalize(data, value) {
                        /** @type {number} */
                        var i = -1;
                        var length = data.length;
                        var values = Array(length);
                        for (; ++i < length;) {
                            values[i] = value(data[i], i, data);
                        }
                        return values;
                    }
                    /**
                     * @param {!Object} r
                     * @param {?} a
                     * @return {?}
                     */
                    function fn(r, a) {
                        /** @type {number} */
                        var k = -1;
                        var kl = a.length;
                        var j = r.length;
                        for (; ++k < kl;) {
                            r[j + k] = a[k];
                        }
                        return r;
                    }
                    /**
                     * @param {!Array} path
                     * @param {!Object} fn
                     * @param {?} value
                     * @param {boolean} n
                     * @return {?}
                     */
                    function update(path, fn, value, n) {
                        /** @type {number} */
                        var i = -1;
                        var l = path.length;
                        if (n && l) {
                            value = path[++i];
                        }
                        for (; ++i < l;) {
                            value = fn(value, path[i], i, path);
                        }
                        return value;
                    }
                    /**
                     * @param {!Object} value
                     * @param {?} cb
                     * @param {?} res
                     * @param {(HTMLDocument|boolean)} i
                     * @return {?}
                     */
                    function read(value, cb, res, i) {
                        var j = value.length;
                        if (i && j) {
                            res = value[--j];
                        }
                        for (; j--;) {
                            res = cb(res, value[j], j, value);
                        }
                        return res;
                    }
                    /**
                     * @param {!Array} array
                     * @param {!Function} func
                     * @return {?}
                     */
                    function add(array, func) {
                        /** @type {number} */
                        var i = -1;
                        var length = array.length;
                        for (; ++i < length;) {
                            if (func(array[i], i, array)) {
                                return true;
                            }
                        }
                        return false;
                    }
                    /**
                     * @param {!Object} args
                     * @param {string} kind
                     * @return {?}
                     */
                    function push(args, kind) {
                        var i = args.length;
                        /** @type {number} */
                        var logData = 0;
                        for (; i--;) {
                            /** @type {number} */
                            logData = logData + (+kind(args[i]) || 0);
                        }
                        return logData;
                    }
                    /**
                     * @param {?} name
                     * @param {string} object
                     * @return {?}
                     */
                    function config(name, object) {
                        return name === undefined ? object : name;
                    }
                    /**
                     * @param {boolean} context
                     * @param {boolean} results
                     * @param {?} key
                     * @param {?} val
                     * @return {?}
                     */
                    function setOptions(context, results, key, val) {
                        return context !== undefined && self.call(val, key) ? context : results;
                    }
                    /**
                     * @param {string} object
                     * @param {?} context
                     * @param {!Function} callback
                     * @return {?}
                     */
                    function assign(object, context, callback) {
                        /** @type {number} */
                        var i = -1;
                        var props = keys(context);
                        var length = props.length;
                        for (; ++i < length;) {
                            var key = props[i];
                            var other = object[key];
                            var value = callback(other, context[key], key, object, context);
                            if (!((value === value ? value === other : other !== other) && (other !== undefined || key in object))) {
                                object[key] = value;
                            }
                        }
                        return object;
                    }
                    /**
                     * @param {string} result
                     * @param {?} object
                     * @return {?}
                     */
                    function baseAssign(result, object) {
                        return null == object ? result : copyObject(object, keys(object), result);
                    }
                    /**
                     * @param {?} collection
                     * @param {!Array} props
                     * @return {?}
                     */
                    function baseAt(collection, props) {
                        /** @type {number} */
                        var index = -1;
                        /** @type {boolean} */
                        var isNil = null == collection;
                        var isArr = !isNil && isArrayLike(collection);
                        var length = isArr ? collection.length : 0;
                        var propsLength = props.length;
                        var result = Array(propsLength);
                        for (; ++index < propsLength;) {
                            var key = props[index];
                            if (isArr) {
                                result[index] = isIndex(key, length) ? collection[key] : undefined;
                            } else {
                                result[index] = isNil ? undefined : collection[key];
                            }
                        }
                        return result;
                    }
                    /**
                     * @param {?} obj
                     * @param {!NodeList} params
                     * @param {!Object} target
                     * @return {?}
                     */
                    function copyObject(obj, params, target) {
                        if (!target) {
                            target = {};
                        }
                        /** @type {number} */
                        var j = -1;
                        var i = params.length;
                        for (; ++j < i;) {
                            var name = params[j];
                            target[name] = obj[name];
                        }
                        return target;
                    }
                    /**
                     * @param {string} value
                     * @param {?} key
                     * @param {!Array} body
                     * @return {?}
                     */
                    function success(value, key, body) {
                        /** @type {string} */
                        var s = typeof value;
                        return "function" == s ? key === undefined ? value : p(value, key, body) : null == value ? identity : "object" == s ? equal(value) : key === undefined ? bind(value) : put(value, key);
                    }
                    /**
                     * @param {?} value
                     * @param {boolean} isDeep
                     * @param {?} customizer
                     * @param {?} key
                     * @param {boolean} object
                     * @param {!Array} stackA
                     * @param {!Array} stackB
                     * @return {?}
                     */
                    function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
                        var result;
                        if (customizer && (result = object ? customizer(value, key, object) : customizer(value)), result !== undefined) {
                            return result;
                        }
                        if (!isObject(value)) {
                            return value;
                        }
                        var isArr = isArray(value);
                        if (isArr) {
                            if (result = initCloneArray(value), !isDeep) {
                                return copyArray(value, result);
                            }
                        } else {
                            var tag = toString.call(value);
                            /** @type {boolean} */
                            var isFunc = tag == funcTag;
                            if (tag != type && tag != hr && (!isFunc || object)) {
                                return cloneableTags[tag] ? initCloneByTag(value, tag, isDeep) : object ? value : {};
                            }
                            if (result = initCloneObject(isFunc ? {} : value), !isDeep) {
                                return baseAssign(result, value);
                            }
                        }
                        if (!stackA) {
                            /** @type {!Array} */
                            stackA = [];
                        }
                        if (!stackB) {
                            /** @type {!Array} */
                            stackB = [];
                        }
                        var length = stackA.length;
                        for (; length--;) {
                            if (stackA[length] == value) {
                                return stackB[length];
                            }
                        }
                        return stackA.push(value), stackB.push(result), (isArr ? forEach : baseForOwn)(value, function(objValue, key) {
                            result[key] = baseClone(objValue, isDeep, customizer, key, value, stackA, stackB);
                        }), result;
                    }
                    /**
                     * @param {!Function} t
                     * @param {number} e
                     * @param {?} n
                     * @return {?}
                     */
                    function r(t, e, n) {
                        if ("function" != typeof t) {
                            throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                        }
                        return setTimeout(function() {
                            t.apply(undefined, n);
                        }, e);
                    }
                    /**
                     * @param {number} obj
                     * @param {!Object} value
                     * @return {?}
                     */
                    function flatten(obj, value) {
                        var l = obj ? obj.length : 0;
                        /** @type {!Array} */
                        var r = [];
                        if (!l) {
                            return r;
                        }
                        /** @type {number} */
                        var i = -1;
                        var indexOf = unshift();
                        /** @type {boolean} */
                        var isCommon = indexOf == find;
                        var valueRed = isCommon && value.length >= LARGE_ARRAY_SIZE ? createCache(value) : null;
                        var jlen = value.length;
                        if (valueRed) {
                            /** @type {function(!Object, undefined): ?} */
                            indexOf = cacheIndexOf;
                            /** @type {boolean} */
                            isCommon = false;
                            value = valueRed;
                        }
                        t: for (; ++i < l;) {
                            var name = obj[i];
                            if (isCommon && name === name) {
                                var j = jlen;
                                for (; j--;) {
                                    if (value[j] === name) {
                                        continue t;
                                    }
                                }
                                r.push(name);
                            } else {
                                if (indexOf(value, name, 0) < 0) {
                                    r.push(name);
                                }
                            }
                        }
                        return r;
                    }
                    /**
                     * @param {!Array} value
                     * @param {!Function} e
                     * @return {?}
                     */
                    function c(value, e) {
                        /** @type {boolean} */
                        var result = true;
                        return done(value, function(context, n, sectE) {
                            return result = !!e(context, n, sectE);
                        }), result;
                    }
                    /**
                     * @param {!Array} context
                     * @param {string} callback
                     * @param {!Function} next
                     * @param {number} type
                     * @return {?}
                     */
                    function print(context, callback, next, type) {
                        /** @type {number} */
                        var name = type;
                        var value = name;
                        return done(context, function(tags, webhookMsg, privateContent) {
                            /** @type {number} */
                            var id = +callback(tags, webhookMsg, privateContent);
                            if (next(id, name) || id === type && id === value) {
                                name = id;
                                /** @type {number} */
                                value = tags;
                            }
                        }), value;
                    }
                    /**
                     * @param {number} value
                     * @param {?} tag
                     * @param {number} start
                     * @param {number} end
                     * @return {?}
                     */
                    function format(value, tag, start, end) {
                        var length = value.length;
                        /** @type {number} */
                        start = null == start ? 0 : +start || 0;
                        if (start < 0) {
                            start = -start > length ? 0 : length + start;
                        }
                        end = end === undefined || end > length ? length : +end || 0;
                        if (end < 0) {
                            end = end + length;
                        }
                        /** @type {number} */
                        length = start > end ? 0 : end >>> 0;
                        /** @type {number} */
                        start = start >>> 0;
                        for (; start < length;) {
                            value[start++] = tag;
                        }
                        return value;
                    }
                    /**
                     * @param {!Array} object
                     * @param {string} cb
                     * @return {?}
                     */
                    function table(object, cb) {
                        /** @type {!Array} */
                        var result = [];
                        return done(object, function(t, formattedSections, subnext) {
                            if (cb(t, formattedSections, subnext)) {
                                result.push(t);
                            }
                        }), result;
                    }
                    /**
                     * @param {!Array} x
                     * @param {string} callback
                     * @param {!Function} done
                     * @param {boolean} n
                     * @return {?}
                     */
                    function f(x, callback, done, n) {
                        var a;
                        return done(x, function(e, undefined, gmInstance) {
                            if (callback(e, undefined, gmInstance)) {
                                return a = n ? undefined : e, false;
                            }
                        }), a;
                    }
                    /**
                     * @param {number} obj
                     * @param {boolean} depth
                     * @param {string} isStrict
                     * @param {!Object} result
                     * @return {?}
                     */
                    function baseFlatten(obj, depth, isStrict, result) {
                        if (!result) {
                            /** @type {!Array} */
                            result = [];
                        }
                        /** @type {number} */
                        var i = -1;
                        var length = obj.length;
                        for (; ++i < length;) {
                            var value = obj[i];
                            if (isObjectLike(value) && isArrayLike(value) && (isStrict || isArray(value) || isArguments(value))) {
                                if (depth) {
                                    baseFlatten(value, depth, isStrict, result);
                                } else {
                                    fn(result, value);
                                }
                            } else {
                                if (!isStrict) {
                                    result[result.length] = value;
                                }
                            }
                        }
                        return result;
                    }
                    /**
                     * @param {?} source
                     * @param {!Function} sender
                     * @return {?}
                     */
                    function call(source, sender) {
                        return baseFor(source, sender, keysIn);
                    }
                    /**
                     * @param {!Array} object
                     * @param {!Function} iteratee
                     * @return {?}
                     */
                    function baseForOwn(object, iteratee) {
                        return baseFor(object, iteratee, keys);
                    }
                    /**
                     * @param {?} e
                     * @param {?} n
                     * @return {?}
                     */
                    function i(e, n) {
                        return l(e, n, keys);
                    }
                    /**
                     * @param {!Object} arr
                     * @param {!NodeList} items
                     * @return {?}
                     */
                    function pick(arr, items) {
                        /** @type {number} */
                        var i = -1;
                        var length = items.length;
                        /** @type {number} */
                        var j = -1;
                        /** @type {!Array} */
                        var out = [];
                        for (; ++i < length;) {
                            var name = items[i];
                            if (isFunction(arr[name])) {
                                out[++j] = name;
                            }
                        }
                        return out;
                    }
                    /**
                     * @param {!Object} object
                     * @param {string} path
                     * @param {string} key
                     * @return {?}
                     */
                    function callback(object, path, key) {
                        if (null != object) {
                            if (key !== undefined && key in toObject(object)) {
                                /** @type {!Array} */
                                path = [key];
                            }
                            /** @type {number} */
                            var index = 0;
                            var length = path.length;
                            for (; null != object && index < length;) {
                                object = object[path[index++]];
                            }
                            return index && index == length ? object : undefined;
                        }
                    }
                    /**
                     * @param {!Object} value
                     * @param {?} other
                     * @param {string} customizer
                     * @param {boolean} isLoose
                     * @param {!Array} stackA
                     * @param {!Array} stackB
                     * @return {?}
                     */
                    function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
                        return value === other || (null == value || null == other || !isObject(value) && !isObjectLike(other) ? value !== value && other !== other : baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB));
                    }
                    /**
                     * @param {?} object
                     * @param {?} other
                     * @param {!Function} equalFunc
                     * @param {!Object} customizer
                     * @param {boolean} isLoose
                     * @param {!Array} stackA
                     * @param {!Array} stackB
                     * @return {?}
                     */
                    function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
                        var objIsArr = isArray(object);
                        var othIsArr = isArray(other);
                        /** @type {string} */
                        var name = tag;
                        /** @type {string} */
                        var key = tag;
                        if (!objIsArr) {
                            name = toString.call(object);
                            if (name == hr) {
                                /** @type {string} */
                                name = type;
                            } else {
                                if (name != type) {
                                    objIsArr = isString(object);
                                }
                            }
                        }
                        if (!othIsArr) {
                            key = toString.call(other);
                            if (key == hr) {
                                /** @type {string} */
                                key = type;
                            } else {
                                if (key != type) {
                                    othIsArr = isString(other);
                                }
                            }
                        }
                        /** @type {boolean} */
                        var objIsObj = name == type;
                        /** @type {boolean} */
                        var othIsObj = key == type;
                        /** @type {boolean} */
                        var isDisabled = name == key;
                        if (isDisabled && !objIsArr && !objIsObj) {
                            return equalByTag(object, other, name);
                        }
                        if (!isLoose) {
                            var objIsWrapped = objIsObj && self.call(object, "__wrapped__");
                            var othIsWrapped = othIsObj && self.call(other, "__wrapped__");
                            if (objIsWrapped || othIsWrapped) {
                                return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
                            }
                        }
                        if (!isDisabled) {
                            return false;
                        }
                        if (!stackA) {
                            /** @type {!Array} */
                            stackA = [];
                        }
                        if (!stackB) {
                            /** @type {!Array} */
                            stackB = [];
                        }
                        var length = stackA.length;
                        for (; length--;) {
                            if (stackA[length] == object) {
                                return stackB[length] == other;
                            }
                        }
                        stackA.push(object);
                        stackB.push(other);
                        var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);
                        return stackA.pop(), stackB.pop(), result;
                    }
                    /**
                     * @param {?} options
                     * @param {!Object} settings
                     * @param {!Function} map
                     * @return {?}
                     */
                    function transform(options, settings, map) {
                        var count = settings.length;
                        var size = count;
                        /** @type {boolean} */
                        var recurse = !map;
                        if (null == options) {
                            return !size;
                        }
                        options = toObject(options);
                        for (; count--;) {
                            var item = settings[count];
                            if (recurse && item[2] ? item[1] !== options[item[0]] : !(item[0] in options)) {
                                return false;
                            }
                        }
                        for (; ++count < size;) {
                            item = settings[count];
                            var i = item[0];
                            var key = options[i];
                            var value = item[1];
                            if (recurse && item[2]) {
                                if (key === undefined && !(i in options)) {
                                    return false;
                                }
                            } else {
                                var result = map ? map(key, value, i) : undefined;
                                if (!(result === undefined ? baseIsEqual(value, key, map, true) : result)) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    }
                    /**
                     * @param {?} obj
                     * @param {!Function} s
                     * @return {?}
                     */
                    function v(obj, s) {
                        /** @type {number} */
                        var index = -1;
                        var values = isArrayLike(obj) ? Array(obj.length) : [];
                        return done(obj, function(t, data, widAttr) {
                            values[++index] = s(t, data, widAttr);
                        }), values;
                    }
                    /**
                     * @param {!Object} value
                     * @return {?}
                     */
                    function equal(value) {
                        var path = createPath(value);
                        if (1 == path.length && path[0][2]) {
                            var key = path[0][0];
                            var srcValue = path[0][1];
                            return function(object) {
                                return null != object && (object[key] === srcValue && (srcValue !== undefined || key in toObject(object)));
                            };
                        }
                        return function(newItem) {
                            return transform(newItem, path);
                        };
                    }
                    /**
                     * @param {!Object} name
                     * @param {!Object} value
                     * @return {?}
                     */
                    function put(name, value) {
                        var isNameArray = isArray(name);
                        var rewrite = next(name) && copy(value);
                        /** @type {string} */
                        var authSuccessUrl = name + "";
                        return name = join(name), function(object) {
                            if (null == object) {
                                return false;
                            }
                            /** @type {string} */
                            var key = authSuccessUrl;
                            if (object = toObject(object), (isNameArray || !rewrite) && !(key in object)) {
                                if (object = 1 == name.length ? object : callback(object, $(name, 0, -1)), null == object) {
                                    return false;
                                }
                                key = replace(name);
                                object = toObject(object);
                            }
                            return object[key] === value ? value !== undefined || key in object : baseIsEqual(value, object[key], undefined, true);
                        };
                    }
                    /**
                     * @param {!Object} result
                     * @param {!Array} value
                     * @param {!Function} callback
                     * @param {!Array} count
                     * @param {!Object} url
                     * @return {?}
                     */
                    function reset(result, value, callback, count, url) {
                        if (!isObject(result)) {
                            return result;
                        }
                        var isSrcArr = isArrayLike(value) && (isArray(value) || isString(value));
                        var props = isSrcArr ? undefined : keys(value);
                        return forEach(props || value, function(p, i) {
                            if (props && (i = p, p = value[i]), isObjectLike(p)) {
                                if (!count) {
                                    /** @type {!Array} */
                                    count = [];
                                }
                                if (!url) {
                                    /** @type {!Array} */
                                    url = [];
                                }
                                debug(result, value, i, reset, callback, count, url);
                            } else {
                                var a = result[i];
                                var b = callback ? callback(a, p, i, result, value) : undefined;
                                /** @type {boolean} */
                                var first = b === undefined;
                                if (first) {
                                    b = p;
                                }
                                if (!(b === undefined && (!isSrcArr || i in result) || !first && (b === b ? b === a : a !== a))) {
                                    result[i] = b;
                                }
                            }
                        }), result;
                    }
                    /**
                     * @param {!Object} object
                     * @param {!Object} items
                     * @param {string} key
                     * @param {!Function} fn
                     * @param {!Function} callback
                     * @param {!Array} x
                     * @param {!Object} a
                     * @return {?}
                     */
                    function debug(object, items, key, fn, callback, x, a) {
                        var i = x.length;
                        var obj = items[key];
                        for (; i--;) {
                            if (x[i] == obj) {
                                return void(object[key] = a[i]);
                            }
                        }
                        var value = object[key];
                        var result = callback ? callback(value, obj, key, object, items) : undefined;
                        /** @type {boolean} */
                        var isCommon = result === undefined;
                        if (isCommon) {
                            result = obj;
                            if (isArrayLike(obj) && (isArray(obj) || isString(obj))) {
                                result = isArray(value) ? value : isArrayLike(value) ? copyArray(value) : [];
                            } else {
                                if (isPlainObject(obj) || isArguments(obj)) {
                                    result = isArguments(value) ? toPlainObject(value) : isPlainObject(value) ? value : {};
                                } else {
                                    /** @type {boolean} */
                                    isCommon = false;
                                }
                            }
                        }
                        x.push(obj);
                        a.push(result);
                        if (isCommon) {
                            object[key] = fn(result, obj, callback, x, a);
                        } else {
                            if (result === result ? result !== value : value === value) {
                                object[key] = result;
                            }
                        }
                    }
                    /**
                     * @param {string} name
                     * @return {?}
                     */
                    function write(name) {
                        return function(all) {
                            return null == all ? undefined : all[name];
                        };
                    }
                    /**
                     * @param {string} path
                     * @return {?}
                     */
                    function traverse(path) {
                        /** @type {string} */
                        var key = path + "";
                        return path = join(path), function(n) {
                            return callback(n, path, key);
                        };
                    }
                    /**
                     * @param {number} arr
                     * @param {!Object} value
                     * @return {?}
                     */
                    function getPath(arr, value) {
                        var name = arr ? value.length : 0;
                        for (; name--;) {
                            var index = value[name];
                            if (index != previous && isIndex(index)) {
                                var previous = index;
                                splice.call(arr, index, 1);
                            }
                        }
                        return arr;
                    }
                    /**
                     * @param {number} min
                     * @param {number} max
                     * @return {?}
                     */
                    function baseRandom(min, max) {
                        return min + floor(nativeRandom() * (max - min + 1));
                    }
                    /**
                     * @param {!Array} data
                     * @param {?} callback
                     * @param {?} request
                     * @param {boolean} module
                     * @param {?} error
                     * @return {?}
                     */
                    function error(data, callback, request, module, error) {
                        return error(data, function(dirname, gmInstance, missingCoins) {
                            request = module ? (module = false, dirname) : callback(request, dirname, gmInstance, missingCoins);
                        }), request;
                    }
                    /**
                     * @param {!Object} arr
                     * @param {number} start
                     * @param {number} end
                     * @return {?}
                     */
                    function $(arr, start, end) {
                        /** @type {number} */
                        var i = -1;
                        var length = arr.length;
                        /** @type {number} */
                        start = null == start ? 0 : +start || 0;
                        if (start < 0) {
                            start = -start > length ? 0 : length + start;
                        }
                        end = end === undefined || end > length ? length : +end || 0;
                        if (end < 0) {
                            end = end + length;
                        }
                        /** @type {number} */
                        length = start > end ? 0 : end - start >>> 0;
                        /** @type {number} */
                        start = start >>> 0;
                        var ret = Array(length);
                        for (; ++i < length;) {
                            ret[i] = arr[i + start];
                        }
                        return ret;
                    }
                    /**
                     * @param {!Array} input
                     * @param {!Function} e
                     * @return {?}
                     */
                    function del(input, e) {
                        var o;
                        return done(input, function(key, a, m) {
                            return o = e(key, a, m), !o;
                        }), !!o;
                    }
                    /**
                     * @param {!Object} input
                     * @param {!Function} prop
                     * @return {?}
                     */
                    function sort(input, prop) {
                        var n = input.length;
                        input.sort(prop);
                        for (; n--;) {
                            input[n] = input[n].value;
                        }
                        return input;
                    }
                    /**
                     * @param {?} b
                     * @param {!Array} options
                     * @param {!Object} x
                     * @return {?}
                     */
                    function assert(b, options, x) {
                        var readFileSync = apply();
                        /** @type {number} */
                        var index = -1;
                        options = normalize(options, function(profilesFile) {
                            return readFileSync(profilesFile);
                        });
                        var o = v(b, function(val) {
                            var base = normalize(options, function(obtainGETData) {
                                return obtainGETData(val);
                            });
                            return {
                                criteria : base,
                                index : ++index,
                                value : val
                            };
                        });
                        return sort(o, function(props, ts) {
                            return select(props, ts, x);
                        });
                    }
                    /**
                     * @param {?} value
                     * @param {string} cb
                     * @return {?}
                     */
                    function emit(value, cb) {
                        /** @type {number} */
                        var result = 0;
                        return done(value, function(errReadDir, appRet, loginResponse) {
                            result = result + (+cb(errReadDir, appRet, loginResponse) || 0);
                        }), result;
                    }
                    /**
                     * @param {number} data
                     * @param {boolean} callback
                     * @return {?}
                     */
                    function log(data, callback) {
                        /** @type {number} */
                        var index = -1;
                        var fn = unshift();
                        var length = data.length;
                        /** @type {boolean} */
                        var isCommon = fn == find;
                        /** @type {boolean} */
                        var isLarge = isCommon && length >= LARGE_ARRAY_SIZE;
                        var key = isLarge ? createCache() : null;
                        /** @type {!Array} */
                        var result = [];
                        if (key) {
                            /** @type {function(!Object, undefined): ?} */
                            fn = cacheIndexOf;
                            /** @type {boolean} */
                            isCommon = false;
                        } else {
                            /** @type {boolean} */
                            isLarge = false;
                            /** @type {!Array} */
                            key = callback ? [] : result;
                        }
                        t: for (; ++index < length;) {
                            var value = data[index];
                            var type = callback ? callback(value, index, data) : value;
                            if (isCommon && value === value) {
                                var j = key.length;
                                for (; j--;) {
                                    if (key[j] === type) {
                                        continue t;
                                    }
                                }
                                if (callback) {
                                    key.push(type);
                                }
                                result.push(value);
                            } else {
                                if (fn(key, type, 0) < 0) {
                                    if (callback || isLarge) {
                                        key.push(type);
                                    }
                                    result.push(value);
                                }
                            }
                        }
                        return result;
                    }
                    /**
                     * @param {?} index
                     * @param {!NodeList} object
                     * @return {?}
                     */
                    function baseValues(index, object) {
                        /** @type {number} */
                        var j = -1;
                        var n = object.length;
                        var result = Array(n);
                        for (; ++j < n;) {
                            result[j] = index[object[j]];
                        }
                        return result;
                    }
                    /**
                     * @param {!Array} obj
                     * @param {?} predicate
                     * @param {boolean} event
                     * @param {string} fromRight
                     * @return {?}
                     */
                    function get(obj, predicate, event, fromRight) {
                        var length = obj.length;
                        var index = fromRight ? length : -1;
                        for (; (fromRight ? index-- : ++index < length) && predicate(obj[index], index, obj);) {
                        }
                        return event ? $(obj, fromRight ? 0 : index, fromRight ? index + 1 : length) : $(obj, fromRight ? index + 1 : 0, fromRight ? length : index);
                    }
                    /**
                     * @param {string} c
                     * @param {!NodeList} t
                     * @return {?}
                     */
                    function func(c, t) {
                        /** @type {string} */
                        var a = c;
                        if (a instanceof LazyWrapper) {
                            a = a.value();
                        }
                        /** @type {number} */
                        var j = -1;
                        var tl = t.length;
                        for (; ++j < tl;) {
                            var node = t[j];
                            a = node.func.apply(node.thisArg, fn([a], node.args));
                        }
                        return a;
                    }
                    /**
                     * @param {!Array} array
                     * @param {?} value
                     * @param {boolean} retHighest
                     * @return {?}
                     */
                    function binaryIndex(array, value, retHighest) {
                        /** @type {number} */
                        var low = 0;
                        var high = array ? array.length : low;
                        if ("number" == typeof value && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
                            for (; low < high;) {
                                /** @type {number} */
                                var mid = low + high >>> 1;
                                var computed = array[mid];
                                if ((retHighest ? computed <= value : computed < value) && null !== computed) {
                                    /** @type {number} */
                                    low = mid + 1;
                                } else {
                                    /** @type {number} */
                                    high = mid;
                                }
                            }
                            return high;
                        }
                        return binaryIndexBy(array, value, identity, retHighest);
                    }
                    /**
                     * @param {!Object} array
                     * @param {!Object} value
                     * @param {!Function} iteratee
                     * @param {boolean} retHighest
                     * @return {?}
                     */
                    function binaryIndexBy(array, value, iteratee, retHighest) {
                        value = iteratee(value);
                        /** @type {number} */
                        var low = 0;
                        var high = array ? array.length : 0;
                        /** @type {boolean} */
                        var valIsNaN = value !== value;
                        /** @type {boolean} */
                        var isTranslucent = null === value;
                        /** @type {boolean} */
                        var valIsUndefined = value === undefined;
                        for (; low < high;) {
                            var mid = floor((low + high) / 2);
                            var computed = iteratee(array[mid]);
                            /** @type {boolean} */
                            var isDef = computed !== undefined;
                            /** @type {boolean} */
                            var isReflexive = computed === computed;
                            if (valIsNaN) {
                                var setLow = isReflexive || retHighest;
                            } else {
                                setLow = isTranslucent ? isReflexive && isDef && (retHighest || null != computed) : valIsUndefined ? isReflexive && (retHighest || isDef) : null != computed && (retHighest ? computed <= value : computed < value);
                            }
                            if (setLow) {
                                low = mid + 1;
                            } else {
                                high = mid;
                            }
                        }
                        return nativeMin(high, funcsLength);
                    }
                    /**
                     * @param {!Function} r
                     * @param {?} b
                     * @param {number} s
                     * @return {?}
                     */
                    function p(r, b, s) {
                        if ("function" != typeof r) {
                            return identity;
                        }
                        if (b === undefined) {
                            return r;
                        }
                        switch(s) {
                            case 1:
                                return function(n) {
                                    return r.call(b, n);
                                };
                            case 3:
                                return function(n, renderer, right) {
                                    return r.call(b, n, renderer, right);
                                };
                            case 4:
                                return function(n, renderer, right, context) {
                                    return r.call(b, n, renderer, right, context);
                                };
                            case 5:
                                return function(n, renderer, right, context, name) {
                                    return r.call(b, n, renderer, right, context, name);
                                };
                        }
                        return function() {
                            return r.apply(b, arguments);
                        };
                    }
                    /**
                     * @param {!Object} buffer
                     * @return {?}
                     */
                    function bufferClone(buffer) {
                        var buf = new ArrayBuffer(buffer.byteLength);
                        var tmp = new Uint8Array(buf);
                        return tmp.set(new Uint8Array(buffer)), buf;
                    }
                    /**
                     * @param {!Array} array
                     * @param {!NodeList} object
                     * @param {!NodeList} properties
                     * @return {?}
                     */
                    function extend(array, object, properties) {
                        var n = properties.length;
                        /** @type {number} */
                        var i = -1;
                        var offset = nativeMax(array.length - n, 0);
                        /** @type {number} */
                        var k = -1;
                        var len = object.length;
                        var result = Array(len + offset);
                        for (; ++k < len;) {
                            result[k] = object[k];
                        }
                        for (; ++i < n;) {
                            result[properties[i]] = array[i];
                        }
                        for (; offset--;) {
                            result[k++] = array[i++];
                        }
                        return result;
                    }
                    /**
                     * @param {!Array} value
                     * @param {!NodeList} params
                     * @param {!NodeList} args
                     * @return {?}
                     */
                    function stringify(value, params, args) {
                        /** @type {number} */
                        var index = -1;
                        var length = args.length;
                        /** @type {number} */
                        var key = -1;
                        var leftLength = nativeMax(value.length - length, 0);
                        /** @type {number} */
                        var i = -1;
                        var argsLength = params.length;
                        var result = Array(leftLength + argsLength);
                        for (; ++key < leftLength;) {
                            result[key] = value[key];
                        }
                        /** @type {number} */
                        var path = key;
                        for (; ++i < argsLength;) {
                            result[path + i] = params[i];
                        }
                        for (; ++index < length;) {
                            result[path + args[index]] = value[key++];
                        }
                        return result;
                    }
                    /**
                     * @param {!Function} callback
                     * @param {!Function} filter
                     * @return {?}
                     */
                    function clone(callback, filter) {
                        return function(result, cb, callback) {
                            var reg = filter ? filter() : {};
                            if (cb = apply(cb, callback, 3), isArray(result)) {
                                /** @type {number} */
                                var j = -1;
                                var y = result.length;
                                for (; ++j < y;) {
                                    var body = result[j];
                                    callback(reg, body, cb(body, j, result), result);
                                }
                            } else {
                                done(result, function(body, result, indexSoFar) {
                                    callback(reg, body, cb(body, result, indexSoFar), indexSoFar);
                                });
                            }
                            return reg;
                        };
                    }
                    /**
                     * @param {!Function} func
                     * @return {?}
                     */
                    function load(func) {
                        return require(function(o, values) {
                            /** @type {number} */
                            var j = -1;
                            var i = null == o ? 0 : values.length;
                            var d = i > 2 ? values[i - 2] : undefined;
                            var val = i > 2 ? values[2] : undefined;
                            var a = i > 1 ? values[i - 1] : undefined;
                            if ("function" == typeof d) {
                                d = p(d, a, 5);
                                /** @type {number} */
                                i = i - 2;
                            } else {
                                d = "function" == typeof a ? a : undefined;
                                /** @type {number} */
                                i = i - (d ? 1 : 0);
                            }
                            if (val && test(values[0], values[1], val)) {
                                d = i < 3 ? undefined : d;
                                /** @type {number} */
                                i = 1;
                            }
                            for (; ++j < i;) {
                                var template = values[j];
                                if (template) {
                                    func(o, template, d);
                                }
                            }
                            return o;
                        });
                    }
                    /**
                     * @param {!Function} eachFunc
                     * @param {boolean} fromRight
                     * @return {?}
                     */
                    function createBaseEach(eachFunc, fromRight) {
                        return function(collection, iteratee) {
                            var length = collection ? getLength(collection) : 0;
                            if (!isLength(length)) {
                                return eachFunc(collection, iteratee);
                            }
                            var index = fromRight ? length : -1;
                            var iterable = toObject(collection);
                            for (; (fromRight ? index-- : ++index < length) && iteratee(iterable[index], index, iterable) !== false;) {
                            }
                            return collection;
                        };
                    }
                    /**
                     * @param {string} fromRight
                     * @return {?}
                     */
                    function createBaseFor(fromRight) {
                        return function(object, iteratee, keysFunc) {
                            var iterable = toObject(object);
                            var keys = keysFunc(object);
                            var length = keys.length;
                            var index = fromRight ? length : -1;
                            for (; fromRight ? index-- : ++index < length;) {
                                var key = keys[index];
                                if (iteratee(iterable[key], key, iterable) === false) {
                                    break;
                                }
                            }
                            return object;
                        };
                    }
                    /**
                     * @param {!Function} func
                     * @param {?} context
                     * @return {?}
                     */
                    function forIn(func, context) {
                        /**
                         * @return {?}
                         */
                        function arr() {
                            var fn = this && this !== root && this instanceof arr ? Ctor : func;
                            return fn.apply(context, arguments);
                        }
                        var Ctor = createCtorWrapper(func);
                        return arr;
                    }
                    /**
                     * @param {!Object} values
                     * @return {?}
                     */
                    function createCache(values) {
                        return nativeCreate && Set ? new SetCache(values) : null;
                    }
                    /**
                     * @param {!Function} cb
                     * @return {?}
                     */
                    function req(cb) {
                        return function(a) {
                            /** @type {number} */
                            var n = -1;
                            var obj = result(reject(a));
                            var max = obj.length;
                            /** @type {string} */
                            var ret = "";
                            for (; ++n < max;) {
                                ret = cb(ret, obj[n], n);
                            }
                            return ret;
                        };
                    }
                    /**
                     * @param {!Function} Ctor
                     * @return {?}
                     */
                    function createCtorWrapper(Ctor) {
                        return function() {
                            /** @type {!Arguments} */
                            var args = arguments;
                            switch(args.length) {
                                case 0:
                                    return new Ctor;
                                case 1:
                                    return new Ctor(args[0]);
                                case 2:
                                    return new Ctor(args[0], args[1]);
                                case 3:
                                    return new Ctor(args[0], args[1], args[2]);
                                case 4:
                                    return new Ctor(args[0], args[1], args[2], args[3]);
                                case 5:
                                    return new Ctor(args[0], args[1], args[2], args[3], args[4]);
                                case 6:
                                    return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
                                case 7:
                                    return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
                            }
                            var thisBinding = baseCreate(Ctor.prototype);
                            var result = Ctor.apply(thisBinding, args);
                            return isObject(result) ? result : thisBinding;
                        };
                    }
                    /**
                     * @param {number} items
                     * @return {?}
                     */
                    function walk(items) {
                        /**
                         * @param {undefined} key
                         * @param {undefined} name
                         * @param {!Object} object
                         * @return {?}
                         */
                        function data(key, name, object) {
                            if (object && test(key, name, object)) {
                                name = undefined;
                            }
                            var result = set(key, items, undefined, undefined, undefined, undefined, undefined, name);
                            return result.placeholder = data.placeholder, result;
                        }
                        return data;
                    }
                    /**
                     * @param {!Function} handler
                     * @param {string} type
                     * @return {?}
                     */
                    function createElement(handler, type) {
                        return require(function(a) {
                            var n = a[0];
                            return null == n ? n : (a.push(type), handler.apply(undefined, a));
                        });
                    }
                    /**
                     * @param {!Function} x
                     * @param {undefined} s
                     * @return {?}
                     */
                    function cb(x, s) {
                        return function(a, key, val) {
                            if (val && test(a, key, val) && (key = undefined), key = apply(key, val, 3), 1 == key.length) {
                                a = isArray(a) ? a : slice(a);
                                var result = render(a, key, x, s);
                                if (!a.length || result !== s) {
                                    return result;
                                }
                            }
                            return print(a, key, x, s);
                        };
                    }
                    /**
                     * @param {!Function} host
                     * @param {string} items
                     * @return {?}
                     */
                    function parse(host, items) {
                        return function(result, value, schema) {
                            if (value = apply(value, schema, 3), isArray(result)) {
                                var index = indexOf(result, value, items);
                                return index > -1 ? result[index] : undefined;
                            }
                            return f(result, value, host);
                        };
                    }
                    /**
                     * @param {string} i
                     * @return {?}
                     */
                    function each(i) {
                        return function(pr, t, args) {
                            return pr && pr.length ? (t = apply(t, args, 3), indexOf(pr, t, i)) : -1;
                        };
                    }
                    /**
                     * @param {!Function} object
                     * @return {?}
                     */
                    function invert(object) {
                        return function(t, o, defaults) {
                            return o = apply(o, defaults, 3), f(t, o, object, true);
                        };
                    }
                    /**
                     * @param {string} fromRight
                     * @return {?}
                     */
                    function createFlow(fromRight) {
                        return function() {
                            var wrapper;
                            /** @type {number} */
                            var length = arguments.length;
                            /** @type {number} */
                            var index = fromRight ? length : -1;
                            /** @type {number} */
                            var leftIndex = 0;
                            var funcs = Array(length);
                            for (; fromRight ? index-- : ++index < length;) {
                                var request = funcs[leftIndex++] = arguments[index];
                                if ("function" != typeof request) {
                                    throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                                }
                                if (!wrapper && LodashWrapper.prototype.thru && "wrapper" == getFuncName(request)) {
                                    wrapper = new LodashWrapper([], true);
                                }
                            }
                            /** @type {number} */
                            index = wrapper ? -1 : length;
                            for (; ++index < length;) {
                                request = funcs[index];
                                var key = getFuncName(request);
                                var data = "wrapper" == key ? getData(request) : undefined;
                                wrapper = data && isLaziable(data[0]) && data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) && !data[4].length && 1 == data[9] ? wrapper[getFuncName(data[0])].apply(wrapper, data[3]) : 1 == request.length && isLaziable(request) ? wrapper[key]() : wrapper.thru(request);
                            }
                            return function() {
                                /** @type {!Arguments} */
                                var args = arguments;
                                var value = args[0];
                                if (wrapper && 1 == args.length && isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
                                    return wrapper.plant(value).value();
                                }
                                /** @type {number} */
                                var i = 0;
                                var width = length ? funcs[i].apply(this, args) : value;
                                for (; ++i < length;) {
                                    width = funcs[i].call(this, width);
                                }
                                return width;
                            };
                        };
                    }
                    /**
                     * @param {!Function} fn
                     * @param {?} callback
                     * @return {?}
                     */
                    function loop(fn, callback) {
                        return function(n, value, s) {
                            return "function" == typeof value && s === undefined && isArray(n) ? fn(n, value) : callback(n, p(value, s, 3));
                        };
                    }
                    /**
                     * @param {?} test
                     * @return {?}
                     */
                    function mixin(test) {
                        return function(resouceName, s, a) {
                            return "function" == typeof s && a === undefined || (s = p(s, a, 3)), test(resouceName, s, keysIn);
                        };
                    }
                    /**
                     * @param {!Function} callback
                     * @return {?}
                     */
                    function display(callback) {
                        return function(channelErr, a, b) {
                            return "function" == typeof a && b === undefined || (a = p(a, b, 3)), callback(channelErr, a);
                        };
                    }
                    /**
                     * @param {boolean} reverse
                     * @return {?}
                     */
                    function createObjectMapper(reverse) {
                        return function(object, fn, ctx) {
                            var indexMap = {};
                            return fn = apply(fn, ctx, 3), baseForOwn(object, function(pos, index, firstOnly) {
                                var result = fn(pos, index, firstOnly);
                                index = reverse ? result : index;
                                pos = reverse ? pos : result;
                                /** @type {string} */
                                indexMap[index] = pos;
                            }), indexMap;
                        };
                    }
                    /**
                     * @param {number} fromRight
                     * @return {?}
                     */
                    function clock(fromRight) {
                        return function(string, length, chars) {
                            return string = String(string), (fromRight ? string : "") + createPadding(string, length, chars) + (fromRight ? "" : string);
                        };
                    }
                    /**
                     * @param {number} duration
                     * @return {?}
                     */
                    function rest(duration) {
                        var args = require(function(n, data) {
                            var value = callback(data, args.placeholder);
                            return set(n, duration, undefined, data, value);
                        });
                        return args;
                    }
                    /**
                     * @param {!Function} callback
                     * @param {?} val
                     * @return {?}
                     */
                    function createContext(callback, val) {
                        return function(dependencies, source, color, schema) {
                            /** @type {boolean} */
                            var url = arguments.length < 3;
                            return "function" == typeof source && schema === undefined && isArray(dependencies) ? callback(dependencies, source, color, url) : error(dependencies, apply(source, schema, 4), color, url, val);
                        };
                    }
                    /**
                     * @param {!Object} func
                     * @param {number} bitmask
                     * @param {?} thisArg
                     * @param {(Node|NodeList|string)} callback
                     * @param {(Node|NodeList|string)} opts
                     * @param {(Node|NodeList|string)} name
                     * @param {(Node|NodeList|string)} options
                     * @param {(!Function|string)} argPos
                     * @param {number} ary
                     * @param {number} arity
                     * @return {?}
                     */
                    function createWrapper(func, bitmask, thisArg, callback, opts, name, options, argPos, ary, arity) {
                        /**
                         * @return {?}
                         */
                        function wrapper() {
                            /** @type {number} */
                            var length = arguments.length;
                            /** @type {number} */
                            var i = length;
                            var args = Array(length);
                            for (; i--;) {
                                args[i] = arguments[i];
                            }
                            if (callback && (args = extend(args, callback, opts)), name && (args = stringify(args, name, options)), isCurry || isPartial) {
                                var placeholder = wrapper.placeholder;
                                var argsHolders = callback(args, placeholder);
                                if (length = length - argsHolders.length, length < arity) {
                                    var newArgPos = argPos ? copyArray(argPos) : undefined;
                                    var newArity = nativeMax(arity - length, 0);
                                    var newsHolders = isCurry ? argsHolders : undefined;
                                    var newHoldersRight = isCurry ? undefined : argsHolders;
                                    var newPartials = isCurry ? args : undefined;
                                    var newPartialsRight = isCurry ? undefined : args;
                                    /** @type {number} */
                                    bitmask = bitmask | (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
                                    /** @type {number} */
                                    bitmask = bitmask & ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);
                                    if (!isCurryBound) {
                                        /** @type {number} */
                                        bitmask = bitmask & ~(BIND_FLAG | BIND_KEY_FLAG);
                                    }
                                    /** @type {!Array} */
                                    var newData = [func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity];
                                    var result = createWrapper.apply(undefined, newData);
                                    return isLaziable(func) && setData(result, newData), result.placeholder = placeholder, result;
                                }
                            }
                            var thisBinding = isBind ? thisArg : this;
                            var fn = isBindKey ? thisBinding[func] : func;
                            return argPos && (args = reorder(args, argPos)), isAry && ary < args.length && (args.length = ary), this && this !== root && this instanceof wrapper && (fn = Ctor || createCtorWrapper(func)), fn.apply(thisBinding, args);
                        }
                        /** @type {number} */
                        var isAry = bitmask & ARY_FLAG;
                        /** @type {number} */
                        var isBind = bitmask & BIND_FLAG;
                        /** @type {number} */
                        var isBindKey = bitmask & BIND_KEY_FLAG;
                        /** @type {number} */
                        var isCurry = bitmask & CURRY_FLAG;
                        /** @type {number} */
                        var isCurryBound = bitmask & CURRY_BOUND_FLAG;
                        /** @type {number} */
                        var isPartial = bitmask & block;
                        var Ctor = isBindKey ? undefined : createCtorWrapper(func);
                        return wrapper;
                    }
                    /**
                     * @param {string} element
                     * @param {number} length
                     * @param {string} string
                     * @return {?}
                     */
                    function createPadding(element, length, string) {
                        var start = element.length;
                        if (length = +length, start >= length || !isNaN(length)) {
                            return "";
                        }
                        /** @type {number} */
                        var count = length - start;
                        return string = null == string ? " " : string + "", repeat(string, nativeCeil(count / string.length)).slice(0, count);
                    }
                    /**
                     * @param {!Function} func
                     * @param {number} bitmask
                     * @param {?} thisArg
                     * @param {!NodeList} options
                     * @return {?}
                     */
                    function wrapper(func, bitmask, thisArg, options) {
                        /**
                         * @return {?}
                         */
                        function e() {
                            /** @type {number} */
                            var index = -1;
                            /** @type {number} */
                            var argsLength = arguments.length;
                            /** @type {number} */
                            var i = -1;
                            var length = options.length;
                            var params = Array(length + argsLength);
                            for (; ++i < length;) {
                                params[i] = options[i];
                            }
                            for (; argsLength--;) {
                                params[i++] = arguments[++index];
                            }
                            var fn = this && this !== root && this instanceof e ? Ctor : func;
                            return fn.apply(isBind ? thisArg : this, params);
                        }
                        /** @type {number} */
                        var isBind = bitmask & BIND_FLAG;
                        var Ctor = createCtorWrapper(func);
                        return e;
                    }
                    /**
                     * @param {string} type
                     * @return {?}
                     */
                    function decimalAdjust(type) {
                        var func = Math[type];
                        return function(number, precision) {
                            return precision = precision === undefined ? 0 : +precision || 0, precision ? (precision = pow(10, precision), func(number * precision) / precision) : func(number);
                        };
                    }
                    /**
                     * @param {boolean} retHighest
                     * @return {?}
                     */
                    function createSortedIndex(retHighest) {
                        return function(array, value, a, oldVal) {
                            var type = apply(a);
                            return null == a && type === success ? binaryIndex(array, value, retHighest) : binaryIndexBy(array, value, type(a, oldVal, 1), retHighest);
                        };
                    }
                    /**
                     * @param {string} func
                     * @param {number} value
                     * @param {?} url
                     * @param {number} d
                     * @param {string} e
                     * @param {?} width
                     * @param {string} callback
                     * @param {number} index
                     * @return {?}
                     */
                    function set(func, value, url, d, e, width, callback, index) {
                        /** @type {number} */
                        var isBindKey = value & BIND_KEY_FLAG;
                        if (!isBindKey && "function" != typeof func) {
                            throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                        }
                        var length = d ? d.length : 0;
                        if (length || (value = value & ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG), d = e = undefined), length = length - (e ? e.length : 0), value & PARTIAL_RIGHT_FLAG) {
                            /** @type {number} */
                            var f = d;
                            /** @type {string} */
                            var libmp3lame = e;
                            d = e = undefined;
                        }
                        var data = isBindKey ? undefined : getData(func);
                        /** @type {!Array} */
                        var args = [func, value, url, d, e, f, libmp3lame, width, callback, index];
                        if (data && (merge(args, data), value = args[1], index = args[9]), args[9] = null == index ? isBindKey ? 0 : func.length : nativeMax(index - length, 0) || 0, value == BIND_FLAG) {
                            var prop = forIn(args[0], args[2]);
                        } else {
                            prop = value != PARTIAL_FLAG && value != (BIND_FLAG | PARTIAL_FLAG) || args[4].length ? createWrapper.apply(undefined, args) : wrapper.apply(undefined, args);
                        }
                        var setter = data ? baseSetData : setData;
                        return setter(prop, args);
                    }
                    /**
                     * @param {!Array} array
                     * @param {!Array} other
                     * @param {!Function} equalFunc
                     * @param {!Function} customizer
                     * @param {boolean} isLoose
                     * @param {!Array} stackA
                     * @param {!Array} stackB
                     * @return {?}
                     */
                    function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
                        /** @type {number} */
                        var index = -1;
                        var arrLength = array.length;
                        var othLength = other.length;
                        if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
                            return false;
                        }
                        for (; ++index < arrLength;) {
                            var arrValue = array[index];
                            var othValue = other[index];
                            var newValue = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;
                            if (newValue !== undefined) {
                                if (newValue) {
                                    continue;
                                }
                                return false;
                            }
                            if (isLoose) {
                                if (!add(other, function(othValue) {
                                    return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
                                })) {
                                    return false;
                                }
                            } else {
                                if (arrValue !== othValue && !equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB)) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    }
                    /**
                     * @param {?} object
                     * @param {string} other
                     * @param {string} tag
                     * @return {?}
                     */
                    function equalByTag(object, other, tag) {
                        switch(tag) {
                            case arrayBufferTag:
                            case boolTag:
                                return +object == +other;
                            case dateTag:
                                return object.name == other.name && object.message == other.message;
                            case numberTag:
                                return object != +object ? other != +other : object == +other;
                            case regexpTag:
                            case stringTag:
                                return object == other + "";
                        }
                        return false;
                    }
                    /**
                     * @param {?} object
                     * @param {?} other
                     * @param {!Function} equalFunc
                     * @param {!Function} customizer
                     * @param {boolean} isLoose
                     * @param {!Array} stackA
                     * @param {!Array} stackB
                     * @return {?}
                     */
                    function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
                        var props = keys(object);
                        var len = props.length;
                        var result = keys(other);
                        var inlineCount = result.length;
                        if (len != inlineCount && !isLoose) {
                            return false;
                        }
                        var i = len;
                        for (; i--;) {
                            var key = props[i];
                            if (!(isLoose ? key in other : self.call(other, key))) {
                                return false;
                            }
                        }
                        /** @type {boolean} */
                        var skipCtor = isLoose;
                        for (; ++i < len;) {
                            key = props[i];
                            var objValue = object[key];
                            var othValue = other[key];
                            var result = customizer ? customizer(isLoose ? othValue : objValue, isLoose ? objValue : othValue, key) : undefined;
                            if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
                                return false;
                            }
                            if (!skipCtor) {
                                /** @type {boolean} */
                                skipCtor = "constructor" == key;
                            }
                        }
                        if (!skipCtor) {
                            var objCtor = object.constructor;
                            var othCtor = other.constructor;
                            if (objCtor != othCtor && "constructor" in object && "constructor" in other && !("function" == typeof objCtor && objCtor instanceof objCtor && "function" == typeof othCtor && othCtor instanceof othCtor)) {
                                return false;
                            }
                        }
                        return true;
                    }
                    /**
                     * @param {string} key
                     * @param {?} obj
                     * @param {!Function} value
                     * @return {?}
                     */
                    function apply(key, obj, value) {
                        /** @type {function(?, !Array, string): ?} */
                        var callback = exports.callback || noop;
                        return callback = callback === noop ? success : callback, value ? callback(key, obj, value) : callback;
                    }
                    /**
                     * @param {!Object} fn
                     * @return {?}
                     */
                    function getFuncName(fn) {
                        var name = fn.name;
                        var m = info[name];
                        var k = m ? m.length : 0;
                        for (; k--;) {
                            var event = m[k];
                            var evt = event.func;
                            if (null == evt || evt == fn) {
                                return event.name;
                            }
                        }
                        return name;
                    }
                    /**
                     * @param {string} type
                     * @param {number} data
                     * @param {number} key
                     * @return {?}
                     */
                    function unshift(type, data, key) {
                        /** @type {function(!Object, number, number): ?} */
                        var filter = exports.indexOf || indexOf;
                        return filter = filter === indexOf ? find : filter, type ? filter(type, data, key) : filter;
                    }
                    /**
                     * @param {!Array} value
                     * @return {?}
                     */
                    function createPath(value) {
                        var result = pairs(value);
                        var n = result.length;
                        for (; n--;) {
                            result[n][2] = copy(result[n][1]);
                        }
                        return result;
                    }
                    /**
                     * @param {!Object} object
                     * @param {string} key
                     * @return {?}
                     */
                    function getNative(object, key) {
                        var value = null == object ? undefined : object[key];
                        return isNative(value) ? value : undefined;
                    }
                    /**
                     * @param {string} start
                     * @param {number} end
                     * @param {!NodeList} step
                     * @return {?}
                     */
                    function getView(start, end, step) {
                        /** @type {number} */
                        var j = -1;
                        var i = step.length;
                        for (; ++j < i;) {
                            var data = step[j];
                            var size = data.size;
                            switch(data.type) {
                                case "drop":
                                    start = start + size;
                                    break;
                                case "dropRight":
                                    /** @type {number} */
                                    end = end - size;
                                    break;
                                case "take":
                                    end = nativeMin(end, start + size);
                                    break;
                                case "takeRight":
                                    start = nativeMax(start, end - size);
                            }
                        }
                        return {
                            start : start,
                            end : end
                        };
                    }
                    /**
                     * @param {?} array
                     * @return {?}
                     */
                    function initCloneArray(array) {
                        var length = array.length;
                        var result = new array.constructor(length);
                        return length && "string" == typeof array[0] && self.call(array, "index") && (result.index = array.index, result.input = array.input), result;
                    }
                    /**
                     * @param {!Node} object
                     * @return {?}
                     */
                    function initCloneObject(object) {
                        var Ctor = object.constructor;
                        return "function" == typeof Ctor && Ctor instanceof Ctor || (Ctor = Object), new Ctor;
                    }
                    /**
                     * @param {!Object} object
                     * @param {?} tag
                     * @param {boolean} isDeep
                     * @return {?}
                     */
                    function initCloneByTag(object, tag, isDeep) {
                        var Ctor = object.constructor;
                        switch(tag) {
                            case dataViewTag:
                                return bufferClone(object);
                            case arrayBufferTag:
                            case boolTag:
                                return new Ctor(+object);
                            case float32Tag:
                            case float32Tag$1:
                            case float64Tag:
                            case int8Tag:
                            case int32Tag:
                            case uint8Tag:
                            case uint8ClampedTag:
                            case uint16Tag:
                            case uint32Tag:
                                var buffer = object.buffer;
                                return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);
                            case numberTag:
                            case stringTag:
                                return new Ctor(object);
                            case regexpTag:
                                var result = new Ctor(object.source, reFlags.exec(object));
                                result.lastIndex = object.lastIndex;
                        }
                        return result;
                    }
                    /**
                     * @param {string} value
                     * @param {string} file
                     * @param {?} val
                     * @return {?}
                     */
                    function find(value, file, val) {
                        if (!(null == value || next(file, value))) {
                            file = join(file);
                            value = 1 == file.length ? value : callback(value, $(file, 0, -1));
                            file = replace(file);
                        }
                        var name = null == value ? value : value[file];
                        return null == name ? undefined : name.apply(value, val);
                    }
                    /**
                     * @param {!Object} value
                     * @return {?}
                     */
                    function isArrayLike(value) {
                        return null != value && isLength(getLength(value));
                    }
                    /**
                     * @param {?} value
                     * @param {number} length
                     * @return {?}
                     */
                    function isIndex(value, length) {
                        return value = "number" == typeof value || contribRegex.test(value) ? +value : -1, length = null == length ? MAX_ARRAY_INDEX : length, value > -1 && value % 1 == 0 && value < length;
                    }
                    /**
                     * @param {?} string
                     * @param {?} index
                     * @param {!Object} object
                     * @return {?}
                     */
                    function test(string, index, object) {
                        if (!isObject(object)) {
                            return false;
                        }
                        /** @type {string} */
                        var type = typeof index;
                        if ("number" == type ? isArrayLike(object) && isIndex(index, object.length) : "string" == type && index in object) {
                            var value = object[index];
                            return string === string ? string === value : value !== value;
                        }
                        return false;
                    }
                    /**
                     * @param {!Object} arg
                     * @param {!Object} str
                     * @return {?}
                     */
                    function next(arg, str) {
                        /** @type {string} */
                        var type = typeof arg;
                        if ("string" == type && matchYearMonth.test(arg) || "number" == type) {
                            return true;
                        }
                        if (isArray(arg)) {
                            return false;
                        }
                        /** @type {boolean} */
                        var r = !matchYearMonthDay.test(arg);
                        return r || null != str && arg in toObject(str);
                    }
                    /**
                     * @param {!Object} func
                     * @return {?}
                     */
                    function isLaziable(func) {
                        var funcName = getFuncName(func);
                        if (!(funcName in LazyWrapper.prototype)) {
                            return false;
                        }
                        var other = exports[funcName];
                        if (func === other) {
                            return true;
                        }
                        var data = getData(other);
                        return !!data && func === data[0];
                    }
                    /**
                     * @param {number} length
                     * @return {?}
                     */
                    function isLength(length) {
                        return "number" == typeof length && length > -1 && length % 1 == 0 && length <= MAX_ARRAY_INDEX;
                    }
                    /**
                     * @param {!Object} value
                     * @return {?}
                     */
                    function copy(value) {
                        return value === value && !isObject(value);
                    }
                    /**
                     * @param {!Array} data
                     * @param {!Array} source
                     * @return {?}
                     */
                    function merge(data, source) {
                        var bitmask = data[1];
                        var srcBitmask = source[1];
                        /** @type {number} */
                        var newBitmask = bitmask | srcBitmask;
                        /** @type {boolean} */
                        var isCommon = newBitmask < ARY_FLAG;
                        /** @type {boolean} */
                        var isReplayingSong = srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG || srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8] || srcBitmask == (ARY_FLAG | REARG_FLAG) && bitmask == CURRY_FLAG;
                        if (!isCommon && !isReplayingSong) {
                            return data;
                        }
                        if (srcBitmask & BIND_FLAG) {
                            data[2] = source[2];
                            /** @type {number} */
                            newBitmask = newBitmask | (bitmask & BIND_FLAG ? 0 : CURRY_BOUND_FLAG);
                        }
                        var key = source[3];
                        if (key) {
                            var value = data[3];
                            data[3] = value ? extend(value, key, source[4]) : copyArray(key);
                            data[4] = value ? callback(data[3], length) : copyArray(source[4]);
                        }
                        return key = source[5], key && (value = data[5], data[5] = value ? stringify(value, key, source[6]) : copyArray(key), data[6] = value ? callback(data[5], length) : copyArray(source[6])), key = source[7], key && (data[7] = copyArray(key)), srcBitmask & ARY_FLAG && (data[8] = null == data[8] ? source[8] : nativeMin(data[8], source[8])), null == data[9] && (data[9] = source[9]), data[0] = source[0], data[1] = newBitmask, data;
                    }
                    /**
                     * @param {?} value
                     * @param {(Element|!Function)} type
                     * @return {?}
                     */
                    function id(value, type) {
                        return value === undefined ? type : select(value, type, id);
                    }
                    /**
                     * @param {!Array} options
                     * @param {!NodeList} group
                     * @return {?}
                     */
                    function compile(options, group) {
                        options = toObject(options);
                        /** @type {number} */
                        var i = -1;
                        var n = group.length;
                        var filters = {};
                        for (; ++i < n;) {
                            var key = group[i];
                            if (key in options) {
                                filters[key] = options[key];
                            }
                        }
                        return filters;
                    }
                    /**
                     * @param {?} name
                     * @param {!Function} fn
                     * @return {?}
                     */
                    function bindKey(name, fn) {
                        var value = {};
                        return call(name, function(undefined, action, callback) {
                            if (fn(undefined, action, callback)) {
                                value[action] = undefined;
                            }
                        }), value;
                    }
                    /**
                     * @param {!Array} data
                     * @param {?} array
                     * @return {?}
                     */
                    function reorder(data, array) {
                        var length = data.length;
                        var index = nativeMin(array.length, length);
                        var collection = copyArray(data);
                        for (; index--;) {
                            var key = array[index];
                            data[index] = isIndex(key, length) ? collection[key] : undefined;
                        }
                        return data;
                    }
                    /**
                     * @param {!Array} object
                     * @return {?}
                     */
                    function shimKeys(object) {
                        var props = keysIn(object);
                        var propsLength = props.length;
                        var length = propsLength && object.length;
                        var allowIndexes = !!length && isLength(length) && (isArray(object) || isArguments(object));
                        /** @type {number} */
                        var index = -1;
                        /** @type {!Array} */
                        var result = [];
                        for (; ++index < propsLength;) {
                            var key = props[index];
                            if (allowIndexes && isIndex(key, length) || self.call(object, key)) {
                                result.push(key);
                            }
                        }
                        return result;
                    }
                    /**
                     * @param {?} req
                     * @return {?}
                     */
                    function slice(req) {
                        return null == req ? [] : isArrayLike(req) ? isObject(req) ? req : Object(req) : values(req);
                    }
                    /**
                     * @param {!Object} req
                     * @return {?}
                     */
                    function toObject(req) {
                        return isObject(req) ? req : Object(req);
                    }
                    /**
                     * @param {!Object} path
                     * @return {?}
                     */
                    function join(path) {
                        if (isArray(path)) {
                            return path;
                        }
                        /** @type {!Array} */
                        var pathArray = [];
                        return String(path).replace(reNewLines, function(match, number, quote, string) {
                            pathArray.push(quote ? string.replace(reEscapeChar, "$1") : number || match);
                        }), pathArray;
                    }
                    /**
                     * @param {?} wrapper
                     * @return {?}
                     */
                    function wrapperClone(wrapper) {
                        return wrapper instanceof LazyWrapper ? wrapper.clone() : new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__, copyArray(wrapper.__actions__));
                    }
                    /**
                     * @param {number} b
                     * @param {number} m
                     * @param {!Object} key
                     * @return {?}
                     */
                    function range(b, m, key) {
                        m = (key ? test(b, m, key) : null == m) ? 1 : nativeMax(floor(m) || 1, 1);
                        /** @type {number} */
                        var k = 0;
                        var l = b ? b.length : 0;
                        /** @type {number} */
                        var cnt = -1;
                        var a = Array(nativeCeil(l / m));
                        for (; k < l;) {
                            a[++cnt] = $(b, k, k = k + m);
                        }
                        return a;
                    }
                    /**
                     * @param {number} refs
                     * @return {?}
                     */
                    function compact(refs) {
                        /** @type {number} */
                        var i = -1;
                        var length = refs ? refs.length : 0;
                        /** @type {number} */
                        var ri = -1;
                        /** @type {!Array} */
                        var res = [];
                        for (; ++i < length;) {
                            var name = refs[i];
                            if (name) {
                                res[++ri] = name;
                            }
                        }
                        return res;
                    }
                    /**
                     * @param {number} data
                     * @param {number} val
                     * @param {!Object} fn
                     * @return {?}
                     */
                    function all(data, val, fn) {
                        var issue = data ? data.length : 0;
                        return issue ? ((fn ? test(data, val, fn) : null == val) && (val = 1), $(data, val < 0 ? 0 : val)) : [];
                    }
                    /**
                     * @param {number} data
                     * @param {number} value
                     * @param {!Object} fn
                     * @return {?}
                     */
                    function wrap(data, value, fn) {
                        var size = data ? data.length : 0;
                        return size ? ((fn ? test(data, value, fn) : null == value) && (value = 1), value = size - (+value || 0), $(data, 0, value < 0 ? 0 : value)) : [];
                    }
                    /**
                     * @param {!Array} prefix
                     * @param {string} path
                     * @param {?} name
                     * @return {?}
                     */
                    function runScript(prefix, path, name) {
                        return prefix && prefix.length ? get(prefix, apply(path, name, 3), true, true) : [];
                    }
                    /**
                     * @param {!Array} params
                     * @param {string} callback
                     * @param {?} name
                     * @return {?}
                     */
                    function compute(params, callback, name) {
                        return params && params.length ? get(params, apply(callback, name, 3), true) : [];
                    }
                    /**
                     * @param {number} array
                     * @param {?} value
                     * @param {number} start
                     * @param {undefined} end
                     * @return {?}
                     */
                    function color(array, value, start, end) {
                        var index = array ? array.length : 0;
                        return index ? (start && "number" != typeof start && test(array, value, start) && (start = 0, end = index), format(array, value, start, end)) : [];
                    }
                    /**
                     * @param {number} headers
                     * @return {?}
                     */
                    function head(headers) {
                        return headers ? headers[0] : undefined;
                    }
                    /**
                     * @param {number} array
                     * @param {boolean} key
                     * @param {!Object} val
                     * @return {?}
                     */
                    function concat(array, key, val) {
                        var length = array ? array.length : 0;
                        return val && test(array, key, val) && (key = false), length ? baseFlatten(array, key) : [];
                    }
                    /**
                     * @param {number} array
                     * @return {?}
                     */
                    function flattenDeep(array) {
                        var length = array ? array.length : 0;
                        return length ? baseFlatten(array, true) : [];
                    }
                    /**
                     * @param {!Object} array
                     * @param {number} value
                     * @param {number} index
                     * @return {?}
                     */
                    function indexOf(array, value, index) {
                        var length = array ? array.length : 0;
                        if (!length) {
                            return -1;
                        }
                        if ("number" == typeof index) {
                            index = index < 0 ? nativeMax(length + index, 0) : index;
                        } else {
                            if (index) {
                                var index = binaryIndex(array, value);
                                return index < length && (value === value ? value === array[index] : array[index] !== array[index]) ? index : -1;
                            }
                        }
                        return find(array, value, index || 0);
                    }
                    /**
                     * @param {undefined} callback
                     * @return {?}
                     */
                    function initial(callback) {
                        return wrap(callback, 1);
                    }
                    /**
                     * @param {string} data
                     * @return {?}
                     */
                    function replace(data) {
                        var l = data ? data.length : 0;
                        return l ? data[l - 1] : undefined;
                    }
                    /**
                     * @param {!Object} array
                     * @param {number} value
                     * @param {number} fromIndex
                     * @return {?}
                     */
                    function lastIndexOf(array, value, fromIndex) {
                        var length = array ? array.length : 0;
                        if (!length) {
                            return -1;
                        }
                        var i = length;
                        if ("number" == typeof fromIndex) {
                            i = (fromIndex < 0 ? nativeMax(length + fromIndex, 0) : nativeMin(fromIndex || 0, length - 1)) + 1;
                        } else {
                            if (fromIndex) {
                                /** @type {number} */
                                i = binaryIndex(array, value, true) - 1;
                                var other = array[i];
                                return (value === value ? value === other : other !== other) ? i : -1;
                            }
                        }
                        if (value !== value) {
                            return apply(array, i, true);
                        }
                        for (; i--;) {
                            if (array[i] === value) {
                                return i;
                            }
                        }
                        return -1;
                    }
                    /**
                     * @return {?}
                     */
                    function uniq() {
                        /** @type {!Arguments} */
                        var args = arguments;
                        var arr = args[0];
                        if (!arr || !arr.length) {
                            return arr;
                        }
                        /** @type {number} */
                        var i = 0;
                        var indexOf = unshift();
                        /** @type {number} */
                        var l = args.length;
                        for (; ++i < l;) {
                            /** @type {number} */
                            var index = 0;
                            var value = args[i];
                            for (; (index = indexOf(arr, value, index)) > -1;) {
                                splice.call(arr, index, 1);
                            }
                        }
                        return arr;
                    }
                    /**
                     * @param {number} value
                     * @param {string} fn
                     * @param {?} ctx
                     * @return {?}
                     */
                    function remove(value, fn, ctx) {
                        /** @type {!Array} */
                        var result = [];
                        if (!value || !value.length) {
                            return result;
                        }
                        /** @type {number} */
                        var i = -1;
                        /** @type {!Array} */
                        var large = [];
                        var l = value.length;
                        fn = apply(fn, ctx, 3);
                        for (; ++i < l;) {
                            var tag = value[i];
                            if (fn(tag, i, value)) {
                                result.push(tag);
                                large.push(i);
                            }
                        }
                        return getPath(value, large), result;
                    }
                    /**
                     * @param {undefined} data
                     * @return {?}
                     */
                    function tail(data) {
                        return all(data, 1);
                    }
                    /**
                     * @param {number} v
                     * @param {number} i
                     * @param {!Array} n
                     * @return {?}
                     */
                    function formatNumber(v, i, n) {
                        var m = v ? v.length : 0;
                        return m ? (n && "number" != typeof n && test(v, i, n) && (i = 0, n = m), $(v, i, n)) : [];
                    }
                    /**
                     * @param {number} data
                     * @param {number} value
                     * @param {!Object} fn
                     * @return {?}
                     */
                    function first(data, value, fn) {
                        var issue = data ? data.length : 0;
                        return issue ? ((fn ? test(data, value, fn) : null == value) && (value = 1), $(data, 0, value < 0 ? 0 : value)) : [];
                    }
                    /**
                     * @param {number} data
                     * @param {number} value
                     * @param {!Object} fn
                     * @return {?}
                     */
                    function Event(data, value, fn) {
                        var size = data ? data.length : 0;
                        return size ? ((fn ? test(data, value, fn) : null == value) && (value = 1), value = size - (+value || 0), $(data, value < 0 ? 0 : value)) : [];
                    }
                    /**
                     * @param {!Array} parent
                     * @param {string} path
                     * @param {?} name
                     * @return {?}
                     */
                    function Page(parent, path, name) {
                        return parent && parent.length ? get(parent, apply(path, name, 3), false, true) : [];
                    }
                    /**
                     * @param {!Array} name
                     * @param {string} item
                     * @param {?} index
                     * @return {?}
                     */
                    function abort(name, item, index) {
                        return name && name.length ? get(name, apply(item, index, 3)) : [];
                    }
                    /**
                     * @param {number} a
                     * @param {!Object} b
                     * @param {!Object} x
                     * @param {!Array} f
                     * @return {?}
                     */
                    function match(a, b, x, f) {
                        var u = a ? a.length : 0;
                        if (!u) {
                            return [];
                        }
                        if (null != b && "boolean" != typeof b) {
                            /** @type {!Object} */
                            f = x;
                            x = test(a, b, f) ? undefined : b;
                            /** @type {boolean} */
                            b = false;
                        }
                        var map = apply();
                        return null == x && map === success || (x = map(x, f, 3)), b && unshift() == find ? next(a, x) : log(a, x);
                    }
                    /**
                     * @param {?} data
                     * @return {?}
                     */
                    function unzip(data) {
                        if (!data || !data.length) {
                            return [];
                        }
                        /** @type {number} */
                        var index = -1;
                        /** @type {number} */
                        var length = 0;
                        data = a(data, function(group) {
                            if (isArrayLike(group)) {
                                return length = nativeMax(group.length, length), true;
                            }
                        });
                        var result = Array(length);
                        for (; ++index < length;) {
                            result[index] = normalize(data, write(index));
                        }
                        return result;
                    }
                    /**
                     * @param {number} array
                     * @param {!Object} n
                     * @param {?} a
                     * @return {?}
                     */
                    function save(array, n, a) {
                        var length = array ? array.length : 0;
                        if (!length) {
                            return [];
                        }
                        var result = unzip(array);
                        return null == n ? result : (n = p(n, a, 4), normalize(result, function(initialState) {
                            return update(initialState, n, undefined, true);
                        }));
                    }
                    /**
                     * @return {?}
                     */
                    function reducer() {
                        /** @type {number} */
                        var i = -1;
                        /** @type {number} */
                        var length = arguments.length;
                        for (; ++i < length;) {
                            var obj = arguments[i];
                            if (isArrayLike(obj)) {
                                var key = key ? fn(flatten(key, obj), flatten(obj, key)) : obj;
                            }
                        }
                        return key ? log(key) : [];
                    }
                    /**
                     * @param {number} keys
                     * @param {number} vals
                     * @return {?}
                     */
                    function zipObject(keys, vals) {
                        /** @type {number} */
                        var i = -1;
                        var len = keys ? keys.length : 0;
                        var result = {};
                        if (!(!len || vals || isArray(keys[0]))) {
                            /** @type {!Array} */
                            vals = [];
                        }
                        for (; ++i < len;) {
                            var key = keys[i];
                            if (vals) {
                                result[key] = vals[i];
                            } else {
                                if (key) {
                                    result[key[0]] = key[1];
                                }
                            }
                        }
                        return result;
                    }
                    /**
                     * @param {undefined} req
                     * @return {?}
                     */
                    function chain(req) {
                        var result = exports(req);
                        return result.__chain__ = true, result;
                    }
                    /**
                     * @param {?} t
                     * @param {!Function} button
                     * @param {?} callback
                     * @return {?}
                     */
                    function tap(t, button, callback) {
                        return button.call(callback, t), t;
                    }
                    /**
                     * @param {!Function} obj
                     * @param {!Function} item
                     * @param {!Array} parent
                     * @return {?}
                     */
                    function isProperty(obj, item, parent) {
                        return item.call(parent, obj);
                    }
                    /**
                     * @return {?}
                     */
                    function wrapperChain() {
                        return chain(this);
                    }
                    /**
                     * @return {?}
                     */
                    function lodashWrapper() {
                        return new LodashWrapper(this.value(), this.__chain__);
                    }
                    /**
                     * @param {?} value
                     * @return {?}
                     */
                    function wrapperPlant(value) {
                        var result;
                        var parent = this;
                        for (; parent instanceof lodash;) {
                            var clone = wrapperClone(parent);
                            if (result) {
                                previous.__wrapped__ = clone;
                            } else {
                                result = clone;
                            }
                            var previous = clone;
                            parent = parent.__wrapped__;
                        }
                        return previous.__wrapped__ = value, result;
                    }
                    /**
                     * @return {?}
                     */
                    function wrapperReverse() {
                        var value = this.__wrapped__;
                        /**
                         * @param {(Object|string)} value
                         * @return {?}
                         */
                        var request = function(value) {
                            return wrapped && wrapped.__dir__ < 0 ? value : value.reverse();
                        };
                        if (value instanceof LazyWrapper) {
                            var wrapped = value;
                            return this.__actions__.length && (wrapped = new LazyWrapper(this)), wrapped = wrapped.reverse(), wrapped.__actions__.push({
                                func : isProperty,
                                args : [request],
                                thisArg : undefined
                            }), new LodashWrapper(wrapped, this.__chain__);
                        }
                        return this.thru(request);
                    }
                    /**
                     * @return {?}
                     */
                    function toStringBench() {
                        return this.value() + "";
                    }
                    /**
                     * @return {?}
                     */
                    function wrapperValue() {
                        return func(this.__wrapped__, this.__actions__);
                    }
                    /**
                     * @param {!Array} x
                     * @param {undefined} options
                     * @param {?} value
                     * @return {?}
                     */
                    function every(x, options, value) {
                        /** @type {function(!Array, !Function): ?} */
                        var p = isArray(x) ? y : c;
                        return value && test(x, options, value) && (options = undefined), "function" == typeof options && value === undefined || (options = apply(options, value, 3)), p(x, options);
                    }
                    /**
                     * @param {!Array} obj
                     * @param {string} callback
                     * @param {?} args
                     * @return {?}
                     */
                    function filter(obj, callback, args) {
                        /** @type {function(!Array, string): ?} */
                        var filter = isArray(obj) ? a : table;
                        return callback = apply(callback, args, 3), filter(obj, callback);
                    }
                    /**
                     * @param {?} event
                     * @param {undefined} callback
                     * @return {?}
                     */
                    function getSelection(event, callback) {
                        return detect(event, equal(callback));
                    }
                    /**
                     * @param {!Array} value
                     * @param {undefined} item
                     * @param {number} index
                     * @param {?} data
                     * @return {?}
                     */
                    function contains(value, item, index, data) {
                        var length = value ? getLength(value) : 0;
                        return isLength(length) || (value = values(value), length = value.length), index = "number" != typeof index || data && test(item, index, data) ? 0 : index < 0 ? nativeMax(length + index, 0) : index || 0, "string" == typeof value || !isArray(value) && isNumber(value) ? index <= length && value.indexOf(item, index) > -1 : !!length && unshift(value, item, index) > -1;
                    }
                    /**
                     * @param {(!Function|string)} o
                     * @param {!Function} t
                     * @param {(Object|string)} args
                     * @return {?}
                     */
                    function map(o, t, args) {
                        /** @type {function(!Array, !Function): ?} */
                        var text = isArray(o) ? normalize : v;
                        return t = apply(t, args, 3), text(o, t);
                    }
                    /**
                     * @param {!Function} key
                     * @param {undefined} obj
                     * @return {?}
                     */
                    function pluck(key, obj) {
                        return map(key, bind(obj));
                    }
                    /**
                     * @param {?} b
                     * @param {string} callback
                     * @param {?} method
                     * @return {?}
                     */
                    function then(b, callback, method) {
                        /** @type {function(!Array, string): ?} */
                        var filter = isArray(b) ? a : table;
                        return callback = apply(callback, method, 3), filter(b, function(identifierPositions, exisObj, gmInstance) {
                            return !callback(identifierPositions, exisObj, gmInstance);
                        });
                    }
                    /**
                     * @param {!Array} array
                     * @param {number} n
                     * @param {!Object} guard
                     * @return {?}
                     */
                    function resolve(array, n, guard) {
                        if (guard ? test(array, n, guard) : null == n) {
                            array = slice(array);
                            var length = array.length;
                            return length > 0 ? array[baseRandom(0, length - 1)] : undefined;
                        }
                        /** @type {number} */
                        var i = -1;
                        var result = toArray(array);
                        length = result.length;
                        /** @type {number} */
                        var index = length - 1;
                        n = nativeMin(n < 0 ? 0 : +n || 0, length);
                        for (; ++i < n;) {
                            var j = baseRandom(i, index);
                            var r = result[j];
                            result[j] = result[i];
                            result[i] = r;
                        }
                        return result.length = n, result;
                    }
                    /**
                     * @param {undefined} start
                     * @return {?}
                     */
                    function shuffle(start) {
                        return resolve(start, x);
                    }
                    /**
                     * @param {!Object} value
                     * @return {?}
                     */
                    function size(value) {
                        var length = value ? getLength(value) : 0;
                        return isLength(length) ? length : keys(value).length;
                    }
                    /**
                     * @param {!Array} source
                     * @param {undefined} value
                     * @param {?} object
                     * @return {?}
                     */
                    function some(source, value, object) {
                        /** @type {function(!Array, !Function): ?} */
                        var action = isArray(source) ? add : del;
                        return object && test(source, value, object) && (value = undefined), "function" == typeof value && object === undefined || (value = apply(value, object, 3)), action(source, value);
                    }
                    /**
                     * @param {?} value
                     * @param {undefined} callback
                     * @param {?} val
                     * @return {?}
                     */
                    function process(value, callback, val) {
                        if (null == value) {
                            return [];
                        }
                        if (val && test(value, callback, val)) {
                            callback = undefined;
                        }
                        /** @type {number} */
                        var index = -1;
                        callback = apply(callback, val, 3);
                        var valid = v(value, function(request, undefined, m) {
                            return {
                                criteria : callback(request, undefined, m),
                                index : ++index,
                                value : request
                            };
                        });
                        return sort(valid, compare);
                    }
                    /**
                     * @param {?} y
                     * @param {?} value
                     * @param {!Object} index
                     * @param {!Object} val
                     * @return {?}
                     */
                    function at(y, value, index, val) {
                        return null == y ? [] : (val && test(value, index, val) && (index = undefined), isArray(value) || (value = null == value ? [] : [value]), isArray(index) || (index = null == index ? [] : [index]), assert(y, value, index));
                    }
                    /**
                     * @param {undefined} key
                     * @param {undefined} type
                     * @return {?}
                     */
                    function obj(key, type) {
                        return filter(key, equal(type));
                    }
                    /**
                     * @param {string} value
                     * @param {string} fn
                     * @return {?}
                     */
                    function after(value, fn) {
                        if ("function" != typeof fn) {
                            if ("function" != typeof value) {
                                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                            }
                            var n = value;
                            /** @type {string} */
                            value = fn;
                            fn = n;
                        }
                        return value = isNaN(value = +value) ? value : 0, function() {
                            if (--value < 1) {
                                return fn.apply(this, arguments);
                            }
                        };
                    }
                    /**
                     * @param {string} func
                     * @param {string} options
                     * @param {!Object} guard
                     * @return {?}
                     */
                    function drop(func, options, guard) {
                        return guard && test(func, options, guard) && (options = undefined), options = func && null == options ? func.length : nativeMax(+options || 0, 0), set(func, ARY_FLAG, undefined, undefined, undefined, undefined, options);
                    }
                    /**
                     * @param {!Object} callback
                     * @param {string} fn
                     * @return {?}
                     */
                    function on(callback, fn) {
                        var _ref12;
                        if ("function" != typeof fn) {
                            if ("function" != typeof callback) {
                                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                            }
                            var prop = callback;
                            callback = fn;
                            fn = prop;
                        }
                        return function() {
                            return --callback > 0 && (_ref12 = fn.apply(this, arguments)), callback <= 1 && (fn = undefined), _ref12;
                        };
                    }
                    /**
                     * @param {!Function} fn
                     * @param {number} wait
                     * @param {!Object} options
                     * @return {?}
                     */
                    function debounce(fn, wait, options) {
                        /**
                         * @return {undefined}
                         */
                        function cancel() {
                            if (timeoutId) {
                                clearTimeout(timeoutId);
                            }
                            if (maxTimeoutId) {
                                clearTimeout(maxTimeoutId);
                            }
                            /** @type {number} */
                            lastCalled = 0;
                            maxTimeoutId = timeoutId = trailingCall = undefined;
                        }
                        /**
                         * @param {boolean} isCalled
                         * @param {?} id
                         * @return {undefined}
                         */
                        function complete(isCalled, id) {
                            if (id) {
                                clearTimeout(id);
                            }
                            maxTimeoutId = timeoutId = trailingCall = undefined;
                            if (isCalled) {
                                lastCalled = now();
                                result = fn.apply(thisArg, args);
                                if (!(timeoutId || maxTimeoutId)) {
                                    args = thisArg = undefined;
                                }
                            }
                        }
                        /**
                         * @return {undefined}
                         */
                        function delayed() {
                            /** @type {number} */
                            var remaining = wait - (now() - stamp);
                            if (remaining <= 0 || remaining > wait) {
                                complete(trailingCall, maxTimeoutId);
                            } else {
                                timeoutId = setTimeout(delayed, remaining);
                            }
                        }
                        /**
                         * @return {undefined}
                         */
                        function maxDelayed() {
                            complete(trailing, timeoutId);
                        }
                        /**
                         * @return {?}
                         */
                        function debounced() {
                            if (args = arguments, stamp = now(), thisArg = this, trailingCall = trailing && (timeoutId || !leading), maxWait === false) {
                                var leadingCall = leading && !timeoutId;
                            } else {
                                if (!(maxTimeoutId || leading)) {
                                    lastCalled = stamp;
                                }
                                /** @type {number} */
                                var remaining = maxWait - (stamp - lastCalled);
                                /** @type {boolean} */
                                var ran = remaining <= 0 || remaining > maxWait;
                                if (ran) {
                                    if (maxTimeoutId) {
                                        maxTimeoutId = clearTimeout(maxTimeoutId);
                                    }
                                    lastCalled = stamp;
                                    result = fn.apply(thisArg, args);
                                } else {
                                    if (!maxTimeoutId) {
                                        maxTimeoutId = setTimeout(maxDelayed, remaining);
                                    }
                                }
                            }
                            return ran && timeoutId ? timeoutId = clearTimeout(timeoutId) : timeoutId || wait === maxWait || (timeoutId = setTimeout(delayed, wait)), leadingCall && (ran = true, result = fn.apply(thisArg, args)), !ran || timeoutId || maxTimeoutId || (args = thisArg = undefined), result;
                        }
                        var args;
                        var maxTimeoutId;
                        var result;
                        var stamp;
                        var thisArg;
                        var timeoutId;
                        var trailingCall;
                        /** @type {number} */
                        var lastCalled = 0;
                        /** @type {boolean} */
                        var maxWait = false;
                        /** @type {boolean} */
                        var trailing = true;
                        if ("function" != typeof fn) {
                            throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                        }
                        if (wait = wait < 0 ? 0 : +wait || 0, options === true) {
                            /** @type {boolean} */
                            var leading = true;
                            /** @type {boolean} */
                            trailing = false;
                        } else {
                            if (isObject(options)) {
                                /** @type {boolean} */
                                leading = !!options.leading;
                                maxWait = "maxWait" in options && nativeMax(+options.maxWait || 0, wait);
                                /** @type {boolean} */
                                trailing = "trailing" in options ? !!options.trailing : trailing;
                            }
                        }
                        return debounced.cancel = cancel, debounced;
                    }
                    /**
                     * @param {!Function} callback
                     * @param {!Function} fn
                     * @return {?}
                     */
                    function memoize(callback, fn) {
                        if ("function" != typeof callback || fn && "function" != typeof fn) {
                            throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                        }
                        /**
                         * @return {?}
                         */
                        var memoized = function() {
                            /** @type {!Arguments} */
                            var value = arguments;
                            var key = fn ? fn.apply(this, value) : value[0];
                            var cache = memoized.cache;
                            if (cache.has(key)) {
                                return cache.get(key);
                            }
                            var result = callback.apply(this, value);
                            return memoized.cache = cache.set(key, result), result;
                        };
                        return memoized.cache = new memoize.Cache, memoized;
                    }
                    /**
                     * @param {!Function} fn
                     * @return {?}
                     */
                    function negate(fn) {
                        if ("function" != typeof fn) {
                            throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                        }
                        return function() {
                            return !fn.apply(this, arguments);
                        };
                    }
                    /**
                     * @param {string} type
                     * @return {?}
                     */
                    function once(type) {
                        return on(2, type);
                    }
                    /**
                     * @param {!Function} callback
                     * @param {string} start
                     * @return {?}
                     */
                    function require(callback, start) {
                        if ("function" != typeof callback) {
                            throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                        }
                        return start = nativeMax(start === undefined ? callback.length - 1 : +start || 0, 0), function() {
                            /** @type {!Arguments} */
                            var items = arguments;
                            /** @type {number} */
                            var index = -1;
                            var length = nativeMax(items.length - start, 0);
                            var data = Array(length);
                            for (; ++index < length;) {
                                data[index] = items[start + index];
                            }
                            switch(start) {
                                case 0:
                                    return callback.call(this, data);
                                case 1:
                                    return callback.call(this, items[0], data);
                                case 2:
                                    return callback.call(this, items[0], items[1], data);
                            }
                            var params = Array(start + 1);
                            /** @type {number} */
                            index = -1;
                            for (; ++index < start;) {
                                params[index] = items[index];
                            }
                            return params[start] = data, callback.apply(this, params);
                        };
                    }
                    /**
                     * @param {!Function} fn
                     * @return {?}
                     */
                    function spread(fn) {
                        if ("function" != typeof fn) {
                            throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                        }
                        return function(extraInputs) {
                            return fn.apply(this, extraInputs);
                        };
                    }
                    /**
                     * @param {!Function} fn
                     * @param {undefined} wait
                     * @param {!Object} options
                     * @return {?}
                     */
                    function throttle(fn, wait, options) {
                        /** @type {boolean} */
                        var leading = true;
                        /** @type {boolean} */
                        var trailing = true;
                        if ("function" != typeof fn) {
                            throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                        }
                        return options === false ? leading = false : isObject(options) && (leading = "leading" in options ? !!options.leading : leading, trailing = "trailing" in options ? !!options.trailing : trailing), debounce(fn, wait, {
                            leading : leading,
                            maxWait : +wait,
                            trailing : trailing
                        });
                    }
                    /**
                     * @param {?} name
                     * @param {!Function} i
                     * @return {?}
                     */
                    function last(name, i) {
                        return i = null == i ? identity : i, set(i, PARTIAL_FLAG, undefined, [name], []);
                    }
                    /**
                     * @param {?} e
                     * @param {!Object} options
                     * @param {!Object} n
                     * @param {!Object} t
                     * @return {?}
                     */
                    function cycle(e, options, n, t) {
                        return options && "boolean" != typeof options && test(e, options, n) ? options = false : "function" == typeof options && (t = n, n = options, options = false), "function" == typeof n ? baseClone(e, options, p(n, t, 1)) : baseClone(e, options);
                    }
                    /**
                     * @param {?} fn
                     * @param {!Function} data
                     * @param {?} val
                     * @return {?}
                     */
                    function cloneDeep(fn, data, val) {
                        return "function" == typeof data ? baseClone(fn, true, p(data, val, 1)) : baseClone(fn, true);
                    }
                    /**
                     * @param {(Date|number)} s
                     * @param {!Date} num
                     * @return {?}
                     */
                    function gt(s, num) {
                        return s > num;
                    }
                    /**
                     * @param {(boolean|number|string)} a
                     * @param {(boolean|number|string)} b
                     * @return {?}
                     */
                    function min(a, b) {
                        return a >= b;
                    }
                    /**
                     * @param {!Array} value
                     * @return {?}
                     */
                    function isArguments(value) {
                        return isObjectLike(value) && isArrayLike(value) && self.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
                    }
                    /**
                     * @param {?} value
                     * @return {?}
                     */
                    function isBoolean(value) {
                        return value === true || value === false || isObjectLike(value) && toString.call(value) == arrayBufferTag;
                    }
                    /**
                     * @param {?} value
                     * @return {?}
                     */
                    function isDate(value) {
                        return isObjectLike(value) && toString.call(value) == boolTag;
                    }
                    /**
                     * @param {?} value
                     * @return {?}
                     */
                    function isElement(value) {
                        return !!value && 1 === value.nodeType && isObjectLike(value) && !isPlainObject(value);
                    }
                    /**
                     * @param {?} value
                     * @return {?}
                     */
                    function isEmpty(value) {
                        return null == value || (isArrayLike(value) && (isArray(value) || isNumber(value) || isArguments(value) || isObjectLike(value) && isFunction(value.splice)) ? !value.length : !keys(value).length);
                    }
                    /**
                     * @param {undefined} request
                     * @param {undefined} options
                     * @param {!Function} callback
                     * @param {?} e
                     * @return {?}
                     */
                    function isEqual(request, options, callback, e) {
                        callback = "function" == typeof callback ? p(callback, e, 3) : undefined;
                        var result = callback ? callback(request, options) : undefined;
                        return result === undefined ? baseIsEqual(request, options, callback) : !!result;
                    }
                    /**
                     * @param {?} value
                     * @return {?}
                     */
                    function isError(value) {
                        return isObjectLike(value) && "string" == typeof value.message && toString.call(value) == dateTag;
                    }
                    /**
                     * @param {number} val
                     * @return {?}
                     */
                    function isFinite(val) {
                        return "number" == typeof val && isNaN(val);
                    }
                    /**
                     * @param {!Array} value
                     * @return {?}
                     */
                    function isFunction(value) {
                        return isObject(value) && toString.call(value) == funcTag;
                    }
                    /**
                     * @param {!Object} obj
                     * @return {?}
                     */
                    function isObject(obj) {
                        /** @type {string} */
                        var type = typeof obj;
                        return !!obj && ("object" == type || "function" == type);
                    }
                    /**
                     * @param {?} operation
                     * @param {!Array} name
                     * @param {undefined} value
                     * @param {?} e
                     * @return {?}
                     */
                    function start(operation, name, value, e) {
                        return value = "function" == typeof value ? p(value, e, 3) : undefined, transform(operation, createPath(name), value);
                    }
                    /**
                     * @param {?} value
                     * @return {?}
                     */
                    function eq(value) {
                        return getType(value) && value != +value;
                    }
                    /**
                     * @param {?} value
                     * @return {?}
                     */
                    function isNative(value) {
                        return null != value && (isFunction(value) ? reIsNative.test(check.call(value)) : isObjectLike(value) && trueRE.test(value));
                    }
                    /**
                     * @param {!Object} val
                     * @return {?}
                     */
                    function isNull(val) {
                        return null === val;
                    }
                    /**
                     * @param {?} value
                     * @return {?}
                     */
                    function getType(value) {
                        return "number" == typeof value || isObjectLike(value) && toString.call(value) == numberTag;
                    }
                    /**
                     * @param {?} obj
                     * @return {?}
                     */
                    function isPlainObject(obj) {
                        var ctor;
                        if (!isObjectLike(obj) || toString.call(obj) != type || isArguments(obj) || !self.call(obj, "constructor") && (ctor = obj.constructor, "function" == typeof ctor && !(ctor instanceof ctor))) {
                            return false;
                        }
                        var key;
                        return call(obj, function(canCreateDiscussions, objectkey) {
                            key = objectkey;
                        }), key === undefined || self.call(obj, key);
                    }
                    /**
                     * @param {(Object|string)} value
                     * @return {?}
                     */
                    function isRegExp(value) {
                        return isObject(value) && toString.call(value) == regexpTag;
                    }
                    /**
                     * @param {!Array} value
                     * @return {?}
                     */
                    function isNumber(value) {
                        return "string" == typeof value || isObjectLike(value) && toString.call(value) == stringTag;
                    }
                    /**
                     * @param {!Array} value
                     * @return {?}
                     */
                    function isString(value) {
                        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[toString.call(value)];
                    }
                    /**
                     * @param {?} value
                     * @return {?}
                     */
                    function isUndefined(value) {
                        return value === undefined;
                    }
                    /**
                     * @param {(boolean|number|string)} b
                     * @param {(boolean|number|string)} a
                     * @return {?}
                     */
                    function max(b, a) {
                        return b < a;
                    }
                    /**
                     * @param {(boolean|number|string)} b
                     * @param {(boolean|number|string)} a
                     * @return {?}
                     */
                    function lte(b, a) {
                        return b <= a;
                    }
                    /**
                     * @param {!Array} value
                     * @return {?}
                     */
                    function toArray(value) {
                        var length = value ? getLength(value) : 0;
                        return isLength(length) ? length ? copyArray(value) : [] : values(value);
                    }
                    /**
                     * @param {?} value
                     * @return {?}
                     */
                    function toPlainObject(value) {
                        return copyObject(value, keysIn(value));
                    }
                    /**
                     * @param {?} url
                     * @param {!Array} callback
                     * @param {!Object} val
                     * @return {?}
                     */
                    function url(url, callback, val) {
                        var result = baseCreate(url);
                        return val && test(url, callback, val) && (callback = undefined), callback ? baseAssign(result, callback) : result;
                    }
                    /**
                     * @param {?} obj
                     * @return {?}
                     */
                    function functions(obj) {
                        return pick(obj, keysIn(obj));
                    }
                    /**
                     * @param {string} key
                     * @param {string} path
                     * @param {(Object|string)} index
                     * @return {?}
                     */
                    function getter(key, path, index) {
                        var level = null == key ? undefined : callback(key, join(path), path + "");
                        return level === undefined ? index : level;
                    }
                    /**
                     * @param {?} value
                     * @param {string} path
                     * @return {?}
                     */
                    function has(value, path) {
                        if (null == value) {
                            return false;
                        }
                        var newtokens = self.call(value, path);
                        if (!newtokens && !next(path)) {
                            if (path = join(path), value = 1 == path.length ? value : callback(value, $(path, 0, -1)), null == value) {
                                return false;
                            }
                            path = replace(path);
                            newtokens = self.call(value, path);
                        }
                        return newtokens || isLength(value.length) && isIndex(path, value.length) && (isArray(value) || isArguments(value));
                    }
                    /**
                     * @param {?} prop
                     * @param {!Array} ctx
                     * @param {!Object} val
                     * @return {?}
                     */
                    function value(prop, ctx, val) {
                        if (val && test(prop, ctx, val)) {
                            ctx = undefined;
                        }
                        /** @type {number} */
                        var hash = -1;
                        var result = keys(prop);
                        var trlen = result.length;
                        var map = {};
                        for (; ++hash < trlen;) {
                            var i = result[hash];
                            var name = prop[i];
                            if (ctx) {
                                if (self.call(map, name)) {
                                    map[name].push(i);
                                } else {
                                    /** @type {!Array} */
                                    map[name] = [i];
                                }
                            } else {
                                map[name] = i;
                            }
                        }
                        return map;
                    }
                    /**
                     * @param {?} request
                     * @return {?}
                     */
                    function keysIn(request) {
                        if (null == request) {
                            return [];
                        }
                        if (!isObject(request)) {
                            request = Object(request);
                        }
                        var length = request.length;
                        length = length && isLength(length) && (isArray(request) || isArguments(request)) && length || 0;
                        var obj = request.constructor;
                        /** @type {number} */
                        var i = -1;
                        /** @type {boolean} */
                        var index = "function" == typeof obj && obj.prototype === request;
                        var result = Array(length);
                        /** @type {boolean} */
                        var skipIndexes = length > 0;
                        for (; ++i < length;) {
                            /** @type {string} */
                            result[i] = i + "";
                        }
                        var key;
                        for (key in request) {
                            if (!(skipIndexes && isIndex(key, length) || "constructor" == key && (index || !self.call(request, key)))) {
                                result.push(key);
                            }
                        }
                        return result;
                    }
                    /**
                     * @param {!Array} object
                     * @return {?}
                     */
                    function pairs(object) {
                        object = toObject(object);
                        /** @type {number} */
                        var i = -1;
                        var props = keys(object);
                        var length = props.length;
                        var result = Array(length);
                        for (; ++i < length;) {
                            var key = props[i];
                            /** @type {!Array} */
                            result[i] = [key, object[key]];
                        }
                        return result;
                    }
                    /**
                     * @param {string} result
                     * @param {string} name
                     * @param {!Object} defaultValue
                     * @return {?}
                     */
                    function t(result, name, defaultValue) {
                        var value = null == result ? undefined : result[name];
                        return value === undefined && (null == result || next(name, result) || (name = join(name), result = 1 == name.length ? result : callback(result, $(name, 0, -1)), value = null == result ? undefined : result[replace(name)]), value = value === undefined ? defaultValue : value), isFunction(value) ? value.call(result) : value;
                    }
                    /**
                     * @param {?} obj
                     * @param {number} a
                     * @param {number} i
                     * @return {?}
                     */
                    function api(obj, a, i) {
                        if (null == obj) {
                            return obj;
                        }
                        /** @type {string} */
                        var id = a + "";
                        a = null != obj[id] || next(a, obj) ? [id] : join(a);
                        /** @type {number} */
                        var i = -1;
                        var l = a.length;
                        /** @type {number} */
                        var j = l - 1;
                        var el = obj;
                        for (; null != el && ++i < l;) {
                            var key = a[i];
                            if (isObject(el)) {
                                if (i == j) {
                                    /** @type {number} */
                                    el[key] = i;
                                } else {
                                    if (null == el[key]) {
                                        /** @type {(Array|{})} */
                                        el[key] = isIndex(a[i + 1]) ? [] : {};
                                    }
                                }
                            }
                            el = el[key];
                        }
                        return obj;
                    }
                    /**
                     * @param {?} object
                     * @param {string} callback
                     * @param {!Object} result
                     * @param {?} args
                     * @return {?}
                     */
                    function create(object, callback, result, args) {
                        var isArr = isArray(object) || isString(object);
                        if (callback = apply(callback, args, 4), null == result) {
                            if (isArr || isObject(object)) {
                                var Ctor = object.constructor;
                                result = isArr ? isArray(object) ? new Ctor : [] : baseCreate(isFunction(Ctor) ? Ctor.prototype : undefined);
                            } else {
                                result = {};
                            }
                        }
                        return (isArr ? forEach : baseForOwn)(object, function(exisObj, gmInstance, publicContent) {
                            return callback(result, exisObj, gmInstance, publicContent);
                        }), result;
                    }
                    /**
                     * @param {?} object
                     * @return {?}
                     */
                    function values(object) {
                        return baseValues(object, keys(object));
                    }
                    /**
                     * @param {?} object
                     * @return {?}
                     */
                    function toPairsIn(object) {
                        return baseValues(object, keysIn(object));
                    }
                    /**
                     * @param {?} value
                     * @param {number} start
                     * @param {number} end
                     * @return {?}
                     */
                    function inRange(value, start, end) {
                        return start = +start || 0, end === undefined ? (end = start, start = 0) : end = +end || 0, value >= nativeMin(start, end) && value < nativeMax(start, end);
                    }
                    /**
                     * @param {number} min
                     * @param {number} max
                     * @param {!Object} floating
                     * @return {?}
                     */
                    function random(min, max, floating) {
                        if (floating && test(min, max, floating)) {
                            max = floating = undefined;
                        }
                        /** @type {boolean} */
                        var reverseIsSingle = null == min;
                        /** @type {boolean} */
                        var reverseValue = null == max;
                        if (null == floating && (reverseValue && "boolean" == typeof min ? (floating = min, min = 1) : "boolean" == typeof max && (floating = max, reverseValue = true)), reverseIsSingle && reverseValue && (max = 1, reverseValue = false), min = +min || 0, reverseValue ? (max = min, min = 0) : max = +max || 0, floating || min % 1 || max % 1) {
                            var rand = nativeRandom();
                            return nativeMin(min + rand * (max - min + parseFloat("1e-" + ((rand + "").length - 1))), max);
                        }
                        return baseRandom(min, max);
                    }
                    /**
                     * @param {string} string
                     * @return {?}
                     */
                    function capitalize(string) {
                        return string = String(string), string && string.charAt(0).toUpperCase() + string.slice(1);
                    }
                    /**
                     * @param {string} result
                     * @return {?}
                     */
                    function reject(result) {
                        return result = String(result), result && result.replace(rbreakright, h).replace(regex, "");
                    }
                    /**
                     * @param {string} target
                     * @param {string} string
                     * @param {number} position
                     * @return {?}
                     */
                    function endsWith(target, string, position) {
                        target = String(target);
                        /** @type {string} */
                        string = string + "";
                        var length = target.length;
                        return position = position === undefined ? length : nativeMin(position < 0 ? 0 : +position || 0, length), position = position - string.length, position >= 0 && target.indexOf(string, position) == position;
                    }
                    /**
                     * @param {string} str
                     * @return {?}
                     */
                    function escape(str) {
                        return str = String(str), str && r.test(str) ? str.replace(reUnescapedHtml, from) : str;
                    }
                    /**
                     * @param {string} string
                     * @return {?}
                     */
                    function escapeRegExp(string) {
                        return string = String(string), string && reHasEscapedHtml.test(string) ? string.replace(reRegExpChars, p) : string || "(?:)";
                    }
                    /**
                     * @param {string} string
                     * @param {number} s
                     * @param {string} chars
                     * @return {?}
                     */
                    function pad(string, s, chars) {
                        string = String(string);
                        /** @type {number} */
                        s = +s;
                        var c = string.length;
                        if (c >= s || !isNaN(s)) {
                            return string;
                        }
                        /** @type {number} */
                        var mid = (s - c) / 2;
                        var i = floor(mid);
                        var rightLength = nativeCeil(mid);
                        return chars = createPadding("", rightLength, chars), chars.slice(0, i) + string + chars;
                    }
                    /**
                     * @param {boolean} name
                     * @param {number} value
                     * @param {!Object} fn
                     * @return {?}
                     */
                    function checkCall(name, value, fn) {
                        return (fn ? test(name, value, fn) : null == value) ? value = 0 : value && (value = +value), name = split(name), parseInt(name, value || (testRxp.test(name) ? 16 : 10));
                    }
                    /**
                     * @param {string} string
                     * @param {number} n
                     * @return {?}
                     */
                    function repeat(string, n) {
                        /** @type {string} */
                        var result = "";
                        if (string = String(string), n = +n, n < 1 || !string || !isNaN(n)) {
                            return result;
                        }
                        do {
                            if (n % 2) {
                                /** @type {string} */
                                result = result + string;
                            }
                            n = floor(n / 2);
                            string = string + string;
                        } while (n);
                        return result;
                    }
                    /**
                     * @param {string} string
                     * @param {!Object} key
                     * @param {number} value
                     * @return {?}
                     */
                    function startsWith(string, key, value) {
                        return string = String(string), value = null == value ? 0 : nativeMin(value < 0 ? 0 : +value || 0, string.length), string.lastIndexOf(key, value) == value;
                    }
                    /**
                     * @param {string} string
                     * @param {!Object} options
                     * @param {undefined} otherOptions
                     * @return {?}
                     */
                    function template(string, options, otherOptions) {
                        var settings = exports.templateSettings;
                        if (otherOptions && test(string, options, otherOptions)) {
                            options = otherOptions = undefined;
                        }
                        string = String(string);
                        options = assign(baseAssign({}, otherOptions || options), settings, setOptions);
                        var enable_keys;
                        var rootIsItemUrl;
                        var object = assign(baseAssign({}, options.imports), settings.imports, setOptions);
                        var importsKeys = keys(object);
                        var importsValues = baseValues(object, importsKeys);
                        /** @type {number} */
                        var s = 0;
                        var interpolate = options.interpolate || reNoMatch;
                        /** @type {string} */
                        var url = "__p += '";
                        var reUnescapedHtml = RegExp((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
                        /** @type {string} */
                        var embeddedJavaScriptFrom = "//# sourceURL=" + ("sourceURL" in options ? options.sourceURL : "lodash.templateSources[" + ++zt + "]") + "\n";
                        string.replace(reUnescapedHtml, function(otag, n, interpolateValue, esTemplateValue, canCreateDiscussions, i) {
                            return interpolateValue || (interpolateValue = esTemplateValue), url = url + string.slice(s, i).replace(a, version), n && (enable_keys = true, url = url + ("' +\n__e(" + n + ") +\n'")), canCreateDiscussions && (rootIsItemUrl = true, url = url + ("';\n" + canCreateDiscussions + ";\n__p += '")), interpolateValue && (url = url + ("' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'")), s = i + otag.length, otag;
                        });
                        url = url + "';\n";
                        var variable = options.variable;
                        if (!variable) {
                            /** @type {string} */
                            url = "with (obj) {\n" + url + "\n}\n";
                        }
                        url = (rootIsItemUrl ? url.replace(regRelative, "") : url).replace(formattingRemoveEscapes, "$1").replace(_RE_DOT, "$1;");
                        /** @type {string} */
                        url = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (enable_keys ? ", __e = _.escape" : "") + (rootIsItemUrl ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + url + "return __p\n}";
                        var result = attempt(function() {
                            return h(importsKeys, embeddedJavaScriptFrom + "return " + url).apply(undefined, importsValues);
                        });
                        if (result.source = url, isError(result)) {
                            throw result;
                        }
                        return result;
                    }
                    /**
                     * @param {string} d
                     * @param {string} n
                     * @param {!Object} val
                     * @return {?}
                     */
                    function split(d, n, val) {
                        /** @type {string} */
                        var data = d;
                        return (d = String(d)) ? (val ? test(data, n, val) : null == n) ? d.slice(write(d), map(d) + 1) : (n = n + "", d.slice(c(d, n), filter(d, n) + 1)) : d;
                    }
                    /**
                     * @param {string} d
                     * @param {string} value
                     * @param {!Object} fn
                     * @return {?}
                     */
                    function w(d, value, fn) {
                        /** @type {string} */
                        var data = d;
                        return d = String(d), d ? (fn ? test(data, value, fn) : null == value) ? d.slice(write(d)) : d.slice(c(d, value + "")) : d;
                    }
                    /**
                     * @param {string} a
                     * @param {string} val
                     * @param {!Object} fn
                     * @return {?}
                     */
                    function compare(a, val, fn) {
                        /** @type {string} */
                        var date = a;
                        return a = String(a), a ? (fn ? test(date, val, fn) : null == val) ? a.slice(0, map(a) + 1) : a.slice(0, filter(a, val + "") + 1) : a;
                    }
                    /**
                     * @param {string} string
                     * @param {!Object} options
                     * @param {!Object} guard
                     * @return {?}
                     */
                    function truncate(string, options, guard) {
                        if (guard && test(string, options, guard)) {
                            options = undefined;
                        }
                        /** @type {number} */
                        var length = groupSize;
                        /** @type {string} */
                        var omission = DEFAULT_TRUNC_OMISSION;
                        if (null != options) {
                            if (isObject(options)) {
                                var separator = "separator" in options ? options.separator : separator;
                                /** @type {number} */
                                length = "length" in options ? +options.length || 0 : length;
                                omission = "omission" in options ? String(options.omission) : omission;
                            } else {
                                /** @type {number} */
                                length = +options || 0;
                            }
                        }
                        if (string = String(string), length >= string.length) {
                            return string;
                        }
                        /** @type {number} */
                        var end = length - omission.length;
                        if (end < 1) {
                            return omission;
                        }
                        var result = string.slice(0, end);
                        if (null == separator) {
                            return result + omission;
                        }
                        if (isRegExp(separator)) {
                            if (string.slice(end).search(separator)) {
                                var markup;
                                var start;
                                var value = string.slice(0, end);
                                if (!separator.global) {
                                    separator = RegExp(separator.source, (reFlags.exec(separator) || "") + "g");
                                }
                                /** @type {number} */
                                separator.lastIndex = 0;
                                for (; markup = separator.exec(value);) {
                                    start = markup.index;
                                }
                                result = result.slice(0, null == start ? end : start);
                            }
                        } else {
                            if (string.indexOf(separator, end) != end) {
                                var pos = result.lastIndexOf(separator);
                                if (pos > -1) {
                                    result = result.slice(0, pos);
                                }
                            }
                        }
                        return result + omission;
                    }
                    /**
                     * @param {string} key
                     * @return {?}
                     */
                    function unescape(key) {
                        return key = String(key), key && black.test(key) ? key.replace(reg, listener) : key;
                    }
                    /**
                     * @param {string} path
                     * @param {(Object|string)} value
                     * @param {!Object} node
                     * @return {?}
                     */
                    function result(path, value, node) {
                        return node && test(path, value, node) && (value = undefined), path = String(path), path.match(value || name) || [];
                    }
                    /**
                     * @param {?} func
                     * @param {!Array} a
                     * @param {string} val
                     * @return {?}
                     */
                    function noop(func, a, val) {
                        return val && test(func, a, val) && (a = undefined), isObjectLike(func) ? matches(func) : success(func, a);
                    }
                    /**
                     * @param {?} value
                     * @return {?}
                     */
                    function constant(value) {
                        return function() {
                            return value;
                        };
                    }
                    /**
                     * @param {!Object} object
                     * @return {?}
                     */
                    function identity(object) {
                        return object;
                    }
                    /**
                     * @param {?} func
                     * @return {?}
                     */
                    function matches(func) {
                        return equal(baseClone(func, true));
                    }
                    /**
                     * @param {!Object} object
                     * @param {?} value
                     * @return {?}
                     */
                    function updateIn(object, value) {
                        return put(object, baseClone(value, true));
                    }
                    /**
                     * @param {!Function} object
                     * @param {!Object} value
                     * @param {!Object} options
                     * @return {?}
                     */
                    function run(object, value, options) {
                        if (null == options) {
                            var obj = isObject(value);
                            var options = obj ? keys(value) : undefined;
                            var json = options && options.length ? pick(value, options) : undefined;
                            if (!(json ? json.length : obj)) {
                                /** @type {boolean} */
                                json = false;
                                /** @type {!Object} */
                                options = value;
                                /** @type {!Function} */
                                value = object;
                                object = this;
                            }
                        }
                        if (!json) {
                            json = pick(value, keys(value));
                        }
                        /** @type {boolean} */
                        var chain = true;
                        /** @type {number} */
                        var i = -1;
                        var isFunc = isFunction(object);
                        var l = json.length;
                        if (options === false) {
                            /** @type {boolean} */
                            chain = false;
                        } else {
                            if (isObject(options) && "chain" in options) {
                                chain = options.chain;
                            }
                        }
                        for (; ++i < l;) {
                            var name = json[i];
                            var version = value[name];
                            object[name] = version;
                            if (isFunc) {
                                object.prototype[name] = function(callback) {
                                    return function() {
                                        var chainAll = this.__chain__;
                                        if (chain || chainAll) {
                                            var result = object(this.__wrapped__);
                                            var actions = result.__actions__ = copyArray(this.__actions__);
                                            return actions.push({
                                                func : callback,
                                                args : arguments,
                                                thisArg : object
                                            }), result.__chain__ = chainAll, result;
                                        }
                                        return callback.apply(object, fn([this.value()], arguments));
                                    };
                                }(version);
                            }
                        }
                        return object;
                    }
                    /**
                     * @return {?}
                     */
                    function noConflict() {
                        return root._ = previousUnderscore, this;
                    }
                    /**
                     * @return {undefined}
                     */
                    function runSuite() {
                    }
                    /**
                     * @param {string} name
                     * @return {?}
                     */
                    function bind(name) {
                        return next(name) ? write(name) : traverse(name);
                    }
                    /**
                     * @param {!Object} min
                     * @return {?}
                     */
                    function html(min) {
                        return function(result) {
                            return callback(min, join(result), result + "");
                        };
                    }
                    /**
                     * @param {!Object} start
                     * @param {!Object} end
                     * @param {!Object} step
                     * @return {?}
                     */
                    function baseRange(start, end, step) {
                        if (step && test(start, end, step)) {
                            end = step = undefined;
                        }
                        /** @type {number} */
                        start = +start || 0;
                        /** @type {number} */
                        step = null == step ? 1 : +step || 0;
                        if (null == end) {
                            /** @type {!Object} */
                            end = start;
                            /** @type {number} */
                            start = 0;
                        } else {
                            /** @type {number} */
                            end = +end || 0;
                        }
                        /** @type {number} */
                        var index = -1;
                        var length = nativeMax(nativeCeil((end - start) / (step || 1)), 0);
                        var result = Array(length);
                        for (; ++index < length;) {
                            /** @type {!Object} */
                            result[index] = start;
                            /** @type {number} */
                            start = start + step;
                        }
                        return result;
                    }
                    /**
                     * @param {number} n
                     * @param {!Function} f
                     * @param {?} s
                     * @return {?}
                     */
                    function times(n, f, s) {
                        if (n = floor(n), n < 1 || !isNaN(n)) {
                            return [];
                        }
                        /** @type {number} */
                        var index = -1;
                        var result = Array(nativeMin(n, MAX_ARRAY_LENGTH));
                        f = p(f, s, 1);
                        for (; ++index < n;) {
                            if (index < MAX_ARRAY_LENGTH) {
                                result[index] = f(index);
                            } else {
                                f(index);
                            }
                        }
                        return result;
                    }
                    /**
                     * @param {string} length
                     * @return {?}
                     */
                    function uniqueId(length) {
                        /** @type {number} */
                        var str = ++callId;
                        return String(length) + str;
                    }
                    /**
                     * @param {!Object} type
                     * @param {?} s
                     * @return {?}
                     */
                    function fun(type, s) {
                        return (+type || 0) + (+s || 0);
                    }
                    /**
                     * @param {?} item
                     * @param {string} key
                     * @param {?} val
                     * @return {?}
                     */
                    function e(item, key, val) {
                        return val && test(item, key, val) && (key = undefined), key = apply(key, val, 3), 1 == key.length ? push(isArray(item) ? item : slice(item), key) : emit(item, key);
                    }
                    global = global ? _.defaults(root.Object(), global, _.pick(root, contextProps)) : root;
                    var Array = global.Array;
                    var Date = global.Date;
                    var Error = global.Error;
                    var h = global.Function;
                    var Math = global.Math;
                    var Number = global.Number;
                    var Object = global.Object;
                    var RegExp = global.RegExp;
                    var String = global.String;
                    var TypeError = global.TypeError;
                    var arrayProto = Array.prototype;
                    var ObjProto = Object.prototype;
                    var StringProto = String.prototype;
                    var check = h.prototype.toString;
                    var self = ObjProto.hasOwnProperty;
                    /** @type {number} */
                    var callId = 0;
                    var toString = ObjProto.toString;
                    var previousUnderscore = root._;
                    var reIsNative = RegExp("^" + check.call(self).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
                    var ArrayBuffer = global.ArrayBuffer;
                    var clearTimeout = global.clearTimeout;
                    var parseFloat = global.parseFloat;
                    var pow = Math.pow;
                    var propertyIsEnumerable = ObjProto.propertyIsEnumerable;
                    var Set = getNative(global, "Set");
                    var setTimeout = global.setTimeout;
                    var splice = arrayProto.splice;
                    var Uint8Array = global.Uint8Array;
                    var WeakMap = getNative(global, "WeakMap");
                    var nativeCeil = Math.ceil;
                    var nativeCreate = getNative(Object, "create");
                    var floor = Math.floor;
                    var nativeIsArray = getNative(Array, "isArray");
                    var isNaN = global.isFinite;
                    var nativeKeys = getNative(Object, "keys");
                    var nativeMax = Math.max;
                    var nativeMin = Math.min;
                    var nativeNow = getNative(Date, "now");
                    var parseInt = global.parseInt;
                    var nativeRandom = Math.random;
                    var d = Number.NEGATIVE_INFINITY;
                    var x = Number.POSITIVE_INFINITY;
                    /** @type {number} */
                    var MAX_ARRAY_LENGTH = 4294967295;
                    /** @type {number} */
                    var funcsLength = MAX_ARRAY_LENGTH - 1;
                    /** @type {number} */
                    var HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
                    /** @type {number} */
                    var MAX_ARRAY_INDEX = 9007199254740991;
                    var path = WeakMap && new WeakMap;
                    var info = {};
                    exports.support = {};
                    exports.templateSettings = {
                        escape : _digitExpr,
                        evaluate : evaluate,
                        interpolate : reInterpolate,
                        variable : "",
                        imports : {
                            _ : exports
                        }
                    };
                    var baseCreate = function() {
                        /**
                         * @return {undefined}
                         */
                        function r() {
                        }
                        return function(o) {
                            if (isObject(o)) {
                                /** @type {!Object} */
                                r.prototype = o;
                                var p = new r;
                                r.prototype = undefined;
                            }
                            return p || {};
                        };
                    }();
                    var done = createBaseEach(baseForOwn);
                    var name = createBaseEach(i, true);
                    var baseFor = createBaseFor();
                    var l = createBaseFor(true);
                    /** @type {!Function} */
                    var baseSetData = path ? function(t, length) {
                        return path.set(t, length), t;
                    } : identity;
                    /** @type {!Function} */
                    var getData = path ? function(url) {
                        return path.get(url);
                    } : runSuite;
                    var getLength = write("length");
                    var setData = function() {
                        /** @type {number} */
                        var num_summed = 0;
                        /** @type {number} */
                        var prevT = 0;
                        return function(func, value) {
                            var currT = now();
                            /** @type {number} */
                            var remaining = wait - (currT - prevT);
                            if (prevT = currT, remaining > 0) {
                                if (++num_summed >= summands) {
                                    return func;
                                }
                            } else {
                                /** @type {number} */
                                num_summed = 0;
                            }
                            return baseSetData(func, value);
                        };
                    }();
                    var difference = require(function(value, array) {
                        return isObjectLike(value) && isArrayLike(value) ? flatten(value, baseFlatten(array, false, true)) : [];
                    });
                    var deleteAll = each();
                    var CreateSBTreeClass = each(true);
                    var intersection = require(function(arrays) {
                        var othLength = arrays.length;
                        var othIndex = othLength;
                        var caches = Array(length);
                        var indexOf = unshift();
                        /** @type {boolean} */
                        var isCommon = indexOf == find;
                        /** @type {!Array} */
                        var result = [];
                        for (; othIndex--;) {
                            var value = arrays[othIndex] = isArrayLike(value = arrays[othIndex]) ? value : [];
                            caches[othIndex] = isCommon && value.length >= 120 ? createCache(othIndex && value) : null;
                        }
                        var array = arrays[0];
                        /** @type {number} */
                        var i = -1;
                        var length = array ? array.length : 0;
                        var seen = caches[0];
                        t: for (; ++i < length;) {
                            if (value = array[i], (seen ? cacheIndexOf(seen, value) : indexOf(result, value, 0)) < 0) {
                                othIndex = othLength;
                                for (; --othIndex;) {
                                    var cache = caches[othIndex];
                                    if ((cache ? cacheIndexOf(cache, value) : indexOf(arrays[othIndex], value, 0)) < 0) {
                                        continue t;
                                    }
                                }
                                if (seen) {
                                    seen.push(value);
                                }
                                result.push(value);
                            }
                        }
                        return result;
                    });
                    var TagHourlyStat = require(function(collection, indexes) {
                        indexes = baseFlatten(indexes);
                        var result = baseAt(collection, indexes);
                        return getPath(collection, indexes.sort(compareAscending)), result;
                    });
                    var sortedIndex = createSortedIndex();
                    var SearchFiles = createSortedIndex(true);
                    var union = require(function(value) {
                        return log(baseFlatten(value, false, true));
                    });
                    var without = require(function(value, key) {
                        return isArrayLike(value) ? flatten(value, key) : [];
                    });
                    var zip = require(unzip);
                    var CheckDailyStat = require(function(args) {
                        var index = args.length;
                        var url = index > 2 ? args[index - 2] : undefined;
                        var filename = index > 1 ? args[index - 1] : undefined;
                        return index > 2 && "function" == typeof url ? index = index - 2 : (url = index > 1 && "function" == typeof filename ? (--index, filename) : undefined, filename = undefined), args.length = index, save(args, url, filename);
                    });
                    var frontEndModuleConfig = require(function(value) {
                        return value = baseFlatten(value), this.thru(function(object) {
                            return serialize(isArray(object) ? object : [toObject(object)], value);
                        });
                    });
                    var index = require(function(array, props) {
                        return baseAt(array, baseFlatten(props));
                    });
                    var rs = clone(function(val, canCreateDiscussions, term) {
                        if (self.call(val, term)) {
                            ++val[term];
                        } else {
                            /** @type {number} */
                            val[term] = 1;
                        }
                    });
                    var detect = parse(done);
                    var os = parse(name, true);
                    var app = loop(forEach, done);
                    var that = loop(invoke, name);
                    var args = clone(function(groups, i, name) {
                        if (self.call(groups, name)) {
                            groups[name].push(i);
                        } else {
                            /** @type {!Array} */
                            groups[name] = [i];
                        }
                    });
                    var currentLineStylesCloned = clone(function(args, withoutSuffix, callbackArgumentIndex) {
                        args[callbackArgumentIndex] = withoutSuffix;
                    });
                    var action = require(function(collection, path, args) {
                        /** @type {number} */
                        var j = -1;
                        /** @type {boolean} */
                        var isFunc = "function" == typeof path;
                        var isProp = next(path);
                        var result = isArrayLike(collection) ? Array(collection.length) : [];
                        return done(collection, function(value) {
                            var func = isFunc ? path : isProp && null != value ? value[path] : undefined;
                            result[++j] = func ? func.apply(value, args) : find(value, path, args);
                        }), result;
                    });
                    var partition = clone(function(t, e, toMark) {
                        t[toMark ? 0 : 1].push(e);
                    }, function() {
                        return [[], []];
                    });
                    var reduce = createContext(update, done);
                    var reduceRight = createContext(read, name);
                    var EffectChain = require(function(t, obj) {
                        if (null == t) {
                            return [];
                        }
                        var val = obj[2];
                        return val && test(obj[0], obj[1], val) && (obj.length = 1), assert(t, baseFlatten(obj), []);
                    });
                    var now = nativeNow || function() {
                        return (new Date).getTime();
                    };
                    var el = require(function(new_tuple, server, data) {
                        /** @type {number} */
                        var bitmask = BIND_FLAG;
                        if (data.length) {
                            var value = callback(data, el.placeholder);
                            /** @type {number} */
                            bitmask = bitmask | PARTIAL_FLAG;
                        }
                        return set(new_tuple, bitmask, server, data, value);
                    });
                    var bindAll = require(function(object, methodNames) {
                        methodNames = methodNames.length ? baseFlatten(methodNames) : functions(object);
                        /** @type {number} */
                        var i = -1;
                        var length = methodNames.length;
                        for (; ++i < length;) {
                            var key = methodNames[i];
                            object[key] = set(object[key], BIND_FLAG, object);
                        }
                        return object;
                    });
                    var settings = require(function(server, new_tuple, data) {
                        /** @type {number} */
                        var bitmask = BIND_FLAG | BIND_KEY_FLAG;
                        if (data.length) {
                            var value = callback(data, settings.placeholder);
                            /** @type {number} */
                            bitmask = bitmask | PARTIAL_FLAG;
                        }
                        return set(new_tuple, bitmask, server, data, value);
                    });
                    var conditional = walk(CURRY_FLAG);
                    var second = walk(block);
                    var defer = require(function(n, e) {
                        return r(n, 1, e);
                    });
                    var delay = require(function(n, e, hash) {
                        return r(n, e, hash);
                    });
                    var flow = createFlow();
                    var compose = createFlow(true);
                    var GenerateGif = require(function(callback, funcs) {
                        if (funcs = baseFlatten(funcs), "function" != typeof callback || !y(funcs, e)) {
                            throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
                        }
                        var length = funcs.length;
                        return require(function(args) {
                            var index = nativeMin(args.length, length);
                            for (; index--;) {
                                args[index] = funcs[index](args[index]);
                            }
                            return callback.apply(this, args);
                        });
                    });
                    var partial = rest(PARTIAL_FLAG);
                    var partialRight = rest(PARTIAL_RIGHT_FLAG);
                    var time = require(function(new_tuple, value) {
                        return set(new_tuple, REARG_FLAG, undefined, undefined, undefined, baseFlatten(value));
                    });
                    var isArray = nativeIsArray || function(obj) {
                        return isObjectLike(obj) && isLength(obj.length) && toString.call(obj) == tag;
                    };
                    var select = load(reset);
                    var ast = load(function(obj, value, args) {
                        return args ? assign(obj, value, args) : baseAssign(obj, value);
                    });
                    var body = createElement(ast, config);
                    var input = createElement(select, id);
                    var findKey = invert(baseForOwn);
                    var coord = invert(i);
                    var o = mixin(baseFor);
                    var data = mixin(l);
                    var forOwn = display(baseForOwn);
                    var $sendIcon = display(i);
                    /** @type {function(?): ?} */
                    var keys = nativeKeys ? function(object) {
                        var data = null == object ? undefined : object.constructor;
                        return "function" == typeof data && data.prototype === object || "function" != typeof object && isArrayLike(object) ? shimKeys(object) : isObject(object) ? nativeKeys(object) : [];
                    } : shimKeys;
                    var mapKeys = createObjectMapper(true);
                    var mapValues = createObjectMapper();
                    var omit = require(function(scope, result) {
                        if (null == scope) {
                            return {};
                        }
                        if ("function" != typeof result[0]) {
                            result = normalize(baseFlatten(result), String);
                            return compile(scope, flatten(keysIn(scope), result));
                        }
                        var res = p(result[0], result[1], 3);
                        return bindKey(scope, function(shortURL, args, body) {
                            return !res(shortURL, args, body);
                        });
                    });
                    var view = require(function(e, args) {
                        return null == e ? {} : "function" == typeof args[0] ? bindKey(e, p(args[0], args[1], 3)) : compile(e, baseFlatten(args));
                    });
                    var promised = req(function(result, word, index) {
                        return word = word.toLowerCase(), result + (index ? word.charAt(0).toUpperCase() + word.slice(1) : word);
                    });
                    var kebabCase = req(function(yuiModule, p_Interval, leadingHyphen) {
                        return yuiModule + (leadingHyphen ? "-" : "") + p_Interval.toLowerCase();
                    });
                    var padLeft = clock();
                    var padRight = clock(true);
                    var snakeCase = req(function(yuiModule, p_Interval, leadingHyphen) {
                        return yuiModule + (leadingHyphen ? "_" : "") + p_Interval.toLowerCase();
                    });
                    var exp = req(function(res, e, after) {
                        return res + (after ? " " : "") + (e.charAt(0).toUpperCase() + e.slice(1));
                    });
                    var attempt = require(function(t, e) {
                        try {
                            return t.apply(undefined, e);
                        } catch (e) {
                            return isError(e) ? e : new Error(e);
                        }
                    });
                    var foo = require(function(ps, type) {
                        return function(value) {
                            return find(value, ps, type);
                        };
                    });
                    var createNil = require(function(value, type) {
                        return function(ps) {
                            return find(value, ps, type);
                        };
                    });
                    var ceil = decimalAdjust("ceil");
                    var local = decimalAdjust("floor");
                    var val = cb(gt, d);
                    var n = cb(max, x);
                    var round = decimalAdjust("round");
                    return exports.prototype = lodash.prototype, LodashWrapper.prototype = baseCreate(lodash.prototype), LodashWrapper.prototype.constructor = LodashWrapper, LazyWrapper.prototype = baseCreate(lodash.prototype), LazyWrapper.prototype.constructor = LazyWrapper, MapCache.prototype["delete"] = hashDelete, MapCache.prototype.get = listCacheGet, MapCache.prototype.has = groupBy, MapCache.prototype.set = mapSet, SetCache.prototype.push = cachePush, memoize.Cache = MapCache, exports.after = after,
                        exports.ary = drop, exports.assign = ast, exports.at = index, exports.before = on, exports.bind = el, exports.bindAll = bindAll, exports.bindKey = settings, exports.callback = noop, exports.chain = chain, exports.chunk = range, exports.compact = compact, exports.constant = constant, exports.countBy = rs, exports.create = url, exports.curry = conditional, exports.curryRight = second, exports.debounce = debounce, exports.defaults = body, exports.defaultsDeep = input, exports.defer = defer,
                        exports.delay = delay, exports.difference = difference, exports.drop = all, exports.dropRight = wrap, exports.dropRightWhile = runScript, exports.dropWhile = compute, exports.fill = color, exports.filter = filter, exports.flatten = concat, exports.flattenDeep = flattenDeep, exports.flow = flow, exports.flowRight = compose, exports.forEach = app, exports.forEachRight = that, exports.forIn = o, exports.forInRight = data, exports.forOwn = forOwn, exports.forOwnRight = $sendIcon, exports.functions =
                        functions, exports.groupBy = args, exports.indexBy = currentLineStylesCloned, exports.initial = initial, exports.intersection = intersection, exports.invert = value, exports.invoke = action, exports.keys = keys, exports.keysIn = keysIn, exports.map = map, exports.mapKeys = mapKeys, exports.mapValues = mapValues, exports.matches = matches, exports.matchesProperty = updateIn, exports.memoize = memoize, exports.merge = select, exports.method = foo, exports.methodOf = createNil, exports.mixin =
                        run, exports.modArgs = GenerateGif, exports.negate = negate, exports.omit = omit, exports.once = once, exports.pairs = pairs, exports.partial = partial, exports.partialRight = partialRight, exports.partition = partition, exports.pick = view, exports.pluck = pluck, exports.property = bind, exports.propertyOf = html, exports.pull = uniq, exports.pullAt = TagHourlyStat, exports.range = baseRange, exports.rearg = time, exports.reject = then, exports.remove = remove, exports.rest = tail, exports.restParam =
                        require, exports.set = api, exports.shuffle = shuffle, exports.slice = formatNumber, exports.sortBy = process, exports.sortByAll = EffectChain, exports.sortByOrder = at, exports.spread = spread, exports.take = first, exports.takeRight = Event, exports.takeRightWhile = Page, exports.takeWhile = abort, exports.tap = tap, exports.throttle = throttle, exports.thru = isProperty, exports.times = times, exports.toArray = toArray, exports.toPlainObject = toPlainObject, exports.transform = create,
                        exports.union = union, exports.uniq = match, exports.unzip = unzip, exports.unzipWith = save, exports.values = values, exports.valuesIn = toPairsIn, exports.where = obj, exports.without = without, exports.wrap = last, exports.xor = reducer, exports.zip = zip, exports.zipObject = zipObject, exports.zipWith = CheckDailyStat, exports.backflow = compose, exports.collect = map, exports.compose = compose, exports.each = app, exports.eachRight = that, exports.extend = ast, exports.iteratee = noop,
                        exports.methods = functions, exports.object = zipObject, exports.select = filter, exports.tail = tail, exports.unique = match, run(exports, exports), exports.add = fun, exports.attempt = attempt, exports.camelCase = promised, exports.capitalize = capitalize, exports.ceil = ceil, exports.clone = cycle, exports.cloneDeep = cloneDeep, exports.deburr = reject, exports.endsWith = endsWith, exports.escape = escape, exports.escapeRegExp = escapeRegExp, exports.every = every, exports.find = detect,
                        exports.findIndex = deleteAll, exports.findKey = findKey, exports.findLast = os, exports.findLastIndex = CreateSBTreeClass, exports.findLastKey = coord, exports.findWhere = getSelection, exports.first = head, exports.floor = local, exports.get = getter, exports.gt = gt, exports.gte = min, exports.has = has, exports.identity = identity, exports.includes = contains, exports.indexOf = indexOf, exports.inRange = inRange, exports.isArguments = isArguments, exports.isArray = isArray, exports.isBoolean =
                        isBoolean, exports.isDate = isDate, exports.isElement = isElement, exports.isEmpty = isEmpty, exports.isEqual = isEqual, exports.isError = isError, exports.isFinite = isFinite, exports.isFunction = isFunction, exports.isMatch = start, exports.isNaN = eq, exports.isNative = isNative, exports.isNull = isNull, exports.isNumber = getType, exports.isObject = isObject, exports.isPlainObject = isPlainObject, exports.isRegExp = isRegExp, exports.isString = isNumber, exports.isTypedArray = isString,
                        exports.isUndefined = isUndefined, exports.kebabCase = kebabCase, exports.last = replace, exports.lastIndexOf = lastIndexOf, exports.lt = max, exports.lte = lte, exports.max = val, exports.min = n, exports.noConflict = noConflict, exports.noop = runSuite, exports.now = now, exports.pad = pad, exports.padLeft = padLeft, exports.padRight = padRight, exports.parseInt = checkCall, exports.random = random, exports.reduce = reduce, exports.reduceRight = reduceRight, exports.repeat = repeat, exports.result =
                        t, exports.round = round, exports.runInContext = runInContext, exports.size = size, exports.snakeCase = snakeCase, exports.some = some, exports.sortedIndex = sortedIndex, exports.sortedLastIndex = SearchFiles, exports.startCase = exp, exports.startsWith = startsWith, exports.sum = e, exports.template = template, exports.trim = split, exports.trimLeft = w, exports.trimRight = compare, exports.trunc = truncate, exports.unescape = unescape, exports.uniqueId = uniqueId, exports.words = result,
                        exports.all = every, exports.any = some, exports.contains = contains, exports.eq = isEqual, exports.detect = detect, exports.foldl = reduce, exports.foldr = reduceRight, exports.head = head, exports.include = contains, exports.inject = reduce, run(exports, function() {
                        var iterationSpace = {};
                        return baseForOwn(exports, function(len, i) {
                            if (!exports.prototype[i]) {
                                iterationSpace[i] = len;
                            }
                        }), iterationSpace;
                    }(), false), exports.sample = resolve, exports.prototype.sample = function(c) {
                        return this.__chain__ || null != c ? this.thru(function(e) {
                            return resolve(e, c);
                        }) : resolve(this.value());
                    }, exports.VERSION = VERSION, forEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(name) {
                        /** @type {function(!Function): ?} */
                        exports[name].placeholder = exports;
                    }), forEach(["drop", "take"], function(methodName, no_secondary) {
                        /**
                         * @param {number} n
                         * @return {?}
                         */
                        LazyWrapper.prototype[methodName] = function(n) {
                            var inputData = this.__filtered__;
                            if (inputData && !no_secondary) {
                                return new LazyWrapper(this);
                            }
                            n = null == n ? 1 : nativeMax(floor(n) || 0, 0);
                            var result = this.clone();
                            return inputData ? result.__takeCount__ = nativeMin(result.__takeCount__, n) : result.__views__.push({
                                size : n,
                                type : methodName + (result.__dir__ < 0 ? "Right" : "")
                            }), result;
                        };
                        /**
                         * @param {?} args
                         * @return {?}
                         */
                        LazyWrapper.prototype[methodName + "Right"] = function(args) {
                            return this.reverse()[methodName](args).reverse();
                        };
                    }), forEach(["filter", "map", "takeWhile"], function(methodName, audio) {
                        var type = audio + 1;
                        /** @type {boolean} */
                        var isFilter = type != Refurbishment;
                        /**
                         * @param {string} iteratee
                         * @param {?} then
                         * @return {?}
                         */
                        LazyWrapper.prototype[methodName] = function(iteratee, then) {
                            var result = this.clone();
                            return result.__iteratees__.push({
                                iteratee : apply(iteratee, then, 1),
                                type : type
                            }), result.__filtered__ = result.__filtered__ || isFilter, result;
                        };
                    }), forEach(["first", "last"], function(methodName, index) {
                        /** @type {string} */
                        var takeName = "take" + (index ? "Right" : "");
                        /**
                         * @return {?}
                         */
                        LazyWrapper.prototype[methodName] = function() {
                            return this[takeName](1).value()[0];
                        };
                    }), forEach(["initial", "rest"], function(methodName, index) {
                        /** @type {string} */
                        var dropName = "drop" + (index ? "" : "Right");
                        /**
                         * @return {?}
                         */
                        LazyWrapper.prototype[methodName] = function() {
                            return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
                        };
                    }), forEach(["pluck", "where"], function(methodName, match) {
                        /** @type {string} */
                        var type = match ? "filter" : "map";
                        /** @type {function(!Object): ?} */
                        var getType = match ? equal : bind;
                        /**
                         * @param {undefined} url
                         * @return {?}
                         */
                        LazyWrapper.prototype[methodName] = function(url) {
                            return this[type](getType(url));
                        };
                    }), LazyWrapper.prototype.compact = function() {
                        return this.filter(identity);
                    }, LazyWrapper.prototype.reject = function(callback, args) {
                        return callback = apply(callback, args, 1), this.filter(function(identifierPositions) {
                            return !callback(identifierPositions);
                        });
                    }, LazyWrapper.prototype.slice = function(start, end) {
                        /** @type {number} */
                        start = null == start ? 0 : +start || 0;
                        var result = this;
                        return result.__filtered__ && (start > 0 || end < 0) ? new LazyWrapper(result) : (start < 0 ? result = result.takeRight(-start) : start && (result = result.drop(start)), end !== undefined && (end = +end || 0, result = end < 0 ? result.dropRight(-end) : result.take(end - start)), result);
                    }, LazyWrapper.prototype.takeRightWhile = function(array, n) {
                        return this.reverse().takeWhile(array, n).reverse();
                    }, LazyWrapper.prototype.toArray = function() {
                        return this.take(x);
                    }, baseForOwn(LazyWrapper.prototype, function(t, i) {
                        /** @type {boolean} */
                        var freeModule = /^(?:filter|map|reject)|While$/.test(i);
                        /** @type {boolean} */
                        var key = /^(?:first|last)$/.test(i);
                        var method = exports[key ? "take" + ("last" == i ? "Right" : "") : i];
                        if (method) {
                            /**
                             * @return {?}
                             */
                            exports.prototype[i] = function() {
                                /** @type {(Arguments|Array)} */
                                var values = key ? [1] : arguments;
                                var chainAll = this.__chain__;
                                var value = this.__wrapped__;
                                /** @type {boolean} */
                                var isJSRequested = !!this.__actions__.length;
                                /** @type {boolean} */
                                var isLazy = value instanceof LazyWrapper;
                                var a = values[0];
                                var useLazy = isLazy || isArray(value);
                                if (useLazy && freeModule && "function" == typeof a && 1 != a.length) {
                                    /** @type {boolean} */
                                    isLazy = useLazy = false;
                                }
                                /**
                                 * @param {?} a
                                 * @return {?}
                                 */
                                var request = function(a) {
                                    return key && chainAll ? method(a, 1)[0] : method.apply(undefined, fn([a], values));
                                };
                                var event = {
                                    func : isProperty,
                                    args : [request],
                                    thisArg : undefined
                                };
                                /** @type {boolean} */
                                var onlyLazy = isLazy && !isJSRequested;
                                if (key && !chainAll) {
                                    return onlyLazy ? (value = value.clone(), value.__actions__.push(event), t.call(value)) : method.call(undefined, this.value())[0];
                                }
                                if (!key && useLazy) {
                                    value = onlyLazy ? value : new LazyWrapper(this);
                                    var result = t.apply(value, values);
                                    return result.__actions__.push(event), new LodashWrapper(result, chainAll);
                                }
                                return this.thru(request);
                            };
                        }
                    }), forEach(["join", "pop", "push", "replace", "shift", "sort", "splice", "split", "unshift"], function(methodName) {
                        var func = (/^(?:replace|split)$/.test(methodName) ? StringProto : arrayProto)[methodName];
                        /** @type {string} */
                        var chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru";
                        /** @type {boolean} */
                        var retUnwrapped = /^(?:join|pop|replace|shift)$/.test(methodName);
                        /**
                         * @return {?}
                         */
                        exports.prototype[methodName] = function() {
                            /** @type {!Arguments} */
                            var arg = arguments;
                            return retUnwrapped && !this.__chain__ ? func.apply(this.value(), arg) : this[chainName](function(context) {
                                return func.apply(context, arg);
                            });
                        };
                    }), baseForOwn(LazyWrapper.prototype, function(canCreateDiscussions, methodName) {
                        var method = exports[methodName];
                        if (method) {
                            var name = method.name;
                            var watch = info[name] || (info[name] = []);
                            watch.push({
                                name : methodName,
                                func : method
                            });
                        }
                    }), info[createWrapper(undefined, BIND_KEY_FLAG).name] = [{
                        name : "wrapper",
                        func : undefined
                    }], LazyWrapper.prototype.clone = lazyClone, LazyWrapper.prototype.reverse = lazyReverse, LazyWrapper.prototype.value = lazyValue, exports.prototype.chain = wrapperChain, exports.prototype.commit = lodashWrapper, exports.prototype.concat = frontEndModuleConfig, exports.prototype.plant = wrapperPlant, exports.prototype.reverse = wrapperReverse, exports.prototype.toString = toStringBench, exports.prototype.run = exports.prototype.toJSON = exports.prototype.valueOf = exports.prototype.value =
                        wrapperValue, exports.prototype.collect = exports.prototype.map, exports.prototype.head = exports.prototype.first, exports.prototype.select = exports.prototype.filter, exports.prototype.tail = exports.prototype.rest, exports;
                }
                var undefined;
                /** @type {string} */
                var VERSION = "3.10.1";
                /** @type {number} */
                var BIND_FLAG = 1;
                /** @type {number} */
                var BIND_KEY_FLAG = 2;
                /** @type {number} */
                var CURRY_BOUND_FLAG = 4;
                /** @type {number} */
                var CURRY_FLAG = 8;
                /** @type {number} */
                var block = 16;
                /** @type {number} */
                var PARTIAL_FLAG = 32;
                /** @type {number} */
                var PARTIAL_RIGHT_FLAG = 64;
                /** @type {number} */
                var ARY_FLAG = 128;
                /** @type {number} */
                var REARG_FLAG = 256;
                /** @type {number} */
                var groupSize = 30;
                /** @type {string} */
                var DEFAULT_TRUNC_OMISSION = "...";
                /** @type {number} */
                var summands = 150;
                /** @type {number} */
                var wait = 16;
                /** @type {number} */
                var LARGE_ARRAY_SIZE = 200;
                /** @type {number} */
                var userData = 1;
                /** @type {number} */
                var Refurbishment = 2;
                /** @type {string} */
                var ERR_ACCESSORS_NOT_SUPPORTED = "Expected a function";
                /** @type {string} */
                var length = "__lodash_placeholder__";
                /** @type {string} */
                var hr = "[object Arguments]";
                /** @type {string} */
                var tag = "[object Array]";
                /** @type {string} */
                var arrayBufferTag = "[object Boolean]";
                /** @type {string} */
                var boolTag = "[object Date]";
                /** @type {string} */
                var dateTag = "[object Error]";
                /** @type {string} */
                var funcTag = "[object Function]";
                /** @type {string} */
                var funcTag$2 = "[object Map]";
                /** @type {string} */
                var numberTag = "[object Number]";
                /** @type {string} */
                var type = "[object Object]";
                /** @type {string} */
                var regexpTag = "[object RegExp]";
                /** @type {string} */
                var float64Tag$1 = "[object Set]";
                /** @type {string} */
                var stringTag = "[object String]";
                /** @type {string} */
                var int16Tag = "[object WeakMap]";
                /** @type {string} */
                var dataViewTag = "[object ArrayBuffer]";
                /** @type {string} */
                var float32Tag = "[object Float32Array]";
                /** @type {string} */
                var float32Tag$1 = "[object Float64Array]";
                /** @type {string} */
                var float64Tag = "[object Int8Array]";
                /** @type {string} */
                var int8Tag = "[object Int16Array]";
                /** @type {string} */
                var int32Tag = "[object Int32Array]";
                /** @type {string} */
                var uint8Tag = "[object Uint8Array]";
                /** @type {string} */
                var uint8ClampedTag = "[object Uint8ClampedArray]";
                /** @type {string} */
                var uint16Tag = "[object Uint16Array]";
                /** @type {string} */
                var uint32Tag = "[object Uint32Array]";
                /** @type {!RegExp} */
                var regRelative = /\b__p \+= '';/g;
                /** @type {!RegExp} */
                var formattingRemoveEscapes = /\b(__p \+=) '' \+/g;
                /** @type {!RegExp} */
                var _RE_DOT = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
                /** @type {!RegExp} */
                var reg = /&(?:amp|lt|gt|quot|#39|#96);/g;
                /** @type {!RegExp} */
                var reUnescapedHtml = /[&<>"'`]/g;
                /** @type {!RegExp} */
                var black = RegExp(reg.source);
                /** @type {!RegExp} */
                var r = RegExp(reUnescapedHtml.source);
                /** @type {!RegExp} */
                var _digitExpr = /<%-([\s\S]+?)%>/g;
                /** @type {!RegExp} */
                var evaluate = /<%([\s\S]+?)%>/g;
                /** @type {!RegExp} */
                var reInterpolate = /<%=([\s\S]+?)%>/g;
                /** @type {!RegExp} */
                var matchYearMonthDay = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/;
                /** @type {!RegExp} */
                var matchYearMonth = /^\w*$/;
                /** @type {!RegExp} */
                var reNewLines = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
                /** @type {!RegExp} */
                var reRegExpChars = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g;
                /** @type {!RegExp} */
                var reHasEscapedHtml = RegExp(reRegExpChars.source);
                /** @type {!RegExp} */
                var regex = /[\u0300-\u036f\ufe20-\ufe23]/g;
                /** @type {!RegExp} */
                var reEscapeChar = /\\(\\)?/g;
                /** @type {!RegExp} */
                var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
                /** @type {!RegExp} */
                var reFlags = /\w*$/;
                /** @type {!RegExp} */
                var testRxp = /^0[xX]/;
                /** @type {!RegExp} */
                var trueRE = /^\[object .+?Constructor\]$/;
                /** @type {!RegExp} */
                var contribRegex = /^\d+$/;
                /** @type {!RegExp} */
                var rbreakright = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;
                /** @type {!RegExp} */
                var reNoMatch = /($^)/;
                /** @type {!RegExp} */
                var a = /['\n\r\u2028\u2029\\]/g;
                var name = function() {
                    /** @type {string} */
                    var f = "[A-Z\\xc0-\\xd6\\xd8-\\xde]";
                    /** @type {string} */
                    var e = "[a-z\\xdf-\\xf6\\xf8-\\xff]+";
                    return RegExp(f + "+(?=" + f + e + ")|" + f + "?" + e + "|" + f + "+|[0-9]+", "g");
                }();
                /** @type {!Array} */
                var contextProps = ["Array", "ArrayBuffer", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Math", "Number", "Object", "RegExp", "Set", "String", "_", "clearTimeout", "isFinite", "parseFloat", "parseInt", "setTimeout", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap"];
                /** @type {number} */
                var zt = -1;
                var typedArrayTags = {};
                /** @type {boolean} */
                typedArrayTags[float32Tag] = typedArrayTags[float32Tag$1] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
                /** @type {boolean} */
                typedArrayTags[hr] = typedArrayTags[tag] = typedArrayTags[dataViewTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dateTag] = typedArrayTags[funcTag] = typedArrayTags[funcTag$2] = typedArrayTags[numberTag] = typedArrayTags[type] = typedArrayTags[regexpTag] = typedArrayTags[float64Tag$1] = typedArrayTags[stringTag] = typedArrayTags[int16Tag] = false;
                var cloneableTags = {};
                /** @type {boolean} */
                cloneableTags[hr] = cloneableTags[tag] = cloneableTags[dataViewTag] = cloneableTags[arrayBufferTag] = cloneableTags[boolTag] = cloneableTags[float32Tag] = cloneableTags[float32Tag$1] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int32Tag] = cloneableTags[numberTag] = cloneableTags[type] = cloneableTags[regexpTag] = cloneableTags[stringTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
                /** @type {boolean} */
                cloneableTags[dateTag] = cloneableTags[funcTag] = cloneableTags[funcTag$2] = cloneableTags[float64Tag$1] = cloneableTags[int16Tag] = false;
                var deletedHashes = {
                    "\u00c0" : "A",
                    "\u00c1" : "A",
                    "\u00c2" : "A",
                    "\u00c3" : "A",
                    "\u00c4" : "A",
                    "\u00c5" : "A",
                    "\u00e0" : "a",
                    "\u00e1" : "a",
                    "\u00e2" : "a",
                    "\u00e3" : "a",
                    "\u00e4" : "a",
                    "\u00e5" : "a",
                    "\u00c7" : "C",
                    "\u00e7" : "c",
                    "\u00d0" : "D",
                    "\u00f0" : "d",
                    "\u00c8" : "E",
                    "\u00c9" : "E",
                    "\u00ca" : "E",
                    "\u00cb" : "E",
                    "\u00e8" : "e",
                    "\u00e9" : "e",
                    "\u00ea" : "e",
                    "\u00eb" : "e",
                    "\u00cc" : "I",
                    "\u00cd" : "I",
                    "\u00ce" : "I",
                    "\u00cf" : "I",
                    "\u00ec" : "i",
                    "\u00ed" : "i",
                    "\u00ee" : "i",
                    "\u00ef" : "i",
                    "\u00d1" : "N",
                    "\u00f1" : "n",
                    "\u00d2" : "O",
                    "\u00d3" : "O",
                    "\u00d4" : "O",
                    "\u00d5" : "O",
                    "\u00d6" : "O",
                    "\u00d8" : "O",
                    "\u00f2" : "o",
                    "\u00f3" : "o",
                    "\u00f4" : "o",
                    "\u00f5" : "o",
                    "\u00f6" : "o",
                    "\u00f8" : "o",
                    "\u00d9" : "U",
                    "\u00da" : "U",
                    "\u00db" : "U",
                    "\u00dc" : "U",
                    "\u00f9" : "u",
                    "\u00fa" : "u",
                    "\u00fb" : "u",
                    "\u00fc" : "u",
                    "\u00dd" : "Y",
                    "\u00fd" : "y",
                    "\u00ff" : "y",
                    "\u00c6" : "Ae",
                    "\u00e6" : "ae",
                    "\u00de" : "Th",
                    "\u00fe" : "th",
                    "\u00df" : "ss"
                };
                var traitsChosen = {
                    "&" : "&amp;",
                    "<" : "&lt;",
                    ">" : "&gt;",
                    '"' : "&quot;",
                    "'" : "&#39;",
                    "`" : "&#96;"
                };
                var hooksByComponent = {
                    "&amp;" : "&",
                    "&lt;" : "<",
                    "&gt;" : ">",
                    "&quot;" : '"',
                    "&#39;" : "'",
                    "&#96;" : "`"
                };
                var objectTypes = {
                    "function" : true,
                    object : true
                };
                var CHAR_MAP = {
                    0 : "x30",
                    1 : "x31",
                    2 : "x32",
                    3 : "x33",
                    4 : "x34",
                    5 : "x35",
                    6 : "x36",
                    7 : "x37",
                    8 : "x38",
                    9 : "x39",
                    A : "x41",
                    B : "x42",
                    C : "x43",
                    D : "x44",
                    E : "x45",
                    F : "x46",
                    a : "x61",
                    b : "x62",
                    c : "x63",
                    d : "x64",
                    e : "x65",
                    f : "x66",
                    n : "x6e",
                    r : "x72",
                    t : "x74",
                    u : "x75",
                    v : "x76",
                    x : "x78"
                };
                var transformed_points = {
                    "\\" : "\\",
                    "'" : "'",
                    "\n" : "n",
                    "\r" : "r",
                    "\u2028" : "u2028",
                    "\u2029" : "u2029"
                };
                var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
                var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
                var freeGlobal = freeExports && freeModule && "object" == typeof value && value && value.Object && value;
                var freeSelf = objectTypes[typeof self] && self && self.Object && self;
                var freeWindow = objectTypes[typeof window] && window && window.Object && window;
                var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
                var root = freeGlobal || freeWindow !== (this && this.window) && freeWindow || freeSelf || this;
                var _ = runInContext();
                if ("function" == typeof define && "object" == typeof define.amd && define.amd) {
                    root._ = _;
                    define(function() {
                        return _;
                    });
                } else {
                    if (freeExports && freeModule) {
                        if (moduleExports) {
                            (freeModule.exports = _)._ = _;
                        } else {
                            freeExports._ = _;
                        }
                    } else {
                        root._ = _;
                    }
                }
            }).call(this);
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}],
    35 : [function($, module, n) {
        var tickZoom = $("36");
        var updateSynchronously = $("38");
        var hpaDasUrl = $("41");
        var YQLError = $("40");
        var s = $("39");
        var c = $("37");
        var self = $("42");
        self.alea = tickZoom;
        self.xor128 = updateSynchronously;
        self.xorwow = hpaDasUrl;
        self.xorshift7 = YQLError;
        self.xor4096 = s;
        self.tychei = c;
        module.exports = self;
    }, {
        36 : 36,
        37 : 37,
        38 : 38,
        39 : 39,
        40 : 40,
        41 : 41,
        42 : 42
    }],
    36 : [function(canCreateDiscussions, exports, n) {
        !function(EMSarray, module, define) {
            /**
             * @param {?} seed
             * @return {undefined}
             */
            function Alea(seed) {
                var me = this;
                var mash = Mash();
                /**
                 * @return {?}
                 */
                me.next = function() {
                    /** @type {number} */
                    var t = 2091639 * me.s0 + 2.3283064365386963E-10 * me.c;
                    return me.s0 = me.s1, me.s1 = me.s2, me.s2 = t - (me.c = 0 | t);
                };
                /** @type {number} */
                me.c = 1;
                me.s0 = mash(" ");
                me.s1 = mash(" ");
                me.s2 = mash(" ");
                me.s0 -= mash(seed);
                if (me.s0 < 0) {
                    me.s0 += 1;
                }
                me.s1 -= mash(seed);
                if (me.s1 < 0) {
                    me.s1 += 1;
                }
                me.s2 -= mash(seed);
                if (me.s2 < 0) {
                    me.s2 += 1;
                }
                /** @type {null} */
                mash = null;
            }
            /**
             * @param {!Object} f
             * @param {!Object} t
             * @return {?}
             */
            function copy(f, t) {
                return t.c = f.c, t.s0 = f.s0, t.s1 = f.s1, t.s2 = f.s2, t;
            }
            /**
             * @param {!Function} obj
             * @param {!Object} data
             * @return {?}
             */
            function impl(obj, data) {
                var xg = new Alea(obj);
                var src = data && data.state;
                var prng = xg.next;
                return prng.int32 = function() {
                    return 4294967296 * xg.next() | 0;
                }, prng["double"] = function() {
                    return prng() + 1.1102230246251565E-16 * (2097152 * prng() | 0);
                }, prng.quick = prng, src && ("object" == typeof src && copy(src, xg), prng.state = function() {
                    return copy(xg, {});
                }), prng;
            }
            /**
             * @return {?}
             */
            function Mash() {
                /** @type {number} */
                var t = 4022871197;
                /**
                 * @param {string} data
                 * @return {?}
                 */
                var mash = function(data) {
                    data = data.toString();
                    /** @type {number} */
                    var i = 0;
                    for (; i < data.length; i++) {
                        t = t + data.charCodeAt(i);
                        /** @type {number} */
                        var x = .02519603282416938 * t;
                        /** @type {number} */
                        t = x >>> 0;
                        /** @type {number} */
                        x = x - t;
                        /** @type {number} */
                        x = x * t;
                        /** @type {number} */
                        t = x >>> 0;
                        /** @type {number} */
                        x = x - t;
                        /** @type {number} */
                        t = t + 4294967296 * x;
                    }
                    return 2.3283064365386963E-10 * (t >>> 0);
                };
                return mash;
            }
            if (module && module.exports) {
                /** @type {function(!Function, !Object): ?} */
                module.exports = impl;
            } else {
                if (define && define.amd) {
                    define(function() {
                        return impl;
                    });
                } else {
                    /** @type {function(!Function, !Object): ?} */
                    this.alea = impl;
                }
            }
        }(this, "object" == typeof exports && exports, "function" == typeof define && define);
    }, {}],
    37 : [function(canCreateDiscussions, exports, n) {
        !function(EMSarray, module, define) {
            /**
             * @param {number} seed
             * @return {undefined}
             */
            function XorGen(seed) {
                var me = this;
                /** @type {string} */
                var string = "";
                /**
                 * @return {?}
                 */
                me.next = function() {
                    var b = me.b;
                    var c = me.c;
                    var d = me.d;
                    var a = me.a;
                    return b = b << 25 ^ b >>> 7 ^ c, c = c - d | 0, d = d << 24 ^ d >>> 8 ^ a, a = a - b | 0, me.b = b = b << 20 ^ b >>> 12 ^ c, me.c = c = c - d | 0, me.d = d << 16 ^ c >>> 16 ^ a, me.a = a - b | 0;
                };
                /** @type {number} */
                me.a = 0;
                /** @type {number} */
                me.b = 0;
                /** @type {number} */
                me.c = -1640531527;
                /** @type {number} */
                me.d = 1367130551;
                if (seed === Math.floor(seed)) {
                    /** @type {number} */
                    me.a = seed / 4294967296 | 0;
                    /** @type {number} */
                    me.b = 0 | seed;
                } else {
                    /** @type {string} */
                    string = string + seed;
                }
                /** @type {number} */
                var n = 0;
                for (; n < string.length + 20; n++) {
                    me.b ^= 0 | string.charCodeAt(n);
                    me.next();
                }
            }
            /**
             * @param {!Object} f
             * @param {!Object} t
             * @return {?}
             */
            function copy(f, t) {
                return t.a = f.a, t.b = f.b, t.c = f.c, t.d = f.d, t;
            }
            /**
             * @param {!Function} obj
             * @param {!Object} data
             * @return {?}
             */
            function impl(obj, data) {
                var xg = new XorGen(obj);
                var src = data && data.state;
                /**
                 * @return {?}
                 */
                var prng = function() {
                    return (xg.next() >>> 0) / 4294967296;
                };
                return prng["double"] = function() {
                    do {
                        /** @type {number} */
                        var t = xg.next() >>> 11;
                        /** @type {number} */
                        var GearType = (xg.next() >>> 0) / 4294967296;
                        /** @type {number} */
                        var r = (t + GearType) / (1 << 21);
                    } while (0 === r);
                    return r;
                }, prng.int32 = xg.next, prng.quick = prng, src && ("object" == typeof src && copy(src, xg), prng.state = function() {
                    return copy(xg, {});
                }), prng;
            }
            if (module && module.exports) {
                /** @type {function(!Function, !Object): ?} */
                module.exports = impl;
            } else {
                if (define && define.amd) {
                    define(function() {
                        return impl;
                    });
                } else {
                    /** @type {function(!Function, !Object): ?} */
                    this.tychei = impl;
                }
            }
        }(this, "object" == typeof exports && exports, "function" == typeof define && define);
    }, {}],
    38 : [function(canCreateDiscussions, exports, n) {
        !function(EMSarray, module, define) {
            /**
             * @param {number} seed
             * @return {undefined}
             */
            function XorGen(seed) {
                var me = this;
                /** @type {string} */
                var string = "";
                /** @type {number} */
                me.x = 0;
                /** @type {number} */
                me.y = 0;
                /** @type {number} */
                me.z = 0;
                /** @type {number} */
                me.w = 0;
                /**
                 * @return {?}
                 */
                me.next = function() {
                    /** @type {number} */
                    var t = me.x ^ me.x << 11;
                    return me.x = me.y, me.y = me.z, me.z = me.w, me.w ^= me.w >>> 19 ^ t ^ t >>> 8;
                };
                if (seed === (0 | seed)) {
                    /** @type {number} */
                    me.x = seed;
                } else {
                    /** @type {string} */
                    string = string + seed;
                }
                /** @type {number} */
                var n = 0;
                for (; n < string.length + 64; n++) {
                    me.x ^= 0 | string.charCodeAt(n);
                    me.next();
                }
            }
            /**
             * @param {!Object} f
             * @param {!Object} t
             * @return {?}
             */
            function copy(f, t) {
                return t.x = f.x, t.y = f.y, t.z = f.z, t.w = f.w, t;
            }
            /**
             * @param {!Function} obj
             * @param {!Object} data
             * @return {?}
             */
            function impl(obj, data) {
                var xg = new XorGen(obj);
                var src = data && data.state;
                /**
                 * @return {?}
                 */
                var prng = function() {
                    return (xg.next() >>> 0) / 4294967296;
                };
                return prng["double"] = function() {
                    do {
                        /** @type {number} */
                        var t = xg.next() >>> 11;
                        /** @type {number} */
                        var GearType = (xg.next() >>> 0) / 4294967296;
                        /** @type {number} */
                        var r = (t + GearType) / (1 << 21);
                    } while (0 === r);
                    return r;
                }, prng.int32 = xg.next, prng.quick = prng, src && ("object" == typeof src && copy(src, xg), prng.state = function() {
                    return copy(xg, {});
                }), prng;
            }
            if (module && module.exports) {
                /** @type {function(!Function, !Object): ?} */
                module.exports = impl;
            } else {
                if (define && define.amd) {
                    define(function() {
                        return impl;
                    });
                } else {
                    /** @type {function(!Function, !Object): ?} */
                    this.xor128 = impl;
                }
            }
        }(this, "object" == typeof exports && exports, "function" == typeof define && define);
    }, {}],
    39 : [function(canCreateDiscussions, exports, n) {
        !function(EMSarray, module, define) {
            /**
             * @param {!Object} statusData
             * @return {undefined}
             */
            function XorGen(statusData) {
                /**
                 * @param {!Object} t
                 * @param {!Object} data
                 * @return {undefined}
                 */
                function next(t, data) {
                    var key;
                    var value;
                    var i;
                    var off;
                    var a;
                    /** @type {!Array} */
                    var array = [];
                    /** @type {number} */
                    var last = 128;
                    if (data === (0 | data)) {
                        /** @type {!Object} */
                        value = data;
                        /** @type {null} */
                        data = null;
                    } else {
                        /** @type {string} */
                        data = data + "\x00";
                        /** @type {number} */
                        value = 0;
                        /** @type {number} */
                        last = Math.max(last, data.length);
                    }
                    /** @type {number} */
                    i = 0;
                    /** @type {number} */
                    off = -32;
                    for (; off < last; ++off) {
                        if (data) {
                            /** @type {number} */
                            value = value ^ data.charCodeAt((off + 32) % data.length);
                        }
                        if (0 === off) {
                            a = value;
                        }
                        /** @type {number} */
                        value = value ^ value << 10;
                        /** @type {number} */
                        value = value ^ value >>> 15;
                        /** @type {number} */
                        value = value ^ value << 4;
                        /** @type {number} */
                        value = value ^ value >>> 13;
                        if (off >= 0) {
                            /** @type {number} */
                            a = a + 1640531527 | 0;
                            /** @type {number} */
                            key = array[127 & off] ^= value + a;
                            /** @type {number} */
                            i = 0 == key ? i + 1 : 0;
                        }
                    }
                    if (i >= 128) {
                        /** @type {number} */
                        array[127 & (data && data.length || 0)] = -1;
                    }
                    /** @type {number} */
                    i = 127;
                    /** @type {number} */
                    off = 512;
                    for (; off > 0; --off) {
                        value = array[i + 34 & 127];
                        key = array[i = i + 1 & 127];
                        /** @type {number} */
                        value = value ^ value << 13;
                        /** @type {number} */
                        key = key ^ key << 17;
                        /** @type {number} */
                        value = value ^ value >>> 15;
                        /** @type {number} */
                        key = key ^ key >>> 12;
                        /** @type {number} */
                        array[i] = value ^ key;
                    }
                    /** @type {(number|undefined)} */
                    t.w = a;
                    /** @type {!Array} */
                    t.X = array;
                    /** @type {number} */
                    t.i = i;
                }
                var that = this;
                /**
                 * @return {?}
                 */
                that.next = function() {
                    var g;
                    var k;
                    var width = that.w;
                    var a = that.X;
                    var i = that.i;
                    return that.w = width = width + 1640531527 | 0, k = a[i + 34 & 127], g = a[i = i + 1 & 127], k = k ^ k << 13, g = g ^ g << 17, k = k ^ k >>> 15, g = g ^ g >>> 12, k = a[i] = k ^ g, that.i = i, k + (width ^ width >>> 16) | 0;
                };
                next(that, statusData);
            }
            /**
             * @param {!Object} f
             * @param {!Object} t
             * @return {?}
             */
            function copy(f, t) {
                return t.i = f.i, t.w = f.w, t.X = f.X.slice(), t;
            }
            /**
             * @param {string} obj
             * @param {!Object} data
             * @return {?}
             */
            function impl(obj, data) {
                if (null == obj) {
                    /** @type {number} */
                    obj = +new Date;
                }
                var xg = new XorGen(obj);
                var value = data && data.state;
                /**
                 * @return {?}
                 */
                var prng = function() {
                    return (xg.next() >>> 0) / 4294967296;
                };
                return prng["double"] = function() {
                    do {
                        /** @type {number} */
                        var t = xg.next() >>> 11;
                        /** @type {number} */
                        var GearType = (xg.next() >>> 0) / 4294967296;
                        /** @type {number} */
                        var r = (t + GearType) / (1 << 21);
                    } while (0 === r);
                    return r;
                }, prng.int32 = xg.next, prng.quick = prng, value && (value.X && copy(value, xg), prng.state = function() {
                    return copy(xg, {});
                }), prng;
            }
            if (module && module.exports) {
                /** @type {function(string, !Object): ?} */
                module.exports = impl;
            } else {
                if (define && define.amd) {
                    define(function() {
                        return impl;
                    });
                } else {
                    /** @type {function(string, !Object): ?} */
                    this.xor4096 = impl;
                }
            }
        }(this, "object" == typeof exports && exports, "function" == typeof define && define);
    }, {}],
    40 : [function(canCreateDiscussions, exports, n) {
        !function(EMSarray, module, define) {
            /**
             * @param {undefined} seed
             * @return {undefined}
             */
            function XorGen(seed) {
                /**
                 * @param {!Object} p
                 * @param {number} val
                 * @return {undefined}
                 */
                function next(p, val) {
                    var i;
                    var currentContext;
                    /** @type {!Array} */
                    var data = [];
                    if (val === (0 | val)) {
                        currentContext = data[0] = val;
                    } else {
                        /** @type {string} */
                        val = "" + val;
                        /** @type {number} */
                        i = 0;
                        for (; i < val.length; ++i) {
                            /** @type {number} */
                            data[7 & i] = data[7 & i] << 15 ^ val.charCodeAt(i) + data[i + 1 & 7] << 13;
                        }
                    }
                    for (; data.length < 8;) {
                        data.push(0);
                    }
                    /** @type {number} */
                    i = 0;
                    for (; i < 8 && 0 === data[i]; ++i) {
                    }
                    currentContext = 8 == i ? data[7] = -1 : data[i];
                    /** @type {!Array} */
                    p.x = data;
                    /** @type {number} */
                    p.i = 0;
                    /** @type {number} */
                    i = 256;
                    for (; i > 0; --i) {
                        p.next();
                    }
                }
                var i = this;
                /**
                 * @return {?}
                 */
                i.next = function() {
                    var t;
                    var c;
                    var p = i.x;
                    var n = i.i;
                    return t = p[n], t = t ^ t >>> 7, c = t ^ t << 24, t = p[n + 1 & 7], c = c ^ (t ^ t >>> 10), t = p[n + 3 & 7], c = c ^ (t ^ t >>> 3), t = p[n + 4 & 7], c = c ^ (t ^ t << 7), t = p[n + 7 & 7], t = t ^ t << 13, c = c ^ (t ^ t << 9), p[n] = c, i.i = n + 1 & 7, c;
                };
                next(i, seed);
            }
            /**
             * @param {!Object} f
             * @param {!Object} t
             * @return {?}
             */
            function copy(f, t) {
                return t.x = f.x.slice(), t.i = f.i, t;
            }
            /**
             * @param {string} obj
             * @param {!Object} data
             * @return {?}
             */
            function impl(obj, data) {
                if (null == obj) {
                    /** @type {number} */
                    obj = +new Date;
                }
                var xg = new XorGen(obj);
                var message = data && data.state;
                /**
                 * @return {?}
                 */
                var prng = function() {
                    return (xg.next() >>> 0) / 4294967296;
                };
                return prng["double"] = function() {
                    do {
                        /** @type {number} */
                        var t = xg.next() >>> 11;
                        /** @type {number} */
                        var GearType = (xg.next() >>> 0) / 4294967296;
                        /** @type {number} */
                        var r = (t + GearType) / (1 << 21);
                    } while (0 === r);
                    return r;
                }, prng.int32 = xg.next, prng.quick = prng, message && (message.x && copy(message, xg), prng.state = function() {
                    return copy(xg, {});
                }), prng;
            }
            if (module && module.exports) {
                /** @type {function(string, !Object): ?} */
                module.exports = impl;
            } else {
                if (define && define.amd) {
                    define(function() {
                        return impl;
                    });
                } else {
                    /** @type {function(string, !Object): ?} */
                    this.xorshift7 = impl;
                }
            }
        }(this, "object" == typeof exports && exports, "function" == typeof define && define);
    }, {}],
    41 : [function(canCreateDiscussions, exports, n) {
        !function(EMSarray, module, define) {
            /**
             * @param {number} t
             * @return {undefined}
             */
            function XorGen(t) {
                var p = this;
                /** @type {string} */
                var text = "";
                /**
                 * @return {?}
                 */
                p.next = function() {
                    /** @type {number} */
                    var t = p.x ^ p.x >>> 2;
                    return p.x = p.y, p.y = p.z, p.z = p.w, p.w = p.v, (p.d = p.d + 362437 | 0) + (p.v = p.v ^ p.v << 4 ^ (t ^ t << 1)) | 0;
                };
                /** @type {number} */
                p.x = 0;
                /** @type {number} */
                p.y = 0;
                /** @type {number} */
                p.z = 0;
                /** @type {number} */
                p.w = 0;
                /** @type {number} */
                p.v = 0;
                if (t === (0 | t)) {
                    /** @type {number} */
                    p.x = t;
                } else {
                    /** @type {string} */
                    text = text + t;
                }
                /** @type {number} */
                var i = 0;
                for (; i < text.length + 64; i++) {
                    p.x ^= 0 | text.charCodeAt(i);
                    if (i == text.length) {
                        /** @type {number} */
                        p.d = p.x << 10 ^ p.x >>> 4;
                    }
                    p.next();
                }
            }
            /**
             * @param {!Object} f
             * @param {!Object} t
             * @return {?}
             */
            function copy(f, t) {
                return t.x = f.x, t.y = f.y, t.z = f.z, t.w = f.w, t.v = f.v, t.d = f.d, t;
            }
            /**
             * @param {!Function} obj
             * @param {!Object} data
             * @return {?}
             */
            function impl(obj, data) {
                var xg = new XorGen(obj);
                var src = data && data.state;
                /**
                 * @return {?}
                 */
                var prng = function() {
                    return (xg.next() >>> 0) / 4294967296;
                };
                return prng["double"] = function() {
                    do {
                        /** @type {number} */
                        var t = xg.next() >>> 11;
                        /** @type {number} */
                        var GearType = (xg.next() >>> 0) / 4294967296;
                        /** @type {number} */
                        var r = (t + GearType) / (1 << 21);
                    } while (0 === r);
                    return r;
                }, prng.int32 = xg.next, prng.quick = prng, src && ("object" == typeof src && copy(src, xg), prng.state = function() {
                    return copy(xg, {});
                }), prng;
            }
            if (module && module.exports) {
                /** @type {function(!Function, !Object): ?} */
                module.exports = impl;
            } else {
                if (define && define.amd) {
                    define(function() {
                        return impl;
                    });
                } else {
                    /** @type {function(!Function, !Object): ?} */
                    this.xorwow = impl;
                }
            }
        }(this, "object" == typeof exports && exports, "function" == typeof define && define);
    }, {}],
    42 : [function(require, module, n) {
        !function(pool, math) {
            /**
             * @param {!Function} c
             * @param {!Object} options
             * @param {!Function} callback
             * @return {?}
             */
            function seedrandom(c, options, callback) {
                /** @type {!Array} */
                var key = [];
                options = 1 == options ? {
                    entropy : true
                } : options || {};
                var shortseed = mixkey(w(options.entropy ? [c, tostring(pool)] : null == c ? autoseed() : c, 3), key);
                var arc4 = new ARC4(key);
                /**
                 * @return {?}
                 */
                var prng = function() {
                    var n = arc4.g(chunks);
                    /** @type {number} */
                    var d = startdenom;
                    /** @type {number} */
                    var x = 0;
                    for (; n < i;) {
                        /** @type {number} */
                        n = (n + x) * width;
                        /** @type {number} */
                        d = d * width;
                        x = arc4.g(1);
                    }
                    for (; n >= left;) {
                        /** @type {number} */
                        n = n / 2;
                        /** @type {number} */
                        d = d / 2;
                        /** @type {number} */
                        x = x >>> 1;
                    }
                    return (n + x) / d;
                };
                return prng.int32 = function() {
                    return 0 | arc4.g(4);
                }, prng.quick = function() {
                    return arc4.g(4) / 4294967296;
                }, prng["double"] = prng, mixkey(tostring(arc4.S), pool), (options.pass || callback || function(prng, value, initAccum, opts) {
                    return opts && (opts.S && copy(opts, arc4), prng.state = function() {
                        return copy(arc4, {});
                    }), initAccum ? (math[rngname] = prng, value) : prng;
                })(prng, shortseed, "global" in options ? options.global : this == math, options.state);
            }
            /**
             * @param {string} key
             * @return {undefined}
             */
            function ARC4(key) {
                var t;
                var keylen = key.length;
                var me = this;
                /** @type {number} */
                var i = 0;
                /** @type {number} */
                var j = me.i = me.j = 0;
                /** @type {!Array} */
                var s = me.S = [];
                if (!keylen) {
                    /** @type {!Array} */
                    key = [keylen++];
                }
                for (; i < width;) {
                    /** @type {number} */
                    s[i] = i++;
                }
                /** @type {number} */
                i = 0;
                for (; i < width; i++) {
                    s[i] = s[j = mask & j + key[i % keylen] + (t = s[i])];
                    s[j] = t;
                }
                (me.g = function(count) {
                    var t;
                    /** @type {number} */
                    var r = 0;
                    var i = me.i;
                    var j = me.j;
                    var s = me.S;
                    for (; count--;) {
                        t = s[i = mask & i + 1];
                        r = r * width + s[mask & (s[i] = s[j = mask & j + t]) + (s[j] = t)];
                    }
                    return me.i = i, me.j = j, r;
                })(width);
            }
            /**
             * @param {!Object} f
             * @param {!Object} t
             * @return {?}
             */
            function copy(f, t) {
                return t.i = f.i, t.j = f.j, t.S = f.S.slice(), t;
            }
            /**
             * @param {string} index
             * @param {number} value
             * @return {?}
             */
            function w(index, value) {
                var i;
                /** @type {!Array} */
                var b = [];
                /** @type {string} */
                var undefined = typeof index;
                if (value && "object" == undefined) {
                    for (i in index) {
                        try {
                            b.push(w(index[i], value - 1));
                        } catch (o) {
                        }
                    }
                }
                return b.length ? b : "string" == undefined ? index : index + "\x00";
            }
            /**
             * @param {string} seed
             * @param {!Array} key
             * @return {?}
             */
            function mixkey(seed, key) {
                var n;
                /** @type {string} */
                var stringseed = seed + "";
                /** @type {number} */
                var j = 0;
                for (; j < stringseed.length;) {
                    /** @type {number} */
                    key[mask & j] = mask & (n = n ^ 19 * key[mask & j]) + stringseed.charCodeAt(j++);
                }
                return tostring(key);
            }
            /**
             * @return {?}
             */
            function autoseed() {
                try {
                    var out;
                    return nodecrypto && (out = nodecrypto.randomBytes) ? out = out(width) : (out = new Uint8Array(width), (global.crypto || global.msCrypto).getRandomValues(out)), tostring(out);
                } catch (e) {
                    var navigator = global.navigator;
                    var isPhantom = navigator && navigator.plugins;
                    return [+new Date, global, isPhantom, global.screen, tostring(pool)];
                }
            }
            /**
             * @param {!Array} a
             * @return {?}
             */
            function tostring(a) {
                return String.fromCharCode.apply(0, a);
            }
            var nodecrypto;
            var global = this;
            /** @type {number} */
            var width = 256;
            /** @type {number} */
            var chunks = 6;
            /** @type {number} */
            var y = 52;
            /** @type {string} */
            var rngname = "random";
            /** @type {number} */
            var startdenom = math.pow(width, chunks);
            /** @type {number} */
            var i = math.pow(2, y);
            /** @type {number} */
            var left = 2 * i;
            /** @type {number} */
            var mask = width - 1;
            if (math["seed" + rngname] = seedrandom, mixkey(math.random(), pool), "object" == typeof module && module.exports) {
                /** @type {function(!Function, !Object, !Function): ?} */
                module.exports = seedrandom;
                try {
                    nodecrypto = require("25");
                } catch (w) {
                }
            } else {
                if ("function" == typeof define && define.amd) {
                    define(function() {
                        return seedrandom;
                    });
                }
            }
        }([], Math);
    }, {
        25 : 25
    }],
    43 : [function(require, module, n) {
        var ref = require("1");
        var p = (require("8"), require("50"));
        var PerspectiveCamera = (require("45"), require("56"), require("58"));
        var SVGTable = (require("54"), require("48"));
        var GlitchTextLetter = require("47");
        var PoloLender = require("52");
        var Zk = require("57");
        var TagHourlyStat = require("60");
        /**
         * @param {!Function} data
         * @return {undefined}
         */
        var _ = function(data) {
            ref.call(this, data);
            this.initCamera();
            this.gridCoords = new THREE.Vector2;
            this.cameraOffset = new THREE.Vector2;
            this.scene = new THREE.Scene;
        };
        _.inherit(ref, {
            start : function(_) {
                var root_width = _.getObjectByName("blocks").children;
                var root_height = _.getObjectByName("lanes").children;
                var table_options = _.getObjectByName("intersections").children;
                var contentTableRows = _.getObjectByName("cars").children;
                var childrenOfLast = _.getObjectByName("clouds").children;
                this.table = new SVGTable(root_width, root_height, table_options, contentTableRows, childrenOfLast);
                this.chunkScene = new GlitchTextLetter;
                this.scene.add(this.chunkScene);
                this.inputManager = new PoloLender(document.querySelector("canvas"));
                this.controls = new Zk(this.inputManager, this.chunkScene, this.camera);
                this.renderer.setClearColor(p.FOG_COLOR);
                this.initDirLight();
                this.initVignetting();
                this.controls.on("move", function(eastPx, vertSpeed) {
                    this.gridCoords.x += eastPx;
                    this.gridCoords.y += vertSpeed;
                    this.refreshChunkScene();
                }, this);
                this.refreshChunkScene();
                this.inputManager.on("startdrag", function() {
                    $("body").addClass("grabbing");
                });
                this.inputManager.on("enddrag", function() {
                    $("body").removeClass("grabbing");
                });
                this.inputManager.on("mousewheel", function(value) {
                    this.camera.updateHeight(value);
                }, this);
                this.inputManager.on("pinchstart", function() {
                    /** @type {number} */
                    this._lastPinchScale = 1;
                    /** @type {boolean} */
                    this.controls.enabled = false;
                }, this);
                this.inputManager.on("pinchend", function() {
                    /** @type {boolean} */
                    this.controls.enabled = true;
                }, this);
                this.inputManager.on("pinchchange", function(uv3v) {
                    /** @type {number} */
                    var v1y = 10;
                    /** @type {number} */
                    var value = (uv3v - this._lastPinchScale) * v1y;
                    this.camera.updateHeight(value);
                    /** @type {number} */
                    this._lastPinchScale = uv3v;
                }, this);
                ref.prototype.start.call(this);
            },
            initDirLight : function() {
                var light = new THREE.DirectionalLight(16774618, 1.25);
                light.position.set(100, 150, -40);
                this.chunkScene.add(light);
                this.chunkScene.add(light.target);
                this.dirLight = light;
                /** @type {boolean} */
                light.castShadow = true;
                /** @type {number} */
                light.shadow.radius = 1;
                /** @type {number} */
                light.shadow.bias = -.001;
                light.shadow.mapSize.width = p.SHADOWMAP_RESOLUTION;
                light.shadow.mapSize.height = p.SHADOWMAP_RESOLUTION;
                /** @type {number} */
                light.shadow.camera.near = 50;
                /** @type {number} */
                light.shadow.camera.far = 300;
                this._resizeShadowMapFrustum(window.innerWidth, window.innerHeight);
                /** @type {boolean} */
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            },
            initVignetting : function() {
                this.vignetting = new TagHourlyStat;
            },
            setSize : function(size, val) {
                ref.prototype.setSize.call(this, size, val);
                if (this.dirLight) {
                    this._resizeShadowMapFrustum(size, val);
                }
            },
            initCamera : function() {
                /** @type {number} */
                var psisq = 120;
                Math.tan(p.CAMERA_ANGLE) * Math.sqrt(2 * Math.pow(psisq, 2));
                this.camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 10, 400);
                this.camera.position.set(80, 140, 80);
                this.camera.lookAt(new THREE.Vector3);
                /** @type {number} */
                this.camera.position.y = 200;
            },
            refreshChunkScene : function() {
                this.chunkScene.forEachChunk(function(results, columnGap, a) {
                    var body = this.gridCoords.x + columnGap;
                    var val = this.gridCoords.y + a;
                    var v = this.table.getChunkData(body, val);
                    results.remove(results.getObjectByName("chunk"));
                    results.add(v.node);
                }.bind(this));
            },
            update : function(val) {
                this.controls.update();
                this.table.update(val);
                this.camera.update();
                ref.prototype.update.call(this, val);
            },
            render : function(text) {
                /** @type {number} */
                var totalPlayers = 0;
                var mapFragmentAndProps = function() {
                    if (this.config.logCalls) {
                        totalPlayers = totalPlayers + this.renderer.info.render.calls;
                    }
                }.bind(this);
                this.renderer.clear();
                this.renderScene(this.scene, this.camera);
                mapFragmentAndProps();
                if (this.vignetting) {
                    this.vignetting.render(this.renderer);
                    mapFragmentAndProps();
                }
                if (this.config.logCalls) {
                    this.dcCounter.textContent = totalPlayers + " DC";
                }
            },
            _resizeShadowMapFrustum : function(count, steps) {
                /** @type {number} */
                var start = 1.25;
                /** @type {number} */
                var childStartView2 = Math.max(count / steps, start);
                /** @type {number} */
                var halfHeight = 75 * childStartView2;
                /** @type {number} */
                this.dirLight.shadow.camera.left = .9 * -halfHeight;
                /** @type {number} */
                this.dirLight.shadow.camera.right = 1.3 * halfHeight;
                /** @type {number} */
                this.dirLight.shadow.camera.top = halfHeight;
                /** @type {number} */
                this.dirLight.shadow.camera.bottom = -halfHeight;
                this.dirLight.shadow.camera.updateProjectionMatrix();
            }
        });
        /** @type {function(!Function): undefined} */
        module.exports = _;
    }, {
        1 : 1,
        45 : 45,
        47 : 47,
        48 : 48,
        50 : 50,
        52 : 52,
        54 : 54,
        56 : 56,
        57 : 57,
        58 : 58,
        60 : 60,
        8 : 8
    }],
    44 : [function(canCreateDiscussions, mixin, n) {
        mixin.exports = {
            "basic.fs" : "#ifdef USE_MAP\n  varying vec2 vUv;\n\n  uniform sampler2D map;\n#endif\n\nuniform vec3 diffuse;\nuniform float opacity;\n\nvoid main() {\n  gl_FragColor = vec4(diffuse, opacity);\n\n  #ifdef USE_MAP\n    vec4 mapTexel = texture2D(map, vUv, -2.0);\n\n    gl_FragColor *= mapTexel;\n  #endif\n}",
            "basic.vs" : "#ifdef USE_MAP\n  varying vec2 vUv;\n  uniform vec4 offsetRepeat;\n#endif\n\nvoid main() {\n  #ifdef USE_MAP\n    vUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n  #endif\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
            "pbr.fs" : "#define MOBILE\n#define LUV\n\nuniform float uAOPBRFactor;\nuniform float uAlbedoPBRFactor;\nuniform float uEnvironmentExposure;\nuniform float uGlossinessPBRFactor;\nuniform float uMetalnessPBRFactor;\nuniform float uNormalMapFactor;\nuniform float uOpacityFactor;\nuniform float uSpecularF0Factor;\n\nuniform int uMode;\nuniform vec3 uColor;\nuniform float uAlphaTest;\n\nuniform int uFlipY;\nuniform int uOccludeSpecular;\nuniform int uOutputLinear;\n\nuniform sampler2D sTextureAlbedoMap;\nuniform sampler2D sTextureAlbedoMap2;\nuniform sampler2D sTextureNormalMap;\nuniform sampler2D sTextureNormalMap2;\nuniform sampler2D sTextureAOMap;\nuniform sampler2D sTextureAOMap2;\nuniform sampler2D sTextureEmissiveMap;\nuniform sampler2D sTexturePBRMaps;\n\nuniform vec2 uTextureEnvironmentSpecularPBRLodRange;\nuniform vec2 uTextureEnvironmentSpecularPBRTextureSize;\nuniform vec3 uDiffuseSPH[9];\nuniform mat4 uEnvironmentTransform;\n\n// varying vec3 FragPosition;\nvarying vec3 FragNormal;\nvarying vec4 FragTangent;\nvarying vec4 FragEyeVector;\nvarying vec2 vUv;\n\n#if defined(USE_ALBEDO2) || defined(USE_NORMALMAP2) || defined(USE_AOMAP2)\nvarying vec2 vUvDetail;\n#endif\n\n#ifdef USE_LIGHTMAP\n  uniform sampler2D sTextureLightMap;\n  uniform sampler2D sTextureLightMapAlpha;\n#endif\n\nvarying vec2 vUv2;\n\n#ifdef USE_FOG\n\n  uniform vec3 fogColor;\n  varying float fogDepth;\n  uniform float fogNear;\n  uniform float fogFar;\n\n#endif\n\n\n// THREE.js common.glsl\n#define PI 3.14159265359\n#define PI2 6.28318530718\n#define PI_HALF 1.5707963267949\n#define RECIPROCAL_PI 0.31830988618\n#define RECIPROCAL_PI2 0.15915494\n#define LOG2 1.442695\n#define EPSILON 1e-6\n\n#define saturate(a) clamp( a, 0.0, 1.0 )\n#define whiteCompliment(a) ( 1.0 - saturate( a ) )\n\nfloat pow2( const in float x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }\n// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.\n// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/\nhighp float rand( const in vec2 uv ) {\n  const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n  highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n  return fract(sin(sn) * c);\n}\n\nstruct IncidentLight {\n  vec3 color;\n  vec3 direction;\n  bool visible;\n};\n\nstruct ReflectedLight {\n  vec3 directDiffuse;\n  vec3 directSpecular;\n  vec3 indirectDiffuse;\n  vec3 indirectSpecular;\n};\n\nstruct GeometricContext {\n  vec3 position;\n  vec3 normal;\n  vec3 viewDir;\n};\n\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\n  return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n\n}\n\n// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations\nvec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {\n\n  return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );\n\n}\n\nvec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\n  float distance = dot( planeNormal, point - pointOnPlane );\n\n  return - distance * planeNormal + point;\n\n}\n\nfloat sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\n  return sign( dot( point - pointOnPlane, planeNormal ) );\n\n}\n\nvec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\n  return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;\n\n}\n\nmat3 transposeMat3( const in mat3 m ) {\n\n  mat3 tmp;\n\n  tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );\n  tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );\n  tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );\n\n  return tmp;\n\n}\n\n// https://en.wikipedia.org/wiki/Relative_luminance\nfloat linearToRelativeLuminance( const in vec3 color ) {\n\n  vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );\n\n  return dot( weights, color.rgb );\n\n}\n\n// end common.glsl\n\n// THREE.js packing\n\nvec3 packNormalToRGB( const in vec3 normal ) {\n  return normalize( normal ) * 0.5 + 0.5;\n}\n\nvec3 unpackRGBToNormal( const in vec3 rgb ) {\n  return 2.0 * rgb.xyz - 1.0;\n}\n\nconst float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)\nconst float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)\n\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\n\nconst float ShiftRight8 = 1. / 256.;\n\nvec4 packDepthToRGBA( const in float v ) {\n  vec4 r = vec4( fract( v * PackFactors ), v );\n  r.yzw -= r.xyz * ShiftRight8; // tidy overflow\n  return r * PackUpscale;\n}\n\nfloat unpackRGBAToDepth( const in vec4 v ) {\n  return dot( v, UnpackFactors );\n}\n\n// NOTE: viewZ/eyeZ is < 0 when in front of the camera per OpenGL conventions\n\nfloat viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {\n  return ( viewZ + near ) / ( near - far );\n}\nfloat orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {\n  return linearClipZ * ( near - far ) - near;\n}\n\nfloat viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n  return (( near + viewZ ) * far ) / (( far - near ) * viewZ );\n}\nfloat perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {\n  return ( near * far ) / ( ( far - near ) * invClipZ - far );\n}\n\n// end packing\n\nfloat blendOverlay(float base, float blend) {\n  return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));\n}\n\nvec3 blendOverlay(vec3 base, vec3 blend) {\n  return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));\n}\n\nvec3 blendOverlay(vec3 base, vec3 blend, float opacity) {\n  return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// references\n// https://www.khronos.org/registry/gles/extensions/EXT/EXT_sRGB.txt\n\n// approximation\n// http://chilliant.blogspot.fr/2012/08/srgb-approximations-for-hlsl.html\nfloat linearTosRGB(const in float c) {\n  if (c >= 1.0) return 1.0;\n  float S1 = sqrt(c);\n  float S2 = sqrt(S1);\n  float S3 = sqrt(S2);\n  return 0.662002687 * S1 + 0.684122060 * S2 - 0.323583601 * S3 - 0.0225411470 * c;\n}\n\nvec3 linearTosRGB(const in vec3 c) {\n  // vec3 cm = min(c, 1.0);\n  vec3 cm = c;\n  vec3 S1 = sqrt(cm);\n  vec3 S2 = sqrt(S1);\n  vec3 S3 = sqrt(S2);\n  return 0.662002687 * S1 + 0.684122060 * S2 - 0.323583601 * S3 - 0.0225411470 * cm;\n}\n\nvec4 linearTosRGB(const in vec4 c) {\n  vec3 cm = min(c.rgb, 1.0);\n  vec3 S1 = sqrt(cm);\n  vec3 S2 = sqrt(S1);\n  vec3 S3 = sqrt(S2);\n  return vec4(0.662002687 * S1 + 0.684122060 * S2 - 0.323583601 * S3 - 0.0225411470 * cm, c.a);\n}\n\nfloat sRGBToLinear(const in float c) {\n  return c * (c * (c * 0.305306011 + 0.682171111) + 0.012522878);\n}\n\nvec3 sRGBToLinear(const in vec3 c) {\n  return c * (c * (c * 0.305306011 + 0.682171111) + 0.012522878);\n}\n\nvec4 sRGBToLinear(const in vec4 c) {\n  return vec4(c.rgb * (c.rgb * (c.rgb * 0.305306011 + 0.682171111) + 0.012522878), c.a);\n}\n\n//http://graphicrants.blogspot.fr/2009/04/rgbm-color-encoding.html\nvec3 RGBMToRGB(const in vec4 rgba) {\n  const float maxRange = 8.0;\n  return rgba.rgb * maxRange * rgba.a;\n}\n\nconst mat3 LUVInverse = mat3(6.0013,    -2.700,   -1.7995,\n                -1.332,    3.1029,   -5.7720,\n                0.3007,    -1.088,    5.6268);\n\nvec3 LUVToRGB(const in vec4 vLogLuv) {\n  float Le = vLogLuv.z * 255.0 + vLogLuv.w;\n  vec3 Xp_Y_XYZp;\n  Xp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);\n  Xp_Y_XYZp.z = Xp_Y_XYZp.y / vLogLuv.y;\n  Xp_Y_XYZp.x = vLogLuv.x * Xp_Y_XYZp.z;\n  vec3 vRGB = LUVInverse * Xp_Y_XYZp;\n  return max(vRGB, 0.0);\n}\n\n// http://graphicrants.blogspot.fr/2009/04/rgbm-color-encoding.html\nvec4 encodeRGBM(const in vec3 col, const in float range) {\n  if(range <= 0.0)\n    return vec4(col, 1.0);\n  vec4 rgbm;\n  vec3 color = col / range;\n  rgbm.a = clamp(max(max(color.r, color.g), max(color.b, 1e-6)), 0.0, 1.0);\n  rgbm.a = ceil(rgbm.a * 255.0) / 255.0;\n  rgbm.rgb = color / rgbm.a;\n  return rgbm;\n}\n\nvec3 decodeRGBM(const in vec4 col, const in float range) {\n  if(range <= 0.0)\n    return col.rgb;\n  return range * col.rgb * col.a;\n}\n\nvec3 textureRGB(const in sampler2D texture, const in vec2 uv) {\n  return texture2D(texture, uv.xy).rgb;\n}\n\nvec4 textureRGBA(const in sampler2D texture, const in vec2 uv) {\n  return texture2D(texture, uv.xy).rgba;\n}\n\nfloat textureIntensity(const in sampler2D texture, const in vec2 uv) {\n  return texture2D(texture, uv).r;\n}\n\nfloat textureAlpha(const in sampler2D texture, const in vec2 uv) {\n  return texture2D(texture, uv.xy).a;\n}\n\nfloat adjustSpecular(const in float specular, const in vec3 normal) {\n  // Based on The Order : 1886 SIGGRAPH course notes implementation (page 21 notes)\n  float normalLen = length(normal);\n  if (normalLen < 1.0) {\n    float normalLen2 = normalLen * normalLen;\n    float kappa = (3.0 * normalLen -  normalLen2 * normalLen)/(1.0 - normalLen2);\n    // http://www.frostbite.com/2014/11/moving-frostbite-to-pbr/\n    // page 91 : they use 0.5/kappa instead\n    return 1.0-min(1.0, sqrt((1.0-specular) * (1.0-specular) + 1.0/kappa));\n  }\n  return specular;\n}\n\nvec3 mtexNspaceTangent(const in vec4 tangent, const in vec3 normal, const in vec3 texnormal) {\n  vec3 tang = vec3(0.0,1.0,0.0);\n  float l = length(tangent.xyz);\n  if (l != 0.0) {\n    //normalize reusing length computations\n    // tang =  normalize(tangent.xyz);\n    tang =  tangent.xyz / l;\n  }\n  vec3 B = tangent.w * normalize(cross(normal, tang));\n  return normalize(texnormal.x*tang + texnormal.y*B + texnormal.z*normal);\n}\n\nvec2 normalMatcap(const in vec3 normal, const in vec3 nm_z) {\n  vec3 nm_x = vec3(-nm_z.z, 0.0, nm_z.x);\n  vec3 nm_y = cross(nm_x, nm_z);\n  return vec2(dot(normal.xz, nm_x.xz), dot(normal, nm_y)) * vec2(0.5)  + vec2(0.5) ; //MADD vector form\n}\n\nvec3 rgbToNormal(const in vec3 texel, const in int flipNormalY) {\n  vec3 rgb = texel * vec3(2.0) + vec3(-1.0); // MADD vec form\n  rgb[1] = flipNormalY == 1 ? -rgb[1] : rgb[1];\n  return rgb;\n}\n\nvec3 bumpMap(const in vec4 tangent, const in vec3 normal, const in vec2 gradient) {\n  vec3 outnormal;\n  float l = length(tangent.xyz);\n  if (l != 0.0) {\n    //normalize reusing length computations\n    // vec3 tang =  normalize(tangent.xyz);\n    vec3 tang =  tangent.xyz / l;\n    vec3 binormal = tangent.w * normalize(cross(normal, tang));\n    outnormal = normal + gradient.x * tang + gradient.y * binormal;\n  }\n  else {\n     outnormal = vec3(normal.x + gradient.x, normal.y + gradient.y, normal.z);\n  }\n  return normalize(outnormal);\n}\n\nfloat specularOcclusion(const in int occlude, const in float ao, const in vec3 N, const in vec3 V) {\n  if(occlude == 0)\n    return 1.0;\n  // Yoshiharu Gotanda's specular occlusion approximation:\n  // cf http://research.tri-ace.com/Data/cedec2011_RealtimePBR_Implementation_e.pptx pg59\n  float d = dot(N, V) + ao;\n  return clamp((d * d) - 1.0 + ao, 0.0, 1.0);\n}\n\nfloat adjustRoughnessNormalMap(const in float roughness, const in vec3 normal) {\n  // Based on The Order : 1886 SIGGRAPH course notes implementation (page 21 notes)\n  float normalLen = length(normal);\n  if (normalLen < 1.0) {\n    float normalLen2 = normalLen * normalLen;\n    float kappa = (3.0 * normalLen -  normalLen2 * normalLen)/(1.0 - normalLen2);\n    // http://www.frostbite.com/2014/11/moving-frostbite-to-pbr/\n    // page 91 : they use 0.5/kappa instead\n    return min(1.0, sqrt(roughness * roughness + 1.0/kappa));\n  }\n  return roughness;\n}\n\nfloat adjustRoughnessGeometry(const in float roughness, const in vec3 normal) {\n  // Geometric Specular Aliasing (slide 43)\n  // http://alex.vlachos.com/graphics/Alex_Vlachos_Advanced_VR_Rendering_GDC2015.pdf\n// #ifdef GL_OES_standard_derivatives\n//     vec3 vDx = dFdx(normal.xyz);\n//     vec3 vDy = dFdy(normal.xyz);\n//     return max(roughness, pow(clamp(max(dot(vDx, vDx), dot(vDy, vDy)), 0.0, 1.0), 0.333));\n// #else\n  return roughness;\n// #endif\n}\n\nmat3 environmentTransformPBR(const in mat4 tr) {\n  // TODO trick from animation matrix transpose?\n  vec3 x = vec3(tr[0][0], tr[1][0], tr[2][0]);\n  vec3 y = vec3(tr[0][1], tr[1][1], tr[2][1]);\n  vec3 z = vec3(tr[0][2], tr[1][2], tr[2][2]);\n  mat3 m = mat3(x, y, z);\n  return m;\n}\n\nvec3 evaluateDiffuseSphericalHarmonics(const in vec3 s[9], const in mat3 envTrans, const in vec3 N) {\n  vec3 n = envTrans * N;\n  // https://github.com/cedricpinson/envtools/blob/master/Cubemap.cpp#L523\n  vec3 result = (s[0]+s[1]*n.y+s[2]*n.z+s[3]*n.x+s[4]*n.y*n.x+s[5]*n.y*n.z+s[6]*(3.0*n.z*n.z-1.0)+s[7]*(n.z*n.x)+s[8]*(n.x*n.x-n.y*n.y));\n  return max(result, vec3(0.0));\n}\n\n// Frostbite, Lagarde paper p67\n// http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf\nfloat linRoughnessToMipmap(const in float roughnessLinear) {\n  return sqrt(roughnessLinear);\n}\n\nvec3 integrateBRDF(const in vec3 specular, const in float r, const in float NoV, const in sampler2D tex) {\n  vec4 rgba = texture2D(tex, vec2(NoV, r));\n  float b = (rgba[3] * 65280.0 + rgba[2] * 255.0);\n  float a = (rgba[1] * 65280.0 + rgba[0] * 255.0);\n  const float div = 1.0/65535.0;\n  return (specular * a + b) * div;\n}\n\n// https://www.unrealengine.com/blog/physically-based-shading-on-mobile\n// TODO should we use somehow specular f0 ?\nvec3 integrateBRDFApprox(const in vec3 specular, const in float roughness, const in float NoV) {\n  const vec4 c0 = vec4(-1, -0.0275, -0.572, 0.022);\n  const vec4 c1 = vec4(1, 0.0425, 1.04, -0.04);\n  vec4 r = roughness * c0 + c1;\n  float a004 = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;\n  vec2 AB = vec2(-1.04, 1.04) * a004 + r.zw;\n  return specular * AB.x + AB.y;\n}\n\nvec3 computeIBLDiffuseUE4(const in vec3 normal, const in vec3 albedo, const in mat3 envTrans, const in vec3 sphHarm[9]) {\n  return albedo * evaluateDiffuseSphericalHarmonics(sphHarm, envTrans, normal);\n}\n\n\n#ifdef CUBEMAP\nvec3 textureCubemapLod(const in samplerCube texture, const in vec3 dir, const in float lod) {\n  vec4 rgba = textureCubeLodEXT(texture, dir, lod);\n#ifdef FLOAT\n  return rgba.rgb;\n#endif\n#ifdef RGBM\n  return RGBMToRGB(rgba);\n#endif\n#ifdef LUV\n  return LUVToRGB(rgba);\n#endif\n}\n\nvec3 textureCubeLodEXTFixed(const in samplerCube texture, const in vec2 size, const in vec3 direction, const in float lodInput, const in float maxLod) {\n  vec3 dir = direction;\n  float lod = min(maxLod, lodInput);\n\n  // http://seblagarde.wordpress.com/2012/06/10/amd-cubemapgen-for-physically-based-rendering/\n  float scale = 1.0 - exp2(lod) / size.x;\n  vec3 absDir = abs(dir);\n  float M = max(max(absDir.x, absDir.y), absDir.z);\n\n  if (absDir.x != M) dir.x *= scale;\n  if (absDir.y != M) dir.y *= scale;\n  if (absDir.z != M) dir.z *= scale;\n\n  return textureCubemapLod(texture, dir, lod);\n}\n\nvec3 prefilterEnvMapCube(const in float rLinear, const in vec3 R, const in samplerCube tex, const in vec2 lodRange, const in vec2 size){\n  float lod = linRoughnessToMipmap(rLinear) * lodRange[1];\n  return textureCubeLodEXTFixed(tex, size, R, lod, lodRange[0]);\n}\n\n#define samplerEnv samplerCube\n#define prefilterEnvMap prefilterEnvMapCube\n\n#else\n#ifdef PANORAMA\nvec2 computeUVForMipmap(const in float level, const in vec2 uvBase, const in float size, const in float maxLOD) {\n  vec2 uv = uvBase;\n  float widthForLevel = exp2(maxLOD - level);\n  float heightForLevel = widthForLevel * 0.5;\n  float widthFactor = pow(0.5, level);\n  float heightFactor = widthFactor * 0.5;\n  float texelSize = 1.0 / size;\n\n  uv.y = 1.0 - uv.y;\n\n  float resizeX = (widthForLevel - 2.0) * texelSize;\n  float resizeY = (heightForLevel - 2.0) * texelSize;\n\n  float uvSpaceLocalX = texelSize + uv.x * resizeX;\n  float uvSpaceLocalY = texelSize + uv.y * resizeY;\n\n  uvSpaceLocalY += heightFactor;\n\n  return vec2(uvSpaceLocalX, uvSpaceLocalY);\n}\n\nvec2 normalToPanoramaUVY(const in vec3 dir) {\n  float n = length(dir.xz);\n\n  // to avoid bleeding the max(-1.0,dir.x / n) is needed\n  vec2 pos = vec2((n > 0.0000001) ? max(-1.0, dir.x / n) : 0.0, dir.y);\n\n  // fix edge bleeding\n  if (pos.x > 0.0) pos.x = min(0.999999, pos.x);\n\n  pos = acos(pos) * 0.3183098861837907; // inv_pi\n\n  pos.x = (dir.z > 0.0) ? pos.x * 0.5 : 1.0 - (pos.x * 0.5);\n\n  // shift u to center the panorama to -z\n  pos.x = mod(pos.x - 0.25 + 1.0, 1.0);\n  pos.y = 1.0 - pos.y;\n  return pos;\n}\n\nvec3 texturePanorama(const in sampler2D texture, const in vec2 uv) {\n  vec4 rgba = texture2D(texture, uv);\n#ifdef FLOAT\n  return rgba.rgb;\n#endif\n#ifdef RGBM\n  return RGBMToRGB(rgba);\n#endif\n#ifdef LUV\n  return LUVToRGB(rgba);\n#endif\n}\n\nvec3 texturePanoramaLod(const in sampler2D texture, const in vec2 size, const in vec3 direction, const in float lodInput, const in float maxLOD) {\n  float lod = min(maxLOD, lodInput);\n  vec2 uvBase = normalToPanoramaUVY(direction);\n\n  float lod0 = floor(lod);\n  vec2 uv0 = computeUVForMipmap(lod0, uvBase, size.x, maxLOD);\n  vec3 texel0 = texturePanorama(texture, uv0.xy);\n\n  float lod1 = ceil(lod);\n  vec2 uv1 = computeUVForMipmap(lod1, uvBase, size.x, maxLOD);\n  vec3 texel1 = texturePanorama(texture, uv1.xy);\n\n  return mix(texel0, texel1, fract(lod));\n}\n\nvec3 prefilterEnvMapPanorama(const in float rLinear, const in vec3 R, const in sampler2D tex, const in vec2 lodRange, const in vec2 size) {\n  float lod = linRoughnessToMipmap(rLinear) * lodRange[1]; //(uEnvironmentMaxLod - 1.0);\n  return texturePanoramaLod(tex, size, R, lod, lodRange[0]);\n}\n\n#define samplerEnv sampler2D\n#define prefilterEnvMap prefilterEnvMapPanorama\n\n#else\n// in case there is no environment node ?\nvec3 prefilterEnvMap(const in float rLinear, const in vec3 R, const in sampler2D tex, const in vec2 lodRange, const in vec2 size) {\n  return vec3(0.0);\n}\n#define samplerEnv sampler2D\n#endif // PANORAMA\n\n#endif // CUBEMAP\n\nvec3 getSpecularDominantDir(const in vec3 N, const in vec3 R, const in float realRoughness) {\n  float smoothness = 1.0 - realRoughness;\n  float lerpFactor = smoothness * (sqrt(smoothness) + realRoughness);\n  // The result is not normalized as we fetch in a cubemap\n  return mix(N, R, lerpFactor);\n}\n\n// samplerEnv and prefilterEnvMap are both defined above (cubemap or panorama)\nvec3 computeIBLSpecularUE4(\n  const in vec3 N,\n  const in vec3 V,\n  const in float rLinear,\n  const in vec3 specular,\n  const in mat3 envTrans,\n  const in samplerEnv texEnv,\n  const in vec2 lodRange,\n  const in vec2 size,\n  const in vec3 frontNormal\n  #ifdef MOBILE\n){\n  #else\n  ,const in sampler2D texBRDF) {\n  #endif\n\n  float rough = max(rLinear, 0.0);\n\n  float NoV = clamp(dot(N, V), 0.0, 1.0);\n  vec3 R = normalize(NoV * 2.0 * N - V);\n\n  R = getSpecularDominantDir(N, R, rLinear);\n  // could use that, especially if NoV comes from shared preCompSpec\n  // vec3 R = reflect(-V, N);\n\n  vec3 dir = envTrans * R;\n\n  vec3 prefilteredColor = prefilterEnvMap(rough, dir, texEnv, lodRange, size);\n  // http://marmosetco.tumblr.com/post/81245981087\n  // TODO we set a min value (10%) to avoid pure blackness (in case of pure metal)\n  float factor = clamp(1.0 + 1.3 * dot(R, frontNormal), 0.1, 1.0);\n  prefilteredColor *= factor * factor;\n  #ifdef MOBILE\n  return prefilteredColor * integrateBRDFApprox(specular, rough, NoV);\n  #else\n  return prefilteredColor * integrateBRDF(specular, rough, NoV, texBRDF);\n  #endif\n}\n\nvec4 linearToGamma(vec4 value, float gammaFactor) {\n  return vec4(pow(value.xyz, vec3(1.0 / gammaFactor)), value.w);\n}\n\nfloat luma(vec3 color) {\n  return dot(color, vec3(0.299, 0.587, 0.114));\n}\n\n// Lights \n\n#if NUM_DIR_LIGHTS > 0\n\n  varying vec3 vEyeLightDir;\n  varying float vDotNL;\n  varying vec3 vComputeGGXResult;\n\n  #define G1V(dotNV, k) (1.0/(dotNV*(1.0-k)+k))\n\n  void precomputeSun(\n          const in vec3 normal,\n          const in vec3 lightViewDirection,\n    \n          out float attenuation,\n          out vec3 eyeLightDir,\n          out float dotNL) {\n\n      attenuation = 1.0;\n      eyeLightDir = lightViewDirection;\n      dotNL = dot(eyeLightDir, normal);\n  }\n\n  vec4 precomputeGGX(const in vec3 normal, const in vec3 eyeVector, const in float roughness) {\n      float dotNV = saturate(dot(normal, eyeVector));\n      float alpha = roughness * roughness;\n      float k = alpha * 0.5;\n      float visNV = G1V(dotNV, k);\n\n      return vec4(alpha, alpha * alpha, k, visNV);\n  }\n\n  vec3 computeGGX(const vec4 precomputeGGX, const vec3 normal, const vec3 eyeVector, const vec3 eyeLightDir, const vec3 F0, const float dotNL) {\n\n      vec3 H = normalize(eyeVector + eyeLightDir);\n      float dotNH = saturate(dot(normal, H));\n      // D\n      float alphaSqr = precomputeGGX.y;\n      float denom = dotNH * dotNH * (alphaSqr - 1.0) + 1.0;\n      float D = alphaSqr / (PI * denom * denom);\n\n      // F\n      float dotLH = saturate(dot(eyeLightDir, H));\n      float dotLH5 = pow(1.0 - dotLH, 5.0);\n      vec3 F = vec3(F0) + (vec3(1.0) - F0) * (dotLH5);\n\n      // V\n      float visNL = G1V(dotNL, precomputeGGX.z);\n      return D * F * visNL * precomputeGGX.w;\n  }\n\n  void computeLightLambertGGX(\n      const in vec3 normal,\n      const in vec3 eyeVector,\n      const in float dotNL,\n      const in vec4 precomputeGGX,\n      \n      const in vec3 diffuse,\n      const in vec3 specular,\n      \n      const in float attenuation,\n      const in vec3 lightColor,\n      const in vec3 eyeLightDir,\n      const in float lightIntensity,\n      \n      out vec3 diffuseOut,\n      out vec3 specularOut,\n      out bool lighted) {\n\n      lighted = dotNL > 0.0;\n      if (lighted == false) {\n          specularOut = diffuseOut = vec3(0.0);\n          return;\n      }\n\n      vec3 colorAttenuate = attenuation * dotNL * lightColor * lightIntensity;\n      specularOut = colorAttenuate * vComputeGGXResult;\n      diffuseOut = colorAttenuate * diffuse;\n  }\n#endif\n\n// THREE.js lights_pars\nuniform vec3 ambientLightColor;\n\nvec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n\n  vec3 irradiance = ambientLightColor;\n\n  #ifndef PHYSICALLY_CORRECT_LIGHTS\n\n    irradiance *= PI;\n\n  #endif\n\n  return irradiance;\n\n}\n\n#if NUM_DIR_LIGHTS > 0\n\n  struct DirectionalLight {\n    vec3 direction;\n    vec3 color;\n\n    int shadow;\n    float shadowBias;\n    float shadowRadius;\n    vec2 shadowMapSize;\n    float intensity;\n  };\n\n  uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n\n  void getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n\n    directLight.color = directionalLight.color;\n    directLight.direction = directionalLight.direction;\n    directLight.visible = true;\n\n  }\n\n#endif\n\n\n// Shadowmaps\n// THREE.js shadowmap_pars_fragment.fs\n\n#ifdef USE_SHADOWMAP\n\n  #if NUM_DIR_LIGHTS > 0\n\n    uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHTS ];\n    varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n\n  #endif\n\n  #if NUM_SPOT_LIGHTS > 0\n\n    uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHTS ];\n    varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n\n  #endif\n\n  #if NUM_POINT_LIGHTS > 0\n\n    uniform sampler2D pointShadowMap[ NUM_POINT_LIGHTS ];\n    varying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];\n\n  #endif\n\n  /*\n  #if NUM_RECT_AREA_LIGHTS > 0\n\n    // TODO (abelnation): create uniforms for area light shadows\n\n  #endif\n  */\n\n  float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n\n    return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\n\n  }\n\n  float texture2DShadowLerp( sampler2D depths, vec2 size, vec2 uv, float compare ) {\n\n    const vec2 offset = vec2( 0.0, 1.0 );\n\n    vec2 texelSize = vec2( 1.0 ) / size;\n    vec2 centroidUV = floor( uv * size + 0.5 ) / size;\n\n    float lb = texture2DCompare( depths, centroidUV + texelSize * offset.xx, compare );\n    float lt = texture2DCompare( depths, centroidUV + texelSize * offset.xy, compare );\n    float rb = texture2DCompare( depths, centroidUV + texelSize * offset.yx, compare );\n    float rt = texture2DCompare( depths, centroidUV + texelSize * offset.yy, compare );\n\n    vec2 f = fract( uv * size + 0.5 );\n\n    float a = mix( lb, lt, f.y );\n    float b = mix( rb, rt, f.y );\n    float c = mix( a, b, f.x );\n\n    return c;\n\n  }\n\n  float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n\n    shadowCoord.xyz /= shadowCoord.w;\n    shadowCoord.z += shadowBias;\n\n    // if ( something && something ) breaks ATI OpenGL shader compiler\n    // if ( all( something, something ) ) using this instead\n\n    bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n    bool inFrustum = all( inFrustumVec );\n\n    bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n\n    bool frustumTest = all( frustumTestVec );\n\n    if ( frustumTest ) {\n\n    #if defined( SHADOWMAP_TYPE_PCF )\n\n      vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\n      float dx0 = - texelSize.x * shadowRadius;\n      float dy0 = - texelSize.y * shadowRadius;\n      float dx1 = + texelSize.x * shadowRadius;\n      float dy1 = + texelSize.y * shadowRadius;\n\n      return (\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n      ) * ( 1.0 / 9.0 );\n\n    #elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\n      vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\n      float dx0 = - texelSize.x * shadowRadius;\n      float dy0 = - texelSize.y * shadowRadius;\n      float dx1 = + texelSize.x * shadowRadius;\n      float dy1 = + texelSize.y * shadowRadius;\n\n      return (\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy, shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n      ) * ( 1.0 / 9.0 );\n\n    #else // no percentage-closer filtering:\n\n      return texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );\n\n    #endif\n\n    }\n\n    return 1.0;\n\n  }\n\n  // cubeToUV() maps a 3D direction vector suitable for cube texture mapping to a 2D\n  // vector suitable for 2D texture mapping. This code uses the following layout for the\n  // 2D texture:\n  //\n  // xzXZ\n  //  y Y\n  //\n  // Y - Positive y direction\n  // y - Negative y direction\n  // X - Positive x direction\n  // x - Negative x direction\n  // Z - Positive z direction\n  // z - Negative z direction\n  //\n  // Source and test bed:\n  // https://gist.github.com/tschw/da10c43c467ce8afd0c4\n\n  vec2 cubeToUV( vec3 v, float texelSizeY ) {\n\n    // Number of texels to avoid at the edge of each square\n\n    vec3 absV = abs( v );\n\n    // Intersect unit cube\n\n    float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );\n    absV *= scaleToCube;\n\n    // Apply scale to avoid seams\n\n    // two texels less per square (one texel will do for NEAREST)\n    v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );\n\n    // Unwrap\n\n    // space: -1 ... 1 range for each square\n    //\n    // #X##   dim    := ( 4 , 2 )\n    //  # #   center := ( 1 , 1 )\n\n    vec2 planar = v.xy;\n\n    float almostATexel = 1.5 * texelSizeY;\n    float almostOne = 1.0 - almostATexel;\n\n    if ( absV.z >= almostOne ) {\n\n      if ( v.z > 0.0 )\n        planar.x = 4.0 - v.x;\n\n    } else if ( absV.x >= almostOne ) {\n\n      float signX = sign( v.x );\n      planar.x = v.z * signX + 2.0 * signX;\n\n    } else if ( absV.y >= almostOne ) {\n\n      float signY = sign( v.y );\n      planar.x = v.x + 2.0 * signY + 2.0;\n      planar.y = v.z * signY - 2.0;\n\n    }\n\n    // Transform to UV space\n\n    // scale := 0.5 / dim\n    // translate := ( center + 0.5 ) / dim\n    return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );\n\n  }\n\n  float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n\n    vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );\n\n    // for point lights, the uniform @vShadowCoord is re-purposed to hold\n    // the distance from the light to the world-space position of the fragment.\n    vec3 lightToPosition = shadowCoord.xyz;\n\n    // bd3D = base direction 3D\n    vec3 bd3D = normalize( lightToPosition );\n    // dp = distance from light to fragment position\n    float dp = ( length( lightToPosition ) - shadowBias ) / 1000.0;\n\n    #if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT )\n\n      vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;\n\n      return (\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )\n      ) * ( 1.0 / 9.0 );\n\n    #else // no percentage-closer filtering\n\n      return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );\n\n    #endif\n\n  }\n\n#endif\n\n\n\nvoid main() {\n  vec3 eyeVector = normalize(-FragEyeVector.rgb);\n  mat3 transform = environmentTransformPBR(uEnvironmentTransform);\n\n  vec4 frontTangent = gl_FrontFacing ? FragTangent : -FragTangent;\n  vec3 frontNormal = gl_FrontFacing ? FragNormal : -FragNormal;\n\n  vec3 normal = normalize(frontNormal);\n\n  // Normal map\n  #ifdef USE_NORMALMAP\n    vec3 nmTexel = rgbToNormal(textureRGB(sTextureNormalMap, vUv.xy), uFlipY);\n    vec3 normalMap = vec3(uNormalMapFactor * nmTexel.xy, nmTexel.z);\n    vec3 geoNormal = mtexNspaceTangent(frontTangent, normal, normalMap);\n    if (uMode == -1) {\n      geoNormal = normal;\n    }\n  #else\n    vec3 geoNormal = normal;\n  #endif\n\n  // Metalness / Glossiness\n  vec3 combinedTexel = textureRGB(sTexturePBRMaps, vUv.xy);\n  float metalness = combinedTexel.r;\n  float glossiness = combinedTexel.b;\n  float channelMetalnessPBR = metalness * uMetalnessPBRFactor;\n  float channelGlossinessPBR = glossiness * uGlossinessPBRFactor;\n  float roughness = 1.0 - channelGlossinessPBR;\n  float tmp_51 = max(1.e-4, roughness);\n  #ifdef USE_NORMALMAP\n    float tmp_52 = adjustRoughnessNormalMap(tmp_51, normalMap);\n    float materialRoughness = adjustRoughnessGeometry(tmp_52, normal);\n  #else\n    float materialRoughness = tmp_51;\n  #endif\n\n  // Albedo\n  vec4 albedoMap = vec4(uColor, 1.0);\n  #ifdef USE_ALBEDOMAP\n    albedoMap *= textureRGBA(sTextureAlbedoMap, vUv.xy);\n  #endif\n\n  vec3 channelAlbedoPBR = sRGBToLinear(albedoMap.rgb) * uAlbedoPBRFactor;\n  vec3 materialDiffusePBR = channelAlbedoPBR * (1.0 - channelMetalnessPBR);\n\n  // Ambient occlusion\n  float ao = textureIntensity(sTextureAOMap, vUv2.xy);\n  float channelAOPBR = mix(1.0, ao, uAOPBRFactor);\n\n  // Diffuse \n  vec3 diffuse = computeIBLDiffuseUE4(geoNormal, materialDiffusePBR, transform, uDiffuseSPH);\n\n  // Specular\n  float materialSpecularf0 = mix(0.0, 0.08, uSpecularF0Factor);\n  vec3 materialSpecularPBR = mix(vec3(materialSpecularf0), channelAlbedoPBR, channelMetalnessPBR);\n\n  // Optimization because we don't have reflective surfaces and a very simple environment\n  vec3 specular = vec3(0.004, 0.004, 0.012);\n\n  vec3 color = diffuse + specular;\n\n  color *= uEnvironmentExposure;\n\n  float shadow = 1.0;\n\n  #if NUM_DIR_LIGHTS > 0\n    DirectionalLight directionalLight;\n\n    // vec4 prepGGX = precomputeGGX( geoNormal, eyeVector, materialRoughness );\n    vec4 prepGGX = vec4(0.251, 0.063, 0.125, 1.0);\n\n    float attenuation; vec3 eyeLightDir; float dotNL; vec3 lightDiffuse; vec3 lightSpecular; bool lighted; vec3 lightCol;\n\n    directionalLight = directionalLights[ 0 ];\n\n    lightCol = directionalLight.color;\n\n    // Do this in the vertex shader because we have no normal map in this project\n    // precomputeSun( geoNormal, directionalLight.direction, attenuation, eyeLightDir, dotNL );\n    attenuation = 1.0;\n    eyeLightDir = vEyeLightDir;\n    dotNL = vDotNL;\n\n    computeLightLambertGGX( geoNormal, eyeVector, dotNL, prepGGX, materialDiffusePBR, materialSpecularPBR, attenuation, lightCol, eyeLightDir, 1.0, lightDiffuse, lightSpecular, lighted );\n\n    #ifdef USE_SHADOWMAP\n      // TODO: should check wether light has shadows enabled via directionalLight.shadow property\n      shadow = getShadow( directionalShadowMap[ 0 ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ 0 ] );\n      lightDiffuse *= shadow;\n    #endif\n\n    color += lightDiffuse;\n\n    color += lightSpecular;\n  #endif\n\n  color *= channelAOPBR;\n\n  float channelOpacity = mix(albedoMap.a * uOpacityFactor, 1.0, luma(specular) * 2.0);\n\n  #ifdef USE_EMISSIVEMAP\n    color += sRGBToLinear(emissive);\n  #endif\n\n  if (uMode <= 0) {\n    gl_FragColor = vec4(linearTosRGB(color), channelOpacity);\n  } else if (uMode == 1) {\n    gl_FragColor = vec4(geoNormal, 1.0);\n  } else if (uMode == 2) {\n    #ifdef USE_LIGHTMAP\n    gl_FragColor = vec4(linearTosRGB(lightmap), 1.0);\n    #else\n    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);\n    #endif\n  } else if (uMode == 3) {\n    gl_FragColor = vec4(vec3(channelAOPBR), 1.0);\n  } else if (uMode == 4) {\n    gl_FragColor = vec4(vec3(channelMetalnessPBR), 1.0);\n  } else if (uMode == 5) {\n    gl_FragColor = vec4(vec3(channelGlossinessPBR), 1.0);\n  } else if (uMode == 6) {\n    gl_FragColor = vec4(channelAlbedoPBR, 1.0);\n  }\n\n  #ifdef ALPHATEST\n    if (gl_FragColor.a < uAlphaTest) {\n      discard;\n    } else {\n      gl_FragColor.a = 1.0;\n    }\n  #endif\n\n  #ifdef USE_FOG\n    float fogFactor = smoothstep( fogNear, fogFar, fogDepth );\n    gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n  #endif\n}",
            "pbr.vs" : "#define PI 3.14159265359\n#define PI2 6.28318530718\n#define PI_HALF 1.5707963267949\n#define RECIPROCAL_PI 0.31830988618\n#define RECIPROCAL_PI2 0.15915494\n#define LOG2 1.442695\n#define EPSILON 1e-6\n\n#define saturate(a) clamp( a, 0.0, 1.0 )\n#define whiteCompliment(a) ( 1.0 - saturate( a ) )\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec4 tangent;\nattribute vec2 uv;\nattribute vec2 uv2;\n\nuniform mat4 modelMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\n\nuniform vec4 offsetRepeat;\nuniform vec4 offsetRepeatDetail;\n\n// varying vec3 FragPosition;\nvarying vec3 FragNormal;\nvarying vec4 FragTangent;\nvarying vec4 FragEyeVector;\nvarying vec2 vUv;\n\n// Optimization just for this experiment\nvarying vec3 vEyeLightDir;\nvarying float vDotNL;\nvarying vec3 vComputeGGXResult;\n\n#if NUM_DIR_LIGHTS > 0\n  #define G1V(dotNV, k) (1.0/(dotNV*(1.0-k)+k))\n\n  struct DirectionalLight {\n    vec3 direction;\n    vec3 color;\n\n    int shadow;\n    float shadowBias;\n    float shadowRadius;\n    vec2 shadowMapSize;\n    float intensity;\n  };\n\n  uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n\n  vec3 computeGGX(const vec4 precomputeGGX, const vec3 normal, const vec3 eyeVector, const vec3 eyeLightDir, const vec3 F0, const float dotNL) {\n\n      vec3 H = normalize(eyeVector + eyeLightDir);\n      float dotNH = saturate(dot(normal, H));\n      // D\n      float alphaSqr = precomputeGGX.y;\n      float denom = dotNH * dotNH * (alphaSqr - 1.0) + 1.0;\n      float D = alphaSqr / (PI * denom * denom);\n\n      // F\n      float dotLH = saturate(dot(eyeLightDir, H));\n      float dotLH5 = pow(1.0 - dotLH, 5.0);\n      vec3 F = vec3(F0) + (vec3(1.0) - F0) * (dotLH5);\n\n      // V\n      float visNL = G1V(dotNL, precomputeGGX.z);\n      return D * F * visNL * precomputeGGX.w;\n  }\n\n#endif\n\n#if defined(USE_ALBEDO2) || defined(USE_NORMALMAP2) || defined(USE_AOMAP2)\nvarying vec2 vUvDetail;\n#endif\n\nvarying vec2 vUv2;\n\n#ifdef USE_SHADOWMAP\n\n  #if NUM_DIR_LIGHTS > 0\n\n    uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];\n    varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n\n  #endif\n\n  #if NUM_SPOT_LIGHTS > 0\n\n    uniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHTS ];\n    varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n\n  #endif\n\n  #if NUM_POINT_LIGHTS > 0\n\n    uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHTS ];\n    varying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];\n\n  #endif\n#endif\n\n#ifdef USE_FOG\n\n  varying float fogDepth;\n\n#endif\n\nvoid main() {\n  vec4 worldPosition = modelMatrix * vec4(position, 1.0);\n\n  FragEyeVector = viewMatrix * worldPosition;\n\n  // FragPosition = worldPosition.xyz;\n\n  gl_Position = projectionMatrix * FragEyeVector;\n\n  vUv = uv.xy * offsetRepeat.zw + offsetRepeat.xy;\n\n  #if defined(USE_ALBEDO2) || defined(USE_NORMALMAP2) || defined(USE_AOMAP2)\n  vUvDetail = uv.xy * offsetRepeatDetail.zw + offsetRepeatDetail.xy;\n  #endif\n\n  FragNormal = normalMatrix * normal;\n  FragTangent.xyz = normalMatrix * tangent.xyz;\n  FragTangent.w = tangent.w;\n\n  vUv2 = uv2.xy;\n\n  #ifdef USE_SHADOWMAP\n\n    #if NUM_DIR_LIGHTS > 0\n\n      vDirectionalShadowCoord[ 0 ] = directionalShadowMatrix[ 0 ] * worldPosition;\n\n    #endif\n\n  #endif\n\n\n  #ifdef USE_FOG\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    fogDepth = -mvPosition.z;\n  #endif\n\n\n  #if NUM_DIR_LIGHTS > 0\n\n    // Precompute sun in VS because we have no normal map\n\n    DirectionalLight dirLight;\n\n    dirLight = directionalLights[0];\n\n    vec3 normalizedNormal = normalize(FragNormal);\n\n    vEyeLightDir = dirLight.direction;\n    vDotNL = dot(dirLight.direction, normalizedNormal);\n\n    vec3 eyeVector = normalize(-FragEyeVector.rgb);\n\n    vec4 prepGGX = vec4(0.251, 0.063, 0.125, 1.0);\n\n    vComputeGGXResult = computeGGX(prepGGX, normalizedNormal, eyeVector, dirLight.direction, vec3(0.05), vDotNL);\n\n  #endif\n\n}\n"
        };
    }, {}],
    45 : [function(_$$mdAnimate_, module, n) {
        var ctor = THREE.PerspectiveCamera;
        var TubularModel = _$$mdAnimate_("7");
        /**
         * @param {!Object} data
         * @return {undefined}
         */
        var update = function(data) {
            ctor.call(this);
            /** @type {number} */
            this.aspect = window.innerWidth / window.innerHeight;
            /** @type {number} */
            this.fov = 50;
            /** @type {number} */
            this.near = 1;
            /** @type {number} */
            this.far = 1E3;
            this.updateProjectionMatrix();
            this.controls = new TubularModel(this, data || document.body);
        };
        update.inherit(ctor, {
            update : function() {
                this.controls.update();
            }
        });
        /** @type {function(!Object): undefined} */
        module.exports = update;
    }, {
        7 : 7
    }],
    46 : [function($, module, n) {
        var result = $("59");
        var self = $("55");
        var normal = new THREE.Vector3(0, 1, 0);
        /**
         * @param {!Function} obj
         * @param {!Object} data
         * @param {!Object} transform
         * @return {undefined}
         */
        var update = function(obj, data, transform) {
            self.call(this, obj);
            /** @type {string} */
            this.name = "car";
            /** @type {number} */
            this.maxSpeed = .25;
            /** @type {number} */
            this.minSpeed = 0;
            /** @type {number} */
            this.speed = this.maxSpeed;
            /** @type {boolean} */
            this.stuck = false;
            /** @type {null} */
            this.restartTimer = null;
            this.add(data);
            /** @type {!Object} */
            this.mesh = data;
            /** @type {number} */
            this.radarRadius = (this._isLargeVehicle(), 20);
            this.position.copy(transform.position);
            var point = new THREE.Vector3(3.4, 0, 0);
            data.rotation.copy(transform.rotation);
            point.applyAxisAngle(normal, data.rotation.y);
            if (result.random() > .5) {
                this.position.add(point);
            } else {
                data.rotation.y += Math.PI;
                this.position.sub(point);
            }
            this.direction = data.getWorldDirection().negate();
            this.direction.set(Math.round(this.direction.x), Math.round(this.direction.y), Math.round(this.direction.z));
            this._initCollisionPoints();
        };
        update.inherit(self, {
            addRadarHelper : function() {
                var pregeom = new THREE.CircleGeometry(this.radarRadius, 32, 0, Math.PI / 2);
                var wrapper = new THREE.MeshBasicMaterial({
                    color : 16711935
                });
                var el = new THREE.Mesh(pregeom, wrapper);
                /** @type {string} */
                el.rotation.order = "YXZ";
                /** @type {number} */
                el.position.y = 1;
                /** @type {number} */
                el.rotation.x = -Math.PI / 2;
                el.rotation.y = this.mesh.rotation.y;
                this.add(el);
                this.helper = el;
            },
            detectCars : function(_data) {
                /** @type {number} */
                var _speed = .0075;
                /** @type {boolean} */
                var n = true;
                /** @type {null} */
                this.detectedCar = null;
                /** @type {number} */
                var dataIndex = 0;
                for (; dataIndex < _data.length; dataIndex++) {
                    var i = this.detectCar(_data[dataIndex]);
                    if (i) {
                        /** @type {boolean} */
                        n = false;
                        this.detectedCar = i;
                        break;
                    }
                }
                if (n) {
                    if (this.speed < this.maxSpeed) {
                        this.speed += _speed;
                        /** @type {number} */
                        this.speed = Math.min(this.speed, this.maxSpeed);
                    }
                    if (this.stuck) {
                        clearTimeout(this.restartTimer);
                        /** @type {boolean} */
                        this.stuck = false;
                        /** @type {number} */
                        this.minSpeed = 0;
                    }
                } else {
                    this.speed -= _speed;
                    /** @type {number} */
                    this.speed = Math.max(this.speed, this.minSpeed);
                    if (!(this.stuck || 0 !== this.speed)) {
                        /** @type {boolean} */
                        this.stuck = true;
                        /** @type {number} */
                        this.restartTimer = setTimeout(function() {
                            /** @type {number} */
                            this.minSpeed = .25 * this.maxSpeed;
                        }.bind(this), 2E3);
                    }
                }
            },
            detectCar : function() {
                var v1 = new THREE.Vector3;
                var v2 = new THREE.Vector3;
                var startGround = new THREE.Vector3;
                var endGround = new THREE.Vector3;
                var orig = new THREE.Vector3;
                return function(obj) {
                    /** @type {boolean} */
                    var c = obj.detectedCar === this;
                    /** @type {boolean} */
                    var length = false;
                    if (c) {
                        return null;
                    }
                    if (this.isOnIntersection() && !obj.isOnIntersection() && !this.direction.equals(obj.direction)) {
                        return null;
                    }
                    obj.updateMatrix();
                    v1.copy(this.direction);
                    v1.applyAxisAngle(normal, -Math.PI / 4);
                    result.getTablePosition(this.position, this.parent.tableX, this.parent.tableY, startGround);
                    /** @type {number} */
                    var i = 0;
                    for (; i < obj.collisionPoints.length; i++) {
                        var pos = obj.collisionPoints[i];
                        orig.copy(pos).applyMatrix4(obj.matrix);
                        result.getTablePosition(orig, obj.parent.tableX, obj.parent.tableY, endGround);
                        var length = startGround.distanceTo(endGround);
                        if (length <= this.radarRadius) {
                            v2.subVectors(endGround, startGround).normalize();
                            var delta = v1.dot(v2);
                            if (delta > .5) {
                                /** @type {boolean} */
                                length = true;
                                break;
                            }
                        }
                    }
                    return length ? obj : null;
                };
            }(),
            update : function() {
                var value = new THREE.Vector3;
                return function() {
                    value.copy(this.direction).multiplyScalar(this.speed);
                    this.position.add(value);
                    result.roundVector(this.position, 2);
                    this._updateTablePosition();
                    var fakeMutation = this.table.getNeighboringCars(this);
                    this.detectCars(fakeMutation);
                };
            }(),
            isOnIntersection : function() {
                return this.position.x < -20 && this.position.x > -40 && this.position.z < -20 && this.position.z > -40;
            },
            _initCollisionPoints : function() {
                var self = new THREE.Box3;
                self.setFromObject(this.mesh);
                var p = new THREE.Vector3;
                p.copy(self.min);
                this.worldToLocal(p);
                /** @type {number} */
                p.y = 1;
                if (Math.abs(this.direction.x) > 0) {
                    /** @type {number} */
                    p.z = 0;
                } else {
                    /** @type {number} */
                    p.x = 0;
                }
                var b = new THREE.Vector3;
                b.copy(self.max);
                this.worldToLocal(b);
                /** @type {number} */
                b.y = 1;
                if (Math.abs(this.direction.x) > 0) {
                    /** @type {number} */
                    b.z = 0;
                } else {
                    /** @type {number} */
                    b.x = 0;
                }
                /** @type {!Array} */
                this.collisionPoints = [p, b];
                this.collisionPoints.forEach(function(canCreateDiscussions) {
                }, this);
            },
            _isLargeVehicle : function() {
                return this.mesh.name.indexOf("Bus") !== -1 || this.mesh.name.indexOf("Container") !== -1 || this.mesh.name.indexOf("Truck") !== -1;
            }
        });
        /** @type {function(!Function, !Object, !Object): undefined} */
        module.exports = update;
    }, {
        55 : 55,
        59 : 59
    }],
    47 : [function(propertyFactory, module, n) {
        var properties = propertyFactory("50");
        /**
         * @return {undefined}
         */
        var Application = function() {
            THREE.Scene.call(this);
            /** @type {!Array} */
            this._pickables = [];
            /** @type {!Array} */
            this.chunks = [];
            this._initChunks();
        };
        Application.inherit(THREE.Scene, {
            _initChunks : function() {
                /** @type {number} */
                var j = 0;
                for (; j < properties.CHUNK_COUNT; j++) {
                    /** @type {number} */
                    var i = 0;
                    for (; i < properties.CHUNK_COUNT; i++) {
                        if (void 0 === this.chunks[i]) {
                            /** @type {!Array} */
                            this.chunks[i] = [];
                        }
                        var id = this._createChunkAt(i, j);
                        this.chunks[i][j] = id;
                        this.add(id);
                    }
                }
            },
            _createChunkAt : function(x, time) {
                var settings = new THREE.Object3D;
                var pregeom = new THREE.PlaneGeometry(properties.CHUNK_SIZE, properties.CHUNK_SIZE, 1, 1);
                var wheelAxisMat = new THREE.MeshBasicMaterial;
                var data = new THREE.Mesh(pregeom, wheelAxisMat);
                /** @type {number} */
                var left = (properties.CHUNK_COUNT - 1) / 2 * -properties.CHUNK_SIZE;
                /** @type {number} */
                var i = left;
                return data.rotation.x = -Math.PI / 2, data.centeredX = x - Math.floor(properties.CHUNK_COUNT / 2), data.centeredY = time - Math.floor(properties.CHUNK_COUNT / 2), data.material.visible = false, this._pickables.push(data), settings.position.x = left + x * properties.CHUNK_SIZE, settings.position.z = i + time * properties.CHUNK_SIZE, settings.centeredX = data.centeredX, settings.centeredY = data.centeredY, settings.material = data.material, settings.add(data), settings;
            },
            getPickables : function() {
                return this._pickables;
            },
            forEachChunk : function(func) {
                /** @type {number} */
                var i = 0;
                for (; i < properties.CHUNK_COUNT; i++) {
                    /** @type {number} */
                    var j = 0;
                    for (; j < properties.CHUNK_COUNT; j++) {
                        var value = this.chunks[i][j];
                        func(value, value.centeredX, value.centeredY);
                    }
                }
            }
        });
        /** @type {function(): undefined} */
        module.exports = Application;
    }, {
        50 : 50
    }],
    48 : [function(require, module, n) {
        /**
         * @param {!Object} options
         * @return {?}
         */
        function _(options) {
            return options[Math.floor(Common.random() * options.length)];
        }
        var options = require("50");
        var Tab = require("46");
        var Buffer = require("49");
        var Common = require("59");
        /**
         * @param {!Function} data
         * @param {!Object} options
         * @param {number} prop
         * @param {?} index
         * @param {?} vertices
         * @return {undefined}
         */
        var update = function(data, options, prop, index, vertices) {
            /** @type {boolean} */
            this._containsStadium = false;
            /** @type {!Function} */
            this.blocks = data;
            /** @type {!Array} */
            this.lanes = [];
            /** @type {number} */
            this.intersections = prop;
            this.carObjects = index;
            /** @type {!Array} */
            this.mobs = [];
            /** @type {!Array} */
            this.chunks = [];
            this.cloudObjects = vertices;
            options.forEach(function(t) {
                switch(t.name) {
                    case "Road_Lane_01_fixed":
                        /** @type {number} */
                        var e = 0;
                        for (; e < 10; e++) {
                            this.lanes.push(t);
                        }
                        break;
                    case "Road_Lane_03_fixed":
                        /** @type {number} */
                        e = 0;
                        for (; e < 5; e++) {
                            this.lanes.push(t);
                        }
                }
            }, this);
            this._generate();
        };
        update.inherit(Object, {
            getChunkData : function(i, x) {
                return i = i % options.TABLE_SIZE, x = x % options.TABLE_SIZE, i < 0 && (i = options.TABLE_SIZE + i), x < 0 && (x = options.TABLE_SIZE + x), void 0 !== this.chunks[i] && (void 0 !== this.chunks[i][x] && this.chunks[i][x]);
            },
            getNeighboringCars : function() {
                /** @type {!Array} */
                var exports = [];
                return function(s) {
                    return exports.length = 0, s.parent.traverse(function(sub) {
                        if ("car" === sub.name && sub !== s) {
                            exports.push(sub);
                        }
                    }), this._forEachNeighboringChunk(s.parent.tableX, s.parent.tableY, function(spUtils) {
                        spUtils.traverse(function(e) {
                            if ("car" === e.name) {
                                exports.push(e);
                            }
                        });
                    }), exports;
                };
            }(),
            update : function(target) {
                this.mobs.forEach(function(e) {
                    e.update(target);
                });
            },
            _forEachNeighboringChunk : function() {
                var menu = new THREE.Vector2;
                /** @type {!Array} */
                var pipelets = [new THREE.Vector2(-1, -1), new THREE.Vector2(1, 0), new THREE.Vector2(1, 0), new THREE.Vector2(0, 1), new THREE.Vector2(0, 1), new THREE.Vector2(-1, 0), new THREE.Vector2(-1, 0), new THREE.Vector2(0, -1)];
                return function(n, r, expect) {
                    menu.set(n, r);
                    pipelets.forEach(function(e) {
                        menu.add(e);
                        var each1 = this.getChunkData(menu.x, menu.y);
                        if (each1) {
                            expect(each1.node);
                        }
                    }, this);
                };
            }(),
            _getNeighboringBlocks : function() {
                /** @type {!Array} */
                var parkNames = [];
                return function(e, n) {
                    return parkNames.length = 0, this._forEachNeighboringChunk(e, n, function(dep) {
                        parkNames.push(dep.block.name);
                    }), parkNames;
                };
            }(),
            _getRandomBlockAt : function(pieceX, pieceY) {
                var fileTooLarge;
                /** @type {number} */
                var i = 0;
                var piece = this._getNeighboringBlocks(pieceX, pieceY);
                for (; i < 100;) {
                    var file = _(this.blocks).clone();
                    var type = file.name;
                    if ("block_8_merged" === type) {
                        if (this._containsStadium) {
                            i++;
                            continue;
                        }
                        /** @type {boolean} */
                        this._containsStadium = true;
                        fileTooLarge = file;
                        break;
                    }
                    if (piece.indexOf(type) === -1) {
                        fileTooLarge = file;
                        break;
                    }
                    i++;
                }
                return fileTooLarge;
            },
            _getRandomChunk : function(x, y) {
                var matrix = new THREE.Matrix4;
                var matrixWorldInverse = (new THREE.Matrix4).makeRotationY(Math.PI / 2);
                var self = new THREE.Object3D;
                /** @type {string} */
                self.name = "chunk";
                var block = this._getRandomBlockAt(x, y);
                /** @type {number} */
                var defaultYPos = Math.round(4 * Common.random()) * (Math.PI / 2);
                /** @type {number} */
                block.rotation.y = defaultYPos;
                block.position.set(0, 0, 0);
                self.add(block);
                self.block = block;
                /** @type {!Array} */
                var d = [];
                var result = _(this.lanes).clone();
                result.position.set(-30, 0, 10);
                self.add(result);
                d.push(result);
                var object = _(this.lanes).clone();
                object.position.set(-30, 0, -10);
                matrix.makeTranslation(0, 0, -20);
                object.geometry = object.geometry.clone();
                result.geometry = result.geometry.clone();
                object.geometry.applyMatrix(matrix);
                d.push(object);
                var mesh = _(this.lanes).clone();
                mesh.position.set(-10, 0, -30);
                /** @type {number} */
                mesh.rotation.y = Math.PI / 2;
                d.push(mesh);
                matrix.makeTranslation(20, 0, -40);
                mesh.geometry = mesh.geometry.clone();
                mesh.geometry.applyMatrix(matrixWorldInverse);
                mesh.geometry.applyMatrix(matrix);
                var o = _(this.lanes).clone();
                o.geometry = o.geometry.clone();
                o.position.set(10, 0, -30);
                /** @type {number} */
                o.rotation.y = Math.PI / 2;
                matrix.makeTranslation(40, 0, -40);
                o.geometry.applyMatrix(matrixWorldInverse);
                o.geometry.applyMatrix(matrix);
                d.push(o);
                var g = result.geometry.join([object.geometry, mesh.geometry, o.geometry]);
                result.geometry = g;
                var r = _(this.intersections).clone();
                if (r.position.set(-30, 0, 30), self.add(r), d.forEach(function(index) {
                    /** @type {number} */
                    var e = window.isMobile ? .2 : .35;
                    if (Common.random() < e) {
                        var id = _(this.carObjects).clone();
                        var tab = new Tab(this, id, index);
                        self.add(tab);
                        this.mobs.push(tab);
                    }
                }, this), Common.random() > .65) {
                    var hex = _(this.cloudObjects).clone();
                    var b = new Buffer(this, hex);
                    self.add(b);
                    this.mobs.push(b);
                }
                return self.traverse(function(object) {
                    if (object instanceof THREE.Mesh && object.material && object.material.pbr) {
                        /** @type {boolean} */
                        object.material.defines.USE_FOG = true;
                        if (object instanceof Buffer == false) {
                            /** @type {boolean} */
                            object.receiveShadow = true;
                            /** @type {boolean} */
                            object.material.defines.USE_SHADOWMAP = true;
                            /** @type {boolean} */
                            object.material.defines[options.SHADOWMAP_TYPE] = true;
                        }
                    }
                }), self;
            },
            _generate : function() {
                /** @type {number} */
                var i = 0;
                for (; i < options.TABLE_SIZE; i++) {
                    /** @type {number} */
                    var x = 0;
                    for (; x < options.TABLE_SIZE; x++) {
                        if (void 0 === this.chunks[x]) {
                            /** @type {!Array} */
                            this.chunks[x] = [];
                        }
                        var n = this._getRandomChunk(x, i);
                        /** @type {number} */
                        n.tableX = x;
                        /** @type {number} */
                        n.tableY = i;
                        this.chunks[x][i] = {
                            node : n
                        };
                    }
                }
            }
        });
        /** @type {function(!Function, !Object, number, ?, ?): undefined} */
        module.exports = update;
    }, {
        46 : 46,
        49 : 49,
        50 : 50,
        59 : 59
    }],
    49 : [function(floor, module, n) {
        var startYNew = floor("50");
        var a = floor("55");
        var w = floor("59");
        /** @type {number} */
        var ratio = .05;
        /** @type {number} */
        var planetsSpeed = 2;
        /**
         * @param {!Function} name
         * @param {!Object} obj
         * @return {undefined}
         */
        var render = function(name, obj) {
            a.call(this, name);
            this.add(obj);
            this.position.set(w.random() * startYNew.CHUNK_SIZE - startYNew.CHUNK_SIZE / 2, 60, w.random() * startYNew.CHUNK_SIZE - startYNew.CHUNK_SIZE / 2);
            /** @type {number} */
            this.delay = 5 * w.random();
            /** @type {number} */
            this.speedModifier = .25 * w.random() + 1;
            /** @type {number} */
            this.moveSpeed = .05 * this.speedModifier;
            this.maxScalar = this.scale.x + this.scale.x * ratio;
            /** @type {number} */
            this.minScalar = this.scale.x - this.scale.x * ratio;
            /** @type {number} */
            this.rotation.y = .25;
            this.direction = new THREE.Vector3(-1, 0, .3);
        };
        render.inherit(a, {
            update : function() {
                var value = new THREE.Vector3;
                return function(event) {
                    var n = THREE.Math.mapLinear(Math.sin((this.delay + event.elapsed) * planetsSpeed), -1, 1, 0, 1);
                    this.scale.setScalar(this.minScalar + (this.maxScalar - this.minScalar) * n);
                    value.copy(this.direction).multiplyScalar(this.moveSpeed);
                    this.position.add(value);
                    this._updateTablePosition();
                };
            }()
        });
        /** @type {function(!Function, !Object): undefined} */
        module.exports = render;
    }, {
        50 : 50,
        55 : 55,
        59 : 59
    }],
    50 : [function(canCreateDiscussions, context, n) {
        var state = {
            FPS : false,
            LOG_CALLS : false,
            RANDOM_SEED : "infinitown",
            RANDOM_SEED_ENABLED : false,
            MAX_PIXEL_RATIO : 1.25,
            SHADOWMAP_RESOLUTION : window.isMobile ? 1024 : 2048,
            SHADOWMAP_TYPE : "SHADOWMAP_TYPE_PCF",
            TABLE_SIZE : 9,
            CHUNK_COUNT : 9,
            CHUNK_SIZE : 60,
            CAMERA_ANGLE : .5,
            PAN_SPEED : window.isMobile ? .4 : .1,
            FOG_NEAR : 225,
            FOG_FAR : 325,
            FOG_COLOR : 10676479
        };
        context.exports = state;
    }, {}],
    51 : [function(canCreateDiscussions, mixin, n) {
        /** @type {!Array} */
        mixin.exports = ["textures/white.png", "textures/normal.png", "textures/vignetting.png"];
    }, {}],
    52 : [function(require, context, n) {
        /**
         * @param {!Object} touches
         * @return {?}
         */
        function getDistance(touches) {
            return Math.sqrt((touches[0].clientX - touches[1].clientX) * (touches[0].clientX - touches[1].clientX) + (touches[0].clientY - touches[1].clientY) * (touches[0].clientY - touches[1].clientY));
        }
        var canvas = require("3");
        require("33")($);
        /**
         * @param {!Object} obj
         * @return {undefined}
         */
        var init = function(obj) {
            /** @type {boolean} */
            var e = false;
            /** @type {number} */
            var radius = 0;
            obj = void 0 !== obj ? obj : window;
            $(obj).on("mousedown", function(event) {
                var e = {
                    x : event.pageX,
                    y : event.pageY
                };
                this.trigger("startdrag", e);
            }.bind(this));
            $(obj).on("mouseup", function(event) {
                var e = {
                    x : event.pageX,
                    y : event.pageY
                };
                this.trigger("enddrag", e);
            }.bind(this));
            $(obj).on("mousemove", function(event) {
                var e = {
                    x : event.pageX,
                    y : event.pageY
                };
                this.trigger("drag", e);
            }.bind(this));
            $(obj).on("mouseleave", function(event) {
                var e = {
                    x : event.pageX,
                    y : event.pageY
                };
                this.trigger("enddrag", e);
            }.bind(this));
            $(obj).on("touchstart", function(event) {
                if (2 === event.touches.length) {
                    /** @type {boolean} */
                    e = true;
                    radius = getDistance(event.originalEvent.touches);
                    this.trigger("pinchstart");
                } else {
                    if (1 === event.touches.length) {
                        var startP1 = {
                            x : event.touches[0].pageX,
                            y : event.touches[0].pageY
                        };
                        this.trigger("startdrag", startP1);
                    }
                }
            }.bind(this));
            $(obj).on("touchend", function(event) {
                var startP1 = {
                    x : 0,
                    y : 0
                };
                if (0 === event.originalEvent.touches.length) {
                    if (e) {
                        /** @type {boolean} */
                        e = false;
                        this.trigger("pinchend");
                    }
                    this.trigger("enddrag", startP1);
                }
            }.bind(this));
            $(obj).on("touchmove", function(event) {
                if (e) {
                    var touches = event.originalEvent.touches;
                    if (2 === touches.length) {
                        /** @type {number} */
                        var y1 = getDistance(touches) - radius;
                        /** @type {number} */
                        var sql_date = Math.max(1 + y1 / 100, 0);
                        this.trigger("pinchchange", sql_date);
                    }
                } else {
                    var startP1 = {
                        x : event.touches[0].pageX,
                        y : event.touches[0].pageY
                    };
                    this.trigger("drag", startP1);
                }
                event.preventDefault();
            }.bind(this));
            $(obj).on("mousewheel", function(touch) {
                var dy = touch.deltaY;
                this.trigger("mousewheel", dy);
            }.bind(this));
        };
        init.mixin(canvas);
        /** @type {function(!Object): undefined} */
        context.exports = init;
    }, {
        3 : 3,
        33 : 33
    }],
    53 : [function(require, canCreateDiscussions, n) {
        debugger
        /**
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
    }, {
        14 : 14,
        15 : 15,
        17 : 17,
        18 : 18,
        28 : 28,
        3 : 3,
        43 : 43,
        44 : 44,
        50 : 50,
        51 : 51
    }],
    54 : [function(pick, globalContext, n) {
        var parent = pick("21");
        var shaders = pick("44");
        /**
         * @param {!Function} obj
         * @return {undefined}
         */
        var Class = function(obj) {
            /** @type {!Object} */
            obj = Object.assign({
                vertexShader : shaders["basic.vs"],
                fragmentShader : shaders["basic.fs"],
                uniforms : {
                    diffuse : {
                        value : new THREE.Color(16711935)
                    },
                    map : {
                        value : null
                    },
                    offsetRepeat : {
                        value : new THREE.Vector4(0, 0, 1, 1)
                    },
                    opacity : {
                        value : 1
                    }
                }
            }, obj);
            parent.call(this, obj);
            Object.keys(this.uniforms).forEach(function(name) {
                this.onPropertyChange(name, function(initSBC) {
                    /** @type {!Object} */
                    this.uniforms[name].value = initSBC;
                });
            }, this);
        };
        Class.inherit(parent, {
            clone : function(params) {
                var data = params || new Class;
                return parent.prototype.clone.call(this, data), data.name = this.name, data.transparent = this.transparent, _.each(this.uniforms, function(dom, name) {
                    var value = dom.type;
                    if ("v2" === value || "m4" === value) {
                        data.uniforms[name].value.copy(dom.value);
                    } else {
                        data.uniforms[name].value = dom.value;
                    }
                }, this), data;
            }
        });
        /** @type {function(!Function): undefined} */
        globalContext.exports = Class;
    }, {
        21 : 21,
        44 : 44
    }],
    55 : [function(require, module, n) {
        var rect = require("50");
        var $ = require("59");
        /** @type {number} */
        var MIN_BUFFER_ROWS = rect.CHUNK_SIZE * rect.TABLE_SIZE;
        var clamp = THREE.Math.euclideanModulo;
        /**
         * @param {string} data
         * @return {undefined}
         */
        var render = function(data) {
            THREE.Object3D.call(this);
            /** @type {null} */
            this.previousChunk = null;
            /** @type {string} */
            this.table = data;
            this.tablePosition = new THREE.Vector3;
            this.lastTablePosition = new THREE.Vector3;
            this.lastPosition = new THREE.Vector3;
        };
        render.inherit(THREE.Object3D, {
            _updateTablePosition : function() {
                $.getTablePosition(this.position, this.parent.tableX, this.parent.tableY, this.tablePosition);
                if (0 === this.lastTablePosition.length()) {
                    this.lastTablePosition.copy(this.tablePosition);
                }
                /** @type {number} */
                var t = this.tablePosition.x - this.lastTablePosition.x;
                /** @type {number} */
                var e = this.tablePosition.z - this.lastTablePosition.z;
                this.lastTablePosition.copy(this.tablePosition);
                /** @type {number} */
                var i = Math.floor(clamp(this.tablePosition.x + 40, MIN_BUFFER_ROWS) / rect.CHUNK_SIZE);
                /** @type {number} */
                var name = Math.floor(clamp(this.tablePosition.z + 40, MIN_BUFFER_ROWS) / rect.CHUNK_SIZE);
                var context = this.parent;
                var dom = this.table.chunks[i][name].node;
                if (Math.abs(t) < 500 && Math.abs(t) > 20 && console.log("warp on X", t, context.tableX, dom.tableX), Math.abs(e) < 500 && Math.abs(e) > 20 && console.log("warp on Z", e, context.tableY, dom.tableY), this.previousChunk !== context && context !== dom, this.lastPosition.copy(this.position), dom !== context) {
                    dom.add(this);
                    /** @type {number} */
                    var min_x = clamp(this.position.x + 40, rect.CHUNK_SIZE) - 40;
                    /** @type {number} */
                    var _depth = clamp(this.position.z + 40, rect.CHUNK_SIZE) - 40;
                    /** @type {number} */
                    this.position.x = min_x;
                    /** @type {number} */
                    this.position.z = _depth;
                }
                this.previousChunk = context;
            }
        });
        /** @type {function(string): undefined} */
        module.exports = render;
    }, {
        50 : 50,
        59 : 59
    }],
    56 : [function(saveNotifs, module, n) {
        var Base = THREE.OrthographicCamera;
        /** @type {function(number): undefined} */
        var $ = (saveNotifs("7"), function(hValue) {
            Base.call(this);
            /** @type {number} */
            var r = window.innerWidth / window.innerHeight;
            /** @type {number} */
            this.left = hValue / -2 * r;
            /** @type {number} */
            this.right = hValue / 2 * r;
            /** @type {number} */
            this.top = hValue / 2;
            /** @type {number} */
            this.bottom = hValue / -2;
            /** @type {number} */
            this.near = .01;
            /** @type {number} */
            this.far = 500;
            this.updateProjectionMatrix();
        });
        $.inherit(Base, {
            update : function() {
            }
        });
        /** @type {function(number): undefined} */
        module.exports = $;
    }, {
        7 : 7
    }],
    57 : [function($, context, n) {
        var et = $("50");
        var canvas = $("3");
        var ndc = new THREE.Vector2;
        /**
         * @param {!Function} obj
         * @param {!Object} scene
         * @param {!Object} camera
         * @return {undefined}
         */
        var init = function(obj, scene, camera) {
            /** @type {boolean} */
            this._panning = false;
            this._startCoords = new THREE.Vector2;
            this._lastOffset = new THREE.Vector2;
            this._offset = new THREE.Vector2;
            this._speed = new THREE.Vector3(et.PAN_SPEED, 0, et.PAN_SPEED);
            this._sceneOffset = new THREE.Vector3;
            this._worldOffset = new THREE.Vector3;
            /** @type {!Function} */
            this.inputManager = obj;
            /** @type {!Object} */
            this._scene = scene;
            this.inputManager.on("startdrag", this._onStartDrag, this);
            this.inputManager.on("enddrag", this._onEndDrag, this);
            this.inputManager.on("drag", this._onDrag, this);
            /** @type {!Object} */
            this._camera = camera;
            this._raycaster = new THREE.Raycaster;
            /** @type {boolean} */
            this.enabled = true;
        };
        init.inherit(Object, {
            _onStartDrag : function(e) {
                if (this.enabled) {
                    /** @type {boolean} */
                    this._panning = true;
                    this._startCoords.set(e.x, e.y);
                }
            },
            _onEndDrag : function(e) {
                if (this.enabled) {
                    /** @type {boolean} */
                    this._panning = false;
                    this._lastOffset.copy(this._offset);
                }
            },
            _onDrag : function(canCreateDiscussions) {
                var vector = new THREE.Vector2;
                return function(planeOrigin) {
                    if (this.enabled && this._panning) {
                        vector.subVectors(planeOrigin, this._startCoords);
                        this._offset.addVectors(this._lastOffset, vector);
                    }
                };
            }(),
            raycast : function() {
                this._raycaster.setFromCamera(ndc, this._camera);
                var intersectors = this._raycaster.intersectObjects(this._scene.getPickables());
                if (intersectors.length > 0) {
                    var settings = intersectors[0].object;
                    this._sceneOffset.x += settings.centeredX * et.CHUNK_SIZE;
                    this._sceneOffset.z += settings.centeredY * et.CHUNK_SIZE;
                    if (!(0 === settings.centeredX && 0 === settings.centeredY)) {
                        this.trigger("move", settings.centeredX, settings.centeredY);
                    }
                }
            },
            update : function() {
                var offset = new THREE.Vector2;
                var angle = new THREE.Vector2;
                var point = new THREE.Vector3;
                return function() {
                    this.raycast();
                    offset.copy(this._offset);
                    offset.rotateAround(angle, -Math.PI / 4);
                    this._worldOffset.set(offset.x, 0, offset.y).multiply(this._speed);
                    point.lerp(this._worldOffset, .05);
                    this._scene.position.addVectors(this._sceneOffset, point);
                };
            }()
        });
        init.mixin(canvas);
        /** @type {function(!Function, !Object, !Object): undefined} */
        context.exports = init;
    }, {
        3 : 3,
        50 : 50
    }],
    58 : [function(canCreateDiscussions, module, n) {
        var ctor = THREE.PerspectiveCamera;
        var value = new THREE.Vector3;
        /**
         * @return {undefined}
         */
        var $ = function() {
            ctor.apply(this, arguments);
            /** @type {number} */
            this.targetHeight = 140;
        };
        $.inherit(ctor, {
            updateHeight : function() {
                /** @type {number} */
                var length = 1E3;
                /** @type {number} */
                var vertCoords = -100;
                return function(i, canCreateDiscussions) {
                    /** @type {number} */
                    i = i * vertCoords;
                    length = length + i;
                    /** @type {number} */
                    length = Math.min(Math.max(length + i, 0), 1E3);
                    this.targetHeight = THREE.Math.mapLinear(length, 0, 1E3, 30, 140);
                    if (canCreateDiscussions) {
                        this.position.y = this.targetHeight;
                    }
                };
            }(),
            update : function() {
                this.position.y += .05 * (this.targetHeight - this.position.y);
                this.lookAt(value);
            }
        });
        /** @type {function(): undefined} */
        module.exports = $;
    }, {}],
    59 : [function($, module, n) {
        var bindHandlers = $("35");
        var seg = $("50");
        var types = {
            random : function() {
                var colContentLeft = bindHandlers(seg.RANDOM_SEED);
                return function() {
                    return seg.RANDOM_SEED_ENABLED ? colContentLeft() : Math.random();
                };
            }(),
            roundVector : function(center, size) {
                if (void 0 === size || 0 === size) {
                    return center.round(), center;
                }
                /** @type {number} */
                var scale = Math.pow(10, size);
                return center.x = Math.round(center.x * scale) / scale, center.y = Math.round(center.y * scale) / scale, center.z = Math.round(center.z * scale) / scale, center;
            },
            getTablePosition : function(origin, scale, radius, first) {
                return first.x = seg.CHUNK_SIZE * scale + origin.x, first.z = seg.CHUNK_SIZE * radius + origin.z, first;
            }
        };
        module.exports = types;
    }, {
        35 : 35,
        50 : 50
    }],
    60 : [function(parseValueFn, context, n) {
        var value = parseValueFn("15");
        /**
         * @return {undefined}
         */
        var init = function() {
            this._quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
            /** @type {boolean} */
            this._quad.frustumCulled = false;
            this._camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            this._scene = new THREE.Scene;
            this._scene.add(this._quad);
            this._quad.material = new THREE.MeshBasicMaterial({
                map : value.getTexture("textures/vignetting.png"),
                transparent : true,
                opacity : .25
            });
        };
        init.inherit(Object, {
            render : function(renderer) {
                renderer.render(this._scene, this._camera);
            }
        });
        /** @type {function(): undefined} */
        context.exports = init;
    }, {
        15 : 15
    }]
}

var fs = require('fs')

for (var b in s){
    fs.writeFile("module/" + b + ".js", "var town" + b+ "="+ s[b][0],function (err) {
        if(err){
            console.log("失败")
        }else {
            console.log("成功")
        }
    })
}
