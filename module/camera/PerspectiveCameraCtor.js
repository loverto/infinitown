import * as THREE  from 'three';
import {PerspectiveCamera} from "three";
// 透视相机
var ctor = THREE.PerspectiveCamera;
var value = new THREE.Vector3;

/**
 * 透视相机构造函数
 * @constructor
 * @param fov {number} 视角
 * @param aspect {number} 宽高比
 * @param near {number} 近裁剪面
 * @param far {number} 远裁剪面
 * @extends PerspectiveCamera
 * @example
 * var camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
 * camera.position.set(0, 0, 100);
 * camera.lookAt(new THREE.Vector3(0, 0, 0));
 * scene.add(camera);
 * @example
 */
class PerspectiveCameraCtor extends PerspectiveCamera{
    constructor(fov,aspect, near, far) {
        super(fov,aspect, near, far);
        this.targetHeight = 140;
        /**
         * 更新高度
         */
        this.updateHeight = function() {
            let x = 1000;
            const vertCoords = -100;
            return function(i, canCreateDiscussions) {
                i = i * vertCoords;
                x = x + i;
                x = Math.min(Math.max(x + i, 0), 1E3);
                this.targetHeight = THREE.Math.mapLinear(x, 0, 1E3, 30, 140);
                if (canCreateDiscussions) {
                    this.position.y = this.targetHeight;
                }
            };
        }()
    }


    update() {
        this.position.y += .05 * (this.targetHeight - this.position.y);
        this.lookAt(value);
    }
}

export default PerspectiveCameraCtor;

