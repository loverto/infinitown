import * as THREE  from 'three';
import constant from 'module/config/GlobalConfig';
import Events from 'module/event/Events';
var ndc = new THREE.Vector2;


class DragControls extends Events{
    /**
     * 拖动控件
     * @param inputManager
     * @param scene
     * @param camera
     * @constructor
     */
    constructor(inputManager, scene, camera) {
        super();
        // 是否平移
        this._panning = false;
        // 开始坐标
        this._startCoords = new THREE.Vector2;
        // 最后一个偏移
        this._lastOffset = new THREE.Vector2;
        // 偏差
        this._offset = new THREE.Vector2;
        // 平移速度
        this._speed = new THREE.Vector3(constant.PAN_SPEED, 0, constant.PAN_SPEED);
        // 场景偏移
        this._sceneOffset = new THREE.Vector3;
        // 世界偏移
        this._worldOffset = new THREE.Vector3;
        // 事件控制
        this.inputManager = inputManager;
        // 场景
        this._scene = scene;
        // 注册开始拖动事件
        this.inputManager.on('startdrag', this._onStartDrag, this);
        // 注册拖动结束事件
        this.inputManager.on('enddrag', this._onEndDrag, this);
        // 注册拖事件
        this.inputManager.on('drag', this._onDrag, this);
        // 相机
        this._camera = camera;
        // 光线投射相机
        this._raycaster = new THREE.Raycaster;
        // 是否启动
        this.enabled = true;
        /**
         * 更新
         */
        this.update = function() {
            var offset = new THREE.Vector2;
            var angle = new THREE.Vector2;
            var point = new THREE.Vector3;
            return function() {
                // 执行光线投射相机
                this.raycast();
                // 获取移动偏差
                offset.copy(this._offset);
                // 设置旋转角
                offset.rotateAround(angle, -Math.PI / 4);
                // 设置世界offset
                this._worldOffset.set(offset.x, 0, offset.y).multiply(this._speed);
                point.lerp(this._worldOffset, .05);
                // 场景位置添加向量
                this._scene.position.addVectors(this._sceneOffset, point);
            };
        }()

    }

    /**
     * 开始拖动
     */
    _onDrag(e) {
        const vector = new THREE.Vector2;
        // 如果当前在拖动可用，并且平移已经开启，给offset赋值
        if (this.enabled && this._panning) {
            vector.subVectors(e, this._startCoords);
            this._offset.addVectors(this._lastOffset, vector);
        }
    }

    /**
     * 开始拖动事件
     * @param e
     * @private
     */
    _onStartDrag(e) {
        // 如果启用状态，获取开始坐标，并且设置
        if (this.enabled) {
            // 平移开始
            this._panning = true;
            // 设置当前的坐标位置
            this._startCoords.set(e.x, e.y);
        }
    }
    /**
     * 结束拖动事件
     * @param e
     * @private
     */
    _onEndDrag(e) {
        // 如果当前块可用
        if (this.enabled) {
            // 结束平移
            this._panning = false;
            // 把offset的值赋值给lastOffset
            this._lastOffset.copy(this._offset);
        }
    }

    /**
     * 光线投射相机
     */
    raycast() {
        this._raycaster.setFromCamera(ndc, this._camera);
        // 获取交叉对象
        var intersectObjects = this._raycaster.intersectObjects(this._scene.getPickables());
        // 如果有交叉对象
        if (intersectObjects.length > 0) {
            // 获取第一个交叉对象
            var object = intersectObjects[0].object;
            // 获取场景offset
            this._sceneOffset.x += object.centeredX * constant.CHUNK_SIZE;
            this._sceneOffset.z += object.centeredY * constant.CHUNK_SIZE;
            // 如果对象不是正中心点，触发移动事件
            if (!(0 === object.centeredX && 0 === object.centeredY)) {
                this.trigger('move', object.centeredX, object.centeredY);
            }
        }
    }

}

export default DragControls;

