import * as THREE from 'three';
/**
 * @param {!Array} tests
 * @return {?}
 */
function r(tests) {
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
var DataFrameReader = function(data) {
    THREE.XHRLoader.call(this);
    this.manager = void 0 !== data ? data : THREE.DefaultLoadingManager;
};
/** @type {!Object} */
DataFrameReader.prototype = Object.create(THREE.XHRLoader.prototype);
/**
 * @param {string} f
 * @param {!Function} m
 * @param {!Function} data
 * @param {!Function} xhr
 * @return {undefined}
 */
DataFrameReader.prototype.load = function(f, m, data, xhr) {
    THREE.XHRLoader.prototype.load.call(this, f, function(dir) {
        /** @type {*} */
        var n = JSON.parse(dir);
        var x = r(n);
        m(x);
    }, data, xhr);
};
/** @type {function(string): undefined} */
module.export = DataFrameReader;
