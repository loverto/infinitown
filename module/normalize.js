/**
 * @param {string} name
 * @return {?}
 */
function normalize(name) {
    return name.replace(/[\/]+/g, '/').replace(/\/\?/g, '?').replace(/\/#/g, '#').replace(/:\//g, '://');
}

/**
 * @return {?}
 */
export default function() {
    /** @type {string} */
    var joined = [].slice.call(arguments, 0).join('/');
    return normalize(joined);
};
