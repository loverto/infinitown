
import properties from 'module/state';
/**
 * @return {undefined}
 */
var ChunksScene = function() {
    THREE.Scene.call(this);
    /** @type {!Array} */
    this._pickables = [];
    /** @type {!Array} */
    this.chunks = [];
    this._initChunks();
};
ChunksScene.inherit(THREE.Scene, {
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
export default ChunksScene;

