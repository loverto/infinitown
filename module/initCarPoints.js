import * as THREE  from 'three';
import types from 'module/types';
import render from 'module/render';
var normal = new THREE.Vector3(0, 1, 0);
/**
 * @param {!Function} obj
 * @param {!Object} data
 * @param {!Object} transform
 * @return {undefined}
 */
var InitCarPoints = function(obj, data, transform) {
    render.call(this, obj);
    /** @type {string} */
    this.name = 'car';
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
    if (types.random() > .5) {
        this.position.add(point);
    } else {
        data.rotation.y += Math.PI;
        this.position.sub(point);
    }
    this.direction = data.getWorldDirection().negate();
    this.direction.set(Math.round(this.direction.x), Math.round(this.direction.y), Math.round(this.direction.z));
    this._initCollisionPoints();
};
InitCarPoints.inherit(render, {
    addRadarHelper : function() {
        var pregeom = new THREE.CircleGeometry(this.radarRadius, 32, 0, Math.PI / 2);
        var wrapper = new THREE.MeshBasicMaterial({
            color : 16711935
        });
        var el = new THREE.Mesh(pregeom, wrapper);
        /** @type {string} */
        el.rotation.order = 'YXZ';
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
            types.getTablePosition(this.position, this.parent.tableX, this.parent.tableY, startGround);
            /** @type {number} */
            var i = 0;
            for (; i < obj.collisionPoints.length; i++) {
                var pos = obj.collisionPoints[i];
                orig.copy(pos).applyMatrix4(obj.matrix);
                types.getTablePosition(orig, obj.parent.tableX, obj.parent.tableY, endGround);
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
            types.roundVector(this.position, 2);
            this._updateTablePosition();
            // 获取相邻的车辆
            var fakeMutation = this.table.getNeighboringCars(this);
            // 检测车
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
        return this.mesh.name.indexOf('Bus') !== -1 || this.mesh.name.indexOf('Container') !== -1 || this.mesh.name.indexOf('Truck') !== -1;
    }
});

/** @type {function(!Function, !Object, !Object): undefined} */
export default InitCarPoints;

