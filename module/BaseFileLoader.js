import * as THREE  from 'three';

function BaseFileLoader(data) {
    THREE.FileLoader.call(this);
    this.setResponseType('arraybuffer');
    this.manager = undefined !== data ? data : THREE.DefaultLoadingManager;
};

BaseFileLoader.prototype = Object.create(THREE.FileLoader.prototype);

export default BaseFileLoader
