function scope1(require, module, n) {
    var $ = require("24");
    var parseUrl = require("js/module/parseUrl29-single");
    var ImageLoader = require("16");
    var Big = require("11");
    var List = require("9");
    var Type = require("12");
    var Connection = require("10");
    var manager = new THREE.LoadingManager;
    var loader = new ImageLoader(manager);
    var name = {};
    var target = normalize(new THREE.TextureLoader(manager), name);
    var list = normalize(new Big(1024, false, manager), name);
    var y = normalize(new List(256, false, manager), name);
    var nsListById = {};
    var type = new Type(manager);
    var schema = {};
    var c = normalize(new Connection(manager), schema);
    var self = {
        environmentPath : "assets/environments",
        geometryPath : "assets/scenes/data/",
        manager : manager,
        sceneLoader : loader
    };
    /** @type {string} */
    var temp = "";
    /**
     * @param {!Object} tree
     * @param {!Object} event
     * @return {?}
     */
    function normalize(tree, event) {
        return {
            _cache : event || {},
            load : function(f, m, callback, options, path) {
                var cache = this._cache;
                if (_.has(cache, path)) {
                    resolve(cache[path]);
                } else {
                    tree.load(f, function(tmpl) {
                        cache[path] = tmpl;
                        m.apply(this, arguments);
                    }, callback, options);
                }
            },
            get : function(path) {
                return _.has(this._cache, path) || console.error("Resource not found: " + path), this._cache[path];
            }
        };
    }
    /**
     * @param {?} selector
     * @param {?} name
     * @param {?} close
     * @param {!Function} callback
     * @return {?}
     */
    function exec(selector, name, close, callback) {
        return _.isArray(selector) || (selector = [selector]), $.all(_.map(selector, function(ext) {
            if (callback) {
                return callback(parseUrl(name, ext), ext, close);
            }
        }));
    }
    /**
     * @param {string} url
     * @param {string} name
     * @param {!Object} type
     * @return {?}
     */
    function load(url, name, type) {
        return new $(function(i, stepCallback) {
            type.load(url, function(t) {
                /** @type {string} */
                t.filename = name;
                i(arguments.length > 1 ? _.toArray(arguments) : t);
            }, function() {
            }, function() {
                stepCallback(new Error("Resource was not found: " + url));
            }, name);
        });
    }
    /**
     * @param {!Array} c
     * @param {?} b
     * @param {?} a
     * @return {?}
     */
    function fn(c, b, a) {
        return c = c || [], exec(c, b, a, load);
    }

    Object.defineProperty(self, "texturePath", {
        get : function() {
            return temp;
        },
        set : function(dir) {
            temp = dir;
            loader.setTexturePath(dir);
        }
    });
    /**
     * @param {string} url
     * @param {string} key
     * @return {?}
     */
    self.loadScene = function(url, key) {
        return load(url, key, loader);
    };
    /**
     * @param {!Array} t
     * @param {?} i
     * @return {?}
     */
    self.loadOBJs = function(t, i) {
        return fn(t, i, objLoader);
    };
    /**
     * @param {!Array} selected
     * @param {!Object} options
     * @return {?}
     */
    self.loadTextures = function(selected, options) {
        return fn(selected, options || self.texturePath, target);
    };
    /**
     * @param {!Array} t
     * @param {?} i
     * @return {?}
     */
    self.loadBRDFs = function(t, i) {
        return fn(t, i, brdfLoader);
    };
    /**
     * @param {!Array} args
     * @param {string} options
     * @return {?}
     */
    self.loadPanoramas = function(args, options) {
        return fn(args, options || self.environmentPath, list);
    };
    /**
     * @param {!Array} args
     * @param {string} options
     * @return {?}
     */
    self.loadSpecularCubemaps = function(args, options) {
        return fn(args, options || self.environmentPath, y);
    };
    /**
     * @param {!Function} fn
     * @return {?}
     */
    self.loadSH = function(fn) {
        return $.all(_.map(fn, function(id) {
            return new $(function(e, stepCallback) {
                var r = parseUrl(self.environmentPath, id + "/irradiance.json");
                type.load(r, function(n) {
                    nsListById[id] = n;
                    e(n);
                }, function() {
                }, function() {
                    stepCallback(new Error("Resource was not found: " + r));
                });
            });
        }));
    };
    /**
     * @param {?} e
     * @param {string} options
     * @return {?}
     */
    self.loadGeometries = function(e, options) {
        return e = _.map(e, function(canCreateDiscussions) {
            return canCreateDiscussions + ".bin";
        }), fn(e, options || self.geometryPath, c);
    };
    /**
     * @param {string} key
     * @return {?}
     */
    self.getTexture = function(key) {
        return target.get(key);
    };
    /**
     * @param {string} t
     * @return {?}
     */
    self.getBRDF = function(t) {
        return brdfLoader.get(t);
    };
    /**
     * @param {string} name
     * @return {?}
     */
    self.getPanorama = function(name) {
        return list.get(name + "/panorama.bin");
    };
    /**
     * @param {string} i
     * @return {?}
     */
    self.getCubemap = function(i) {
        return y.get(i + "/cubemap.bin");
    };
    /**
     * @param {?} notebookID
     * @return {?}
     */
    self.getSH = function(notebookID) {
        return nsListById[notebookID];
    };
    /**
     * @param {string} name
     * @return {?}
     */
    self.getGeometry = function(name) {
        return c.get(name + ".bin");
    };
    module.exports = self;
}
