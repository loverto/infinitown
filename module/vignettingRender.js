
import value from 'module/threejsInitional';
/**
 * @return {undefined}
 */
var vignettingRender = function() {
    this._quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
    /** @type {boolean} */
    this._quad.frustumCulled = false;
    // 新建正交相机
    this._camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this._scene = new THREE.Scene;
    this._scene.add(this._quad);
    // 设置基础的材质
    this._quad.material = new THREE.MeshBasicMaterial({
        map : value.getTexture('textures/vignetting.png'),
        transparent : true,
        opacity : .25
    });
};
vignettingRender.inherit(Object, {
    render : function(renderer) {
        renderer.render(this._scene, this._camera);
    }
});

/** @type {function(): undefined} */
export default vignettingRender;

