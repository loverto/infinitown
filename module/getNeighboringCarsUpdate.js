import * as THREE  from 'three';
import * as BufferGeometryUtils from 'three/examples/js/utils/BufferGeometryUtils'
import state from 'module/state';
import initCollisionPointsUpdate from 'module/initCollisionPointsUpdate';
import Buffer from 'module/updateTablePositionRender';
import Common from 'module/types';

/**
 * 随机获取数组中的元素
 * @param {!Object} options
 * @return {?}
 */
function getElementByRandom(options) {
    return options[Math.floor(Common.random() * options.length)];
}

/**
 * @param {!Function} data
 * @param {!Object} options
 * @param {number} prop
 * @param {?} index
 * @param {?} vertices
 * @return {undefined}
 */
var getNeighboringCarsUpdate = function(data, options, prop, index, vertices) {
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
        case 'Road_Lane_01_fixed':
            /** @type {number} */
            var e = 0;
            for (; e < 10; e++) {
                this.lanes.push(t);
            }
            break;
        case 'Road_Lane_03_fixed':
            /** @type {number} */
            e = 0;
            for (; e < 5; e++) {
                this.lanes.push(t);
            }
        }
    }, this);
    this._generate();
};
getNeighboringCarsUpdate.inherit(Object, {
    getChunkData : function(i, x) {
        return i = i % state.TABLE_SIZE, x = x % state.TABLE_SIZE, i < 0 && (i = state.TABLE_SIZE + i), x < 0 && (x = state.TABLE_SIZE + x), void 0 !== this.chunks[i] && (void 0 !== this.chunks[i][x] && this.chunks[i][x]);
    },
    getNeighboringCars : function() {
    // 获取相邻的车
    /** @type {!Array} */
        var neighCars = [];

        return function(s) {
            return neighCars.length = 0, s.parent.traverse(function(sub) {
                // 把周围的车获取到，并存储在数组中
                if ('car' === sub.name && sub !== s) {
                    neighCars.push(sub);
                }
            }), this._forEachNeighboringChunk(s.parent.tableX, s.parent.tableY, function(spUtils) {
                // 遍历相邻的块
                spUtils.traverse(function(e) {
                    if ('car' === e.name) {
                        neighCars.push(e);
                    }
                });
            }), neighCars;
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
            var file = getElementByRandom(this.blocks).clone();
            var type = file.name;
            if ('block_8_merged' === type) {
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
        self.name = 'chunk';
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
        var result = getElementByRandom(this.lanes).clone();
        result.position.set(-30, 0, 10);
        self.add(result);
        d.push(result);
        var object = getElementByRandom(this.lanes).clone();
        object.position.set(-30, 0, -10);
        matrix.makeTranslation(0, 0, -20);
        object.geometry = object.geometry.clone();
        result.geometry = result.geometry.clone();
        object.geometry.applyMatrix(matrix);
        d.push(object);
        var mesh = getElementByRandom(this.lanes).clone();
        mesh.position.set(-10, 0, -30);
        /** @type {number} */
        mesh.rotation.y = Math.PI / 2;
        d.push(mesh);
        matrix.makeTranslation(20, 0, -40);
        mesh.geometry = mesh.geometry.clone();
        mesh.geometry.applyMatrix(matrixWorldInverse);
        mesh.geometry.applyMatrix(matrix);
        var o = getElementByRandom(this.lanes).clone();
        o.geometry = o.geometry.clone();
        o.position.set(10, 0, -30);
        /** @type {number} */
        o.rotation.y = Math.PI / 2;
        matrix.makeTranslation(40, 0, -40);
        o.geometry.applyMatrix(matrixWorldInverse);
        o.geometry.applyMatrix(matrix);
        d.push(o);
        var g = THREE.BufferGeometryUtils.mergeBufferGeometries([result.geometry,object.geometry, mesh.geometry, o.geometry])
        result.geometry = g;
        var r = getElementByRandom(this.intersections).clone();
        if (r.position.set(-30, 0, 30), self.add(r), d.forEach(function(index) {
            /** @type {number} */
            var e = window.isMobile ? .2 : .35;
            if (Common.random() < e) {
                var id = getElementByRandom(this.carObjects).clone();
                var tab = new initCollisionPointsUpdate(this, id, index);
                self.add(tab);
                this.mobs.push(tab);
            }
        }, this), Common.random() > .65) {
            var hex = getElementByRandom(this.cloudObjects).clone();
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
                    object.material.defines[state.SHADOWMAP_TYPE] = true;
                }
            }
        }), self;
    },
    _generate : function() {
    /** @type {number} */
        var i = 0;
        for (; i < state.TABLE_SIZE; i++) {
            /** @type {number} */
            var x = 0;
            for (; x < state.TABLE_SIZE; x++) {
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
export {getNeighboringCarsUpdate};

