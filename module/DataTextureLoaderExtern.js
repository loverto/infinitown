import * as THREE from 'three';
/**
 * @param {number} t
 * @param {?} data
 * @param {!Object} obj
 * @return {undefined}
 */
function normalize(t, data, obj) {
    /** @type {number} */
    var d = t * t;
    /** @type {number} */
    var index = 2 * t * t;
    /** @type {number} */
    var x = 3 * t * t;
    /** @type {number} */
    var objCursor = 0;
    /** @type {number} */
    var i = 0;
    for (; i < d; i++) {
        obj[objCursor++] = data[i];
        obj[objCursor++] = data[i + d];
        obj[objCursor++] = data[i + index];
        obj[objCursor++] = data[i + x];
    }
}
/**
 * @param {number} value
 * @param {!Object} options
 * @param {string} manager
 * @return {undefined}
 */
export function DataTextureLoaderExtern(value, options, manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
    /** @type {number} */
    this._size = value;
    /** @type {!Object} */
    this._interleaving = options;
};
/** @type {!Object} */
DataTextureLoaderExtern.prototype = Object.create(THREE.DataTextureLoader.prototype);
/**
 * @param {?} size
 * @return {?}
 */
DataTextureLoaderExtern.prototype._parser = function(size) {
    var result;
    var r = this._size;
    if (this._interleaving) {
    /** @type {number} */
        var outputByteCount = r * r * 4;
        /** @type {!Uint8Array} */
        var out = new Uint8Array(size);
        /** @type {!Uint8Array} */
        result = new Uint8Array(outputByteCount);
        normalize(r, out, result);
    } else {
    /** @type {!Uint8Array} */
        result = new Uint8Array(size);
    }
    return {
        width : r,
        height : r,
        data : result,
        format : THREE.RGBAFormat,
        minFilter : THREE.LinearFilter,
        magFilter : THREE.LinearFilter,
        wrapS : THREE.ClampToEdgeWrapping,
        wrapT : THREE.ClampToEdgeWrapping,
        type : THREE.UnsignedByteType
    };
};
