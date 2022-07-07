import * as THREE  from 'three';
import {PerspectiveCamera} from "three";
// 透视相机
var ctor = THREE.PerspectiveCamera;
var value = new THREE.Vector3;

class PerspectiveCameraCtor extends PerspectiveCamera{
    constructor(fov,aspect, near, far) {
        super(fov,aspect, near, far);
        this.targetHeight = 140;
        /**
         * 更新高度
         */
        this.updateHeight = function() {
            var x = 1000;
            var vertCoords = -100;
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

