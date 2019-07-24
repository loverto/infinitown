import process from 'module/process';

function normalizeArray(res, parts) {
    var n = 0;
    var level = res.length - 1;
    for (; level >= 0; level--) {
        var code = res[level];
        if ('.' === code) {
            res.splice(level, 1);
        } else {
            if ('..' === code) {
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
            res.unshift('..');
        }
    }
    return res;
}

function filter(a, f) {
    if (a.filter) {
        return a.filter(f);
    }
    var result = [];
    var i = 0;
    for (; i < a.length; i++) {
        if (f(a[i], i, a)) {
            result.push(a[i]);
        }
    }
    return result;
}
var testFileRegex = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

var splitPath = function(filename) {
    return testFileRegex.exec(filename).slice(1);
};


export const resolve = function() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var i = arguments.length - 1;
    for (; i >= -1 && !resolvedAbsolute; i--) {
        var path = i >= 0 ? arguments[i] : process.cwd();
        if ('string' != typeof path) {
            throw new TypeError('Arguments to path.resolve must be strings');
        }
        if (path) {
            resolvedPath = path + '/' + resolvedPath;
            resolvedAbsolute = '/' === path.charAt(0);
        }
    }
    return resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(canCreateDiscussions) {
        return !!canCreateDiscussions;
    }), !resolvedAbsolute).join('/'), (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
};


export const normalize = function(path) {
    var isAbs = isAbsolute(path);
    var synthetic = '/' === getInfoBoxData(path, -1);
    return path = normalizeArray(filter(path.split('/'), function(canCreateDiscussions) {
        return !!canCreateDiscussions;
    }), !isAbs).join('/'), path || isAbs || (path = '.'), path && synthetic && (path = path + '/'), (isAbs ? '/' : '') + path;
};

export const isAbsolute = function(pathname) {
    return '/' === pathname.charAt(0);
};

export const join = function() {
    var t = Array.prototype.slice.call(arguments, 0);
    return normalize(filter(t, function(v, canCreateDiscussions) {
        if ('string' != typeof v) {
            throw new TypeError('Arguments to path.join must be strings');
        }
        return v;
    }).join('/'));
};


export const relative = function(e, parent) {

    function trim(s) {
        var i = 0;
        for (; i < s.length && '' === s[i]; i++) {
        }
        var k = s.length - 1;
        for (; k >= 0 && '' === s[k]; k--) {
        }
        return i > k ? [] : s.slice(i, k - i + 1);
    }
    e = resolve(e).substr(1);
    parent = resolve(parent).substr(1);
    var fromParts = trim(e.split('/'));
    var toParts = trim(parent.split('/'));
    var KC = Math.min(fromParts.length, toParts.length);
    var t = KC;
    var i = 0;
    for (; i < KC; i++) {
        if (fromParts[i] !== toParts[i]) {
            t = i;
            break;
        }
    }
    var args = [];
    i = t;
    for (; i < fromParts.length; i++) {
        args.push('..');
    }
    return args = args.concat(toParts.slice(t)), args.join('/');
};

export const sep = '/';

export const delimiter = ':';

export const dirname = function(path) {
    var result = splitPath(path);
    var type = result[0];
    var i = result[1];
    return type || i ? (i && (i = i.substr(0, i.length - 1)), type + i) : '.';
};

export const basename = function(path, ext) {
    var font = splitPath(path)[2];
    return ext && font.substr(-1 * ext.length) === ext && (font = font.substr(0, font.length - ext.length)), font;
};

export const extname = function(path) {
    return splitPath(path)[3];
};

var getInfoBoxData = 'b' === 'ab'.substr(-1) ? function(t, e, n) {
    return t.substr(e, n);
} : function(p, i, n) {
    return i < 0 && (i = p.length + i), p.substr(i, n);
};
