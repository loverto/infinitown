import * as THREE from 'three';
/**
 * @param {!Array} tests
 * @return {?}
 */
function r(tests) {
    // 拷贝元素，从0到26个元素
    var delta = tests.slice(0, 27);
    /** @type {number} */
    var a = 1 / (2 * Math.sqrt(Math.PI));
    /** @type {number} */
    var e = -(.5 * Math.sqrt(3 / Math.PI));
    /** @type {number} */
    var i = -e;
    /** @type {number} */
    var abcd = e;
    /** @type {number} */
    var knobHalf = .5 * Math.sqrt(15 / Math.PI);
    /** @type {number} */
    var currentRelations = -knobHalf;
    /** @type {number} */
    var c = .25 * Math.sqrt(5 / Math.PI);
    /** @type {number} */
    var addedRelations = currentRelations;
    /** @type {number} */
    var l = .25 * Math.sqrt(15 / Math.PI);
    /** @type {!Array} */
    var array = [a, a, a, e, e, e, i, i, i, abcd, abcd, abcd, knobHalf, knobHalf, knobHalf, currentRelations, currentRelations, currentRelations, c, c, c, addedRelations, addedRelations, addedRelations, l, l, l];
    return array.map(function(position, i) {
        return position * delta[i];
    });
}
/**
 * @param {string} data
 * @return {undefined}
 */
export function DataFrameReader(data) {
    THREE.FileLoader.call(this);
    this.manager = undefined !== data ? data : THREE.DefaultLoadingManager;
};
/** @type {!Object} */
DataFrameReader.prototype = Object.create(THREE.FileLoader.prototype);
/**
 * @param {string} url
 * @param {!Function} loadCallback
 * @param {!Function} onProgress
 * @param {!Function} onError
 * @return {undefined}
 */
DataFrameReader.prototype.load = function(url, loadCallback, onProgress, onError) {
    THREE.FileLoader.prototype.load.call(this, url, function(data) {
        var n = JSON.parse(data);
        var x = r(n);
        loadCallback(x);
    }, onProgress, onError);
};
