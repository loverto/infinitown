import * as THREE  from 'three';
import properties from 'module/state';

var ChunksScene = function() {
    THREE.Scene.call(this);
    this._pickables = [];
    this.chunks = [];
    this._initChunks();
};
ChunksScene.inherit(THREE.Scene, {
    _initChunks : function() {
        var j = 0;
        for (; j < properties.CHUNK_COUNT; j++) {
            var i = 0;
            for (; i < properties.CHUNK_COUNT; i++) {
                if (undefined === this.chunks[i]) {
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
        var left = (properties.CHUNK_COUNT - 1) / 2 * -properties.CHUNK_SIZE;
        var i = left;
        data.rotation.x = -Math.PI / 2
        data.centeredX = x - Math.floor(properties.CHUNK_COUNT / 2)
        data.centeredY = time - Math.floor(properties.CHUNK_COUNT / 2)
        data.material.visible = false
        this._pickables.push(data)
        settings.position.x = left + x * properties.CHUNK_SIZE
        settings.position.z = i + time * properties.CHUNK_SIZE
        settings.centeredX = data.centeredX
        settings.centeredY = data.centeredY
        settings.material = data.material
        settings.add(data)
        return settings;
    },
    getPickables : function() {
        return this._pickables;
    },
    forEachChunk : function(func) {
        var i = 0;
        for (; i < properties.CHUNK_COUNT; i++) {
            var j = 0;
            for (; j < properties.CHUNK_COUNT; j++) {
                var value = this.chunks[i][j];
                func(value, value.centeredX, value.centeredY);
            }
        }
    }
});

export default ChunksScene;

