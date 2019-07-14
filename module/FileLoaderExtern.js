import * as THREE  from 'three';
/**
 * @param {string} data
 * @return {undefined}
 */
export function FileLoaderExtern(data) {
    THREE.XHRLoader.call(this);
    this.setResponseType('arraybuffer');
    this.manager = void 0 !== data ? data : THREE.DefaultLoadingManager;
};
/** @type {!Object} */
FileLoaderExtern.prototype = Object.create(THREE.XHRLoader.prototype);
