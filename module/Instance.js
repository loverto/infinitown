import * as THREE from 'three';
import bluebird from 'bluebird';
import 'module/loader/BaseMaterialLoader';
import loaderUtils from 'module/utils/LoaderUtils';
import 'module/material/PBRMaterial'
import 'module/scene/LoadSceneManager'

class Instance {

    /**
     * 加载场景
     * @param name
     * @param data 数据或资源路径
     * @param scene 场景
     * @param callback
     * @returns {Promise}
     */
    static loadScene(name, data, scene, callback) {
        return new bluebird(function(resolve, reject) {
            // options.renderer
            var binaryGeometryBuffer = loaderUtils.getGeometry(name);
            // 设置二进制几何Buffer
            if (binaryGeometryBuffer) {
                console.log("设置二进制几何Buffer")
                loaderUtils.sceneLoader.setBinaryGeometryBuffer(binaryGeometryBuffer);
            }
            // 加载场景
            loaderUtils.loadScene(data + name + (callback || '.json')).spread(function(sceneParam, json) {
                // 声明相机
                var camera;
                // 置空物料信息
                sceneParam.materials = {};
                // 如果有相机，则获取相机
                if (sceneParam.cameras && sceneParam.cameras.length > 0) {
                    camera = sceneParam.cameras[0];
                }
                // 设置相机的面为当前计算机可视区域的宽/除以可视区域的高
                if (camera) {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    // 更新投影矩阵
                    camera.updateProjectionMatrix();
                } else {
                    // 如果没有创建相机的话，新创建一个透视相机，设置相应的参数，和相机的位置
                    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, .01, 2E3);
                    camera.position.set(-3.5, 2, 3);
                }
                var size = 100;
                var step = 10;
                // 网格辅助线
                var grid = new THREE.GridHelper(size, step);
                sceneParam.add(grid);
                // 辅助线
                var axesHelper = new THREE.AxesHelper(5);
                sceneParam.add(axesHelper);
                sceneParam.dirLights = [];
                // 横过
                sceneParam.traverse(function(camera) {
                    if (camera instanceof THREE.DirectionalLight) {
                        camera.position.set(0, 0, 5);
                        camera.quaternion.normalize();
                        camera.position.applyQuaternion(camera.quaternion);
                        camera.quaternion.set(0, 0, 0, 0);
                        camera.scale.set(1, 1, 1);
                        sceneParam.dirLights.push(camera);
                    }
                });
                // 动画Mixer
                var mixer = new THREE.AnimationMixer(sceneParam);
                var i = 0;
                for (; i < sceneParam.animations.length; i++) {
                    mixer.clipAction(sceneParam.animations[i]).play();
                }
                // 遍历给定的AST树。
                sceneParam.traverse(function(options) {
                    var material = options.material;
                    if (material && material.aoMap) {
                        !material.map;
                    }
                });
                sceneParam.traverse(function(box1) {
                    if ('Line' === box1.name) {
                        box1.material.linewidth = 10;
                        box1.material.color.setRGB(1, 0, 1);
                    }
                });
                sceneParam.traverse(function(node) {
                    if (node instanceof THREE.SpotLight) {
                        var p = new THREE.Vector3(0, 0, -1);
                        var sprite = new THREE.Object3D;
                        node.updateMatrixWorld();
                        node.localToWorld(p);
                        sprite.position.copy(p);
                        sceneParam.add(sprite);
                        node.target = sprite;
                    }
                    if (node.material) {
                        if (node.material.materials) {
                            node.material.materials.forEach(function(b) {
                                sceneParam.materials[b.uuid] = b;
                            });
                        } else {
                            sceneParam.materials[node.material.uuid] = node.material;
                        }
                    }
                });
                resolve(sceneParam);
            });
        });
    }
}


export default Instance;

