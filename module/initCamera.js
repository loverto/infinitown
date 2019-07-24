import * as THREE  from 'three';
import initDrawCallsCounter from 'module/initDrawCallsCounter';
import 'module/LineSegmentsInit'
import constants from 'module/state';
import 'module/PerspectiveCameraUpdate'
import 'module/OrthographicCameraBase'
import {PerspectiveCameraCtor} from  'module/PerspectiveCameraCtor';
import 'module/BasicShaderMaterial'
import {getNeighboringCarsUpdate} from 'module/getNeighboringCarsUpdate';
import ChunksScene from 'module/ChunksScene';
import EventHandler from 'module/jqueryEventHandler';
import VectorDrag from 'module/VectorDrag';
import vignettingRender from 'module/vignettingRender';

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
    /**
     * 开始
     * @param objects
     */
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
            this._lastPinchScale = 1;
            this.controls.enabled = false;
        }, this);
        this.inputManager.on('pinchend', function() {
            this.controls.enabled = true;
        }, this);
        this.inputManager.on('pinchchange', function(uv3v) {
            var v1y = 10;
            var value = (uv3v - this._lastPinchScale) * v1y;
            this.camera.updateHeight(value);
            this._lastPinchScale = uv3v;
        }, this);
        initDrawCallsCounter.prototype.start.call(this);
    },
    /**
     * 初始化光线
     */
    initDirLight : function() {
        var light = new THREE.DirectionalLight(16774618, 1.25);
        light.position.set(100, 150, -40);
        this.chunkScene.add(light);
        this.chunkScene.add(light.target);
        this.dirLight = light;
        light.castShadow = true;
        light.shadow.radius = 1;
        light.shadow.bias = -.001;
        light.shadow.mapSize.width = constants.SHADOWMAP_RESOLUTION;
        light.shadow.mapSize.height = constants.SHADOWMAP_RESOLUTION;
        light.shadow.camera.near = 50;
        light.shadow.camera.far = 300;
        this._resizeShadowMapFrustum(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    },
    /**
     * 初始化插图
     */
    initVignetting : function() {
        this.vignetting = new vignettingRender;
    },
    /**
     * 设置大小
     * @param width
     * @param height
     */
    setSize : function(width, height) {
        initDrawCallsCounter.prototype.setSize.call(this, width, height);
        if (this.dirLight) {
            this._resizeShadowMapFrustum(width, height);
        }
    },
    /**
     * 初始化相机
     */
    initCamera : function() {
        var psisq = 120;
        Math.tan(constants.CAMERA_ANGLE) * Math.sqrt(2 * Math.pow(psisq, 2));
        this.camera = new PerspectiveCameraCtor(30, window.innerWidth / window.innerHeight, 10, 400);
        this.camera.position.set(80, 140, 80);
        this.camera.lookAt(new THREE.Vector3);
        this.camera.position.y = 200;
    },
    /**
     * 刷新块场景
     */
    refreshChunkScene : function() {
        this.chunkScene.forEachChunk(function(results, columnGap, a) {
            var body = this.gridCoords.x + columnGap;
            var val = this.gridCoords.y + a;
            var v = this.table.getChunkData(body, val);
            results.remove(results.getObjectByName('chunk'));
            results.add(v.node);
        }.bind(this));
    },
    /**
     * 更新
     * @param val
     */
    update : function(val) {
        this.controls.update();
        this.table.update(val);
        this.camera.update();
        initDrawCallsCounter.prototype.update.call(this, val);
    },
    /**
     * 渲染
     * @param text
     */
    render : function(text) {
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
    /**
     * 刷新阴影
     * @param width
     * @param height
     * @private
     */
    _resizeShadowMapFrustum : function(width, height) {
        var start = 1.25;
        var childStartView2 = Math.max(width / height, start);
        var halfHeight = 75 * childStartView2;
        this.dirLight.shadow.camera.left = .9 * -halfHeight;
        this.dirLight.shadow.camera.right = 1.3 * halfHeight;
        this.dirLight.shadow.camera.top = halfHeight;
        this.dirLight.shadow.camera.bottom = -halfHeight;
        this.dirLight.shadow.camera.updateProjectionMatrix();
    }
});

export default InitCamera;

