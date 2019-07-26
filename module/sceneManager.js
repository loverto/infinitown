import * as THREE  from 'three';
import BaseSceneManager from 'module/BaseSceneManager';
import 'module/LineSegmentsInit'
import constants from 'module/state';
import 'module/PerspectiveCameraUpdate'
import 'module/OrthographicCameraBase'
import {PerspectiveCameraCtor} from  'module/PerspectiveCameraCtor';
import 'module/BasicShaderMaterial'
import {Table} from 'module/table';
import ChunksScene from 'module/ChunksScene';
import EventHandler from 'module/jqueryEventHandler';
import DragControls from 'module/DragControls';
import vignettingRender from 'module/vignettingRender';

/**
 * 场景管理
 * @param data
 * @constructor
 */
var SceneManager = function(data) {
    BaseSceneManager.call(this, data);
    // 初始化相机
    this.initCamera();
    // 绘制坐标系
    this.gridCoords = new THREE.Vector2;
    // 相机偏差
    this.cameraOffset = new THREE.Vector2;
    // 场景
    this.scene = new THREE.Scene;
};
SceneManager.inherit(BaseSceneManager, {
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
        // 获得邻近汽车更新
        this.table = new Table(blocksChildren, lanesChildren, intersectionsChildren, carsChildren, cloudsChildren);
        // 大块场景
        this.chunkScene = new ChunksScene;
        //添加场景
        this.scene.add(this.chunkScene);
        // 给canvas 注册操作事件
        this.inputManager = new EventHandler(document.querySelector('canvas'));
        // 场景控制
        this.controls = new DragControls(this.inputManager, this.chunkScene, this.camera);
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
            // 如果移动场景的话就刷新大块场景
            this.refreshChunkScene();
        }, this);
        // 刷新分块场景
        this.refreshChunkScene();
        // 注册开始拖动开始事件，如果拖动的话，给body添加拖动样式
        this.inputManager.on('startdrag', function() {
            $('body').addClass('grabbing');
        });
        // 注册开始拖动结束事件，如果拖动的话，给body移除拖动样式
        this.inputManager.on('enddrag', function() {
            $('body').removeClass('grabbing');
        });
        // 注册鼠标滚动事件，如果滚动的话的话，调整相机的高度
        this.inputManager.on('mousewheel', function(value) {
            this.camera.updateHeight(value);
        }, this);
        // 注册开始捏事件，如果捏的话，
        this.inputManager.on('pinchstart', function() {
            this._lastPinchScale = 1;
            this.controls.enabled = false;
        }, this);
        // 注册结束捏事件，如果捏的话，
        this.inputManager.on('pinchend', function() {
            this.controls.enabled = true;
        }, this);
        // 注册捏之后的事件，如果捏之后的话，调整相机高度
        this.inputManager.on('pinchchange', function(uv3v) {
            var v1y = 10;
            var value = (uv3v - this._lastPinchScale) * v1y;
            this.camera.updateHeight(value);
            this._lastPinchScale = uv3v;
        }, this);
        // 调用父类的开始方法
        BaseSceneManager.prototype.start.call(this);
    },
    /**
     * 初始化光线
     */
    initDirLight : function() {
        // '#fff5da' 白色光
        //创建定向光，颜色为白色,光的强度为1.25
        var light = new THREE.DirectionalLight(0xfff5da, 1.25);
        // 设置光源位置，
        light.position.set(100, 150, -40);
        // 大块场景 添加上定向光源
        this.chunkScene.add(light);
        // 大块场景添加定向光源的目标
        this.chunkScene.add(light.target);
        // 定向光源赋值
        this.dirLight = light;
        // 光源开启影子
        light.castShadow = true;
        // 影子的半径
        light.shadow.radius = 1;
        // 影子偏差
        light.shadow.bias = -.001;
        // 影子在地图上解析的宽度
        light.shadow.mapSize.width = constants.SHADOWMAP_RESOLUTION;
        // 影子在地图上解析的高度
        light.shadow.mapSize.height = constants.SHADOWMAP_RESOLUTION;
        // 影子离相机最近50
        light.shadow.camera.near = 50;
        // 影子离相机最远300
        light.shadow.camera.far = 300;
        this._resizeShadowMapFrustum(window.innerWidth, window.innerHeight);
        // webgl 开启地图影子
        this.renderer.shadowMap.enabled = true;
        // webgl开启地图影子的类型
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
        BaseSceneManager.prototype.setSize.call(this, width, height);
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
        // 初始化透视相机
        this.camera = new PerspectiveCameraCtor(30, window.innerWidth / window.innerHeight, 10, 400);
        // 设定相机位置
        this.camera.position.set(80, 140, 80);
        // 给相机
        this.camera.lookAt(new THREE.Vector3);
        //单独设置相机y轴位置
        this.camera.position.y = 200;
    },
    /**
     * 刷新块场景
     */
    refreshChunkScene : function() {
        this.chunkScene.forEachChunk(function(chunk, chunkCenteredX, chunkCenteredY) {
            var coordX = this.gridCoords.x + chunkCenteredX;
            var coordY = this.gridCoords.y + chunkCenteredY;
            var chunkData = this.table.getChunkData(coordX, coordY);
            chunk.remove(chunk.getObjectByName('chunk'));
            chunk.add(chunkData.node);
        }.bind(this));
    },
    /**
     * 更新
     * @param data
     */
    update : function(data) {
        // 更新控制事件
        this.controls.update();
        // 更新场景布局中的可移动内容
        this.table.update(data);
        // 更新相机
        this.camera.update();
        BaseSceneManager.prototype.update.call(this, data);
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
        // 清空
        this.renderer.clear();
        // 调用父类BaseSceneManager中的渲染场景函数
        this.renderScene(this.scene, this.camera);
        //
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

export default SceneManager;

