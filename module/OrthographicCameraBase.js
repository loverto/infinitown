import * as THREE  from 'three';
import TubularModel from 'three-orbit-controls';
// 正交相机
var Base = THREE.OrthographicCamera;

var OrthographicCameraBase = (function(hValue) {
    Base.call(this);
    var r = window.innerWidth / window.innerHeight;
    this.left = hValue / -2 * r;
    this.right = hValue / 2 * r;
    this.top = hValue / 2;
    this.bottom = hValue / -2;
    this.near = .01;
    this.far = 500;
    this.updateProjectionMatrix();
});
OrthographicCameraBase.inherit(Base, {
    update : function() {
    }
});

export default OrthographicCameraBase;

