import * as THREE  from 'three';
import constant from 'module/state';
import Events from 'module/Events';
var ndc = new THREE.Vector2;

var VectorDrag = function(inputManager, scene, camera) {
    this._panning = false;
    this._startCoords = new THREE.Vector2;
    this._lastOffset = new THREE.Vector2;
    this._offset = new THREE.Vector2;
    this._speed = new THREE.Vector3(constant.PAN_SPEED, 0, constant.PAN_SPEED);
    this._sceneOffset = new THREE.Vector3;
    this._worldOffset = new THREE.Vector3;
    this.inputManager = inputManager;
    this._scene = scene;
    this.inputManager.on('startdrag', this._onStartDrag, this);
    this.inputManager.on('enddrag', this._onEndDrag, this);
    this.inputManager.on('drag', this._onDrag, this);
    this._camera = camera;
    this._raycaster = new THREE.Raycaster;
    this.enabled = true;
};
VectorDrag.inherit(Object, {
    _onStartDrag : function(e) {
        if (this.enabled) {
            this._panning = true;
            this._startCoords.set(e.x, e.y);
        }
    },
    _onEndDrag : function(e) {
        if (this.enabled) {
            this._panning = false;
            this._lastOffset.copy(this._offset);
        }
    },
    _onDrag : function(canCreateDiscussions) {
        var vector = new THREE.Vector2;
        return function(planeOrigin) {
            if (this.enabled && this._panning) {
                vector.subVectors(planeOrigin, this._startCoords);
                this._offset.addVectors(this._lastOffset, vector);
            }
        };
    }(),
    raycast : function() {
        this._raycaster.setFromCamera(ndc, this._camera);
        var intersectors = this._raycaster.intersectObjects(this._scene.getPickables());
        if (intersectors.length > 0) {
            var settings = intersectors[0].object;
            this._sceneOffset.x += settings.centeredX * constant.CHUNK_SIZE;
            this._sceneOffset.z += settings.centeredY * constant.CHUNK_SIZE;
            if (!(0 === settings.centeredX && 0 === settings.centeredY)) {
                this.trigger('move', settings.centeredX, settings.centeredY);
            }
        }
    },
    update : function() {
        var offset = new THREE.Vector2;
        var angle = new THREE.Vector2;
        var point = new THREE.Vector3;
        return function() {
            this.raycast();
            offset.copy(this._offset);
            offset.rotateAround(angle, -Math.PI / 4);
            this._worldOffset.set(offset.x, 0, offset.y).multiply(this._speed);
            point.lerp(this._worldOffset, .05);
            this._scene.position.addVectors(this._sceneOffset, point);
        };
    }()
});
VectorDrag.mixin(Events);

export default VectorDrag;

