import 'three-orbit-controls';
import {OrthographicCamera} from "three";

// 正交相机
class OrthographicCameraBase extends OrthographicCamera{
    constructor(hValue) {

        const r = window.innerWidth / window.innerHeight;

        let left1 = hValue / -2 * r;
        let right1 = hValue / 2 * r;
        let top1 = hValue / 2;
        let bottom1 = hValue / -2;
        let near1 = .01;
        let far1 = 500;

        super(left1,right1 ,top1 ,bottom1 ,near1,far1);

        this.left = left1;
        this.right = right1;
        this.top = top1;
        this.bottom = bottom1;
        this.near = near1;
        this.far = far1;

        this.updateProjectionMatrix();
    }

    update() {
    }
}

export default OrthographicCameraBase;

