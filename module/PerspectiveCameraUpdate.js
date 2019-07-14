import * as THREE  from 'three';
var ctor = THREE.PerspectiveCamera;
import TubularModel from 'three-orbit-controls';
/**
 * @param {!Object} data
 * @return {undefined}
 */
var PerspectiveCameraUpdate = function(data) {
    ctor.call(this);
    /** @type {number} */
    this.aspect = window.innerWidth / window.innerHeight;
    /** @type {number} */
    this.fov = 50;
    /** @type {number} */
    this.near = 1;
    /** @type {number} */
    this.far = 1E3;
    this.updateProjectionMatrix();
    this.controls = new TubularModel(this, data || document.body);
};
PerspectiveCameraUpdate.inherit(ctor, {
    update : function() {
        this.controls.update();
    }
});

/** @type {function(!Object): undefined} */
export {PerspectiveCameraUpdate};
