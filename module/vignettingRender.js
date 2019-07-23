import * as THREE  from 'three';
import LoaderUtils from 'module/LoaderUtils';

var vignettingRender = function() {
    this.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
    this.mesh.frustumCulled = false;
    // 新建正交相机
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene = new THREE.Scene;
    this.scene.add(this.mesh);
    // 设置基础的材质
    this.mesh.material = new THREE.MeshBasicMaterial({
        map : LoaderUtils.getTexture('textures/vignetting.png'),
        transparent : true,
        opacity : .25
    });
};
vignettingRender.inherit(Object, {
    render : function(renderer) {
        renderer.render(this.scene, this.camera);
    }
});

export default vignettingRender;

