!function t(e, n, r) {
    function i(a, s) {
        if (!n[a]) {
            if (!e[a]) {
                var c = "function" == typeof require && require;
                if (!s && c) return c(a, !0);
                if (o) return o(a, !0);
                var u = new Error("Cannot find module '" + a + "'");
                throw u.code = "MODULE_NOT_FOUND", u
            }
            var l = n[a] = {exports: {}};
            e[a][0].call(l.exports, function (t) {
                var n = e[a][1][t];
                return i(n ? n : t)
            }, l, l.exports, t, e, n, r)
        }
        return n[a].exports
    }

    for (var o = "function" == typeof require && require, a = 0; a < r.length; a++) i(r[a]);
    return i
}({
    1: [function (t, e, n) {
        function r(t) {
            var e = window.WIDTH = window.innerWidth, n = window.HEIGHT = window.innerHeight;
            window.parent && (e = window.parent.innerWidth, n = window.parent.innerHeight), this.setSize(e, n)
        }

        function i(t) {
            var e, n;
            "undefined" != typeof document.hidden ? (e = "hidden", n = "visibilitychange") : "undefined" != typeof document.mozHidden ? (e = "mozHidden", n = "mozvisibilitychange") : "undefined" != typeof document.msHidden ? (e = "msHidden", n = "msvisibilitychange") : "undefined" != typeof document.webkitHidden && (e = "webkitHidden", n = "webkitvisibilitychange"), "undefined" != typeof document.addEventListener && document.addEventListener(n, function () {
                document[e] ? t.onLeaveTab() : setTimeout(t.onFocusTab.bind(t), 50)
            }, !1)
        }

        function o(t) {
        }

        var a = t("3"), s = t("6"), c = t("2"), u = function (t) {
            if (t = void 0 !== t ? t : {}, this.renderer = new THREE.WebGLRenderer({
                alpha: !0,
                antialias: !0,
                canvas: t.canvas || document.querySelector("canvas"),
                preserveDrawingBuffer: void 0 !== t.preserveDrawingBuffer ? t.preserveDrawingBuffer : void 0
            }), THREE.Extensions = this.renderer.extensions, this.config = {
                fps: void 0 !== t.fps && t.fps,
                profiling: void 0 !== t.profiling && t.profiling,
                logCalls: void 0 !== t.logCalls && t.logCalls
            }, t && t.maxPixelRatio) var e = window.devicePixelRatio > t.maxPixelRatio ? t.maxPixelRatio : window.devicePixelRatio; else var e = window.devicePixelRatio;
            window.isMobile && (e = e > 1.5 ? 1.5 : e), this.renderer.setPixelRatio(e), this.setSize(t.width || window.innerWidth, t.height || window.innerHeight), void 0 !== t.autoClear && (this.renderer.autoClear = t.autoClear), void 0 !== t.clearColor && this.renderer.setClearColor(t.clearColor), void 0 !== t.supportsTextureLod && t.supportsTextureLod !== !0 || THREE.Extensions.get("EXT_shader_texture_lod"), this.clock = new THREE.Clock, this.paused = !1, this.scenes = [], this.scene = null, window.onresize = r.bind(this), window.addEventListener("keyup", o.bind(this)), this.renderer.domElement.addEventListener("mousemove", function (t) {
                window.mouseX = t.pageX / WIDTH * 2 - 1, window.mouseY = 1 - t.pageY / HEIGHT * 2
            }), this.config.fps && (this.fpsCounter = new c, this.counter = document.createElement("div"), document.querySelectorAll("body")[0].appendChild(this.counter), this.counter.setAttribute("style", "position:absolute;top:20px;left:100px;color:#ff00ff;display:block !important;z-index:999999;")), i(this), this.config.logCalls && this.initDrawCallsCounter()
        };
        u.prototype = {
            initDrawCallsCounter: function () {
                var t = $("<div id='dc'></div>");
                $("body").append(t), t.css("position", "absolute").css("display", "block !important").css("color", "yellow").css("top", "60px").css("left", "20px").css("padding", "3px").css("font-size", "2em").css("background-color", "black").css("z-index", "999999"), this.dcCounter = t[0]
            }, render: function (t) {
                var e = 0, n = function () {
                    this.config.logCalls && (e += this.renderer.info.render.calls)
                }.bind(this);
                this.renderScene(this.scene, this.camera), n(), this.config.logCalls && (this.dcCounter.textContent = e + " DC")
            }, renderScene: function (t, e) {
                this.renderer.render(t, e)
            }, update: function (t) {
                this.camera && (this.camera.updateMatrixWorld(!0), this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld)), _.each(this.scenes, function (e) {
                    this.updateCustomMaterials(e), e.update && (e.updateMatrixWorld(!0), e.update(this.renderer, t))
                }, this)
            }, updateCustomMaterials: function (t, e) {
                _.each(t.materials, function (t) {
                    t.pbr && t.refreshUniforms(e || this.camera, this.envRotation)
                }, this)
            }, doUpdate: function () {
                var t = {delta: 0, elapsed: 0};
                return function () {
                    if (t.delta = this.clock.getDelta(), t.elapsed = this.clock.getElapsedTime(), !this.paused) {
                        this.requestAnimationFrame(this.doUpdate.bind(this));
                        var e = void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now();
                        TWEEN.update(e), s.updateTimers(t), this.config.profiling && console.time("update"), this.update(t), this.config.profiling && console.timeEnd("update"), this.render(t), this.started || (this.started = !0), this.config.fps && this.fpsCounter.update(t, function (t) {
                            this.counter.textContent = t + " FPS"
                        }.bind(this))
                    }
                }
            }(), start: function () {
                this.doUpdate()
            }, pause: function () {
                this.paused || (this.clock.stop(), this.paused = !0, this.config.fps && (this.counter.textContent += " (paused)"))
            }, resume: function () {
                this.paused && (this.clock.start(), this.paused = !1, this.started && this.doUpdate())
            }, onLeaveTab: function () {
                this.paused || (this.pause(), this.shouldResume = !0)
            }, onFocusTab: function () {
                this.shouldResume && (this.resume(), this.shouldResume = !1)
            }, setAspectRatio: function (t) {
                this.camera && (this.camera.aspect = t, this.camera.updateProjectionMatrix())
            }, setSize: function (t, e) {
                this.started && this.setAspectRatio(t / e), this.renderer.setSize(t, e)
            }, requestAnimationFrame: function (t) {
                requestAnimationFrame(t)
            }
        }, u.mixin(a), e.exports = u
    }, {2: 2, 3: 3, 6: 6}],
    2: [function (t, e, n) {
        var r = function () {
            this.frames = 0, this.fps = 0, this.lastTime = 0
        };
        r.prototype = {
            update: function (t, e) {
                var t = 1e3 * t.elapsed;
                this.frames++, t > this.lastTime + 1e3 && (this.fps = Math.round(1e3 * this.frames / (t - this.lastTime)), e(this.fps), this.lastTime = t, this.frames = 0)
            }
        }, e.exports = r
    }, {}],
    3: [function (t, e, n) {
        var r = {
            on: function (t, e, n) {
                if (!s(this, "on", t, [e, n]) || !e) return this;
                this._events || (this._events = {});
                var r = this._events[t] || (this._events[t] = []);
                return r.push({callback: e, context: n, ctx: n || this}), this
            }, once: function (t, e, n) {
                if (!s(this, "once", t, [e, n]) || !e) return this;
                var r = this, i = _.once(function () {
                    r.off(t, i), e.apply(this, arguments)
                });
                return i._callback = e, this.on(t, i, n)
            }, off: function (t, e, n) {
                var r, i, o, a, c, u, l, f;
                if (!this._events || !s(this, "off", t, [e, n])) return this;
                if (!t && !e && !n) return this._events = void 0, this;
                for (a = t ? [t] : _.keys(this._events), c = 0, u = a.length; c < u; c++) if (t = a[c], o = this._events[t]) {
                    if (this._events[t] = r = [], e || n) for (l = 0, f = o.length; l < f; l++) i = o[l], (e && e !== i.callback && e !== i.callback._callback || n && n !== i.context) && r.push(i);
                    r.length || delete this._events[t]
                }
                return this
            }, trigger: function (t) {
                if (!this._events) return this;
                var e = a.call(arguments, 1);
                if (!s(this, "trigger", t, e)) return this;
                var n = this._events[t], r = this._events.all;
                return n && c(n, e), r && c(r, arguments), this
            }, stopListening: function (t, e, n) {
                var r = this._listeningTo;
                if (!r) return this;
                var i = !e && !n;
                n || "object" != typeof e || (n = this), t && ((r = {})[t._listenId] = t);
                for (var o in r) t = r[o], t.off(e, n, this), (i || _.isEmpty(t._events)) && delete this._listeningTo[o];
                return this
            }
        }, i = /\s+/, o = [], a = o.slice, s = function (t, e, n, r) {
            if (!n) return !0;
            if ("object" == typeof n) {
                for (var o in n) t[e].apply(t, [o, n[o]].concat(r));
                return !1
            }
            if (i.test(n)) {
                for (var a = n.split(i), s = 0, c = a.length; s < c; s++) t[e].apply(t, [a[s]].concat(r));
                return !1
            }
            return !0
        }, c = function (t, e) {
            var n, r = -1, i = t.length, o = e[0], a = e[1], s = e[2];
            switch (e.length) {
                case 0:
                    for (; ++r < i;) (n = t[r]).callback.call(n.ctx);
                    return;
                case 1:
                    for (; ++r < i;) (n = t[r]).callback.call(n.ctx, o);
                    return;
                case 2:
                    for (; ++r < i;) (n = t[r]).callback.call(n.ctx, o, a);
                    return;
                case 3:
                    for (; ++r < i;) (n = t[r]).callback.call(n.ctx, o, a, s);
                    return;
                default:
                    for (; ++r < i;) (n = t[r]).callback.apply(n.ctx, e);
                    return
            }
        }, u = {listenTo: "on", listenToOnce: "once"};
        _.each(u, function (t, e) {
            r[e] = function (e, n, r) {
                var i = this._listeningTo || (this._listeningTo = {}),
                    o = e._listenId || (e._listenId = _.uniqueId("l"));
                return i[o] = e, r || "object" != typeof n || (r = this), e[t](n, r, this), this
            }
        }), e.exports = r
    }, {}],
    4: [function (t, e, n) {
        var r = {};
        r.CreateWhiteTexture = function (t, e) {
            for (var n = r.CreateDataTexture(t, e), i = 0; i < n.image.data.length; i++) n.image.data[i] = 255;
            return n
        }, r.CreateBlackTexture = function (t, e) {
            for (var n = r.CreateDataTexture(t, e), i = 0; i < n.image.data.length; i++) n.image.data[i] = 0;
            return n
        }, r.CreateNormalTexture = function (t, e) {
            for (var n = r.CreateDataTexture(t, e), i = 0; i < n.image.data.length; i += 3) n.image.data[i] = 128, n.image.data[i + 1] = 128, n.image.data[i + 2] = 255;
            return n
        }, r.CreateDataTexture = function (t, e) {
            void 0 === t && (t = 4), void 0 === e && (e = 4);
            var n = t * e * 3, r = new Uint8Array(n), i = new THREE.DataTexture(r, t, e, THREE.RGBFormat);
            return i.needsUpdate = !0, i
        }, e.exports = r
    }, {}],
    5: [function (t, e, n) {
        var r = function (t) {
            t = _.extend({}, {
                duration: 1e3, repeat: !1, onStart: function () {
                }, onEnd: function () {
                }
            }, t), this.duration = t.duration, this.repeat = t.repeat, this.startCallback = t.onStart, this.endCallback = t.onEnd, this.reset()
        };
        r.inherit(Object, {
            reset: function () {
                return this.started = !1, this.paused = !1, this.ended = !1, this.elapsedTime = 0, this
            }, start: function () {
                return this.started || this.ended ? this : (this.started = !0, this.startCallback(), this)
            }, stop: function () {
                return this.started ? this.reset() : this
            }, pause: function () {
                return this.paused = !0, this
            }, resume: function () {
                return this.paused = !1, this
            }, update: function (t) {
                return !this.started || this.paused || this.ended ? this : (this.elapsedTime += 1e3 * t.delta, this.elapsedTime > this.duration && (this.endCallback(), this.ended = !0), this)
            }
        }), e.exports = r
    }, {}],
    6: [function (t, e, n) {
        var r = t("5"), i = {_timers: {}};
        i.createTimer = function (t) {
            var e = _.uniqueId("timer_"), n = new r(t);
            return n.id = e, i._timers[e] = n, n
        }, i.delay = function (t, e, n) {
            var r = i.createTimer({
                duration: t, onEnd: function () {
                    e.call(n), delete i._timers[this.id]
                }
            }).start();
            return r
        }, i.updateTimers = function (t) {
            _.each(i._timers, function (e) {
                e.update(t)
            })
        }, i.clearTimers = function () {
            _.each(i._timers, function (t) {
                t.onEnd = null
            }), i._timers = {}
        }, e.exports = i
    }, {5: 5}],
    7: [function (t, e, n) {
        !function () {
            function t(t) {
                this.object = t, this.target = new THREE.Vector3, this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -(1 / 0), this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = .25;
                var e, n, r = this, i = 1e-6, o = 0, a = 0, s = 1, c = new THREE.Vector3, u = !1;
                this.getPolarAngle = function () {
                    return n
                }, this.getAzimuthalAngle = function () {
                    return e
                }, this.rotateLeft = function (t) {
                    a -= t
                }, this.rotateUp = function (t) {
                    o -= t
                }, this.panLeft = function () {
                    var t = new THREE.Vector3;
                    return function (e) {
                        var n = this.object.matrix.elements;
                        t.set(n[0], n[1], n[2]), t.multiplyScalar(-e), c.add(t)
                    }
                }(), this.panUp = function () {
                    var t = new THREE.Vector3;
                    return function (e) {
                        var n = this.object.matrix.elements;
                        t.set(n[4], n[5], n[6]), t.multiplyScalar(e), c.add(t)
                    }
                }(), this.pan = function (t, e, n, i) {
                    if (r.object instanceof THREE.PerspectiveCamera) {
                        var o = r.object.position, a = o.clone().sub(r.target), s = a.length();
                        s *= Math.tan(r.object.fov / 2 * Math.PI / 180), r.panLeft(2 * t * s / i), r.panUp(2 * e * s / i)
                    } else r.object instanceof THREE.OrthographicCamera ? (r.panLeft(t * (r.object.right - r.object.left) / n), r.panUp(e * (r.object.top - r.object.bottom) / i)) : console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.")
                }, this.dollyIn = function (t) {
                    r.object instanceof THREE.PerspectiveCamera ? s /= t : r.object instanceof THREE.OrthographicCamera ? (r.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom * t)), r.object.updateProjectionMatrix(), u = !0) : console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.")
                }, this.dollyOut = function (t) {
                    r.object instanceof THREE.PerspectiveCamera ? s *= t : r.object instanceof THREE.OrthographicCamera ? (r.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / t)), r.object.updateProjectionMatrix(), u = !0) : console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.")
                }, this.update = function () {
                    var r = new THREE.Vector3,
                        l = (new THREE.Quaternion).setFromUnitVectors(t.up, new THREE.Vector3(0, 1, 0)),
                        f = l.clone().inverse(), h = new THREE.Vector3, p = new THREE.Quaternion;
                    return function () {
                        var t = this.object.position;
                        r.copy(t).sub(this.target), r.applyQuaternion(l), e = Math.atan2(r.x, r.z), n = Math.atan2(Math.sqrt(r.x * r.x + r.z * r.z), r.y), e += a, n += o, this.object.theta = e = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, e)), n = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, n)), this.object.phi = n = Math.max(i, Math.min(Math.PI - i, n));
                        var d = r.length() * s;
                        return d = Math.max(this.minDistance, Math.min(this.maxDistance, d)), this.target.add(c), r.x = d * Math.sin(n) * Math.sin(e), r.y = d * Math.cos(n), r.z = d * Math.sin(n) * Math.cos(e), r.applyQuaternion(f), t.copy(this.target).add(r), this.object.lookAt(this.target), this.enableDamping === !0 ? (a *= 1 - this.dampingFactor, o *= 1 - this.dampingFactor) : (a = 0, o = 0), s = 1, c.set(0, 0, 0), !!(u || h.distanceToSquared(this.object.position) > i || 8 * (1 - p.dot(this.object.quaternion)) > i) && (h.copy(this.object.position), p.copy(this.object.quaternion), u = !1, !0)
                    }
                }()
            }

            function n(t) {
                var e = t.clientX == r && t.clientY == i;
                return r = t.clientX, i = t.clientY, e
            }

            var r, i, o = function (e, o) {
                function a(t, e) {
                    var n = y.domElement === document ? y.domElement.body : y.domElement;
                    _.pan(t, e, n.clientWidth, n.clientHeight)
                }

                function s() {
                    return 2 * Math.PI / 60 / 60 * y.autoRotateSpeed
                }

                function c() {
                    return Math.pow(.95, y.zoomSpeed)
                }

                function u(t) {
                    if (y.enabled !== !1) {
                        if (r = t.clientX, i = t.clientY, t.preventDefault(), t.button === y.mouseButtons.ORBIT) {
                            if (y.enableRotate === !1) return;
                            P = O.ROTATE, b.set(t.clientX, t.clientY)
                        } else if (t.button === y.mouseButtons.ZOOM) {
                            if (y.enableZoom === !1) return;
                            P = O.DOLLY, C.set(t.clientX, t.clientY)
                        } else if (t.button === y.mouseButtons.PAN) {
                            if (y.enablePan === !1) return;
                            P = O.PAN, E.set(t.clientX, t.clientY)
                        }
                        P !== O.NONE && (document.addEventListener("mousemove", l, !1), document.addEventListener("mouseup", f, !1), y.dispatchEvent(A)), y.onMouseDown()
                    }
                }

                function l(t) {
                    if (y.enabled !== !1 && !n(t)) {
                        t.preventDefault();
                        var e = y.domElement === document ? y.domElement.body : y.domElement;
                        if (P === O.ROTATE) {
                            if (y.enableRotate === !1) return;
                            y.isRotating = !0, w.set(t.clientX, t.clientY), x.subVectors(w, b), _.rotateLeft(2 * Math.PI * x.x / e.clientWidth * y.rotateSpeed), _.rotateUp(2 * Math.PI * x.y / e.clientHeight * y.rotateSpeed), b.copy(w)
                        } else if (P === O.DOLLY) {
                            if (y.enableZoom === !1) return;
                            M.set(t.clientX, t.clientY), S.subVectors(M, C), S.y > 0 ? _.dollyIn(c()) : S.y < 0 && _.dollyOut(c()), C.copy(M)
                        } else if (P === O.PAN) {
                            if (y.enablePan === !1) return;
                            T.set(t.clientX, t.clientY), R.subVectors(T, E), a(R.x, R.y), E.copy(T)
                        }
                        P !== O.NONE && y.update(), y.onMouseMove()
                    }
                }

                function f() {
                    y.enabled !== !1 && (document.removeEventListener("mousemove", l, !1), document.removeEventListener("mouseup", f, !1), y.dispatchEvent(k), P = O.NONE, y.isRotating = !1, y.onMouseUp())
                }

                function h(t) {
                    if (y.enabled !== !1 && y.enableZoom !== !1 && P === O.NONE) {
                        t.preventDefault(), t.stopPropagation();
                        var e = 0;
                        void 0 !== t.wheelDelta ? e = t.wheelDelta : void 0 !== t.detail && (e = -t.detail), e > 0 ? _.dollyOut(c()) : e < 0 && _.dollyIn(c()), y.update(), y.dispatchEvent(A), y.dispatchEvent(k)
                    }
                }

                function p(t) {
                    if (y.enabled !== !1 && y.enableKeys !== !1 && y.enablePan !== !1) switch (t.keyCode) {
                        case y.keys.UP:
                            a(0, y.keyPanSpeed), y.update();
                            break;
                        case y.keys.BOTTOM:
                            a(0, -y.keyPanSpeed), y.update();
                            break;
                        case y.keys.LEFT:
                            a(y.keyPanSpeed, 0), y.update();
                            break;
                        case y.keys.RIGHT:
                            a(-y.keyPanSpeed, 0), y.update()
                    }
                }

                function d(t) {
                    if (y.enabled !== !1) {
                        switch (t.touches.length) {
                            case 1:
                                if (y.enableRotate === !1) return;
                                P = O.TOUCH_ROTATE, b.set(t.touches[0].pageX, t.touches[0].pageY);
                                break;
                            case 2:
                                if (y.enableZoom === !1) return;
                                P = O.TOUCH_DOLLY;
                                var e = t.touches[0].pageX - t.touches[1].pageX,
                                    n = t.touches[0].pageY - t.touches[1].pageY, r = Math.sqrt(e * e + n * n);
                                C.set(0, r);
                                break;
                            case 3:
                                if (y.enablePan === !1) return;
                                P = O.TOUCH_PAN, E.set(t.touches[0].pageX, t.touches[0].pageY);
                                break;
                            default:
                                P = O.NONE
                        }
                        P !== O.NONE && y.dispatchEvent(A)
                    }
                }

                function v(t) {
                    if (y.enabled !== !1) {
                        t.preventDefault(), t.stopPropagation();
                        var e = y.domElement === document ? y.domElement.body : y.domElement;
                        switch (t.touches.length) {
                            case 1:
                                if (y.enableRotate === !1) return;
                                if (P !== O.TOUCH_ROTATE) return;
                                y.isRotating = !0, w.set(t.touches[0].pageX, t.touches[0].pageY), x.subVectors(w, b), _.rotateLeft(2 * Math.PI * x.x / e.clientWidth * y.rotateSpeed), _.rotateUp(2 * Math.PI * x.y / e.clientHeight * y.rotateSpeed), b.copy(w), y.update();
                                break;
                            case 2:
                                if (y.enableZoom === !1) return;
                                if (P !== O.TOUCH_DOLLY) return;
                                var n = t.touches[0].pageX - t.touches[1].pageX,
                                    r = t.touches[0].pageY - t.touches[1].pageY, i = Math.sqrt(n * n + r * r);
                                M.set(0, i), S.subVectors(M, C), S.y > 0 ? _.dollyOut(c()) : S.y < 0 && _.dollyIn(c()), C.copy(M), y.update();
                                break;
                            case 3:
                                if (y.enablePan === !1) return;
                                if (P !== O.TOUCH_PAN) return;
                                T.set(t.touches[0].pageX, t.touches[0].pageY), R.subVectors(T, E), a(R.x, R.y), E.copy(T), y.update();
                                break;
                            default:
                                P = O.NONE
                        }
                    }
                }

                function m() {
                    y.enabled !== !1 && (y.dispatchEvent(k), P = O.NONE, y.isRotating = !1)
                }

                function g(t) {
                    t.preventDefault()
                }

                var _ = new t(e);
                this.domElement = void 0 !== o ? o : document, Object.defineProperty(this, "constraint", {
                    get: function () {
                        return _
                    }
                }), this.getPolarAngle = function () {
                    return _.getPolarAngle()
                }, this.getAzimuthalAngle = function () {
                    return _.getAzimuthalAngle()
                }, this.enabled = !0, this.center = this.target, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.keyPanSpeed = 7, this.autoRotate = !1, this.autoRotateSpeed = 2, this.enableKeys = !0, this.keys = {
                    LEFT: 37,
                    UP: 38,
                    RIGHT: 39,
                    BOTTOM: 40
                }, this.mouseButtons = {ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT};
                var y = this, b = new THREE.Vector2, w = new THREE.Vector2, x = new THREE.Vector2,
                    E = new THREE.Vector2, T = new THREE.Vector2, R = new THREE.Vector2, C = new THREE.Vector2,
                    M = new THREE.Vector2, S = new THREE.Vector2,
                    O = {NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5},
                    P = O.NONE;
                this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom;
                var L = {type: "change"}, A = {type: "start"}, k = {type: "end"};
                this.update = function () {
                    this.autoRotate && P === O.NONE && _.rotateLeft(s()), _.update() === !0 && this.dispatchEvent(L)
                }, this.reset = function () {
                    P = O.NONE, this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(L), this.update()
                }, this.dispose = function () {
                    this.domElement.removeEventListener("contextmenu", g, !1), this.domElement.removeEventListener("mousedown", u, !1), this.domElement.removeEventListener("mousewheel", h, !1), this.domElement.removeEventListener("MozMousePixelScroll", h, !1), this.domElement.removeEventListener("touchstart", d, !1), this.domElement.removeEventListener("touchend", m, !1), this.domElement.removeEventListener("touchmove", v, !1), document.removeEventListener("mousemove", l, !1), document.removeEventListener("mouseup", f, !1), window.removeEventListener("keydown", p, !1)
                }, this.domElement.addEventListener("contextmenu", g, !1), this.domElement.addEventListener("mousedown", u, !1), this.domElement.addEventListener("mousewheel", h, !1), this.domElement.addEventListener("MozMousePixelScroll", h, !1), this.domElement.addEventListener("touchstart", d, !1), this.domElement.addEventListener("touchend", m, !1), this.domElement.addEventListener("touchmove", v, !1), window.addEventListener("keydown", p, !1), this.update()
            };
            o.prototype = Object.create(THREE.EventDispatcher.prototype), o.prototype.constructor = o, o.prototype.onMouseDown = function () {
            }, o.prototype.onMouseMove = function () {
            }, o.prototype.onMouseUp = function () {
            }, Object.defineProperties(o.prototype, {
                object: {
                    get: function () {
                        return this.constraint.object
                    }
                }, target: {
                    get: function () {
                        return this.constraint.target
                    }, set: function (t) {
                        console.warn("OrbitControls: target is now immutable. Use target.set() instead."), this.constraint.target.copy(t)
                    }
                }, minDistance: {
                    get: function () {
                        return this.constraint.minDistance
                    }, set: function (t) {
                        this.constraint.minDistance = t
                    }
                }, maxDistance: {
                    get: function () {
                        return this.constraint.maxDistance
                    }, set: function (t) {
                        this.constraint.maxDistance = t
                    }
                }, minZoom: {
                    get: function () {
                        return this.constraint.minZoom
                    }, set: function (t) {
                        this.constraint.minZoom = t
                    }
                }, maxZoom: {
                    get: function () {
                        return this.constraint.maxZoom
                    }, set: function (t) {
                        this.constraint.maxZoom = t
                    }
                }, minPolarAngle: {
                    get: function () {
                        return this.constraint.minPolarAngle
                    }, set: function (t) {
                        this.constraint.minPolarAngle = t
                    }
                }, maxPolarAngle: {
                    get: function () {
                        return this.constraint.maxPolarAngle
                    }, set: function (t) {
                        this.constraint.maxPolarAngle = t
                    }
                }, minAzimuthAngle: {
                    get: function () {
                        return this.constraint.minAzimuthAngle
                    }, set: function (t) {
                        this.constraint.minAzimuthAngle = t
                    }
                }, maxAzimuthAngle: {
                    get: function () {
                        return this.constraint.maxAzimuthAngle
                    }, set: function (t) {
                        this.constraint.maxAzimuthAngle = t
                    }
                }, enableDamping: {
                    get: function () {
                        return this.constraint.enableDamping
                    }, set: function (t) {
                        this.constraint.enableDamping = t
                    }
                }, dampingFactor: {
                    get: function () {
                        return this.constraint.dampingFactor
                    }, set: function (t) {
                        this.constraint.dampingFactor = t
                    }
                }, noZoom: {
                    get: function () {
                        return console.warn("OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."), !this.enableZoom
                    }, set: function (t) {
                        console.warn("OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."), this.enableZoom = !t
                    }
                }, noRotate: {
                    get: function () {
                        return console.warn("OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."), !this.enableRotate
                    }, set: function (t) {
                        console.warn("OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."), this.enableRotate = !t
                    }
                }, noPan: {
                    get: function () {
                        return console.warn("OrbitControls: .noPan has been deprecated. Use .enablePan instead."), !this.enablePan
                    }, set: function (t) {
                        console.warn("OrbitControls: .noPan has been deprecated. Use .enablePan instead."), this.enablePan = !t
                    }
                }, noKeys: {
                    get: function () {
                        return console.warn("OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."), !this.enableKeys
                    }, set: function (t) {
                        console.warn("OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."), this.enableKeys = !t
                    }
                }, staticMoving: {
                    get: function () {
                        return console.warn("OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."), !this.constraint.enableDamping
                    }, set: function (t) {
                        console.warn("OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."), this.constraint.enableDamping = !t
                    }
                }, dynamicDampingFactor: {
                    get: function () {
                        return console.warn("OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."), this.constraint.dampingFactor
                    }, set: function (t) {
                        console.warn("OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."), this.constraint.dampingFactor = t
                    }
                }
            }), e.exports = o
        }()
    }, {}],
    8: [function (t, e, n) {
        var r = function (t) {
            t = _.extend({size: 100, step: 10, color: 0, opacity: .2}, t);
            for (var e = new THREE.Geometry, n = t.size, r = -n; r <= n; r += t.step) e.vertices.push(new THREE.Vector3((-n), 0, r)), e.vertices.push(new THREE.Vector3(n, 0, r)), e.vertices.push(new THREE.Vector3(r, 0, (-n))), e.vertices.push(new THREE.Vector3(r, 0, n));
            var i = new THREE.LineBasicMaterial({color: t.color, opacity: t.opacity, transparent: !0});
            THREE.LineSegments.call(this, e, i)
        };
        r.inherit(THREE.LineSegments), e.exports = r
    }, {}],
    9: [function (t, e, n) {
        function r(t, e, n) {
            for (var r = t * t, i = 2 * t * t, o = 3 * t * t, a = 0, s = 0; s < r; s++) n[a++] = e[s], n[a++] = e[s + r], n[a++] = e[s + i], n[a++] = e[s + o]
        }

        var i = function (t, e, n) {
            this.manager = void 0 !== n ? n : THREE.DefaultLoadingManager, this._size = t, this._interleaved = e
        };
        i.prototype = Object.create(THREE.CompressedTextureLoader.prototype), i.prototype._parser = function (t) {
            for (var e = [], n = Math.log2(this._size), i = 0, o = 0; o <= n; o++) {
                var a = Math.pow(2, n - o), s = a * a * 4;
                if (i >= t.byteLength) break;
                for (var c = 0; c < 6; c++) {
                    if (e[c] || (e[c] = []), this._interleaved) {
                        var u = new Uint8Array(t, i, s), l = new Uint8Array(s);
                        r(a, u, l)
                    } else var l = new Uint8Array(t, i, s);
                    e[c].push({data: l, width: a, height: a}), i += s
                }
            }
            return {
                isCubemap: !0,
                mipmaps: _.flatten(e),
                mipmapCount: n + 1,
                width: this._size,
                height: this._size,
                format: THREE.RGBAFormat,
                minFilter: THREE.LinearMipMapLinearFilter,
                magFilter: THREE.LinearFilter,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                type: THREE.UnsignedByteType
            }
        }, Math.log2 = Math.log2 || function (t) {
            return Math.log(t) * Math.LOG2E
        }, e.exports = i
    }, {}],
    10: [function (t, e, n) {
        var r = function (t) {
            THREE.XHRLoader.call(this), this.setResponseType("arraybuffer"), this.manager = void 0 !== t ? t : THREE.DefaultLoadingManager
        };
        r.prototype = Object.create(THREE.XHRLoader.prototype), e.exports = r
    }, {}],
    11: [function (t, e, n) {
        function r(t, e, n) {
            for (var r = t * t, i = 2 * t * t, o = 3 * t * t, a = 0, s = 0; s < r; s++) n[a++] = e[s], n[a++] = e[s + r], n[a++] = e[s + i], n[a++] = e[s + o]
        }

        var i = function (t, e, n) {
            this.manager = void 0 !== n ? n : THREE.DefaultLoadingManager, this._size = t, this._interleaving = e
        };
        i.prototype = Object.create(THREE.BinaryTextureLoader.prototype), i.prototype._parser = function (t) {
            var e, n = this._size;
            if (this._interleaving) {
                var i = n * n * 4, o = new Uint8Array(t);
                e = new Uint8Array(i), r(n, o, e)
            } else e = new Uint8Array(t);
            return {
                width: n,
                height: n,
                data: e,
                format: THREE.RGBAFormat,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                wrapS: THREE.ClampToEdgeWrapping,
                wrapT: THREE.ClampToEdgeWrapping,
                type: THREE.UnsignedByteType
            }
        }, e.exports = i
    }, {}],
    12: [function (t, e, n) {
        function r(t) {
            var e = t.slice(0, 27), n = 1 / (2 * Math.sqrt(Math.PI)), r = -(.5 * Math.sqrt(3 / Math.PI)), i = -r, o = r,
                a = .5 * Math.sqrt(15 / Math.PI), s = -a, c = .25 * Math.sqrt(5 / Math.PI), u = s,
                l = .25 * Math.sqrt(15 / Math.PI),
                f = [n, n, n, r, r, r, i, i, i, o, o, o, a, a, a, s, s, s, c, c, c, u, u, u, l, l, l];
            return f.map(function (t, n) {
                return t * e[n]
            })
        }

        var i = function (t) {
            THREE.XHRLoader.call(this), this.manager = void 0 !== t ? t : THREE.DefaultLoadingManager
        };
        i.prototype = Object.create(THREE.XHRLoader.prototype), i.prototype.load = function (t, e, n, i) {
            THREE.XHRLoader.prototype.load.call(this, t, function (t) {
                var n = JSON.parse(t), i = r(n);
                e(i)
            }, n, i)
        }, e.exports = i
    }, {}],
    13: [function (t, e, n) {
        var r = (t("21"), t("22")), i = t("20"), o = (t("15"), THREE.MaterialLoader.prototype.parse), a = null;
        THREE.MaterialLoader.setShaders = function (t) {
            a = t
        }, THREE.MaterialLoader.prototype.parse = function (t) {
            var e = o.call(this, t);
            if (t.customType && "MatcapMaterial" === t.customType) return i.create({
                uuid: t.uuid,
                name: t.name,
                normalMap: e.normalMap,
                matcapMap: THREE.ImageUtils.loadTexture("textures/matcap.jpg"),
                normalMapFactor: 1
            });
            if (t.customType && "PBRMaterial" === t.customType) {
                var n = t.metalGlossMap ? this.getTexture(t.metalGlossMap) : null,
                    s = t.map2 ? this.getTexture(t.map2) : null,
                    c = t.normalMap2 ? this.getTexture(t.normalMap2) : null,
                    u = t.aoMap2 ? this.getTexture(t.aoMap2) : null,
                    l = t.lightMapM ? this.getTexture(t.lightMapM) : null,
                    f = t.lightMapDir ? this.getTexture(t.lightMapDir) : null,
                    h = t.emissiveMap ? this.getTexture(t.emissiveMap) : null,
                    p = t.packedPBRMap ? this.getTexture(t.packedPBRMap) : null;
                return r.create({
                    vertexShader: a["pbr.vs"],
                    fragmentShader: a["pbr.fs"],
                    uuid: t.uuid,
                    name: t.name,
                    color: t.color,
                    opacity: e.opacity,
                    transparent: e.transparent,
                    alphaTest: e.alphaTest,
                    environment: t.environment,
                    exposure: t.exposure,
                    albedoMap: e.map,
                    albedoMap2: s,
                    metalGlossMap: n,
                    packedMap: p,
                    metalFactor: t.metalFactor,
                    glossFactor: t.glossFactor,
                    normalMapFactor: t.normalFactor,
                    normalMap: e.normalMap,
                    normalMap2: c,
                    lightMap: e.lightMap,
                    lightMapM: l,
                    lightMapDir: f,
                    aoMap: e.aoMap,
                    aoMap2: u,
                    aoFactor: t.aoFactor,
                    occludeSpecular: t.occludeSpecular,
                    emissiveMap: h
                })
            }
            if ("SkyboxMaterial" === t.customType) {
                var d = THREE.ShaderLib.cube;
                e.vertexShader = a["skybox.vs"], e.fragmentShader = a["skybox.fs"], e.uniforms = THREE.UniformsUtils.clone(d.uniforms), e.uniforms.tCube.value = this.getTexture(t.cubemap)
            }
            return e
        }
    }, {15: 15, 20: 20, 21: 21, 22: 22}],
    14: [function (t, e, n) {
        var r = t("24"), i = t("15"), o = function (t) {
            t.manager && (this.manager = t.manager), t.cubemaps && (this.cubemaps = t.cubemaps), t.sh && (this.sh = t.sh), t.textures && (this.textures = t.textures), t.panoramas && (this.panoramas = t.panoramas), t.geometries && (this.geometries = t.geometries)
        };
        o.prototype.load = function () {
            var t = {};
            return this.cubemaps && (t.cubemap = i.loadSpecularCubemaps(this.cubemaps)), this.panoramas && (t.panorama = i.loadPanoramas(this.panoramas)), this.sh && (t.sh = i.loadSH(this.sh)), this.textures && (t.texture = i.loadTextures(this.textures, "")), this.geometries && (t.geometry = i.loadGeometries(this.geometries)), r.props(t)
        }, e.exports = o
    }, {15: 15, 24: 24}],
    15: [function (t, e, n) {
        function r(t, e) {
            return {
                _cache: e || {}, load: function (e, n, r, i, o) {
                    var a = this._cache;
                    _.has(a, o) ? resolve(a[o]) : t.load(e, function (t) {
                        a[o] = t, n.apply(this, arguments)
                    }, r, i)
                }, get: function (t) {
                    return _.has(this._cache, t) || console.error("Resource not found: " + t), this._cache[t]
                }
            }
        }

        function i(t, e, n, r) {
            return _.isArray(t) || (t = [t]), s.all(_.map(t, function (t) {
                if (r) return r(c(e, t), t, n)
            }))
        }

        function o(t, e, n) {
            return new s(function (r, i) {
                n.load(t, function (t) {
                    t.filename = e, r(arguments.length > 1 ? _.toArray(arguments) : t)
                }, function () {
                }, function () {
                    i(new Error("Resource was not found: " + t))
                }, e)
            })
        }

        function a(t, e, n) {
            return t = t || [], i(t, e, n, o)
        }

        var s = t("24"), c = t("29"), u = t("16"), l = t("11"), f = t("9"), h = t("12"), p = t("10"),
            d = new THREE.LoadingManager, v = new u(d), m = {}, g = r(new THREE.TextureLoader(d), m),
            y = r(new l(1024, (!1), d), m), b = r(new f(256, (!1), d), m), w = {}, x = new h(d), E = {},
            T = r(new p(d), E), R = {
                environmentPath: "assets/environments",
                geometryPath: "assets/scenes/data/",
                manager: d,
                sceneLoader: v
            }, C = "";
        Object.defineProperty(R, "texturePath", {
            get: function () {
                return C
            }, set: function (t) {
                C = t, v.setTexturePath(t)
            }
        }), R.loadScene = function (t, e) {
            return o(t, e, v)
        }, R.loadOBJs = function (t, e) {
            return a(t, e, objLoader)
        }, R.loadTextures = function (t, e) {
            return a(t, e || R.texturePath, g)
        }, R.loadBRDFs = function (t, e) {
            return a(t, e, brdfLoader)
        }, R.loadPanoramas = function (t, e) {
            return a(t, e || R.environmentPath, y)
        }, R.loadSpecularCubemaps = function (t, e) {
            return a(t, e || R.environmentPath, b)
        }, R.loadSH = function (t) {
            return s.all(_.map(t, function (t) {
                return new s(function (e, n) {
                    var r = c(R.environmentPath, t + "/irradiance.json");
                    x.load(r, function (n) {
                        w[t] = n, e(n)
                    }, function () {
                    }, function () {
                        n(new Error("Resource was not found: " + r))
                    })
                })
            }))
        }, R.loadGeometries = function (t, e) {
            return t = _.map(t, function (t) {
                return t + ".bin"
            }), a(t, e || R.geometryPath, T)
        }, R.getTexture = function (t) {
            return g.get(t)
        }, R.getBRDF = function (t) {
            return brdfLoader.get(t)
        }, R.getPanorama = function (t) {
            return y.get(t + "/panorama.bin")
        }, R.getCubemap = function (t) {
            return b.get(t + "/cubemap.bin")
        }, R.getSH = function (t) {
            return w[t]
        }, R.getGeometry = function (t) {
            return T.get(t + ".bin")
        }, e.exports = R
    }, {10: 10, 11: 11, 12: 12, 16: 16, 24: 24, 29: 29, 9: 9}],
    16: [function (t, e, n) {
        var r = function (t) {
            this.manager = void 0 !== t ? t : THREE.DefaultLoadingManager, this.texturePath = ""
        };
        Object.assign(r.prototype, {
            load: function (t, e, n, r) {
                "" === this.texturePath && (this.texturePath = t.substring(0, t.lastIndexOf("/") + 1));
                var i = this, o = new THREE.XHRLoader(i.manager);
                o.load(t, function (t) {
                    var n = JSON.parse(t);
                    i.parse(n, e)
                }, n, r)
            }, setTexturePath: function (t) {
                this.texturePath = t
            }, setCrossOrigin: function (t) {
                this.crossOrigin = t
            }, parse: function (t, e) {
                var n;
                n = t.binary ? this.parseBinaryGeometries(t.geometries) : this.parseGeometries(t.geometries);
                var r = this.parseImages(t.images, function () {
                        void 0 !== e && e(a, t)
                    }), i = this.parseTextures(t.textures, r), o = this.parseMaterials(t.materials, i),
                    a = this.parseObject(t.object, n, o);
                return t.animations && (a.animations = this.parseAnimations(t.animations)), t.cameras && (a.cameras = this.parseCameras(a, t.cameras)), void 0 !== t.images && 0 !== t.images.length || void 0 !== e && e(a, t), a
            }, parseCameras: function (t, e) {
                for (var n = [], r = 0; r < e.length; r++) {
                    var i = t.getObjectByProperty("uuid", e[r]);
                    i && n.push(i)
                }
                return n
            }, parseGeometries: function (t) {
                var e = {};
                if (void 0 !== t) for (var n = new THREE.JSONLoader, r = new THREE.BufferGeometryLoader, i = 0, o = t.length; i < o; i++) {
                    var a, s = t[i];
                    switch (s.type) {
                        case"PlaneGeometry":
                        case"PlaneBufferGeometry":
                            a = new THREE[s.type](s.width, s.height, s.widthSegments, s.heightSegments);
                            break;
                        case"BoxGeometry":
                        case"BoxBufferGeometry":
                        case"CubeGeometry":
                            a = new THREE[s.type](s.width, s.height, s.depth, s.widthSegments, s.heightSegments, s.depthSegments);
                            break;
                        case"CircleGeometry":
                        case"CircleBufferGeometry":
                            a = new THREE[s.type](s.radius, s.segments, s.thetaStart, s.thetaLength);
                            break;
                        case"CylinderGeometry":
                        case"CylinderBufferGeometry":
                            a = new THREE[s.type](s.radiusTop, s.radiusBottom, s.height, s.radialSegments, s.heightSegments, s.openEnded, s.thetaStart, s.thetaLength);
                            break;
                        case"ConeGeometry":
                        case"ConeBufferGeometry":
                            a = new THREE[s.type](s.radius, s.height, s.radialSegments, s.heightSegments, s.openEnded, s.thetaStart, s.thetaLength);
                            break;
                        case"SphereGeometry":
                        case"SphereBufferGeometry":
                            a = new THREE[s.type](s.radius, s.widthSegments, s.heightSegments, s.phiStart, s.phiLength, s.thetaStart, s.thetaLength);
                            break;
                        case"DodecahedronGeometry":
                        case"IcosahedronGeometry":
                        case"OctahedronGeometry":
                        case"TetrahedronGeometry":
                            a = new THREE[s.type](s.radius, s.detail);
                            break;
                        case"RingGeometry":
                        case"RingBufferGeometry":
                            a = new THREE[s.type](s.innerRadius, s.outerRadius, s.thetaSegments, s.phiSegments, s.thetaStart, s.thetaLength);
                            break;
                        case"TorusGeometry":
                        case"TorusBufferGeometry":
                            a = new THREE[s.type](s.radius, s.tube, s.radialSegments, s.tubularSegments, s.arc);
                            break;
                        case"TorusKnotGeometry":
                        case"TorusKnotBufferGeometry":
                            a = new THREE[s.type](s.radius, s.tube, s.tubularSegments, s.radialSegments, s.p, s.q);
                            break;
                        case"LatheGeometry":
                        case"LatheBufferGeometry":
                            a = new THREE[s.type](s.points, s.segments, s.phiStart, s.phiLength);
                            break;
                        case"BufferGeometry":
                            a = r.parse(s);
                            break;
                        case"Geometry":
                            a = n.parse(s.data, this.texturePath).geometry;
                            break;
                        default:
                            console.warn('THREE.ObjectLoader: Unsupported geometry type "' + s.type + '"');
                            continue
                    }
                    a.uuid = s.uuid, void 0 !== s.name && (a.name = s.name), e[s.uuid] = a
                }
                return e
            }, setBinaryGeometryBuffer: function (t) {
                this.geometryBuffer = t
            }, parseBinaryGeometries: function (t) {
                var e = {};
                if (void 0 !== t) {
                    for (var n = (new THREE.BufferGeometryLoader, 0), r = t.length; n < r; n++) {
                        var i = new THREE.BufferGeometry, o = t[n];
                        for (var a in o.offsets) if (o.offsets.hasOwnProperty(a)) {
                            var s = o.offsets[a], c = s[0], u = s[1] + 1, l = this.geometryBuffer.slice(c, u);
                            if ("index" === a) {
                                var f = new Uint32Array(l);
                                i.setIndex(new THREE.BufferAttribute(f, 1))
                            } else {
                                var h, f = new Float32Array(l);
                                "uv" === a || "uv2" === a ? h = 2 : "position" === a || "normal" === a || "color" === a ? h = 3 : "tangent" === a && (h = 4), i.addAttribute(a, new THREE.BufferAttribute(f, h))
                            }
                        }
                        i.uuid = o.uuid, void 0 !== o.name && (i.name = o.name), e[o.uuid] = i
                    }
                    this.setBinaryGeometryBuffer(null)
                }
                return e
            }, parseMaterials: function (t, e) {
                var n = {};
                if (void 0 !== t) {
                    var r = new THREE.MaterialLoader;
                    r.setTextures(e);
                    for (var i = 0, o = t.length; i < o; i++) {
                        var a = r.parse(t[i]);
                        n[a.uuid] = a
                    }
                }
                return n
            }, parseAnimations: function (t) {
                for (var e = [], n = 0; n < t.length; n++) {
                    var r = THREE.AnimationClip.parse(t[n]);
                    e.push(r)
                }
                return e
            }, parseImages: function (t, e) {
                function n(t) {
                    return r.manager.itemStart(t), a.load(t, function () {
                        r.manager.itemEnd(t)
                    })
                }

                var r = this, i = {};
                if (void 0 !== t && t.length > 0) {
                    var o = new THREE.LoadingManager(e), a = new THREE.ImageLoader(o);
                    a.setCrossOrigin(this.crossOrigin);
                    for (var s = 0, c = t.length; s < c; s++) {
                        var u = t[s], l = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(u.url) ? u.url : r.texturePath + u.url;
                        i[u.uuid] = n(l)
                    }
                }
                return i
            }, parseTextures: function (t, e) {
                function n(t) {
                    return "number" == typeof t ? t : (console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.", t), THREE[t])
                }

                var r = {};
                if (void 0 !== t) for (var i = 0, o = t.length; i < o; i++) {
                    var a, s = t[i];
                    if (s.images) {
                        for (var c = [], u = 0, l = s.images.length; u < l; u++) void 0 === e[s.images[u]] && console.warn("THREE.ObjectLoader: Undefined image", s.images[u]), c.push(e[s.images[u]]);
                        a = new THREE.CubeTexture(c)
                    } else void 0 === s.image && console.warn('THREE.ObjectLoader: No "image" specified for', s.uuid), void 0 === e[s.image] && console.warn("THREE.ObjectLoader: Undefined image", s.image), a = new THREE.Texture(e[s.image]);
                    a.needsUpdate = !0, a.uuid = s.uuid, void 0 !== s.name && (a.name = s.name), void 0 !== s.mapping && (a.mapping = n(s.mapping)), void 0 !== s.offset && a.offset.fromArray(s.offset), void 0 !== s.repeat && a.repeat.fromArray(s.repeat), void 0 !== s.wrap && (a.wrapS = n(s.wrap[0]), a.wrapT = n(s.wrap[1])), void 0 !== s.minFilter && (a.minFilter = n(s.minFilter)), void 0 !== s.magFilter && (a.magFilter = n(s.magFilter)), void 0 !== s.anisotropy && (a.anisotropy = s.anisotropy), void 0 !== s.flipY && (a.flipY = s.flipY), r[s.uuid] = a
                }
                return r
            }, parseObject: function () {
                var t = new THREE.Matrix4;
                return function (e, n, r) {
                    function i(t) {
                        return void 0 === n[t] && console.warn("THREE.ObjectLoader: Undefined geometry", t), n[t]
                    }

                    function o(t) {
                        if (void 0 !== t) return void 0 === r[t] && console.warn("THREE.ObjectLoader: Undefined material", t), r[t]
                    }

                    var a;
                    switch (e.type) {
                        case"Scene":
                            a = new THREE.Scene;
                            break;
                        case"PerspectiveCamera":
                            a = new THREE.PerspectiveCamera(e.fov, e.aspect, e.near, e.far), void 0 !== e.focus && (a.focus = e.focus), void 0 !== e.zoom && (a.zoom = e.zoom), void 0 !== e.filmGauge && (a.filmGauge = e.filmGauge), void 0 !== e.filmOffset && (a.filmOffset = e.filmOffset), void 0 !== e.view && (a.view = Object.assign({}, e.view));
                            break;
                        case"OrthographicCamera":
                            a = new THREE.OrthographicCamera(e.left, e.right, e.top, e.bottom, e.near, e.far);
                            break;
                        case"AmbientLight":
                            a = new THREE.AmbientLight(e.color, e.intensity);
                            break;
                        case"DirectionalLight":
                            a = new THREE.DirectionalLight(e.color, e.intensity);
                            break;
                        case"PointLight":
                            a = new THREE.PointLight(e.color, e.intensity, e.distance, e.decay);
                            break;
                        case"SpotLight":
                            a = new THREE.SpotLight(e.color, e.intensity, e.distance, e.angle, e.penumbra, e.decay);
                            break;
                        case"HemisphereLight":
                            a = new THREE.HemisphereLight(e.color, e.groundColor, e.intensity);
                            break;
                        case"Mesh":
                            var s = i(e.geometry), c = o(e.material);
                            a = s.bones && s.bones.length > 0 ? new THREE.SkinnedMesh(s, c) : new THREE.Mesh(s, c);
                            break;
                        case"LOD":
                            a = new THREE.LOD;
                            break;
                        case"Line":
                            a = new THREE.Line(i(e.geometry), o(e.material), e.mode);
                            break;
                        case"LineSegments":
                            a = new THREE.LineSegments(i(e.geometry), o(e.material));
                            break;
                        case"PointCloud":
                        case"Points":
                            a = new THREE.Points(i(e.geometry), o(e.material));
                            break;
                        case"Sprite":
                            a = new THREE.Sprite(o(e.material));
                            break;
                        case"Group":
                            a = new THREE.Group;
                            break;
                        default:
                            a = new THREE.Object3D
                    }
                    if (a.uuid = e.uuid, void 0 !== e.name && (a.name = e.name), void 0 !== e.matrix ? (t.fromArray(e.matrix), t.decompose(a.position, a.quaternion, a.scale)) : (void 0 !== e.position && a.position.fromArray(e.position), void 0 !== e.rotation && a.rotation.fromArray(e.rotation), void 0 !== e.scale && a.scale.fromArray(e.scale)), void 0 !== e.castShadow && (a.castShadow = e.castShadow), void 0 !== e.receiveShadow && (a.receiveShadow = e.receiveShadow), void 0 !== e.visible && (a.visible = e.visible), void 0 !== e.userData && (a.userData = e.userData), void 0 !== e.children) for (var u in e.children) a.add(this.parseObject(e.children[u], n, r));
                    if ("LOD" === e.type) for (var l = e.levels, f = 0; f < l.length; f++) {
                        var h = l[f], u = a.getObjectByProperty("uuid", h.object);
                        void 0 !== u && a.addLevel(u, h.distance)
                    }
                    return void 0 !== e.layers && (a.layers.mask = e.layers), a
                }
            }()
        }), e.exports = r
    }, {}],
    17: [function (t, e, n) {
        var r = t("24");
        t("13");
        var i = t("15"), o = (t("22"), t("16"), {});
        o.loadScene = function (t, e, n, o) {
            return new r(function (r, a) {
                var s = (n.renderer, i.getGeometry(t));
                s && i.sceneLoader.setBinaryGeometryBuffer(s), i.loadScene(e + t + (o || ".json")).spread(function (t, e) {
                    var n;
                    t.materials = {}, t.cameras && t.cameras.length > 0 && (n = t.cameras[0]), n ? (n.aspect = window.innerWidth / window.innerHeight, n.updateProjectionMatrix()) : (n = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, .01, 2e3), n.position.set(-3.5, 2, 3));
                    var i = 100, o = 10, a = new THREE.GridHelper(i, o);
                    t.add(a);
                    var s = new THREE.AxisHelper(5);
                    t.add(s), t.dirLights = [], t.traverse(function (e) {
                        e instanceof THREE.DirectionalLight && (e.position.set(0, 0, 5), e.quaternion.normalize(), e.position.applyQuaternion(e.quaternion), e.quaternion.set(0, 0, 0, 0), e.scale.set(1, 1, 1), t.dirLights.push(e))
                    }), mixer = new THREE.AnimationMixer(t);
                    for (var c = 0; c < t.animations.length; c++) mixer.clipAction(t.animations[c]).play();
                    t.traverse(function (t) {
                        var e = t.material;
                        e && e.aoMap && !e.map
                    }), t.traverse(function (t) {
                        "Line" === t.name && (t.material.linewidth = 10, t.material.color.setRGB(1, 0, 1))
                    }), t.traverse(function (e) {
                        if (e instanceof THREE.SpotLight) {
                            var n = new THREE.Vector3(0, 0, (-1)), r = new THREE.Object3D;
                            e.updateMatrixWorld(), e.localToWorld(n), r.position.copy(n), t.add(r), e.target = r
                        }
                        e.material && (e.material.materials ? e.material.materials.forEach(function (e) {
                            t.materials[e.uuid] = e
                        }) : t.materials[e.material.uuid] = e.material)
                    }), r(t)
                })
            })
        }, e.exports = o
    }, {13: 13, 15: 15, 16: 16, 22: 22, 24: 24}],
    18: [function (t, e, n) {
        t("19"), window._ = t("34"), Number.prototype.lerp = function (t, e) {
            return this + (t - this) * e
        }, String.prototype.endsWith || (String.prototype.endsWith = function (t, e) {
            var n = this.toString();
            ("number" != typeof e || !isFinite(e) || Math.floor(e) !== e || e > n.length) && (e = n.length), e -= t.length;
            var r = n.indexOf(t, e);
            return r !== -1 && r === e
        }), Function.prototype.inherit = function (t, e) {
            if (!t || !_.isFunction(t)) throw"parent argument must be a function";
            this.prototype = _.extend(Object.create(t.prototype), e)
        }, Function.prototype.mixin = function (t) {
            _.each(t, function (t, e) {
                void 0 === this.prototype[e] && (this.prototype[e] = t)
            }, this)
        }, window.WIDTH = window.innerWidth, window.HEIGHT = window.innerHeight, window.mouseX = 0, window.mouseY = 0, window.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), window.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    }, {19: 19, 34: 34}],
    19: [function (t, e, n) {
        void 0 === Date.now && (Date.now = function () {
            return (new Date).valueOf()
        }), window.TWEEN = function () {
            var t = [], e = [], n = [];
            return {
                REVISION: "14", getAll: function () {
                    return t
                }, removeAll: function () {
                    t = []
                }, add: function (t) {
                    e.push(t)
                }, remove: function (t) {
                    n.push(t)
                }, update: function (r) {
                    var i = 0;
                    for (r = void 0 !== r ? r : "undefined" != typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(); i < t.length;) t[i].update(r) ? i++ : t.splice(i, 1);
                    return n.length > 0 && (n.forEach(function (e) {
                        var n = t.indexOf(e);
                        n !== -1 && t.splice(n, 1)
                    }), n = []), e.length > 0 && (e.forEach(function (e) {
                        t.push(e)
                    }), e = []), !0
                }
            }
        }(), TWEEN.Tween = function (t) {
            var e, n, r, i, o, a, s, c, u, l, f, h, p, d, v, m, g, _, y, b;
            this.reset = function (t) {
                return e = t, n = 0, r = {}, i = {}, o = {}, a = 1e3, s = 0, c = !1, u = !1, l = !1, f = 0, h = null, p = TWEEN.Easing.Linear.None, d = TWEEN.Interpolation.Linear, v = [], m = null, g = !1, _ = null, y = null, b = null, this
            }, this.to = function (t, e) {
                return void 0 !== e && (a = e), i = t, this
            }, this.start = function (t) {
                TWEEN.add(this), u = !0, g = !1, h = void 0 !== t ? t : "undefined" != typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(), h += f;
                for (var n in i) r[n] = e[n], o[n] = r[n] || 0;
                return this
            }, this.stop = function () {
                return u ? (TWEEN.remove(this), u = !1, null !== b && b.call(e), this.stopChainedTweens(), this) : this
            }, this.stopChainedTweens = function () {
                for (var t = 0, e = v.length; t < e; t++) v[t].stop()
            }, this.delay = function (t) {
                return f = t, this
            }, this.repeat = function (t) {
                return s = t, this
            }, this.yoyo = function (t) {
                return c = t, this
            }, this.easing = function (t) {
                return p = t, this
            }, this.interpolation = function (t) {
                return d = t, this
            }, this.chain = function () {
                return v = arguments, this
            }, this.onStart = function (t) {
                return m = t, this
            }, this.onUpdate = function (t) {
                return _ = t, this
            }, this.onComplete = function (t) {
                return y = t, this
            }, this.onStop = function (t) {
                return b = t, this
            }, this.update = function (t) {
                var o;
                if (t < h) return !0;
                if (!u) return !1;
                g === !1 && (null !== m && m.call(e), g = !0);
                var s = (t - h) / a;
                s = s > 1 ? 1 : s, n = s;
                var c = p(s);
                for (o in i) {
                    var l = r[o] || 0, f = i[o];
                    e[o] = l + (f - l) * c
                }
                if (null !== _ && _.call(e, c), 1 == s) {
                    null !== y && y.call(e);
                    for (var d = 0, b = v.length; d < b; d++) v[d].start(t);
                    return !1
                }
                return !0
            }, this.getProgress = function () {
                return n
            }, void 0 !== t && this.reset(t)
        }, TWEEN.Easing = {
            Linear: {
                None: function (t) {
                    return t
                }
            }, Quadratic: {
                In: function (t) {
                    return t * t
                }, Out: function (t) {
                    return t * (2 - t)
                }, InOut: function (t) {
                    return (t *= 2) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1)
                }
            }, Cubic: {
                In: function (t) {
                    return t * t * t
                }, Out: function (t) {
                    return --t * t * t + 1
                }, InOut: function (t) {
                    return (t *= 2) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
                }
            }, Quartic: {
                In: function (t) {
                    return t * t * t * t
                }, Out: function (t) {
                    return 1 - --t * t * t * t
                }, InOut: function (t) {
                    return (t *= 2) < 1 ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2)
                }
            }, Quintic: {
                In: function (t) {
                    return t * t * t * t * t
                }, Out: function (t) {
                    return --t * t * t * t * t + 1
                }, InOut: function (t) {
                    return (t *= 2) < 1 ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2)
                }
            }, Sinusoidal: {
                In: function (t) {
                    return 1 - Math.cos(t * Math.PI / 2)
                }, Out: function (t) {
                    return Math.sin(t * Math.PI / 2)
                }, InOut: function (t) {
                    return .5 * (1 - Math.cos(Math.PI * t))
                }
            }, Exponential: {
                In: function (t) {
                    return 0 === t ? 0 : Math.pow(1024, t - 1)
                }, Out: function (t) {
                    return 1 === t ? 1 : 1 - Math.pow(2, -10 * t)
                }, InOut: function (t) {
                    return 0 === t ? 0 : 1 === t ? 1 : (t *= 2) < 1 ? .5 * Math.pow(1024, t - 1) : .5 * (-Math.pow(2, -10 * (t - 1)) + 2)
                }
            }, Circular: {
                In: function (t) {
                    return 1 - Math.sqrt(1 - t * t)
                }, Out: function (t) {
                    return Math.sqrt(1 - --t * t)
                }, InOut: function (t) {
                    return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
                }
            }, Elastic: {
                In: function (t) {
                    var e, n = .1, r = .4;
                    return 0 === t ? 0 : 1 === t ? 1 : (!n || n < 1 ? (n = 1, e = r / 4) : e = r * Math.asin(1 / n) / (2 * Math.PI), -(n * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - e) * (2 * Math.PI) / r)))
                }, Out: function (t) {
                    var e, n = .1, r = .4;
                    return 0 === t ? 0 : 1 === t ? 1 : (!n || n < 1 ? (n = 1, e = r / 4) : e = r * Math.asin(1 / n) / (2 * Math.PI), n * Math.pow(2, -10 * t) * Math.sin((t - e) * (2 * Math.PI) / r) + 1)
                }, InOut: function (t) {
                    var e, n = .1, r = .4;
                    return 0 === t ? 0 : 1 === t ? 1 : (!n || n < 1 ? (n = 1, e = r / 4) : e = r * Math.asin(1 / n) / (2 * Math.PI), (t *= 2) < 1 ? -.5 * (n * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - e) * (2 * Math.PI) / r)) : n * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - e) * (2 * Math.PI) / r) * .5 + 1)
                }
            }, Back: {
                In: function (t) {
                    var e = 1.70158;
                    return t * t * ((e + 1) * t - e)
                }, Out: function (t) {
                    var e = 1.70158;
                    return --t * t * ((e + 1) * t + e) + 1
                }, InOut: function (t) {
                    var e = 2.5949095;
                    return (t *= 2) < 1 ? .5 * (t * t * ((e + 1) * t - e)) : .5 * ((t -= 2) * t * ((e + 1) * t + e) + 2)
                }
            }, Bounce: {
                In: function (t) {
                    return 1 - TWEEN.Easing.Bounce.Out(1 - t)
                }, Out: function (t) {
                    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
                }, InOut: function (t) {
                    return t < .5 ? .5 * TWEEN.Easing.Bounce.In(2 * t) : .5 * TWEEN.Easing.Bounce.Out(2 * t - 1) + .5
                }
            }
        }, TWEEN.Interpolation = {
            Linear: function (t, e) {
                var n = t.length - 1, r = n * e, i = Math.floor(r), o = TWEEN.Interpolation.Utils.Linear;
                return e < 0 ? o(t[0], t[1], r) : e > 1 ? o(t[n], t[n - 1], n - r) : o(t[i], t[i + 1 > n ? n : i + 1], r - i)
            }, Bezier: function (t, e) {
                var n, r = 0, i = t.length - 1, o = Math.pow, a = TWEEN.Interpolation.Utils.Bernstein;
                for (n = 0; n <= i; n++) r += o(1 - e, i - n) * o(e, n) * t[n] * a(i, n);
                return r
            }, CatmullRom: function (t, e) {
                var n = t.length - 1, r = n * e, i = Math.floor(r), o = TWEEN.Interpolation.Utils.CatmullRom;
                return t[0] === t[n] ? (e < 0 && (i = Math.floor(r = n * (1 + e))), o(t[(i - 1 + n) % n], t[i], t[(i + 1) % n], t[(i + 2) % n], r - i)) : e < 0 ? t[0] - (o(t[0], t[0], t[1], t[1], -r) - t[0]) : e > 1 ? t[n] - (o(t[n], t[n], t[n - 1], t[n - 1], r - n) - t[n]) : o(t[i ? i - 1 : 0], t[i], t[n < i + 1 ? n : i + 1], t[n < i + 2 ? n : i + 2], r - i)
            }, Utils: {
                Linear: function (t, e, n) {
                    return (e - t) * n + t
                }, Bernstein: function (t, e) {
                    var n = TWEEN.Interpolation.Utils.Factorial;
                    return n(t) / n(e) / n(t - e)
                }, Factorial: function () {
                    var t = [1];
                    return function (e) {
                        var n, r = 1;
                        if (t[e]) return t[e];
                        for (n = e; n > 1; n--) r *= n;
                        return t[e] = r
                    }
                }(), CatmullRom: function (t, e, n, r, i) {
                    var o = .5 * (n - t), a = .5 * (r - e), s = i * i, c = i * s;
                    return (2 * e - 2 * n + o + a) * c + (-3 * e + 3 * n - 2 * o - a) * s + o * i + e
                }
            }
        }, "undefined" != typeof e && e.exports && (e.exports = TWEEN)
    }, {}],
    20: [function (t, e, n) {
        function r(t, e) {
            return void 0 !== t ? t : e
        }

        var i = t("21"), o = t("15"),
            a = {normalMapFactor: "uNormalMapFactor", normalMap: "sTextureNormalMap", matcapMap: "sTextureAOMap"},
            s = function (t) {
                t = Object.assign({
                    vertexShader: t.vertexShader,
                    fragmentShader: t.fragmentShader,
                    uniforms: {
                        uNormalMapFactor: {type: "f", value: 1},
                        sTextureMatcapMap: {type: "t", value: null},
                        sTextureNormalMap: {type: "t", value: null},
                        uFlipY: {type: "i", value: 0},
                        uOutputLinear: {type: "i", value: 0}
                    }
                }, t), i.call(this, t), Object.keys(this.uniforms).forEach(function (t) {
                    this.onPropertyChange(t, function (e) {
                        this.uniforms[t].value = e
                    })
                }, this), _.each(a, function (t, e) {
                    this.onPropertyChange(e, function (e) {
                        this[t] = e
                    })
                }, this), this.extensions = {derivatives: !0}
            };
        s.inherit(i, {
            clone: function (t) {
                var e = t || new s;
                return i.prototype.clone.call(this, e), e.name = this.name, e.transparent = this.transparent, _.each(this.uniforms, function (t, n) {
                    var r = t.type;
                    "v2" === r || "m4" === r ? e.uniforms[n].value.copy(t.value) : e.uniforms[n].value = t.value
                }, this), e
            }
        }), s.create = function (t) {
            var e = new s;
            e.uuid = t.uuid, e.name = t.name, e.transparent = r(t.transparent, !1), e.polygonOffset = r(t.polygonOffset, !1), e.polygonOffsetUnits = r(t.polygonOffsetUnits, 0), e.polygonOffsetFactor = r(t.polygonOffsetFactor, 0);
            var n = (o.getTexture("white.png"), t.normalMap), i = t.matcapMap;
            return e.uNormalMapFactor = r(t.normalMapFactor, 1), e.uFlipY = r(t.flipNormals, 0), e.side = r(t.side, THREE.FrontSide), n.needsUpdate = !0, i.needsUpdate = !0, e.sTextureNormalMap = n, e.sTextureMatcapMap = i, e
        }, e.exports = s
    }, {15: 15, 21: 21}],
    21: [function (t, e, n) {
        var r = ["side", "alphaTest", "transparent", "depthWrite", "shading", "wireframe"], i = function (t) {
            t = t || {}, THREE.ShaderMaterial.call(this, t), _.each(r, function (e) {
                var n = t[e];
                void 0 !== n && (this[e] = n)
            }, this)
        };
        i.inherit(THREE.ShaderMaterial, {
            onPropertyChange: function (t, e) {
                Object.defineProperty(this, t, {
                    get: function () {
                        return this["_" + t]
                    }, set: function (n) {
                        this["_" + t] = n, e.call(this, n)
                    }
                })
            }, clone: function (t) {
                var e = t || new i;
                return THREE.Material.prototype.clone.call(this, e), e.shading = this.shading, e.wireframe = this.wireframe, e.wireframeLinewidth = this.wireframeLinewidth, e.fog = this.fog, e.lights = this.lights, e.vertexColors = this.vertexColors, e.skinning = this.skinning, e.morphTargets = this.morphTargets, e.morphNormals = this.morphNormals, e
            }
        }), e.exports = i
    }, {}],
    22: [function (t, e, n) {
        function r(t, e) {
            return void 0 !== t ? t : e
        }

        var i = t("23"), o = t("15"), a = t("4"), s = {
            aoFactor: "uAOPBRFactor",
            albedoFactor: "uAlbedoPBRFactor",
            glossFactor: "uGlossinessPBRFactor",
            metalFactor: "uMetalnessPBRFactor",
            opacity: "uOpacityFactor",
            normalMapFactor: "uNormalMapFactor",
            f0Factor: "uSpecularF0Factor",
            albedoMap: "sTextureAlbedoMap",
            normalMap: "sTextureNormalMap",
            normalMap2: "sTextureNormalMap2",
            aoMap: "sTextureAOMap",
            aoMap2: "sTextureAOMap2",
            metalGlossMap: "sTexturePBRMaps",
            emissiveMap: "sTextureEmissiveMap",
            lightMap: "sTextureLightMap",
            lightMapDir: "sTextureLightMapDir",
            cubemap: "sSpecularPBR",
            panorama: "sPanoramaPBR",
            sph: "uDiffuseSPH",
            exposure: "uEnvironmentExposure",
            transform: "uEnvironmentTransform",
            occludeSpecular: "uOccludeSpecular",
            alphaTest: "uAlphaTest",
            color: "uColor",
            contrast: "uContrast"
        }, c = function (t) {
            t = Object.assign({
                uniforms: {
                    uAOPBRFactor: {type: "f", value: 1},
                    uAlbedoPBRFactor: {type: "f", value: 1},
                    uGlossinessPBRFactor: {type: "f", value: 1},
                    uMetalnessPBRFactor: {type: "f", value: 1},
                    uNormalMapFactor: {type: "f", value: 1},
                    uSpecularF0Factor: {type: "f", value: 1},
                    uEnvironmentExposure: {type: "f", value: 1},
                    uOpacityFactor: {type: "f", value: 1},
                    sTextureAlbedoMap: {type: "t", value: null},
                    sTextureAlbedoMap2: {type: "t", value: null},
                    sTextureNormalMap: {type: "t", value: null},
                    sTextureNormalMap2: {type: "t", value: null},
                    sTextureAOMap: {type: "t", value: null},
                    sTextureAOMap2: {type: "t", value: null},
                    sTexturePBRMaps: {type: "t", value: null},
                    sTextureEmissiveMap: {type: "t", value: null},
                    sTextureLightMap: {type: "t", value: null},
                    sTextureLightMapDir: {type: "t", value: null},
                    sSpecularPBR: {type: "t", value: null},
                    sPanoramaPBR: {type: "t", value: null},
                    uTextureEnvironmentSpecularPBRLodRange: {type: "v2", value: new THREE.Vector2(10, 5)},
                    uTextureEnvironmentSpecularPBRTextureSize: {type: "v2", value: new THREE.Vector2},
                    uDiffuseSPH: {type: "3fv", value: null},
                    uFlipY: {type: "i", value: 0},
                    uOccludeSpecular: {type: "i", value: 0},
                    uOutputLinear: {type: "i", value: 0},
                    uEnvironmentTransform: {type: "m4", value: new THREE.Matrix4},
                    uMode: {type: "i", value: 0},
                    uColor: {type: "c", value: null},
                    uAlphaTest: {type: "f", value: 0},
                    uContrast: {type: "f", value: 1.1},
                    offsetRepeat: {type: "v4", value: new THREE.Vector4(0, 0, 1, 1)},
                    offsetRepeatDetail: {type: "v4", value: new THREE.Vector4(0, 0, 1, 1)},
                    viewLightDir: {type: "v3", value: new THREE.Vector3},
                    specularHighlights: {type: "i", value: 1},
                    ambientLightColor: {value: []},
                    directionalLights: {
                        value: [],
                        properties: {
                            direction: {},
                            color: {},
                            shadow: {},
                            shadowBias: {},
                            shadowRadius: {},
                            shadowMapSize: {}
                        }
                    },
                    directionalShadowMap: {value: []},
                    directionalShadowMatrix: {value: []},
                    spotLights: {
                        value: [],
                        properties: {
                            color: {},
                            position: {},
                            direction: {},
                            distance: {},
                            coneCos: {},
                            penumbraCos: {},
                            decay: {},
                            shadow: {},
                            shadowBias: {},
                            shadowRadius: {},
                            shadowMapSize: {}
                        }
                    },
                    spotShadowMap: {value: []},
                    spotShadowMatrix: {value: []},
                    pointLights: {
                        value: [],
                        properties: {
                            color: {},
                            position: {},
                            decay: {},
                            distance: {},
                            shadow: {},
                            shadowBias: {},
                            shadowRadius: {},
                            shadowMapSize: {},
                            shadowCameraNear: {},
                            shadowCameraFar: {}
                        }
                    },
                    pointShadowMap: {value: []},
                    pointShadowMatrix: {value: []},
                    hemisphereLights: {value: [], properties: {direction: {}, skyColor: {}, groundColor: {}}},
                    rectAreaLights: {value: [], properties: {color: {}, position: {}, width: {}, height: {}}},
                    fogNear: {type: "f", value: 225},
                    fogFar: {type: "f", value: 325},
                    fogColor: {type: "c", value: new THREE.Color(10676479)}
                }
            }, t), i.call(this, t), Object.keys(this.uniforms).forEach(function (t) {
                this.onPropertyChange(t, function (e) {
                    this.uniforms[t].value = e
                })
            }, this), _.each(s, function (t, e) {
                this.onPropertyChange(e, function (e) {
                    this[t] = e
                })
            }, this), this.extensions = {
                derivatives: !0,
                shaderTextureLOD: null !== THREE.Extensions.get("EXT_shader_texture_lod")
            }, this.pbr = !0, this.lights = !0
        };
        c.inherit(i, {
            _clone: function (t) {
                var e = t || new c;
                return i.prototype.clone.call(this, e), e.name = this.name, e.transparent = this.transparent, _.each(this.uniforms, function (t, n) {
                    var r = t.type;
                    "v2" === r || "m4" === r ? e.uniforms[n].value.copy(t.value) : e.uniforms[n].value = t.value
                }, this), e
            }, clone: function () {
                var t = c.create(this.createOptions);
                return t.uuid = THREE.Math.generateUUID(), t
            }, updateEnvironmentTransform: function () {
                var t = new THREE.Quaternion, e = new THREE.Matrix4;
                return function (n, r) {
                    n.getWorldQuaternion(t).inverse(), e.makeRotationY(r || 0), this.uniforms.uEnvironmentTransform.value.makeRotationFromQuaternion(t).multiply(e)
                }
            }(), refreshOffsetRepeat: function () {
                var t;
                if (this.defines.USE_ALBEDOMAP ? t = this.sTextureAlbedoMap : this.defines.USE_NORMALMAP ? t = this.sTextureNormalMap : this.defines.USE_AOMAP && (t = this.sTextureAOMap), void 0 !== t) {
                    var e = t.offset, n = t.repeat;
                    this.uniforms.offsetRepeat.value.set(e.x, e.y, n.x, n.y)
                }
            }, refreshOffsetRepeatDetail: function () {
                var t = this.sTextureNormalMap2;
                if (void 0 !== t) {
                    var e = t.offset, n = t.repeat;
                    this.uniforms.offsetRepeatDetail.value.set(e.x, e.y, n.x, n.y)
                }
            }, refreshUniforms: function (t, e) {
                this.updateEnvironmentTransform(t, e)
            }
        }), c.create = function (t) {
            var e = new c({vertexShader: t.vertexShader, fragmentShader: t.fragmentShader});
            e.createOptions = t, e.uuid = t.uuid, e.name = t.name, e.transparent = r(t.transparent, !1), e.polygonOffset = r(t.polygonOffset, !1), e.polygonOffsetUnits = r(t.polygonOffsetUnits, 0), e.polygonOffsetFactor = r(t.polygonOffsetFactor, 0);
            var n = a.CreateWhiteTexture(), i = a.CreateNormalTexture(), s = t.albedoMap || n, u = t.albedoMap2 || n,
                l = t.normalMap || i, f = t.normalMap2 || i, h = t.aoMap || n, p = t.aoMap2 || n,
                d = t.metalGlossMap || n, v = t.emissiveMap || n, m = t.lightMap || n, g = t.lightMapDir || n,
                _ = o.getSH(t.environment);
            return t.normalMap && (e.defines.USE_NORMALMAP = !0), t.normalMap2 && (e.defines.USE_NORMALMAP2 = !0), t.aoMap && (e.defines.USE_AOMAP = !0), t.aoMap2 && (e.defines.USE_AOMAP2 = !0), t.emissiveMap && (e.defines.USE_EMISSIVEMAP = !0), t.lightMap && (e.defines.USE_LIGHTMAP = !0), t.lightMapDir && (e.defines.USE_LIGHTMAP_DIR = !0), t.albedoMap && (e.defines.USE_ALBEDOMAP = !0), t.albedoMap2 && (e.defines.USE_ALBEDOMAP2 = !0), e.uAlbedoPBRFactor = r(t.albedoFactor, 1), e.uNormalMapFactor = r(t.normalMapFactor, 1), e.uMetalnessPBRFactor = r(t.metalFactor, 1), e.uGlossinessPBRFactor = r(t.glossFactor, 1), e.uAOPBRFactor = r(t.aoFactor, 1), e.uSpecularF0Factor = r(t.f0Factor, .5), e.uEnvironmentExposure = r(t.exposure, 1), e.occludeSpecular = r(t.occludeSpecular ? 1 : 0, 1), e.uFlipY = r(t.flipNormals, 0), e.opacity = r(t.opacity, 1), e.color = (new THREE.Color).setHex(void 0 !== t.color ? t.color : 16777215), e.side = r(t.side, THREE.FrontSide), s.needsUpdate = !0, u.needsUpdate = !0, l.needsUpdate = !0, f.needsUpdate = !0, h.needsUpdate = !0, p.needsUpdate = !0, d.needsUpdate = !0, v.needsUpdate = !0, m.needsUpdate = !0, g.needsUpdate = !0, e.sTextureAlbedoMap = s, e.sTextureAlbedoMap2 = u, e.sTextureNormalMap = l, e.sTextureNormalMap2 = f, e.sTextureAOMap = h, e.sTextureAOMap2 = p, e.sTexturePBRMaps = d, e.sTextureEmissiveMap = v, e.sTextureLightMap = m, e.sTextureLightMapDir = g, _ && (e.uDiffuseSPH = new Float32Array(_, 27)), e.uEnvironmentTransform = new THREE.Matrix4, t.alphaTest && (e.alphaTest = t.alphaTest, e.defines.ALPHATEST = !0), e.refreshOffsetRepeat(), e.refreshOffsetRepeatDetail(), e
        }, e.exports = c
    }, {15: 15, 23: 23, 4: 4}],
    23: [function (t, e, n) {
        var r = ["side", "alphaTest", "transparent", "depthWrite", "shading", "wireframe"], i = function (t) {
            t = t || {}, THREE.RawShaderMaterial.call(this, t), _.each(r, function (e) {
                var n = t[e];
                void 0 !== n && (this[e] = n)
            }, this)
        };
        i.inherit(THREE.RawShaderMaterial, {
            onPropertyChange: function (t, e) {
                Object.defineProperty(this, t, {
                    get: function () {
                        return this["_" + t]
                    }, set: function (n) {
                        this["_" + t] = n, e.call(this, n)
                    }
                })
            }, clone: function (t) {
                var e = t || new Material;
                return THREE.RawShaderMaterial.prototype.clone.call(this, e), e.shading = this.shading, e.wireframe = this.wireframe, e.wireframeLinewidth = this.wireframeLinewidth, e.fog = this.fog, e.lights = this.lights, e.vertexColors = this.vertexColors, e.skinning = this.skinning, e.morphTargets = this.morphTargets, e.morphNormals = this.morphNormals, e
            }
        }), e.exports = i
    }, {}],
    24: [function (t, e, n) {
        (function (t, r) {
            !function (t) {
                if ("object" == typeof n && "undefined" != typeof e) e.exports = t(); else if ("function" == typeof define && define.amd) define([], t); else {
                    var i;
                    "undefined" != typeof window ? i = window : "undefined" != typeof r ? i = r : "undefined" != typeof self && (i = self), i.Promise = t()
                }
            }(function () {
                var e, n, i;
                return function o(t, e, n) {
                    function r(a, s) {
                        if (!e[a]) {
                            if (!t[a]) {
                                var c = "function" == typeof _dereq_ && _dereq_;
                                if (!s && c) return c(a, !0);
                                if (i) return i(a, !0);
                                var u = new Error("Cannot find module '" + a + "'");
                                throw u.code = "MODULE_NOT_FOUND", u
                            }
                            var l = e[a] = {exports: {}};
                            t[a][0].call(l.exports, function (e) {
                                var n = t[a][1][e];
                                return r(n ? n : e)
                            }, l, l.exports, o, t, e, n)
                        }
                        return e[a].exports
                    }

                    for (var i = "function" == typeof _dereq_ && _dereq_, a = 0; a < n.length; a++) r(n[a]);
                    return r
                }({
                    1: [function (t, e, n) {
                        "use strict";
                        e.exports = function (t) {
                            function e(t) {
                                var e = new n(t), r = e.promise();
                                return e.setHowMany(1), e.setUnwrap(), e.init(), r
                            }

                            var n = t._SomePromiseArray;
                            t.any = function (t) {
                                return e(t)
                            }, t.prototype.any = function () {
                                return e(this)
                            }
                        }
                    }, {}], 2: [function (e, n, r) {
                        "use strict";

                        function i() {
                            this._customScheduler = !1, this._isTickUsed = !1, this._lateQueue = new f(16), this._normalQueue = new f(16), this._haveDrainedQueues = !1, this._trampolineEnabled = !0;
                            var t = this;
                            this.drainQueues = function () {
                                t._drainQueues()
                            }, this._schedule = l
                        }

                        function o(t, e, n) {
                            this._lateQueue.push(t, e, n), this._queueTick()
                        }

                        function a(t, e, n) {
                            this._normalQueue.push(t, e, n), this._queueTick()
                        }

                        function s(t) {
                            this._normalQueue._pushOne(t), this._queueTick()
                        }

                        var c;
                        try {
                            throw new Error
                        } catch (u) {
                            c = u
                        }
                        var l = e("./schedule"), f = e("./queue"), h = e("./util");
                        i.prototype.setScheduler = function (t) {
                            var e = this._schedule;
                            return this._schedule = t, this._customScheduler = !0, e
                        }, i.prototype.hasCustomScheduler = function () {
                            return this._customScheduler
                        }, i.prototype.enableTrampoline = function () {
                            this._trampolineEnabled = !0
                        }, i.prototype.disableTrampolineIfNecessary = function () {
                            h.hasDevTools && (this._trampolineEnabled = !1)
                        }, i.prototype.haveItemsQueued = function () {
                            return this._isTickUsed || this._haveDrainedQueues
                        }, i.prototype.fatalError = function (e, n) {
                            n ? (t.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) + "\n"), t.exit(2)) : this.throwLater(e)
                        }, i.prototype.throwLater = function (t, e) {
                            if (1 === arguments.length && (e = t, t = function () {
                                throw e
                            }), "undefined" != typeof setTimeout) setTimeout(function () {
                                t(e)
                            }, 0); else try {
                                this._schedule(function () {
                                    t(e)
                                })
                            } catch (n) {
                                throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n")
                            }
                        }, h.hasDevTools ? (i.prototype.invokeLater = function (t, e, n) {
                            this._trampolineEnabled ? o.call(this, t, e, n) : this._schedule(function () {
                                setTimeout(function () {
                                    t.call(e, n)
                                }, 100)
                            })
                        }, i.prototype.invoke = function (t, e, n) {
                            this._trampolineEnabled ? a.call(this, t, e, n) : this._schedule(function () {
                                t.call(e, n)
                            })
                        }, i.prototype.settlePromises = function (t) {
                            this._trampolineEnabled ? s.call(this, t) : this._schedule(function () {
                                t._settlePromises()
                            })
                        }) : (i.prototype.invokeLater = o, i.prototype.invoke = a, i.prototype.settlePromises = s), i.prototype._drainQueue = function (t) {
                            for (; t.length() > 0;) {
                                var e = t.shift();
                                if ("function" == typeof e) {
                                    var n = t.shift(), r = t.shift();
                                    e.call(n, r)
                                } else e._settlePromises()
                            }
                        }, i.prototype._drainQueues = function () {
                            this._drainQueue(this._normalQueue), this._reset(), this._haveDrainedQueues = !0, this._drainQueue(this._lateQueue)
                        }, i.prototype._queueTick = function () {
                            this._isTickUsed || (this._isTickUsed = !0, this._schedule(this.drainQueues))
                        }, i.prototype._reset = function () {
                            this._isTickUsed = !1
                        }, n.exports = i, n.exports.firstLineError = c
                    }, {"./queue": 26, "./schedule": 29, "./util": 36}], 3: [function (t, e, n) {
                        "use strict";
                        e.exports = function (t, e, n, r) {
                            var i = !1, o = function (t, e) {
                                this._reject(e)
                            }, a = function (t, e) {
                                e.promiseRejectionQueued = !0, e.bindingPromise._then(o, o, null, this, t)
                            }, s = function (t, e) {
                                0 === (50397184 & this._bitField) && this._resolveCallback(e.target)
                            }, c = function (t, e) {
                                e.promiseRejectionQueued || this._reject(t)
                            };
                            t.prototype.bind = function (o) {
                                i || (i = !0, t.prototype._propagateFrom = r.propagateFromFunction(), t.prototype._boundValue = r.boundValueFunction());
                                var u = n(o), l = new t(e);
                                l._propagateFrom(this, 1);
                                var f = this._target();
                                if (l._setBoundTo(u), u instanceof t) {
                                    var h = {promiseRejectionQueued: !1, promise: l, target: f, bindingPromise: u};
                                    f._then(e, a, void 0, l, h), u._then(s, c, void 0, l, h), l._setOnCancel(u)
                                } else l._resolveCallback(f);
                                return l
                            }, t.prototype._setBoundTo = function (t) {
                                void 0 !== t ? (this._bitField = 2097152 | this._bitField, this._boundTo = t) : this._bitField = this._bitField & -2097153
                            }, t.prototype._isBound = function () {
                                return 2097152 === (2097152 & this._bitField)
                            }, t.bind = function (e, n) {
                                return t.resolve(n).bind(e)
                            }
                        }
                    }, {}], 4: [function (t, e, n) {
                        "use strict";

                        function r() {
                            try {
                                Promise === o && (Promise = i)
                            } catch (t) {
                            }
                            return o
                        }

                        var i;
                        "undefined" != typeof Promise && (i = Promise);
                        var o = t("./promise")();
                        o.noConflict = r, e.exports = o
                    }, {"./promise": 22}], 5: [function (t, e, n) {
                        "use strict";
                        var r = Object.create;
                        if (r) {
                            var i = r(null), o = r(null);
                            i[" size"] = o[" size"] = 0
                        }
                        e.exports = function (e) {
                            function n(t, n) {
                                var r;
                                if (null != t && (r = t[n]), "function" != typeof r) {
                                    var i = "Object " + s.classString(t) + " has no method '" + s.toString(n) + "'";
                                    throw new e.TypeError(i)
                                }
                                return r
                            }

                            function r(t) {
                                var e = this.pop(), r = n(t, e);
                                return r.apply(t, this)
                            }

                            function i(t) {
                                return t[this]
                            }

                            function o(t) {
                                var e = +this;
                                return e < 0 && (e = Math.max(0, e + t.length)), t[e]
                            }

                            var a, s = t("./util"), c = s.canEvaluate;
                            s.isIdentifier;
                            e.prototype.call = function (t) {
                                var e = [].slice.call(arguments, 1);
                                return e.push(t), this._then(r, void 0, void 0, e, void 0)
                            }, e.prototype.get = function (t) {
                                var e, n = "number" == typeof t;
                                if (n) e = o; else if (c) {
                                    var r = a(t);
                                    e = null !== r ? r : i
                                } else e = i;
                                return this._then(e, void 0, void 0, t, void 0)
                            }
                        }
                    }, {"./util": 36}], 6: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e, n, r, i) {
                            var o = t("./util"), a = o.tryCatch, s = o.errorObj, c = e._async;
                            e.prototype["break"] = e.prototype.cancel = function () {
                                if (!i.cancellation()) return this._warn("cancellation is disabled");
                                for (var t = this, e = t; t._isCancellable();) {
                                    if (!t._cancelBy(e)) {
                                        e._isFollowing() ? e._followee().cancel() : e._cancelBranched();
                                        break
                                    }
                                    var n = t._cancellationParent;
                                    if (null == n || !n._isCancellable()) {
                                        t._isFollowing() ? t._followee().cancel() : t._cancelBranched();
                                        break
                                    }
                                    t._isFollowing() && t._followee().cancel(), t._setWillBeCancelled(), e = t, t = n
                                }
                            }, e.prototype._branchHasCancelled = function () {
                                this._branchesRemainingToCancel--
                            }, e.prototype._enoughBranchesHaveCancelled = function () {
                                return void 0 === this._branchesRemainingToCancel || this._branchesRemainingToCancel <= 0
                            }, e.prototype._cancelBy = function (t) {
                                return t === this ? (this._branchesRemainingToCancel = 0, this._invokeOnCancel(), !0) : (this._branchHasCancelled(), !!this._enoughBranchesHaveCancelled() && (this._invokeOnCancel(), !0))
                            }, e.prototype._cancelBranched = function () {
                                this._enoughBranchesHaveCancelled() && this._cancel()
                            }, e.prototype._cancel = function () {
                                this._isCancellable() && (this._setCancelled(), c.invoke(this._cancelPromises, this, void 0))
                            }, e.prototype._cancelPromises = function () {
                                this._length() > 0 && this._settlePromises()
                            }, e.prototype._unsetOnCancel = function () {
                                this._onCancelField = void 0
                            }, e.prototype._isCancellable = function () {
                                return this.isPending() && !this._isCancelled()
                            }, e.prototype.isCancellable = function () {
                                return this.isPending() && !this.isCancelled()
                            }, e.prototype._doInvokeOnCancel = function (t, e) {
                                if (o.isArray(t)) for (var n = 0; n < t.length; ++n) this._doInvokeOnCancel(t[n], e); else if (void 0 !== t) if ("function" == typeof t) {
                                    if (!e) {
                                        var r = a(t).call(this._boundValue());
                                        r === s && (this._attachExtraTrace(r.e), c.throwLater(r.e))
                                    }
                                } else t._resultCancelled(this)
                            }, e.prototype._invokeOnCancel = function () {
                                var t = this._onCancel();
                                this._unsetOnCancel(), c.invoke(this._doInvokeOnCancel, this, t)
                            }, e.prototype._invokeInternalOnCancel = function () {
                                this._isCancellable() && (this._doInvokeOnCancel(this._onCancel(), !0), this._unsetOnCancel())
                            }, e.prototype._resultCancelled = function () {
                                this.cancel()
                            }
                        }
                    }, {"./util": 36}], 7: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e) {
                            function n(t, n, s) {
                                return function (c) {
                                    var u = s._boundValue();
                                    t:for (var l = 0; l < t.length; ++l) {
                                        var f = t[l];
                                        if (f === Error || null != f && f.prototype instanceof Error) {
                                            if (c instanceof f) return o(n).call(u, c)
                                        } else if ("function" == typeof f) {
                                            var h = o(f).call(u, c);
                                            if (h === a) return h;
                                            if (h) return o(n).call(u, c)
                                        } else if (r.isObject(c)) {
                                            for (var p = i(f), d = 0; d < p.length; ++d) {
                                                var v = p[d];
                                                if (f[v] != c[v]) continue t
                                            }
                                            return o(n).call(u, c)
                                        }
                                    }
                                    return e
                                }
                            }

                            var r = t("./util"), i = t("./es5").keys, o = r.tryCatch, a = r.errorObj;
                            return n
                        }
                    }, {"./es5": 13, "./util": 36}], 8: [function (t, e, n) {
                        "use strict";
                        e.exports = function (t) {
                            function e() {
                                this._trace = new e.CapturedTrace(r())
                            }

                            function n() {
                                if (i) return new e
                            }

                            function r() {
                                var t = o.length - 1;
                                if (t >= 0) return o[t]
                            }

                            var i = !1, o = [];
                            return t.prototype._promiseCreated = function () {
                            }, t.prototype._pushContext = function () {
                            }, t.prototype._popContext = function () {
                                return null
                            }, t._peekContext = t.prototype._peekContext = function () {
                            }, e.prototype._pushContext = function () {
                                void 0 !== this._trace && (this._trace._promiseCreated = null, o.push(this._trace))
                            }, e.prototype._popContext = function () {
                                if (void 0 !== this._trace) {
                                    var t = o.pop(), e = t._promiseCreated;
                                    return t._promiseCreated = null, e
                                }
                                return null
                            }, e.CapturedTrace = null, e.create = n, e.deactivateLongStackTraces = function () {
                            }, e.activateLongStackTraces = function () {
                                var n = t.prototype._pushContext, o = t.prototype._popContext, a = t._peekContext,
                                    s = t.prototype._peekContext, c = t.prototype._promiseCreated;
                                e.deactivateLongStackTraces = function () {
                                    t.prototype._pushContext = n, t.prototype._popContext = o, t._peekContext = a, t.prototype._peekContext = s, t.prototype._promiseCreated = c, i = !1
                                }, i = !0, t.prototype._pushContext = e.prototype._pushContext, t.prototype._popContext = e.prototype._popContext, t._peekContext = t.prototype._peekContext = r, t.prototype._promiseCreated = function () {
                                    var t = this._peekContext();
                                    t && null == t._promiseCreated && (t._promiseCreated = this)
                                }
                            }, e
                        }
                    }, {}], 9: [function (e, n, r) {
                        "use strict";
                        n.exports = function (n, r) {
                            function i(t, e) {
                                return {promise: e}
                            }

                            function o() {
                                return !1
                            }

                            function a(t, e, n) {
                                var r = this;
                                try {
                                    t(e, n, function (t) {
                                        if ("function" != typeof t) throw new TypeError("onCancel must be a function, got: " + I.toString(t));
                                        r._attachCancellationCallback(t)
                                    })
                                } catch (i) {
                                    return i
                                }
                            }

                            function s(t) {
                                if (!this._isCancellable()) return this;
                                var e = this._onCancel();
                                void 0 !== e ? I.isArray(e) ? e.push(t) : this._setOnCancel([e, t]) : this._setOnCancel(t)
                            }

                            function c() {
                                return this._onCancelField
                            }

                            function u(t) {
                                this._onCancelField = t
                            }

                            function l() {
                                this._cancellationParent = void 0, this._onCancelField = void 0
                            }

                            function f(t, e) {
                                if (0 !== (1 & e)) {
                                    this._cancellationParent = t;
                                    var n = t._branchesRemainingToCancel;
                                    void 0 === n && (n = 0), t._branchesRemainingToCancel = n + 1
                                }
                                0 !== (2 & e) && t._isBound() && this._setBoundTo(t._boundTo)
                            }

                            function h(t, e) {
                                0 !== (2 & e) && t._isBound() && this._setBoundTo(t._boundTo)
                            }

                            function p() {
                                var t = this._boundTo;
                                return void 0 !== t && t instanceof n ? t.isFulfilled() ? t.value() : void 0 : t
                            }

                            function d() {
                                this._trace = new A(this._peekContext())
                            }

                            function v(t, e) {
                                if (U(t)) {
                                    var n = this._trace;
                                    if (void 0 !== n && e && (n = n._parent), void 0 !== n) n.attachExtraTrace(t); else if (!t.__stackCleaned__) {
                                        var r = T(t);
                                        I.notEnumerableProp(t, "stack", r.message + "\n" + r.stack.join("\n")), I.notEnumerableProp(t, "__stackCleaned__", !0)
                                    }
                                }
                            }

                            function m(t, e, n, r, i) {
                                if (void 0 === t && null !== e && $) {
                                    if (void 0 !== i && i._returnedNonUndefined()) return;
                                    if (0 === (65535 & r._bitField)) return;
                                    n && (n += " ");
                                    var o = "", a = "";
                                    if (e._trace) {
                                        for (var s = e._trace.stack.split("\n"), c = x(s), u = c.length - 1; u >= 0; --u) {
                                            var l = c[u];
                                            if (!B.test(l)) {
                                                var f = l.match(V);
                                                f && (o = "at " + f[1] + ":" + f[2] + ":" + f[3] + " ");
                                                break
                                            }
                                        }
                                        if (c.length > 0) for (var h = c[0], u = 0; u < s.length; ++u) if (s[u] === h) {
                                            u > 0 && (a = "\n" + s[u - 1]);
                                            break
                                        }
                                    }
                                    var p = "a promise was created in a " + n + "handler " + o + "but was not returned from it, see http://goo.gl/rRqMUw" + a;
                                    r._warn(p, !0, e)
                                }
                            }

                            function g(t, e) {
                                var n = t + " is deprecated and will be removed in a future version.";
                                return e && (n += " Use " + e + " instead."), _(n)
                            }

                            function _(t, e, r) {
                                if (at.warnings) {
                                    var i, o = new N(t);
                                    if (e) r._attachExtraTrace(o); else if (at.longStackTraces && (i = n._peekContext())) i.attachExtraTrace(o); else {
                                        var a = T(o);
                                        o.stack = a.message + "\n" + a.stack.join("\n")
                                    }
                                    et("warning", o) || R(o, "", !0)
                                }
                            }

                            function y(t, e) {
                                for (var n = 0; n < e.length - 1; ++n) e[n].push("From previous event:"), e[n] = e[n].join("\n");
                                return n < e.length && (e[n] = e[n].join("\n")), t + "\n" + e.join("\n")
                            }

                            function b(t) {
                                for (var e = 0; e < t.length; ++e) (0 === t[e].length || e + 1 < t.length && t[e][0] === t[e + 1][0]) && (t.splice(e, 1), e--)
                            }

                            function w(t) {
                                for (var e = t[0], n = 1; n < t.length; ++n) {
                                    for (var r = t[n], i = e.length - 1, o = e[i], a = -1, s = r.length - 1; s >= 0; --s) if (r[s] === o) {
                                        a = s;
                                        break
                                    }
                                    for (var s = a; s >= 0; --s) {
                                        var c = r[s];
                                        if (e[i] !== c) break;
                                        e.pop(), i--
                                    }
                                    e = r
                                }
                            }

                            function x(t) {
                                for (var e = [], n = 0; n < t.length; ++n) {
                                    var r = t[n], i = "    (No stack trace)" === r || G.test(r), o = i && rt(r);
                                    i && !o && (Y && " " !== r.charAt(0) && (r = "    " + r), e.push(r))
                                }
                                return e
                            }

                            function E(t) {
                                for (var e = t.stack.replace(/\s+$/g, "").split("\n"), n = 0; n < e.length; ++n) {
                                    var r = e[n];
                                    if ("    (No stack trace)" === r || G.test(r)) break
                                }
                                return n > 0 && "SyntaxError" != t.name && (e = e.slice(n)), e
                            }

                            function T(t) {
                                var e = t.stack, n = t.toString();
                                return e = "string" == typeof e && e.length > 0 ? E(t) : ["    (No stack trace)"], {
                                    message: n,
                                    stack: "SyntaxError" == t.name ? e : x(e)
                                }
                            }

                            function R(t, e, n) {
                                if ("undefined" != typeof console) {
                                    var r;
                                    if (I.isObject(t)) {
                                        var i = t.stack;
                                        r = e + X(i, t)
                                    } else r = e + String(t);
                                    "function" == typeof j ? j(r, n) : "function" != typeof console.log && "object" != typeof console.log || console.log(r)
                                }
                            }

                            function C(t, e, n, r) {
                                var i = !1;
                                try {
                                    "function" == typeof e && (i = !0, "rejectionHandled" === t ? e(r) : e(n, r))
                                } catch (o) {
                                    H.throwLater(o)
                                }
                                "unhandledRejection" === t ? et(t, n, r) || i || R(n, "Unhandled rejection ") : et(t, r)
                            }

                            function M(t) {
                                var e;
                                if ("function" == typeof t) e = "[function " + (t.name || "anonymous") + "]"; else {
                                    e = t && "function" == typeof t.toString ? t.toString() : I.toString(t);
                                    var n = /\[object [a-zA-Z0-9$_]+\]/;
                                    if (n.test(e)) try {
                                        var r = JSON.stringify(t);
                                        e = r
                                    } catch (i) {
                                    }
                                    0 === e.length && (e = "(empty array)")
                                }
                                return "(<" + S(e) + ">, no stack trace)"
                            }

                            function S(t) {
                                var e = 41;
                                return t.length < e ? t : t.substr(0, e - 3) + "..."
                            }

                            function O() {
                                return "function" == typeof ot
                            }

                            function P(t) {
                                var e = t.match(it);
                                if (e) return {fileName: e[1], line: parseInt(e[2], 10)}
                            }

                            function L(t, e) {
                                if (O()) {
                                    for (var n, r, i = t.stack.split("\n"), o = e.stack.split("\n"), a = -1, s = -1, c = 0; c < i.length; ++c) {
                                        var u = P(i[c]);
                                        if (u) {
                                            n = u.fileName, a = u.line;
                                            break
                                        }
                                    }
                                    for (var c = 0; c < o.length; ++c) {
                                        var u = P(o[c]);
                                        if (u) {
                                            r = u.fileName, s = u.line;
                                            break
                                        }
                                    }
                                    a < 0 || s < 0 || !n || !r || n !== r || a >= s || (rt = function (t) {
                                        if (z.test(t)) return !0;
                                        var e = P(t);
                                        return !!(e && e.fileName === n && a <= e.line && e.line <= s)
                                    })
                                }
                            }

                            function A(t) {
                                this._parent = t, this._promisesCreated = 0;
                                var e = this._length = 1 + (void 0 === t ? 0 : t._length);
                                ot(this, A), e > 32 && this.uncycle()
                            }

                            var k, F, j, D = n._getDomain, H = n._async, N = e("./errors").Warning, I = e("./util"),
                                U = I.canAttachTrace, z = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/,
                                B = /\((?:timers\.js):\d+:\d+\)/, V = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/, G = null,
                                X = null, Y = !1, q = !(0 == I.env("BLUEBIRD_DEBUG")),
                                W = !(0 == I.env("BLUEBIRD_WARNINGS") || !q && !I.env("BLUEBIRD_WARNINGS")),
                                Z = !(0 == I.env("BLUEBIRD_LONG_STACK_TRACES") || !q && !I.env("BLUEBIRD_LONG_STACK_TRACES")),
                                $ = 0 != I.env("BLUEBIRD_W_FORGOTTEN_RETURN") && (W || !!I.env("BLUEBIRD_W_FORGOTTEN_RETURN"));
                            n.prototype.suppressUnhandledRejections = function () {
                                var t = this._target();
                                t._bitField = t._bitField & -1048577 | 524288
                            }, n.prototype._ensurePossibleRejectionHandled = function () {
                                if (0 === (524288 & this._bitField)) {
                                    this._setRejectionIsUnhandled();
                                    var t = this;
                                    setTimeout(function () {
                                        t._notifyUnhandledRejection()
                                    }, 1)
                                }
                            }, n.prototype._notifyUnhandledRejectionIsHandled = function () {
                                C("rejectionHandled", k, void 0, this)
                            }, n.prototype._setReturnedNonUndefined = function () {
                                this._bitField = 268435456 | this._bitField
                            }, n.prototype._returnedNonUndefined = function () {
                                return 0 !== (268435456 & this._bitField)
                            }, n.prototype._notifyUnhandledRejection = function () {
                                if (this._isRejectionUnhandled()) {
                                    var t = this._settledValue();
                                    this._setUnhandledRejectionIsNotified(), C("unhandledRejection", F, t, this)
                                }
                            }, n.prototype._setUnhandledRejectionIsNotified = function () {
                                this._bitField = 262144 | this._bitField
                            }, n.prototype._unsetUnhandledRejectionIsNotified = function () {
                                this._bitField = this._bitField & -262145
                            }, n.prototype._isUnhandledRejectionNotified = function () {
                                return (262144 & this._bitField) > 0
                            }, n.prototype._setRejectionIsUnhandled = function () {
                                this._bitField = 1048576 | this._bitField
                            }, n.prototype._unsetRejectionIsUnhandled = function () {
                                this._bitField = this._bitField & -1048577, this._isUnhandledRejectionNotified() && (this._unsetUnhandledRejectionIsNotified(), this._notifyUnhandledRejectionIsHandled())
                            }, n.prototype._isRejectionUnhandled = function () {
                                return (1048576 & this._bitField) > 0
                            }, n.prototype._warn = function (t, e, n) {
                                return _(t, e, n || this)
                            }, n.onPossiblyUnhandledRejection = function (t) {
                                var e = D();
                                F = "function" == typeof t ? null === e ? t : I.domainBind(e, t) : void 0
                            }, n.onUnhandledRejectionHandled = function (t) {
                                var e = D();
                                k = "function" == typeof t ? null === e ? t : I.domainBind(e, t) : void 0
                            };
                            var K = function () {
                            };
                            n.longStackTraces = function () {
                                if (H.haveItemsQueued() && !at.longStackTraces) throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
                                if (!at.longStackTraces && O()) {
                                    var t = n.prototype._captureStackTrace, e = n.prototype._attachExtraTrace;
                                    at.longStackTraces = !0, K = function () {
                                        if (H.haveItemsQueued() && !at.longStackTraces) throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
                                        n.prototype._captureStackTrace = t, n.prototype._attachExtraTrace = e, r.deactivateLongStackTraces(), H.enableTrampoline(), at.longStackTraces = !1
                                    }, n.prototype._captureStackTrace = d, n.prototype._attachExtraTrace = v, r.activateLongStackTraces(), H.disableTrampolineIfNecessary()
                                }
                            }, n.hasLongStackTraces = function () {
                                return at.longStackTraces && O()
                            };
                            var Q = function () {
                                try {
                                    if ("function" == typeof CustomEvent) {
                                        var t = new CustomEvent("CustomEvent");
                                        return I.global.dispatchEvent(t), function (t, e) {
                                            var n = new CustomEvent(t.toLowerCase(), {detail: e, cancelable: !0});
                                            return !I.global.dispatchEvent(n)
                                        }
                                    }
                                    if ("function" == typeof Event) {
                                        var t = new Event("CustomEvent");
                                        return I.global.dispatchEvent(t), function (t, e) {
                                            var n = new Event(t.toLowerCase(), {cancelable: !0});
                                            return n.detail = e, !I.global.dispatchEvent(n)
                                        }
                                    }
                                    var t = document.createEvent("CustomEvent");
                                    return t.initCustomEvent("testingtheevent", !1, !0, {}), I.global.dispatchEvent(t), function (t, e) {
                                        var n = document.createEvent("CustomEvent");
                                        return n.initCustomEvent(t.toLowerCase(), !1, !0, e), !I.global.dispatchEvent(n)
                                    }
                                } catch (e) {
                                }
                                return function () {
                                    return !1
                                }
                            }(), J = function () {
                                return I.isNode ? function () {
                                    return t.emit.apply(t, arguments)
                                } : I.global ? function (t) {
                                    var e = "on" + t.toLowerCase(), n = I.global[e];
                                    return !!n && (n.apply(I.global, [].slice.call(arguments, 1)), !0)
                                } : function () {
                                    return !1
                                }
                            }(), tt = {
                                promiseCreated: i,
                                promiseFulfilled: i,
                                promiseRejected: i,
                                promiseResolved: i,
                                promiseCancelled: i,
                                promiseChained: function (t, e, n) {
                                    return {promise: e, child: n}
                                },
                                warning: function (t, e) {
                                    return {warning: e}
                                },
                                unhandledRejection: function (t, e, n) {
                                    return {reason: e, promise: n}
                                },
                                rejectionHandled: i
                            }, et = function (t) {
                                var e = !1;
                                try {
                                    e = J.apply(null, arguments)
                                } catch (n) {
                                    H.throwLater(n), e = !0
                                }
                                var r = !1;
                                try {
                                    r = Q(t, tt[t].apply(null, arguments))
                                } catch (n) {
                                    H.throwLater(n), r = !0
                                }
                                return r || e
                            };
                            n.config = function (t) {
                                if (t = Object(t), "longStackTraces" in t && (t.longStackTraces ? n.longStackTraces() : !t.longStackTraces && n.hasLongStackTraces() && K()), "warnings" in t) {
                                    var e = t.warnings;
                                    at.warnings = !!e, $ = at.warnings, I.isObject(e) && "wForgottenReturn" in e && ($ = !!e.wForgottenReturn)
                                }
                                if ("cancellation" in t && t.cancellation && !at.cancellation) {
                                    if (H.haveItemsQueued()) throw new Error("cannot enable cancellation after promises are in use");
                                    n.prototype._clearCancellationData = l, n.prototype._propagateFrom = f, n.prototype._onCancel = c, n.prototype._setOnCancel = u, n.prototype._attachCancellationCallback = s, n.prototype._execute = a, nt = f, at.cancellation = !0
                                }
                                return "monitoring" in t && (t.monitoring && !at.monitoring ? (at.monitoring = !0, n.prototype._fireEvent = et) : !t.monitoring && at.monitoring && (at.monitoring = !1, n.prototype._fireEvent = o)), n
                            }, n.prototype._fireEvent = o, n.prototype._execute = function (t, e, n) {
                                try {
                                    t(e, n)
                                } catch (r) {
                                    return r
                                }
                            }, n.prototype._onCancel = function () {
                            }, n.prototype._setOnCancel = function (t) {
                            }, n.prototype._attachCancellationCallback = function (t) {
                            }, n.prototype._captureStackTrace = function () {
                            }, n.prototype._attachExtraTrace = function () {
                            }, n.prototype._clearCancellationData = function () {
                            }, n.prototype._propagateFrom = function (t, e) {
                            };
                            var nt = h, rt = function () {
                                return !1
                            }, it = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
                            I.inherits(A, Error), r.CapturedTrace = A, A.prototype.uncycle = function () {
                                var t = this._length;
                                if (!(t < 2)) {
                                    for (var e = [], n = {}, r = 0, i = this; void 0 !== i; ++r) e.push(i), i = i._parent;
                                    t = this._length = r;
                                    for (var r = t - 1; r >= 0; --r) {
                                        var o = e[r].stack;
                                        void 0 === n[o] && (n[o] = r)
                                    }
                                    for (var r = 0; r < t; ++r) {
                                        var a = e[r].stack, s = n[a];
                                        if (void 0 !== s && s !== r) {
                                            s > 0 && (e[s - 1]._parent = void 0, e[s - 1]._length = 1), e[r]._parent = void 0, e[r]._length = 1;
                                            var c = r > 0 ? e[r - 1] : this;
                                            s < t - 1 ? (c._parent = e[s + 1], c._parent.uncycle(), c._length = c._parent._length + 1) : (c._parent = void 0, c._length = 1);
                                            for (var u = c._length + 1, l = r - 2; l >= 0; --l) e[l]._length = u, u++;
                                            return
                                        }
                                    }
                                }
                            }, A.prototype.attachExtraTrace = function (t) {
                                if (!t.__stackCleaned__) {
                                    this.uncycle();
                                    for (var e = T(t), n = e.message, r = [e.stack], i = this; void 0 !== i;) r.push(x(i.stack.split("\n"))), i = i._parent;
                                    w(r), b(r), I.notEnumerableProp(t, "stack", y(n, r)), I.notEnumerableProp(t, "__stackCleaned__", !0)
                                }
                            };
                            var ot = function () {
                                var t = /^\s*at\s*/, e = function (t, e) {
                                    return "string" == typeof t ? t : void 0 !== e.name && void 0 !== e.message ? e.toString() : M(e)
                                };
                                if ("number" == typeof Error.stackTraceLimit && "function" == typeof Error.captureStackTrace) {
                                    Error.stackTraceLimit += 6, G = t, X = e;
                                    var n = Error.captureStackTrace;
                                    return rt = function (t) {
                                        return z.test(t)
                                    }, function (t, e) {
                                        Error.stackTraceLimit += 6, n(t, e), Error.stackTraceLimit -= 6
                                    }
                                }
                                var r = new Error;
                                if ("string" == typeof r.stack && r.stack.split("\n")[0].indexOf("stackDetection@") >= 0) return G = /@/, X = e, Y = !0, function (t) {
                                    t.stack = (new Error).stack
                                };
                                var i;
                                try {
                                    throw new Error
                                } catch (o) {
                                    i = "stack" in o
                                }
                                return "stack" in r || !i || "number" != typeof Error.stackTraceLimit ? (X = function (t, e) {
                                    return "string" == typeof t ? t : "object" != typeof e && "function" != typeof e || void 0 === e.name || void 0 === e.message ? M(e) : e.toString()
                                }, null) : (G = t, X = e, function (t) {
                                    Error.stackTraceLimit += 6;
                                    try {
                                        throw new Error
                                    } catch (e) {
                                        t.stack = e.stack
                                    }
                                    Error.stackTraceLimit -= 6
                                })
                            }([]);
                            "undefined" != typeof console && "undefined" != typeof console.warn && (j = function (t) {
                                console.warn(t)
                            }, I.isNode && t.stderr.isTTY ? j = function (t, e) {
                                var n = e ? "[33m" : "[31m";
                                console.warn(n + t + "[0m\n")
                            } : I.isNode || "string" != typeof (new Error).stack || (j = function (t, e) {
                                console.warn("%c" + t, e ? "color: darkorange" : "color: red")
                            }));
                            var at = {warnings: W, longStackTraces: !1, cancellation: !1, monitoring: !1};
                            return Z && n.longStackTraces(), {
                                longStackTraces: function () {
                                    return at.longStackTraces
                                },
                                warnings: function () {
                                    return at.warnings
                                },
                                cancellation: function () {
                                    return at.cancellation
                                },
                                monitoring: function () {
                                    return at.monitoring
                                },
                                propagateFromFunction: function () {
                                    return nt
                                },
                                boundValueFunction: function () {
                                    return p
                                },
                                checkForgottenReturns: m,
                                setBounds: L,
                                warn: _,
                                deprecated: g,
                                CapturedTrace: A,
                                fireDomEvent: Q,
                                fireGlobalEvent: J
                            }
                        }
                    }, {"./errors": 12, "./util": 36}], 10: [function (t, e, n) {
                        "use strict";
                        e.exports = function (t) {
                            function e() {
                                return this.value
                            }

                            function n() {
                                throw this.reason
                            }

                            t.prototype["return"] = t.prototype.thenReturn = function (n) {
                                return n instanceof t && n.suppressUnhandledRejections(), this._then(e, void 0, void 0, {value: n}, void 0)
                            }, t.prototype["throw"] = t.prototype.thenThrow = function (t) {
                                return this._then(n, void 0, void 0, {reason: t}, void 0)
                            }, t.prototype.catchThrow = function (t) {
                                if (arguments.length <= 1) return this._then(void 0, n, void 0, {reason: t}, void 0);
                                var e = arguments[1], r = function () {
                                    throw e
                                };
                                return this.caught(t, r)
                            }, t.prototype.catchReturn = function (n) {
                                if (arguments.length <= 1) return n instanceof t && n.suppressUnhandledRejections(), this._then(void 0, e, void 0, {value: n}, void 0);
                                var r = arguments[1];
                                r instanceof t && r.suppressUnhandledRejections();
                                var i = function () {
                                    return r
                                };
                                return this.caught(n, i)
                            }
                        }
                    }, {}], 11: [function (t, e, n) {
                        "use strict";
                        e.exports = function (t, e) {
                            function n() {
                                return o(this)
                            }

                            function r(t, n) {
                                return i(t, n, e, e)
                            }

                            var i = t.reduce, o = t.all;
                            t.prototype.each = function (t) {
                                return i(this, t, e, 0)._then(n, void 0, void 0, this, void 0)
                            }, t.prototype.mapSeries = function (t) {
                                return i(this, t, e, e)
                            }, t.each = function (t, r) {
                                return i(t, r, e, 0)._then(n, void 0, void 0, t, void 0)
                            }, t.mapSeries = r
                        }
                    }, {}], 12: [function (t, e, n) {
                        "use strict";

                        function r(t, e) {
                            function n(r) {
                                return this instanceof n ? (f(this, "message", "string" == typeof r ? r : e), f(this, "name", t), void (Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : Error.call(this))) : new n(r)
                            }

                            return l(n, Error), n
                        }

                        function i(t) {
                            return this instanceof i ? (f(this, "name", "OperationalError"), f(this, "message", t), this.cause = t, this.isOperational = !0, void (t instanceof Error ? (f(this, "message", t.message), f(this, "stack", t.stack)) : Error.captureStackTrace && Error.captureStackTrace(this, this.constructor))) : new i(t)
                        }

                        var o, a, s = t("./es5"), c = s.freeze, u = t("./util"), l = u.inherits,
                            f = u.notEnumerableProp, h = r("Warning", "warning"),
                            p = r("CancellationError", "cancellation error"), d = r("TimeoutError", "timeout error"),
                            v = r("AggregateError", "aggregate error");
                        try {
                            o = TypeError, a = RangeError
                        } catch (m) {
                            o = r("TypeError", "type error"), a = r("RangeError", "range error")
                        }
                        for (var g = "join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" "), _ = 0; _ < g.length; ++_) "function" == typeof Array.prototype[g[_]] && (v.prototype[g[_]] = Array.prototype[g[_]]);
                        s.defineProperty(v.prototype, "length", {
                            value: 0,
                            configurable: !1,
                            writable: !0,
                            enumerable: !0
                        }), v.prototype.isOperational = !0;
                        var y = 0;
                        v.prototype.toString = function () {
                            var t = Array(4 * y + 1).join(" "), e = "\n" + t + "AggregateError of:\n";
                            y++, t = Array(4 * y + 1).join(" ");
                            for (var n = 0; n < this.length; ++n) {
                                for (var r = this[n] === this ? "[Circular AggregateError]" : this[n] + "", i = r.split("\n"), o = 0; o < i.length; ++o) i[o] = t + i[o];
                                r = i.join("\n"), e += r + "\n"
                            }
                            return y--, e
                        }, l(i, Error);
                        var b = Error.__BluebirdErrorTypes__;
                        b || (b = c({
                            CancellationError: p,
                            TimeoutError: d,
                            OperationalError: i,
                            RejectionError: i,
                            AggregateError: v
                        }), s.defineProperty(Error, "__BluebirdErrorTypes__", {
                            value: b,
                            writable: !1,
                            enumerable: !1,
                            configurable: !1
                        })), e.exports = {
                            Error: Error,
                            TypeError: o,
                            RangeError: a,
                            CancellationError: b.CancellationError,
                            OperationalError: b.OperationalError,
                            TimeoutError: b.TimeoutError,
                            AggregateError: b.AggregateError,
                            Warning: h
                        }
                    }, {"./es5": 13, "./util": 36}], 13: [function (t, e, n) {
                        var r = function () {
                            "use strict";
                            return void 0 === this
                        }();
                        if (r) e.exports = {
                            freeze: Object.freeze,
                            defineProperty: Object.defineProperty,
                            getDescriptor: Object.getOwnPropertyDescriptor,
                            keys: Object.keys,
                            names: Object.getOwnPropertyNames,
                            getPrototypeOf: Object.getPrototypeOf,
                            isArray: Array.isArray,
                            isES5: r,
                            propertyIsWritable: function (t, e) {
                                var n = Object.getOwnPropertyDescriptor(t, e);
                                return !(n && !n.writable && !n.set)
                            }
                        }; else {
                            var i = {}.hasOwnProperty, o = {}.toString, a = {}.constructor.prototype, s = function (t) {
                                var e = [];
                                for (var n in t) i.call(t, n) && e.push(n);
                                return e
                            }, c = function (t, e) {
                                return {value: t[e]}
                            }, u = function (t, e, n) {
                                return t[e] = n.value, t
                            }, l = function (t) {
                                return t
                            }, f = function (t) {
                                try {
                                    return Object(t).constructor.prototype
                                } catch (e) {
                                    return a
                                }
                            }, h = function (t) {
                                try {
                                    return "[object Array]" === o.call(t)
                                } catch (e) {
                                    return !1
                                }
                            };
                            e.exports = {
                                isArray: h,
                                keys: s,
                                names: s,
                                defineProperty: u,
                                getDescriptor: c,
                                freeze: l,
                                getPrototypeOf: f,
                                isES5: r,
                                propertyIsWritable: function () {
                                    return !0
                                }
                            }
                        }
                    }, {}], 14: [function (t, e, n) {
                        "use strict";
                        e.exports = function (t, e) {
                            var n = t.map;
                            t.prototype.filter = function (t, r) {
                                return n(this, t, r, e)
                            }, t.filter = function (t, r, i) {
                                return n(t, r, i, e)
                            }
                        }
                    }, {}], 15: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e, n, r) {
                            function i(t, e, n) {
                                this.promise = t, this.type = e, this.handler = n, this.called = !1, this.cancelPromise = null
                            }

                            function o(t) {
                                this.finallyHandler = t
                            }

                            function a(t, e) {
                                return null != t.cancelPromise && (arguments.length > 1 ? t.cancelPromise._reject(e) : t.cancelPromise._cancel(), t.cancelPromise = null, !0)
                            }

                            function s() {
                                return u.call(this, this.promise._target()._settledValue())
                            }

                            function c(t) {
                                if (!a(this, t)) return h.e = t, h
                            }

                            function u(t) {
                                var i = this.promise, u = this.handler;
                                if (!this.called) {
                                    this.called = !0;
                                    var l = this.isFinallyHandler() ? u.call(i._boundValue()) : u.call(i._boundValue(), t);
                                    if (l === r) return l;
                                    if (void 0 !== l) {
                                        i._setReturnedNonUndefined();
                                        var p = n(l, i);
                                        if (p instanceof e) {
                                            if (null != this.cancelPromise) {
                                                if (p._isCancelled()) {
                                                    var d = new f("late cancellation observer");
                                                    return i._attachExtraTrace(d), h.e = d, h
                                                }
                                                p.isPending() && p._attachCancellationCallback(new o(this))
                                            }
                                            return p._then(s, c, void 0, this, void 0)
                                        }
                                    }
                                }
                                return i.isRejected() ? (a(this), h.e = t, h) : (a(this), t)
                            }

                            var l = t("./util"), f = e.CancellationError, h = l.errorObj, p = t("./catch_filter")(r);
                            return i.prototype.isFinallyHandler = function () {
                                return 0 === this.type
                            }, o.prototype._resultCancelled = function () {
                                a(this.finallyHandler)
                            }, e.prototype._passThrough = function (t, e, n, r) {
                                return "function" != typeof t ? this.then() : this._then(n, r, void 0, new i(this, e, t), void 0)
                            }, e.prototype.lastly = e.prototype["finally"] = function (t) {
                                return this._passThrough(t, 0, u, u)
                            }, e.prototype.tap = function (t) {
                                return this._passThrough(t, 1, u)
                            }, e.prototype.tapCatch = function (t) {
                                var n = arguments.length;
                                if (1 === n) return this._passThrough(t, 1, void 0, u);
                                var r, i = new Array(n - 1), o = 0;
                                for (r = 0; r < n - 1; ++r) {
                                    var a = arguments[r];
                                    if (!l.isObject(a)) return e.reject(new TypeError("tapCatch statement predicate: expecting an object but got " + l.classString(a)));
                                    i[o++] = a
                                }
                                i.length = o;
                                var s = arguments[r];
                                return this._passThrough(p(i, s, this), 1, void 0, u)
                            }, i
                        }
                    }, {"./catch_filter": 7, "./util": 36}], 16: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e, n, r, i, o, a) {
                            function s(t, n, r) {
                                for (var o = 0; o < n.length; ++o) {
                                    r._pushContext();
                                    var a = p(n[o])(t);
                                    if (r._popContext(), a === h) {
                                        r._pushContext();
                                        var s = e.reject(h.e);
                                        return r._popContext(), s
                                    }
                                    var c = i(a, r);
                                    if (c instanceof e) return c
                                }
                                return null
                            }

                            function c(t, n, i, o) {
                                if (a.cancellation()) {
                                    var s = new e(r), c = this._finallyPromise = new e(r);
                                    this._promise = s.lastly(function () {
                                        return c
                                    }), s._captureStackTrace(), s._setOnCancel(this)
                                } else {
                                    var u = this._promise = new e(r);
                                    u._captureStackTrace()
                                }
                                this._stack = o, this._generatorFunction = t, this._receiver = n, this._generator = void 0, this._yieldHandlers = "function" == typeof i ? [i].concat(d) : d, this._yieldedPromise = null, this._cancellationPhase = !1
                            }

                            var u = t("./errors"), l = u.TypeError, f = t("./util"), h = f.errorObj, p = f.tryCatch,
                                d = [];
                            f.inherits(c, o), c.prototype._isResolved = function () {
                                return null === this._promise
                            }, c.prototype._cleanup = function () {
                                this._promise = this._generator = null, a.cancellation() && null !== this._finallyPromise && (this._finallyPromise._fulfill(), this._finallyPromise = null)
                            }, c.prototype._promiseCancelled = function () {
                                if (!this._isResolved()) {
                                    var t, n = "undefined" != typeof this._generator["return"];
                                    if (n) this._promise._pushContext(), t = p(this._generator["return"]).call(this._generator, void 0), this._promise._popContext(); else {
                                        var r = new e.CancellationError("generator .return() sentinel");
                                        e.coroutine.returnSentinel = r, this._promise._attachExtraTrace(r), this._promise._pushContext(), t = p(this._generator["throw"]).call(this._generator, r), this._promise._popContext()
                                    }
                                    this._cancellationPhase = !0, this._yieldedPromise = null, this._continue(t)
                                }
                            }, c.prototype._promiseFulfilled = function (t) {
                                this._yieldedPromise = null, this._promise._pushContext();
                                var e = p(this._generator.next).call(this._generator, t);
                                this._promise._popContext(), this._continue(e)
                            }, c.prototype._promiseRejected = function (t) {
                                this._yieldedPromise = null, this._promise._attachExtraTrace(t), this._promise._pushContext();
                                var e = p(this._generator["throw"]).call(this._generator, t);
                                this._promise._popContext(), this._continue(e)
                            }, c.prototype._resultCancelled = function () {
                                if (this._yieldedPromise instanceof e) {
                                    var t = this._yieldedPromise;
                                    this._yieldedPromise = null, t.cancel()
                                }
                            }, c.prototype.promise = function () {
                                return this._promise
                            }, c.prototype._run = function () {
                                this._generator = this._generatorFunction.call(this._receiver), this._receiver = this._generatorFunction = void 0, this._promiseFulfilled(void 0)
                            }, c.prototype._continue = function (t) {
                                var n = this._promise;
                                if (t === h) return this._cleanup(), this._cancellationPhase ? n.cancel() : n._rejectCallback(t.e, !1);
                                var r = t.value;
                                if (t.done === !0) return this._cleanup(), this._cancellationPhase ? n.cancel() : n._resolveCallback(r);
                                var o = i(r, this._promise);
                                if (!(o instanceof e) && (o = s(o, this._yieldHandlers, this._promise), null === o)) return void this._promiseRejected(new l("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s", String(r)) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")));
                                o = o._target();
                                var a = o._bitField;
                                0 === (50397184 & a) ? (this._yieldedPromise = o, o._proxy(this, null)) : 0 !== (33554432 & a) ? e._async.invoke(this._promiseFulfilled, this, o._value()) : 0 !== (16777216 & a) ? e._async.invoke(this._promiseRejected, this, o._reason()) : this._promiseCancelled()
                            }, e.coroutine = function (t, e) {
                                if ("function" != typeof t) throw new l("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
                                var n = Object(e).yieldHandler, r = c, i = (new Error).stack;
                                return function () {
                                    var e = t.apply(this, arguments), o = new r((void 0), (void 0), n, i),
                                        a = o.promise();
                                    return o._generator = e, o._promiseFulfilled(void 0), a
                                }
                            }, e.coroutine.addYieldHandler = function (t) {
                                if ("function" != typeof t) throw new l("expecting a function but got " + f.classString(t));
                                d.push(t)
                            }, e.spawn = function (t) {
                                if (a.deprecated("Promise.spawn()", "Promise.coroutine()"), "function" != typeof t) return n("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
                                var r = new c(t, this), i = r.promise();
                                return r._run(e.spawn), i
                            }
                        }
                    }, {"./errors": 12, "./util": 36}], 17: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e, n, r, i, o, a) {
                            var s = t("./util");
                            s.canEvaluate, s.tryCatch, s.errorObj;
                            e.join = function () {
                                var t, e = arguments.length - 1;
                                if (e > 0 && "function" == typeof arguments[e]) {
                                    t = arguments[e];
                                    var r
                                }
                                var i = [].slice.call(arguments);
                                t && i.pop();
                                var r = new n(i).promise();
                                return void 0 !== t ? r.spread(t) : r
                            }
                        }
                    }, {"./util": 36}], 18: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e, n, r, i, o, a) {
                            function s(t, e, n, r) {
                                this.constructor$(t), this._promise._captureStackTrace();
                                var i = u();
                                this._callback = null === i ? e : l.domainBind(i, e), this._preservedValues = r === o ? new Array(this.length()) : null, this._limit = n, this._inFlight = 0, this._queue = [], p.invoke(this._asyncInit, this, void 0)
                            }

                            function c(t, n, i, o) {
                                if ("function" != typeof n) return r("expecting a function but got " + l.classString(n));
                                var a = 0;
                                if (void 0 !== i) {
                                    if ("object" != typeof i || null === i) return e.reject(new TypeError("options argument must be an object but it is " + l.classString(i)));
                                    if ("number" != typeof i.concurrency) return e.reject(new TypeError("'concurrency' must be a number but it is " + l.classString(i.concurrency)));
                                    a = i.concurrency
                                }
                                return a = "number" == typeof a && isFinite(a) && a >= 1 ? a : 0, new s(t, n, a, o).promise()
                            }

                            var u = e._getDomain, l = t("./util"), f = l.tryCatch, h = l.errorObj, p = e._async;
                            l.inherits(s, n), s.prototype._asyncInit = function () {
                                this._init$(void 0, -2)
                            }, s.prototype._init = function () {
                            }, s.prototype._promiseFulfilled = function (t, n) {
                                var r = this._values, o = this.length(), s = this._preservedValues, c = this._limit;
                                if (n < 0) {
                                    if (n = n * -1 - 1, r[n] = t, c >= 1 && (this._inFlight--, this._drainQueue(), this._isResolved())) return !0
                                } else {
                                    if (c >= 1 && this._inFlight >= c) return r[n] = t, this._queue.push(n), !1;
                                    null !== s && (s[n] = t);
                                    var u = this._promise, l = this._callback, p = u._boundValue();
                                    u._pushContext();
                                    var d = f(l).call(p, t, n, o), v = u._popContext();
                                    if (a.checkForgottenReturns(d, v, null !== s ? "Promise.filter" : "Promise.map", u), d === h) return this._reject(d.e), !0;
                                    var m = i(d, this._promise);
                                    if (m instanceof e) {
                                        m = m._target();
                                        var g = m._bitField;
                                        if (0 === (50397184 & g)) return c >= 1 && this._inFlight++, r[n] = m, m._proxy(this, (n + 1) * -1), !1;
                                        if (0 === (33554432 & g)) return 0 !== (16777216 & g) ? (this._reject(m._reason()), !0) : (this._cancel(), !0);
                                        d = m._value()
                                    }
                                    r[n] = d
                                }
                                var _ = ++this._totalResolved;
                                return _ >= o && (null !== s ? this._filter(r, s) : this._resolve(r), !0)
                            }, s.prototype._drainQueue = function () {
                                for (var t = this._queue, e = this._limit, n = this._values; t.length > 0 && this._inFlight < e;) {
                                    if (this._isResolved()) return;
                                    var r = t.pop();
                                    this._promiseFulfilled(n[r], r)
                                }
                            }, s.prototype._filter = function (t, e) {
                                for (var n = e.length, r = new Array(n), i = 0, o = 0; o < n; ++o) t[o] && (r[i++] = e[o]);
                                r.length = i, this._resolve(r)
                            }, s.prototype.preservedValues = function () {
                                return this._preservedValues
                            }, e.prototype.map = function (t, e) {
                                return c(this, t, e, null)
                            }, e.map = function (t, e, n, r) {
                                return c(t, e, n, r)
                            }
                        }
                    }, {"./util": 36}], 19: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e, n, r, i, o) {
                            var a = t("./util"), s = a.tryCatch;
                            e.method = function (t) {
                                if ("function" != typeof t) throw new e.TypeError("expecting a function but got " + a.classString(t));
                                return function () {
                                    var r = new e(n);
                                    r._captureStackTrace(), r._pushContext();
                                    var i = s(t).apply(this, arguments), a = r._popContext();
                                    return o.checkForgottenReturns(i, a, "Promise.method", r), r._resolveFromSyncValue(i), r
                                }
                            }, e.attempt = e["try"] = function (t) {
                                if ("function" != typeof t) return i("expecting a function but got " + a.classString(t));
                                var r = new e(n);
                                r._captureStackTrace(), r._pushContext();
                                var c;
                                if (arguments.length > 1) {
                                    o.deprecated("calling Promise.try with more than 1 argument");
                                    var u = arguments[1], l = arguments[2];
                                    c = a.isArray(u) ? s(t).apply(l, u) : s(t).call(l, u)
                                } else c = s(t)();
                                var f = r._popContext();
                                return o.checkForgottenReturns(c, f, "Promise.try", r), r._resolveFromSyncValue(c), r
                            }, e.prototype._resolveFromSyncValue = function (t) {
                                t === a.errorObj ? this._rejectCallback(t.e, !1) : this._resolveCallback(t, !0)
                            }
                        }
                    }, {"./util": 36}], 20: [function (t, e, n) {
                        "use strict";

                        function r(t) {
                            return t instanceof Error && l.getPrototypeOf(t) === Error.prototype
                        }

                        function i(t) {
                            var e;
                            if (r(t)) {
                                e = new u(t), e.name = t.name, e.message = t.message, e.stack = t.stack;
                                for (var n = l.keys(t), i = 0; i < n.length; ++i) {
                                    var o = n[i];
                                    f.test(o) || (e[o] = t[o])
                                }
                                return e
                            }
                            return a.markAsOriginatingFromRejection(t), t
                        }

                        function o(t, e) {
                            return function (n, r) {
                                if (null !== t) {
                                    if (n) {
                                        var o = i(s(n));
                                        t._attachExtraTrace(o), t._reject(o)
                                    } else if (e) {
                                        var a = [].slice.call(arguments, 1);
                                        t._fulfill(a)
                                    } else t._fulfill(r);
                                    t = null
                                }
                            }
                        }

                        var a = t("./util"), s = a.maybeWrapAsError, c = t("./errors"), u = c.OperationalError,
                            l = t("./es5"), f = /^(?:name|message|stack|cause)$/;
                        e.exports = o
                    }, {"./errors": 12, "./es5": 13, "./util": 36}], 21: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e) {
                            function n(t, e) {
                                var n = this;
                                if (!o.isArray(t)) return r.call(n, t, e);
                                var i = s(e).apply(n._boundValue(), [null].concat(t));
                                i === c && a.throwLater(i.e)
                            }

                            function r(t, e) {
                                var n = this, r = n._boundValue(),
                                    i = void 0 === t ? s(e).call(r, null) : s(e).call(r, null, t);
                                i === c && a.throwLater(i.e)
                            }

                            function i(t, e) {
                                var n = this;
                                if (!t) {
                                    var r = new Error(t + "");
                                    r.cause = t, t = r
                                }
                                var i = s(e).call(n._boundValue(), t);
                                i === c && a.throwLater(i.e)
                            }

                            var o = t("./util"), a = e._async, s = o.tryCatch, c = o.errorObj;
                            e.prototype.asCallback = e.prototype.nodeify = function (t, e) {
                                if ("function" == typeof t) {
                                    var o = r;
                                    void 0 !== e && Object(e).spread && (o = n), this._then(o, i, void 0, this, t)
                                }
                                return this
                            }
                        }
                    }, {"./util": 36}], 22: [function (e, n, r) {
                        "use strict";
                        n.exports = function () {
                            function r() {
                            }

                            function i(t, e) {
                                if (null == t || t.constructor !== o) throw new y("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");
                                if ("function" != typeof e) throw new y("expecting a function but got " + d.classString(e))
                            }

                            function o(t) {
                                t !== w && i(this, t), this._bitField = 0, this._fulfillmentHandler0 = void 0, this._rejectionHandler0 = void 0, this._promise0 = void 0, this._receiver0 = void 0, this._resolveFromExecutor(t), this._promiseCreated(), this._fireEvent("promiseCreated", this)
                            }

                            function a(t) {
                                this.promise._resolveCallback(t)
                            }

                            function s(t) {
                                this.promise._rejectCallback(t, !1)
                            }

                            function c(t) {
                                var e = new o(w);
                                e._fulfillmentHandler0 = t, e._rejectionHandler0 = t, e._promise0 = t, e._receiver0 = t
                            }

                            var u, l = function () {
                                return new y("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n")
                            }, f = function () {
                                return new o.PromiseInspection(this._target())
                            }, h = function (t) {
                                return o.reject(new y(t))
                            }, p = {}, d = e("./util");
                            u = d.isNode ? function () {
                                var e = t.domain;
                                return void 0 === e && (e = null), e
                            } : function () {
                                return null
                            }, d.notEnumerableProp(o, "_getDomain", u);
                            var v = e("./es5"), m = e("./async"), g = new m;
                            v.defineProperty(o, "_async", {value: g});
                            var _ = e("./errors"), y = o.TypeError = _.TypeError;
                            o.RangeError = _.RangeError;
                            var b = o.CancellationError = _.CancellationError;
                            o.TimeoutError = _.TimeoutError, o.OperationalError = _.OperationalError, o.RejectionError = _.OperationalError, o.AggregateError = _.AggregateError;
                            var w = function () {
                                }, x = {}, E = {}, T = e("./thenables")(o, w), R = e("./promise_array")(o, w, T, h, r),
                                C = e("./context")(o), M = C.create, S = e("./debuggability")(o, C),
                                O = (S.CapturedTrace, e("./finally")(o, T, E)), P = e("./catch_filter")(E),
                                L = e("./nodeback"), A = d.errorObj, k = d.tryCatch;
                            return o.prototype.toString = function () {
                                return "[object Promise]"
                            }, o.prototype.caught = o.prototype["catch"] = function (t) {
                                var e = arguments.length;
                                if (e > 1) {
                                    var n, r = new Array(e - 1), i = 0;
                                    for (n = 0; n < e - 1; ++n) {
                                        var o = arguments[n];
                                        if (!d.isObject(o)) return h("Catch statement predicate: expecting an object but got " + d.classString(o));
                                        r[i++] = o
                                    }
                                    return r.length = i, t = arguments[n], this.then(void 0, P(r, t, this))
                                }
                                return this.then(void 0, t)
                            }, o.prototype.reflect = function () {
                                return this._then(f, f, void 0, this, void 0)
                            }, o.prototype.then = function (t, e) {
                                if (S.warnings() && arguments.length > 0 && "function" != typeof t && "function" != typeof e) {
                                    var n = ".then() only accepts functions but was passed: " + d.classString(t);
                                    arguments.length > 1 && (n += ", " + d.classString(e)), this._warn(n)
                                }
                                return this._then(t, e, void 0, void 0, void 0)
                            }, o.prototype.done = function (t, e) {
                                var n = this._then(t, e, void 0, void 0, void 0);
                                n._setIsFinal()
                            }, o.prototype.spread = function (t) {
                                return "function" != typeof t ? h("expecting a function but got " + d.classString(t)) : this.all()._then(t, void 0, void 0, x, void 0)
                            }, o.prototype.toJSON = function () {
                                var t = {
                                    isFulfilled: !1,
                                    isRejected: !1,
                                    fulfillmentValue: void 0,
                                    rejectionReason: void 0
                                };
                                return this.isFulfilled() ? (t.fulfillmentValue = this.value(), t.isFulfilled = !0) : this.isRejected() && (t.rejectionReason = this.reason(), t.isRejected = !0), t
                            }, o.prototype.all = function () {
                                return arguments.length > 0 && this._warn(".all() was passed arguments but it does not take any"), new R(this).promise()
                            }, o.prototype.error = function (t) {
                                return this.caught(d.originatesFromRejection, t);
                            }, o.getNewLibraryCopy = n.exports, o.is = function (t) {
                                return t instanceof o
                            }, o.fromNode = o.fromCallback = function (t) {
                                var e = new o(w);
                                e._captureStackTrace();
                                var n = arguments.length > 1 && !!Object(arguments[1]).multiArgs, r = k(t)(L(e, n));
                                return r === A && e._rejectCallback(r.e, !0), e._isFateSealed() || e._setAsyncGuaranteed(), e
                            }, o.all = function (t) {
                                return new R(t).promise()
                            }, o.cast = function (t) {
                                var e = T(t);
                                return e instanceof o || (e = new o(w), e._captureStackTrace(), e._setFulfilled(), e._rejectionHandler0 = t), e
                            }, o.resolve = o.fulfilled = o.cast, o.reject = o.rejected = function (t) {
                                var e = new o(w);
                                return e._captureStackTrace(), e._rejectCallback(t, !0), e
                            }, o.setScheduler = function (t) {
                                if ("function" != typeof t) throw new y("expecting a function but got " + d.classString(t));
                                return g.setScheduler(t)
                            }, o.prototype._then = function (t, e, n, r, i) {
                                var a = void 0 !== i, s = a ? i : new o(w), c = this._target(), l = c._bitField;
                                a || (s._propagateFrom(this, 3), s._captureStackTrace(), void 0 === r && 0 !== (2097152 & this._bitField) && (r = 0 !== (50397184 & l) ? this._boundValue() : c === this ? void 0 : this._boundTo), this._fireEvent("promiseChained", this, s));
                                var f = u();
                                if (0 !== (50397184 & l)) {
                                    var h, p, v = c._settlePromiseCtx;
                                    0 !== (33554432 & l) ? (p = c._rejectionHandler0, h = t) : 0 !== (16777216 & l) ? (p = c._fulfillmentHandler0, h = e, c._unsetRejectionIsUnhandled()) : (v = c._settlePromiseLateCancellationObserver, p = new b("late cancellation observer"), c._attachExtraTrace(p), h = e), g.invoke(v, c, {
                                        handler: null === f ? h : "function" == typeof h && d.domainBind(f, h),
                                        promise: s,
                                        receiver: r,
                                        value: p
                                    })
                                } else c._addCallbacks(t, e, s, r, f);
                                return s
                            }, o.prototype._length = function () {
                                return 65535 & this._bitField
                            }, o.prototype._isFateSealed = function () {
                                return 0 !== (117506048 & this._bitField)
                            }, o.prototype._isFollowing = function () {
                                return 67108864 === (67108864 & this._bitField)
                            }, o.prototype._setLength = function (t) {
                                this._bitField = this._bitField & -65536 | 65535 & t
                            }, o.prototype._setFulfilled = function () {
                                this._bitField = 33554432 | this._bitField, this._fireEvent("promiseFulfilled", this)
                            }, o.prototype._setRejected = function () {
                                this._bitField = 16777216 | this._bitField, this._fireEvent("promiseRejected", this)
                            }, o.prototype._setFollowing = function () {
                                this._bitField = 67108864 | this._bitField, this._fireEvent("promiseResolved", this)
                            }, o.prototype._setIsFinal = function () {
                                this._bitField = 4194304 | this._bitField
                            }, o.prototype._isFinal = function () {
                                return (4194304 & this._bitField) > 0
                            }, o.prototype._unsetCancelled = function () {
                                this._bitField = this._bitField & -65537
                            }, o.prototype._setCancelled = function () {
                                this._bitField = 65536 | this._bitField, this._fireEvent("promiseCancelled", this)
                            }, o.prototype._setWillBeCancelled = function () {
                                this._bitField = 8388608 | this._bitField
                            }, o.prototype._setAsyncGuaranteed = function () {
                                g.hasCustomScheduler() || (this._bitField = 134217728 | this._bitField)
                            }, o.prototype._receiverAt = function (t) {
                                var e = 0 === t ? this._receiver0 : this[4 * t - 4 + 3];
                                if (e !== p) return void 0 === e && this._isBound() ? this._boundValue() : e
                            }, o.prototype._promiseAt = function (t) {
                                return this[4 * t - 4 + 2]
                            }, o.prototype._fulfillmentHandlerAt = function (t) {
                                return this[4 * t - 4 + 0]
                            }, o.prototype._rejectionHandlerAt = function (t) {
                                return this[4 * t - 4 + 1]
                            }, o.prototype._boundValue = function () {
                            }, o.prototype._migrateCallback0 = function (t) {
                                var e = (t._bitField, t._fulfillmentHandler0), n = t._rejectionHandler0,
                                    r = t._promise0, i = t._receiverAt(0);
                                void 0 === i && (i = p), this._addCallbacks(e, n, r, i, null)
                            }, o.prototype._migrateCallbackAt = function (t, e) {
                                var n = t._fulfillmentHandlerAt(e), r = t._rejectionHandlerAt(e), i = t._promiseAt(e),
                                    o = t._receiverAt(e);
                                void 0 === o && (o = p), this._addCallbacks(n, r, i, o, null)
                            }, o.prototype._addCallbacks = function (t, e, n, r, i) {
                                var o = this._length();
                                if (o >= 65531 && (o = 0, this._setLength(0)), 0 === o) this._promise0 = n, this._receiver0 = r, "function" == typeof t && (this._fulfillmentHandler0 = null === i ? t : d.domainBind(i, t)), "function" == typeof e && (this._rejectionHandler0 = null === i ? e : d.domainBind(i, e)); else {
                                    var a = 4 * o - 4;
                                    this[a + 2] = n, this[a + 3] = r, "function" == typeof t && (this[a + 0] = null === i ? t : d.domainBind(i, t)), "function" == typeof e && (this[a + 1] = null === i ? e : d.domainBind(i, e))
                                }
                                return this._setLength(o + 1), o
                            }, o.prototype._proxy = function (t, e) {
                                this._addCallbacks(void 0, void 0, e, t, null)
                            }, o.prototype._resolveCallback = function (t, e) {
                                if (0 === (117506048 & this._bitField)) {
                                    if (t === this) return this._rejectCallback(l(), !1);
                                    var n = T(t, this);
                                    if (!(n instanceof o)) return this._fulfill(t);
                                    e && this._propagateFrom(n, 2);
                                    var r = n._target();
                                    if (r === this) return void this._reject(l());
                                    var i = r._bitField;
                                    if (0 === (50397184 & i)) {
                                        var a = this._length();
                                        a > 0 && r._migrateCallback0(this);
                                        for (var s = 1; s < a; ++s) r._migrateCallbackAt(this, s);
                                        this._setFollowing(), this._setLength(0), this._setFollowee(r)
                                    } else if (0 !== (33554432 & i)) this._fulfill(r._value()); else if (0 !== (16777216 & i)) this._reject(r._reason()); else {
                                        var c = new b("late cancellation observer");
                                        r._attachExtraTrace(c), this._reject(c)
                                    }
                                }
                            }, o.prototype._rejectCallback = function (t, e, n) {
                                var r = d.ensureErrorObject(t), i = r === t;
                                if (!i && !n && S.warnings()) {
                                    var o = "a promise was rejected with a non-error: " + d.classString(t);
                                    this._warn(o, !0)
                                }
                                this._attachExtraTrace(r, !!e && i), this._reject(t)
                            }, o.prototype._resolveFromExecutor = function (t) {
                                if (t !== w) {
                                    var e = this;
                                    this._captureStackTrace(), this._pushContext();
                                    var n = !0, r = this._execute(t, function (t) {
                                        e._resolveCallback(t)
                                    }, function (t) {
                                        e._rejectCallback(t, n)
                                    });
                                    n = !1, this._popContext(), void 0 !== r && e._rejectCallback(r, !0)
                                }
                            }, o.prototype._settlePromiseFromHandler = function (t, e, n, r) {
                                var i = r._bitField;
                                if (0 === (65536 & i)) {
                                    r._pushContext();
                                    var o;
                                    e === x ? n && "number" == typeof n.length ? o = k(t).apply(this._boundValue(), n) : (o = A, o.e = new y("cannot .spread() a non-array: " + d.classString(n))) : o = k(t).call(e, n);
                                    var a = r._popContext();
                                    i = r._bitField, 0 === (65536 & i) && (o === E ? r._reject(n) : o === A ? r._rejectCallback(o.e, !1) : (S.checkForgottenReturns(o, a, "", r, this), r._resolveCallback(o)))
                                }
                            }, o.prototype._target = function () {
                                for (var t = this; t._isFollowing();) t = t._followee();
                                return t
                            }, o.prototype._followee = function () {
                                return this._rejectionHandler0
                            }, o.prototype._setFollowee = function (t) {
                                this._rejectionHandler0 = t
                            }, o.prototype._settlePromise = function (t, e, n, i) {
                                var a = t instanceof o, s = this._bitField, c = 0 !== (134217728 & s);
                                0 !== (65536 & s) ? (a && t._invokeInternalOnCancel(), n instanceof O && n.isFinallyHandler() ? (n.cancelPromise = t, k(e).call(n, i) === A && t._reject(A.e)) : e === f ? t._fulfill(f.call(n)) : n instanceof r ? n._promiseCancelled(t) : a || t instanceof R ? t._cancel() : n.cancel()) : "function" == typeof e ? a ? (c && t._setAsyncGuaranteed(), this._settlePromiseFromHandler(e, n, i, t)) : e.call(n, i, t) : n instanceof r ? n._isResolved() || (0 !== (33554432 & s) ? n._promiseFulfilled(i, t) : n._promiseRejected(i, t)) : a && (c && t._setAsyncGuaranteed(), 0 !== (33554432 & s) ? t._fulfill(i) : t._reject(i))
                            }, o.prototype._settlePromiseLateCancellationObserver = function (t) {
                                var e = t.handler, n = t.promise, r = t.receiver, i = t.value;
                                "function" == typeof e ? n instanceof o ? this._settlePromiseFromHandler(e, r, i, n) : e.call(r, i, n) : n instanceof o && n._reject(i)
                            }, o.prototype._settlePromiseCtx = function (t) {
                                this._settlePromise(t.promise, t.handler, t.receiver, t.value)
                            }, o.prototype._settlePromise0 = function (t, e, n) {
                                var r = this._promise0, i = this._receiverAt(0);
                                this._promise0 = void 0, this._receiver0 = void 0, this._settlePromise(r, t, i, e)
                            }, o.prototype._clearCallbackDataAtIndex = function (t) {
                                var e = 4 * t - 4;
                                this[e + 2] = this[e + 3] = this[e + 0] = this[e + 1] = void 0
                            }, o.prototype._fulfill = function (t) {
                                var e = this._bitField;
                                if (!((117506048 & e) >>> 16)) {
                                    if (t === this) {
                                        var n = l();
                                        return this._attachExtraTrace(n), this._reject(n)
                                    }
                                    this._setFulfilled(), this._rejectionHandler0 = t, (65535 & e) > 0 && (0 !== (134217728 & e) ? this._settlePromises() : g.settlePromises(this))
                                }
                            }, o.prototype._reject = function (t) {
                                var e = this._bitField;
                                if (!((117506048 & e) >>> 16)) return this._setRejected(), this._fulfillmentHandler0 = t, this._isFinal() ? g.fatalError(t, d.isNode) : void ((65535 & e) > 0 ? g.settlePromises(this) : this._ensurePossibleRejectionHandled())
                            }, o.prototype._fulfillPromises = function (t, e) {
                                for (var n = 1; n < t; n++) {
                                    var r = this._fulfillmentHandlerAt(n), i = this._promiseAt(n),
                                        o = this._receiverAt(n);
                                    this._clearCallbackDataAtIndex(n), this._settlePromise(i, r, o, e)
                                }
                            }, o.prototype._rejectPromises = function (t, e) {
                                for (var n = 1; n < t; n++) {
                                    var r = this._rejectionHandlerAt(n), i = this._promiseAt(n),
                                        o = this._receiverAt(n);
                                    this._clearCallbackDataAtIndex(n), this._settlePromise(i, r, o, e)
                                }
                            }, o.prototype._settlePromises = function () {
                                var t = this._bitField, e = 65535 & t;
                                if (e > 0) {
                                    if (0 !== (16842752 & t)) {
                                        var n = this._fulfillmentHandler0;
                                        this._settlePromise0(this._rejectionHandler0, n, t), this._rejectPromises(e, n)
                                    } else {
                                        var r = this._rejectionHandler0;
                                        this._settlePromise0(this._fulfillmentHandler0, r, t), this._fulfillPromises(e, r)
                                    }
                                    this._setLength(0)
                                }
                                this._clearCancellationData()
                            }, o.prototype._settledValue = function () {
                                var t = this._bitField;
                                return 0 !== (33554432 & t) ? this._rejectionHandler0 : 0 !== (16777216 & t) ? this._fulfillmentHandler0 : void 0
                            }, o.defer = o.pending = function () {
                                S.deprecated("Promise.defer", "new Promise");
                                var t = new o(w);
                                return {promise: t, resolve: a, reject: s}
                            }, d.notEnumerableProp(o, "_makeSelfResolutionError", l), e("./method")(o, w, T, h, S), e("./bind")(o, w, T, S), e("./cancel")(o, R, h, S), e("./direct_resolve")(o), e("./synchronous_inspection")(o), e("./join")(o, R, T, w, g, u), o.Promise = o, o.version = "3.5.1", e("./map.js")(o, R, h, T, w, S), e("./call_get.js")(o), e("./using.js")(o, h, T, M, w, S), e("./timers.js")(o, w, S), e("./generators.js")(o, h, w, T, r, S), e("./nodeify.js")(o), e("./promisify.js")(o, w), e("./props.js")(o, R, T, h), e("./race.js")(o, w, T, h), e("./reduce.js")(o, R, h, T, w, S), e("./settle.js")(o, R, S), e("./some.js")(o, R, h), e("./filter.js")(o, w), e("./each.js")(o, w), e("./any.js")(o), d.toFastProperties(o), d.toFastProperties(o.prototype), c({a: 1}), c({b: 2}), c({c: 3}), c(1), c(function () {
                            }), c(void 0), c(!1), c(new o(w)), S.setBounds(m.firstLineError, d.lastLineError), o
                        }
                    }, {
                        "./any.js": 1,
                        "./async": 2,
                        "./bind": 3,
                        "./call_get.js": 5,
                        "./cancel": 6,
                        "./catch_filter": 7,
                        "./context": 8,
                        "./debuggability": 9,
                        "./direct_resolve": 10,
                        "./each.js": 11,
                        "./errors": 12,
                        "./es5": 13,
                        "./filter.js": 14,
                        "./finally": 15,
                        "./generators.js": 16,
                        "./join": 17,
                        "./map.js": 18,
                        "./method": 19,
                        "./nodeback": 20,
                        "./nodeify.js": 21,
                        "./promise_array": 23,
                        "./promisify.js": 24,
                        "./props.js": 25,
                        "./race.js": 27,
                        "./reduce.js": 28,
                        "./settle.js": 30,
                        "./some.js": 31,
                        "./synchronous_inspection": 32,
                        "./thenables": 33,
                        "./timers.js": 34,
                        "./using.js": 35,
                        "./util": 36
                    }], 23: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e, n, r, i, o) {
                            function a(t) {
                                switch (t) {
                                    case-2:
                                        return [];
                                    case-3:
                                        return {};
                                    case-6:
                                        return new Map
                                }
                            }

                            function s(t) {
                                var r = this._promise = new e(n);
                                t instanceof e && r._propagateFrom(t, 3), r._setOnCancel(this), this._values = t, this._length = 0, this._totalResolved = 0, this._init(void 0, -2)
                            }

                            var c = t("./util");
                            c.isArray;
                            return c.inherits(s, o), s.prototype.length = function () {
                                return this._length
                            }, s.prototype.promise = function () {
                                return this._promise
                            }, s.prototype._init = function u(t, n) {
                                var o = r(this._values, this._promise);
                                if (o instanceof e) {
                                    o = o._target();
                                    var s = o._bitField;
                                    if (this._values = o, 0 === (50397184 & s)) return this._promise._setAsyncGuaranteed(), o._then(u, this._reject, void 0, this, n);
                                    if (0 === (33554432 & s)) return 0 !== (16777216 & s) ? this._reject(o._reason()) : this._cancel();
                                    o = o._value()
                                }
                                if (o = c.asArray(o), null === o) {
                                    var l = i("expecting an array or an iterable object but got " + c.classString(o)).reason();
                                    return void this._promise._rejectCallback(l, !1)
                                }
                                return 0 === o.length ? void (n === -5 ? this._resolveEmptyArray() : this._resolve(a(n))) : void this._iterate(o)
                            }, s.prototype._iterate = function (t) {
                                var n = this.getActualLength(t.length);
                                this._length = n, this._values = this.shouldCopyValues() ? new Array(n) : this._values;
                                for (var i = this._promise, o = !1, a = null, s = 0; s < n; ++s) {
                                    var c = r(t[s], i);
                                    c instanceof e ? (c = c._target(), a = c._bitField) : a = null, o ? null !== a && c.suppressUnhandledRejections() : null !== a ? 0 === (50397184 & a) ? (c._proxy(this, s), this._values[s] = c) : o = 0 !== (33554432 & a) ? this._promiseFulfilled(c._value(), s) : 0 !== (16777216 & a) ? this._promiseRejected(c._reason(), s) : this._promiseCancelled(s) : o = this._promiseFulfilled(c, s)
                                }
                                o || i._setAsyncGuaranteed()
                            }, s.prototype._isResolved = function () {
                                return null === this._values
                            }, s.prototype._resolve = function (t) {
                                this._values = null, this._promise._fulfill(t)
                            }, s.prototype._cancel = function () {
                                !this._isResolved() && this._promise._isCancellable() && (this._values = null, this._promise._cancel())
                            }, s.prototype._reject = function (t) {
                                this._values = null, this._promise._rejectCallback(t, !1)
                            }, s.prototype._promiseFulfilled = function (t, e) {
                                this._values[e] = t;
                                var n = ++this._totalResolved;
                                return n >= this._length && (this._resolve(this._values), !0)
                            }, s.prototype._promiseCancelled = function () {
                                return this._cancel(), !0
                            }, s.prototype._promiseRejected = function (t) {
                                return this._totalResolved++, this._reject(t), !0
                            }, s.prototype._resultCancelled = function () {
                                if (!this._isResolved()) {
                                    var t = this._values;
                                    if (this._cancel(), t instanceof e) t.cancel(); else for (var n = 0; n < t.length; ++n) t[n] instanceof e && t[n].cancel()
                                }
                            }, s.prototype.shouldCopyValues = function () {
                                return !0
                            }, s.prototype.getActualLength = function (t) {
                                return t
                            }, s
                        }
                    }, {"./util": 36}], 24: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e, n) {
                            function r(t) {
                                return !x.test(t)
                            }

                            function i(t) {
                                try {
                                    return t.__isPromisified__ === !0
                                } catch (e) {
                                    return !1
                                }
                            }

                            function o(t, e, n) {
                                var r = p.getDataPropertyOrDefault(t, e + n, b);
                                return !!r && i(r)
                            }

                            function a(t, e, n) {
                                for (var r = 0; r < t.length; r += 2) {
                                    var i = t[r];
                                    if (n.test(i)) for (var o = i.replace(n, ""), a = 0; a < t.length; a += 2) if (t[a] === o) throw new _("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s", e))
                                }
                            }

                            function s(t, e, n, r) {
                                for (var s = p.inheritedDataKeys(t), c = [], u = 0; u < s.length; ++u) {
                                    var l = s[u], f = t[l], h = r === E || E(l, f, t);
                                    "function" != typeof f || i(f) || o(t, l, e) || !r(l, f, t, h) || c.push(l, f)
                                }
                                return a(c, e, n), c
                            }

                            function c(t, r, i, o, a, s) {
                                function c() {
                                    var i = r;
                                    r === h && (i = this);
                                    var o = new e(n);
                                    o._captureStackTrace();
                                    var a = "string" == typeof l && this !== u ? this[l] : t, c = d(o, s);
                                    try {
                                        a.apply(i, v(arguments, c))
                                    } catch (f) {
                                        o._rejectCallback(m(f), !0, !0)
                                    }
                                    return o._isFateSealed() || o._setAsyncGuaranteed(), o
                                }

                                var u = function () {
                                    return this
                                }(), l = t;
                                return "string" == typeof l && (t = o), p.notEnumerableProp(c, "__isPromisified__", !0), c
                            }

                            function u(t, e, n, r, i) {
                                for (var o = new RegExp(T(e) + "$"), a = s(t, e, o, n), c = 0, u = a.length; c < u; c += 2) {
                                    var l = a[c], f = a[c + 1], d = l + e;
                                    if (r === R) t[d] = R(l, h, l, f, e, i); else {
                                        var v = r(f, function () {
                                            return R(l, h, l, f, e, i)
                                        });
                                        p.notEnumerableProp(v, "__isPromisified__", !0), t[d] = v
                                    }
                                }
                                return p.toFastProperties(t), t
                            }

                            function l(t, e, n) {
                                return R(t, e, void 0, t, null, n)
                            }

                            var f, h = {}, p = t("./util"), d = t("./nodeback"), v = p.withAppended,
                                m = p.maybeWrapAsError, g = p.canEvaluate, _ = t("./errors").TypeError, y = "Async",
                                b = {__isPromisified__: !0},
                                w = ["arity", "length", "name", "arguments", "caller", "callee", "prototype", "__isPromisified__"],
                                x = new RegExp("^(?:" + w.join("|") + ")$"), E = function (t) {
                                    return p.isIdentifier(t) && "_" !== t.charAt(0) && "constructor" !== t
                                }, T = function (t) {
                                    return t.replace(/([$])/, "\\$")
                                }, R = g ? f : c;
                            e.promisify = function (t, e) {
                                if ("function" != typeof t) throw new _("expecting a function but got " + p.classString(t));
                                if (i(t)) return t;
                                e = Object(e);
                                var n = void 0 === e.context ? h : e.context, o = !!e.multiArgs, a = l(t, n, o);
                                return p.copyDescriptors(t, a, r), a
                            }, e.promisifyAll = function (t, e) {
                                if ("function" != typeof t && "object" != typeof t) throw new _("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");
                                e = Object(e);
                                var n = !!e.multiArgs, r = e.suffix;
                                "string" != typeof r && (r = y);
                                var i = e.filter;
                                "function" != typeof i && (i = E);
                                var o = e.promisifier;
                                if ("function" != typeof o && (o = R), !p.isIdentifier(r)) throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");
                                for (var a = p.inheritedDataKeys(t), s = 0; s < a.length; ++s) {
                                    var c = t[a[s]];
                                    "constructor" !== a[s] && p.isClass(c) && (u(c.prototype, r, i, o, n), u(c, r, i, o, n))
                                }
                                return u(t, r, i, o, n)
                            }
                        }
                    }, {"./errors": 12, "./nodeback": 20, "./util": 36}], 25: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e, n, r, i) {
                            function o(t) {
                                var e, n = !1;
                                if (void 0 !== s && t instanceof s) e = f(t), n = !0; else {
                                    var r = l.keys(t), i = r.length;
                                    e = new Array(2 * i);
                                    for (var o = 0; o < i; ++o) {
                                        var a = r[o];
                                        e[o] = t[a], e[o + i] = a
                                    }
                                }
                                this.constructor$(e), this._isMap = n, this._init$(void 0, n ? -6 : -3)
                            }

                            function a(t) {
                                var n, a = r(t);
                                return u(a) ? (n = a instanceof e ? a._then(e.props, void 0, void 0, void 0, void 0) : new o(a).promise(), a instanceof e && n._propagateFrom(a, 2), n) : i("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n")
                            }

                            var s, c = t("./util"), u = c.isObject, l = t("./es5");
                            "function" == typeof Map && (s = Map);
                            var f = function () {
                                function t(t, r) {
                                    this[e] = t, this[e + n] = r, e++
                                }

                                var e = 0, n = 0;
                                return function (r) {
                                    n = r.size, e = 0;
                                    var i = new Array(2 * r.size);
                                    return r.forEach(t, i), i
                                }
                            }(), h = function (t) {
                                for (var e = new s, n = t.length / 2 | 0, r = 0; r < n; ++r) {
                                    var i = t[n + r], o = t[r];
                                    e.set(i, o)
                                }
                                return e
                            };
                            c.inherits(o, n), o.prototype._init = function () {
                            }, o.prototype._promiseFulfilled = function (t, e) {
                                this._values[e] = t;
                                var n = ++this._totalResolved;
                                if (n >= this._length) {
                                    var r;
                                    if (this._isMap) r = h(this._values); else {
                                        r = {};
                                        for (var i = this.length(), o = 0, a = this.length(); o < a; ++o) r[this._values[o + i]] = this._values[o]
                                    }
                                    return this._resolve(r), !0
                                }
                                return !1
                            }, o.prototype.shouldCopyValues = function () {
                                return !1
                            }, o.prototype.getActualLength = function (t) {
                                return t >> 1
                            }, e.prototype.props = function () {
                                return a(this)
                            }, e.props = function (t) {
                                return a(t)
                            }
                        }
                    }, {"./es5": 13, "./util": 36}], 26: [function (t, e, n) {
                        "use strict";

                        function r(t, e, n, r, i) {
                            for (var o = 0; o < i; ++o) n[o + r] = t[o + e], t[o + e] = void 0
                        }

                        function i(t) {
                            this._capacity = t, this._length = 0, this._front = 0
                        }

                        i.prototype._willBeOverCapacity = function (t) {
                            return this._capacity < t
                        }, i.prototype._pushOne = function (t) {
                            var e = this.length();
                            this._checkCapacity(e + 1);
                            var n = this._front + e & this._capacity - 1;
                            this[n] = t, this._length = e + 1
                        }, i.prototype.push = function (t, e, n) {
                            var r = this.length() + 3;
                            if (this._willBeOverCapacity(r)) return this._pushOne(t), this._pushOne(e), void this._pushOne(n);
                            var i = this._front + r - 3;
                            this._checkCapacity(r);
                            var o = this._capacity - 1;
                            this[i + 0 & o] = t, this[i + 1 & o] = e, this[i + 2 & o] = n, this._length = r
                        }, i.prototype.shift = function () {
                            var t = this._front, e = this[t];
                            return this[t] = void 0, this._front = t + 1 & this._capacity - 1, this._length--, e
                        }, i.prototype.length = function () {
                            return this._length
                        }, i.prototype._checkCapacity = function (t) {
                            this._capacity < t && this._resizeTo(this._capacity << 1)
                        }, i.prototype._resizeTo = function (t) {
                            var e = this._capacity;
                            this._capacity = t;
                            var n = this._front, i = this._length, o = n + i & e - 1;
                            r(this, 0, this, e, o)
                        }, e.exports = i
                    }, {}], 27: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e, n, r, i) {
                            function o(t, o) {
                                var c = r(t);
                                if (c instanceof e) return s(c);
                                if (t = a.asArray(t), null === t) return i("expecting an array or an iterable object but got " + a.classString(t));
                                var u = new e(n);
                                void 0 !== o && u._propagateFrom(o, 3);
                                for (var l = u._fulfill, f = u._reject, h = 0, p = t.length; h < p; ++h) {
                                    var d = t[h];
                                    (void 0 !== d || h in t) && e.cast(d)._then(l, f, void 0, u, null)
                                }
                                return u
                            }

                            var a = t("./util"), s = function (t) {
                                return t.then(function (e) {
                                    return o(e, t)
                                })
                            };
                            e.race = function (t) {
                                return o(t, void 0)
                            }, e.prototype.race = function () {
                                return o(this, void 0)
                            }
                        }
                    }, {"./util": 36}], 28: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e, n, r, i, o, a) {
                            function s(t, n, r, i) {
                                this.constructor$(t);
                                var a = h();
                                this._fn = null === a ? n : p.domainBind(a, n), void 0 !== r && (r = e.resolve(r), r._attachCancellationCallback(this)), this._initialValue = r, this._currentCancellable = null, i === o ? this._eachValues = Array(this._length) : 0 === i ? this._eachValues = null : this._eachValues = void 0, this._promise._captureStackTrace(), this._init$(void 0, -5)
                            }

                            function c(t, e) {
                                this.isFulfilled() ? e._resolve(t) : e._reject(t)
                            }

                            function u(t, e, n, i) {
                                if ("function" != typeof e) return r("expecting a function but got " + p.classString(e));
                                var o = new s(t, e, n, i);
                                return o.promise()
                            }

                            function l(t) {
                                this.accum = t, this.array._gotAccum(t);
                                var n = i(this.value, this.array._promise);
                                return n instanceof e ? (this.array._currentCancellable = n, n._then(f, void 0, void 0, this, void 0)) : f.call(this, n)
                            }

                            function f(t) {
                                var n = this.array, r = n._promise, i = d(n._fn);
                                r._pushContext();
                                var o;
                                o = void 0 !== n._eachValues ? i.call(r._boundValue(), t, this.index, this.length) : i.call(r._boundValue(), this.accum, t, this.index, this.length), o instanceof e && (n._currentCancellable = o);
                                var s = r._popContext();
                                return a.checkForgottenReturns(o, s, void 0 !== n._eachValues ? "Promise.each" : "Promise.reduce", r), o
                            }

                            var h = e._getDomain, p = t("./util"), d = p.tryCatch;
                            p.inherits(s, n), s.prototype._gotAccum = function (t) {
                                void 0 !== this._eachValues && null !== this._eachValues && t !== o && this._eachValues.push(t)
                            }, s.prototype._eachComplete = function (t) {
                                return null !== this._eachValues && this._eachValues.push(t), this._eachValues
                            }, s.prototype._init = function () {
                            }, s.prototype._resolveEmptyArray = function () {
                                this._resolve(void 0 !== this._eachValues ? this._eachValues : this._initialValue)
                            }, s.prototype.shouldCopyValues = function () {
                                return !1
                            }, s.prototype._resolve = function (t) {
                                this._promise._resolveCallback(t), this._values = null
                            }, s.prototype._resultCancelled = function (t) {
                                return t === this._initialValue ? this._cancel() : void (this._isResolved() || (this._resultCancelled$(), this._currentCancellable instanceof e && this._currentCancellable.cancel(), this._initialValue instanceof e && this._initialValue.cancel()))
                            }, s.prototype._iterate = function (t) {
                                this._values = t;
                                var n, r, i = t.length;
                                if (void 0 !== this._initialValue ? (n = this._initialValue, r = 0) : (n = e.resolve(t[0]), r = 1), this._currentCancellable = n, !n.isRejected()) for (; r < i; ++r) {
                                    var o = {accum: null, value: t[r], index: r, length: i, array: this};
                                    n = n._then(l, void 0, void 0, o, void 0)
                                }
                                void 0 !== this._eachValues && (n = n._then(this._eachComplete, void 0, void 0, this, void 0)), n._then(c, c, void 0, n, this)
                            }, e.prototype.reduce = function (t, e) {
                                return u(this, t, e, null)
                            }, e.reduce = function (t, e, n, r) {
                                return u(t, e, n, r)
                            }
                        }
                    }, {"./util": 36}], 29: [function (e, n, i) {
                        "use strict";
                        var o, a = e("./util"), s = function () {
                            throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n")
                        }, c = a.getNativePromise();
                        if (a.isNode && "undefined" == typeof MutationObserver) {
                            var u = r.setImmediate, l = t.nextTick;
                            o = a.isRecentNode ? function (t) {
                                u.call(r, t)
                            } : function (e) {
                                l.call(t, e)
                            }
                        } else if ("function" == typeof c && "function" == typeof c.resolve) {
                            var f = c.resolve();
                            o = function (t) {
                                f.then(t)
                            }
                        } else o = "undefined" == typeof MutationObserver || "undefined" != typeof window && window.navigator && (window.navigator.standalone || window.cordova) ? "undefined" != typeof setImmediate ? function (t) {
                            setImmediate(t)
                        } : "undefined" != typeof setTimeout ? function (t) {
                            setTimeout(t, 0)
                        } : s : function () {
                            var t = document.createElement("div"), e = {attributes: !0}, n = !1,
                                r = document.createElement("div"), i = new MutationObserver(function () {
                                    t.classList.toggle("foo"), n = !1
                                });
                            i.observe(r, e);
                            var o = function () {
                                n || (n = !0, r.classList.toggle("foo"))
                            };
                            return function (n) {
                                var r = new MutationObserver(function () {
                                    r.disconnect(), n()
                                });
                                r.observe(t, e), o()
                            }
                        }();
                        n.exports = o
                    }, {"./util": 36}], 30: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e, n, r) {
                            function i(t) {
                                this.constructor$(t)
                            }

                            var o = e.PromiseInspection, a = t("./util");
                            a.inherits(i, n), i.prototype._promiseResolved = function (t, e) {
                                this._values[t] = e;
                                var n = ++this._totalResolved;
                                return n >= this._length && (this._resolve(this._values), !0)
                            }, i.prototype._promiseFulfilled = function (t, e) {
                                var n = new o;
                                return n._bitField = 33554432, n._settledValueField = t, this._promiseResolved(e, n)
                            }, i.prototype._promiseRejected = function (t, e) {
                                var n = new o;
                                return n._bitField = 16777216, n._settledValueField = t, this._promiseResolved(e, n)
                            }, e.settle = function (t) {
                                return r.deprecated(".settle()", ".reflect()"), new i(t).promise()
                            }, e.prototype.settle = function () {
                                return e.settle(this)
                            }
                        }
                    }, {"./util": 36}], 31: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e, n, r) {
                            function i(t) {
                                this.constructor$(t), this._howMany = 0, this._unwrap = !1, this._initialized = !1
                            }

                            function o(t, e) {
                                if ((0 | e) !== e || e < 0) return r("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");
                                var n = new i(t), o = n.promise();
                                return n.setHowMany(e), n.init(), o
                            }

                            var a = t("./util"), s = t("./errors").RangeError, c = t("./errors").AggregateError,
                                u = a.isArray, l = {};
                            a.inherits(i, n), i.prototype._init = function () {
                                if (this._initialized) {
                                    if (0 === this._howMany) return void this._resolve([]);
                                    this._init$(void 0, -5);
                                    var t = u(this._values);
                                    !this._isResolved() && t && this._howMany > this._canPossiblyFulfill() && this._reject(this._getRangeError(this.length()))
                                }
                            }, i.prototype.init = function () {
                                this._initialized = !0, this._init()
                            }, i.prototype.setUnwrap = function () {
                                this._unwrap = !0
                            }, i.prototype.howMany = function () {
                                return this._howMany
                            }, i.prototype.setHowMany = function (t) {
                                this._howMany = t
                            }, i.prototype._promiseFulfilled = function (t) {
                                return this._addFulfilled(t), this._fulfilled() === this.howMany() && (this._values.length = this.howMany(), 1 === this.howMany() && this._unwrap ? this._resolve(this._values[0]) : this._resolve(this._values), !0)
                            }, i.prototype._promiseRejected = function (t) {
                                return this._addRejected(t), this._checkOutcome()
                            }, i.prototype._promiseCancelled = function () {
                                return this._values instanceof e || null == this._values ? this._cancel() : (this._addRejected(l), this._checkOutcome())
                            }, i.prototype._checkOutcome = function () {
                                if (this.howMany() > this._canPossiblyFulfill()) {
                                    for (var t = new c, e = this.length(); e < this._values.length; ++e) this._values[e] !== l && t.push(this._values[e]);
                                    return t.length > 0 ? this._reject(t) : this._cancel(), !0
                                }
                                return !1
                            }, i.prototype._fulfilled = function () {
                                return this._totalResolved
                            }, i.prototype._rejected = function () {
                                return this._values.length - this.length()
                            }, i.prototype._addRejected = function (t) {
                                this._values.push(t)
                            }, i.prototype._addFulfilled = function (t) {
                                this._values[this._totalResolved++] = t
                            }, i.prototype._canPossiblyFulfill = function () {
                                return this.length() - this._rejected()
                            }, i.prototype._getRangeError = function (t) {
                                var e = "Input array must contain at least " + this._howMany + " items but contains only " + t + " items";
                                return new s(e)
                            }, i.prototype._resolveEmptyArray = function () {
                                this._reject(this._getRangeError(0))
                            }, e.some = function (t, e) {
                                return o(t, e)
                            }, e.prototype.some = function (t) {
                                return o(this, t)
                            }, e._SomePromiseArray = i
                        }
                    }, {"./errors": 12, "./util": 36}], 32: [function (t, e, n) {
                        "use strict";
                        e.exports = function (t) {
                            function e(t) {
                                void 0 !== t ? (t = t._target(), this._bitField = t._bitField, this._settledValueField = t._isFateSealed() ? t._settledValue() : void 0) : (this._bitField = 0, this._settledValueField = void 0)
                            }

                            e.prototype._settledValue = function () {
                                return this._settledValueField
                            };
                            var n = e.prototype.value = function () {
                                if (!this.isFulfilled()) throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");
                                return this._settledValue()
                            }, r = e.prototype.error = e.prototype.reason = function () {
                                if (!this.isRejected()) throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");
                                return this._settledValue()
                            }, i = e.prototype.isFulfilled = function () {
                                return 0 !== (33554432 & this._bitField)
                            }, o = e.prototype.isRejected = function () {
                                return 0 !== (16777216 & this._bitField)
                            }, a = e.prototype.isPending = function () {
                                return 0 === (50397184 & this._bitField)
                            }, s = e.prototype.isResolved = function () {
                                return 0 !== (50331648 & this._bitField)
                            };
                            e.prototype.isCancelled = function () {
                                return 0 !== (8454144 & this._bitField)
                            }, t.prototype.__isCancelled = function () {
                                return 65536 === (65536 & this._bitField)
                            }, t.prototype._isCancelled = function () {
                                return this._target().__isCancelled()
                            }, t.prototype.isCancelled = function () {
                                return 0 !== (8454144 & this._target()._bitField)
                            }, t.prototype.isPending = function () {
                                return a.call(this._target())
                            }, t.prototype.isRejected = function () {
                                return o.call(this._target())
                            }, t.prototype.isFulfilled = function () {
                                return i.call(this._target())
                            }, t.prototype.isResolved = function () {
                                return s.call(this._target())
                            }, t.prototype.value = function () {
                                return n.call(this._target())
                            }, t.prototype.reason = function () {
                                var t = this._target();
                                return t._unsetRejectionIsUnhandled(), r.call(t)
                            }, t.prototype._value = function () {
                                return this._settledValue()
                            }, t.prototype._reason = function () {
                                return this._unsetRejectionIsUnhandled(), this._settledValue()
                            }, t.PromiseInspection = e
                        }
                    }, {}], 33: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e, n) {
                            function r(t, r) {
                                if (l(t)) {
                                    if (t instanceof e) return t;
                                    var i = o(t);
                                    if (i === u) {
                                        r && r._pushContext();
                                        var c = e.reject(i.e);
                                        return r && r._popContext(), c
                                    }
                                    if ("function" == typeof i) {
                                        if (a(t)) {
                                            var c = new e(n);
                                            return t._then(c._fulfill, c._reject, void 0, c, null), c
                                        }
                                        return s(t, i, r)
                                    }
                                }
                                return t
                            }

                            function i(t) {
                                return t.then
                            }

                            function o(t) {
                                try {
                                    return i(t)
                                } catch (e) {
                                    return u.e = e, u
                                }
                            }

                            function a(t) {
                                try {
                                    return f.call(t, "_promise0")
                                } catch (e) {
                                    return !1
                                }
                            }

                            function s(t, r, i) {
                                function o(t) {
                                    s && (s._resolveCallback(t), s = null)
                                }

                                function a(t) {
                                    s && (s._rejectCallback(t, f, !0), s = null)
                                }

                                var s = new e(n), l = s;
                                i && i._pushContext(), s._captureStackTrace(), i && i._popContext();
                                var f = !0, h = c.tryCatch(r).call(t, o, a);
                                return f = !1, s && h === u && (s._rejectCallback(h.e, !0, !0), s = null), l
                            }

                            var c = t("./util"), u = c.errorObj, l = c.isObject, f = {}.hasOwnProperty;
                            return r
                        }
                    }, {"./util": 36}], 34: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e, n, r) {
                            function i(t) {
                                this.handle = t
                            }

                            function o(t) {
                                return clearTimeout(this.handle), t
                            }

                            function a(t) {
                                throw clearTimeout(this.handle), t
                            }

                            var s = t("./util"), c = e.TimeoutError;
                            i.prototype._resultCancelled = function () {
                                clearTimeout(this.handle)
                            };
                            var u = function (t) {
                                return l(+this).thenReturn(t)
                            }, l = e.delay = function (t, o) {
                                var a, s;
                                return void 0 !== o ? (a = e.resolve(o)._then(u, null, null, t, void 0), r.cancellation() && o instanceof e && a._setOnCancel(o)) : (a = new e(n), s = setTimeout(function () {
                                    a._fulfill()
                                }, +t), r.cancellation() && a._setOnCancel(new i(s)), a._captureStackTrace()), a._setAsyncGuaranteed(), a
                            };
                            e.prototype.delay = function (t) {
                                return l(t, this)
                            };
                            var f = function (t, e, n) {
                                var r;
                                r = "string" != typeof e ? e instanceof Error ? e : new c("operation timed out") : new c(e), s.markAsOriginatingFromRejection(r), t._attachExtraTrace(r), t._reject(r), null != n && n.cancel()
                            };
                            e.prototype.timeout = function (t, e) {
                                t = +t;
                                var n, s, c = new i(setTimeout(function () {
                                    n.isPending() && f(n, e, s)
                                }, t));
                                return r.cancellation() ? (s = this.then(), n = s._then(o, a, void 0, c, void 0), n._setOnCancel(c)) : n = this._then(o, a, void 0, c, void 0), n
                            }
                        }
                    }, {"./util": 36}], 35: [function (t, e, n) {
                        "use strict";
                        e.exports = function (e, n, r, i, o, a) {
                            function s(t) {
                                setTimeout(function () {
                                    throw t
                                }, 0)
                            }

                            function c(t) {
                                var e = r(t);
                                return e !== t && "function" == typeof t._isDisposable && "function" == typeof t._getDisposer && t._isDisposable() && e._setDisposable(t._getDisposer()), e
                            }

                            function u(t, n) {
                                function i() {
                                    if (a >= u) return l._fulfill();
                                    var o = c(t[a++]);
                                    if (o instanceof e && o._isDisposable()) {
                                        try {
                                            o = r(o._getDisposer().tryDispose(n), t.promise)
                                        } catch (f) {
                                            return s(f)
                                        }
                                        if (o instanceof e) return o._then(i, s, null, null, null)
                                    }
                                    i()
                                }

                                var a = 0, u = t.length, l = new e(o);
                                return i(), l
                            }

                            function l(t, e, n) {
                                this._data = t, this._promise = e, this._context = n
                            }

                            function f(t, e, n) {
                                this.constructor$(t, e, n)
                            }

                            function h(t) {
                                return l.isDisposer(t) ? (this.resources[this.index]._setDisposable(t), t.promise()) : t
                            }

                            function p(t) {
                                this.length = t, this.promise = null, this[t - 1] = null
                            }

                            var d = t("./util"), v = t("./errors").TypeError, m = t("./util").inherits, g = d.errorObj,
                                _ = d.tryCatch, y = {};
                            l.prototype.data = function () {
                                return this._data
                            }, l.prototype.promise = function () {
                                return this._promise
                            }, l.prototype.resource = function () {
                                return this.promise().isFulfilled() ? this.promise().value() : y
                            }, l.prototype.tryDispose = function (t) {
                                var e = this.resource(), n = this._context;
                                void 0 !== n && n._pushContext();
                                var r = e !== y ? this.doDispose(e, t) : null;
                                return void 0 !== n && n._popContext(), this._promise._unsetDisposable(), this._data = null, r
                            }, l.isDisposer = function (t) {
                                return null != t && "function" == typeof t.resource && "function" == typeof t.tryDispose
                            }, m(f, l), f.prototype.doDispose = function (t, e) {
                                var n = this.data();
                                return n.call(t, t, e)
                            }, p.prototype._resultCancelled = function () {
                                for (var t = this.length, n = 0; n < t; ++n) {
                                    var r = this[n];
                                    r instanceof e && r.cancel()
                                }
                            }, e.using = function () {
                                var t = arguments.length;
                                if (t < 2) return n("you must pass at least 2 arguments to Promise.using");
                                var i = arguments[t - 1];
                                if ("function" != typeof i) return n("expecting a function but got " + d.classString(i));
                                var o, s = !0;
                                2 === t && Array.isArray(arguments[0]) ? (o = arguments[0], t = o.length, s = !1) : (o = arguments, t--);
                                for (var c = new p(t), f = 0; f < t; ++f) {
                                    var v = o[f];
                                    if (l.isDisposer(v)) {
                                        var m = v;
                                        v = v.promise(), v._setDisposable(m)
                                    } else {
                                        var y = r(v);
                                        y instanceof e && (v = y._then(h, null, null, {resources: c, index: f}, void 0))
                                    }
                                    c[f] = v
                                }
                                for (var b = new Array(c.length), f = 0; f < b.length; ++f) b[f] = e.resolve(c[f]).reflect();
                                var w = e.all(b).then(function (t) {
                                    for (var e = 0; e < t.length; ++e) {
                                        var n = t[e];
                                        if (n.isRejected()) return g.e = n.error(), g;
                                        if (!n.isFulfilled()) return void w.cancel();
                                        t[e] = n.value()
                                    }
                                    x._pushContext(), i = _(i);
                                    var r = s ? i.apply(void 0, t) : i(t), o = x._popContext();
                                    return a.checkForgottenReturns(r, o, "Promise.using", x), r
                                }), x = w.lastly(function () {
                                    var t = new e.PromiseInspection(w);
                                    return u(c, t)
                                });
                                return c.promise = x, x._setOnCancel(c), x
                            }, e.prototype._setDisposable = function (t) {
                                this._bitField = 131072 | this._bitField, this._disposer = t
                            }, e.prototype._isDisposable = function () {
                                return (131072 & this._bitField) > 0
                            }, e.prototype._getDisposer = function () {
                                return this._disposer
                            }, e.prototype._unsetDisposable = function () {
                                this._bitField = this._bitField & -131073,
                                    this._disposer = void 0
                            }, e.prototype.disposer = function (t) {
                                if ("function" == typeof t) return new f(t, this, i());
                                throw new v
                            }
                        }
                    }, {"./errors": 12, "./util": 36}], 36: [function (e, n, i) {
                        "use strict";

                        function o() {
                            try {
                                var t = L;
                                return L = null, t.apply(this, arguments)
                            } catch (e) {
                                return P.e = e, P
                            }
                        }

                        function a(t) {
                            return L = t, o
                        }

                        function s(t) {
                            return null == t || t === !0 || t === !1 || "string" == typeof t || "number" == typeof t
                        }

                        function c(t) {
                            return "function" == typeof t || "object" == typeof t && null !== t
                        }

                        function u(t) {
                            return s(t) ? new Error(_(t)) : t
                        }

                        function l(t, e) {
                            var n, r = t.length, i = new Array(r + 1);
                            for (n = 0; n < r; ++n) i[n] = t[n];
                            return i[n] = e, i
                        }

                        function f(t, e, n) {
                            if (!S.isES5) return {}.hasOwnProperty.call(t, e) ? t[e] : void 0;
                            var r = Object.getOwnPropertyDescriptor(t, e);
                            return null != r ? null == r.get && null == r.set ? r.value : n : void 0
                        }

                        function h(t, e, n) {
                            if (s(t)) return t;
                            var r = {value: n, configurable: !0, enumerable: !1, writable: !0};
                            return S.defineProperty(t, e, r), t
                        }

                        function p(t) {
                            throw t
                        }

                        function d(t) {
                            try {
                                if ("function" == typeof t) {
                                    var e = S.names(t.prototype), n = S.isES5 && e.length > 1,
                                        r = e.length > 0 && !(1 === e.length && "constructor" === e[0]),
                                        i = j.test(t + "") && S.names(t).length > 0;
                                    if (n || r || i) return !0
                                }
                                return !1
                            } catch (o) {
                                return !1
                            }
                        }

                        function v(t) {
                            function e() {
                            }

                            e.prototype = t;
                            for (var n = 8; n--;) new e;
                            return t
                        }

                        function m(t) {
                            return D.test(t)
                        }

                        function g(t, e, n) {
                            for (var r = new Array(t), i = 0; i < t; ++i) r[i] = e + i + n;
                            return r
                        }

                        function _(t) {
                            try {
                                return t + ""
                            } catch (e) {
                                return "[no string representation]"
                            }
                        }

                        function y(t) {
                            return t instanceof Error || null !== t && "object" == typeof t && "string" == typeof t.message && "string" == typeof t.name
                        }

                        function b(t) {
                            try {
                                h(t, "isOperational", !0)
                            } catch (e) {
                            }
                        }

                        function w(t) {
                            return null != t && (t instanceof Error.__BluebirdErrorTypes__.OperationalError || t.isOperational === !0)
                        }

                        function x(t) {
                            return y(t) && S.propertyIsWritable(t, "stack")
                        }

                        function E(t) {
                            return {}.toString.call(t)
                        }

                        function T(t, e, n) {
                            for (var r = S.names(t), i = 0; i < r.length; ++i) {
                                var o = r[i];
                                if (n(o)) try {
                                    S.defineProperty(e, o, S.getDescriptor(t, o))
                                } catch (a) {
                                }
                            }
                        }

                        function R(e) {
                            return z ? t.env[e] : void 0
                        }

                        function C() {
                            if ("function" == typeof Promise) try {
                                var t = new Promise(function () {
                                });
                                if ("[object Promise]" === {}.toString.call(t)) return Promise
                            } catch (e) {
                            }
                        }

                        function M(t, e) {
                            return t.bind(e)
                        }

                        var S = e("./es5"), O = "undefined" == typeof navigator, P = {e: {}}, L,
                            A = "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof r ? r : void 0 !== this ? this : null,
                            k = function (t, e) {
                                function n() {
                                    this.constructor = t, this.constructor$ = e;
                                    for (var n in e.prototype) r.call(e.prototype, n) && "$" !== n.charAt(n.length - 1) && (this[n + "$"] = e.prototype[n])
                                }

                                var r = {}.hasOwnProperty;
                                return n.prototype = e.prototype, t.prototype = new n, t.prototype
                            }, F = function () {
                                var t = [Array.prototype, Object.prototype, Function.prototype], e = function (e) {
                                    for (var n = 0; n < t.length; ++n) if (t[n] === e) return !0;
                                    return !1
                                };
                                if (S.isES5) {
                                    var n = Object.getOwnPropertyNames;
                                    return function (t) {
                                        for (var r = [], i = Object.create(null); null != t && !e(t);) {
                                            var o;
                                            try {
                                                o = n(t)
                                            } catch (a) {
                                                return r
                                            }
                                            for (var s = 0; s < o.length; ++s) {
                                                var c = o[s];
                                                if (!i[c]) {
                                                    i[c] = !0;
                                                    var u = Object.getOwnPropertyDescriptor(t, c);
                                                    null != u && null == u.get && null == u.set && r.push(c)
                                                }
                                            }
                                            t = S.getPrototypeOf(t)
                                        }
                                        return r
                                    }
                                }
                                var r = {}.hasOwnProperty;
                                return function (n) {
                                    if (e(n)) return [];
                                    var i = [];
                                    t:for (var o in n) if (r.call(n, o)) i.push(o); else {
                                        for (var a = 0; a < t.length; ++a) if (r.call(t[a], o)) continue t;
                                        i.push(o)
                                    }
                                    return i
                                }
                            }(), j = /this\s*\.\s*\S+\s*=/, D = /^[a-z$_][a-z$_0-9]*$/i, H = function () {
                                return "stack" in new Error ? function (t) {
                                    return x(t) ? t : new Error(_(t))
                                } : function (t) {
                                    if (x(t)) return t;
                                    try {
                                        throw new Error(_(t))
                                    } catch (e) {
                                        return e
                                    }
                                }
                            }(), N = function (t) {
                                return S.isArray(t) ? t : null
                            };
                        if ("undefined" != typeof Symbol && Symbol.iterator) {
                            var I = "function" == typeof Array.from ? function (t) {
                                return Array.from(t)
                            } : function (t) {
                                for (var e, n = [], r = t[Symbol.iterator](); !(e = r.next()).done;) n.push(e.value);
                                return n
                            };
                            N = function (t) {
                                return S.isArray(t) ? t : null != t && "function" == typeof t[Symbol.iterator] ? I(t) : null
                            }
                        }
                        var U = "undefined" != typeof t && "[object process]" === E(t).toLowerCase(),
                            z = "undefined" != typeof t && "undefined" != typeof t.env, B = {
                                isClass: d,
                                isIdentifier: m,
                                inheritedDataKeys: F,
                                getDataPropertyOrDefault: f,
                                thrower: p,
                                isArray: S.isArray,
                                asArray: N,
                                notEnumerableProp: h,
                                isPrimitive: s,
                                isObject: c,
                                isError: y,
                                canEvaluate: O,
                                errorObj: P,
                                tryCatch: a,
                                inherits: k,
                                withAppended: l,
                                maybeWrapAsError: u,
                                toFastProperties: v,
                                filledRange: g,
                                toString: _,
                                canAttachTrace: x,
                                ensureErrorObject: H,
                                originatesFromRejection: w,
                                markAsOriginatingFromRejection: b,
                                classString: E,
                                copyDescriptors: T,
                                hasDevTools: "undefined" != typeof chrome && chrome && "function" == typeof chrome.loadTimes,
                                isNode: U,
                                hasEnvVariables: z,
                                env: R,
                                global: A,
                                getNativePromise: C,
                                domainBind: M
                            };
                        B.isRecentNode = B.isNode && function () {
                            var e = t.versions.node.split(".").map(Number);
                            return 0 === e[0] && e[1] > 10 || e[0] > 0
                        }(), B.isNode && B.toFastProperties(t);
                        try {
                            throw new Error
                        } catch (V) {
                            B.lastLineError = V
                        }
                        n.exports = B
                    }, {"./es5": 13}]
                }, {}, [4])(4)
            }), "undefined" != typeof window && null !== window ? window.P = window.Promise : "undefined" != typeof self && null !== self && (self.P = self.Promise)
        }).call(this, t("27"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {27: 27}],
    25: [function (t, e, n) {
    }, {}],
    26: [function (t, e, n) {
        (function (t) {
            function e(t, e) {
                for (var n = 0, r = t.length - 1; r >= 0; r--) {
                    var i = t[r];
                    "." === i ? t.splice(r, 1) : ".." === i ? (t.splice(r, 1), n++) : n && (t.splice(r, 1), n--)
                }
                if (e) for (; n--; n) t.unshift("..");
                return t
            }

            function r(t, e) {
                if (t.filter) return t.filter(e);
                for (var n = [], r = 0; r < t.length; r++) e(t[r], r, t) && n.push(t[r]);
                return n
            }

            var i = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/, o = function (t) {
                return i.exec(t).slice(1)
            };
            n.resolve = function () {
                for (var n = "", i = !1, o = arguments.length - 1; o >= -1 && !i; o--) {
                    var a = o >= 0 ? arguments[o] : t.cwd();
                    if ("string" != typeof a) throw new TypeError("Arguments to path.resolve must be strings");
                    a && (n = a + "/" + n, i = "/" === a.charAt(0))
                }
                return n = e(r(n.split("/"), function (t) {
                    return !!t
                }), !i).join("/"), (i ? "/" : "") + n || "."
            }, n.normalize = function (t) {
                var i = n.isAbsolute(t), o = "/" === a(t, -1);
                return t = e(r(t.split("/"), function (t) {
                    return !!t
                }), !i).join("/"), t || i || (t = "."), t && o && (t += "/"), (i ? "/" : "") + t
            }, n.isAbsolute = function (t) {
                return "/" === t.charAt(0)
            }, n.join = function () {
                var t = Array.prototype.slice.call(arguments, 0);
                return n.normalize(r(t, function (t, e) {
                    if ("string" != typeof t) throw new TypeError("Arguments to path.join must be strings");
                    return t
                }).join("/"))
            }, n.relative = function (t, e) {
                function r(t) {
                    for (var e = 0; e < t.length && "" === t[e]; e++) ;
                    for (var n = t.length - 1; n >= 0 && "" === t[n]; n--) ;
                    return e > n ? [] : t.slice(e, n - e + 1)
                }

                t = n.resolve(t).substr(1), e = n.resolve(e).substr(1);
                for (var i = r(t.split("/")), o = r(e.split("/")), a = Math.min(i.length, o.length), s = a, c = 0; c < a; c++) if (i[c] !== o[c]) {
                    s = c;
                    break
                }
                for (var u = [], c = s; c < i.length; c++) u.push("..");
                return u = u.concat(o.slice(s)), u.join("/")
            }, n.sep = "/", n.delimiter = ":", n.dirname = function (t) {
                var e = o(t), n = e[0], r = e[1];
                return n || r ? (r && (r = r.substr(0, r.length - 1)), n + r) : "."
            }, n.basename = function (t, e) {
                var n = o(t)[2];
                return e && n.substr(-1 * e.length) === e && (n = n.substr(0, n.length - e.length)), n
            }, n.extname = function (t) {
                return o(t)[3]
            };
            var a = "b" === "ab".substr(-1) ? function (t, e, n) {
                return t.substr(e, n)
            } : function (t, e, n) {
                return e < 0 && (e = t.length + e), t.substr(e, n)
            }
        }).call(this, t("27"))
    }, {27: 27}],
    27: [function (t, e, n) {
        function r() {
            throw new Error("setTimeout has not been defined")
        }

        function i() {
            throw new Error("clearTimeout has not been defined")
        }

        function o(t) {
            if (f === setTimeout) return setTimeout(t, 0);
            if ((f === r || !f) && setTimeout) return f = setTimeout, setTimeout(t, 0);
            try {
                return f(t, 0)
            } catch (e) {
                try {
                    return f.call(null, t, 0)
                } catch (e) {
                    return f.call(this, t, 0)
                }
            }
        }

        function a(t) {
            if (h === clearTimeout) return clearTimeout(t);
            if ((h === i || !h) && clearTimeout) return h = clearTimeout, clearTimeout(t);
            try {
                return h(t)
            } catch (e) {
                try {
                    return h.call(null, t)
                } catch (e) {
                    return h.call(this, t)
                }
            }
        }

        function s() {
            m && d && (m = !1, d.length ? v = d.concat(v) : g = -1, v.length && c())
        }

        function c() {
            if (!m) {
                var t = o(s);
                m = !0;
                for (var e = v.length; e;) {
                    for (d = v, v = []; ++g < e;) d && d[g].run();
                    g = -1, e = v.length
                }
                d = null, m = !1, a(t)
            }
        }

        function u(t, e) {
            this.fun = t, this.array = e
        }

        function l() {
        }

        var f, h, p = e.exports = {};
        !function () {
            try {
                f = "function" == typeof setTimeout ? setTimeout : r
            } catch (t) {
                f = r
            }
            try {
                h = "function" == typeof clearTimeout ? clearTimeout : i
            } catch (t) {
                h = i
            }
        }();
        var d, v = [], m = !1, g = -1;
        p.nextTick = function (t) {
            var e = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
            v.push(new u(t, e)), 1 !== v.length || m || o(c)
        }, u.prototype.run = function () {
            this.fun.apply(null, this.array)
        }, p.title = "browser", p.browser = !0, p.env = {}, p.argv = [], p.version = "", p.versions = {}, p.on = l, p.addListener = l, p.once = l, p.off = l, p.removeListener = l, p.removeAllListeners = l, p.emit = l, p.prependListener = l, p.prependOnceListener = l, p.listeners = function (t) {
            return []
        }, p.binding = function (t) {
            throw new Error("process.binding is not supported")
        }, p.cwd = function () {
            return "/"
        }, p.chdir = function (t) {
            throw new Error("process.chdir is not supported")
        }, p.umask = function () {
            return 0
        }
    }, {}],
    28: [function (t, e, n) {
        (function (r, i) {
            !function (t, r) {
                "object" == typeof n && "undefined" != typeof e ? e.exports = r() : "function" == typeof define && define.amd ? define(r) : t.ES6Promise = r()
            }(this, function () {
                "use strict";

                function e(t) {
                    var e = typeof t;
                    return null !== t && ("object" === e || "function" === e)
                }

                function n(t) {
                    return "function" == typeof t
                }

                function o(t) {
                    Z = t
                }

                function a(t) {
                    $ = t
                }

                function s() {
                    return function () {
                        return r.nextTick(h)
                    }
                }

                function c() {
                    return "undefined" != typeof W ? function () {
                        W(h)
                    } : f()
                }

                function u() {
                    var t = 0, e = new J(h), n = document.createTextNode("");
                    return e.observe(n, {characterData: !0}), function () {
                        n.data = t = ++t % 2
                    }
                }

                function l() {
                    var t = new MessageChannel;
                    return t.port1.onmessage = h, function () {
                        return t.port2.postMessage(0)
                    }
                }

                function f() {
                    var t = setTimeout;
                    return function () {
                        return t(h, 1)
                    }
                }

                function h() {
                    for (var t = 0; t < q; t += 2) {
                        var e = nt[t], n = nt[t + 1];
                        e(n), nt[t] = void 0, nt[t + 1] = void 0
                    }
                    q = 0
                }

                function p() {
                    try {
                        var e = t, n = e("vertx");
                        return W = n.runOnLoop || n.runOnContext, c()
                    } catch (r) {
                        return f()
                    }
                }

                function d(t, e) {
                    var n = arguments, r = this, i = new this.constructor(m);
                    void 0 === i[it] && j(i);
                    var o = r._state;
                    return o ? !function () {
                        var t = n[o - 1];
                        $(function () {
                            return A(o, i, t, r._result)
                        })
                    }() : S(r, i, t, e), i
                }

                function v(t) {
                    var e = this;
                    if (t && "object" == typeof t && t.constructor === e) return t;
                    var n = new e(m);
                    return T(n, t), n
                }

                function m() {
                }

                function g() {
                    return new TypeError("You cannot resolve a promise with itself")
                }

                function _() {
                    return new TypeError("A promises callback cannot return that same promise.")
                }

                function y(t) {
                    try {
                        return t.then
                    } catch (e) {
                        return ct.error = e, ct
                    }
                }

                function b(t, e, n, r) {
                    try {
                        t.call(e, n, r)
                    } catch (i) {
                        return i
                    }
                }

                function w(t, e, n) {
                    $(function (t) {
                        var r = !1, i = b(n, e, function (n) {
                            r || (r = !0, e !== n ? T(t, n) : C(t, n))
                        }, function (e) {
                            r || (r = !0, M(t, e))
                        }, "Settle: " + (t._label || " unknown promise"));
                        !r && i && (r = !0, M(t, i))
                    }, t)
                }

                function x(t, e) {
                    e._state === at ? C(t, e._result) : e._state === st ? M(t, e._result) : S(e, void 0, function (e) {
                        return T(t, e)
                    }, function (e) {
                        return M(t, e)
                    })
                }

                function E(t, e, r) {
                    e.constructor === t.constructor && r === d && e.constructor.resolve === v ? x(t, e) : r === ct ? (M(t, ct.error), ct.error = null) : void 0 === r ? C(t, e) : n(r) ? w(t, e, r) : C(t, e)
                }

                function T(t, n) {
                    t === n ? M(t, g()) : e(n) ? E(t, n, y(n)) : C(t, n)
                }

                function R(t) {
                    t._onerror && t._onerror(t._result), O(t)
                }

                function C(t, e) {
                    t._state === ot && (t._result = e, t._state = at, 0 !== t._subscribers.length && $(O, t))
                }

                function M(t, e) {
                    t._state === ot && (t._state = st, t._result = e, $(R, t))
                }

                function S(t, e, n, r) {
                    var i = t._subscribers, o = i.length;
                    t._onerror = null, i[o] = e, i[o + at] = n, i[o + st] = r, 0 === o && t._state && $(O, t)
                }

                function O(t) {
                    var e = t._subscribers, n = t._state;
                    if (0 !== e.length) {
                        for (var r = void 0, i = void 0, o = t._result, a = 0; a < e.length; a += 3) r = e[a], i = e[a + n], r ? A(n, r, i, o) : i(o);
                        t._subscribers.length = 0
                    }
                }

                function P() {
                    this.error = null
                }

                function L(t, e) {
                    try {
                        return t(e)
                    } catch (n) {
                        return ut.error = n, ut
                    }
                }

                function A(t, e, r, i) {
                    var o = n(r), a = void 0, s = void 0, c = void 0, u = void 0;
                    if (o) {
                        if (a = L(r, i), a === ut ? (u = !0, s = a.error, a.error = null) : c = !0, e === a) return void M(e, _())
                    } else a = i, c = !0;
                    e._state !== ot || (o && c ? T(e, a) : u ? M(e, s) : t === at ? C(e, a) : t === st && M(e, a))
                }

                function k(t, e) {
                    try {
                        e(function (e) {
                            T(t, e)
                        }, function (e) {
                            M(t, e)
                        })
                    } catch (n) {
                        M(t, n)
                    }
                }

                function F() {
                    return lt++
                }

                function j(t) {
                    t[it] = lt++, t._state = void 0, t._result = void 0, t._subscribers = []
                }

                function D(t, e) {
                    this._instanceConstructor = t, this.promise = new t(m), this.promise[it] || j(this.promise), Y(e) ? (this.length = e.length, this._remaining = e.length, this._result = new Array(this.length), 0 === this.length ? C(this.promise, this._result) : (this.length = this.length || 0, this._enumerate(e), 0 === this._remaining && C(this.promise, this._result))) : M(this.promise, H())
                }

                function H() {
                    return new Error("Array Methods must be provided an Array")
                }

                function N(t) {
                    return new D(this, t).promise
                }

                function I(t) {
                    var e = this;
                    return new e(Y(t) ? function (n, r) {
                        for (var i = t.length, o = 0; o < i; o++) e.resolve(t[o]).then(n, r)
                    } : function (t, e) {
                        return e(new TypeError("You must pass an array to race."))
                    })
                }

                function U(t) {
                    var e = this, n = new e(m);
                    return M(n, t), n
                }

                function z() {
                    throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
                }

                function B() {
                    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
                }

                function V(t) {
                    this[it] = F(), this._result = this._state = void 0, this._subscribers = [], m !== t && ("function" != typeof t && z(), this instanceof V ? k(this, t) : B())
                }

                function G() {
                    var t = void 0;
                    if ("undefined" != typeof i) t = i; else if ("undefined" != typeof self) t = self; else try {
                        t = Function("return this")()
                    } catch (e) {
                        throw new Error("polyfill failed because global object is unavailable in this environment")
                    }
                    var n = t.Promise;
                    if (n) {
                        var r = null;
                        try {
                            r = Object.prototype.toString.call(n.resolve())
                        } catch (e) {
                        }
                        if ("[object Promise]" === r && !n.cast) return
                    }
                    t.Promise = V
                }

                var X = void 0;
                X = Array.isArray ? Array.isArray : function (t) {
                    return "[object Array]" === Object.prototype.toString.call(t)
                };
                var Y = X, q = 0, W = void 0, Z = void 0, $ = function (t, e) {
                        nt[q] = t, nt[q + 1] = e, q += 2, 2 === q && (Z ? Z(h) : rt())
                    }, K = "undefined" != typeof window ? window : void 0, Q = K || {},
                    J = Q.MutationObserver || Q.WebKitMutationObserver,
                    tt = "undefined" == typeof self && "undefined" != typeof r && "[object process]" === {}.toString.call(r),
                    et = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
                    nt = new Array(1e3), rt = void 0;
                rt = tt ? s() : J ? u() : et ? l() : void 0 === K && "function" == typeof t ? p() : f();
                var it = Math.random().toString(36).substring(16), ot = void 0, at = 1, st = 2, ct = new P, ut = new P,
                    lt = 0;
                return D.prototype._enumerate = function (t) {
                    for (var e = 0; this._state === ot && e < t.length; e++) this._eachEntry(t[e], e)
                }, D.prototype._eachEntry = function (t, e) {
                    var n = this._instanceConstructor, r = n.resolve;
                    if (r === v) {
                        var i = y(t);
                        if (i === d && t._state !== ot) this._settledAt(t._state, e, t._result); else if ("function" != typeof i) this._remaining--, this._result[e] = t; else if (n === V) {
                            var o = new n(m);
                            E(o, t, i), this._willSettleAt(o, e)
                        } else this._willSettleAt(new n(function (e) {
                            return e(t)
                        }), e)
                    } else this._willSettleAt(r(t), e)
                }, D.prototype._settledAt = function (t, e, n) {
                    var r = this.promise;
                    r._state === ot && (this._remaining--, t === st ? M(r, n) : this._result[e] = n), 0 === this._remaining && C(r, this._result)
                }, D.prototype._willSettleAt = function (t, e) {
                    var n = this;
                    S(t, void 0, function (t) {
                        return n._settledAt(at, e, t)
                    }, function (t) {
                        return n._settledAt(st, e, t)
                    })
                }, V.all = N, V.race = I, V.resolve = v, V.reject = U, V._setScheduler = o, V._setAsap = a, V._asap = $, V.prototype = {
                    constructor: V,
                    then: d,
                    "catch": function (t) {
                        return this.then(null, t)
                    }
                }, V.polyfill = G, V.Promise = V, V
            })
        }).call(this, t("27"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {27: 27}],
    29: [function (t, e, n) {
        var r = t("26"), i = t("31"), o = t("30"), a = t("32"), n = e.exports = function () {
            var t = o(arguments).map(s);
            return a.isUri(t[0]) ? i.apply(i, t) : r.join.apply(r, t)
        }, s = (n.isUrl = function (t) {
            return a.isUri(t) || "http://" === t || "https://" === t || "ftp://" === t
        }, n.replaceUndefined = function (t, e, n) {
            return void 0 === t || null === t ? a.isUri(n[0]) ? "/" : r.sep : t
        })
    }, {26: 26, 30: 30, 31: 31, 32: 32}],
    30: [function (t, e, n) {
        function r(t) {
            return "[object Object]" === Object.prototype.toString.call(t)
        }

        function i(t) {
            return "[object Arguments]" === Object.prototype.toString.call(t)
        }

        function o(t) {
            return Object.keys(t).map(function (e) {
                return t[e]
            })
        }

        e.exports = function (t, e) {
            return t || (t = []), i(t) && (t = [].splice.call(t, 0)), r(t) && e && (t = o(t)), Array.isArray(t) ? t : [t]
        }
    }, {}],
    31: [function (t, e, n) {
        function r(t) {
            return t.replace(/[\/]+/g, "/").replace(/\/\?/g, "?").replace(/\/\#/g, "#").replace(/\:\//g, "://")
        }

        e.exports = function () {
            var t = [].slice.call(arguments, 0).join("/");
            return r(t)
        }
    }, {}],
    32: [function (t, e, n) {
        !function (t) {
            "use strict";

            function e(t) {
                if (t && !/[^a-z0-9\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\.\-\_\~\%]/i.test(t) && !/%[^0-9a-f]/i.test(t) && !/%[0-9a-f](:?[^0-9a-f]|$)/i.test(t)) {
                    var e = [], n = "", r = "", i = "", a = "", s = "", c = "";
                    if (e = o(t), n = e[1], r = e[2], i = e[3], a = e[4], s = e[5], n && n.length && i.length >= 0) {
                        if (r && r.length) {
                            if (0 !== i.length && !/^\//.test(i)) return
                        } else if (/^\/\//.test(i)) return;
                        if (/^[a-z][a-z0-9\+\-\.]*$/.test(n.toLowerCase())) return c += n + ":", r && r.length && (c += "//" + r), c += i, a && a.length && (c += "?" + a), s && s.length && (c += "#" + s), c
                    }
                }
            }

            function n(t, n) {
                if (e(t)) {
                    var r = [], i = "", a = "", s = "", c = "", u = "", l = "", f = "";
                    if (r = o(t), i = r[1], a = r[2], s = r[3], u = r[4], l = r[5], i) {
                        if (n) {
                            if ("https" != i.toLowerCase()) return
                        } else if ("http" != i.toLowerCase()) return;
                        if (a) return /:(\d+)$/.test(a) && (c = a.match(/:(\d+)$/)[0], a = a.replace(/:\d+$/, "")), f += i + ":", f += "//" + a, c && (f += c), f += s, u && u.length && (f += "?" + u), l && l.length && (f += "#" + l), f
                    }
                }
            }

            function r(t) {
                return n(t, !0)
            }

            function i(t) {
                return n(t) || r(t)
            }

            t.exports.is_uri = e, t.exports.is_http_uri = n, t.exports.is_https_uri = r, t.exports.is_web_uri = i, t.exports.isUri = e, t.exports.isHttpUri = n, t.exports.isHttpsUri = r, t.exports.isWebUri = i;
            var o = function (t) {
                var e = t.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/);
                return e
            }
        }(e)
    }, {}],
    33: [function (t, e, n) {
        !function (t) {
            "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof n ? e.exports = t : t(jQuery)
        }(function (t) {
            function e(e) {
                var a = e || window.event, s = c.call(arguments, 1), u = 0, f = 0, h = 0, p = 0, d = 0, v = 0;
                if (e = t.event.fix(a), e.type = "mousewheel", "detail" in a && (h = a.detail * -1), "wheelDelta" in a && (h = a.wheelDelta), "wheelDeltaY" in a && (h = a.wheelDeltaY), "wheelDeltaX" in a && (f = a.wheelDeltaX * -1), "axis" in a && a.axis === a.HORIZONTAL_AXIS && (f = h * -1, h = 0), u = 0 === h ? f : h, "deltaY" in a && (h = a.deltaY * -1, u = h), "deltaX" in a && (f = a.deltaX, 0 === h && (u = f * -1)), 0 !== h || 0 !== f) {
                    if (1 === a.deltaMode) {
                        var m = t.data(this, "mousewheel-line-height");
                        u *= m, h *= m, f *= m
                    } else if (2 === a.deltaMode) {
                        var g = t.data(this, "mousewheel-page-height");
                        u *= g, h *= g, f *= g
                    }
                    if (p = Math.max(Math.abs(h), Math.abs(f)), (!o || p < o) && (o = p, r(a, p) && (o /= 40)), r(a, p) && (u /= 40, f /= 40, h /= 40), u = Math[u >= 1 ? "floor" : "ceil"](u / o), f = Math[f >= 1 ? "floor" : "ceil"](f / o), h = Math[h >= 1 ? "floor" : "ceil"](h / o), l.settings.normalizeOffset && this.getBoundingClientRect) {
                        var _ = this.getBoundingClientRect();
                        d = e.clientX - _.left, v = e.clientY - _.top
                    }
                    return e.deltaX = f, e.deltaY = h, e.deltaFactor = o, e.offsetX = d, e.offsetY = v, e.deltaMode = 0, s.unshift(e, u, f, h), i && clearTimeout(i), i = setTimeout(n, 200), (t.event.dispatch || t.event.handle).apply(this, s)
                }
            }

            function n() {
                o = null
            }

            function r(t, e) {
                return l.settings.adjustOldDeltas && "mousewheel" === t.type && e % 120 === 0
            }

            var i, o, a = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
                s = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
                c = Array.prototype.slice;
            if (t.event.fixHooks) for (var u = a.length; u;) t.event.fixHooks[a[--u]] = t.event.mouseHooks;
            var l = t.event.special.mousewheel = {
                version: "3.1.12", setup: function () {
                    if (this.addEventListener) for (var n = s.length; n;) this.addEventListener(s[--n], e, !1); else this.onmousewheel = e;
                    t.data(this, "mousewheel-line-height", l.getLineHeight(this)), t.data(this, "mousewheel-page-height", l.getPageHeight(this))
                }, teardown: function () {
                    if (this.removeEventListener) for (var n = s.length; n;) this.removeEventListener(s[--n], e, !1); else this.onmousewheel = null;
                    t.removeData(this, "mousewheel-line-height"), t.removeData(this, "mousewheel-page-height")
                }, getLineHeight: function (e) {
                    var n = t(e), r = n["offsetParent" in t.fn ? "offsetParent" : "parent"]();
                    return r.length || (r = t("body")), parseInt(r.css("fontSize"), 10) || parseInt(n.css("fontSize"), 10) || 16
                }, getPageHeight: function (e) {
                    return t(e).height()
                }, settings: {adjustOldDeltas: !0, normalizeOffset: !0}
            };
            t.fn.extend({
                mousewheel: function (t) {
                    return t ? this.bind("mousewheel", t) : this.trigger("mousewheel")
                }, unmousewheel: function (t) {
                    return this.unbind("mousewheel", t)
                }
            })
        })
    }, {}],
    34: [function (t, e, n) {
        (function (t) {
            (function () {
                function r(t, e) {
                    if (t !== e) {
                        var n = null === t, r = t === R, i = t === t, o = null === e, a = e === R, s = e === e;
                        if (t > e && !o || !i || n && !a && s || r && s) return 1;
                        if (t < e && !n || !s || o && !r && i || a && i) return -1
                    }
                    return 0
                }

                function i(t, e, n) {
                    for (var r = t.length, i = n ? r : -1; n ? i-- : ++i < r;) if (e(t[i], i, t)) return i;
                    return -1
                }

                function o(t, e, n) {
                    if (e !== e) return m(t, n);
                    for (var r = n - 1, i = t.length; ++r < i;) if (t[r] === e) return r;
                    return -1
                }

                function a(t) {
                    return "function" == typeof t || !1
                }

                function s(t) {
                    return null == t ? "" : t + ""
                }

                function c(t, e) {
                    for (var n = -1, r = t.length; ++n < r && e.indexOf(t.charAt(n)) > -1;) ;
                    return n
                }

                function u(t, e) {
                    for (var n = t.length; n-- && e.indexOf(t.charAt(n)) > -1;) ;
                    return n
                }

                function l(t, e) {
                    return r(t.criteria, e.criteria) || t.index - e.index
                }

                function f(t, e, n) {
                    for (var i = -1, o = t.criteria, a = e.criteria, s = o.length, c = n.length; ++i < s;) {
                        var u = r(o[i], a[i]);
                        if (u) {
                            if (i >= c) return u;
                            var l = n[i];
                            return u * ("asc" === l || l === !0 ? 1 : -1)
                        }
                    }
                    return t.index - e.index
                }

                function h(t) {
                    return Gt[t]
                }

                function p(t) {
                    return Xt[t]
                }

                function d(t, e, n) {
                    return e ? t = Wt[t] : n && (t = Zt[t]), "\\" + t
                }

                function v(t) {
                    return "\\" + Zt[t]
                }

                function m(t, e, n) {
                    for (var r = t.length, i = e + (n ? 0 : -1); n ? i-- : ++i < r;) {
                        var o = t[i];
                        if (o !== o) return i
                    }
                    return -1
                }

                function g(t) {
                    return !!t && "object" == typeof t
                }

                function _(t) {
                    return t <= 160 && t >= 9 && t <= 13 || 32 == t || 160 == t || 5760 == t || 6158 == t || t >= 8192 && (t <= 8202 || 8232 == t || 8233 == t || 8239 == t || 8287 == t || 12288 == t || 65279 == t)
                }

                function y(t, e) {
                    for (var n = -1, r = t.length, i = -1, o = []; ++n < r;) t[n] === e && (t[n] = G, o[++i] = n);
                    return o
                }

                function b(t, e) {
                    for (var n, r = -1, i = t.length, o = -1, a = []; ++r < i;) {
                        var s = t[r], c = e ? e(s, r, t) : s;
                        r && n === c || (n = c, a[++o] = s)
                    }
                    return a
                }

                function w(t) {
                    for (var e = -1, n = t.length; ++e < n && _(t.charCodeAt(e));) ;
                    return e
                }

                function x(t) {
                    for (var e = t.length; e-- && _(t.charCodeAt(e));) ;
                    return e
                }

                function E(t) {
                    return Yt[t]
                }

                function T(t) {
                    function e(t) {
                        if (g(t) && !Os(t) && !(t instanceof K)) {
                            if (t instanceof _) return t;
                            if (ea.call(t, "__chain__") && ea.call(t, "__wrapped__")) return pr(t)
                        }
                        return new _(t)
                    }

                    function n() {
                    }

                    function _(t, e, n) {
                        this.__wrapped__ = t, this.__actions__ = n || [], this.__chain__ = !!e
                    }

                    function K(t) {
                        this.__wrapped__ = t, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = Sa, this.__views__ = []
                    }

                    function et() {
                        var t = new K(this.__wrapped__);
                        return t.__actions__ = te(this.__actions__), t.__dir__ = this.__dir__, t.__filtered__ = this.__filtered__, t.__iteratees__ = te(this.__iteratees__), t.__takeCount__ = this.__takeCount__, t.__views__ = te(this.__views__), t
                    }

                    function rt() {
                        if (this.__filtered__) {
                            var t = new K(this);
                            t.__dir__ = -1, t.__filtered__ = !0
                        } else t = this.clone(), t.__dir__ *= -1;
                        return t
                    }

                    function Gt() {
                        var t = this.__wrapped__.value(), e = this.__dir__, n = Os(t), r = e < 0, i = n ? t.length : 0,
                            o = Yn(0, i, this.__views__), a = o.start, s = o.end, c = s - a, u = r ? s : a - 1,
                            l = this.__iteratees__, f = l.length, h = 0, p = Ea(c, this.__takeCount__);
                        if (!n || i < U || i == c && p == c) return nn(r && n ? t.reverse() : t, this.__actions__);
                        var d = [];
                        t:for (; c-- && h < p;) {
                            u += e;
                            for (var v = -1, m = t[u]; ++v < f;) {
                                var g = l[v], _ = g.iteratee, y = g.type, b = _(m);
                                if (y == B) m = b; else if (!b) {
                                    if (y == z) continue t;
                                    break t
                                }
                            }
                            d[h++] = m
                        }
                        return d
                    }

                    function Xt() {
                        this.__data__ = {}
                    }

                    function Yt(t) {
                        return this.has(t) && delete this.__data__[t]
                    }

                    function qt(t) {
                        return "__proto__" == t ? R : this.__data__[t]
                    }

                    function Wt(t) {
                        return "__proto__" != t && ea.call(this.__data__, t)
                    }

                    function Zt(t, e) {
                        return "__proto__" != t && (this.__data__[t] = e), this
                    }

                    function $t(t) {
                        var e = t ? t.length : 0;
                        for (this.data = {hash: ga(null), set: new fa}; e--;) this.push(t[e])
                    }

                    function Kt(t, e) {
                        var n = t.data, r = "string" == typeof e || Fi(e) ? n.set.has(e) : n.hash[e];
                        return r ? 0 : -1
                    }

                    function Qt(t) {
                        var e = this.data;
                        "string" == typeof t || Fi(t) ? e.set.add(t) : e.hash[t] = !0
                    }

                    function Jt(t, e) {
                        for (var n = -1, r = t.length, i = -1, o = e.length, a = zo(r + o); ++n < r;) a[n] = t[n];
                        for (; ++i < o;) a[n++] = e[i];
                        return a
                    }

                    function te(t, e) {
                        var n = -1, r = t.length;
                        for (e || (e = zo(r)); ++n < r;) e[n] = t[n];
                        return e
                    }

                    function ee(t, e) {
                        for (var n = -1, r = t.length; ++n < r && e(t[n], n, t) !== !1;) ;
                        return t
                    }

                    function ie(t, e) {
                        for (var n = t.length; n-- && e(t[n], n, t) !== !1;) ;
                        return t
                    }

                    function oe(t, e) {
                        for (var n = -1, r = t.length; ++n < r;) if (!e(t[n], n, t)) return !1;
                        return !0
                    }

                    function ae(t, e, n, r) {
                        for (var i = -1, o = t.length, a = r, s = a; ++i < o;) {
                            var c = t[i], u = +e(c);
                            n(u, a) && (a = u, s = c)
                        }
                        return s
                    }

                    function se(t, e) {
                        for (var n = -1, r = t.length, i = -1, o = []; ++n < r;) {
                            var a = t[n];
                            e(a, n, t) && (o[++i] = a)
                        }
                        return o
                    }

                    function ce(t, e) {
                        for (var n = -1, r = t.length, i = zo(r); ++n < r;) i[n] = e(t[n], n, t);
                        return i
                    }

                    function ue(t, e) {
                        for (var n = -1, r = e.length, i = t.length; ++n < r;) t[i + n] = e[n];
                        return t
                    }

                    function le(t, e, n, r) {
                        var i = -1, o = t.length;
                        for (r && o && (n = t[++i]); ++i < o;) n = e(n, t[i], i, t);
                        return n
                    }

                    function fe(t, e, n, r) {
                        var i = t.length;
                        for (r && i && (n = t[--i]); i--;) n = e(n, t[i], i, t);
                        return n
                    }

                    function he(t, e) {
                        for (var n = -1, r = t.length; ++n < r;) if (e(t[n], n, t)) return !0;
                        return !1
                    }

                    function pe(t, e) {
                        for (var n = t.length, r = 0; n--;) r += +e(t[n]) || 0;
                        return r
                    }

                    function de(t, e) {
                        return t === R ? e : t
                    }

                    function ve(t, e, n, r) {
                        return t !== R && ea.call(r, n) ? t : e
                    }

                    function me(t, e, n) {
                        for (var r = -1, i = Us(e), o = i.length; ++r < o;) {
                            var a = i[r], s = t[a], c = n(s, e[a], a, t, e);
                            (c === c ? c === s : s !== s) && (s !== R || a in t) || (t[a] = c)
                        }
                        return t
                    }

                    function ge(t, e) {
                        return null == e ? t : ye(e, Us(e), t)
                    }

                    function _e(t, e) {
                        for (var n = -1, r = null == t, i = !r && Kn(t), o = i ? t.length : 0, a = e.length, s = zo(a); ++n < a;) {
                            var c = e[n];
                            i ? s[n] = Qn(c, o) ? t[c] : R : s[n] = r ? R : t[c]
                        }
                        return s
                    }

                    function ye(t, e, n) {
                        n || (n = {});
                        for (var r = -1, i = e.length; ++r < i;) {
                            var o = e[r];
                            n[o] = t[o]
                        }
                        return n
                    }

                    function be(t, e, n) {
                        var r = typeof t;
                        return "function" == r ? e === R ? t : an(t, e, n) : null == t ? So : "object" == r ? Ie(t) : e === R ? Fo(t) : Ue(t, e)
                    }

                    function we(t, e, n, r, i, o, a) {
                        var s;
                        if (n && (s = i ? n(t, r, i) : n(t)), s !== R) return s;
                        if (!Fi(t)) return t;
                        var c = Os(t);
                        if (c) {
                            if (s = qn(t), !e) return te(t, s)
                        } else {
                            var u = ra.call(t), l = u == $;
                            if (u != J && u != X && (!l || i)) return Vt[u] ? Zn(t, u, e) : i ? t : {};
                            if (s = Wn(l ? {} : t), !e) return ge(s, t)
                        }
                        o || (o = []), a || (a = []);
                        for (var f = o.length; f--;) if (o[f] == t) return a[f];
                        return o.push(t), a.push(s), (c ? ee : Le)(t, function (r, i) {
                            s[i] = we(r, e, n, i, t, o, a)
                        }), s
                    }

                    function xe(t, e, n) {
                        if ("function" != typeof t) throw new $o(V);
                        return ha(function () {
                            t.apply(R, n)
                        }, e)
                    }

                    function Ee(t, e) {
                        var n = t ? t.length : 0, r = [];
                        if (!n) return r;
                        var i = -1, a = Vn(), s = a == o, c = s && e.length >= U ? vn(e) : null, u = e.length;
                        c && (a = Kt, s = !1, e = c);
                        t:for (; ++i < n;) {
                            var l = t[i];
                            if (s && l === l) {
                                for (var f = u; f--;) if (e[f] === l) continue t;
                                r.push(l)
                            } else a(e, l, 0) < 0 && r.push(l)
                        }
                        return r
                    }

                    function Te(t, e) {
                        var n = !0;
                        return Da(t, function (t, r, i) {
                            return n = !!e(t, r, i)
                        }), n
                    }

                    function Re(t, e, n, r) {
                        var i = r, o = i;
                        return Da(t, function (t, a, s) {
                            var c = +e(t, a, s);
                            (n(c, i) || c === r && c === o) && (i = c, o = t)
                        }), o
                    }

                    function Ce(t, e, n, r) {
                        var i = t.length;
                        for (n = null == n ? 0 : +n || 0, n < 0 && (n = -n > i ? 0 : i + n), r = r === R || r > i ? i : +r || 0, r < 0 && (r += i), i = n > r ? 0 : r >>> 0, n >>>= 0; n < i;) t[n++] = e;
                        return t
                    }

                    function Me(t, e) {
                        var n = [];
                        return Da(t, function (t, r, i) {
                            e(t, r, i) && n.push(t)
                        }), n
                    }

                    function Se(t, e, n, r) {
                        var i;
                        return n(t, function (t, n, o) {
                            if (e(t, n, o)) return i = r ? n : t, !1
                        }), i
                    }

                    function Oe(t, e, n, r) {
                        r || (r = []);
                        for (var i = -1, o = t.length; ++i < o;) {
                            var a = t[i];
                            g(a) && Kn(a) && (n || Os(a) || Ri(a)) ? e ? Oe(a, e, n, r) : ue(r, a) : n || (r[r.length] = a)
                        }
                        return r
                    }

                    function Pe(t, e) {
                        return Na(t, e, to)
                    }

                    function Le(t, e) {
                        return Na(t, e, Us)
                    }

                    function Ae(t, e) {
                        return Ia(t, e, Us)
                    }

                    function ke(t, e) {
                        for (var n = -1, r = e.length, i = -1, o = []; ++n < r;) {
                            var a = e[n];
                            ki(t[a]) && (o[++i] = a)
                        }
                        return o
                    }

                    function Fe(t, e, n) {
                        if (null != t) {
                            n !== R && n in fr(t) && (e = [n]);
                            for (var r = 0, i = e.length; null != t && r < i;) t = t[e[r++]];
                            return r && r == i ? t : R
                        }
                    }

                    function je(t, e, n, r, i, o) {
                        return t === e || (null == t || null == e || !Fi(t) && !g(e) ? t !== t && e !== e : De(t, e, je, n, r, i, o))
                    }

                    function De(t, e, n, r, i, o, a) {
                        var s = Os(t), c = Os(e), u = Y, l = Y;
                        s || (u = ra.call(t), u == X ? u = J : u != J && (s = Vi(t))), c || (l = ra.call(e), l == X ? l = J : l != J && (c = Vi(e)));
                        var f = u == J, h = l == J, p = u == l;
                        if (p && !s && !f) return In(t, e, u);
                        if (!i) {
                            var d = f && ea.call(t, "__wrapped__"), v = h && ea.call(e, "__wrapped__");
                            if (d || v) return n(d ? t.value() : t, v ? e.value() : e, r, i, o, a)
                        }
                        if (!p) return !1;
                        o || (o = []), a || (a = []);
                        for (var m = o.length; m--;) if (o[m] == t) return a[m] == e;
                        o.push(t), a.push(e);
                        var g = (s ? Nn : Un)(t, e, n, r, i, o, a);
                        return o.pop(), a.pop(), g
                    }

                    function He(t, e, n) {
                        var r = e.length, i = r, o = !n;
                        if (null == t) return !i;
                        for (t = fr(t); r--;) {
                            var a = e[r];
                            if (o && a[2] ? a[1] !== t[a[0]] : !(a[0] in t)) return !1
                        }
                        for (; ++r < i;) {
                            a = e[r];
                            var s = a[0], c = t[s], u = a[1];
                            if (o && a[2]) {
                                if (c === R && !(s in t)) return !1
                            } else {
                                var l = n ? n(c, u, s) : R;
                                if (!(l === R ? je(u, c, n, !0) : l)) return !1
                            }
                        }
                        return !0
                    }

                    function Ne(t, e) {
                        var n = -1, r = Kn(t) ? zo(t.length) : [];
                        return Da(t, function (t, i, o) {
                            r[++n] = e(t, i, o)
                        }), r
                    }

                    function Ie(t) {
                        var e = Gn(t);
                        if (1 == e.length && e[0][2]) {
                            var n = e[0][0], r = e[0][1];
                            return function (t) {
                                return null != t && (t[n] === r && (r !== R || n in fr(t)))
                            }
                        }
                        return function (t) {
                            return He(t, e)
                        }
                    }

                    function Ue(t, e) {
                        var n = Os(t), r = tr(t) && rr(e), i = t + "";
                        return t = hr(t), function (o) {
                            if (null == o) return !1;
                            var a = i;
                            if (o = fr(o), (n || !r) && !(a in o)) {
                                if (o = 1 == t.length ? o : Fe(o, We(t, 0, -1)), null == o) return !1;
                                a = Cr(t), o = fr(o)
                            }
                            return o[a] === e ? e !== R || a in o : je(e, o[a], R, !0)
                        }
                    }

                    function ze(t, e, n, r, i) {
                        if (!Fi(t)) return t;
                        var o = Kn(e) && (Os(e) || Vi(e)), a = o ? R : Us(e);
                        return ee(a || e, function (s, c) {
                            if (a && (c = s, s = e[c]), g(s)) r || (r = []), i || (i = []), Be(t, e, c, ze, n, r, i); else {
                                var u = t[c], l = n ? n(u, s, c, t, e) : R, f = l === R;
                                f && (l = s), l === R && (!o || c in t) || !f && (l === l ? l === u : u !== u) || (t[c] = l)
                            }
                        }), t
                    }

                    function Be(t, e, n, r, i, o, a) {
                        for (var s = o.length, c = e[n]; s--;) if (o[s] == c) return void (t[n] = a[s]);
                        var u = t[n], l = i ? i(u, c, n, t, e) : R, f = l === R;
                        f && (l = c, Kn(c) && (Os(c) || Vi(c)) ? l = Os(u) ? u : Kn(u) ? te(u) : [] : Ui(c) || Ri(c) ? l = Ri(u) ? Wi(u) : Ui(u) ? u : {} : f = !1), o.push(c), a.push(l), f ? t[n] = r(l, c, i, o, a) : (l === l ? l !== u : u === u) && (t[n] = l)
                    }

                    function Ve(t) {
                        return function (e) {
                            return null == e ? R : e[t]
                        }
                    }

                    function Ge(t) {
                        var e = t + "";
                        return t = hr(t), function (n) {
                            return Fe(n, t, e)
                        }
                    }

                    function Xe(t, e) {
                        for (var n = t ? e.length : 0; n--;) {
                            var r = e[n];
                            if (r != i && Qn(r)) {
                                var i = r;
                                pa.call(t, r, 1)
                            }
                        }
                        return t
                    }

                    function Ye(t, e) {
                        return t + _a(Ca() * (e - t + 1))
                    }

                    function qe(t, e, n, r, i) {
                        return i(t, function (t, i, o) {
                            n = r ? (r = !1, t) : e(n, t, i, o)
                        }), n
                    }

                    function We(t, e, n) {
                        var r = -1, i = t.length;
                        e = null == e ? 0 : +e || 0, e < 0 && (e = -e > i ? 0 : i + e), n = n === R || n > i ? i : +n || 0, n < 0 && (n += i), i = e > n ? 0 : n - e >>> 0, e >>>= 0;
                        for (var o = zo(i); ++r < i;) o[r] = t[r + e];
                        return o
                    }

                    function Ze(t, e) {
                        var n;
                        return Da(t, function (t, r, i) {
                            return n = e(t, r, i), !n
                        }), !!n
                    }

                    function $e(t, e) {
                        var n = t.length;
                        for (t.sort(e); n--;) t[n] = t[n].value;
                        return t
                    }

                    function Ke(t, e, n) {
                        var r = zn(), i = -1;
                        e = ce(e, function (t) {
                            return r(t)
                        });
                        var o = Ne(t, function (t) {
                            var n = ce(e, function (e) {
                                return e(t)
                            });
                            return {criteria: n, index: ++i, value: t}
                        });
                        return $e(o, function (t, e) {
                            return f(t, e, n)
                        })
                    }

                    function Qe(t, e) {
                        var n = 0;
                        return Da(t, function (t, r, i) {
                            n += +e(t, r, i) || 0
                        }), n
                    }

                    function Je(t, e) {
                        var n = -1, r = Vn(), i = t.length, a = r == o, s = a && i >= U, c = s ? vn() : null, u = [];
                        c ? (r = Kt, a = !1) : (s = !1, c = e ? [] : u);
                        t:for (; ++n < i;) {
                            var l = t[n], f = e ? e(l, n, t) : l;
                            if (a && l === l) {
                                for (var h = c.length; h--;) if (c[h] === f) continue t;
                                e && c.push(f), u.push(l)
                            } else r(c, f, 0) < 0 && ((e || s) && c.push(f), u.push(l))
                        }
                        return u
                    }

                    function tn(t, e) {
                        for (var n = -1, r = e.length, i = zo(r); ++n < r;) i[n] = t[e[n]];
                        return i
                    }

                    function en(t, e, n, r) {
                        for (var i = t.length, o = r ? i : -1; (r ? o-- : ++o < i) && e(t[o], o, t);) ;
                        return n ? We(t, r ? 0 : o, r ? o + 1 : i) : We(t, r ? o + 1 : 0, r ? i : o)
                    }

                    function nn(t, e) {
                        var n = t;
                        n instanceof K && (n = n.value());
                        for (var r = -1, i = e.length; ++r < i;) {
                            var o = e[r];
                            n = o.func.apply(o.thisArg, ue([n], o.args))
                        }
                        return n
                    }

                    function rn(t, e, n) {
                        var r = 0, i = t ? t.length : r;
                        if ("number" == typeof e && e === e && i <= La) {
                            for (; r < i;) {
                                var o = r + i >>> 1, a = t[o];
                                (n ? a <= e : a < e) && null !== a ? r = o + 1 : i = o
                            }
                            return i
                        }
                        return on(t, e, So, n)
                    }

                    function on(t, e, n, r) {
                        e = n(e);
                        for (var i = 0, o = t ? t.length : 0, a = e !== e, s = null === e, c = e === R; i < o;) {
                            var u = _a((i + o) / 2), l = n(t[u]), f = l !== R, h = l === l;
                            if (a) var p = h || r; else p = s ? h && f && (r || null != l) : c ? h && (r || f) : null != l && (r ? l <= e : l < e);
                            p ? i = u + 1 : o = u
                        }
                        return Ea(o, Pa)
                    }

                    function an(t, e, n) {
                        if ("function" != typeof t) return So;
                        if (e === R) return t;
                        switch (n) {
                            case 1:
                                return function (n) {
                                    return t.call(e, n)
                                };
                            case 3:
                                return function (n, r, i) {
                                    return t.call(e, n, r, i)
                                };
                            case 4:
                                return function (n, r, i, o) {
                                    return t.call(e, n, r, i, o)
                                };
                            case 5:
                                return function (n, r, i, o, a) {
                                    return t.call(e, n, r, i, o, a)
                                }
                        }
                        return function () {
                            return t.apply(e, arguments)
                        }
                    }

                    function sn(t) {
                        var e = new aa(t.byteLength), n = new da(e);
                        return n.set(new da(t)), e
                    }

                    function cn(t, e, n) {
                        for (var r = n.length, i = -1, o = xa(t.length - r, 0), a = -1, s = e.length, c = zo(s + o); ++a < s;) c[a] = e[a];
                        for (; ++i < r;) c[n[i]] = t[i];
                        for (; o--;) c[a++] = t[i++];
                        return c
                    }

                    function un(t, e, n) {
                        for (var r = -1, i = n.length, o = -1, a = xa(t.length - i, 0), s = -1, c = e.length, u = zo(a + c); ++o < a;) u[o] = t[o];
                        for (var l = o; ++s < c;) u[l + s] = e[s];
                        for (; ++r < i;) u[l + n[r]] = t[o++];
                        return u
                    }

                    function ln(t, e) {
                        return function (n, r, i) {
                            var o = e ? e() : {};
                            if (r = zn(r, i, 3), Os(n)) for (var a = -1, s = n.length; ++a < s;) {
                                var c = n[a];
                                t(o, c, r(c, a, n), n);
                            } else Da(n, function (e, n, i) {
                                t(o, e, r(e, n, i), i)
                            });
                            return o
                        }
                    }

                    function fn(t) {
                        return gi(function (e, n) {
                            var r = -1, i = null == e ? 0 : n.length, o = i > 2 ? n[i - 2] : R, a = i > 2 ? n[2] : R,
                                s = i > 1 ? n[i - 1] : R;
                            for ("function" == typeof o ? (o = an(o, s, 5), i -= 2) : (o = "function" == typeof s ? s : R, i -= o ? 1 : 0), a && Jn(n[0], n[1], a) && (o = i < 3 ? R : o, i = 1); ++r < i;) {
                                var c = n[r];
                                c && t(e, c, o)
                            }
                            return e
                        })
                    }

                    function hn(t, e) {
                        return function (n, r) {
                            var i = n ? Ba(n) : 0;
                            if (!nr(i)) return t(n, r);
                            for (var o = e ? i : -1, a = fr(n); (e ? o-- : ++o < i) && r(a[o], o, a) !== !1;) ;
                            return n
                        }
                    }

                    function pn(t) {
                        return function (e, n, r) {
                            for (var i = fr(e), o = r(e), a = o.length, s = t ? a : -1; t ? s-- : ++s < a;) {
                                var c = o[s];
                                if (n(i[c], c, i) === !1) break
                            }
                            return e
                        }
                    }

                    function dn(t, e) {
                        function n() {
                            var i = this && this !== ne && this instanceof n ? r : t;
                            return i.apply(e, arguments)
                        }

                        var r = gn(t);
                        return n
                    }

                    function vn(t) {
                        return ga && fa ? new $t(t) : null
                    }

                    function mn(t) {
                        return function (e) {
                            for (var n = -1, r = Ro(lo(e)), i = r.length, o = ""; ++n < i;) o = t(o, r[n], n);
                            return o
                        }
                    }

                    function gn(t) {
                        return function () {
                            var e = arguments;
                            switch (e.length) {
                                case 0:
                                    return new t;
                                case 1:
                                    return new t(e[0]);
                                case 2:
                                    return new t(e[0], e[1]);
                                case 3:
                                    return new t(e[0], e[1], e[2]);
                                case 4:
                                    return new t(e[0], e[1], e[2], e[3]);
                                case 5:
                                    return new t(e[0], e[1], e[2], e[3], e[4]);
                                case 6:
                                    return new t(e[0], e[1], e[2], e[3], e[4], e[5]);
                                case 7:
                                    return new t(e[0], e[1], e[2], e[3], e[4], e[5], e[6])
                            }
                            var n = ja(t.prototype), r = t.apply(n, e);
                            return Fi(r) ? r : n
                        }
                    }

                    function _n(t) {
                        function e(n, r, i) {
                            i && Jn(n, r, i) && (r = R);
                            var o = Hn(n, t, R, R, R, R, R, r);
                            return o.placeholder = e.placeholder, o
                        }

                        return e
                    }

                    function yn(t, e) {
                        return gi(function (n) {
                            var r = n[0];
                            return null == r ? r : (n.push(e), t.apply(R, n))
                        })
                    }

                    function bn(t, e) {
                        return function (n, r, i) {
                            if (i && Jn(n, r, i) && (r = R), r = zn(r, i, 3), 1 == r.length) {
                                n = Os(n) ? n : lr(n);
                                var o = ae(n, r, t, e);
                                if (!n.length || o !== e) return o
                            }
                            return Re(n, r, t, e)
                        }
                    }

                    function wn(t, e) {
                        return function (n, r, o) {
                            if (r = zn(r, o, 3), Os(n)) {
                                var a = i(n, r, e);
                                return a > -1 ? n[a] : R
                            }
                            return Se(n, r, t)
                        }
                    }

                    function xn(t) {
                        return function (e, n, r) {
                            return e && e.length ? (n = zn(n, r, 3), i(e, n, t)) : -1
                        }
                    }

                    function En(t) {
                        return function (e, n, r) {
                            return n = zn(n, r, 3), Se(e, n, t, !0)
                        }
                    }

                    function Tn(t) {
                        return function () {
                            for (var e, n = arguments.length, r = t ? n : -1, i = 0, o = zo(n); t ? r-- : ++r < n;) {
                                var a = o[i++] = arguments[r];
                                if ("function" != typeof a) throw new $o(V);
                                !e && _.prototype.thru && "wrapper" == Bn(a) && (e = new _([], (!0)))
                            }
                            for (r = e ? -1 : n; ++r < n;) {
                                a = o[r];
                                var s = Bn(a), c = "wrapper" == s ? za(a) : R;
                                e = c && er(c[0]) && c[1] == (F | P | A | j) && !c[4].length && 1 == c[9] ? e[Bn(c[0])].apply(e, c[3]) : 1 == a.length && er(a) ? e[s]() : e.thru(a)
                            }
                            return function () {
                                var t = arguments, r = t[0];
                                if (e && 1 == t.length && Os(r) && r.length >= U) return e.plant(r).value();
                                for (var i = 0, a = n ? o[i].apply(this, t) : r; ++i < n;) a = o[i].call(this, a);
                                return a
                            }
                        }
                    }

                    function Rn(t, e) {
                        return function (n, r, i) {
                            return "function" == typeof r && i === R && Os(n) ? t(n, r) : e(n, an(r, i, 3))
                        }
                    }

                    function Cn(t) {
                        return function (e, n, r) {
                            return "function" == typeof n && r === R || (n = an(n, r, 3)), t(e, n, to)
                        }
                    }

                    function Mn(t) {
                        return function (e, n, r) {
                            return "function" == typeof n && r === R || (n = an(n, r, 3)), t(e, n)
                        }
                    }

                    function Sn(t) {
                        return function (e, n, r) {
                            var i = {};
                            return n = zn(n, r, 3), Le(e, function (e, r, o) {
                                var a = n(e, r, o);
                                r = t ? a : r, e = t ? e : a, i[r] = e
                            }), i
                        }
                    }

                    function On(t) {
                        return function (e, n, r) {
                            return e = s(e), (t ? e : "") + kn(e, n, r) + (t ? "" : e)
                        }
                    }

                    function Pn(t) {
                        var e = gi(function (n, r) {
                            var i = y(r, e.placeholder);
                            return Hn(n, t, R, r, i)
                        });
                        return e
                    }

                    function Ln(t, e) {
                        return function (n, r, i, o) {
                            var a = arguments.length < 3;
                            return "function" == typeof r && o === R && Os(n) ? t(n, r, i, a) : qe(n, zn(r, o, 4), i, a, e)
                        }
                    }

                    function An(t, e, n, r, i, o, a, s, c, u) {
                        function l() {
                            for (var _ = arguments.length, b = _, w = zo(_); b--;) w[b] = arguments[b];
                            if (r && (w = cn(w, r, i)), o && (w = un(w, o, a)), d || m) {
                                var x = l.placeholder, E = y(w, x);
                                if (_ -= E.length, _ < u) {
                                    var T = s ? te(s) : R, C = xa(u - _, 0), O = d ? E : R, P = d ? R : E,
                                        L = d ? w : R, F = d ? R : w;
                                    e |= d ? A : k, e &= ~(d ? k : A), v || (e &= ~(M | S));
                                    var j = [t, e, n, L, O, F, P, T, c, C], D = An.apply(R, j);
                                    return er(t) && Va(D, j), D.placeholder = x, D
                                }
                            }
                            var H = h ? n : this, N = p ? H[t] : t;
                            return s && (w = cr(w, s)), f && c < w.length && (w.length = c), this && this !== ne && this instanceof l && (N = g || gn(t)), N.apply(H, w)
                        }

                        var f = e & F, h = e & M, p = e & S, d = e & P, v = e & O, m = e & L, g = p ? R : gn(t);
                        return l
                    }

                    function kn(t, e, n) {
                        var r = t.length;
                        if (e = +e, r >= e || !ba(e)) return "";
                        var i = e - r;
                        return n = null == n ? " " : n + "", go(n, ma(i / n.length)).slice(0, i)
                    }

                    function Fn(t, e, n, r) {
                        function i() {
                            for (var e = -1, s = arguments.length, c = -1, u = r.length, l = zo(u + s); ++c < u;) l[c] = r[c];
                            for (; s--;) l[c++] = arguments[++e];
                            var f = this && this !== ne && this instanceof i ? a : t;
                            return f.apply(o ? n : this, l)
                        }

                        var o = e & M, a = gn(t);
                        return i
                    }

                    function jn(t) {
                        var e = Xo[t];
                        return function (t, n) {
                            return n = n === R ? 0 : +n || 0, n ? (n = ua(10, n), e(t * n) / n) : e(t)
                        }
                    }

                    function Dn(t) {
                        return function (e, n, r, i) {
                            var o = zn(r);
                            return null == r && o === be ? rn(e, n, t) : on(e, n, o(r, i, 1), t)
                        }
                    }

                    function Hn(t, e, n, r, i, o, a, s) {
                        var c = e & S;
                        if (!c && "function" != typeof t) throw new $o(V);
                        var u = r ? r.length : 0;
                        if (u || (e &= ~(A | k), r = i = R), u -= i ? i.length : 0, e & k) {
                            var l = r, f = i;
                            r = i = R
                        }
                        var h = c ? R : za(t), p = [t, e, n, r, i, l, f, o, a, s];
                        if (h && (ir(p, h), e = p[1], s = p[9]), p[9] = null == s ? c ? 0 : t.length : xa(s - u, 0) || 0, e == M) var d = dn(p[0], p[2]); else d = e != A && e != (M | A) || p[4].length ? An.apply(R, p) : Fn.apply(R, p);
                        var v = h ? Ua : Va;
                        return v(d, p)
                    }

                    function Nn(t, e, n, r, i, o, a) {
                        var s = -1, c = t.length, u = e.length;
                        if (c != u && !(i && u > c)) return !1;
                        for (; ++s < c;) {
                            var l = t[s], f = e[s], h = r ? r(i ? f : l, i ? l : f, s) : R;
                            if (h !== R) {
                                if (h) continue;
                                return !1
                            }
                            if (i) {
                                if (!he(e, function (t) {
                                    return l === t || n(l, t, r, i, o, a)
                                })) return !1
                            } else if (l !== f && !n(l, f, r, i, o, a)) return !1
                        }
                        return !0
                    }

                    function In(t, e, n) {
                        switch (n) {
                            case q:
                            case W:
                                return +t == +e;
                            case Z:
                                return t.name == e.name && t.message == e.message;
                            case Q:
                                return t != +t ? e != +e : t == +e;
                            case tt:
                            case nt:
                                return t == e + ""
                        }
                        return !1
                    }

                    function Un(t, e, n, r, i, o, a) {
                        var s = Us(t), c = s.length, u = Us(e), l = u.length;
                        if (c != l && !i) return !1;
                        for (var f = c; f--;) {
                            var h = s[f];
                            if (!(i ? h in e : ea.call(e, h))) return !1
                        }
                        for (var p = i; ++f < c;) {
                            h = s[f];
                            var d = t[h], v = e[h], m = r ? r(i ? v : d, i ? d : v, h) : R;
                            if (!(m === R ? n(d, v, r, i, o, a) : m)) return !1;
                            p || (p = "constructor" == h)
                        }
                        if (!p) {
                            var g = t.constructor, _ = e.constructor;
                            if (g != _ && "constructor" in t && "constructor" in e && !("function" == typeof g && g instanceof g && "function" == typeof _ && _ instanceof _)) return !1
                        }
                        return !0
                    }

                    function zn(t, n, r) {
                        var i = e.callback || Co;
                        return i = i === Co ? be : i, r ? i(t, n, r) : i
                    }

                    function Bn(t) {
                        for (var e = t.name, n = Fa[e], r = n ? n.length : 0; r--;) {
                            var i = n[r], o = i.func;
                            if (null == o || o == t) return i.name
                        }
                        return e
                    }

                    function Vn(t, n, r) {
                        var i = e.indexOf || Tr;
                        return i = i === Tr ? o : i, t ? i(t, n, r) : i
                    }

                    function Gn(t) {
                        for (var e = eo(t), n = e.length; n--;) e[n][2] = rr(e[n][1]);
                        return e
                    }

                    function Xn(t, e) {
                        var n = null == t ? R : t[e];
                        return Hi(n) ? n : R
                    }

                    function Yn(t, e, n) {
                        for (var r = -1, i = n.length; ++r < i;) {
                            var o = n[r], a = o.size;
                            switch (o.type) {
                                case"drop":
                                    t += a;
                                    break;
                                case"dropRight":
                                    e -= a;
                                    break;
                                case"take":
                                    e = Ea(e, t + a);
                                    break;
                                case"takeRight":
                                    t = xa(t, e - a)
                            }
                        }
                        return {start: t, end: e}
                    }

                    function qn(t) {
                        var e = t.length, n = new t.constructor(e);
                        return e && "string" == typeof t[0] && ea.call(t, "index") && (n.index = t.index, n.input = t.input), n
                    }

                    function Wn(t) {
                        var e = t.constructor;
                        return "function" == typeof e && e instanceof e || (e = qo), new e
                    }

                    function Zn(t, e, n) {
                        var r = t.constructor;
                        switch (e) {
                            case it:
                                return sn(t);
                            case q:
                            case W:
                                return new r((+t));
                            case ot:
                            case at:
                            case st:
                            case ct:
                            case ut:
                            case lt:
                            case ft:
                            case ht:
                            case pt:
                                var i = t.buffer;
                                return new r(n ? sn(i) : i, t.byteOffset, t.length);
                            case Q:
                            case nt:
                                return new r(t);
                            case tt:
                                var o = new r(t.source, At.exec(t));
                                o.lastIndex = t.lastIndex
                        }
                        return o
                    }

                    function $n(t, e, n) {
                        null == t || tr(e, t) || (e = hr(e), t = 1 == e.length ? t : Fe(t, We(e, 0, -1)), e = Cr(e));
                        var r = null == t ? t : t[e];
                        return null == r ? R : r.apply(t, n)
                    }

                    function Kn(t) {
                        return null != t && nr(Ba(t))
                    }

                    function Qn(t, e) {
                        return t = "number" == typeof t || jt.test(t) ? +t : -1, e = null == e ? Aa : e, t > -1 && t % 1 == 0 && t < e
                    }

                    function Jn(t, e, n) {
                        if (!Fi(n)) return !1;
                        var r = typeof e;
                        if ("number" == r ? Kn(n) && Qn(e, n.length) : "string" == r && e in n) {
                            var i = n[e];
                            return t === t ? t === i : i !== i
                        }
                        return !1
                    }

                    function tr(t, e) {
                        var n = typeof t;
                        if ("string" == n && Rt.test(t) || "number" == n) return !0;
                        if (Os(t)) return !1;
                        var r = !Tt.test(t);
                        return r || null != e && t in fr(e)
                    }

                    function er(t) {
                        var n = Bn(t);
                        if (!(n in K.prototype)) return !1;
                        var r = e[n];
                        if (t === r) return !0;
                        var i = za(r);
                        return !!i && t === i[0]
                    }

                    function nr(t) {
                        return "number" == typeof t && t > -1 && t % 1 == 0 && t <= Aa
                    }

                    function rr(t) {
                        return t === t && !Fi(t)
                    }

                    function ir(t, e) {
                        var n = t[1], r = e[1], i = n | r, o = i < F,
                            a = r == F && n == P || r == F && n == j && t[7].length <= e[8] || r == (F | j) && n == P;
                        if (!o && !a) return t;
                        r & M && (t[2] = e[2], i |= n & M ? 0 : O);
                        var s = e[3];
                        if (s) {
                            var c = t[3];
                            t[3] = c ? cn(c, s, e[4]) : te(s), t[4] = c ? y(t[3], G) : te(e[4])
                        }
                        return s = e[5], s && (c = t[5], t[5] = c ? un(c, s, e[6]) : te(s), t[6] = c ? y(t[5], G) : te(e[6])), s = e[7], s && (t[7] = te(s)), r & F && (t[8] = null == t[8] ? e[8] : Ea(t[8], e[8])), null == t[9] && (t[9] = e[9]), t[0] = e[0], t[1] = i, t
                    }

                    function or(t, e) {
                        return t === R ? e : Ps(t, e, or)
                    }

                    function ar(t, e) {
                        t = fr(t);
                        for (var n = -1, r = e.length, i = {}; ++n < r;) {
                            var o = e[n];
                            o in t && (i[o] = t[o])
                        }
                        return i
                    }

                    function sr(t, e) {
                        var n = {};
                        return Pe(t, function (t, r, i) {
                            e(t, r, i) && (n[r] = t)
                        }), n
                    }

                    function cr(t, e) {
                        for (var n = t.length, r = Ea(e.length, n), i = te(t); r--;) {
                            var o = e[r];
                            t[r] = Qn(o, n) ? i[o] : R
                        }
                        return t
                    }

                    function ur(t) {
                        for (var e = to(t), n = e.length, r = n && t.length, i = !!r && nr(r) && (Os(t) || Ri(t)), o = -1, a = []; ++o < n;) {
                            var s = e[o];
                            (i && Qn(s, r) || ea.call(t, s)) && a.push(s)
                        }
                        return a
                    }

                    function lr(t) {
                        return null == t ? [] : Kn(t) ? Fi(t) ? t : qo(t) : oo(t)
                    }

                    function fr(t) {
                        return Fi(t) ? t : qo(t)
                    }

                    function hr(t) {
                        if (Os(t)) return t;
                        var e = [];
                        return s(t).replace(Ct, function (t, n, r, i) {
                            e.push(r ? i.replace(Pt, "$1") : n || t)
                        }), e
                    }

                    function pr(t) {
                        return t instanceof K ? t.clone() : new _(t.__wrapped__, t.__chain__, te(t.__actions__))
                    }

                    function dr(t, e, n) {
                        e = (n ? Jn(t, e, n) : null == e) ? 1 : xa(_a(e) || 1, 1);
                        for (var r = 0, i = t ? t.length : 0, o = -1, a = zo(ma(i / e)); r < i;) a[++o] = We(t, r, r += e);
                        return a
                    }

                    function vr(t) {
                        for (var e = -1, n = t ? t.length : 0, r = -1, i = []; ++e < n;) {
                            var o = t[e];
                            o && (i[++r] = o)
                        }
                        return i
                    }

                    function mr(t, e, n) {
                        var r = t ? t.length : 0;
                        return r ? ((n ? Jn(t, e, n) : null == e) && (e = 1), We(t, e < 0 ? 0 : e)) : []
                    }

                    function gr(t, e, n) {
                        var r = t ? t.length : 0;
                        return r ? ((n ? Jn(t, e, n) : null == e) && (e = 1), e = r - (+e || 0), We(t, 0, e < 0 ? 0 : e)) : []
                    }

                    function _r(t, e, n) {
                        return t && t.length ? en(t, zn(e, n, 3), !0, !0) : []
                    }

                    function yr(t, e, n) {
                        return t && t.length ? en(t, zn(e, n, 3), !0) : []
                    }

                    function br(t, e, n, r) {
                        var i = t ? t.length : 0;
                        return i ? (n && "number" != typeof n && Jn(t, e, n) && (n = 0, r = i), Ce(t, e, n, r)) : []
                    }

                    function wr(t) {
                        return t ? t[0] : R
                    }

                    function xr(t, e, n) {
                        var r = t ? t.length : 0;
                        return n && Jn(t, e, n) && (e = !1), r ? Oe(t, e) : []
                    }

                    function Er(t) {
                        var e = t ? t.length : 0;
                        return e ? Oe(t, !0) : []
                    }

                    function Tr(t, e, n) {
                        var r = t ? t.length : 0;
                        if (!r) return -1;
                        if ("number" == typeof n) n = n < 0 ? xa(r + n, 0) : n; else if (n) {
                            var i = rn(t, e);
                            return i < r && (e === e ? e === t[i] : t[i] !== t[i]) ? i : -1
                        }
                        return o(t, e, n || 0)
                    }

                    function Rr(t) {
                        return gr(t, 1)
                    }

                    function Cr(t) {
                        var e = t ? t.length : 0;
                        return e ? t[e - 1] : R
                    }

                    function Mr(t, e, n) {
                        var r = t ? t.length : 0;
                        if (!r) return -1;
                        var i = r;
                        if ("number" == typeof n) i = (n < 0 ? xa(r + n, 0) : Ea(n || 0, r - 1)) + 1; else if (n) {
                            i = rn(t, e, !0) - 1;
                            var o = t[i];
                            return (e === e ? e === o : o !== o) ? i : -1
                        }
                        if (e !== e) return m(t, i, !0);
                        for (; i--;) if (t[i] === e) return i;
                        return -1
                    }

                    function Sr() {
                        var t = arguments, e = t[0];
                        if (!e || !e.length) return e;
                        for (var n = 0, r = Vn(), i = t.length; ++n < i;) for (var o = 0, a = t[n]; (o = r(e, a, o)) > -1;) pa.call(e, o, 1);
                        return e
                    }

                    function Or(t, e, n) {
                        var r = [];
                        if (!t || !t.length) return r;
                        var i = -1, o = [], a = t.length;
                        for (e = zn(e, n, 3); ++i < a;) {
                            var s = t[i];
                            e(s, i, t) && (r.push(s), o.push(i))
                        }
                        return Xe(t, o), r
                    }

                    function Pr(t) {
                        return mr(t, 1)
                    }

                    function Lr(t, e, n) {
                        var r = t ? t.length : 0;
                        return r ? (n && "number" != typeof n && Jn(t, e, n) && (e = 0, n = r), We(t, e, n)) : []
                    }

                    function Ar(t, e, n) {
                        var r = t ? t.length : 0;
                        return r ? ((n ? Jn(t, e, n) : null == e) && (e = 1), We(t, 0, e < 0 ? 0 : e)) : []
                    }

                    function kr(t, e, n) {
                        var r = t ? t.length : 0;
                        return r ? ((n ? Jn(t, e, n) : null == e) && (e = 1), e = r - (+e || 0), We(t, e < 0 ? 0 : e)) : []
                    }

                    function Fr(t, e, n) {
                        return t && t.length ? en(t, zn(e, n, 3), !1, !0) : []
                    }

                    function jr(t, e, n) {
                        return t && t.length ? en(t, zn(e, n, 3)) : []
                    }

                    function Dr(t, e, n, r) {
                        var i = t ? t.length : 0;
                        if (!i) return [];
                        null != e && "boolean" != typeof e && (r = n, n = Jn(t, e, r) ? R : e, e = !1);
                        var a = zn();
                        return null == n && a === be || (n = a(n, r, 3)), e && Vn() == o ? b(t, n) : Je(t, n)
                    }

                    function Hr(t) {
                        if (!t || !t.length) return [];
                        var e = -1, n = 0;
                        t = se(t, function (t) {
                            if (Kn(t)) return n = xa(t.length, n), !0
                        });
                        for (var r = zo(n); ++e < n;) r[e] = ce(t, Ve(e));
                        return r
                    }

                    function Nr(t, e, n) {
                        var r = t ? t.length : 0;
                        if (!r) return [];
                        var i = Hr(t);
                        return null == e ? i : (e = an(e, n, 4), ce(i, function (t) {
                            return le(t, e, R, !0)
                        }))
                    }

                    function Ir() {
                        for (var t = -1, e = arguments.length; ++t < e;) {
                            var n = arguments[t];
                            if (Kn(n)) var r = r ? ue(Ee(r, n), Ee(n, r)) : n
                        }
                        return r ? Je(r) : []
                    }

                    function Ur(t, e) {
                        var n = -1, r = t ? t.length : 0, i = {};
                        for (!r || e || Os(t[0]) || (e = []); ++n < r;) {
                            var o = t[n];
                            e ? i[o] = e[n] : o && (i[o[0]] = o[1])
                        }
                        return i
                    }

                    function zr(t) {
                        var n = e(t);
                        return n.__chain__ = !0, n
                    }

                    function Br(t, e, n) {
                        return e.call(n, t), t
                    }

                    function Vr(t, e, n) {
                        return e.call(n, t)
                    }

                    function Gr() {
                        return zr(this)
                    }

                    function Xr() {
                        return new _(this.value(), this.__chain__)
                    }

                    function Yr(t) {
                        for (var e, r = this; r instanceof n;) {
                            var i = pr(r);
                            e ? o.__wrapped__ = i : e = i;
                            var o = i;
                            r = r.__wrapped__
                        }
                        return o.__wrapped__ = t, e
                    }

                    function qr() {
                        var t = this.__wrapped__, e = function (t) {
                            return n && n.__dir__ < 0 ? t : t.reverse()
                        };
                        if (t instanceof K) {
                            var n = t;
                            return this.__actions__.length && (n = new K(this)), n = n.reverse(), n.__actions__.push({
                                func: Vr,
                                args: [e],
                                thisArg: R
                            }), new _(n, this.__chain__)
                        }
                        return this.thru(e)
                    }

                    function Wr() {
                        return this.value() + ""
                    }

                    function Zr() {
                        return nn(this.__wrapped__, this.__actions__)
                    }

                    function $r(t, e, n) {
                        var r = Os(t) ? oe : Te;
                        return n && Jn(t, e, n) && (e = R), "function" == typeof e && n === R || (e = zn(e, n, 3)), r(t, e)
                    }

                    function Kr(t, e, n) {
                        var r = Os(t) ? se : Me;
                        return e = zn(e, n, 3), r(t, e)
                    }

                    function Qr(t, e) {
                        return is(t, Ie(e))
                    }

                    function Jr(t, e, n, r) {
                        var i = t ? Ba(t) : 0;
                        return nr(i) || (t = oo(t), i = t.length), n = "number" != typeof n || r && Jn(e, n, r) ? 0 : n < 0 ? xa(i + n, 0) : n || 0, "string" == typeof t || !Os(t) && Bi(t) ? n <= i && t.indexOf(e, n) > -1 : !!i && Vn(t, e, n) > -1
                    }

                    function ti(t, e, n) {
                        var r = Os(t) ? ce : Ne;
                        return e = zn(e, n, 3), r(t, e)
                    }

                    function ei(t, e) {
                        return ti(t, Fo(e))
                    }

                    function ni(t, e, n) {
                        var r = Os(t) ? se : Me;
                        return e = zn(e, n, 3), r(t, function (t, n, r) {
                            return !e(t, n, r)
                        })
                    }

                    function ri(t, e, n) {
                        if (n ? Jn(t, e, n) : null == e) {
                            t = lr(t);
                            var r = t.length;
                            return r > 0 ? t[Ye(0, r - 1)] : R
                        }
                        var i = -1, o = qi(t), r = o.length, a = r - 1;
                        for (e = Ea(e < 0 ? 0 : +e || 0, r); ++i < e;) {
                            var s = Ye(i, a), c = o[s];
                            o[s] = o[i], o[i] = c
                        }
                        return o.length = e, o
                    }

                    function ii(t) {
                        return ri(t, Sa)
                    }

                    function oi(t) {
                        var e = t ? Ba(t) : 0;
                        return nr(e) ? e : Us(t).length
                    }

                    function ai(t, e, n) {
                        var r = Os(t) ? he : Ze;
                        return n && Jn(t, e, n) && (e = R), "function" == typeof e && n === R || (e = zn(e, n, 3)), r(t, e)
                    }

                    function si(t, e, n) {
                        if (null == t) return [];
                        n && Jn(t, e, n) && (e = R);
                        var r = -1;
                        e = zn(e, n, 3);
                        var i = Ne(t, function (t, n, i) {
                            return {criteria: e(t, n, i), index: ++r, value: t}
                        });
                        return $e(i, l)
                    }

                    function ci(t, e, n, r) {
                        return null == t ? [] : (r && Jn(e, n, r) && (n = R), Os(e) || (e = null == e ? [] : [e]), Os(n) || (n = null == n ? [] : [n]), Ke(t, e, n))
                    }

                    function ui(t, e) {
                        return Kr(t, Ie(e))
                    }

                    function li(t, e) {
                        if ("function" != typeof e) {
                            if ("function" != typeof t) throw new $o(V);
                            var n = t;
                            t = e, e = n
                        }
                        return t = ba(t = +t) ? t : 0, function () {
                            if (--t < 1) return e.apply(this, arguments)
                        }
                    }

                    function fi(t, e, n) {
                        return n && Jn(t, e, n) && (e = R), e = t && null == e ? t.length : xa(+e || 0, 0), Hn(t, F, R, R, R, R, e)
                    }

                    function hi(t, e) {
                        var n;
                        if ("function" != typeof e) {
                            if ("function" != typeof t) throw new $o(V);
                            var r = t;
                            t = e, e = r
                        }
                        return function () {
                            return --t > 0 && (n = e.apply(this, arguments)), t <= 1 && (e = R), n
                        }
                    }

                    function pi(t, e, n) {
                        function r() {
                            p && sa(p), u && sa(u), v = 0, u = p = d = R
                        }

                        function i(e, n) {
                            n && sa(n), u = p = d = R, e && (v = vs(), l = t.apply(h, c), p || u || (c = h = R))
                        }

                        function o() {
                            var t = e - (vs() - f);
                            t <= 0 || t > e ? i(d, u) : p = ha(o, t)
                        }

                        function a() {
                            i(g, p)
                        }

                        function s() {
                            if (c = arguments, f = vs(), h = this, d = g && (p || !_), m === !1) var n = _ && !p; else {
                                u || _ || (v = f);
                                var r = m - (f - v), i = r <= 0 || r > m;
                                i ? (u && (u = sa(u)), v = f, l = t.apply(h, c)) : u || (u = ha(a, r))
                            }
                            return i && p ? p = sa(p) : p || e === m || (p = ha(o, e)), n && (i = !0, l = t.apply(h, c)), !i || p || u || (c = h = R), l
                        }

                        var c, u, l, f, h, p, d, v = 0, m = !1, g = !0;
                        if ("function" != typeof t) throw new $o(V);
                        if (e = e < 0 ? 0 : +e || 0, n === !0) {
                            var _ = !0;
                            g = !1
                        } else Fi(n) && (_ = !!n.leading, m = "maxWait" in n && xa(+n.maxWait || 0, e), g = "trailing" in n ? !!n.trailing : g);
                        return s.cancel = r, s
                    }

                    function di(t, e) {
                        if ("function" != typeof t || e && "function" != typeof e) throw new $o(V);
                        var n = function () {
                            var r = arguments, i = e ? e.apply(this, r) : r[0], o = n.cache;
                            if (o.has(i)) return o.get(i);
                            var a = t.apply(this, r);
                            return n.cache = o.set(i, a), a
                        };
                        return n.cache = new di.Cache, n
                    }

                    function vi(t) {
                        if ("function" != typeof t) throw new $o(V);
                        return function () {
                            return !t.apply(this, arguments)
                        }
                    }

                    function mi(t) {
                        return hi(2, t)
                    }

                    function gi(t, e) {
                        if ("function" != typeof t) throw new $o(V);
                        return e = xa(e === R ? t.length - 1 : +e || 0, 0), function () {
                            for (var n = arguments, r = -1, i = xa(n.length - e, 0), o = zo(i); ++r < i;) o[r] = n[e + r];
                            switch (e) {
                                case 0:
                                    return t.call(this, o);
                                case 1:
                                    return t.call(this, n[0], o);
                                case 2:
                                    return t.call(this, n[0], n[1], o)
                            }
                            var a = zo(e + 1);
                            for (r = -1; ++r < e;) a[r] = n[r];
                            return a[e] = o, t.apply(this, a)
                        }
                    }

                    function _i(t) {
                        if ("function" != typeof t) throw new $o(V);
                        return function (e) {
                            return t.apply(this, e)
                        }
                    }

                    function yi(t, e, n) {
                        var r = !0, i = !0;
                        if ("function" != typeof t) throw new $o(V);
                        return n === !1 ? r = !1 : Fi(n) && (r = "leading" in n ? !!n.leading : r, i = "trailing" in n ? !!n.trailing : i), pi(t, e, {
                            leading: r,
                            maxWait: +e,
                            trailing: i
                        })
                    }

                    function bi(t, e) {
                        return e = null == e ? So : e, Hn(e, A, R, [t], [])
                    }

                    function wi(t, e, n, r) {
                        return e && "boolean" != typeof e && Jn(t, e, n) ? e = !1 : "function" == typeof e && (r = n, n = e, e = !1), "function" == typeof n ? we(t, e, an(n, r, 1)) : we(t, e)
                    }

                    function xi(t, e, n) {
                        return "function" == typeof e ? we(t, !0, an(e, n, 1)) : we(t, !0)
                    }

                    function Ei(t, e) {
                        return t > e
                    }

                    function Ti(t, e) {
                        return t >= e
                    }

                    function Ri(t) {
                        return g(t) && Kn(t) && ea.call(t, "callee") && !la.call(t, "callee")
                    }

                    function Ci(t) {
                        return t === !0 || t === !1 || g(t) && ra.call(t) == q
                    }

                    function Mi(t) {
                        return g(t) && ra.call(t) == W
                    }

                    function Si(t) {
                        return !!t && 1 === t.nodeType && g(t) && !Ui(t)
                    }

                    function Oi(t) {
                        return null == t || (Kn(t) && (Os(t) || Bi(t) || Ri(t) || g(t) && ki(t.splice)) ? !t.length : !Us(t).length)
                    }

                    function Pi(t, e, n, r) {
                        n = "function" == typeof n ? an(n, r, 3) : R;
                        var i = n ? n(t, e) : R;
                        return i === R ? je(t, e, n) : !!i
                    }

                    function Li(t) {
                        return g(t) && "string" == typeof t.message && ra.call(t) == Z
                    }

                    function Ai(t) {
                        return "number" == typeof t && ba(t)
                    }

                    function ki(t) {
                        return Fi(t) && ra.call(t) == $
                    }

                    function Fi(t) {
                        var e = typeof t;
                        return !!t && ("object" == e || "function" == e)
                    }

                    function ji(t, e, n, r) {
                        return n = "function" == typeof n ? an(n, r, 3) : R, He(t, Gn(e), n)
                    }

                    function Di(t) {
                        return Ii(t) && t != +t
                    }

                    function Hi(t) {
                        return null != t && (ki(t) ? oa.test(ta.call(t)) : g(t) && Ft.test(t))
                    }

                    function Ni(t) {
                        return null === t
                    }

                    function Ii(t) {
                        return "number" == typeof t || g(t) && ra.call(t) == Q
                    }

                    function Ui(t) {
                        var e;
                        if (!g(t) || ra.call(t) != J || Ri(t) || !ea.call(t, "constructor") && (e = t.constructor, "function" == typeof e && !(e instanceof e))) return !1;
                        var n;
                        return Pe(t, function (t, e) {
                            n = e
                        }), n === R || ea.call(t, n)
                    }

                    function zi(t) {
                        return Fi(t) && ra.call(t) == tt
                    }

                    function Bi(t) {
                        return "string" == typeof t || g(t) && ra.call(t) == nt
                    }

                    function Vi(t) {
                        return g(t) && nr(t.length) && !!Bt[ra.call(t)]
                    }

                    function Gi(t) {
                        return t === R
                    }

                    function Xi(t, e) {
                        return t < e
                    }

                    function Yi(t, e) {
                        return t <= e
                    }

                    function qi(t) {
                        var e = t ? Ba(t) : 0;
                        return nr(e) ? e ? te(t) : [] : oo(t)
                    }

                    function Wi(t) {
                        return ye(t, to(t))
                    }

                    function Zi(t, e, n) {
                        var r = ja(t);
                        return n && Jn(t, e, n) && (e = R), e ? ge(r, e) : r
                    }

                    function $i(t) {
                        return ke(t, to(t))
                    }

                    function Ki(t, e, n) {
                        var r = null == t ? R : Fe(t, hr(e), e + "");
                        return r === R ? n : r
                    }

                    function Qi(t, e) {
                        if (null == t) return !1;
                        var n = ea.call(t, e);
                        if (!n && !tr(e)) {
                            if (e = hr(e), t = 1 == e.length ? t : Fe(t, We(e, 0, -1)), null == t) return !1;
                            e = Cr(e), n = ea.call(t, e)
                        }
                        return n || nr(t.length) && Qn(e, t.length) && (Os(t) || Ri(t))
                    }

                    function Ji(t, e, n) {
                        n && Jn(t, e, n) && (e = R);
                        for (var r = -1, i = Us(t), o = i.length, a = {}; ++r < o;) {
                            var s = i[r], c = t[s];
                            e ? ea.call(a, c) ? a[c].push(s) : a[c] = [s] : a[c] = s
                        }
                        return a
                    }

                    function to(t) {
                        if (null == t) return [];
                        Fi(t) || (t = qo(t));
                        var e = t.length;
                        e = e && nr(e) && (Os(t) || Ri(t)) && e || 0;
                        for (var n = t.constructor, r = -1, i = "function" == typeof n && n.prototype === t, o = zo(e), a = e > 0; ++r < e;) o[r] = r + "";
                        for (var s in t) a && Qn(s, e) || "constructor" == s && (i || !ea.call(t, s)) || o.push(s);
                        return o
                    }

                    function eo(t) {
                        t = fr(t);
                        for (var e = -1, n = Us(t), r = n.length, i = zo(r); ++e < r;) {
                            var o = n[e];
                            i[e] = [o, t[o]]
                        }
                        return i
                    }

                    function no(t, e, n) {
                        var r = null == t ? R : t[e];
                        return r === R && (null == t || tr(e, t) || (e = hr(e), t = 1 == e.length ? t : Fe(t, We(e, 0, -1)), r = null == t ? R : t[Cr(e)]), r = r === R ? n : r), ki(r) ? r.call(t) : r
                    }

                    function ro(t, e, n) {
                        if (null == t) return t;
                        var r = e + "";
                        e = null != t[r] || tr(e, t) ? [r] : hr(e);
                        for (var i = -1, o = e.length, a = o - 1, s = t; null != s && ++i < o;) {
                            var c = e[i];
                            Fi(s) && (i == a ? s[c] = n : null == s[c] && (s[c] = Qn(e[i + 1]) ? [] : {})), s = s[c]
                        }
                        return t
                    }

                    function io(t, e, n, r) {
                        var i = Os(t) || Vi(t);
                        if (e = zn(e, r, 4), null == n) if (i || Fi(t)) {
                            var o = t.constructor;
                            n = i ? Os(t) ? new o : [] : ja(ki(o) ? o.prototype : R)
                        } else n = {};
                        return (i ? ee : Le)(t, function (t, r, i) {
                            return e(n, t, r, i)
                        }), n
                    }

                    function oo(t) {
                        return tn(t, Us(t))
                    }

                    function ao(t) {
                        return tn(t, to(t))
                    }

                    function so(t, e, n) {
                        return e = +e || 0, n === R ? (n = e, e = 0) : n = +n || 0, t >= Ea(e, n) && t < xa(e, n)
                    }

                    function co(t, e, n) {
                        n && Jn(t, e, n) && (e = n = R);
                        var r = null == t, i = null == e;
                        if (null == n && (i && "boolean" == typeof t ? (n = t, t = 1) : "boolean" == typeof e && (n = e, i = !0)), r && i && (e = 1, i = !1), t = +t || 0, i ? (e = t, t = 0) : e = +e || 0, n || t % 1 || e % 1) {
                            var o = Ca();
                            return Ea(t + o * (e - t + ca("1e-" + ((o + "").length - 1))), e)
                        }
                        return Ye(t, e)
                    }

                    function uo(t) {
                        return t = s(t), t && t.charAt(0).toUpperCase() + t.slice(1)
                    }

                    function lo(t) {
                        return t = s(t), t && t.replace(Dt, h).replace(Ot, "")
                    }

                    function fo(t, e, n) {
                        t = s(t), e += "";
                        var r = t.length;
                        return n = n === R ? r : Ea(n < 0 ? 0 : +n || 0, r), n -= e.length, n >= 0 && t.indexOf(e, n) == n
                    }

                    function ho(t) {
                        return t = s(t), t && bt.test(t) ? t.replace(_t, p) : t
                    }

                    function po(t) {
                        return t = s(t), t && St.test(t) ? t.replace(Mt, d) : t || "(?:)"
                    }

                    function vo(t, e, n) {
                        t = s(t), e = +e;
                        var r = t.length;
                        if (r >= e || !ba(e)) return t;
                        var i = (e - r) / 2, o = _a(i), a = ma(i);
                        return n = kn("", a, n), n.slice(0, o) + t + n
                    }

                    function mo(t, e, n) {
                        return (n ? Jn(t, e, n) : null == e) ? e = 0 : e && (e = +e), t = bo(t), Ra(t, e || (kt.test(t) ? 16 : 10))
                    }

                    function go(t, e) {
                        var n = "";
                        if (t = s(t), e = +e, e < 1 || !t || !ba(e)) return n;
                        do e % 2 && (n += t), e = _a(e / 2), t += t; while (e);
                        return n
                    }

                    function _o(t, e, n) {
                        return t = s(t), n = null == n ? 0 : Ea(n < 0 ? 0 : +n || 0, t.length), t.lastIndexOf(e, n) == n
                    }

                    function yo(t, n, r) {
                        var i = e.templateSettings;
                        r && Jn(t, n, r) && (n = r = R), t = s(t), n = me(ge({}, r || n), i, ve);
                        var o, a, c = me(ge({}, n.imports), i.imports, ve), u = Us(c), l = tn(c, u), f = 0,
                            h = n.interpolate || Ht, p = "__p += '",
                            d = Wo((n.escape || Ht).source + "|" + h.source + "|" + (h === Et ? Lt : Ht).source + "|" + (n.evaluate || Ht).source + "|$", "g"),
                            m = "//# sourceURL=" + ("sourceURL" in n ? n.sourceURL : "lodash.templateSources[" + ++zt + "]") + "\n";
                        t.replace(d, function (e, n, r, i, s, c) {
                            return r || (r = i), p += t.slice(f, c).replace(Nt, v), n && (o = !0, p += "' +\n__e(" + n + ") +\n'"), s && (a = !0, p += "';\n" + s + ";\n__p += '"), r && (p += "' +\n((__t = (" + r + ")) == null ? '' : __t) +\n'"), f = c + e.length, e
                        }), p += "';\n";
                        var g = n.variable;
                        g || (p = "with (obj) {\n" + p + "\n}\n"), p = (a ? p.replace(dt, "") : p).replace(vt, "$1").replace(mt, "$1;"), p = "function(" + (g || "obj") + ") {\n" + (g ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (o ? ", __e = _.escape" : "") + (a ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + p + "return __p\n}";
                        var _ = Ks(function () {
                            return Go(u, m + "return " + p).apply(R, l)
                        });
                        if (_.source = p, Li(_)) throw _;
                        return _
                    }

                    function bo(t, e, n) {
                        var r = t;
                        return (t = s(t)) ? (n ? Jn(r, e, n) : null == e) ? t.slice(w(t), x(t) + 1) : (e += "", t.slice(c(t, e), u(t, e) + 1)) : t
                    }

                    function wo(t, e, n) {
                        var r = t;
                        return t = s(t), t ? (n ? Jn(r, e, n) : null == e) ? t.slice(w(t)) : t.slice(c(t, e + "")) : t
                    }

                    function xo(t, e, n) {
                        var r = t;
                        return t = s(t), t ? (n ? Jn(r, e, n) : null == e) ? t.slice(0, x(t) + 1) : t.slice(0, u(t, e + "") + 1) : t
                    }

                    function Eo(t, e, n) {
                        n && Jn(t, e, n) && (e = R);
                        var r = D, i = H;
                        if (null != e) if (Fi(e)) {
                            var o = "separator" in e ? e.separator : o;
                            r = "length" in e ? +e.length || 0 : r, i = "omission" in e ? s(e.omission) : i
                        } else r = +e || 0;
                        if (t = s(t), r >= t.length) return t;
                        var a = r - i.length;
                        if (a < 1) return i;
                        var c = t.slice(0, a);
                        if (null == o) return c + i;
                        if (zi(o)) {
                            if (t.slice(a).search(o)) {
                                var u, l, f = t.slice(0, a);
                                for (o.global || (o = Wo(o.source, (At.exec(o) || "") + "g")), o.lastIndex = 0; u = o.exec(f);) l = u.index;
                                c = c.slice(0, null == l ? a : l)
                            }
                        } else if (t.indexOf(o, a) != a) {
                            var h = c.lastIndexOf(o);
                            h > -1 && (c = c.slice(0, h))
                        }
                        return c + i
                    }

                    function To(t) {
                        return t = s(t), t && yt.test(t) ? t.replace(gt, E) : t
                    }

                    function Ro(t, e, n) {
                        return n && Jn(t, e, n) && (e = R), t = s(t), t.match(e || It) || []
                    }

                    function Co(t, e, n) {
                        return n && Jn(t, e, n) && (e = R), g(t) ? Oo(t) : be(t, e)
                    }

                    function Mo(t) {
                        return function () {
                            return t
                        }
                    }

                    function So(t) {
                        return t
                    }

                    function Oo(t) {
                        return Ie(we(t, !0))
                    }

                    function Po(t, e) {
                        return Ue(t, we(e, !0))
                    }

                    function Lo(t, e, n) {
                        if (null == n) {
                            var r = Fi(e), i = r ? Us(e) : R, o = i && i.length ? ke(e, i) : R;
                            (o ? o.length : r) || (o = !1, n = e, e = t, t = this)
                        }
                        o || (o = ke(e, Us(e)));
                        var a = !0, s = -1, c = ki(t), u = o.length;
                        n === !1 ? a = !1 : Fi(n) && "chain" in n && (a = n.chain);
                        for (; ++s < u;) {
                            var l = o[s], f = e[l];
                            t[l] = f, c && (t.prototype[l] = function (e) {
                                return function () {
                                    var n = this.__chain__;
                                    if (a || n) {
                                        var r = t(this.__wrapped__), i = r.__actions__ = te(this.__actions__);
                                        return i.push({func: e, args: arguments, thisArg: t}), r.__chain__ = n, r
                                    }
                                    return e.apply(t, ue([this.value()], arguments))
                                }
                            }(f))
                        }
                        return t
                    }

                    function Ao() {
                        return ne._ = ia, this
                    }

                    function ko() {
                    }

                    function Fo(t) {
                        return tr(t) ? Ve(t) : Ge(t)
                    }

                    function jo(t) {
                        return function (e) {
                            return Fe(t, hr(e), e + "")
                        }
                    }

                    function Do(t, e, n) {
                        n && Jn(t, e, n) && (e = n = R), t = +t || 0, n = null == n ? 1 : +n || 0, null == e ? (e = t, t = 0) : e = +e || 0;
                        for (var r = -1, i = xa(ma((e - t) / (n || 1)), 0), o = zo(i); ++r < i;) o[r] = t, t += n;
                        return o
                    }

                    function Ho(t, e, n) {
                        if (t = _a(t), t < 1 || !ba(t)) return [];
                        var r = -1, i = zo(Ea(t, Oa));
                        for (e = an(e, n, 1); ++r < t;) r < Oa ? i[r] = e(r) : e(r);
                        return i
                    }

                    function No(t) {
                        var e = ++na;
                        return s(t) + e
                    }

                    function Io(t, e) {
                        return (+t || 0) + (+e || 0)
                    }

                    function Uo(t, e, n) {
                        return n && Jn(t, e, n) && (e = R), e = zn(e, n, 3), 1 == e.length ? pe(Os(t) ? t : lr(t), e) : Qe(t, e)
                    }

                    t = t ? re.defaults(ne.Object(), t, re.pick(ne, Ut)) : ne;
                    var zo = t.Array, Bo = t.Date, Vo = t.Error, Go = t.Function, Xo = t.Math, Yo = t.Number,
                        qo = t.Object, Wo = t.RegExp, Zo = t.String, $o = t.TypeError, Ko = zo.prototype,
                        Qo = qo.prototype, Jo = Zo.prototype, ta = Go.prototype.toString, ea = Qo.hasOwnProperty,
                        na = 0, ra = Qo.toString, ia = ne._,
                        oa = Wo("^" + ta.call(ea).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
                        aa = t.ArrayBuffer, sa = t.clearTimeout, ca = t.parseFloat, ua = Xo.pow,
                        la = Qo.propertyIsEnumerable, fa = Xn(t, "Set"), ha = t.setTimeout, pa = Ko.splice,
                        da = t.Uint8Array, va = Xn(t, "WeakMap"), ma = Xo.ceil, ga = Xn(qo, "create"), _a = Xo.floor,
                        ya = Xn(zo, "isArray"), ba = t.isFinite, wa = Xn(qo, "keys"), xa = Xo.max, Ea = Xo.min,
                        Ta = Xn(Bo, "now"), Ra = t.parseInt, Ca = Xo.random, Ma = Yo.NEGATIVE_INFINITY,
                        Sa = Yo.POSITIVE_INFINITY, Oa = 4294967295, Pa = Oa - 1, La = Oa >>> 1, Aa = 9007199254740991,
                        ka = va && new va, Fa = {};
                    e.support = {};
                    e.templateSettings = {escape: wt, evaluate: xt, interpolate: Et, variable: "", imports: {_: e}};
                    var ja = function () {
                            function t() {
                            }

                            return function (e) {
                                if (Fi(e)) {
                                    t.prototype = e;
                                    var n = new t;
                                    t.prototype = R
                                }
                                return n || {}
                            }
                        }(), Da = hn(Le), Ha = hn(Ae, !0), Na = pn(), Ia = pn(!0), Ua = ka ? function (t, e) {
                            return ka.set(t, e), t
                        } : So, za = ka ? function (t) {
                            return ka.get(t)
                        } : ko, Ba = Ve("length"), Va = function () {
                            var t = 0, e = 0;
                            return function (n, r) {
                                var i = vs(), o = I - (i - e);
                                if (e = i, o > 0) {
                                    if (++t >= N) return n
                                } else t = 0;
                                return Ua(n, r)
                            }
                        }(), Ga = gi(function (t, e) {
                            return g(t) && Kn(t) ? Ee(t, Oe(e, !1, !0)) : []
                        }), Xa = xn(), Ya = xn(!0), qa = gi(function (t) {
                            for (var e = t.length, n = e, r = zo(f), i = Vn(), a = i == o, s = []; n--;) {
                                var c = t[n] = Kn(c = t[n]) ? c : [];
                                r[n] = a && c.length >= 120 ? vn(n && c) : null
                            }
                            var u = t[0], l = -1, f = u ? u.length : 0, h = r[0];
                            t:for (; ++l < f;) if (c = u[l], (h ? Kt(h, c) : i(s, c, 0)) < 0) {
                                for (var n = e; --n;) {
                                    var p = r[n];
                                    if ((p ? Kt(p, c) : i(t[n], c, 0)) < 0) continue t
                                }
                                h && h.push(c), s.push(c)
                            }
                            return s
                        }), Wa = gi(function (t, e) {
                            e = Oe(e);
                            var n = _e(t, e);
                            return Xe(t, e.sort(r)), n
                        }), Za = Dn(), $a = Dn(!0), Ka = gi(function (t) {
                            return Je(Oe(t, !1, !0))
                        }), Qa = gi(function (t, e) {
                            return Kn(t) ? Ee(t, e) : []
                        }), Ja = gi(Hr), ts = gi(function (t) {
                            var e = t.length, n = e > 2 ? t[e - 2] : R, r = e > 1 ? t[e - 1] : R;
                            return e > 2 && "function" == typeof n ? e -= 2 : (n = e > 1 && "function" == typeof r ? (--e, r) : R, r = R), t.length = e, Nr(t, n, r)
                        }), es = gi(function (t) {
                            return t = Oe(t), this.thru(function (e) {
                                return Jt(Os(e) ? e : [fr(e)], t)
                            })
                        }), ns = gi(function (t, e) {
                            return _e(t, Oe(e))
                        }), rs = ln(function (t, e, n) {
                            ea.call(t, n) ? ++t[n] : t[n] = 1
                        }), is = wn(Da), os = wn(Ha, !0), as = Rn(ee, Da), ss = Rn(ie, Ha), cs = ln(function (t, e, n) {
                            ea.call(t, n) ? t[n].push(e) : t[n] = [e]
                        }), us = ln(function (t, e, n) {
                            t[n] = e
                        }), ls = gi(function (t, e, n) {
                            var r = -1, i = "function" == typeof e, o = tr(e), a = Kn(t) ? zo(t.length) : [];
                            return Da(t, function (t) {
                                var s = i ? e : o && null != t ? t[e] : R;
                                a[++r] = s ? s.apply(t, n) : $n(t, e, n)
                            }), a
                        }), fs = ln(function (t, e, n) {
                            t[n ? 0 : 1].push(e)
                        }, function () {
                            return [[], []]
                        }), hs = Ln(le, Da), ps = Ln(fe, Ha), ds = gi(function (t, e) {
                            if (null == t) return [];
                            var n = e[2];
                            return n && Jn(e[0], e[1], n) && (e.length = 1), Ke(t, Oe(e), [])
                        }), vs = Ta || function () {
                            return (new Bo).getTime()
                        }, ms = gi(function (t, e, n) {
                            var r = M;
                            if (n.length) {
                                var i = y(n, ms.placeholder);
                                r |= A
                            }
                            return Hn(t, r, e, n, i)
                        }), gs = gi(function (t, e) {
                            e = e.length ? Oe(e) : $i(t);
                            for (var n = -1, r = e.length; ++n < r;) {
                                var i = e[n];
                                t[i] = Hn(t[i], M, t)
                            }
                            return t
                        }), _s = gi(function (t, e, n) {
                            var r = M | S;
                            if (n.length) {
                                var i = y(n, _s.placeholder);
                                r |= A
                            }
                            return Hn(e, r, t, n, i)
                        }), ys = _n(P), bs = _n(L), ws = gi(function (t, e) {
                            return xe(t, 1, e)
                        }), xs = gi(function (t, e, n) {
                            return xe(t, e, n)
                        }), Es = Tn(), Ts = Tn(!0), Rs = gi(function (t, e) {
                            if (e = Oe(e), "function" != typeof t || !oe(e, a)) throw new $o(V);
                            var n = e.length;
                            return gi(function (r) {
                                for (var i = Ea(r.length, n); i--;) r[i] = e[i](r[i]);
                                return t.apply(this, r)
                            })
                        }), Cs = Pn(A), Ms = Pn(k), Ss = gi(function (t, e) {
                            return Hn(t, j, R, R, R, Oe(e))
                        }), Os = ya || function (t) {
                            return g(t) && nr(t.length) && ra.call(t) == Y
                        }, Ps = fn(ze), Ls = fn(function (t, e, n) {
                            return n ? me(t, e, n) : ge(t, e)
                        }), As = yn(Ls, de), ks = yn(Ps, or), Fs = En(Le), js = En(Ae), Ds = Cn(Na), Hs = Cn(Ia),
                        Ns = Mn(Le), Is = Mn(Ae), Us = wa ? function (t) {
                            var e = null == t ? R : t.constructor;
                            return "function" == typeof e && e.prototype === t || "function" != typeof t && Kn(t) ? ur(t) : Fi(t) ? wa(t) : []
                        } : ur, zs = Sn(!0), Bs = Sn(), Vs = gi(function (t, e) {
                            if (null == t) return {};
                            if ("function" != typeof e[0]) {
                                var e = ce(Oe(e), Zo);
                                return ar(t, Ee(to(t), e))
                            }
                            var n = an(e[0], e[1], 3);
                            return sr(t, function (t, e, r) {
                                return !n(t, e, r)
                            })
                        }), Gs = gi(function (t, e) {
                            return null == t ? {} : "function" == typeof e[0] ? sr(t, an(e[0], e[1], 3)) : ar(t, Oe(e))
                        }), Xs = mn(function (t, e, n) {
                            return e = e.toLowerCase(), t + (n ? e.charAt(0).toUpperCase() + e.slice(1) : e)
                        }), Ys = mn(function (t, e, n) {
                            return t + (n ? "-" : "") + e.toLowerCase()
                        }), qs = On(), Ws = On(!0), Zs = mn(function (t, e, n) {
                            return t + (n ? "_" : "") + e.toLowerCase()
                        }), $s = mn(function (t, e, n) {
                            return t + (n ? " " : "") + (e.charAt(0).toUpperCase() + e.slice(1))
                        }), Ks = gi(function (t, e) {
                            try {
                                return t.apply(R, e)
                            } catch (n) {
                                return Li(n) ? n : new Vo(n)
                            }
                        }), Qs = gi(function (t, e) {
                            return function (n) {
                                return $n(n, t, e)
                            }
                        }), Js = gi(function (t, e) {
                            return function (n) {
                                return $n(t, n, e)
                            }
                        }), tc = jn("ceil"), ec = jn("floor"), nc = bn(Ei, Ma), rc = bn(Xi, Sa), ic = jn("round");
                    return e.prototype = n.prototype, _.prototype = ja(n.prototype), _.prototype.constructor = _, K.prototype = ja(n.prototype), K.prototype.constructor = K, Xt.prototype["delete"] = Yt, Xt.prototype.get = qt, Xt.prototype.has = Wt, Xt.prototype.set = Zt, $t.prototype.push = Qt, di.Cache = Xt, e.after = li, e.ary = fi, e.assign = Ls, e.at = ns, e.before = hi, e.bind = ms, e.bindAll = gs, e.bindKey = _s, e.callback = Co, e.chain = zr, e.chunk = dr, e.compact = vr, e.constant = Mo, e.countBy = rs, e.create = Zi, e.curry = ys, e.curryRight = bs, e.debounce = pi, e.defaults = As, e.defaultsDeep = ks, e.defer = ws, e.delay = xs, e.difference = Ga, e.drop = mr, e.dropRight = gr, e.dropRightWhile = _r, e.dropWhile = yr, e.fill = br, e.filter = Kr, e.flatten = xr, e.flattenDeep = Er, e.flow = Es, e.flowRight = Ts, e.forEach = as, e.forEachRight = ss, e.forIn = Ds, e.forInRight = Hs, e.forOwn = Ns, e.forOwnRight = Is, e.functions = $i, e.groupBy = cs, e.indexBy = us, e.initial = Rr, e.intersection = qa, e.invert = Ji, e.invoke = ls, e.keys = Us, e.keysIn = to, e.map = ti, e.mapKeys = zs, e.mapValues = Bs, e.matches = Oo, e.matchesProperty = Po, e.memoize = di, e.merge = Ps, e.method = Qs, e.methodOf = Js, e.mixin = Lo, e.modArgs = Rs, e.negate = vi, e.omit = Vs, e.once = mi, e.pairs = eo, e.partial = Cs, e.partialRight = Ms, e.partition = fs, e.pick = Gs, e.pluck = ei, e.property = Fo, e.propertyOf = jo, e.pull = Sr, e.pullAt = Wa, e.range = Do, e.rearg = Ss, e.reject = ni, e.remove = Or, e.rest = Pr, e.restParam = gi, e.set = ro, e.shuffle = ii, e.slice = Lr, e.sortBy = si, e.sortByAll = ds, e.sortByOrder = ci, e.spread = _i, e.take = Ar, e.takeRight = kr, e.takeRightWhile = Fr, e.takeWhile = jr, e.tap = Br,e.throttle = yi,e.thru = Vr,e.times = Ho,e.toArray = qi,e.toPlainObject = Wi,e.transform = io,e.union = Ka,e.uniq = Dr,e.unzip = Hr,e.unzipWith = Nr,e.values = oo,e.valuesIn = ao,e.where = ui,e.without = Qa,e.wrap = bi,e.xor = Ir,e.zip = Ja,e.zipObject = Ur,e.zipWith = ts,e.backflow = Ts,e.collect = ti,e.compose = Ts,e.each = as,e.eachRight = ss,e.extend = Ls,e.iteratee = Co,e.methods = $i,e.object = Ur,e.select = Kr,e.tail = Pr,e.unique = Dr,Lo(e, e),e.add = Io,e.attempt = Ks,e.camelCase = Xs,e.capitalize = uo,e.ceil = tc,e.clone = wi,e.cloneDeep = xi,e.deburr = lo,e.endsWith = fo,e.escape = ho,e.escapeRegExp = po,e.every = $r,e.find = is,e.findIndex = Xa,e.findKey = Fs,e.findLast = os,e.findLastIndex = Ya,e.findLastKey = js,e.findWhere = Qr,e.first = wr,e.floor = ec,e.get = Ki,e.gt = Ei,e.gte = Ti,e.has = Qi,e.identity = So,e.includes = Jr,e.indexOf = Tr,e.inRange = so,e.isArguments = Ri,e.isArray = Os,e.isBoolean = Ci,e.isDate = Mi,e.isElement = Si,e.isEmpty = Oi,e.isEqual = Pi,e.isError = Li,e.isFinite = Ai,e.isFunction = ki,e.isMatch = ji,e.isNaN = Di,e.isNative = Hi,e.isNull = Ni,e.isNumber = Ii,e.isObject = Fi,e.isPlainObject = Ui,e.isRegExp = zi,e.isString = Bi,e.isTypedArray = Vi,e.isUndefined = Gi,e.kebabCase = Ys,e.last = Cr,e.lastIndexOf = Mr,e.lt = Xi,e.lte = Yi,e.max = nc,e.min = rc,e.noConflict = Ao,e.noop = ko,e.now = vs,e.pad = vo,e.padLeft = qs,e.padRight = Ws,e.parseInt = mo,e.random = co,e.reduce = hs,e.reduceRight = ps,e.repeat = go,e.result = no,e.round = ic,e.runInContext = T,e.size = oi,e.snakeCase = Zs,e.some = ai,e.sortedIndex = Za,e.sortedLastIndex = $a,e.startCase = $s,e.startsWith = _o,e.sum = Uo,e.template = yo,e.trim = bo,e.trimLeft = wo,e.trimRight = xo,e.trunc = Eo,e.unescape = To,e.uniqueId = No,e.words = Ro,e.all = $r,e.any = ai,e.contains = Jr,e.eq = Pi,e.detect = is,e.foldl = hs,e.foldr = ps,e.head = wr,e.include = Jr,e.inject = hs,
                        Lo(e, function () {
                            var t = {};
                            return Le(e, function (n, r) {
                                e.prototype[r] || (t[r] = n)
                            }), t
                        }(), !1),e.sample = ri,e.prototype.sample = function (t) {
                        return this.__chain__ || null != t ? this.thru(function (e) {
                            return ri(e, t)
                        }) : ri(this.value())
                    },e.VERSION = C,ee(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function (t) {
                        e[t].placeholder = e
                    }),ee(["drop", "take"], function (t, e) {
                        K.prototype[t] = function (n) {
                            var r = this.__filtered__;
                            if (r && !e) return new K(this);
                            n = null == n ? 1 : xa(_a(n) || 0, 0);
                            var i = this.clone();
                            return r ? i.__takeCount__ = Ea(i.__takeCount__, n) : i.__views__.push({
                                size: n,
                                type: t + (i.__dir__ < 0 ? "Right" : "")
                            }), i
                        }, K.prototype[t + "Right"] = function (e) {
                            return this.reverse()[t](e).reverse()
                        }
                    }),ee(["filter", "map", "takeWhile"], function (t, e) {
                        var n = e + 1, r = n != B;
                        K.prototype[t] = function (t, e) {
                            var i = this.clone();
                            return i.__iteratees__.push({
                                iteratee: zn(t, e, 1),
                                type: n
                            }), i.__filtered__ = i.__filtered__ || r, i
                        }
                    }),ee(["first", "last"], function (t, e) {
                        var n = "take" + (e ? "Right" : "");
                        K.prototype[t] = function () {
                            return this[n](1).value()[0]
                        }
                    }),ee(["initial", "rest"], function (t, e) {
                        var n = "drop" + (e ? "" : "Right");
                        K.prototype[t] = function () {
                            return this.__filtered__ ? new K(this) : this[n](1)
                        }
                    }),ee(["pluck", "where"], function (t, e) {
                        var n = e ? "filter" : "map", r = e ? Ie : Fo;
                        K.prototype[t] = function (t) {
                            return this[n](r(t))
                        }
                    }),K.prototype.compact = function () {
                        return this.filter(So)
                    },K.prototype.reject = function (t, e) {
                        return t = zn(t, e, 1), this.filter(function (e) {
                            return !t(e)
                        })
                    },K.prototype.slice = function (t, e) {
                        t = null == t ? 0 : +t || 0;
                        var n = this;
                        return n.__filtered__ && (t > 0 || e < 0) ? new K(n) : (t < 0 ? n = n.takeRight(-t) : t && (n = n.drop(t)), e !== R && (e = +e || 0, n = e < 0 ? n.dropRight(-e) : n.take(e - t)), n)
                    },K.prototype.takeRightWhile = function (t, e) {
                        return this.reverse().takeWhile(t, e).reverse()
                    },K.prototype.toArray = function () {
                        return this.take(Sa)
                    },Le(K.prototype, function (t, n) {
                        var r = /^(?:filter|map|reject)|While$/.test(n), i = /^(?:first|last)$/.test(n),
                            o = e[i ? "take" + ("last" == n ? "Right" : "") : n];
                        o && (e.prototype[n] = function () {
                            var e = i ? [1] : arguments, n = this.__chain__, a = this.__wrapped__,
                                s = !!this.__actions__.length, c = a instanceof K, u = e[0], l = c || Os(a);
                            l && r && "function" == typeof u && 1 != u.length && (c = l = !1);
                            var f = function (t) {
                                return i && n ? o(t, 1)[0] : o.apply(R, ue([t], e))
                            }, h = {func: Vr, args: [f], thisArg: R}, p = c && !s;
                            if (i && !n) return p ? (a = a.clone(), a.__actions__.push(h), t.call(a)) : o.call(R, this.value())[0];
                            if (!i && l) {
                                a = p ? a : new K(this);
                                var d = t.apply(a, e);
                                return d.__actions__.push(h), new _(d, n)
                            }
                            return this.thru(f)
                        })
                    }),ee(["join", "pop", "push", "replace", "shift", "sort", "splice", "split", "unshift"], function (t) {
                        var n = (/^(?:replace|split)$/.test(t) ? Jo : Ko)[t],
                            r = /^(?:push|sort|unshift)$/.test(t) ? "tap" : "thru",
                            i = /^(?:join|pop|replace|shift)$/.test(t);
                        e.prototype[t] = function () {
                            var t = arguments;
                            return i && !this.__chain__ ? n.apply(this.value(), t) : this[r](function (e) {
                                return n.apply(e, t)
                            })
                        }
                    }),Le(K.prototype, function (t, n) {
                        var r = e[n];
                        if (r) {
                            var i = r.name, o = Fa[i] || (Fa[i] = []);
                            o.push({name: n, func: r})
                        }
                    }),Fa[An(R, S).name] = [{
                        name: "wrapper",
                        func: R
                    }],K.prototype.clone = et,K.prototype.reverse = rt,K.prototype.value = Gt,e.prototype.chain = Gr,e.prototype.commit = Xr,e.prototype.concat = es,e.prototype.plant = Yr,e.prototype.reverse = qr,e.prototype.toString = Wr,e.prototype.run = e.prototype.toJSON = e.prototype.valueOf = e.prototype.value = Zr,e.prototype.collect = e.prototype.map,e.prototype.head = e.prototype.first,e.prototype.select = e.prototype.filter,e.prototype.tail = e.prototype.rest,e
                }

                var R, C = "3.10.1", M = 1, S = 2, O = 4, P = 8, L = 16, A = 32, k = 64, F = 128, j = 256, D = 30,
                    H = "...", N = 150, I = 16, U = 200, z = 1, B = 2, V = "Expected a function",
                    G = "__lodash_placeholder__", X = "[object Arguments]", Y = "[object Array]",
                    q = "[object Boolean]", W = "[object Date]", Z = "[object Error]", $ = "[object Function]",
                    K = "[object Map]", Q = "[object Number]", J = "[object Object]", tt = "[object RegExp]",
                    et = "[object Set]", nt = "[object String]", rt = "[object WeakMap]", it = "[object ArrayBuffer]",
                    ot = "[object Float32Array]", at = "[object Float64Array]", st = "[object Int8Array]",
                    ct = "[object Int16Array]", ut = "[object Int32Array]", lt = "[object Uint8Array]",
                    ft = "[object Uint8ClampedArray]", ht = "[object Uint16Array]", pt = "[object Uint32Array]",
                    dt = /\b__p \+= '';/g, vt = /\b(__p \+=) '' \+/g, mt = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
                    gt = /&(?:amp|lt|gt|quot|#39|#96);/g, _t = /[&<>"'`]/g, yt = RegExp(gt.source),
                    bt = RegExp(_t.source), wt = /<%-([\s\S]+?)%>/g, xt = /<%([\s\S]+?)%>/g, Et = /<%=([\s\S]+?)%>/g,
                    Tt = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/, Rt = /^\w*$/,
                    Ct = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,
                    Mt = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,
                    St = RegExp(Mt.source), Ot = /[\u0300-\u036f\ufe20-\ufe23]/g, Pt = /\\(\\)?/g,
                    Lt = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, At = /\w*$/, kt = /^0[xX]/,
                    Ft = /^\[object .+?Constructor\]$/, jt = /^\d+$/, Dt = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g,
                    Ht = /($^)/, Nt = /['\n\r\u2028\u2029\\]/g, It = function () {
                        var t = "[A-Z\\xc0-\\xd6\\xd8-\\xde]", e = "[a-z\\xdf-\\xf6\\xf8-\\xff]+";
                        return RegExp(t + "+(?=" + t + e + ")|" + t + "?" + e + "|" + t + "+|[0-9]+", "g")
                    }(),
                    Ut = ["Array", "ArrayBuffer", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Math", "Number", "Object", "RegExp", "Set", "String", "_", "clearTimeout", "isFinite", "parseFloat", "parseInt", "setTimeout", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap"],
                    zt = -1, Bt = {};
                Bt[ot] = Bt[at] = Bt[st] = Bt[ct] = Bt[ut] = Bt[lt] = Bt[ft] = Bt[ht] = Bt[pt] = !0, Bt[X] = Bt[Y] = Bt[it] = Bt[q] = Bt[W] = Bt[Z] = Bt[$] = Bt[K] = Bt[Q] = Bt[J] = Bt[tt] = Bt[et] = Bt[nt] = Bt[rt] = !1;
                var Vt = {};
                Vt[X] = Vt[Y] = Vt[it] = Vt[q] = Vt[W] = Vt[ot] = Vt[at] = Vt[st] = Vt[ct] = Vt[ut] = Vt[Q] = Vt[J] = Vt[tt] = Vt[nt] = Vt[lt] = Vt[ft] = Vt[ht] = Vt[pt] = !0, Vt[Z] = Vt[$] = Vt[K] = Vt[et] = Vt[rt] = !1;
                var Gt = {
                        "À": "A",
                        "Á": "A",
                        "Â": "A",
                        "Ã": "A",
                        "Ä": "A",
                        "Å": "A",
                        "à": "a",
                        "á": "a",
                        "â": "a",
                        "ã": "a",
                        "ä": "a",
                        "å": "a",
                        "Ç": "C",
                        "ç": "c",
                        "Ð": "D",
                        "ð": "d",
                        "È": "E",
                        "É": "E",
                        "Ê": "E",
                        "Ë": "E",
                        "è": "e",
                        "é": "e",
                        "ê": "e",
                        "ë": "e",
                        "Ì": "I",
                        "Í": "I",
                        "Î": "I",
                        "Ï": "I",
                        "ì": "i",
                        "í": "i",
                        "î": "i",
                        "ï": "i",
                        "Ñ": "N",
                        "ñ": "n",
                        "Ò": "O",
                        "Ó": "O",
                        "Ô": "O",
                        "Õ": "O",
                        "Ö": "O",
                        "Ø": "O",
                        "ò": "o",
                        "ó": "o",
                        "ô": "o",
                        "õ": "o",
                        "ö": "o",
                        "ø": "o",
                        "Ù": "U",
                        "Ú": "U",
                        "Û": "U",
                        "Ü": "U",
                        "ù": "u",
                        "ú": "u",
                        "û": "u",
                        "ü": "u",
                        "Ý": "Y",
                        "ý": "y",
                        "ÿ": "y",
                        "Æ": "Ae",
                        "æ": "ae",
                        "Þ": "Th",
                        "þ": "th",
                        "ß": "ss"
                    }, Xt = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;"},
                    Yt = {"&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&#96;": "`"},
                    qt = {"function": !0, object: !0}, Wt = {
                        0: "x30",
                        1: "x31",
                        2: "x32",
                        3: "x33",
                        4: "x34",
                        5: "x35",
                        6: "x36",
                        7: "x37",
                        8: "x38",
                        9: "x39",
                        A: "x41",
                        B: "x42",
                        C: "x43",
                        D: "x44",
                        E: "x45",
                        F: "x46",
                        a: "x61",
                        b: "x62",
                        c: "x63",
                        d: "x64",
                        e: "x65",
                        f: "x66",
                        n: "x6e",
                        r: "x72",
                        t: "x74",
                        u: "x75",
                        v: "x76",
                        x: "x78"
                    }, Zt = {"\\": "\\", "'": "'", "\n": "n", "\r": "r", "\u2028": "u2028", "\u2029": "u2029"},
                    $t = qt[typeof n] && n && !n.nodeType && n, Kt = qt[typeof e] && e && !e.nodeType && e,
                    Qt = $t && Kt && "object" == typeof t && t && t.Object && t,
                    Jt = qt[typeof self] && self && self.Object && self,
                    te = qt[typeof window] && window && window.Object && window, ee = Kt && Kt.exports === $t && $t,
                    ne = Qt || te !== (this && this.window) && te || Jt || this, re = T();
                "function" == typeof define && "object" == typeof define.amd && define.amd ? (ne._ = re, define(function () {
                    return re
                })) : $t && Kt ? ee ? (Kt.exports = re)._ = re : $t._ = re : ne._ = re
            }).call(this)
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    35: [function (t, e, n) {
        var r = t("36"), i = t("38"), o = t("41"), a = t("40"), s = t("39"), c = t("37"), u = t("42");
        u.alea = r, u.xor128 = i, u.xorwow = o, u.xorshift7 = a, u.xor4096 = s, u.tychei = c, e.exports = u
    }, {36: 36, 37: 37, 38: 38, 39: 39, 40: 40, 41: 41, 42: 42}],
    36: [function (t, e, n) {
        !function (t, e, n) {
            function r(t) {
                var e = this, n = a();
                e.next = function () {
                    var t = 2091639 * e.s0 + 2.3283064365386963e-10 * e.c;
                    return e.s0 = e.s1, e.s1 = e.s2, e.s2 = t - (e.c = 0 | t)
                }, e.c = 1, e.s0 = n(" "), e.s1 = n(" "), e.s2 = n(" "), e.s0 -= n(t), e.s0 < 0 && (e.s0 += 1), e.s1 -= n(t), e.s1 < 0 && (e.s1 += 1), e.s2 -= n(t), e.s2 < 0 && (e.s2 += 1), n = null
            }

            function i(t, e) {
                return e.c = t.c, e.s0 = t.s0, e.s1 = t.s1, e.s2 = t.s2, e
            }

            function o(t, e) {
                var n = new r(t), o = e && e.state, a = n.next;
                return a.int32 = function () {
                    return 4294967296 * n.next() | 0
                }, a["double"] = function () {
                    return a() + 1.1102230246251565e-16 * (2097152 * a() | 0)
                }, a.quick = a, o && ("object" == typeof o && i(o, n), a.state = function () {
                    return i(n, {})
                }), a
            }

            function a() {
                var t = 4022871197, e = function (e) {
                    e = e.toString();
                    for (var n = 0; n < e.length; n++) {
                        t += e.charCodeAt(n);
                        var r = .02519603282416938 * t;
                        t = r >>> 0, r -= t, r *= t, t = r >>> 0, r -= t, t += 4294967296 * r
                    }
                    return 2.3283064365386963e-10 * (t >>> 0)
                };
                return e
            }

            e && e.exports ? e.exports = o : n && n.amd ? n(function () {
                return o
            }) : this.alea = o
        }(this, "object" == typeof e && e, "function" == typeof define && define)
    }, {}],
    37: [function (t, e, n) {
        !function (t, e, n) {
            function r(t) {
                var e = this, n = "";
                e.next = function () {
                    var t = e.b, n = e.c, r = e.d, i = e.a;
                    return t = t << 25 ^ t >>> 7 ^ n, n = n - r | 0, r = r << 24 ^ r >>> 8 ^ i, i = i - t | 0, e.b = t = t << 20 ^ t >>> 12 ^ n, e.c = n = n - r | 0, e.d = r << 16 ^ n >>> 16 ^ i, e.a = i - t | 0
                }, e.a = 0, e.b = 0, e.c = -1640531527, e.d = 1367130551, t === Math.floor(t) ? (e.a = t / 4294967296 | 0, e.b = 0 | t) : n += t;
                for (var r = 0; r < n.length + 20; r++) e.b ^= 0 | n.charCodeAt(r), e.next()
            }

            function i(t, e) {
                return e.a = t.a, e.b = t.b, e.c = t.c, e.d = t.d, e
            }

            function o(t, e) {
                var n = new r(t), o = e && e.state, a = function () {
                    return (n.next() >>> 0) / 4294967296
                };
                return a["double"] = function () {
                    do var t = n.next() >>> 11, e = (n.next() >>> 0) / 4294967296,
                        r = (t + e) / (1 << 21); while (0 === r);
                    return r
                }, a.int32 = n.next, a.quick = a, o && ("object" == typeof o && i(o, n), a.state = function () {
                    return i(n, {})
                }), a
            }

            e && e.exports ? e.exports = o : n && n.amd ? n(function () {
                return o
            }) : this.tychei = o
        }(this, "object" == typeof e && e, "function" == typeof define && define)
    }, {}],
    38: [function (t, e, n) {
        !function (t, e, n) {
            function r(t) {
                var e = this, n = "";
                e.x = 0, e.y = 0, e.z = 0, e.w = 0, e.next = function () {
                    var t = e.x ^ e.x << 11;
                    return e.x = e.y, e.y = e.z, e.z = e.w, e.w ^= e.w >>> 19 ^ t ^ t >>> 8
                }, t === (0 | t) ? e.x = t : n += t;
                for (var r = 0; r < n.length + 64; r++) e.x ^= 0 | n.charCodeAt(r), e.next()
            }

            function i(t, e) {
                return e.x = t.x, e.y = t.y, e.z = t.z, e.w = t.w, e
            }

            function o(t, e) {
                var n = new r(t), o = e && e.state, a = function () {
                    return (n.next() >>> 0) / 4294967296
                };
                return a["double"] = function () {
                    do var t = n.next() >>> 11, e = (n.next() >>> 0) / 4294967296,
                        r = (t + e) / (1 << 21); while (0 === r);
                    return r
                }, a.int32 = n.next, a.quick = a, o && ("object" == typeof o && i(o, n), a.state = function () {
                    return i(n, {})
                }), a
            }

            e && e.exports ? e.exports = o : n && n.amd ? n(function () {
                return o
            }) : this.xor128 = o
        }(this, "object" == typeof e && e, "function" == typeof define && define)
    }, {}],
    39: [function (t, e, n) {
        !function (t, e, n) {
            function r(t) {
                function e(t, e) {
                    var n, r, i, o, a, s = [], c = 128;
                    for (e === (0 | e) ? (r = e, e = null) : (e += "\0", r = 0, c = Math.max(c, e.length)), i = 0, o = -32; o < c; ++o) e && (r ^= e.charCodeAt((o + 32) % e.length)), 0 === o && (a = r), r ^= r << 10, r ^= r >>> 15, r ^= r << 4, r ^= r >>> 13, o >= 0 && (a = a + 1640531527 | 0, n = s[127 & o] ^= r + a, i = 0 == n ? i + 1 : 0);
                    for (i >= 128 && (s[127 & (e && e.length || 0)] = -1), i = 127, o = 512; o > 0; --o) r = s[i + 34 & 127], n = s[i = i + 1 & 127], r ^= r << 13, n ^= n << 17, r ^= r >>> 15, n ^= n >>> 12, s[i] = r ^ n;
                    t.w = a, t.X = s, t.i = i
                }

                var n = this;
                n.next = function () {
                    var t, e, r = n.w, i = n.X, o = n.i;
                    return n.w = r = r + 1640531527 | 0, e = i[o + 34 & 127], t = i[o = o + 1 & 127], e ^= e << 13, t ^= t << 17, e ^= e >>> 15, t ^= t >>> 12, e = i[o] = e ^ t, n.i = o, e + (r ^ r >>> 16) | 0
                }, e(n, t)
            }

            function i(t, e) {
                return e.i = t.i, e.w = t.w, e.X = t.X.slice(), e
            }

            function o(t, e) {
                null == t && (t = +new Date);
                var n = new r(t), o = e && e.state, a = function () {
                    return (n.next() >>> 0) / 4294967296
                };
                return a["double"] = function () {
                    do var t = n.next() >>> 11, e = (n.next() >>> 0) / 4294967296,
                        r = (t + e) / (1 << 21); while (0 === r);
                    return r
                }, a.int32 = n.next, a.quick = a, o && (o.X && i(o, n), a.state = function () {
                    return i(n, {})
                }), a
            }

            e && e.exports ? e.exports = o : n && n.amd ? n(function () {
                return o
            }) : this.xor4096 = o
        }(this, "object" == typeof e && e, "function" == typeof define && define)
    }, {}],
    40: [function (t, e, n) {
        !function (t, e, n) {
            function r(t) {
                function e(t, e) {
                    var n, r, i = [];
                    if (e === (0 | e)) r = i[0] = e; else for (e = "" + e, n = 0; n < e.length; ++n) i[7 & n] = i[7 & n] << 15 ^ e.charCodeAt(n) + i[n + 1 & 7] << 13;
                    for (; i.length < 8;) i.push(0);
                    for (n = 0; n < 8 && 0 === i[n]; ++n) ;
                    for (r = 8 == n ? i[7] = -1 : i[n], t.x = i, t.i = 0, n = 256; n > 0; --n) t.next()
                }

                var n = this;
                n.next = function () {
                    var t, e, r = n.x, i = n.i;
                    return t = r[i], t ^= t >>> 7, e = t ^ t << 24, t = r[i + 1 & 7], e ^= t ^ t >>> 10, t = r[i + 3 & 7], e ^= t ^ t >>> 3, t = r[i + 4 & 7], e ^= t ^ t << 7, t = r[i + 7 & 7], t ^= t << 13, e ^= t ^ t << 9, r[i] = e, n.i = i + 1 & 7, e
                }, e(n, t)
            }

            function i(t, e) {
                return e.x = t.x.slice(), e.i = t.i, e
            }

            function o(t, e) {
                null == t && (t = +new Date);
                var n = new r(t), o = e && e.state, a = function () {
                    return (n.next() >>> 0) / 4294967296
                };
                return a["double"] = function () {
                    do var t = n.next() >>> 11, e = (n.next() >>> 0) / 4294967296,
                        r = (t + e) / (1 << 21); while (0 === r);
                    return r
                }, a.int32 = n.next, a.quick = a, o && (o.x && i(o, n), a.state = function () {
                    return i(n, {})
                }), a
            }

            e && e.exports ? e.exports = o : n && n.amd ? n(function () {
                return o
            }) : this.xorshift7 = o
        }(this, "object" == typeof e && e, "function" == typeof define && define)
    }, {}],
    41: [function (t, e, n) {
        !function (t, e, n) {
            function r(t) {
                var e = this, n = "";
                e.next = function () {
                    var t = e.x ^ e.x >>> 2;
                    return e.x = e.y, e.y = e.z, e.z = e.w, e.w = e.v, (e.d = e.d + 362437 | 0) + (e.v = e.v ^ e.v << 4 ^ (t ^ t << 1)) | 0
                }, e.x = 0, e.y = 0, e.z = 0, e.w = 0, e.v = 0, t === (0 | t) ? e.x = t : n += t;
                for (var r = 0; r < n.length + 64; r++) e.x ^= 0 | n.charCodeAt(r), r == n.length && (e.d = e.x << 10 ^ e.x >>> 4), e.next()
            }

            function i(t, e) {
                return e.x = t.x, e.y = t.y, e.z = t.z, e.w = t.w, e.v = t.v, e.d = t.d, e
            }

            function o(t, e) {
                var n = new r(t), o = e && e.state, a = function () {
                    return (n.next() >>> 0) / 4294967296
                };
                return a["double"] = function () {
                    do var t = n.next() >>> 11, e = (n.next() >>> 0) / 4294967296,
                        r = (t + e) / (1 << 21); while (0 === r);
                    return r
                }, a.int32 = n.next, a.quick = a, o && ("object" == typeof o && i(o, n), a.state = function () {
                    return i(n, {})
                }), a
            }

            e && e.exports ? e.exports = o : n && n.amd ? n(function () {
                return o
            }) : this.xorwow = o
        }(this, "object" == typeof e && e, "function" == typeof define && define)
    }, {}],
    42: [function (t, e, n) {
        !function (n, r) {
            function i(t, e, i) {
                var f = [];
                e = 1 == e ? {entropy: !0} : e || {};
                var h = c(s(e.entropy ? [t, l(n)] : null == t ? u() : t, 3), f), v = new o(f), b = function () {
                    for (var t = v.g(d), e = g, n = 0; t < _;) t = (t + n) * p, e *= p, n = v.g(1);
                    for (; t >= y;) t /= 2, e /= 2, n >>>= 1;
                    return (t + n) / e
                };
                return b.int32 = function () {
                    return 0 | v.g(4)
                }, b.quick = function () {
                    return v.g(4) / 4294967296
                }, b["double"] = b, c(l(v.S), n), (e.pass || i || function (t, e, n, i) {
                    return i && (i.S && a(i, v), t.state = function () {
                        return a(v, {})
                    }), n ? (r[m] = t, e) : t
                })(b, h, "global" in e ? e.global : this == r, e.state)
            }

            function o(t) {
                var e, n = t.length, r = this, i = 0, o = r.i = r.j = 0, a = r.S = [];
                for (n || (t = [n++]); i < p;) a[i] = i++;
                for (i = 0; i < p; i++) a[i] = a[o = b & o + t[i % n] + (e = a[i])], a[o] = e;
                (r.g = function (t) {
                    for (var e, n = 0, i = r.i, o = r.j, a = r.S; t--;) e = a[i = b & i + 1], n = n * p + a[b & (a[i] = a[o = b & o + e]) + (a[o] = e)];
                    return r.i = i, r.j = o, n
                })(p)
            }

            function a(t, e) {
                return e.i = t.i, e.j = t.j, e.S = t.S.slice(), e
            }

            function s(t, e) {
                var n, r = [], i = typeof t;
                if (e && "object" == i) for (n in t) try {
                    r.push(s(t[n], e - 1))
                } catch (o) {
                }
                return r.length ? r : "string" == i ? t : t + "\0"
            }

            function c(t, e) {
                for (var n, r = t + "", i = 0; i < r.length;) e[b & i] = b & (n ^= 19 * e[b & i]) + r.charCodeAt(i++);
                return l(e)
            }

            function u() {
                try {
                    var t;
                    return f && (t = f.randomBytes) ? t = t(p) : (t = new Uint8Array(p), (h.crypto || h.msCrypto).getRandomValues(t)), l(t)
                } catch (e) {
                    var r = h.navigator, i = r && r.plugins;
                    return [+new Date, h, i, h.screen, l(n)]
                }
            }

            function l(t) {
                return String.fromCharCode.apply(0, t)
            }

            var f, h = this, p = 256, d = 6, v = 52, m = "random", g = r.pow(p, d), _ = r.pow(2, v), y = 2 * _,
                b = p - 1;
            if (r["seed" + m] = i, c(r.random(), n), "object" == typeof e && e.exports) {
                e.exports = i;
                try {
                    f = t("25")
                } catch (w) {
                }
            } else "function" == typeof define && define.amd && define(function () {
                return i
            })
        }([], Math)
    }, {25: 25}],
    43: [function (t, e, n) {
        var r = t("1"), i = (t("8"), t("50")), o = (t("45"), t("56"), t("58")), a = (t("54"), t("48")), s = t("47"),
            c = t("52"), u = t("57"), l = t("60"), f = function (t) {
                r.call(this, t), this.initCamera(), this.gridCoords = new THREE.Vector2, this.cameraOffset = new THREE.Vector2, this.scene = new THREE.Scene
            };
        f.inherit(r, {
            start: function (t) {
                var e = t.getObjectByName("blocks").children, n = t.getObjectByName("lanes").children,
                    o = t.getObjectByName("intersections").children, l = t.getObjectByName("cars").children,
                    f = t.getObjectByName("clouds").children;
                this.table = new a(e, n, o, l, f), this.chunkScene = new s, this.scene.add(this.chunkScene), this.inputManager = new c(document.querySelector("canvas")), this.controls = new u(this.inputManager, this.chunkScene, this.camera), this.renderer.setClearColor(i.FOG_COLOR), this.initDirLight(), this.initVignetting(), this.controls.on("move", function (t, e) {
                    this.gridCoords.x += t, this.gridCoords.y += e, this.refreshChunkScene()
                }, this), this.refreshChunkScene(), this.inputManager.on("startdrag", function () {
                    $("body").addClass("grabbing")
                }), this.inputManager.on("enddrag", function () {
                    $("body").removeClass("grabbing")
                }), this.inputManager.on("mousewheel", function (t) {
                    this.camera.updateHeight(t)
                }, this), this.inputManager.on("pinchstart", function () {
                    this._lastPinchScale = 1, this.controls.enabled = !1
                }, this), this.inputManager.on("pinchend", function () {
                    this.controls.enabled = !0
                }, this), this.inputManager.on("pinchchange", function (t) {
                    var e = 10, n = (t - this._lastPinchScale) * e;
                    this.camera.updateHeight(n), this._lastPinchScale = t
                }, this), r.prototype.start.call(this)
            }, initDirLight: function () {
                var t = new THREE.DirectionalLight(16774618, 1.25);
                t.position.set(100, 150, -40), this.chunkScene.add(t), this.chunkScene.add(t.target), this.dirLight = t, t.castShadow = !0, t.shadow.radius = 1, t.shadow.bias = -.001, t.shadow.mapSize.width = i.SHADOWMAP_RESOLUTION, t.shadow.mapSize.height = i.SHADOWMAP_RESOLUTION, t.shadow.camera.near = 50, t.shadow.camera.far = 300, this._resizeShadowMapFrustum(window.innerWidth, window.innerHeight), this.renderer.shadowMap.enabled = !0, this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
            }, initVignetting: function () {
                this.vignetting = new l
            }, setSize: function (t, e) {
                r.prototype.setSize.call(this, t, e), this.dirLight && this._resizeShadowMapFrustum(t, e)
            }, initCamera: function () {
                var t = 120;
                Math.tan(i.CAMERA_ANGLE) * Math.sqrt(2 * Math.pow(t, 2));
                this.camera = new o(30, window.innerWidth / window.innerHeight, 10, 400), this.camera.position.set(80, 140, 80), this.camera.lookAt(new THREE.Vector3), this.camera.position.y = 200
            }, refreshChunkScene: function () {
                this.chunkScene.forEachChunk(function (t, e, n) {
                    var r = this.gridCoords.x + e, i = this.gridCoords.y + n, o = this.table.getChunkData(r, i);
                    t.remove(t.getObjectByName("chunk")), t.add(o.node)
                }.bind(this))
            }, update: function (t) {
                this.controls.update(), this.table.update(t), this.camera.update(), r.prototype.update.call(this, t)
            }, render: function (t) {
                var e = 0, n = function () {
                    this.config.logCalls && (e += this.renderer.info.render.calls)
                }.bind(this);
                this.renderer.clear(), this.renderScene(this.scene, this.camera), n(), this.vignetting && (this.vignetting.render(this.renderer), n()), this.config.logCalls && (this.dcCounter.textContent = e + " DC")
            }, _resizeShadowMapFrustum: function (t, e) {
                var n = 1.25, r = Math.max(t / e, n), i = 75 * r;
                this.dirLight.shadow.camera.left = .9 * -i, this.dirLight.shadow.camera.right = 1.3 * i, this.dirLight.shadow.camera.top = i, this.dirLight.shadow.camera.bottom = -i, this.dirLight.shadow.camera.updateProjectionMatrix()
            }
        }), e.exports = f
    }, {1: 1, 45: 45, 47: 47, 48: 48, 50: 50, 52: 52, 54: 54, 56: 56, 57: 57, 58: 58, 60: 60, 8: 8}],
    44: [function (t, e, n) {
        e.exports = {
            "basic.fs": "#ifdef USE_MAP\n  varying vec2 vUv;\n\n  uniform sampler2D map;\n#endif\n\nuniform vec3 diffuse;\nuniform float opacity;\n\nvoid main() {\n  gl_FragColor = vec4(diffuse, opacity);\n\n  #ifdef USE_MAP\n    vec4 mapTexel = texture2D(map, vUv, -2.0);\n\n    gl_FragColor *= mapTexel;\n  #endif\n}",
            "basic.vs": "#ifdef USE_MAP\n  varying vec2 vUv;\n  uniform vec4 offsetRepeat;\n#endif\n\nvoid main() {\n  #ifdef USE_MAP\n    vUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n  #endif\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}",
            "pbr.fs": "#define MOBILE\n#define LUV\n\nuniform float uAOPBRFactor;\nuniform float uAlbedoPBRFactor;\nuniform float uEnvironmentExposure;\nuniform float uGlossinessPBRFactor;\nuniform float uMetalnessPBRFactor;\nuniform float uNormalMapFactor;\nuniform float uOpacityFactor;\nuniform float uSpecularF0Factor;\n\nuniform int uMode;\nuniform vec3 uColor;\nuniform float uAlphaTest;\n\nuniform int uFlipY;\nuniform int uOccludeSpecular;\nuniform int uOutputLinear;\n\nuniform sampler2D sTextureAlbedoMap;\nuniform sampler2D sTextureAlbedoMap2;\nuniform sampler2D sTextureNormalMap;\nuniform sampler2D sTextureNormalMap2;\nuniform sampler2D sTextureAOMap;\nuniform sampler2D sTextureAOMap2;\nuniform sampler2D sTextureEmissiveMap;\nuniform sampler2D sTexturePBRMaps;\n\nuniform vec2 uTextureEnvironmentSpecularPBRLodRange;\nuniform vec2 uTextureEnvironmentSpecularPBRTextureSize;\nuniform vec3 uDiffuseSPH[9];\nuniform mat4 uEnvironmentTransform;\n\n// varying vec3 FragPosition;\nvarying vec3 FragNormal;\nvarying vec4 FragTangent;\nvarying vec4 FragEyeVector;\nvarying vec2 vUv;\n\n#if defined(USE_ALBEDO2) || defined(USE_NORMALMAP2) || defined(USE_AOMAP2)\nvarying vec2 vUvDetail;\n#endif\n\n#ifdef USE_LIGHTMAP\n  uniform sampler2D sTextureLightMap;\n  uniform sampler2D sTextureLightMapAlpha;\n#endif\n\nvarying vec2 vUv2;\n\n#ifdef USE_FOG\n\n  uniform vec3 fogColor;\n  varying float fogDepth;\n  uniform float fogNear;\n  uniform float fogFar;\n\n#endif\n\n\n// THREE.js common.glsl\n#define PI 3.14159265359\n#define PI2 6.28318530718\n#define PI_HALF 1.5707963267949\n#define RECIPROCAL_PI 0.31830988618\n#define RECIPROCAL_PI2 0.15915494\n#define LOG2 1.442695\n#define EPSILON 1e-6\n\n#define saturate(a) clamp( a, 0.0, 1.0 )\n#define whiteCompliment(a) ( 1.0 - saturate( a ) )\n\nfloat pow2( const in float x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }\n// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.\n// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/\nhighp float rand( const in vec2 uv ) {\n  const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n  highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n  return fract(sin(sn) * c);\n}\n\nstruct IncidentLight {\n  vec3 color;\n  vec3 direction;\n  bool visible;\n};\n\nstruct ReflectedLight {\n  vec3 directDiffuse;\n  vec3 directSpecular;\n  vec3 indirectDiffuse;\n  vec3 indirectSpecular;\n};\n\nstruct GeometricContext {\n  vec3 position;\n  vec3 normal;\n  vec3 viewDir;\n};\n\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\n  return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n\n}\n\n// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations\nvec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {\n\n  return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );\n\n}\n\nvec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\n  float distance = dot( planeNormal, point - pointOnPlane );\n\n  return - distance * planeNormal + point;\n\n}\n\nfloat sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\n  return sign( dot( point - pointOnPlane, planeNormal ) );\n\n}\n\nvec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\n  return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;\n\n}\n\nmat3 transposeMat3( const in mat3 m ) {\n\n  mat3 tmp;\n\n  tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );\n  tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );\n  tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );\n\n  return tmp;\n\n}\n\n// https://en.wikipedia.org/wiki/Relative_luminance\nfloat linearToRelativeLuminance( const in vec3 color ) {\n\n  vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );\n\n  return dot( weights, color.rgb );\n\n}\n\n// end common.glsl\n\n// THREE.js packing\n\nvec3 packNormalToRGB( const in vec3 normal ) {\n  return normalize( normal ) * 0.5 + 0.5;\n}\n\nvec3 unpackRGBToNormal( const in vec3 rgb ) {\n  return 2.0 * rgb.xyz - 1.0;\n}\n\nconst float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)\nconst float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)\n\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256.,  256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\n\nconst float ShiftRight8 = 1. / 256.;\n\nvec4 packDepthToRGBA( const in float v ) {\n  vec4 r = vec4( fract( v * PackFactors ), v );\n  r.yzw -= r.xyz * ShiftRight8; // tidy overflow\n  return r * PackUpscale;\n}\n\nfloat unpackRGBAToDepth( const in vec4 v ) {\n  return dot( v, UnpackFactors );\n}\n\n// NOTE: viewZ/eyeZ is < 0 when in front of the camera per OpenGL conventions\n\nfloat viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {\n  return ( viewZ + near ) / ( near - far );\n}\nfloat orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {\n  return linearClipZ * ( near - far ) - near;\n}\n\nfloat viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n  return (( near + viewZ ) * far ) / (( far - near ) * viewZ );\n}\nfloat perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {\n  return ( near * far ) / ( ( far - near ) * invClipZ - far );\n}\n\n// end packing\n\nfloat blendOverlay(float base, float blend) {\n  return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));\n}\n\nvec3 blendOverlay(vec3 base, vec3 blend) {\n  return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));\n}\n\nvec3 blendOverlay(vec3 base, vec3 blend, float opacity) {\n  return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// references\n// https://www.khronos.org/registry/gles/extensions/EXT/EXT_sRGB.txt\n\n// approximation\n// http://chilliant.blogspot.fr/2012/08/srgb-approximations-for-hlsl.html\nfloat linearTosRGB(const in float c) {\n  if (c >= 1.0) return 1.0;\n  float S1 = sqrt(c);\n  float S2 = sqrt(S1);\n  float S3 = sqrt(S2);\n  return 0.662002687 * S1 + 0.684122060 * S2 - 0.323583601 * S3 - 0.0225411470 * c;\n}\n\nvec3 linearTosRGB(const in vec3 c) {\n  // vec3 cm = min(c, 1.0);\n  vec3 cm = c;\n  vec3 S1 = sqrt(cm);\n  vec3 S2 = sqrt(S1);\n  vec3 S3 = sqrt(S2);\n  return 0.662002687 * S1 + 0.684122060 * S2 - 0.323583601 * S3 - 0.0225411470 * cm;\n}\n\nvec4 linearTosRGB(const in vec4 c) {\n  vec3 cm = min(c.rgb, 1.0);\n  vec3 S1 = sqrt(cm);\n  vec3 S2 = sqrt(S1);\n  vec3 S3 = sqrt(S2);\n  return vec4(0.662002687 * S1 + 0.684122060 * S2 - 0.323583601 * S3 - 0.0225411470 * cm, c.a);\n}\n\nfloat sRGBToLinear(const in float c) {\n  return c * (c * (c * 0.305306011 + 0.682171111) + 0.012522878);\n}\n\nvec3 sRGBToLinear(const in vec3 c) {\n  return c * (c * (c * 0.305306011 + 0.682171111) + 0.012522878);\n}\n\nvec4 sRGBToLinear(const in vec4 c) {\n  return vec4(c.rgb * (c.rgb * (c.rgb * 0.305306011 + 0.682171111) + 0.012522878), c.a);\n}\n\n//http://graphicrants.blogspot.fr/2009/04/rgbm-color-encoding.html\nvec3 RGBMToRGB(const in vec4 rgba) {\n  const float maxRange = 8.0;\n  return rgba.rgb * maxRange * rgba.a;\n}\n\nconst mat3 LUVInverse = mat3(6.0013,    -2.700,   -1.7995,\n                -1.332,    3.1029,   -5.7720,\n                0.3007,    -1.088,    5.6268);\n\nvec3 LUVToRGB(const in vec4 vLogLuv) {\n  float Le = vLogLuv.z * 255.0 + vLogLuv.w;\n  vec3 Xp_Y_XYZp;\n  Xp_Y_XYZp.y = exp2((Le - 127.0) / 2.0);\n  Xp_Y_XYZp.z = Xp_Y_XYZp.y / vLogLuv.y;\n  Xp_Y_XYZp.x = vLogLuv.x * Xp_Y_XYZp.z;\n  vec3 vRGB = LUVInverse * Xp_Y_XYZp;\n  return max(vRGB, 0.0);\n}\n\n// http://graphicrants.blogspot.fr/2009/04/rgbm-color-encoding.html\nvec4 encodeRGBM(const in vec3 col, const in float range) {\n  if(range <= 0.0)\n    return vec4(col, 1.0);\n  vec4 rgbm;\n  vec3 color = col / range;\n  rgbm.a = clamp(max(max(color.r, color.g), max(color.b, 1e-6)), 0.0, 1.0);\n  rgbm.a = ceil(rgbm.a * 255.0) / 255.0;\n  rgbm.rgb = color / rgbm.a;\n  return rgbm;\n}\n\nvec3 decodeRGBM(const in vec4 col, const in float range) {\n  if(range <= 0.0)\n    return col.rgb;\n  return range * col.rgb * col.a;\n}\n\nvec3 textureRGB(const in sampler2D texture, const in vec2 uv) {\n  return texture2D(texture, uv.xy).rgb;\n}\n\nvec4 textureRGBA(const in sampler2D texture, const in vec2 uv) {\n  return texture2D(texture, uv.xy).rgba;\n}\n\nfloat textureIntensity(const in sampler2D texture, const in vec2 uv) {\n  return texture2D(texture, uv).r;\n}\n\nfloat textureAlpha(const in sampler2D texture, const in vec2 uv) {\n  return texture2D(texture, uv.xy).a;\n}\n\nfloat adjustSpecular(const in float specular, const in vec3 normal) {\n  // Based on The Order : 1886 SIGGRAPH course notes implementation (page 21 notes)\n  float normalLen = length(normal);\n  if (normalLen < 1.0) {\n    float normalLen2 = normalLen * normalLen;\n    float kappa = (3.0 * normalLen -  normalLen2 * normalLen)/(1.0 - normalLen2);\n    // http://www.frostbite.com/2014/11/moving-frostbite-to-pbr/\n    // page 91 : they use 0.5/kappa instead\n    return 1.0-min(1.0, sqrt((1.0-specular) * (1.0-specular) + 1.0/kappa));\n  }\n  return specular;\n}\n\nvec3 mtexNspaceTangent(const in vec4 tangent, const in vec3 normal, const in vec3 texnormal) {\n  vec3 tang = vec3(0.0,1.0,0.0);\n  float l = length(tangent.xyz);\n  if (l != 0.0) {\n    //normalize reusing length computations\n    // tang =  normalize(tangent.xyz);\n    tang =  tangent.xyz / l;\n  }\n  vec3 B = tangent.w * normalize(cross(normal, tang));\n  return normalize(texnormal.x*tang + texnormal.y*B + texnormal.z*normal);\n}\n\nvec2 normalMatcap(const in vec3 normal, const in vec3 nm_z) {\n  vec3 nm_x = vec3(-nm_z.z, 0.0, nm_z.x);\n  vec3 nm_y = cross(nm_x, nm_z);\n  return vec2(dot(normal.xz, nm_x.xz), dot(normal, nm_y)) * vec2(0.5)  + vec2(0.5) ; //MADD vector form\n}\n\nvec3 rgbToNormal(const in vec3 texel, const in int flipNormalY) {\n  vec3 rgb = texel * vec3(2.0) + vec3(-1.0); // MADD vec form\n  rgb[1] = flipNormalY == 1 ? -rgb[1] : rgb[1];\n  return rgb;\n}\n\nvec3 bumpMap(const in vec4 tangent, const in vec3 normal, const in vec2 gradient) {\n  vec3 outnormal;\n  float l = length(tangent.xyz);\n  if (l != 0.0) {\n    //normalize reusing length computations\n    // vec3 tang =  normalize(tangent.xyz);\n    vec3 tang =  tangent.xyz / l;\n    vec3 binormal = tangent.w * normalize(cross(normal, tang));\n    outnormal = normal + gradient.x * tang + gradient.y * binormal;\n  }\n  else {\n     outnormal = vec3(normal.x + gradient.x, normal.y + gradient.y, normal.z);\n  }\n  return normalize(outnormal);\n}\n\nfloat specularOcclusion(const in int occlude, const in float ao, const in vec3 N, const in vec3 V) {\n  if(occlude == 0)\n    return 1.0;\n  // Yoshiharu Gotanda's specular occlusion approximation:\n  // cf http://research.tri-ace.com/Data/cedec2011_RealtimePBR_Implementation_e.pptx pg59\n  float d = dot(N, V) + ao;\n  return clamp((d * d) - 1.0 + ao, 0.0, 1.0);\n}\n\nfloat adjustRoughnessNormalMap(const in float roughness, const in vec3 normal) {\n  // Based on The Order : 1886 SIGGRAPH course notes implementation (page 21 notes)\n  float normalLen = length(normal);\n  if (normalLen < 1.0) {\n    float normalLen2 = normalLen * normalLen;\n    float kappa = (3.0 * normalLen -  normalLen2 * normalLen)/(1.0 - normalLen2);\n    // http://www.frostbite.com/2014/11/moving-frostbite-to-pbr/\n    // page 91 : they use 0.5/kappa instead\n    return min(1.0, sqrt(roughness * roughness + 1.0/kappa));\n  }\n  return roughness;\n}\n\nfloat adjustRoughnessGeometry(const in float roughness, const in vec3 normal) {\n  // Geometric Specular Aliasing (slide 43)\n  // http://alex.vlachos.com/graphics/Alex_Vlachos_Advanced_VR_Rendering_GDC2015.pdf\n// #ifdef GL_OES_standard_derivatives\n//     vec3 vDx = dFdx(normal.xyz);\n//     vec3 vDy = dFdy(normal.xyz);\n//     return max(roughness, pow(clamp(max(dot(vDx, vDx), dot(vDy, vDy)), 0.0, 1.0), 0.333));\n// #else\n  return roughness;\n// #endif\n}\n\nmat3 environmentTransformPBR(const in mat4 tr) {\n  // TODO trick from animation matrix transpose?\n  vec3 x = vec3(tr[0][0], tr[1][0], tr[2][0]);\n  vec3 y = vec3(tr[0][1], tr[1][1], tr[2][1]);\n  vec3 z = vec3(tr[0][2], tr[1][2], tr[2][2]);\n  mat3 m = mat3(x, y, z);\n  return m;\n}\n\nvec3 evaluateDiffuseSphericalHarmonics(const in vec3 s[9], const in mat3 envTrans, const in vec3 N) {\n  vec3 n = envTrans * N;\n  // https://github.com/cedricpinson/envtools/blob/master/Cubemap.cpp#L523\n  vec3 result = (s[0]+s[1]*n.y+s[2]*n.z+s[3]*n.x+s[4]*n.y*n.x+s[5]*n.y*n.z+s[6]*(3.0*n.z*n.z-1.0)+s[7]*(n.z*n.x)+s[8]*(n.x*n.x-n.y*n.y));\n  return max(result, vec3(0.0));\n}\n\n// Frostbite, Lagarde paper p67\n// http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf\nfloat linRoughnessToMipmap(const in float roughnessLinear) {\n  return sqrt(roughnessLinear);\n}\n\nvec3 integrateBRDF(const in vec3 specular, const in float r, const in float NoV, const in sampler2D tex) {\n  vec4 rgba = texture2D(tex, vec2(NoV, r));\n  float b = (rgba[3] * 65280.0 + rgba[2] * 255.0);\n  float a = (rgba[1] * 65280.0 + rgba[0] * 255.0);\n  const float div = 1.0/65535.0;\n  return (specular * a + b) * div;\n}\n\n// https://www.unrealengine.com/blog/physically-based-shading-on-mobile\n// TODO should we use somehow specular f0 ?\nvec3 integrateBRDFApprox(const in vec3 specular, const in float roughness, const in float NoV) {\n  const vec4 c0 = vec4(-1, -0.0275, -0.572, 0.022);\n  const vec4 c1 = vec4(1, 0.0425, 1.04, -0.04);\n  vec4 r = roughness * c0 + c1;\n  float a004 = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;\n  vec2 AB = vec2(-1.04, 1.04) * a004 + r.zw;\n  return specular * AB.x + AB.y;\n}\n\nvec3 computeIBLDiffuseUE4(const in vec3 normal, const in vec3 albedo, const in mat3 envTrans, const in vec3 sphHarm[9]) {\n  return albedo * evaluateDiffuseSphericalHarmonics(sphHarm, envTrans, normal);\n}\n\n\n#ifdef CUBEMAP\nvec3 textureCubemapLod(const in samplerCube texture, const in vec3 dir, const in float lod) {\n  vec4 rgba = textureCubeLodEXT(texture, dir, lod);\n#ifdef FLOAT\n  return rgba.rgb;\n#endif\n#ifdef RGBM\n  return RGBMToRGB(rgba);\n#endif\n#ifdef LUV\n  return LUVToRGB(rgba);\n#endif\n}\n\nvec3 textureCubeLodEXTFixed(const in samplerCube texture, const in vec2 size, const in vec3 direction, const in float lodInput, const in float maxLod) {\n  vec3 dir = direction;\n  float lod = min(maxLod, lodInput);\n\n  // http://seblagarde.wordpress.com/2012/06/10/amd-cubemapgen-for-physically-based-rendering/\n  float scale = 1.0 - exp2(lod) / size.x;\n  vec3 absDir = abs(dir);\n  float M = max(max(absDir.x, absDir.y), absDir.z);\n\n  if (absDir.x != M) dir.x *= scale;\n  if (absDir.y != M) dir.y *= scale;\n  if (absDir.z != M) dir.z *= scale;\n\n  return textureCubemapLod(texture, dir, lod);\n}\n\nvec3 prefilterEnvMapCube(const in float rLinear, const in vec3 R, const in samplerCube tex, const in vec2 lodRange, const in vec2 size){\n  float lod = linRoughnessToMipmap(rLinear) * lodRange[1];\n  return textureCubeLodEXTFixed(tex, size, R, lod, lodRange[0]);\n}\n\n#define samplerEnv samplerCube\n#define prefilterEnvMap prefilterEnvMapCube\n\n#else\n#ifdef PANORAMA\nvec2 computeUVForMipmap(const in float level, const in vec2 uvBase, const in float size, const in float maxLOD) {\n  vec2 uv = uvBase;\n  float widthForLevel = exp2(maxLOD - level);\n  float heightForLevel = widthForLevel * 0.5;\n  float widthFactor = pow(0.5, level);\n  float heightFactor = widthFactor * 0.5;\n  float texelSize = 1.0 / size;\n\n  uv.y = 1.0 - uv.y;\n\n  float resizeX = (widthForLevel - 2.0) * texelSize;\n  float resizeY = (heightForLevel - 2.0) * texelSize;\n\n  float uvSpaceLocalX = texelSize + uv.x * resizeX;\n  float uvSpaceLocalY = texelSize + uv.y * resizeY;\n\n  uvSpaceLocalY += heightFactor;\n\n  return vec2(uvSpaceLocalX, uvSpaceLocalY);\n}\n\nvec2 normalToPanoramaUVY(const in vec3 dir) {\n  float n = length(dir.xz);\n\n  // to avoid bleeding the max(-1.0,dir.x / n) is needed\n  vec2 pos = vec2((n > 0.0000001) ? max(-1.0, dir.x / n) : 0.0, dir.y);\n\n  // fix edge bleeding\n  if (pos.x > 0.0) pos.x = min(0.999999, pos.x);\n\n  pos = acos(pos) * 0.3183098861837907; // inv_pi\n\n  pos.x = (dir.z > 0.0) ? pos.x * 0.5 : 1.0 - (pos.x * 0.5);\n\n  // shift u to center the panorama to -z\n  pos.x = mod(pos.x - 0.25 + 1.0, 1.0);\n  pos.y = 1.0 - pos.y;\n  return pos;\n}\n\nvec3 texturePanorama(const in sampler2D texture, const in vec2 uv) {\n  vec4 rgba = texture2D(texture, uv);\n#ifdef FLOAT\n  return rgba.rgb;\n#endif\n#ifdef RGBM\n  return RGBMToRGB(rgba);\n#endif\n#ifdef LUV\n  return LUVToRGB(rgba);\n#endif\n}\n\nvec3 texturePanoramaLod(const in sampler2D texture, const in vec2 size, const in vec3 direction, const in float lodInput, const in float maxLOD) {\n  float lod = min(maxLOD, lodInput);\n  vec2 uvBase = normalToPanoramaUVY(direction);\n\n  float lod0 = floor(lod);\n  vec2 uv0 = computeUVForMipmap(lod0, uvBase, size.x, maxLOD);\n  vec3 texel0 = texturePanorama(texture, uv0.xy);\n\n  float lod1 = ceil(lod);\n  vec2 uv1 = computeUVForMipmap(lod1, uvBase, size.x, maxLOD);\n  vec3 texel1 = texturePanorama(texture, uv1.xy);\n\n  return mix(texel0, texel1, fract(lod));\n}\n\nvec3 prefilterEnvMapPanorama(const in float rLinear, const in vec3 R, const in sampler2D tex, const in vec2 lodRange, const in vec2 size) {\n  float lod = linRoughnessToMipmap(rLinear) * lodRange[1]; //(uEnvironmentMaxLod - 1.0);\n  return texturePanoramaLod(tex, size, R, lod, lodRange[0]);\n}\n\n#define samplerEnv sampler2D\n#define prefilterEnvMap prefilterEnvMapPanorama\n\n#else\n// in case there is no environment node ?\nvec3 prefilterEnvMap(const in float rLinear, const in vec3 R, const in sampler2D tex, const in vec2 lodRange, const in vec2 size) {\n  return vec3(0.0);\n}\n#define samplerEnv sampler2D\n#endif // PANORAMA\n\n#endif // CUBEMAP\n\nvec3 getSpecularDominantDir(const in vec3 N, const in vec3 R, const in float realRoughness) {\n  float smoothness = 1.0 - realRoughness;\n  float lerpFactor = smoothness * (sqrt(smoothness) + realRoughness);\n  // The result is not normalized as we fetch in a cubemap\n  return mix(N, R, lerpFactor);\n}\n\n// samplerEnv and prefilterEnvMap are both defined above (cubemap or panorama)\nvec3 computeIBLSpecularUE4(\n  const in vec3 N,\n  const in vec3 V,\n  const in float rLinear,\n  const in vec3 specular,\n  const in mat3 envTrans,\n  const in samplerEnv texEnv,\n  const in vec2 lodRange,\n  const in vec2 size,\n  const in vec3 frontNormal\n  #ifdef MOBILE\n){\n  #else\n  ,const in sampler2D texBRDF) {\n  #endif\n\n  float rough = max(rLinear, 0.0);\n\n  float NoV = clamp(dot(N, V), 0.0, 1.0);\n  vec3 R = normalize(NoV * 2.0 * N - V);\n\n  R = getSpecularDominantDir(N, R, rLinear);\n  // could use that, especially if NoV comes from shared preCompSpec\n  // vec3 R = reflect(-V, N);\n\n  vec3 dir = envTrans * R;\n\n  vec3 prefilteredColor = prefilterEnvMap(rough, dir, texEnv, lodRange, size);\n  // http://marmosetco.tumblr.com/post/81245981087\n  // TODO we set a min value (10%) to avoid pure blackness (in case of pure metal)\n  float factor = clamp(1.0 + 1.3 * dot(R, frontNormal), 0.1, 1.0);\n  prefilteredColor *= factor * factor;\n  #ifdef MOBILE\n  return prefilteredColor * integrateBRDFApprox(specular, rough, NoV);\n  #else\n  return prefilteredColor * integrateBRDF(specular, rough, NoV, texBRDF);\n  #endif\n}\n\nvec4 linearToGamma(vec4 value, float gammaFactor) {\n  return vec4(pow(value.xyz, vec3(1.0 / gammaFactor)), value.w);\n}\n\nfloat luma(vec3 color) {\n  return dot(color, vec3(0.299, 0.587, 0.114));\n}\n\n// Lights \n\n#if NUM_DIR_LIGHTS > 0\n\n  varying vec3 vEyeLightDir;\n  varying float vDotNL;\n  varying vec3 vComputeGGXResult;\n\n  #define G1V(dotNV, k) (1.0/(dotNV*(1.0-k)+k))\n\n  void precomputeSun(\n          const in vec3 normal,\n          const in vec3 lightViewDirection,\n    \n          out float attenuation,\n          out vec3 eyeLightDir,\n          out float dotNL) {\n\n      attenuation = 1.0;\n      eyeLightDir = lightViewDirection;\n      dotNL = dot(eyeLightDir, normal);\n  }\n\n  vec4 precomputeGGX(const in vec3 normal, const in vec3 eyeVector, const in float roughness) {\n      float dotNV = saturate(dot(normal, eyeVector));\n      float alpha = roughness * roughness;\n      float k = alpha * 0.5;\n      float visNV = G1V(dotNV, k);\n\n      return vec4(alpha, alpha * alpha, k, visNV);\n  }\n\n  vec3 computeGGX(const vec4 precomputeGGX, const vec3 normal, const vec3 eyeVector, const vec3 eyeLightDir, const vec3 F0, const float dotNL) {\n\n      vec3 H = normalize(eyeVector + eyeLightDir);\n      float dotNH = saturate(dot(normal, H));\n      // D\n      float alphaSqr = precomputeGGX.y;\n      float denom = dotNH * dotNH * (alphaSqr - 1.0) + 1.0;\n      float D = alphaSqr / (PI * denom * denom);\n\n      // F\n      float dotLH = saturate(dot(eyeLightDir, H));\n      float dotLH5 = pow(1.0 - dotLH, 5.0);\n      vec3 F = vec3(F0) + (vec3(1.0) - F0) * (dotLH5);\n\n      // V\n      float visNL = G1V(dotNL, precomputeGGX.z);\n      return D * F * visNL * precomputeGGX.w;\n  }\n\n  void computeLightLambertGGX(\n      const in vec3 normal,\n      const in vec3 eyeVector,\n      const in float dotNL,\n      const in vec4 precomputeGGX,\n      \n      const in vec3 diffuse,\n      const in vec3 specular,\n      \n      const in float attenuation,\n      const in vec3 lightColor,\n      const in vec3 eyeLightDir,\n      const in float lightIntensity,\n      \n      out vec3 diffuseOut,\n      out vec3 specularOut,\n      out bool lighted) {\n\n      lighted = dotNL > 0.0;\n      if (lighted == false) {\n          specularOut = diffuseOut = vec3(0.0);\n          return;\n      }\n\n      vec3 colorAttenuate = attenuation * dotNL * lightColor * lightIntensity;\n      specularOut = colorAttenuate * vComputeGGXResult;\n      diffuseOut = colorAttenuate * diffuse;\n  }\n#endif\n\n// THREE.js lights_pars\nuniform vec3 ambientLightColor;\n\nvec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n\n  vec3 irradiance = ambientLightColor;\n\n  #ifndef PHYSICALLY_CORRECT_LIGHTS\n\n    irradiance *= PI;\n\n  #endif\n\n  return irradiance;\n\n}\n\n#if NUM_DIR_LIGHTS > 0\n\n  struct DirectionalLight {\n    vec3 direction;\n    vec3 color;\n\n    int shadow;\n    float shadowBias;\n    float shadowRadius;\n    vec2 shadowMapSize;\n    float intensity;\n  };\n\n  uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n\n  void getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n\n    directLight.color = directionalLight.color;\n    directLight.direction = directionalLight.direction;\n    directLight.visible = true;\n\n  }\n\n#endif\n\n\n// Shadowmaps\n// THREE.js shadowmap_pars_fragment.fs\n\n#ifdef USE_SHADOWMAP\n\n  #if NUM_DIR_LIGHTS > 0\n\n    uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHTS ];\n    varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n\n  #endif\n\n  #if NUM_SPOT_LIGHTS > 0\n\n    uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHTS ];\n    varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n\n  #endif\n\n  #if NUM_POINT_LIGHTS > 0\n\n    uniform sampler2D pointShadowMap[ NUM_POINT_LIGHTS ];\n    varying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];\n\n  #endif\n\n  /*\n  #if NUM_RECT_AREA_LIGHTS > 0\n\n    // TODO (abelnation): create uniforms for area light shadows\n\n  #endif\n  */\n\n  float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n\n    return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\n\n  }\n\n  float texture2DShadowLerp( sampler2D depths, vec2 size, vec2 uv, float compare ) {\n\n    const vec2 offset = vec2( 0.0, 1.0 );\n\n    vec2 texelSize = vec2( 1.0 ) / size;\n    vec2 centroidUV = floor( uv * size + 0.5 ) / size;\n\n    float lb = texture2DCompare( depths, centroidUV + texelSize * offset.xx, compare );\n    float lt = texture2DCompare( depths, centroidUV + texelSize * offset.xy, compare );\n    float rb = texture2DCompare( depths, centroidUV + texelSize * offset.yx, compare );\n    float rt = texture2DCompare( depths, centroidUV + texelSize * offset.yy, compare );\n\n    vec2 f = fract( uv * size + 0.5 );\n\n    float a = mix( lb, lt, f.y );\n    float b = mix( rb, rt, f.y );\n    float c = mix( a, b, f.x );\n\n    return c;\n\n  }\n\n  float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n\n    shadowCoord.xyz /= shadowCoord.w;\n    shadowCoord.z += shadowBias;\n\n    // if ( something && something ) breaks ATI OpenGL shader compiler\n    // if ( all( something, something ) ) using this instead\n\n    bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n    bool inFrustum = all( inFrustumVec );\n\n    bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n\n    bool frustumTest = all( frustumTestVec );\n\n    if ( frustumTest ) {\n\n    #if defined( SHADOWMAP_TYPE_PCF )\n\n      vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\n      float dx0 = - texelSize.x * shadowRadius;\n      float dy0 = - texelSize.y * shadowRadius;\n      float dx1 = + texelSize.x * shadowRadius;\n      float dy1 = + texelSize.y * shadowRadius;\n\n      return (\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n        texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n      ) * ( 1.0 / 9.0 );\n\n    #elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\n      vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\n      float dx0 = - texelSize.x * shadowRadius;\n      float dy0 = - texelSize.y * shadowRadius;\n      float dx1 = + texelSize.x * shadowRadius;\n      float dy1 = + texelSize.y * shadowRadius;\n\n      return (\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy, shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n        texture2DShadowLerp( shadowMap, shadowMapSize, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n      ) * ( 1.0 / 9.0 );\n\n    #else // no percentage-closer filtering:\n\n      return texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );\n\n    #endif\n\n    }\n\n    return 1.0;\n\n  }\n\n  // cubeToUV() maps a 3D direction vector suitable for cube texture mapping to a 2D\n  // vector suitable for 2D texture mapping. This code uses the following layout for the\n  // 2D texture:\n  //\n  // xzXZ\n  //  y Y\n  //\n  // Y - Positive y direction\n  // y - Negative y direction\n  // X - Positive x direction\n  // x - Negative x direction\n  // Z - Positive z direction\n  // z - Negative z direction\n  //\n  // Source and test bed:\n  // https://gist.github.com/tschw/da10c43c467ce8afd0c4\n\n  vec2 cubeToUV( vec3 v, float texelSizeY ) {\n\n    // Number of texels to avoid at the edge of each square\n\n    vec3 absV = abs( v );\n\n    // Intersect unit cube\n\n    float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );\n    absV *= scaleToCube;\n\n    // Apply scale to avoid seams\n\n    // two texels less per square (one texel will do for NEAREST)\n    v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );\n\n    // Unwrap\n\n    // space: -1 ... 1 range for each square\n    //\n    // #X##   dim    := ( 4 , 2 )\n    //  # #   center := ( 1 , 1 )\n\n    vec2 planar = v.xy;\n\n    float almostATexel = 1.5 * texelSizeY;\n    float almostOne = 1.0 - almostATexel;\n\n    if ( absV.z >= almostOne ) {\n\n      if ( v.z > 0.0 )\n        planar.x = 4.0 - v.x;\n\n    } else if ( absV.x >= almostOne ) {\n\n      float signX = sign( v.x );\n      planar.x = v.z * signX + 2.0 * signX;\n\n    } else if ( absV.y >= almostOne ) {\n\n      float signY = sign( v.y );\n      planar.x = v.x + 2.0 * signY + 2.0;\n      planar.y = v.z * signY - 2.0;\n\n    }\n\n    // Transform to UV space\n\n    // scale := 0.5 / dim\n    // translate := ( center + 0.5 ) / dim\n    return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );\n\n  }\n\n  float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n\n    vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );\n\n    // for point lights, the uniform @vShadowCoord is re-purposed to hold\n    // the distance from the light to the world-space position of the fragment.\n    vec3 lightToPosition = shadowCoord.xyz;\n\n    // bd3D = base direction 3D\n    vec3 bd3D = normalize( lightToPosition );\n    // dp = distance from light to fragment position\n    float dp = ( length( lightToPosition ) - shadowBias ) / 1000.0;\n\n    #if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT )\n\n      vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;\n\n      return (\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +\n        texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )\n      ) * ( 1.0 / 9.0 );\n\n    #else // no percentage-closer filtering\n\n      return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );\n\n    #endif\n\n  }\n\n#endif\n\n\n\nvoid main() {\n  vec3 eyeVector = normalize(-FragEyeVector.rgb);\n  mat3 transform = environmentTransformPBR(uEnvironmentTransform);\n\n  vec4 frontTangent = gl_FrontFacing ? FragTangent : -FragTangent;\n  vec3 frontNormal = gl_FrontFacing ? FragNormal : -FragNormal;\n\n  vec3 normal = normalize(frontNormal);\n\n  // Normal map\n  #ifdef USE_NORMALMAP\n    vec3 nmTexel = rgbToNormal(textureRGB(sTextureNormalMap, vUv.xy), uFlipY);\n    vec3 normalMap = vec3(uNormalMapFactor * nmTexel.xy, nmTexel.z);\n    vec3 geoNormal = mtexNspaceTangent(frontTangent, normal, normalMap);\n    if (uMode == -1) {\n      geoNormal = normal;\n    }\n  #else\n    vec3 geoNormal = normal;\n  #endif\n\n  // Metalness / Glossiness\n  vec3 combinedTexel = textureRGB(sTexturePBRMaps, vUv.xy);\n  float metalness = combinedTexel.r;\n  float glossiness = combinedTexel.b;\n  float channelMetalnessPBR = metalness * uMetalnessPBRFactor;\n  float channelGlossinessPBR = glossiness * uGlossinessPBRFactor;\n  float roughness = 1.0 - channelGlossinessPBR;\n  float tmp_51 = max(1.e-4, roughness);\n  #ifdef USE_NORMALMAP\n    float tmp_52 = adjustRoughnessNormalMap(tmp_51, normalMap);\n    float materialRoughness = adjustRoughnessGeometry(tmp_52, normal);\n  #else\n    float materialRoughness = tmp_51;\n  #endif\n\n  // Albedo\n  vec4 albedoMap = vec4(uColor, 1.0);\n  #ifdef USE_ALBEDOMAP\n    albedoMap *= textureRGBA(sTextureAlbedoMap, vUv.xy);\n  #endif\n\n  vec3 channelAlbedoPBR = sRGBToLinear(albedoMap.rgb) * uAlbedoPBRFactor;\n  vec3 materialDiffusePBR = channelAlbedoPBR * (1.0 - channelMetalnessPBR);\n\n  // Ambient occlusion\n  float ao = textureIntensity(sTextureAOMap, vUv2.xy);\n  float channelAOPBR = mix(1.0, ao, uAOPBRFactor);\n\n  // Diffuse \n  vec3 diffuse = computeIBLDiffuseUE4(geoNormal, materialDiffusePBR, transform, uDiffuseSPH);\n\n  // Specular\n  float materialSpecularf0 = mix(0.0, 0.08, uSpecularF0Factor);\n  vec3 materialSpecularPBR = mix(vec3(materialSpecularf0), channelAlbedoPBR, channelMetalnessPBR);\n\n  // Optimization because we don't have reflective surfaces and a very simple environment\n  vec3 specular = vec3(0.004, 0.004, 0.012);\n\n  vec3 color = diffuse + specular;\n\n  color *= uEnvironmentExposure;\n\n  float shadow = 1.0;\n\n  #if NUM_DIR_LIGHTS > 0\n    DirectionalLight directionalLight;\n\n    // vec4 prepGGX = precomputeGGX( geoNormal, eyeVector, materialRoughness );\n    vec4 prepGGX = vec4(0.251, 0.063, 0.125, 1.0);\n\n    float attenuation; vec3 eyeLightDir; float dotNL; vec3 lightDiffuse; vec3 lightSpecular; bool lighted; vec3 lightCol;\n\n    directionalLight = directionalLights[ 0 ];\n\n    lightCol = directionalLight.color;\n\n    // Do this in the vertex shader because we have no normal map in this project\n    // precomputeSun( geoNormal, directionalLight.direction, attenuation, eyeLightDir, dotNL );\n    attenuation = 1.0;\n    eyeLightDir = vEyeLightDir;\n    dotNL = vDotNL;\n\n    computeLightLambertGGX( geoNormal, eyeVector, dotNL, prepGGX, materialDiffusePBR, materialSpecularPBR, attenuation, lightCol, eyeLightDir, 1.0, lightDiffuse, lightSpecular, lighted );\n\n    #ifdef USE_SHADOWMAP\n      // TODO: should check wether light has shadows enabled via directionalLight.shadow property\n      shadow = getShadow( directionalShadowMap[ 0 ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ 0 ] );\n      lightDiffuse *= shadow;\n    #endif\n\n    color += lightDiffuse;\n\n    color += lightSpecular;\n  #endif\n\n  color *= channelAOPBR;\n\n  float channelOpacity = mix(albedoMap.a * uOpacityFactor, 1.0, luma(specular) * 2.0);\n\n  #ifdef USE_EMISSIVEMAP\n    color += sRGBToLinear(emissive);\n  #endif\n\n  if (uMode <= 0) {\n    gl_FragColor = vec4(linearTosRGB(color), channelOpacity);\n  } else if (uMode == 1) {\n    gl_FragColor = vec4(geoNormal, 1.0);\n  } else if (uMode == 2) {\n    #ifdef USE_LIGHTMAP\n    gl_FragColor = vec4(linearTosRGB(lightmap), 1.0);\n    #else\n    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);\n    #endif\n  } else if (uMode == 3) {\n    gl_FragColor = vec4(vec3(channelAOPBR), 1.0);\n  } else if (uMode == 4) {\n    gl_FragColor = vec4(vec3(channelMetalnessPBR), 1.0);\n  } else if (uMode == 5) {\n    gl_FragColor = vec4(vec3(channelGlossinessPBR), 1.0);\n  } else if (uMode == 6) {\n    gl_FragColor = vec4(channelAlbedoPBR, 1.0);\n  }\n\n  #ifdef ALPHATEST\n    if (gl_FragColor.a < uAlphaTest) {\n      discard;\n    } else {\n      gl_FragColor.a = 1.0;\n    }\n  #endif\n\n  #ifdef USE_FOG\n    float fogFactor = smoothstep( fogNear, fogFar, fogDepth );\n    gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n  #endif\n}",
            "pbr.vs": "#define PI 3.14159265359\n#define PI2 6.28318530718\n#define PI_HALF 1.5707963267949\n#define RECIPROCAL_PI 0.31830988618\n#define RECIPROCAL_PI2 0.15915494\n#define LOG2 1.442695\n#define EPSILON 1e-6\n\n#define saturate(a) clamp( a, 0.0, 1.0 )\n#define whiteCompliment(a) ( 1.0 - saturate( a ) )\n\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec4 tangent;\nattribute vec2 uv;\nattribute vec2 uv2;\n\nuniform mat4 modelMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\n\nuniform vec4 offsetRepeat;\nuniform vec4 offsetRepeatDetail;\n\n// varying vec3 FragPosition;\nvarying vec3 FragNormal;\nvarying vec4 FragTangent;\nvarying vec4 FragEyeVector;\nvarying vec2 vUv;\n\n// Optimization just for this experiment\nvarying vec3 vEyeLightDir;\nvarying float vDotNL;\nvarying vec3 vComputeGGXResult;\n\n#if NUM_DIR_LIGHTS > 0\n  #define G1V(dotNV, k) (1.0/(dotNV*(1.0-k)+k))\n\n  struct DirectionalLight {\n    vec3 direction;\n    vec3 color;\n\n    int shadow;\n    float shadowBias;\n    float shadowRadius;\n    vec2 shadowMapSize;\n    float intensity;\n  };\n\n  uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n\n  vec3 computeGGX(const vec4 precomputeGGX, const vec3 normal, const vec3 eyeVector, const vec3 eyeLightDir, const vec3 F0, const float dotNL) {\n\n      vec3 H = normalize(eyeVector + eyeLightDir);\n      float dotNH = saturate(dot(normal, H));\n      // D\n      float alphaSqr = precomputeGGX.y;\n      float denom = dotNH * dotNH * (alphaSqr - 1.0) + 1.0;\n      float D = alphaSqr / (PI * denom * denom);\n\n      // F\n      float dotLH = saturate(dot(eyeLightDir, H));\n      float dotLH5 = pow(1.0 - dotLH, 5.0);\n      vec3 F = vec3(F0) + (vec3(1.0) - F0) * (dotLH5);\n\n      // V\n      float visNL = G1V(dotNL, precomputeGGX.z);\n      return D * F * visNL * precomputeGGX.w;\n  }\n\n#endif\n\n#if defined(USE_ALBEDO2) || defined(USE_NORMALMAP2) || defined(USE_AOMAP2)\nvarying vec2 vUvDetail;\n#endif\n\nvarying vec2 vUv2;\n\n#ifdef USE_SHADOWMAP\n\n  #if NUM_DIR_LIGHTS > 0\n\n    uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHTS ];\n    varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHTS ];\n\n  #endif\n\n  #if NUM_SPOT_LIGHTS > 0\n\n    uniform mat4 spotShadowMatrix[ NUM_SPOT_LIGHTS ];\n    varying vec4 vSpotShadowCoord[ NUM_SPOT_LIGHTS ];\n\n  #endif\n\n  #if NUM_POINT_LIGHTS > 0\n\n    uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHTS ];\n    varying vec4 vPointShadowCoord[ NUM_POINT_LIGHTS ];\n\n  #endif\n#endif\n\n#ifdef USE_FOG\n\n  varying float fogDepth;\n\n#endif\n\nvoid main() {\n  vec4 worldPosition = modelMatrix * vec4(position, 1.0);\n\n  FragEyeVector = viewMatrix * worldPosition;\n\n  // FragPosition = worldPosition.xyz;\n\n  gl_Position = projectionMatrix * FragEyeVector;\n\n  vUv = uv.xy * offsetRepeat.zw + offsetRepeat.xy;\n\n  #if defined(USE_ALBEDO2) || defined(USE_NORMALMAP2) || defined(USE_AOMAP2)\n  vUvDetail = uv.xy * offsetRepeatDetail.zw + offsetRepeatDetail.xy;\n  #endif\n\n  FragNormal = normalMatrix * normal;\n  FragTangent.xyz = normalMatrix * tangent.xyz;\n  FragTangent.w = tangent.w;\n\n  vUv2 = uv2.xy;\n\n  #ifdef USE_SHADOWMAP\n\n    #if NUM_DIR_LIGHTS > 0\n\n      vDirectionalShadowCoord[ 0 ] = directionalShadowMatrix[ 0 ] * worldPosition;\n\n    #endif\n\n  #endif\n\n\n  #ifdef USE_FOG\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    fogDepth = -mvPosition.z;\n  #endif\n\n\n  #if NUM_DIR_LIGHTS > 0\n\n    // Precompute sun in VS because we have no normal map\n\n    DirectionalLight dirLight;\n\n    dirLight = directionalLights[0];\n\n    vec3 normalizedNormal = normalize(FragNormal);\n\n    vEyeLightDir = dirLight.direction;\n    vDotNL = dot(dirLight.direction, normalizedNormal);\n\n    vec3 eyeVector = normalize(-FragEyeVector.rgb);\n\n    vec4 prepGGX = vec4(0.251, 0.063, 0.125, 1.0);\n\n    vComputeGGXResult = computeGGX(prepGGX, normalizedNormal, eyeVector, dirLight.direction, vec3(0.05), vDotNL);\n\n  #endif\n\n}\n"
        }
    }, {}],
    45: [function (t, e, n) {
        var r = THREE.PerspectiveCamera, i = t("7"), o = function (t) {
            r.call(this), this.aspect = window.innerWidth / window.innerHeight, this.fov = 50, this.near = 1, this.far = 1e3, this.updateProjectionMatrix(), this.controls = new i(this, t || document.body)
        };
        o.inherit(r, {
            update: function () {
                this.controls.update()
            }
        }), e.exports = o
    }, {7: 7}],
    46: [function (t, e, n) {
        var r = t("59"), i = t("55"), o = new THREE.Vector3(0, 1, 0), a = function (t, e, n) {
            i.call(this, t), this.name = "car", this.maxSpeed = .25, this.minSpeed = 0, this.speed = this.maxSpeed, this.stuck = !1, this.restartTimer = null, this.add(e), this.mesh = e, this.radarRadius = (this._isLargeVehicle(), 20), this.position.copy(n.position);
            var a = new THREE.Vector3(3.4, 0, 0);
            e.rotation.copy(n.rotation), a.applyAxisAngle(o, e.rotation.y), r.random() > .5 ? this.position.add(a) : (e.rotation.y += Math.PI, this.position.sub(a)), this.direction = e.getWorldDirection().negate(), this.direction.set(Math.round(this.direction.x), Math.round(this.direction.y), Math.round(this.direction.z)), this._initCollisionPoints()
        };
        a.inherit(i, {
            addRadarHelper: function () {
                var t = new THREE.CircleGeometry(this.radarRadius, 32, 0, Math.PI / 2),
                    e = new THREE.MeshBasicMaterial({color: 16711935}), n = new THREE.Mesh(t, e);
                n.rotation.order = "YXZ", n.position.y = 1, n.rotation.x = -Math.PI / 2, n.rotation.y = this.mesh.rotation.y, this.add(n), this.helper = n
            }, detectCars: function (t) {
                var e = .0075, n = !0;
                this.detectedCar = null;
                for (var r = 0; r < t.length; r++) {
                    var i = this.detectCar(t[r]);
                    if (i) {
                        n = !1, this.detectedCar = i;
                        break
                    }
                }
                n ? (this.speed < this.maxSpeed && (this.speed += e, this.speed = Math.min(this.speed, this.maxSpeed)), this.stuck && (clearTimeout(this.restartTimer), this.stuck = !1, this.minSpeed = 0)) : (this.speed -= e, this.speed = Math.max(this.speed, this.minSpeed), this.stuck || 0 !== this.speed || (this.stuck = !0, this.restartTimer = setTimeout(function () {
                    this.minSpeed = .25 * this.maxSpeed
                }.bind(this), 2e3)))
            }, detectCar: function () {
                var t = new THREE.Vector3, e = new THREE.Vector3, n = new THREE.Vector3, i = new THREE.Vector3,
                    a = new THREE.Vector3;
                return function (s) {
                    var c = s.detectedCar === this, u = !1;
                    if (c) return null;
                    if (this.isOnIntersection() && !s.isOnIntersection() && !this.direction.equals(s.direction)) return null;
                    s.updateMatrix(), t.copy(this.direction), t.applyAxisAngle(o, -Math.PI / 4), r.getTablePosition(this.position, this.parent.tableX, this.parent.tableY, n);
                    for (var l = 0; l < s.collisionPoints.length; l++) {
                        var f = s.collisionPoints[l];
                        a.copy(f).applyMatrix4(s.matrix), r.getTablePosition(a, s.parent.tableX, s.parent.tableY, i);
                        var h = n.distanceTo(i);
                        if (h <= this.radarRadius) {
                            e.subVectors(i, n).normalize();
                            var p = t.dot(e);
                            if (p > .5) {
                                u = !0;
                                break
                            }
                        }
                    }
                    return u ? s : null
                }
            }(), update: function () {
                var t = new THREE.Vector3;
                return function () {
                    t.copy(this.direction).multiplyScalar(this.speed), this.position.add(t), r.roundVector(this.position, 2), this._updateTablePosition();
                    var e = this.table.getNeighboringCars(this);
                    this.detectCars(e)
                }
            }(), isOnIntersection: function () {
                return this.position.x < -20 && this.position.x > -40 && this.position.z < -20 && this.position.z > -40
            }, _initCollisionPoints: function () {
                var t = new THREE.Box3;
                t.setFromObject(this.mesh);
                var e = new THREE.Vector3;
                e.copy(t.min), this.worldToLocal(e), e.y = 1, Math.abs(this.direction.x) > 0 ? e.z = 0 : e.x = 0;
                var n = new THREE.Vector3;
                n.copy(t.max), this.worldToLocal(n), n.y = 1, Math.abs(this.direction.x) > 0 ? n.z = 0 : n.x = 0, this.collisionPoints = [e, n], this.collisionPoints.forEach(function (t) {
                }, this)
            }, _isLargeVehicle: function () {
                return this.mesh.name.indexOf("Bus") !== -1 || this.mesh.name.indexOf("Container") !== -1 || this.mesh.name.indexOf("Truck") !== -1
            }
        }), e.exports = a
    }, {55: 55, 59: 59}],
    47: [function (t, e, n) {
        var r = t("50"), i = function () {
            THREE.Scene.call(this), this._pickables = [], this.chunks = [], this._initChunks()
        };
        i.inherit(THREE.Scene, {
            _initChunks: function () {
                for (var t = 0; t < r.CHUNK_COUNT; t++) for (var e = 0; e < r.CHUNK_COUNT; e++) {
                    void 0 === this.chunks[e] && (this.chunks[e] = []);
                    var n = this._createChunkAt(e, t);
                    this.chunks[e][t] = n, this.add(n)
                }
            }, _createChunkAt: function (t, e) {
                var n = new THREE.Object3D, i = new THREE.PlaneGeometry(r.CHUNK_SIZE, r.CHUNK_SIZE, 1, 1),
                    o = new THREE.MeshBasicMaterial, a = new THREE.Mesh(i, o),
                    s = (r.CHUNK_COUNT - 1) / 2 * -r.CHUNK_SIZE, c = s;
                return a.rotation.x = -Math.PI / 2, a.centeredX = t - Math.floor(r.CHUNK_COUNT / 2), a.centeredY = e - Math.floor(r.CHUNK_COUNT / 2), a.material.visible = !1, this._pickables.push(a), n.position.x = s + t * r.CHUNK_SIZE, n.position.z = c + e * r.CHUNK_SIZE, n.centeredX = a.centeredX, n.centeredY = a.centeredY, n.material = a.material, n.add(a), n
            }, getPickables: function () {
                return this._pickables
            }, forEachChunk: function (t) {
                for (var e = 0; e < r.CHUNK_COUNT; e++) for (var n = 0; n < r.CHUNK_COUNT; n++) {
                    var i = this.chunks[e][n];
                    t(i, i.centeredX, i.centeredY)
                }
            }
        }), e.exports = i
    }, {50: 50}],
    48: [function (t, e, n) {
        function r(t) {
            return t[Math.floor(s.random() * t.length)]
        }

        var i = t("50"), o = t("46"), a = t("49"), s = t("59"), c = function (t, e, n, r, i) {
            this._containsStadium = !1, this.blocks = t, this.lanes = [], this.intersections = n, this.carObjects = r, this.mobs = [], this.chunks = [], this.cloudObjects = i, e.forEach(function (t) {
                switch (t.name) {
                    case"Road_Lane_01_fixed":
                        for (var e = 0; e < 10; e++) this.lanes.push(t);
                        break;
                    case"Road_Lane_03_fixed":
                        for (var e = 0; e < 5; e++) this.lanes.push(t)
                }
            }, this), this._generate()
        };
        c.inherit(Object, {
            getChunkData: function (t, e) {
                return t %= i.TABLE_SIZE, e %= i.TABLE_SIZE, t < 0 && (t = i.TABLE_SIZE + t), e < 0 && (e = i.TABLE_SIZE + e), void 0 !== this.chunks[t] && (void 0 !== this.chunks[t][e] && this.chunks[t][e])
            }, getNeighboringCars: function () {
                var t = [];
                return function (e) {
                    return t.length = 0, e.parent.traverse(function (n) {
                        "car" === n.name && n !== e && t.push(n)
                    }), this._forEachNeighboringChunk(e.parent.tableX, e.parent.tableY, function (e) {
                        e.traverse(function (e) {
                            "car" === e.name && t.push(e)
                        })
                    }), t
                }
            }(), update: function (t) {
                this.mobs.forEach(function (e) {
                    e.update(t)
                })
            }, _forEachNeighboringChunk: function () {
                var t = new THREE.Vector2,
                    e = [new THREE.Vector2((-1), (-1)), new THREE.Vector2(1, 0), new THREE.Vector2(1, 0), new THREE.Vector2(0, 1), new THREE.Vector2(0, 1), new THREE.Vector2((-1), 0), new THREE.Vector2((-1), 0), new THREE.Vector2(0, (-1))];
                return function (n, r, i) {
                    t.set(n, r), e.forEach(function (e) {
                        t.add(e);
                        var n = this.getChunkData(t.x, t.y);
                        n && i(n.node)
                    }, this)
                }
            }(), _getNeighboringBlocks: function () {
                var t = [];
                return function (e, n) {
                    return t.length = 0, this._forEachNeighboringChunk(e, n, function (e) {
                        t.push(e.block.name)
                    }), t
                }
            }(), _getRandomBlockAt: function (t, e) {
                for (var n, i = 0, o = this._getNeighboringBlocks(t, e); i < 100;) {
                    var a = r(this.blocks).clone(), s = a.name;
                    if ("block_8_merged" === s) {
                        if (this._containsStadium) {
                            i++;
                            continue
                        }
                        this._containsStadium = !0, n = a;
                        break
                    }
                    if (o.indexOf(s) === -1) {
                        n = a;
                        break
                    }
                    i++
                }
                return n
            }, _getRandomChunk: function (t, e) {
                var n = new THREE.Matrix4, c = (new THREE.Matrix4).makeRotationY(Math.PI / 2), u = new THREE.Object3D;
                u.name = "chunk";
                var l = this._getRandomBlockAt(t, e), f = Math.round(4 * s.random()) * (Math.PI / 2);
                l.rotation.y = f, l.position.set(0, 0, 0), u.add(l), u.block = l;
                var h = [], p = r(this.lanes).clone();
                p.position.set(-30, 0, 10), u.add(p), h.push(p);
                var d = r(this.lanes).clone();
                d.position.set(-30, 0, -10), n.makeTranslation(0, 0, -20), d.geometry = d.geometry.clone(), p.geometry = p.geometry.clone(), d.geometry.applyMatrix(n), h.push(d);
                var v = r(this.lanes).clone();
                v.position.set(-10, 0, -30), v.rotation.y = Math.PI / 2, h.push(v), n.makeTranslation(20, 0, -40), v.geometry = v.geometry.clone(), v.geometry.applyMatrix(c), v.geometry.applyMatrix(n);
                var m = r(this.lanes).clone();
                m.geometry = m.geometry.clone(), m.position.set(10, 0, -30), m.rotation.y = Math.PI / 2, n.makeTranslation(40, 0, -40), m.geometry.applyMatrix(c), m.geometry.applyMatrix(n), h.push(m);
                var g = p.geometry.join([d.geometry, v.geometry, m.geometry]);
                p.geometry = g;
                var _ = r(this.intersections).clone();
                if (_.position.set(-30, 0, 30), u.add(_), h.forEach(function (t) {
                    var e = window.isMobile ? .2 : .35;
                    if (s.random() < e) {
                        var n = r(this.carObjects).clone(), i = new o(this, n, t);
                        u.add(i), this.mobs.push(i)
                    }
                }, this), s.random() > .65) {
                    var y = r(this.cloudObjects).clone(), b = new a(this, y);
                    u.add(b), this.mobs.push(b)
                }
                return u.traverse(function (t) {
                    t instanceof THREE.Mesh && t.material && t.material.pbr && (t.material.defines.USE_FOG = !0, t instanceof a == !1 && (t.receiveShadow = !0, t.material.defines.USE_SHADOWMAP = !0, t.material.defines[i.SHADOWMAP_TYPE] = !0))
                }), u
            }, _generate: function () {
                for (var t = 0; t < i.TABLE_SIZE; t++) for (var e = 0; e < i.TABLE_SIZE; e++) {
                    void 0 === this.chunks[e] && (this.chunks[e] = []);
                    var n = this._getRandomChunk(e, t);
                    n.tableX = e, n.tableY = t, this.chunks[e][t] = {node: n}
                }
            }
        }), e.exports = c
    }, {46: 46, 49: 49, 50: 50, 59: 59}],
    49: [function (t, e, n) {
        var r = t("50"), i = t("55"), o = t("59"), a = .05, s = 2, c = function (t, e) {
            i.call(this, t), this.add(e), this.position.set(o.random() * r.CHUNK_SIZE - r.CHUNK_SIZE / 2, 60, o.random() * r.CHUNK_SIZE - r.CHUNK_SIZE / 2), this.delay = 5 * o.random(), this.speedModifier = .25 * o.random() + 1, this.moveSpeed = .05 * this.speedModifier, this.maxScalar = this.scale.x + this.scale.x * a, this.minScalar = this.scale.x - this.scale.x * a, this.rotation.y = .25, this.direction = new THREE.Vector3((-1), 0, .3)
        };
        c.inherit(i, {
            update: function () {
                var t = new THREE.Vector3;
                return function (e) {
                    var n = THREE.Math.mapLinear(Math.sin((this.delay + e.elapsed) * s), -1, 1, 0, 1);
                    this.scale.setScalar(this.minScalar + (this.maxScalar - this.minScalar) * n), t.copy(this.direction).multiplyScalar(this.moveSpeed), this.position.add(t), this._updateTablePosition()
                }
            }()
        }), e.exports = c
    }, {50: 50, 55: 55, 59: 59}],
    50: [function (t, e, n) {
        var r = {
            FPS: !1,
            LOG_CALLS: !1,
            RANDOM_SEED: "infinitown",
            RANDOM_SEED_ENABLED: !1,
            MAX_PIXEL_RATIO: 1.25,
            SHADOWMAP_RESOLUTION: window.isMobile ? 1024 : 2048,
            SHADOWMAP_TYPE: "SHADOWMAP_TYPE_PCF",
            TABLE_SIZE: 9,
            CHUNK_COUNT: 9,
            CHUNK_SIZE: 60,
            CAMERA_ANGLE: .5,
            PAN_SPEED: window.isMobile ? .4 : .1,
            FOG_NEAR: 225,
            FOG_FAR: 325,
            FOG_COLOR: 10676479
        };
        e.exports = r
    }, {}],
    51: [function (t, e, n) {
        e.exports = ["textures/white.png", "textures/normal.png", "textures/vignetting.png"]
    }, {}],
    52: [function (t, e, n) {
        function r(t) {
            return Math.sqrt((t[0].clientX - t[1].clientX) * (t[0].clientX - t[1].clientX) + (t[0].clientY - t[1].clientY) * (t[0].clientY - t[1].clientY))
        }

        var i = t("3");
        t("33")($);
        var o = function (t) {
            var e = !1, n = 0, t = void 0 !== t ? t : window;
            $(t).on("mousedown", function (t) {
                var e = {x: t.pageX, y: t.pageY};
                this.trigger("startdrag", e)
            }.bind(this)), $(t).on("mouseup", function (t) {
                var e = {x: t.pageX, y: t.pageY};
                this.trigger("enddrag", e)
            }.bind(this)), $(t).on("mousemove", function (t) {
                var e = {x: t.pageX, y: t.pageY};
                this.trigger("drag", e)
            }.bind(this)), $(t).on("mouseleave", function (t) {
                var e = {x: t.pageX, y: t.pageY};
                this.trigger("enddrag", e)
            }.bind(this)), $(t).on("touchstart", function (t) {
                if (2 === t.touches.length) e = !0, n = r(t.originalEvent.touches), this.trigger("pinchstart"); else if (1 === t.touches.length) {
                    var i = {x: t.touches[0].pageX, y: t.touches[0].pageY};
                    this.trigger("startdrag", i)
                }
            }.bind(this)), $(t).on("touchend", function (t) {
                var n = {x: 0, y: 0};
                0 === t.originalEvent.touches.length && (e && (e = !1, this.trigger("pinchend")), this.trigger("enddrag", n))
            }.bind(this)), $(t).on("touchmove", function (t) {
                if (e) {
                    var i = t.originalEvent.touches;
                    if (2 === i.length) {
                        var o = r(i) - n, a = Math.max(1 + o / 100, 0);
                        this.trigger("pinchchange", a)
                    }
                } else {
                    var s = {x: t.touches[0].pageX, y: t.touches[0].pageY};
                    this.trigger("drag", s)
                }
                t.preventDefault()
            }.bind(this)), $(t).on("mousewheel", function (t) {
                var e = t.deltaY;
                this.trigger("mousewheel", e)
            }.bind(this))
        };
        o.mixin(i), e.exports = o
    }, {3: 3, 33: 33}],
    53: [function (t, e, n) {
        function r(t, e, n, r) {
            var i = {geometries: [t], textures: h, sh: [n]}, o = new a(i);
            o.load().then(function (n) {
                s.texturePath = "assets/" + t + "/", THREE.MaterialLoader.setShaders(f), c.loadScene(t, "assets/scenes/", e).then(r)
            })
        }

        function i() {
            var t = "main", e = "envProbe";
            p = new u({
                canvas: document.querySelector("canvas"),
                autoClear: !1,
                fps: l.FPS || !1,
                logCalls: l.LOG_CALLS || !1,
                maxPixelRatio: l.MAX_PIXEL_RATIO || 2
            }), r(t, p, e, function (t) {
                window.api.trigger("loaded"), setTimeout(function () {
                    p.start(t), window.api.trigger("started")
                }, 20)
            }), $(document).on("click", function () {
                window.api.trigger("click")
            })
        }

        t("18"), t("28").polyfill();
        var o = t("3"), a = t("14"), s = t("15"), c = t("17"), u = t("43"), l = t("50"), f = t("44"), h = t("51");
        $("canvas");
        s.manager.onProgress = function (t, e, n) {
            var r = 57, i = Math.ceil(e / r * 100);
            window.api.trigger("loadingprogress", i)
        };
        var p;
        window.parent === window && i();
        var d = function () {
        };
        d.inherit(Object, {
            pause: function () {
                p.pause()
            }, resume: function () {
                p.resume()
            }, load: i
        }), d.mixin(o), window.api = new d
    }, {14: 14, 15: 15, 17: 17, 18: 18, 28: 28, 3: 3, 43: 43, 44: 44, 50: 50, 51: 51}],
    54: [function (t, e, n) {
        var r = t("21"), i = t("44"), o = function (t) {
            t = Object.assign({
                vertexShader: i["basic.vs"],
                fragmentShader: i["basic.fs"],
                uniforms: {
                    diffuse: {value: new THREE.Color(16711935)},
                    map: {value: null},
                    offsetRepeat: {value: new THREE.Vector4(0, 0, 1, 1)},
                    opacity: {value: 1}
                }
            }, t), r.call(this, t), Object.keys(this.uniforms).forEach(function (t) {
                this.onPropertyChange(t, function (e) {
                    this.uniforms[t].value = e
                })
            }, this)
        };
        o.inherit(r, {
            clone: function (t) {
                var e = t || new o;
                return r.prototype.clone.call(this, e), e.name = this.name, e.transparent = this.transparent, _.each(this.uniforms, function (t, n) {
                    var r = t.type;
                    "v2" === r || "m4" === r ? e.uniforms[n].value.copy(t.value) : e.uniforms[n].value = t.value
                }, this), e
            }
        }), e.exports = o
    }, {21: 21, 44: 44}],
    55: [function (t, e, n) {
        var r = t("50"), i = t("59"), o = r.CHUNK_SIZE * r.TABLE_SIZE, a = THREE.Math.euclideanModulo,
            s = function (t) {
                THREE.Object3D.call(this), this.previousChunk = null, this.table = t, this.tablePosition = new THREE.Vector3, this.lastTablePosition = new THREE.Vector3, this.lastPosition = new THREE.Vector3
            };
        s.inherit(THREE.Object3D, {
            _updateTablePosition: function () {
                i.getTablePosition(this.position, this.parent.tableX, this.parent.tableY, this.tablePosition), 0 === this.lastTablePosition.length() && this.lastTablePosition.copy(this.tablePosition);
                var t = this.tablePosition.x - this.lastTablePosition.x,
                    e = this.tablePosition.z - this.lastTablePosition.z;
                this.lastTablePosition.copy(this.tablePosition);
                var n = Math.floor(a(this.tablePosition.x + 40, o) / r.CHUNK_SIZE),
                    s = Math.floor(a(this.tablePosition.z + 40, o) / r.CHUNK_SIZE), c = this.parent,
                    u = this.table.chunks[n][s].node;
                if (Math.abs(t) < 500 && Math.abs(t) > 20 && console.log("warp on X", t, c.tableX, u.tableX), Math.abs(e) < 500 && Math.abs(e) > 20 && console.log("warp on Z", e, c.tableY, u.tableY), this.previousChunk !== c && c !== u, this.lastPosition.copy(this.position), u !== c) {
                    u.add(this);
                    var l = a(this.position.x + 40, r.CHUNK_SIZE) - 40, f = a(this.position.z + 40, r.CHUNK_SIZE) - 40;
                    this.position.x = l, this.position.z = f
                }
                this.previousChunk = c
            }
        }), e.exports = s
    }, {50: 50, 59: 59}],
    56: [function (t, e, n) {
        var r = THREE.OrthographicCamera, i = (t("7"), function (t) {
            r.call(this);
            var e = window.innerWidth / window.innerHeight;
            this.left = t / -2 * e, this.right = t / 2 * e, this.top = t / 2, this.bottom = t / -2, this.near = .01, this.far = 500, this.updateProjectionMatrix()
        });
        i.inherit(r, {
            update: function () {
            }
        }), e.exports = i
    }, {7: 7}],
    57: [function (t, e, n) {
        var r = t("50"), i = t("3"), o = new THREE.Vector2, a = function (t, e, n) {
            this._panning = !1, this._startCoords = new THREE.Vector2, this._lastOffset = new THREE.Vector2, this._offset = new THREE.Vector2, this._speed = new THREE.Vector3(r.PAN_SPEED, 0, r.PAN_SPEED), this._sceneOffset = new THREE.Vector3, this._worldOffset = new THREE.Vector3, this.inputManager = t, this._scene = e, this.inputManager.on("startdrag", this._onStartDrag, this), this.inputManager.on("enddrag", this._onEndDrag, this), this.inputManager.on("drag", this._onDrag, this), this._camera = n, this._raycaster = new THREE.Raycaster, this.enabled = !0
        };
        a.inherit(Object, {
            _onStartDrag: function (t) {
                this.enabled && (this._panning = !0, this._startCoords.set(t.x, t.y))
            }, _onEndDrag: function (t) {
                this.enabled && (this._panning = !1, this._lastOffset.copy(this._offset))
            }, _onDrag: function (t) {
                var e = new THREE.Vector2;
                return function (t) {
                    this.enabled && this._panning && (e.subVectors(t, this._startCoords), this._offset.addVectors(this._lastOffset, e))
                }
            }(), raycast: function () {
                this._raycaster.setFromCamera(o, this._camera);
                var t = this._raycaster.intersectObjects(this._scene.getPickables());
                if (t.length > 0) {
                    var e = t[0].object;
                    this._sceneOffset.x += e.centeredX * r.CHUNK_SIZE, this._sceneOffset.z += e.centeredY * r.CHUNK_SIZE, 0 === e.centeredX && 0 === e.centeredY || this.trigger("move", e.centeredX, e.centeredY)
                }
            }, update: function () {
                var t = new THREE.Vector2, e = new THREE.Vector2, n = new THREE.Vector3;
                return function () {
                    this.raycast(), t.copy(this._offset), t.rotateAround(e, -Math.PI / 4), this._worldOffset.set(t.x, 0, t.y).multiply(this._speed), n.lerp(this._worldOffset, .05), this._scene.position.addVectors(this._sceneOffset, n)
                }
            }()
        }), a.mixin(i), e.exports = a
    }, {3: 3, 50: 50}],
    58: [function (t, e, n) {
        var r = THREE.PerspectiveCamera, i = new THREE.Vector3, o = function () {
            r.apply(this, arguments), this.targetHeight = 140
        };
        o.inherit(r, {
            updateHeight: function () {
                var t = 1e3, e = -100;
                return function (n, r) {
                    n *= e, t += n, t = Math.min(Math.max(t + n, 0), 1e3), this.targetHeight = THREE.Math.mapLinear(t, 0, 1e3, 30, 140), r && (this.position.y = this.targetHeight)
                }
            }(), update: function () {
                this.position.y += .05 * (this.targetHeight - this.position.y), this.lookAt(i)
            }
        }), e.exports = o
    }, {}],
    59: [function (t, e, n) {
        var r = t("35"), i = t("50"), o = {
            random: function () {
                var t = r(i.RANDOM_SEED);
                return function () {
                    return i.RANDOM_SEED_ENABLED ? t() : Math.random()
                }
            }(), roundVector: function (t, e) {
                if (void 0 === e || 0 === e) return t.round(), t;
                var n = Math.pow(10, e);
                return t.x = Math.round(t.x * n) / n, t.y = Math.round(t.y * n) / n, t.z = Math.round(t.z * n) / n, t
            }, getTablePosition: function (t, e, n, r) {
                return r.x = i.CHUNK_SIZE * e + t.x, r.z = i.CHUNK_SIZE * n + t.z, r
            }
        };
        e.exports = o
    }, {35: 35, 50: 50}],
    60: [function (t, e, n) {
        var r = t("15"), i = function () {
            this._quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null), this._quad.frustumCulled = !1, this._camera = new THREE.OrthographicCamera((-1), 1, 1, (-1), 0, 1), this._scene = new THREE.Scene, this._scene.add(this._quad), this._quad.material = new THREE.MeshBasicMaterial({
                map: r.getTexture("textures/vignetting.png"),
                transparent: !0,
                opacity: .25
            })
        };
        i.inherit(Object, {
            render: function (t) {
                t.render(this._scene, this._camera)
            }
        }), e.exports = i
    }, {15: 15}]
}, {}, [53]);
