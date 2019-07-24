import * as THREE from 'three';

function r(tests) {
    // 拷贝元素，从0到26个元素
    var delta = tests.slice(0, 27);
    var a = 1 / (2 * Math.sqrt(Math.PI));
    var e = -(.5 * Math.sqrt(3 / Math.PI));
    var i = -e;
    var abcd = e;
    var knobHalf = .5 * Math.sqrt(15 / Math.PI);
    var currentRelations = -knobHalf;
    var c = .25 * Math.sqrt(5 / Math.PI);
    var addedRelations = currentRelations;
    var l = .25 * Math.sqrt(15 / Math.PI);
    var array = [a, a, a, e, e, e, i, i, i, abcd, abcd, abcd, knobHalf, knobHalf, knobHalf, currentRelations, currentRelations, currentRelations, c, c, c, addedRelations, addedRelations, addedRelations, l, l, l];
    return array.map(function(position, i) {
        return position * delta[i];
    });
}

export function DataFrameReader(data) {
    THREE.FileLoader.call(this);
    this.manager = undefined !== data ? data : THREE.DefaultLoadingManager;
};
DataFrameReader.prototype = Object.create(THREE.FileLoader.prototype);

DataFrameReader.prototype.load = function(url, loadCallback, onProgress, onError) {
    THREE.FileLoader.prototype.load.call(this, url, function(data) {
        var n = JSON.parse(data);
        var x = r(n);
        loadCallback(x);
    }, onProgress, onError);
};
