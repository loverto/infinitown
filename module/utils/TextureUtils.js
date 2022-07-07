import {DataTexture} from "three";
import {RGBFormat} from "three";

class TextureUtils {
    /**
     *
     * 创建白色纹理
     * @param width 宽
     * @param height 高
     * @returns {DataTexture}
     * @constructor
     */
    static CreateWhiteTexture(width, height) {
        var dataTexture = TextureUtils.CreateDataTexture(width, height);
        var i = 0;
        for (; i < dataTexture.image.data.length; i++) {
            dataTexture.image.data[i] = 255;
        }
        return dataTexture;
    };

    /**
     * 创建黑色纹理
     * @param width 宽
     * @param height 高
     * @returns {DataTexture}
     * @constructor
     */
    static CreateBlackTexture(width, height) {
        var dataTexture = TextureUtils.CreateDataTexture(width, height);
        var i = 0;
        for (; i < dataTexture.image.data.length; i++) {
            dataTexture.image.data[i] = 0;
        }
        return dataTexture;
    };
    /**
     * 创建普通纹理
     * @param width 宽
     * @param height 高
     * @returns {DataTexture}
     * @constructor
     */
    static CreateNormalTexture(width, height) {
        var dataTexture = TextureUtils.CreateDataTexture(width, height);
        var i = 0;
        for (; i < dataTexture.image.data.length; i = i + 3) {
            dataTexture.image.data[i] = 128;
            dataTexture.image.data[i + 1] = 128;
            dataTexture.image.data[i + 2] = 255;
        }
        return dataTexture;
    };

    /**
     * 创建数据纹理
     * @param width 宽度
     * @param height 高
     * @constructor
     */
    static CreateDataTexture(width, height) {
        if (undefined === width) {
            width = 4;
        }
        if (undefined === height) {
            height = 4;
        }
        var length = width * height * 3;
        var typeArray = new Uint8Array(length);
        var texture = new DataTexture(typeArray, width, height, RGBFormat);
        texture.needsUpdate = true
        return texture;
    };
}

export default TextureUtils;
