var globalConfig = {
    /**
     * FPS
     */
    FPS : true,
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
     * 地图上影子的解析度
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
     * 平移速度
     */
    PAN_SPEED : window.isMobile ? .4 : .1,
    /**
     * 雾最近的距离
     */
    FOG_NEAR : 225,
    /**
     * 雾最远的距离
     */
    FOG_FAR : 325,
    /**
     * 雾的颜色，青蓝色
     */
    FOG_COLOR : 0xa2e8ff
};
export default globalConfig;

