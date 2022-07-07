import {DefaultLoadingManager} from "three";
import {FileLoader} from "three";
import {JSONLoader} from "three";
import {BufferGeometryLoader} from "three";
import {BufferGeometry} from "three";
import {BufferAttribute} from "three";
import {MaterialLoader} from "three";
import {AnimationClip} from "three/src/animation/AnimationClip";
import {LoadingManager} from "three";
import {ImageLoader} from "three";
import {CubeTexture} from "three";
import {Texture} from "three";
import {Matrix4} from "three";
import {Scene} from "three";
import {PerspectiveCamera} from "three";
import {OrthographicCamera} from "three";
import {AmbientLight} from "three";
import {DirectionalLight} from "three";
import {PointLight} from "three";
import {SpotLight} from "three";
import {HemisphereLight} from "three";
import {SkinnedMesh} from "three";
import {Mesh} from "three";
import {LOD} from "three";
import {Line} from "three";
import {LineSegments} from "three";
import {Points} from "three";
import {Sprite} from "three";
import {Group} from "three";
import {Object3D} from "three";

class LoadSceneManager {
    /**
     * 加载场景管理
     * @param {string} loadingManager
     * @return {undefined}
     */
    constructor(loadingManager) {
        this.manager = undefined !== loadingManager ? loadingManager : DefaultLoadingManager;
        // 设置纹理路径
        this.texturePath = '';
        /**
         * 转换对象
         */
        this.parseObject = function() {
            // 声明矩阵
            var matrix = new Matrix4;
            return function(data, geometries, materials) {

                function getGeometry(name) {
                    if (undefined === geometries[name]){
                        console.warn('THREE.ObjectLoader: Undefined geometry', name)
                    }
                    return geometries[name];
                }

                function getMaterial(name) {
                    if (undefined !== name) {
                        if (undefined === materials[name]) {
                            console.warn('THREE.ObjectLoader: Undefined material', name)
                        }
                        return materials[name];
                    }
                }
                var object;
                switch(data.type) {
                    case 'Scene':
                        object = new Scene;
                        break;
                    case 'PerspectiveCamera':
                        object = new PerspectiveCamera(data.fov, data.aspect, data.near, data.far);
                        if (undefined !== data.focus) {
                            object.focus = data.focus;
                        }
                        if (undefined !== data.zoom) {
                            object.zoom = data.zoom;
                        }
                        if (undefined !== data.filmGauge) {
                            object.filmGauge = data.filmGauge;
                        }
                        if (undefined !== data.filmOffset) {
                            object.filmOffset = data.filmOffset;
                        }
                        if (undefined !== data.view) {
                            object.view = Object.assign({}, data.view);
                        }
                        break;
                    case 'OrthographicCamera':
                        object = new OrthographicCamera(data.left, data.right, data.top, data.bottom, data.near, data.far);
                        break;
                    case 'AmbientLight':
                        object = new AmbientLight(data.color, data.intensity);
                        break;
                    case 'DirectionalLight':
                        object = new DirectionalLight(data.color, data.intensity);
                        break;
                    case 'PointLight':
                        object = new PointLight(data.color, data.intensity, data.distance, data.decay);
                        break;
                    case 'SpotLight':
                        object = new SpotLight(data.color, data.intensity, data.distance, data.angle, data.penumbra, data.decay);
                        break;
                    case 'HemisphereLight':
                        object = new HemisphereLight(data.color, data.groundColor, data.intensity);
                        break;
                    case 'Mesh':
                        var geometry = getGeometry(data.geometry);
                        var material = getMaterial(data.material);
                        object = geometry.bones && geometry.bones.length > 0 ? new SkinnedMesh(geometry, material) : new Mesh(geometry, material);
                        break;
                    case 'LOD':
                        object = new LOD;
                        break;
                    case 'Line':
                        object = new Line(getGeometry(data.geometry), getMaterial(data.material), data.mode);
                        break;
                    case 'LineSegments':
                        object = new LineSegments(getGeometry(data.geometry), getMaterial(data.material));
                        break;
                    case 'PointCloud':
                    case 'Points':
                        object = new Points(getGeometry(data.geometry), getMaterial(data.material));
                        break;
                    case 'Sprite':
                        object = new Sprite(getMaterial(data.material));
                        break;
                    case 'Group':
                        object = new Group;
                        break;
                    default:
                        object = new Object3D;
                }
                object.uuid = data.uuid
                if (undefined !== data.name)  {
                    object.name = data.name
                }
                if (undefined !== data.matrix){
                    matrix.fromArray(data.matrix)
                    matrix.decompose(object.position, object.quaternion, object.scale)
                } else {
                    if (undefined !== data.position){
                        object.position.fromArray(data.position)
                    }
                    if (undefined !== data.rotation ){
                        object.rotation.fromArray(data.rotation)
                    }
                    if (undefined !== data.scale){
                        object.scale.fromArray(data.scale)
                    }
                }
                if ( undefined !== data.castShadow) {
                    object.castShadow = data.castShadow
                }
                if(undefined !== data.receiveShadow){
                    object.receiveShadow = data.receiveShadow
                }

                if (undefined !== data.visible) {
                    (object.visible = data.visible)
                }
                if (undefined !== data.userData) {
                    (object.userData = data.userData)
                }

                if (undefined !== data.children) {
                    var child;
                    for (child in data.children) {
                        object.add(this.parseObject(data.children[child], geometries, materials));
                    }
                }
                if ('LOD' === data.type) {
                    var levels = data.levels;
                    var i = 0;
                    for (; i < levels.length; i++) {
                        var level = levels[i];
                        child = object.getObjectByProperty('uuid', level.object);
                        if (undefined !== child) {
                            object.addLevel(child, level.distance);
                        }
                    }
                }
                if (undefined !== data.layers){
                    (object.layers.mask = data.layers)
                }
                return object;
            };
        }()
    }

