import * as THREE from 'three';

function normalize(size, uInt8Array, data) {
    var d = size * size;
    var index = 2 * size * size;
    var x = 3 * size * size;
    var objCursor = 0;
    var i = 0;
    for (; i < d; i++) {
        data[objCursor++] = uInt8Array[i];
        data[objCursor++] = uInt8Array[i + d];
        data[objCursor++] = uInt8Array[i + index];
        data[objCursor++] = uInt8Array[i + x];
    }
}

export function DataTextureLoaderExtern(size, options, manager) {
    this.manager = undefined !== manager ? manager : THREE.DefaultLoadingManager;
    this._size = size;
    this._interleaving = options;
};
DataTextureLoaderExtern.prototype = Object.create(THREE.DataTextureLoader.prototype);

DataTextureLoaderExtern.prototype._parser = function(length) {
    var data;
    var size = this._size;
    if (this._interleaving) {
        var outputByteCount = size * size * 4;
        //// 创建初始化为0的，包含length个元素的无符号整型数组
        var uInt8Array = new Uint8Array(length);

        data = new Uint8Array(outputByteCount);
        normalize(size, uInt8Array, data);
    } else {
        data = new Uint8Array(size);
    }
    return {
        width : size,
        height : size,
        data : data,
        format : THREE.RGBAFormat,
        minFilter : THREE.LinearFilter,
        magFilter : THREE.LinearFilter,
        wrapS : THREE.ClampToEdgeWrapping,
        wrapT : THREE.ClampToEdgeWrapping,
        type : THREE.UnsignedByteType
    };
};
