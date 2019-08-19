import * as THREE  from 'three';
import globalConfig from 'module/GlobalConfig';
import BaseMoveTableModel from 'module/BaseMoveTableModel';
import utils from 'module/Utils';
var ratio = .05;
var planetsSpeed = 2;

/**
 * 云
 * @param name
 * @param obj
 */
var Cloud = function(name, obj) {
    BaseMoveTableModel.call(this, name);
    this.add(obj);
    // 设置云的位置，位置随机生成（范围要在块的区域内）
    this.position.set(utils.random() * globalConfig.CHUNK_SIZE - globalConfig.CHUNK_SIZE / 2, 60, utils.random() * globalConfig.CHUNK_SIZE - globalConfig.CHUNK_SIZE / 2);
    // 设置延时，随机值
    this.delay = 5 * utils.random();
    // 速度变化，随机值
    this.speedModifier = .25 * utils.random() + 1;
    // 移动速度
    this.moveSpeed = .05 * this.speedModifier;
    // 最大标量
    this.maxScalar = this.scale.x + this.scale.x * ratio;
    // 最小标量
    this.minScalar = this.scale.x - this.scale.x * ratio;
    // 旋转轴为y
    this.rotation.y = .25;
    // 设置方向
    this.direction = new THREE.Vector3(-1, 0, .3);
};
Cloud.inherit(BaseMoveTableModel, {
    /**
     * 更新云的信息
     */
    update : function() {
        // 移动方向
        var directionTmp = new THREE.Vector3;
        return function(data) {
            // 获取地图中移动的线
            var mapLine = THREE.Math.mapLinear(Math.sin((this.delay + data.elapsed) * planetsSpeed), -1, 1, 0, 1);
            //
            this.scale.setScalar(this.minScalar + (this.maxScalar - this.minScalar) * mapLine);
            // 设置移动的方向
            directionTmp.copy(this.direction).multiplyScalar(this.moveSpeed);
            // 位置
            this.position.add(directionTmp);
            // 开始更新让云移动
            this._updateTablePosition();
        };
    }()
});

export default Cloud;

