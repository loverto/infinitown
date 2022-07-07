import ThreeOribitControls from 'three-orbit-controls';
import {PerspectiveCamera} from "three";

// 透视相机
class PerspectiveCameraUpdate extends PerspectiveCamera{
    /**
     * 透视相机
     * @param data
     * @constructor
     */
    constructor(data) {
        super()
        // 相机面向
        this.aspect = window.innerWidth / window.innerHeight;
        //
        this.fov = 50;
        this.near = 1;
        this.far = 1000;
        this.updateProjectionMatrix();
        this.controls = new ThreeOribitControls(this, data || document.body);
    }

    update() {
        this.controls.update();
    }
}

export {PerspectiveCameraUpdate};
