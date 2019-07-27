import * as THREE  from 'three';
// 透视相机
var ctor = THREE.PerspectiveCamera;
var value = new THREE.Vector3;

 function PerspectiveCameraCtor() {
    ctor.apply(this, arguments);
    this.targetHeight = 140;
};
PerspectiveCameraCtor.inherit(ctor, {
    /**
     * 更新高度
     */
    updateHeight : function() {
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
    }(),
    update : function() {
        this.position.y += .05 * (this.targetHeight - this.position.y);
        this.lookAt(value);
    }
});

export default PerspectiveCameraCtor;

