import * as THREE  from 'three';
import 'three/examples/js/utils/BufferGeometryUtils'
import state from 'module/state';
import Car from 'module/car';
import Buffer from 'module/cloud';
import Common from 'module/types';

/**
 * 随机获取数组中的元素
 * @param options
 * @returns {*}
 */
function getElementByRandom(options) {
    return options[Math.floor(Common.random() * options.length)];
}

/**
 * 获得邻近汽车更新
 * @param blocksObjects 块数据
 * @param lanesObjects 车到数据
 * @param intersectionsObjects 十字路口数据
 * @param carsObjects 车数据
 * @param cloudsObjects 云数据
 */
var Table = function(blocksObjects, lanesObjects, intersectionsObjects, carsObjects, cloudsObjects) {
    // 是否包含体育场
    this._containsStadium = false;
    //
    this.blocks = blocksObjects;
    // 车道
    this.lanes = [];
    // 十字路口
    this.intersections = intersectionsObjects;
    // 车
    this.carObjects = carsObjects;
    // 可以移动的对象，比如车和云
    this.mobs = [];
    // 大块的信息
    this.chunks = [];
    // 云
    this.cloudObjects = cloudsObjects;
    // 遍历车道，根据类型不同来初始化不同的数据
    lanesObjects.forEach(function(lane) {
        switch(lane.name) {
            // 类型为1的路加十个
        case 'Road_Lane_01_fixed':
            var e = 0;
            for (; e < 10; e++) {
                this.lanes.push(lane);
            }
            break;
            //类型为3的加5个
        case 'Road_Lane_03_fixed':
            e = 0;
            for (; e < 5; e++) {
                this.lanes.push(lane);
            }
        }
    }, this);
    this._generate();
};
Table.inherit(Object, {
    /**
     * 获取大块的数据
     * @param x
     * @param y
     * @returns {*}
     */
    getChunkData : function(x, y) {
        // 与坐标x取余
        x = x % state.TABLE_SIZE
        // 与坐标y取余
        y = y % state.TABLE_SIZE
        // 如果小于0 则x的值为表格值加x
        x < 0 && (x = state.TABLE_SIZE + x)
        // 如果小于0 则y的值为表格值加y
        y < 0 && (y = state.TABLE_SIZE + y)
        if (undefined !== this.chunks[x]){
            if (undefined !== this.chunks[x][y]) {
                return this.chunks[x][y];
            }
        }
    },
    /**
     * 获取相邻的车
     */
    getNeighboringCars : function() {
    // 获取相邻的车
        var neighCars = [];

        return function(s) {
            neighCars.length = 0
            s.parent.traverse(function(sub) {
                // 把周围的车获取到，并存储在数组中
                if ('car' === sub.name && sub !== s) {
                    neighCars.push(sub);
                }
            })
            this._forEachNeighboringChunk(s.parent.tableX, s.parent.tableY, function(spUtils) {
                // 遍历相邻的块
                spUtils.traverse(function(e) {
                    if ('car' === e.name) {
                        neighCars.push(e);
                    }
                });
            })
            return neighCars;
        };
    }(),
    /**
     * 更新
     * @param target
     */
    update : function(target) {
        this.mobs.forEach(function(e) {
            e.update(target);
        });
    },
    /**
     * 遍历每个相邻块
     */
    _forEachNeighboringChunk : function() {
        // 遍历相邻的分块
        var menu = new THREE.Vector2;
        // 初始化区块的矩阵坐标
        var pipelets = [new THREE.Vector2(-1, -1), new THREE.Vector2(1, 0), new THREE.Vector2(1, 0), new THREE.Vector2(0, 1), new THREE.Vector2(0, 1), new THREE.Vector2(-1, 0), new THREE.Vector2(-1, 0), new THREE.Vector2(0, -1)];
        return function(x, y , callback) {
            menu.set(x, y);
            pipelets.forEach(function(vector2) {
                menu.add(vector2);
                // 获取分块中的数据
                var each1 = this.getChunkData(menu.x, menu.y);
                if (each1) {
                    callback(each1.node);
                }
            }, this);
        };
    }(),
    /**
     * 获取相邻的大厦建筑
     */
    _getNeighboringBlocks : function() {
        var parkNames = [];
        // 根据坐标遍历四周的相邻大厦建筑
        return function(x, y) {
            parkNames.length = 0
            this._forEachNeighboringChunk(x, y, function(dep) {
                parkNames.push(dep.block.name);
            })
            return parkNames;
        };
    }(),
    /**
     * 获取随机大厦
     * @param pieceX
     * @param pieceY
     * @returns {*}
     * @private
     */
    _getRandomBlockAt : function(pieceX, pieceY) {
        var block;
        var i = 0;
        // 获取相邻的块
        var piece = this._getNeighboringBlocks(pieceX, pieceY);
        for (; i < 100;) {
            var randomBlock = getElementByRandom(this.blocks).clone();
            var name = randomBlock.name;
            // 足球场，是体育馆
            if ('block_8_merged' === name) {
                // 如果该大块中已经有足球场了，则跳过，
                if (this._containsStadium) {
                    i++;
                    continue;
                }
                //
                this._containsStadium = true;
                block = randomBlock;
                break;
            }
            if (piece.indexOf(name) === -1) {
                block = randomBlock;
                break;
            }
            i++;
        }
        return block;
    },
    /**
     * 获取随机大块
     * @param x
     * @param y
     * @returns {Object3D}
     * @private
     */
    _getRandomChunk : function(x, y) {
        // 创建矩阵
        var matrix = new THREE.Matrix4;
        // 矩阵世界反向
        var matrixWorldInverse = (new THREE.Matrix4).makeRotationY(Math.PI / 2);
        // 随机的3d对象大块
        var randomChunkObject3 = new THREE.Object3D;
        // 设置默认名称
        randomChunkObject3.name = 'chunk';
        // 获取随机的大厦建筑
        var block = this._getRandomBlockAt(x, y);
        var defaultYPos = Math.round(4 * Common.random()) * (Math.PI / 2);
        // 设置建筑转动轴
        block.rotation.y = defaultYPos;
        // 设置建筑位置
        block.position.set(0, 0, 0);
        // 把建筑加入到大块的3d对象中
        randomChunkObject3.add(block);
        // 设置建筑属性信息
        randomChunkObject3.block = block;
        // 随机车道信息，用来存储获取的随机四个车道
        var randomLanes = [];
        // 随机取第一个车道
        var randomFirstLane = getElementByRandom(this.lanes).clone();
        // 设置车道位置
        randomFirstLane.position.set(-30, 0, 10);
        // 添加车道1信息
        randomChunkObject3.add(randomFirstLane);
        randomLanes.push(randomFirstLane);
        // 随即取第二个车道
        var randomSecondLane = getElementByRandom(this.lanes).clone();
        randomSecondLane.position.set(-30, 0, -10);
        matrix.makeTranslation(0, 0, -20);
        randomSecondLane.geometry = randomSecondLane.geometry.clone();
        randomFirstLane.geometry = randomFirstLane.geometry.clone();
        randomSecondLane.geometry.applyMatrix(matrix);
        randomLanes.push(randomSecondLane);
        // 随机取第三个车道
        var randomThirdLane = getElementByRandom(this.lanes).clone();
        randomThirdLane.position.set(-10, 0, -30);
        randomThirdLane.rotation.y = Math.PI / 2;
        randomLanes.push(randomThirdLane);
        matrix.makeTranslation(20, 0, -40);
        randomThirdLane.geometry = randomThirdLane.geometry.clone();
        randomThirdLane.geometry.applyMatrix(matrixWorldInverse);
        randomThirdLane.geometry.applyMatrix(matrix);
        // 随机取第四个车道
        var randomFourthLane = getElementByRandom(this.lanes).clone();
        randomFourthLane.geometry = randomFourthLane.geometry.clone();
        randomFourthLane.position.set(10, 0, -30);
        randomFourthLane.rotation.y = Math.PI / 2;
        matrix.makeTranslation(40, 0, -40);
        randomFourthLane.geometry.applyMatrix(matrixWorldInverse);
        randomFourthLane.geometry.applyMatrix(matrix);
        randomLanes.push(randomFourthLane);
        var g = THREE.BufferGeometryUtils.mergeBufferGeometries([randomFirstLane.geometry,randomSecondLane.geometry, randomThirdLane.geometry, randomFourthLane.geometry])
        randomFirstLane.geometry = g;
        // 随机获取一个十字路口
        var randomFirstIntersection = getElementByRandom(this.intersections).clone();
        randomFirstIntersection.position.set(-30, 0, 30)
        randomChunkObject3.add(randomFirstIntersection)
        // 遍历随机生成的车道，根据情况在车道上生成车辆
        randomLanes.forEach(function(randomLane) {
            // 随即因子，移动设备上设置的小一点，pc设备上设置的大一点，可以有效地优化移动端性能
            var e = window.isMobile ? .2 : .35;
            if (Common.random() < e) {
                // 在随机生成的道路上，随机生成一个车
                var randomFirstCar = getElementByRandom(this.carObjects).clone();
                // 生成车
                var car = new Car(this, randomFirstCar, randomLane);
                // 添加车的对象
                randomChunkObject3.add(car);
                // 把车放到可移动的对象数组里
                this.mobs.push(car);
            }
        }, this)
        if (Common.random() > .65) {
            var randomFirstCloud = getElementByRandom(this.cloudObjects).clone();
            var b = new Buffer(this, randomFirstCloud);
            randomChunkObject3.add(b);
            this.mobs.push(b);
        }
        // 遍历3d对象
        randomChunkObject3.traverse(function(object3D) {
            // 如果3d对象属于mesh 并且3d对象有材料，且材料是pbr，那么进行处理
            if (object3D instanceof THREE.Mesh && object3D.material && object3D.material.pbr) {
                // 启动材料的Fog
                object3D.material.defines.USE_FOG = true;
                // 如果对象不属于updateTablePositionRender 对象
                if (object3D instanceof Buffer == false) {
                    // 设置接受影子
                    object3D.receiveShadow = true;
                    // 启动材料影子
                    object3D.material.defines.USE_SHADOWMAP = true;
                    // 设置材料影子类型
                    object3D.material.defines[state.SHADOWMAP_TYPE] = true;
                }
            }
        })
        return randomChunkObject3;
    },
    /**
     * 生成
     * @private
     */
    _generate : function() {
        // 根据配置信息生成一个9x9的格子
        var i = 0;
        for (; i < state.TABLE_SIZE; i++) {
            var x = 0;
            for (; x < state.TABLE_SIZE; x++) {
                if (undefined === this.chunks[x]) {
                    this.chunks[x] = [];
                }
                // 获取随机的分块，根据当前的坐标
                // 根据坐标获取大块
                var node = this._getRandomChunk(x, i);
                node.tableX = x;
                node.tableY = i;
                this.chunks[x][i] = {
                    node : node
                };
            }
        }
    }
});

export {Table};
