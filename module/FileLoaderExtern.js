import * as THREE  from 'three';

export function FileLoaderExtern(data) {
    THREE.FileLoader.call(this);
    this.setResponseType('arraybuffer');
    this.manager = undefined !== data ? data : THREE.DefaultLoadingManager;
};

FileLoaderExtern.prototype = Object.create(THREE.FileLoader.prototype);
