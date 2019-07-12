var Base = THREE.OrthographicCamera;
/** @type {function(number): undefined} */
var OrthographicCameraBase = (require("three-orbit-controls"), function(hValue) {
    Base.call(this);
    /** @type {number} */
    var r = window.innerWidth / window.innerHeight;
    /** @type {number} */
    this.left = hValue / -2 * r;
    /** @type {number} */
    this.right = hValue / 2 * r;
    /** @type {number} */
    this.top = hValue / 2;
    /** @type {number} */
    this.bottom = hValue / -2;
    /** @type {number} */
    this.near = .01;
    /** @type {number} */
    this.far = 500;
    this.updateProjectionMatrix();
});
OrthographicCameraBase.inherit(Base, {
    update : function() {
    }
});
/** @type {function(number): undefined} */
module.exports = OrthographicCameraBase;

