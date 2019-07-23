import * as THREE  from 'three';
var TextureUtils = {};

/**
 *
 * 创建白色纹理
 * @param width 宽
 * @param height 高
 * @returns {DataTexture}
 * @constructor
 */
TextureUtils.CreateWhiteTexture = function(width, height) {
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
TextureUtils.CreateBlackTexture = function(width, height) {
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
TextureUtils.CreateNormalTexture = function(width, height) {
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
TextureUtils.CreateDataTexture = function(width, height) {
    if (undefined === width) {
        width = 4;
    }
    if (undefined === height) {
        height = 4;
    }
    var length = width * height * 3;
    var typeArray = new Uint8Array(length);
    var texture = new THREE.DataTexture(typeArray, width, height, THREE.RGBFormat);
    texture.needsUpdate = true
    return texture;
};
export default TextureUtils;
