import * as THREE  from 'three';
import state from 'module/state';
import render from 'module/render';
import types from 'module/types';
var ratio = .05;
var planetsSpeed = 2;

/**
 * 云
 * @param name
 * @param obj
 */
var Cloud = function(name, obj) {
    render.call(this, name);
    this.add(obj);
    this.position.set(types.random() * state.CHUNK_SIZE - state.CHUNK_SIZE / 2, 60, types.random() * state.CHUNK_SIZE - state.CHUNK_SIZE / 2);
    this.delay = 5 * types.random();
    this.speedModifier = .25 * types.random() + 1;
    this.moveSpeed = .05 * this.speedModifier;
    this.maxScalar = this.scale.x + this.scale.x * ratio;
    this.minScalar = this.scale.x - this.scale.x * ratio;
    this.rotation.y = .25;
    this.direction = new THREE.Vector3(-1, 0, .3);
};
Cloud.inherit(render, {
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

export default Cloud;

