/**
 *  全局配置类
 */
class GlobalConfig {

}
/**
 * FPS
 */
GlobalConfig.FPS = true
/**
 * 日志调用
 */
GlobalConfig.LOG_CALLS = true
/**
 * 随机种子
 */
GlobalConfig.RANDOM_SEED = 'infinitown'
/**
 * 启动随机种子
 */
GlobalConfig.RANDOM_SEED_ENABLED = false
/**
 * 最大比率
 */
GlobalConfig.MAX_PIXEL_RATIO = 1.25
/**
 * 地图上影子的解析度
 */
GlobalConfig.SHADOWMAP_RESOLUTION = window.isMobile ? 1024 : 2048
/**
 * SHADOWMAP类型
 */
GlobalConfig.SHADOWMAP_TYPE = 'SHADOWMAP_TYPE_PCF'
/**
 * 表尺寸
 */
GlobalConfig.TABLE_SIZE = 9
/**
 * 块数量
 */
GlobalConfig.CHUNK_COUNT = 9
/**
 * 块尺寸
 */
GlobalConfig.CHUNK_SIZE = 60
/**
 * 相机角度
 */
GlobalConfig.CAMERA_ANGLE = .5
/**
 * 平移速度
 */
GlobalConfig.PAN_SPEED = window.isMobile ? .4 : .1
/**
 * 雾最近的距离
 */
GlobalConfig.FOG_NEAR = 225
/**
 * 雾最远的距离
 */
GlobalConfig.FOG_FAR = 325
/**
 * 雾的颜色，青蓝色
 */
GlobalConfig.FOG_COLOR = 0xa2e8ff
/**
 * 是否调试
 */
GlobalConfig.DEBUG = false

export default GlobalConfig;

