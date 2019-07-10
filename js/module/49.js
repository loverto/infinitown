var town49 = function (floor, module, n) {
    var startYNew = floor("50");
    var a = floor("55");
    var w = floor("59");
    /** @type {number} */
    var ratio = .05;
    /** @type {number} */
    var planetsSpeed = 2;
    /**
     * @param {!Function} name
     * @param {!Object} obj
     * @return {undefined}
     */
    var render = function(name, obj) {
        a.call(this, name);
        this.add(obj);
        this.position.set(w.random() * startYNew.CHUNK_SIZE - startYNew.CHUNK_SIZE / 2, 60, w.random() * startYNew.CHUNK_SIZE - startYNew.CHUNK_SIZE / 2);
        /** @type {number} */
        this.delay = 5 * w.random();
        /** @type {number} */
        this.speedModifier = .25 * w.random() + 1;
        /** @type {number} */
        this.moveSpeed = .05 * this.speedModifier;
        this.maxScalar = this.scale.x + this.scale.x * ratio;
        /** @type {number} */
        this.minScalar = this.scale.x - this.scale.x * ratio;
        /** @type {number} */
        this.rotation.y = .25;
        this.direction = new THREE.Vector3(-1, 0, .3);
    };
    render.inherit(a, {
        update : function() {
            var value = new THREE.Vector3;
            return function(event) {
                var n = THREE.Math.mapLinear(Math.sin((this.delay + event.elapsed) * planetsSpeed), -1, 1, 0, 1);
                this.scale.setScalar(this.minScalar + (this.maxScalar - this.minScalar) * n);
                value.copy(this.direction).multiplyScalar(this.moveSpeed);
                this.position.add(value);
                this._updateTablePosition();
            };
        }()
    });
    /** @type {function(!Function, !Object): undefined} */
    module.exports = render;
}