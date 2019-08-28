import * as THREE  from 'three';
import LoaderUtils from 'module/LoaderUtils';

class vignettingRender extends Object{
    /**
     * 处理光晕
     */
    constructor() {
        super();
        // 平面缓冲几何
        this.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
        //截锥体剔除
        this.mesh.frustumCulled = false;
        // 新建正交相机
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this._scene = new THREE.Scene;
        this._scene.add(this.mesh);
        // 设置基础的材质
        this.mesh.material = new THREE.MeshBasicMaterial({
            map : LoaderUtils.getTexture('textures/vignetting.png'),
            transparent : true,
            opacity : .25
        });
    }

    /**
     * 渲染光晕
     * @param renderer
     */
    render(renderer) {
        // 渲染场景的相机是正交相机，场景内容是一个中间透明，四个脚是黑色的光晕图
        renderer.render(this._scene, this.camera);
    }
}

export default vignettingRender;

