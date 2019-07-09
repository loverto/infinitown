var town7=function(canCreateDiscussions, mixin, n) {
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
    }