var town60 = function (parseValueFn, context, n) {
    var value = parseValueFn("15");
    /**
     * @return {undefined}
     */
    var init = function() {
        this._quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
        /** @type {boolean} */
        this._quad.frustumCulled = false;
        this._camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this._scene = new THREE.Scene;
        this._scene.add(this._quad);
        this._quad.material = new THREE.MeshBasicMaterial({
            map : value.getTexture("textures/vignetting.png"),
            transparent : true,
            opacity : .25
        });
    };
    init.inherit(Object, {
        render : function(renderer) {
            renderer.render(this._scene, this._camera);
        }
    });
    /** @type {function(): undefined} */
    context.exports = init;
}