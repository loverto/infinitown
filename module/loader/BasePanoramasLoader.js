import {DefaultLoadingManager} from "three";
import {RGBAFormat} from "three";
import {LinearFilter} from "three";
import {ClampToEdgeWrapping} from "three";
import {UnsignedByteType} from "three";



/**
 * 全景加载器
 */
class BasePanoramasLoader {
    constructor(size, options, manager) {
        this.manager = undefined !== manager ? manager : DefaultLoadingManager;
        // 全景尺寸 1024
        this._size = size;
        // 值为true时，表示交叉，否则表示非交叉
        this._interleaving = options;
    }

    /**
     * 全景信息填充
     * @param size
     * @param uInt8Array
     * @param data
     */
    dataFill(size, uInt8Array, data) {
        // 矩阵
        const d = size * size;
        //
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

    _parser(length) {
        var data;
        var size = this._size;
        // 交叉
        if (this._interleaving) {
            var outputByteCount = size * size * 4;
            //// 创建初始化为0的，包含length个元素的无符号整型数组
            var uInt8Array = new Uint8Array(length);

            data = new Uint8Array(outputByteCount);
            this.dataFill(size, uInt8Array, data);
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

export default BasePanoramasLoader;
