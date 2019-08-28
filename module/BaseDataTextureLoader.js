import {DefaultLoadingManager} from "three";
import {RGBAFormat} from "three";
import {LinearFilter} from "three";
import {ClampToEdgeWrapping} from "three";
import {UnsignedByteType} from "three";

function normalize(size, uInt8Array, data) {
    const d = size * size;
    const index = 2 * size * size;
    const x = 3 * size * size;
    let objCursor = 0;
    let i = 0;
    for (; i < d; i++) {
        data[objCursor++] = uInt8Array[i];
        data[objCursor++] = uInt8Array[i + d];
        data[objCursor++] = uInt8Array[i + index];
        data[objCursor++] = uInt8Array[i + x];
    }
}

class BaseDataTextureLoader {
    constructor(size, options, manager) {
        this.manager = undefined !== manager ? manager : DefaultLoadingManager;
        this._size = size;
        this._interleaving = options;
    }

    _parser(length) {
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
            format : RGBAFormat,
            minFilter : LinearFilter,
            magFilter : LinearFilter,
            wrapS : ClampToEdgeWrapping,
            wrapT : ClampToEdgeWrapping,
            type : UnsignedByteType
        };
    }
}

export default BaseDataTextureLoader;
