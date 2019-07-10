function utils(require, canCreateDiscussions, exports) {
    (function(process) {
        /**
         * @param {!Array} res
         * @param {boolean} parts
         * @return {?}
         */
        function normalizeArray(res, parts) {
            /** @type {number} */
            var n = 0;
            /** @type {number} */
            var level = res.length - 1;
            for (; level >= 0; level--) {
                var code = res[level];
                if ("." === code) {
                    res.splice(level, 1);
                } else {
                    if (".." === code) {
                        res.splice(level, 1);
                        n++;
                    } else {
                        if (n) {
                            res.splice(level, 1);
                            n--;
                        }
                    }
                }
            }
            if (parts) {
                for (; n--; n) {
                    res.unshift("..");
                }
            }
            return res;
        }
        /**
         * @param {!Array} a
         * @param {!Function} f
         * @return {?}
         */
        function filter(a, f) {
            if (a.filter) {
                return a.filter(f);
            }
            /** @type {!Array} */
            var result = [];
            /** @type {number} */
            var i = 0;
            for (; i < a.length; i++) {
                if (f(a[i], i, a)) {
                    result.push(a[i]);
                }
            }
            return result;
        }
        /** @type {!RegExp} */
        var testFileRegex = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        /**
         * @param {?} filename
         * @return {?}
         */
        var splitPath = function(filename) {
            return testFileRegex.exec(filename).slice(1);
        };
        /**
         * @return {?}
         */
        exports.resolve = function() {
            /** @type {string} */
            var resolvedPath = "";
            /** @type {boolean} */
            var resolvedAbsolute = false;
            /** @type {number} */
            var i = arguments.length - 1;
            for (; i >= -1 && !resolvedAbsolute; i--) {
                var path = i >= 0 ? arguments[i] : process.cwd();
                if ("string" != typeof path) {
                    throw new TypeError("Arguments to path.resolve must be strings");
                }
                if (path) {
                    /** @type {string} */
                    resolvedPath = path + "/" + resolvedPath;
                    /** @type {boolean} */
                    resolvedAbsolute = "/" === path.charAt(0);
                }
            }
            return resolvedPath = normalizeArray(filter(resolvedPath.split("/"), function(canCreateDiscussions) {
                return !!canCreateDiscussions;
            }), !resolvedAbsolute).join("/"), (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
        };
        /**
         * @param {string} path
         * @return {?}
         */
        exports.normalize = function(path) {
            var isAbsolute = exports.isAbsolute(path);
            /** @type {boolean} */
            var synthetic = "/" === getInfoBoxData(path, -1);
            return path = normalizeArray(filter(path.split("/"), function(canCreateDiscussions) {
                return !!canCreateDiscussions;
            }), !isAbsolute).join("/"), path || isAbsolute || (path = "."), path && synthetic && (path = path + "/"), (isAbsolute ? "/" : "") + path;
        };
        /**
         * @param {string} pathname
         * @return {?}
         */
        exports.isAbsolute = function(pathname) {
            return "/" === pathname.charAt(0);
        };
        /**
         * @return {?}
         */
        exports.join = function() {
            /** @type {!Array<?>} */
            var t = Array.prototype.slice.call(arguments, 0);
            return exports.normalize(filter(t, function(v, canCreateDiscussions) {
                if ("string" != typeof v) {
                    throw new TypeError("Arguments to path.join must be strings");
                }
                return v;
            }).join("/"));
        };
        /**
         * @param {!Object} e
         * @param {!Object} parent
         * @return {?}
         */
        exports.relative = function(e, parent) {
            /**
             * @param {!Array} s
             * @return {?}
             */
            function trim(s) {
                /** @type {number} */
                var i = 0;
                for (; i < s.length && "" === s[i]; i++) {
                }
                /** @type {number} */
                var k = s.length - 1;
                for (; k >= 0 && "" === s[k]; k--) {
                }
                return i > k ? [] : s.slice(i, k - i + 1);
            }
            e = exports.resolve(e).substr(1);
            parent = exports.resolve(parent).substr(1);
            var fromParts = trim(e.split("/"));
            var toParts = trim(parent.split("/"));
            /** @type {number} */
            var KC = Math.min(fromParts.length, toParts.length);
            /** @type {number} */
            var t = KC;
            /** @type {number} */
            var i = 0;
            for (; i < KC; i++) {
                if (fromParts[i] !== toParts[i]) {
                    /** @type {number} */
                    t = i;
                    break;
                }
            }
            /** @type {!Array} */
            var args = [];
            /** @type {number} */
            i = t;
            for (; i < fromParts.length; i++) {
                args.push("..");
            }
            return args = args.concat(toParts.slice(t)), args.join("/");
        };
        /** @type {string} */
        exports.sep = "/";
        /** @type {string} */
        exports.delimiter = ":";
        /**
         * @param {?} path
         * @return {?}
         */
        exports.dirname = function(path) {
            var result = splitPath(path);
            var type = result[0];
            var i = result[1];
            return type || i ? (i && (i = i.substr(0, i.length - 1)), type + i) : ".";
        };
        /**
         * @param {?} path
         * @param {string} ext
         * @return {?}
         */
        exports.basename = function(path, ext) {
            var font = splitPath(path)[2];
            return ext && font.substr(-1 * ext.length) === ext && (font = font.substr(0, font.length - ext.length)), font;
        };
        /**
         * @param {?} path
         * @return {?}
         */
        exports.extname = function(path) {
            return splitPath(path)[3];
        };
        /** @type {function(string, number, ?): ?} */
        var getInfoBoxData = "b" === "ab".substr(-1) ? function(t, e, n) {
            return t.substr(e, n);
        } : function(p, i, n) {
            return i < 0 && (i = p.length + i), p.substr(i, n);
        };
    }).call(this, require("js/module/process27-single"));
}
