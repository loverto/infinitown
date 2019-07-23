import * as THREE  from 'three';
import state from 'module/state';
import types from 'module/types';
// 最小的缓存的行数60x9=540
var MIN_BUFFER_ROWS = state.CHUNK_SIZE * state.TABLE_SIZE;
// 欧几里得距离算法的工具
var distance = THREE.Math.euclideanModulo;
/**
 * @param {string} data
 * @return {undefined}
 */
var render = function(data) {
    THREE.Object3D.call(this);
    // 前一个块的值
    this.previousChunk = null;
    // 设置当前的表格信息
    this.table = data;
    // 表格位置
    this.tablePosition = new THREE.Vector3;
    // 表格最后的位置
    this.lastTablePosition = new THREE.Vector3;
    // 最后的位置
    this.lastPosition = new THREE.Vector3;
};
render.inherit(THREE.Object3D, {
    /**
     *  更新表格位置
     * @private
     */
    _updateTablePosition : function() {
        // 获取表格位置的值
        types.getTablePosition(this.position, this.parent.tableX, this.parent.tableY, this.tablePosition);
        // 如果表格最后位置为空，则用当前的表格位置给其赋值
        if (0 === this.lastTablePosition.length()) {
            this.lastTablePosition.copy(this.tablePosition);
        }
        // 当前表格的坐标的x值与最后表格x值的差
        var t = this.tablePosition.x - this.lastTablePosition.x;
        // 当前表格的坐标的z值与最后表格z值的差
        var e = this.tablePosition.z - this.lastTablePosition.z;
        // 把当前表格的位置信息赋值给最后表格
        this.lastTablePosition.copy(this.tablePosition);
        // 计算x坐标与最小缓存行的距离
        var i = Math.floor(distance(this.tablePosition.x + 40, MIN_BUFFER_ROWS) / state.CHUNK_SIZE);
        // 计算z坐标与最小缓存行的距离
        var name = Math.floor(distance(this.tablePosition.z + 40, MIN_BUFFER_ROWS) / state.CHUNK_SIZE);
        var context = this.parent;
        var dom = this.table.chunks[i][name].node;
        if (Math.abs(t) < 500 && Math.abs(t) > 20 && console.log('warp on X', t, context.tableX, dom.tableX), Math.abs(e) < 500 && Math.abs(e) > 20 && console.log('warp on Z', e, context.tableY, dom.tableY), this.previousChunk !== context && context !== dom, this.lastPosition.copy(this.position), dom !== context) {
            dom.add(this);
            var min_x = distance(this.position.x + 40, state.CHUNK_SIZE) - 40;
            var _depth = distance(this.position.z + 40, state.CHUNK_SIZE) - 40;
            this.position.x = min_x;
            this.position.z = _depth;
        }
        this.previousChunk = context;
    }
});

export default render;

