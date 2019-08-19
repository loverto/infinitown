import * as THREE  from 'three';
import globalConfig from 'module/GlobalConfig';
import utils from 'module/Utils';
// 最小的缓存的行数60x9=540
var MIN_BUFFER_ROWS = globalConfig.CHUNK_SIZE * globalConfig.TABLE_SIZE;
// 欧几里得距离算法的工具
var distance = THREE.Math.euclideanModulo;
/**
 * 可以移动的3d对象，该如何移动
 * @param data
 * @constructor
 */
var BaseMoveTableModel = function(data) {
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
BaseMoveTableModel.inherit(THREE.Object3D, {
    /**
     *  更新移动物体在表格中的位置
     * @private
     */
    _updateTablePosition : function() {
        // 获取表格位置的值
        utils.getTablePosition(this.position, this.parent.tableX, this.parent.tableY, this.tablePosition);
        // 如果表格最后位置为空，则用当前的表格位置给其赋值
        if (0 === this.lastTablePosition.length()) {
            this.lastTablePosition.copy(this.tablePosition);
        }
        // 当前表格的坐标的x值与最后表格x值的差
        var x = this.tablePosition.x - this.lastTablePosition.x;
        // 当前表格的坐标的z值与最后表格z值的差
        var z = this.tablePosition.z - this.lastTablePosition.z;
        // 把当前表格的位置信息赋值给最后表格
        this.lastTablePosition.copy(this.tablePosition);
        // 计算x坐标与最小缓存行的距离
        var xd = Math.floor(distance(this.tablePosition.x + 40, MIN_BUFFER_ROWS) / globalConfig.CHUNK_SIZE);
        // 计算z坐标与最小缓存行的距离
        var zd = Math.floor(distance(this.tablePosition.z + 40, MIN_BUFFER_ROWS) / globalConfig.CHUNK_SIZE);
        var context = this.parent;
        // 一个具体的chunk
        var node = this.table.chunks[xd][zd].node;
        if (Math.abs(x) < 500 && Math.abs(x) > 20) {
            console.log('warp on X', x, context.tableX, node.tableX)
        }
        if(Math.abs(z) < 500 && Math.abs(z) > 20){
            console.log('warp on Z', z, context.tableY, node.tableY)
        }
        //上一个块
        if ( this.previousChunk !== context){
            context !== node
        }
        //最后的位置
        this.lastPosition.copy(this.position)
        // 当前块不能是父块
        if (node !== context) {
            node.add(this);
            var xd = distance(this.position.x + 40, globalConfig.CHUNK_SIZE) - 40;
            var zd = distance(this.position.z + 40, globalConfig.CHUNK_SIZE) - 40;
            this.position.x = xd;
            this.position.z = zd;
        }
        this.previousChunk = context;
    }
});

export default BaseMoveTableModel;

