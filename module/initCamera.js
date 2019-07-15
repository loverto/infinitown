import * as THREE  from 'three';
import initDrawCallsCounter from 'module/initDrawCallsCounter';
var constants = (require('module/LineSegmentsInit'), require('module/state'));
require('module/PerspectiveCameraUpdate')
require('module/OrthographicCameraBase')
import {PerspectiveCameraCtor} from  'module/PerspectiveCameraCtor';
require('module/Class')
import {getNeighboringCarsUpdate} from 'module/getNeighboringCarsUpdate';
import ChunksScene from 'module/ChunksScene';
import EventHandler from 'module/jqueryEventHandler';
import VectorDrag from 'module/VectorDrag';
import vignettingRender from 'module/vignettingRender';
/**
 * @param {!Function} data
 * @return {undefined}
 */
var InitCamera = function(data) {
    initDrawCallsCounter.call(this, data);
    // 初始化相机
    this.initCamera();
    // 绘制坐标系
    this.gridCoords = new THREE.Vector2;
    // 相机偏差
    this.cameraOffset = new THREE.Vector2;
    // 场景
    this.scene = new THREE.Scene;
};
InitCamera.inherit(initDrawCallsCounter, {
    start : function(objects) {
        // 开始处理加载的数据
        var blocksChildren = objects.getObjectByName('blocks').children;
        var lanesChildren = objects.getObjectByName('lanes').children;
        var intersectionsChildren = objects.getObjectByName('intersections').children;
        var carsChildren = objects.getObjectByName('cars').children;
        var cloudsChildren = objects.getObjectByName('clouds').children;
        this.table = new getNeighboringCarsUpdate(blocksChildren, lanesChildren, intersectionsChildren, carsChildren, cloudsChildren);
        this.chunkScene = new ChunksScene;
        //添加场景
        this.scene.add(this.chunkScene);
        // 给canvas 注册操作事件
        this.inputManager = new EventHandler(document.querySelector('canvas'));
        // 场景控制
        this.controls = new VectorDrag(this.inputManager, this.chunkScene, this.camera);
        // 渲染器清空颜色
        this.renderer.setClearColor(constants.FOG_COLOR);
        // 初始化 定向光
        this.initDirLight();
        // 设置光晕
        this.initVignetting();
        // 交互控制操作添加移动操作
        this.controls.on('move', function(eastPx, vertSpeed) {
            this.gridCoords.x += eastPx;
            this.gridCoords.y += vertSpeed;
            this.refreshChunkScene();
        }, this);
        // 刷新分块场景
        this.refreshChunkScene();
        this.inputManager.on('startdrag', function() {
            $('body').addClass('grabbing');
        });
        this.inputManager.on('enddrag', function() {
            $('body').removeClass('grabbing');
        });
        this.inputManager.on('mousewheel', function(value) {
            this.camera.updateHeight(value);
        }, this);
        this.inputManager.on('pinchstart', function() {
            /** @type {number} */
            this._lastPinchScale = 1;
            /** @type {boolean} */
            this.controls.enabled = false;
        }, this);
        this.inputManager.on('pinchend', function() {
            /** @type {boolean} */
            this.controls.enabled = true;
        }, this);
        this.inputManager.on('pinchchange', function(uv3v) {
            /** @type {number} */
            var v1y = 10;
            /** @type {number} */
            var value = (uv3v - this._lastPinchScale) * v1y;
            this.camera.updateHeight(value);
            /** @type {number} */
            this._lastPinchScale = uv3v;
        }, this);
        initDrawCallsCounter.prototype.start.call(this);
    },
    initDirLight : function() {
        var light = new THREE.DirectionalLight(16774618, 1.25);
        light.position.set(100, 150, -40);
        this.chunkScene.add(light);
        this.chunkScene.add(light.target);
        this.dirLight = light;
        /** @type {boolean} */
        light.castShadow = true;
        /** @type {number} */
        light.shadow.radius = 1;
        /** @type {number} */
        light.shadow.bias = -.001;
        light.shadow.mapSize.width = constants.SHADOWMAP_RESOLUTION;
        light.shadow.mapSize.height = constants.SHADOWMAP_RESOLUTION;
        /** @type {number} */
        light.shadow.camera.near = 50;
        /** @type {number} */
        light.shadow.camera.far = 300;
        this._resizeShadowMapFrustum(window.innerWidth, window.innerHeight);
        /** @type {boolean} */
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    },
    initVignetting : function() {
        this.vignetting = new vignettingRender;
    },
    setSize : function(size, val) {
        initDrawCallsCounter.prototype.setSize.call(this, size, val);
        if (this.dirLight) {
            this._resizeShadowMapFrustum(size, val);
        }
    },
    initCamera : function() {
    /** @type {number} */
        var psisq = 120;
        Math.tan(constants.CAMERA_ANGLE) * Math.sqrt(2 * Math.pow(psisq, 2));
        this.camera = new PerspectiveCameraCtor(30, window.innerWidth / window.innerHeight, 10, 400);
        this.camera.position.set(80, 140, 80);
        this.camera.lookAt(new THREE.Vector3);
        /** @type {number} */
        this.camera.position.y = 200;
    },
    refreshChunkScene : function() {
        this.chunkScene.forEachChunk(function(results, columnGap, a) {
            var body = this.gridCoords.x + columnGap;
            var val = this.gridCoords.y + a;
            var v = this.table.getChunkData(body, val);
            results.remove(results.getObjectByName('chunk'));
            results.add(v.node);
        }.bind(this));
    },
    update : function(val) {
        this.controls.update();
        this.table.update(val);
        this.camera.update();
        initDrawCallsCounter.prototype.update.call(this, val);
    },
    render : function(text) {
    /** @type {number} */
        var totalPlayers = 0;
        var mapFragmentAndProps = function() {
            if (this.config.logCalls) {
                totalPlayers = totalPlayers + this.renderer.info.render.calls;
            }
        }.bind(this);
        this.renderer.clear();
        this.renderScene(this.scene, this.camera);
        mapFragmentAndProps();
        if (this.vignetting) {
            this.vignetting.render(this.renderer);
            mapFragmentAndProps();
        }
        if (this.config.logCalls) {
            this.dcCounter.textContent = totalPlayers + ' DC';
        }
    },
    _resizeShadowMapFrustum : function(count, steps) {
    /** @type {number} */
        var start = 1.25;
        /** @type {number} */
        var childStartView2 = Math.max(count / steps, start);
        /** @type {number} */
        var halfHeight = 75 * childStartView2;
        /** @type {number} */
        this.dirLight.shadow.camera.left = .9 * -halfHeight;
        /** @type {number} */
        this.dirLight.shadow.camera.right = 1.3 * halfHeight;
        /** @type {number} */
        this.dirLight.shadow.camera.top = halfHeight;
        /** @type {number} */
        this.dirLight.shadow.camera.bottom = -halfHeight;
        this.dirLight.shadow.camera.updateProjectionMatrix();
    }
});

/** @type {function(!Function): undefined} */
export default InitCamera;

