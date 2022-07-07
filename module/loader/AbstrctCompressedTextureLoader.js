import * as THREE from 'three';

function findErrorByList(t, data, array) {
    var d = t * t;
    var x = 2 * t * t;
    var index = 3 * t * t;
    var item = 0;
    var i = 0;
    for (; i < d; i++) {
        array[item++] = data[i];
        array[item++] = data[i + d];
        array[item++] = data[i + x];
        array[item++] = data[i + index];
    }
}

function AbstrctCompressedTextureLoader (options, value, manager) {
    this.manager = undefined !== manager ? manager : THREE.DefaultLoadingManager;
    this._size = options;
    this._interleaved = value;
};
AbstrctCompressedTextureLoader.prototype = Object.create(THREE.CompressedTextureLoader.prototype);

AbstrctCompressedTextureLoader.prototype._parser = function(buffer) {
    var e = [];
    var order = Math.log2(this._size);
    var dataOffset = 0;
    var i = 0;
    for (; i <= order; i++) {
        var r = Math.pow(2, order - i);
        var dataLength = r * r * 4;
        if (dataOffset >= buffer.byteLength) {
            break;
        }
        var startKey = 0;
        for (; startKey < 6; startKey++) {
            if (e[startKey] || (e[startKey] = []), this._interleaved) {
                var srcBuffer = new Uint8Array(buffer, dataOffset, dataLength);
                var byteArray = new Uint8Array(dataLength);
                findErrorByList(r, srcBuffer, byteArray);
            } else {
                byteArray = new Uint8Array(buffer, dataOffset, dataLength);
            }
            e[startKey].push({
                data : byteArray,
                width : r,
                height : r
            });
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
Math.log2 = Math.log2 || function(score) {
    return Math.log(score) * Math.LOG2E;
};

export default AbstrctCompressedTextureLoader;