    load(url, callback, data, options) {
        // 如果纹理路径为空，则从参数中获取纹理路径
        if ('' === this.texturePath) {
            this.texturePath = url.substring(0, url.lastIndexOf('/') + 1);
        }
        var self = this;
        var xhrLoader = new FileLoader(self.manager);
        // threejs异步加载 资源
        xhrLoader.load(url, function(response) {
            var value = JSON.parse(response);
            self.parse(value, callback);
        }, data, options);
    }
    /**
     * 设置纹理路径
     * @param path
     */
    setTexturePath(path) {
        this.texturePath = path;
    }
    /**
     * 设置跨域
     * @param value
     */
    setCrossOrigin(value) {
        this.crossOrigin = value;
    }
    /**
     * 转换
     * @param json
     * @param callback
     * @returns {*}
     */
    parse(json, callback) {
        // 获取几何图形
        var geometries;
        // 判断文件是否为二进制，如果是二进制，则设置二进制，否则转换为几何图形
        geometries = json.binary ? this.parseBinaryGeometries(json.geometries) : this.parseGeometries(json.geometries);
        // 转换图片
        var images = this.parseImages(json.images, function() {
            if (undefined !== callback) {
                // 图片加载完毕后，把转换的object对象和json数据返回给调用处
                callback(object, json);
            }
        });
        // 处理纹理信息
        var textures = this.parseTextures(json.textures, images);
        // 处理材料信息
        var materials = this.parseMaterials(json.materials, textures);
        // 转换对象
        var object = this.parseObject(json.object, geometries, materials);
        if(json.animations){
            (object.animations = this.parseAnimations(json.animations))
        }
        if(json.cameras ){
            (object.cameras = this.parseCameras(object, json.cameras))
        }
        if(undefined !== json.images && 0 !== json.images.length || undefined !== callback ){
            callback(object, json)
        }
        return object;
    }
    /**
     * 转换相机
     * @param object
     * @param options
     * @returns {!Array}
     */
    parseCameras(object, options) {
        var onSelectionCalls = [];
        var index = 0;
        for (; index < options.length; index++) {
            var e = object.getObjectByProperty('uuid', options[index]);
            if (e) {
                onSelectionCalls.push(e);
            }
        }
        return onSelectionCalls;
    }
    /**
     * 转换几何体
     * @param json
     */
    parseGeometries(json) {
        // 转换几何图形
        var geometries = {};
        // undefined 等价于undefined 压缩器为了提升性能做的改进
        if (undefined !== json) {
            // 实例化json 几何形状的加载器
            var geometryLoader = new JSONLoader;
            // 实例化Buffer几何形状的加载器
            var primParser = new BufferGeometryLoader;
            var i = 0;
            var jsonLength = json.length;
            // 遍历各种类型的threejs的几何模型
            for (; i < jsonLength; i++) {
                var geometry;
                var data = json[i];
                switch(data.type) {
                    case 'PlaneGeometry':
                    case 'PlaneBufferGeometry':
                        geometry = new THREE[data.type](data.width, data.height, data.widthSegments, data.heightSegments);
                        break;
                    case 'BoxGeometry':
                    case 'BoxBufferGeometry':
                    case 'CubeGeometry':
                        geometry = new THREE[data.type](data.width, data.height, data.depth, data.widthSegments, data.heightSegments, data.depthSegments);
                        break;
                    case 'CircleGeometry':
                    case 'CircleBufferGeometry':
                        geometry = new THREE[data.type](data.radius, data.segments, data.thetaStart, data.thetaLength);
                        break;
                    case 'CylinderGeometry':
                    case 'CylinderBufferGeometry':
                        geometry = new THREE[data.type](data.radiusTop, data.radiusBottom, data.height, data.radialSegments, data.heightSegments, data.openEnded, data.thetaStart, data.thetaLength);
                        break;
                    case 'ConeGeometry':
                    case 'ConeBufferGeometry':
                        geometry = new THREE[data.type](data.radius, data.height, data.radialSegments, data.heightSegments, data.openEnded, data.thetaStart, data.thetaLength);
                        break;
                    case 'SphereGeometry':
                    case 'SphereBufferGeometry':
                        geometry = new THREE[data.type](data.radius, data.widthSegments, data.heightSegments, data.phiStart, data.phiLength, data.thetaStart, data.thetaLength);
                        break;
                    case 'DodecahedronGeometry':
                    case 'IcosahedronGeometry':
                    case 'OctahedronGeometry':
                    case 'TetrahedronGeometry':
                        geometry = new THREE[data.type](data.radius, data.detail);
                        break;
                    case 'RingGeometry':
                    case 'RingBufferGeometry':
                        geometry = new THREE[data.type](data.innerRadius, data.outerRadius, data.thetaSegments, data.phiSegments, data.thetaStart, data.thetaLength);
                        break;
                    case 'TorusGeometry':
                    case 'TorusBufferGeometry':
                        geometry = new THREE[data.type](data.radius, data.tube, data.radialSegments, data.tubularSegments, data.arc);
                        break;
                    case 'TorusKnotGeometry':
                    case 'TorusKnotBufferGeometry':
                        geometry = new THREE[data.type](data.radius, data.tube, data.tubularSegments, data.radialSegments, data.p, data.q);
                        break;
                    case 'LatheGeometry':
                    case 'LatheBufferGeometry':
                        geometry = new THREE[data.type](data.points, data.segments, data.phiStart, data.phiLength);
                        break;
                    case 'BufferGeometry':
                        geometry = primParser.parse(data);
                        break;
                    case 'Geometry':
                        geometry = geometryLoader.parse(data.data, this.texturePath).geometry;
                        break;
                    default:
                        console.warn('THREE.ObjectLoader: Unsupported geometry type "' + data.type + '"');
                        continue;
                }
                geometry.uuid = data.uuid;
                if (undefined !== data.name) {
                    geometry.name = data.name;
                }
                geometries[data.uuid] = geometry;
            }
        }
        return geometries;
    }
    /**
     * 设置二进制集合体缓存
     * @param addedRenderer
     */
    setBinaryGeometryBuffer(addedRenderer) {
        this.geometryBuffer = addedRenderer;
    }
    /**
     *  转换二进制集合体
     * @param result
     */
    parseBinaryGeometries(result) {
        var geometries = {};
        if (undefined !== result) {
            new BufferGeometryLoader
            var i = 0;
            var length = result.length;
            for (; i < length; i++) {
                var geometry = new BufferGeometry;
                var data = result[i];
                var key;
                for (key in data.offsets) {
                    if (data.offsets.hasOwnProperty(key)) {
                        var tex = data.offsets[key];
                        var c = tex[0];
                        var n = tex[1] + 1;
                        var len = this.geometryBuffer.slice(c, n);
                        if ('index' === key) {
                            var indices = new Uint32Array(len);
                            geometry.setIndex(new BufferAttribute(indices, 1));
                        } else {
                            var size;
                            indices = new Float32Array(len);
                            if ('uv' === key || 'uv2' === key) {
                                size = 2;
                            } else {
                                if ('position' === key || 'normal' === key || 'color' === key) {
                                    size = 3;
                                } else {
                                    if ('tangent' === key) {
                                        size = 4;
                                    }
                                }
                            }
                            geometry.addAttribute(key, new BufferAttribute(indices, size));
                        }
                    }
                }
                geometry.uuid = data.uuid;
                if (undefined !== data.name) {
                    geometry.name = data.name;
                }
                geometries[data.uuid] = geometry;
            }
            this.setBinaryGeometryBuffer(null);
        }
        return geometries;
    }
    /**
     * 转换材料
     * @param json
     * @param textures
     */
    parseMaterials(json, textures) {
        // 设置材料
        var materials = {};

        if (undefined !== json) {
            var loader = new MaterialLoader;
            loader.setTextures(textures);
            var i = 0;
            var jsonLength = json.length;
            for (; i < jsonLength; i++) {
                let jsonElement = json[i];

                var material = loader.parse(jsonElement);
                materials[material.uuid] = material;
            }
        }
        return materials;
    }
    /**
     * 转换动画效果
     * @param json
     * @returns {!Array}
     */
    parseAnimations(json) {
        var animations = [];
        var i = 0;
        for (; i < json.length; i++) {
            var animation = AnimationClip.parse(json[i]);
            animations.push(animation);
        }
        return animations;
    }
    /**
     *  转换图片
     * @param json
     * @param onLoad
     */
    parseImages(json, onLoad) {
        /**
         * 加载图片
         * @param {string} url
         * @return {?}
         */
        function loadImage(url) {
            return self.manager.itemStart(url), loader.load(url, function() {
                self.manager.itemEnd(url);
            });
        }
        var self = this;
        var images = {};
        if (undefined !== json && json.length > 0) {
            // 设置回调函数
            var manager = new LoadingManager(onLoad);
            var loader = new ImageLoader(manager);
            // 设置跨域加载图片
            loader.setCrossOrigin(this.crossOrigin);
            var i = 0;
            var jsonLength = json.length;
            for (; i < jsonLength; i++) {
                var image = json[i];
                var url = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(image.url) ? image.url : self.texturePath + image.url;
                images[image.uuid] = loadImage(url);
            }
        }
        return images;
    }
    /**
     * 转换纹理
     * @param json
     * @param images
     */
    parseTextures(json, images) {
        /**
         * @param {(Object|string)} value
         * @return {?}
         */
        function parseConstant(value) {
            if ('number' != typeof value) {
                console.warn('THREE.ObjectLoader.parseTexture: Constant should be in numeric form.', value)
                value = THREE[value]
            }
            return value;
        }
        var textures = {};
        if (undefined !== json) {
            var i = 0;
            var jsonLength = json.length;
            for (; i < jsonLength; i++) {
                var texture;
                var data = json[i];
                // 判断是否时多个图片，如果时多个图片，则创建cubeTexture纹理
                if (data.images) {
                    var c = [];
                    var i = 0;
                    var l = data.images.length;
                    for (; i < l; i++) {
                        if (undefined === images[data.images[i]]) {
                            console.warn('THREE.ObjectLoader: Undefined image', data.images[i]);
                        }
                        c.push(images[data.images[i]]);
                    }
                    texture = new CubeTexture(c);
                } else {
                    if (undefined === data.image) {
                        console.warn('THREE.ObjectLoader: No "image" specified for', data.uuid);
                    }
                    if (undefined === images[data.image]) {
                        console.warn('THREE.ObjectLoader: Undefined image', data.image);
                    }
                    texture = new Texture(images[data.image]);
                }
                // 设置纹理自动更新
                texture.needsUpdate = true;
                // 设置纹理的唯一id
                texture.uuid = data.uuid;
                // 如果有名称则设置名称
                if (undefined !== data.name) {
                    texture.name = data.name;
                }

                if (undefined !== data.mapping) {
                    texture.mapping = parseConstant(data.mapping);
                }
                if (undefined !== data.offset) {
                    texture.offset.fromArray(data.offset);
                }
                if (undefined !== data.repeat) {
                    texture.repeat.fromArray(data.repeat);
                }
                if (undefined !== data.wrap) {
                    texture.wrapS = parseConstant(data.wrap[0]);
                    texture.wrapT = parseConstant(data.wrap[1]);
                }
                // 如果有最小
                if (undefined !== data.minFilter) {
                    texture.minFilter = parseConstant(data.minFilter);
                }
                if (undefined !== data.magFilter) {
                    texture.magFilter = parseConstant(data.magFilter);
                }
                if (undefined !== data.anisotropy) {
                    texture.anisotropy = data.anisotropy;
                }
                if (undefined !== data.flipY) {
                    texture.flipY = data.flipY;
                }
                textures[data.uuid] = texture;
            }
        }
        return textures;
    }

}

export default LoadSceneManager
