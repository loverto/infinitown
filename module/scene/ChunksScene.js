import * as THREE  from 'three';
import GlobalConfig from 'module/config/GlobalConfig';
import {Scene} from "three";

/**
 * 大块场景
 */
class ChunksScene extends Scene{
    constructor() {
        super();
        this._pickables = [];
        this.chunks = [];
        this._initChunks();
    }
    _initChunks() {
        var j = 0;
        for (; j < GlobalConfig.CHUNK_COUNT; j++) {
            var i = 0;
            for (; i < GlobalConfig.CHUNK_COUNT; i++) {
                if (undefined === this.chunks[i]) {
                    this.chunks[i] = [];
                }
                var id = this._createChunkAt(i, j);
                this.chunks[i][j] = id;
                this.add(id);
            }
        }
    }
    _createChunkAt(x, time) {
        var chunk = new THREE.Object3D;
        // 平面几何
        var geometry = new THREE.PlaneGeometry(GlobalConfig.CHUNK_SIZE, GlobalConfig.CHUNK_SIZE, 1, 1);
        // 网格基础材料
        var material = new THREE.MeshBasicMaterial;
        // 创建网格
        var data = new THREE.Mesh(geometry, material);
        var left = (GlobalConfig.CHUNK_COUNT - 1) / 2 * -GlobalConfig.CHUNK_SIZE;
        var i = left;
        // 设置旋转轴x
        data.rotation.x = -Math.PI / 2
        // 设置中央点X
        data.centeredX = x - Math.floor(GlobalConfig.CHUNK_COUNT / 2)
        // 设置中央点Y
        data.centeredY = time - Math.floor(GlobalConfig.CHUNK_COUNT / 2)
        // 设置材料不可见
        data.material.visible = false
        this._pickables.push(data)
        chunk.position.x = left + x * GlobalConfig.CHUNK_SIZE
        chunk.position.z = i + time * GlobalConfig.CHUNK_SIZE
        chunk.centeredX = data.centeredX
        chunk.centeredY = data.centeredY
        chunk.material = data.material
        chunk.add(data)
        return chunk;
    }
    getPickables() {
        return this._pickables;
    }
    /**
     * 遍历大块
     * @param callback
     */
    forEachChunk(callback) {
        var i = 0;
        for (; i < GlobalConfig.CHUNK_COUNT; i++) {
            var j = 0;
            for (; j < GlobalConfig.CHUNK_COUNT; j++) {
                var chunk = this.chunks[i][j];
                callback(chunk, chunk.centeredX, chunk.centeredY);
            }
        }
    }
}


export default ChunksScene;

