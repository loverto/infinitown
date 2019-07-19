
/**
 * @param {number} t
 * @param {?} data
 * @param {?} array
 * @return {undefined}
 */
function findErrorByList(t, data, array) {
    /** @type {number} */
    var d = t * t;
    /** @type {number} */
    var x = 2 * t * t;
    /** @type {number} */
    var index = 3 * t * t;
    /** @type {number} */
    var item = 0;
    /** @type {number} */
    var i = 0;
    for (; i < d; i++) {
        array[item++] = data[i];
        array[item++] = data[i + d];
        array[item++] = data[i + x];
        array[item++] = data[i + index];
    }
}
/**
 * @param {number} options
 * @param {boolean} value
 * @param {string} manager
 * @return {undefined}
 */
export function CompressedTextureLoaderExtern (options, value, manager) {
    this.manager = void 0 !== manager ? manager : THREE.DefaultLoadingManager;
    /** @type {number} */
    this._size = options;
    /** @type {boolean} */
    this._interleaved = value;
};
/** @type {!Object} */
CompressedTextureLoaderExtern.prototype = Object.create(THREE.CompressedTextureLoader.prototype);
/**
 * @param {!ArrayBuffer} buffer
 * @return {?}
 */
CompressedTextureLoaderExtern.prototype._parser = function(buffer) {
    /** @type {!Array} */
    var e = [];
    /** @type {number} */
    var order = Math.log2(this._size);
    /** @type {number} */
    var dataOffset = 0;
    /** @type {number} */
    var i = 0;
    for (; i <= order; i++) {
    /** @type {number} */
        var r = Math.pow(2, order - i);
        /** @type {number} */
        var dataLength = r * r * 4;
        if (dataOffset >= buffer.byteLength) {
            break;
        }
        /** @type {number} */
        var startKey = 0;
        for (; startKey < 6; startKey++) {
            if (e[startKey] || (e[startKey] = []), this._interleaved) {
                /** @type {!Uint8Array} */
                var srcBuffer = new Uint8Array(buffer, dataOffset, dataLength);
                /** @type {!Uint8Array} */
                var byteArray = new Uint8Array(dataLength);
                findErrorByList(r, srcBuffer, byteArray);
            } else {
                /** @type {!Uint8Array} */
                byteArray = new Uint8Array(buffer, dataOffset, dataLength);
            }
            e[startKey].push({
                data : byteArray,
                width : r,
                height : r
            });
            /** @type {number} */
            dataOffset = dataOffset + dataLength;
        }
    }
    return {
        isCubemap : true,
        mipmaps : _.flatten(e),
        mipmapCount : order + 1,
        width : this._size,
        height : this._size,
        format : THREE.RGBAFormat,
        minFilter : THREE.LinearMipMapLinearFilter,
        magFilter : THREE.LinearFilter,
        wrapS : THREE.ClampToEdgeWrapping,
        wrapT : THREE.ClampToEdgeWrapping,
        type : THREE.UnsignedByteType
    };
};
/** @type {function(number): number} */
Math.log2 = Math.log2 || function(score) {
    return Math.log(score) * Math.LOG2E;
};
