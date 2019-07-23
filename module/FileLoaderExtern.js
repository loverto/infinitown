import * as THREE  from 'three';
/**
 * @param {string} data
 * @return {undefined}
 */
export function FileLoaderExtern(data) {
    THREE.FileLoader.call(this);
    this.setResponseType('arraybuffer');
    this.manager = undefined !== data ? data : THREE.DefaultLoadingManager;
};
/** @type {!Object} */
FileLoaderExtern.prototype = Object.create(THREE.FileLoader.prototype);
