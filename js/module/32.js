var town32 = function (canCreateDiscussions, moduleTransport, n) {
    !function(module) {
        /**
         * @param {string} value
         * @return {?}
         */
        function is_iri(value) {
            if (value && !/[^a-z0-9:\/\?#\[\]@!\$&'\(\)\*\+,;=\.\-_~%]/i.test(value) && !/%[^0-9a-f]/i.test(value) && !/%[0-9a-f](:?[^0-9a-f]|$)/i.test(value)) {
                /** @type {!Array} */
                var result = [];
                /** @type {string} */
                var n = "";
                /** @type {string} */
                var lang = "";
                /** @type {string} */
                var expression = "";
                /** @type {string} */
                var body = "";
                /** @type {string} */
                var prefix = "";
                /** @type {string} */
                var s = "";
                if (result = splitUri(value), n = result[1], lang = result[2], expression = result[3], body = result[4], prefix = result[5], n && n.length && expression.length >= 0) {
                    if (lang && lang.length) {
                        if (0 !== expression.length && !/^\//.test(expression)) {
                            return;
                        }
                    } else {
                        if (/^\/\//.test(expression)) {
                            return;
                        }
                    }
                    if (/^[a-z][a-z0-9\+\-\.]*$/.test(n.toLowerCase())) {
                        return s = s + (n + ":"), lang && lang.length && (s = s + ("//" + lang)), s = s + expression, body && body.length && (s = s + ("?" + body)), prefix && prefix.length && (s = s + ("#" + prefix)), s;
                    }
                }
            }
        }
        /**
         * @param {string} value
         * @param {boolean} _flexdatalist
         * @return {?}
         */
        function is_http_iri(value, _flexdatalist) {
            if (is_iri(value)) {
                /** @type {!Array} */
                var m = [];
                /** @type {string} */
                var prefix = "";
                /** @type {string} */
                var val = "";
                /** @type {string} */
                var append = "";
                /** @type {string} */
                var key = "";
                /** @type {string} */
                var code = "";
                /** @type {string} */
                var current = "";
                /** @type {string} */
                var result = "";
                if (m = splitUri(value), prefix = m[1], val = m[2], append = m[3], code = m[4], current = m[5], prefix) {
                    if (_flexdatalist) {
                        if ("https" != prefix.toLowerCase()) {
                            return;
                        }
                    } else {
                        if ("http" != prefix.toLowerCase()) {
                            return;
                        }
                    }
                    if (val) {
                        return /:(\d+)$/.test(val) && (key = val.match(/:(\d+)$/)[0], val = val.replace(/:\d+$/, "")), result = result + (prefix + ":"), result = result + ("//" + val), key && (result = result + key), result = result + append, code && code.length && (result = result + ("?" + code)), current && current.length && (result = result + ("#" + current)), result;
                    }
                }
            }
        }
        /**
         * @param {string} value
         * @return {?}
         */
        function is_https_iri(value) {
            return is_http_iri(value, true);
        }
        /**
         * @param {string} value
         * @return {?}
         */
        function is_web_iri(value) {
            return is_http_iri(value) || is_https_iri(value);
        }
        /** @type {function(string): ?} */
        module.exports.is_uri = is_iri;
        /** @type {function(string, boolean): ?} */
        module.exports.is_http_uri = is_http_iri;
        /** @type {function(string): ?} */
        module.exports.is_https_uri = is_https_iri;
        /** @type {function(string): ?} */
        module.exports.is_web_uri = is_web_iri;
        /** @type {function(string): ?} */
        module.exports.isUri = is_iri;
        /** @type {function(string, boolean): ?} */
        module.exports.isHttpUri = is_http_iri;
        /** @type {function(string): ?} */
        module.exports.isHttpsUri = is_https_iri;
        /** @type {function(string): ?} */
        module.exports.isWebUri = is_web_iri;
        /**
         * @param {string} uri
         * @return {?}
         */
        var splitUri = function(uri) {
            var components = uri.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/);
            return components;
        };
    }(moduleTransport);
}