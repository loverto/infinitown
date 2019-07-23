import bluebird from 'bluebird';
import 'module/MaterialLoaderExtern';
import shape from 'module/LoaderUtils';
var instance = (require('module/PBRMaterial'), require('module/LoadSceneManager'), {});
/**
 * @param {string} name
 * @param {string} data 数据或资源路径
 * @param {!Object} options
 * @param {string} callback
 * @return {?}
 */
instance.loadScene = function(name, data, options, callback) {
    return new bluebird(function(resolve, reject) {
        var addedRenderer = (options.renderer, shape.getGeometry(name));
        // 设置二进制几何Buffer
        if (addedRenderer) {
            console.log("设置二进制几何Buffer")
            shape.sceneLoader.setBinaryGeometryBuffer(addedRenderer);
        }
        // 加载场景
        shape.loadScene(data + name + (callback || '.json')).spread(function(objects, json) {
            // 声明相机
            var camera;
            // 置空物料信息
            objects.materials = {};
            // 如果有相机，则获取相机
            if (objects.cameras && objects.cameras.length > 0) {
                camera = objects.cameras[0];
            }
            // 设置相机的面为当前计算机可视区域的宽/除以可视区域的高
            if (camera) {
                /** @type {number} */
                camera.aspect = window.innerWidth / window.innerHeight;
                // 更新投影矩阵
                camera.updateProjectionMatrix();
            } else {
                // 如果没有创建相机的话，新创建一个透视相机，设置相应的参数，和相机的位置
                camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, .01, 2E3);
                camera.position.set(-3.5, 2, 3);
            }
            /** @type {number} */
            var size = 100;
            /** @type {number} */
            var step = 10;
            var grid = new THREE.GridHelper(size, step);
            objects.add(grid);
            var s = new THREE.AxisHelper(5);
            objects.add(s);
            /** @type {!Array} */
            objects.dirLights = [];
            objects.traverse(function(camera) {
                if (camera instanceof THREE.DirectionalLight) {
                    camera.position.set(0, 0, 5);
                    camera.quaternion.normalize();
                    camera.position.applyQuaternion(camera.quaternion);
                    camera.quaternion.set(0, 0, 0, 0);
                    camera.scale.set(1, 1, 1);
                    objects.dirLights.push(camera);
                }
            });
            var mixer = new THREE.AnimationMixer(objects);
            /** @type {number} */
            var i = 0;
            for (; i < objects.animations.length; i++) {
                mixer.clipAction(objects.animations[i]).play();
            }
            objects.traverse(function(options) {
                var material = options.material;
                if (material && material.aoMap) {
                    !material.map;
                }
            });
            objects.traverse(function(box1) {
                if ('Line' === box1.name) {
                    /** @type {number} */
                    box1.material.linewidth = 10;
                    box1.material.color.setRGB(1, 0, 1);
                }
            });
            objects.traverse(function(node) {
                if (node instanceof THREE.SpotLight) {
                    var p = new THREE.Vector3(0, 0, -1);
                    var sprite = new THREE.Object3D;
                    node.updateMatrixWorld();
                    node.localToWorld(p);
                    sprite.position.copy(p);
                    objects.add(sprite);
                    node.target = sprite;
                }
                if (node.material) {
                    if (node.material.materials) {
                        node.material.materials.forEach(function(b) {
                            /** @type {number} */
                            objects.materials[b.uuid] = b;
                        });
                    } else {
                        objects.materials[node.material.uuid] = node.material;
                    }
                }
            });
            resolve(objects);
        });
    });
};
export default instance;

