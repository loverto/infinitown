import * as THREE from 'three';
/**
 * @param {string} data
 * @return {undefined}
 */
export function TextureMTLLoader(data) {
    this.manager = void 0 !== data ? data : THREE.DefaultLoadingManager;
    /** @type {string} */
    this.texturePath = '';
};
Object.assign(TextureMTLLoader.prototype, {
    load : function(url, callback, data, options) {
    // 如果纹理路径为空，则从参数中获取纹理路径
        if ('' === this.texturePath) {
            this.texturePath = url.substring(0, url.lastIndexOf('/') + 1);
        }
        var self = this;
        var xhrLoader = new THREE.XHRLoader(self.manager);
        // threejs异步加载 资源
        xhrLoader.load(url, function(response) {
            /** @type {*} */
            var value = JSON.parse(response);
            self.parse(value, callback);
        }, data, options);
    },
    setTexturePath : function(path) {
    /** @type {string} */
        this.texturePath = path;
    },
    setCrossOrigin : function(value) {
    /** @type {!Object} */
        this.crossOrigin = value;
    },
    parse : function(json, callback) {
    // 获取几何图形
        var geometries;
        // 判断文件是否为二进制，如果时二进制，则设置二进制，否则转换为几何图形
        geometries = json.binary ? this.parseBinaryGeometries(json.geometries) : this.parseGeometries(json.geometries);
        // 转换图片
        var images = this.parseImages(json.images, function() {
            if (void 0 !== callback) {
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
        return json.animations && (object.animations = this.parseAnimations(json.animations)), json.cameras && (object.cameras = this.parseCameras(object, json.cameras)), void 0 !== json.images && 0 !== json.images.length || void 0 !== callback && callback(object, json), object;
    },
    parseCameras : function(object, options) {
    /** @type {!Array} */
        var onSelectionCalls = [];
        /** @type {number} */
        var index = 0;
        for (; index < options.length; index++) {
            var e = object.getObjectByProperty('uuid', options[index]);
            if (e) {
                onSelectionCalls.push(e);
            }
        }
        return onSelectionCalls;
    },
    parseGeometries : function(json) {
    // 转换几何图形
        var geometries = {};
        // void 0 等价于undefined 压缩器为了提升性能做的改进
        if (void 0 !== json) {
            // 实例化json 几何形状的加载器
            var geometryLoader = new THREE.JSONLoader;
            // 实例化Buffer几何形状的加载器
            var primParser = new THREE.BufferGeometryLoader;
            /** @type {number} */
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
                if (void 0 !== data.name) {
                    geometry.name = data.name;
                }
                geometries[data.uuid] = geometry;
            }
        }
        return geometries;
    },
    setBinaryGeometryBuffer : function(addedRenderer) {
    /** @type {!Object} */
        this.geometryBuffer = addedRenderer;
    },
    parseBinaryGeometries : function(result) {
        var geometries = {};
        if (void 0 !== result) {
            /** @type {number} */
            var i = (new THREE.BufferGeometryLoader, 0);
            var length = result.length;
            for (; i < length; i++) {
                var geometry = new THREE.BufferGeometry;
                var data = result[i];
                var key;
                for (key in data.offsets) {
                    if (data.offsets.hasOwnProperty(key)) {
                        var tex = data.offsets[key];
                        var c = tex[0];
                        var n = tex[1] + 1;
                        var len = this.geometryBuffer.slice(c, n);
                        if ('index' === key) {
                            /** @type {!Uint32Array} */
                            var indices = new Uint32Array(len);
                            geometry.setIndex(new THREE.BufferAttribute(indices, 1));
                        } else {
                            var size;
                            /** @type {!Float32Array} */
                            indices = new Float32Array(len);
                            if ('uv' === key || 'uv2' === key) {
                                /** @type {number} */
                                size = 2;
                            } else {
                                if ('position' === key || 'normal' === key || 'color' === key) {
                                    /** @type {number} */
                                    size = 3;
                                } else {
                                    if ('tangent' === key) {
                                        /** @type {number} */
                                        size = 4;
                                    }
                                }
                            }
                            geometry.addAttribute(key, new THREE.BufferAttribute(indices, size));
                        }
                    }
                }
                geometry.uuid = data.uuid;
                if (void 0 !== data.name) {
                    geometry.name = data.name;
                }
                geometries[data.uuid] = geometry;
            }
            this.setBinaryGeometryBuffer(null);
        }
        return geometries;
    },
    parseMaterials : function(json, textures) {
    // 设置材料
        var materials = {};

        if (void 0 !== json) {
            var loader = new THREE.MaterialLoader;
            loader.setTextures(textures);
            /** @type {number} */
            var i = 0;
            var jsonLength = json.length;
            for (; i < jsonLength; i++) {
                let jsonElement = json[i];

                var material = loader.parse(jsonElement);
                materials[material.uuid] = material;
            }
        }
        return materials;
    },
    parseAnimations : function(json) {
    /** @type {!Array} */
        var t_chksum = [];
        /** @type {number} */
        var i = 0;
        for (; i < json.length; i++) {
            var r = THREE.AnimationClip.parse(json[i]);
            t_chksum.push(r);
        }
        return t_chksum;
    },
    parseImages : function(json, onLoad) {
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
        if (void 0 !== json && json.length > 0) {
            // 设置回调函数
            var manager = new THREE.LoadingManager(onLoad);
            var loader = new THREE.ImageLoader(manager);
            // 设置跨域加载图片
            loader.setCrossOrigin(this.crossOrigin);
            /** @type {number} */
            var i = 0;
            var jsonLength = json.length;
            for (; i < jsonLength; i++) {
                var image = json[i];
                var url = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(image.url) ? image.url : self.texturePath + image.url;
                images[image.uuid] = loadImage(url);
            }
        }
        return images;
    },
    parseTextures : function(json, images) {
    /**
         * @param {(Object|string)} value
         * @return {?}
         */
        function parseConstant(value) {
            return 'number' == typeof value ? value : (console.warn('THREE.ObjectLoader.parseTexture: Constant should be in numeric form.', value), THREE[value]);
        }
        var textures = {};
        if (void 0 !== json) {
            /** @type {number} */
            var i = 0;
            var jsonLength = json.length;
            for (; i < jsonLength; i++) {
                var texture;
                var data = json[i];
                // 判断是否时多个图片，如果时多个图片，则创建cubeTexture纹理
                if (data.images) {
                    /** @type {!Array} */
                    var c = [];
                    /** @type {number} */
                    var i = 0;
                    var l = data.images.length;
                    for (; i < l; i++) {
                        if (void 0 === images[data.images[i]]) {
                            console.warn('THREE.ObjectLoader: Undefined image', data.images[i]);
                        }
                        c.push(images[data.images[i]]);
                    }
                    texture = new THREE.CubeTexture(c);
                } else {
                    if (void 0 === data.image) {
                        console.warn('THREE.ObjectLoader: No "image" specified for', data.uuid);
                    }
                    if (void 0 === images[data.image]) {
                        console.warn('THREE.ObjectLoader: Undefined image', data.image);
                    }
                    texture = new THREE.Texture(images[data.image]);
                }
                /** @type {boolean} */
                // 设置纹理自动更新
                texture.needsUpdate = true;
                // 设置纹理的唯一id
                texture.uuid = data.uuid;
                // 如果有名称则设置名称
                if (void 0 !== data.name) {
                    texture.name = data.name;
                }

                if (void 0 !== data.mapping) {
                    texture.mapping = parseConstant(data.mapping);
                }
                if (void 0 !== data.offset) {
                    texture.offset.fromArray(data.offset);
                }
                if (void 0 !== data.repeat) {
                    texture.repeat.fromArray(data.repeat);
                }
                if (void 0 !== data.wrap) {
                    texture.wrapS = parseConstant(data.wrap[0]);
                    texture.wrapT = parseConstant(data.wrap[1]);
                }
                // 如果有最小
                if (void 0 !== data.minFilter) {
                    texture.minFilter = parseConstant(data.minFilter);
                }
                if (void 0 !== data.magFilter) {
                    texture.magFilter = parseConstant(data.magFilter);
                }
                if (void 0 !== data.anisotropy) {
                    texture.anisotropy = data.anisotropy;
                }
                if (void 0 !== data.flipY) {
                    texture.flipY = data.flipY;
                }
                textures[data.uuid] = texture;
            }
        }
        return textures;
    },
    parseObject : function() {
    // 声明矩阵
        var matrix = new THREE.Matrix4;
        return function(data, geometries, materials) {
            /**
             * @param {undefined} name
             * @return {?}
             */
            function getGeometry(name) {
                return void 0 === geometries[name] && console.warn('THREE.ObjectLoader: Undefined geometry', name), geometries[name];
            }
            /**
             * @param {?} name
             * @return {?}
             */
            function getMaterial(name) {
                if (void 0 !== name) {
                    return void 0 === materials[name] && console.warn('THREE.ObjectLoader: Undefined material', name), materials[name];
                }
            }
            var object;
            switch(data.type) {
            case 'Scene':
                object = new THREE.Scene;
                break;
            case 'PerspectiveCamera':
                object = new THREE.PerspectiveCamera(data.fov, data.aspect, data.near, data.far);
                if (void 0 !== data.focus) {
                    object.focus = data.focus;
                }
                if (void 0 !== data.zoom) {
                    object.zoom = data.zoom;
                }
                if (void 0 !== data.filmGauge) {
                    object.filmGauge = data.filmGauge;
                }
                if (void 0 !== data.filmOffset) {
                    object.filmOffset = data.filmOffset;
                }
                if (void 0 !== data.view) {
                    /** @type {!Object} */
                    object.view = Object.assign({}, data.view);
                }
                break;
            case 'OrthographicCamera':
                object = new THREE.OrthographicCamera(data.left, data.right, data.top, data.bottom, data.near, data.far);
                break;
            case 'AmbientLight':
                object = new THREE.AmbientLight(data.color, data.intensity);
                break;
            case 'DirectionalLight':
                object = new THREE.DirectionalLight(data.color, data.intensity);
                break;
            case 'PointLight':
                object = new THREE.PointLight(data.color, data.intensity, data.distance, data.decay);
                break;
            case 'SpotLight':
                object = new THREE.SpotLight(data.color, data.intensity, data.distance, data.angle, data.penumbra, data.decay);
                break;
            case 'HemisphereLight':
                object = new THREE.HemisphereLight(data.color, data.groundColor, data.intensity);
                break;
            case 'Mesh':
                var geometry = getGeometry(data.geometry);
                var material = getMaterial(data.material);
                object = geometry.bones && geometry.bones.length > 0 ? new THREE.SkinnedMesh(geometry, material) : new THREE.Mesh(geometry, material);
                break;
            case 'LOD':
                object = new THREE.LOD;
                break;
            case 'Line':
                object = new THREE.Line(getGeometry(data.geometry), getMaterial(data.material), data.mode);
                break;
            case 'LineSegments':
                object = new THREE.LineSegments(getGeometry(data.geometry), getMaterial(data.material));
                break;
            case 'PointCloud':
            case 'Points':
                object = new THREE.Points(getGeometry(data.geometry), getMaterial(data.material));
                break;
            case 'Sprite':
                object = new THREE.Sprite(getMaterial(data.material));
                break;
            case 'Group':
                object = new THREE.Group;
                break;
            default:
                object = new THREE.Object3D;
            }
            if (object.uuid = data.uuid, void 0 !== data.name && (object.name = data.name), void 0 !== data.matrix ? (matrix.fromArray(data.matrix), matrix.decompose(object.position, object.quaternion, object.scale)) : (void 0 !== data.position && object.position.fromArray(data.position), void 0 !== data.rotation && object.rotation.fromArray(data.rotation), void 0 !== data.scale && object.scale.fromArray(data.scale)), void 0 !== data.castShadow && (object.castShadow = data.castShadow), void 0 !== data.receiveShadow &&
            (object.receiveShadow = data.receiveShadow), void 0 !== data.visible && (object.visible = data.visible), void 0 !== data.userData && (object.userData = data.userData), void 0 !== data.children) {
                var child;
                for (child in data.children) {
                    object.add(this.parseObject(data.children[child], geometries, materials));
                }
            }
            if ('LOD' === data.type) {
                var levels = data.levels;
                /** @type {number} */
                var i = 0;
                for (; i < levels.length; i++) {
                    var level = levels[i];
                    child = object.getObjectByProperty('uuid', level.object);
                    if (void 0 !== child) {
                        object.addLevel(child, level.distance);
                    }
                }
            }
            return void 0 !== data.layers && (object.layers.mask = data.layers), object;
        };
    }()
});
