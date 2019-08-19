import * as THREE  from 'three';
import utils from 'module/Utils';
import BaseMoveTableModel from 'module/BaseMoveTableModel';
var normal = new THREE.Vector3(0, 1, 0);

/**
 * 初始化车的位置
 * @param randomChunk
 * @param randomCar
 * @param randomLane
 * @constructor
 */
var Car = function(randomChunk, randomCar, randomLane) {
    BaseMoveTableModel.call(this, randomChunk);
    // 给车模型默认命名
    this.name = 'car';
    // 车的最大速度
    this.maxSpeed = .25;
    // 车的最小速度
    this.minSpeed = 0;
    // 车速默认为最大速度
    this.speed = this.maxSpeed;
    // 是否卡住
    this.stuck = false;
    // 重启计时
    this.restartTimer = null;
    this.add(randomCar);
    // 网格数据
    this.mesh = randomCar;
    // 判断是否是大车
    this._isLargeVehicle()
    // 雷达半径
    this.radarRadius = 20;

    // 设置位置,位置为随机车道上的位置
    this.position.copy(randomLane.position);
    var point = new THREE.Vector3(3.4, 0, 0);
    randomCar.rotation.copy(randomLane.rotation);
    // 设置点信息的轴角度，y为车的角度
    point.applyAxisAngle(normal, randomCar.rotation.y);
    // 如果随机数大于0.5 则直接在位置中添加点
    if (utils.random() > .5) {
        this.position.add(point);
    } else {
        randomCar.rotation.y += Math.PI;
        this.position.sub(point);
    }
    // 获取车的方向
    this.direction = randomCar.getWorldDirection().negate();
    this.direction.set(Math.round(this.direction.x), Math.round(this.direction.y), Math.round(this.direction.z));
    this._initCollisionPoints();
};
Car.inherit(BaseMoveTableModel, {
    /**
     * 添加雷达工具
     */
    addRadarHelper : function() {
        // 设置雷达扫描区域
        var circleGeometry = new THREE.CircleGeometry(this.radarRadius, 32, 0, Math.PI / 2);
        // 设置基础的材料颜色
        var meshBasicMaterial = new THREE.MeshBasicMaterial({
            color : 0xff00ff
        });
        // 设置Mesh
        var mesh = new THREE.Mesh(circleGeometry, meshBasicMaterial);
        mesh.rotation.order = 'YXZ';
        mesh.position.y = 1;
        mesh.rotation.x = -Math.PI / 2;
        mesh.rotation.y = this.mesh.rotation.y;
        this.add(mesh);
        this.helper = mesh;
    },
    /**
     * 检测所有的车
     * @param cars
     */
    detectCars : function(cars) {
        // 加减速度的频率
        var _speed = .0075;
        // 是否检测到有车
        var isNotDetectCars = true;
        // 已经检测过的车
        this.detectedCar = null;
        // for循环的初始下标
        var dataIndex = 0;
        for (; dataIndex < cars.length; dataIndex++) {
            // 如果检测到车，返回即将碰撞的车，即被检测的车
            var car = this.detectCar(cars[dataIndex]);
            if (car) {
                // 检测到有车
                isNotDetectCars = false;
                this.detectedCar = car;
                break;
            }
        }
        // 如果没有检测到车
        if (isNotDetectCars) {
            // 如果速度小于最大速度，则慢慢的增加速度
            if (this.speed < this.maxSpeed) {
                this.speed += _speed;
                // 如果速度值大于最大值，则取最大值
                this.speed = Math.min(this.speed, this.maxSpeed);
            }
            // 如果车卡住了
            if (this.stuck) {
                // 清空定时器
                clearTimeout(this.restartTimer);
                // 重置堵塞状态
                this.stuck = false;
                // 设置最小速度为0
                this.minSpeed = 0;
            }
        } else {
            // 减小速度
            this.speed -= _speed;
            // 速度最小减小到最小值
            this.speed = Math.max(this.speed, this.minSpeed);
            if (!(this.stuck || 0 !== this.speed)) {
                // 设置堵塞状态
                this.stuck = true;
                // 添加定时任务，
                this.restartTimer = setTimeout(function() {
                    this.minSpeed = .25 * this.maxSpeed;
                }.bind(this), 2000);
            }
        }
    },
    /**
     * 检测车
     */
    detectCar : function() {
        var directionTmp = new THREE.Vector3;
        var v2 = new THREE.Vector3;
        var tablePositionTmp = new THREE.Vector3;
        var tablePositionLastTmp = new THREE.Vector3;
        // 用来临时存储碰撞点的矩阵
        var materixTmp = new THREE.Vector3;
        return function(carObject) {
            // 如果检测到的车方法就是当前的方法
            var isSelf = carObject.detectedCar === this;
            // 是否碰撞
            var isCollision = false;
            // 如果是自己直接返回
            if (isSelf) {
                return null;
            }
            // 判断是否在十字路口并且车的方向与被检测的车的方向不一致
            if (this.isOnIntersection() && !carObject.isOnIntersection() && !this.direction.equals(carObject.direction)) {
                return null;
            }
            // 更新矩阵
            carObject.updateMatrix();
            // 获取当前车的方向
            directionTmp.copy(this.direction);
            // 应用轴角度
            directionTmp.applyAxisAngle(normal, -Math.PI / 4);
            // 获取表格位置
            utils.getTablePosition(this.position, this.parent.tableX, this.parent.tableY, tablePositionTmp);
            var i = 0;
            // 遍历车的碰撞点，碰撞点里有两个值，最大值和最小值
            for (; i < carObject.collisionPoints.length; i++) {
                var pos = carObject.collisionPoints[i];
                // 复制其中任意一个点，并应用车的矩阵
                materixTmp.copy(pos).applyMatrix4(carObject.matrix);
                // 根据这个点判断在，获取当前点在地图中的位置坐标
                utils.getTablePosition(materixTmp, carObject.parent.tableX, carObject.parent.tableY, tablePositionLastTmp);
                // 然后计算table地图中的距离，即计算两个点间的距离
                var length = tablePositionTmp.distanceTo(tablePositionLastTmp);
                // 如果距离小于等于雷达半径
                if (length <= this.radarRadius) {
                    // v2 为最后点位置和当前位置的差
                    v2.subVectors(tablePositionLastTmp, tablePositionTmp).normalize();
                    // 计算该vector和所传入v的点积
                    // 用来计算碰撞的相交范围
                    var delta = directionTmp.dot(v2);
                    // 如果相交的值大于0.5 则
                    if (delta > .5) {
                        // 设置碰撞
                        isCollision = true;
                        break;
                    }
                }
            }
            return isCollision ? carObject : null;
        };
    }(),
    /**
     *  更新
     */
    update : function() {
        var directionTmp = new THREE.Vector3;
        return function() {
            // 给移动方向上加速度，将该向量与所传入的标量s进行相乘。
            directionTmp.copy(this.direction).multiplyScalar(this.speed);
            // 位置加上移动方向
            this.position.add(directionTmp);
            // 向量获取2位小数点
            utils.roundVector(this.position, 2);
            // 更新车在表格中的位置
            this._updateTablePosition();
            // 获取相邻的车辆
            var neighboringCars = this.table.getNeighboringCars(this);
            // 检测车
            this.detectCars(neighboringCars);
        };
    }(),
    /**
     * 检测是否在十字路上
     * @returns {boolean}
     */
    isOnIntersection : function() {
        return this.position.x < -20 && this.position.x > -40 && this.position.z < -20 && this.position.z > -40;
    },
    /**
     * 初始化车的碰撞点
     * @private
     */
    _initCollisionPoints : function() {
        // 创建盒子
        var box3 = new THREE.Box3;
        // 盒子包围着车
        box3.setFromObject(this.mesh);
        // 获取车最小的部位
        var box3Min = new THREE.Vector3;
        box3Min.copy(box3.min);
        this.worldToLocal(box3Min);
        // 设置最小部位的y轴值为1
        box3Min.y = 1;
        // 如果x轴的绝对值大于0 则最小部位的z轴值为0
        // 否则x值为0
        if (Math.abs(this.direction.x) > 0) {
            box3Min.z = 0;
        } else {
            box3Min.x = 0;
        }
        // 获取车最大的部位
        var box3Max = new THREE.Vector3;
        box3Max.copy(box3.max);
        this.worldToLocal(box3Max);
        // 设置最大部位的y轴值为1
        box3Max.y = 1;
        // 如果x轴的绝对值大于0 则最小部位的z轴值为0
        // 否则x值为0
        if (Math.abs(this.direction.x) > 0) {
            box3Max.z = 0;
        } else {
            box3Max.x = 0;
        }
        // 最大和最小的碰撞点存入碰撞监测点的数组中
        this.collisionPoints = [box3Min, box3Max];
        // 遍历碰撞数组，暂时无用
        this.collisionPoints.forEach(function(collisionItem) {
        }, this);
    },
    /**
     * 是否是大型车辆
     * @returns {boolean}
     * @private
     */
    _isLargeVehicle : function() {
        return this.mesh.name.indexOf('Bus') !== -1 || this.mesh.name.indexOf('Container') !== -1 || this.mesh.name.indexOf('Truck') !== -1;
    }
});

export default Car;

