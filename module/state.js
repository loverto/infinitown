var state = {
    /**
     * FPS
     */
    FPS : false,
    /**
     * 日志调用
     */
    LOG_CALLS : true,
    /**
     * 随机种子
     */
    RANDOM_SEED : 'infinitown',
    /**
     * 启动随机种子
     */
    RANDOM_SEED_ENABLED : false,
    /**
     * 最大比率
     */
    MAX_PIXEL_RATIO : 1.25,
    /**
     * SHADOWMAP解决方案
     */
    SHADOWMAP_RESOLUTION : window.isMobile ? 1024 : 2048,
    /**
     * SHADOWMAP类型
     */
    SHADOWMAP_TYPE : 'SHADOWMAP_TYPE_PCF',
    /**
     * 表尺寸
     */
    TABLE_SIZE : 9,
    /**
     * 块数量
     */
    CHUNK_COUNT : 9,
    /**
     * 块尺寸
     */
    CHUNK_SIZE : 60,
    /**
     * 相机角度
     */
    CAMERA_ANGLE : .5,
    /**
     * 速度
     */
    PAN_SPEED : window.isMobile ? .4 : .1,
    /**
     *
     */
    FOG_NEAR : 225,
    /**
     *
     */
    FOG_FAR : 325,
    /**
     * 青蓝色
     */
    FOG_COLOR : 0xa2e8ff
};
export default state;

