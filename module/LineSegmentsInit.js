import * as THREE  from 'three';

var LineSegmentsInit = function(obj) {
    obj = _.extend({
        size : 100,
        step : 10,
        color : 0,
        opacity : .2
    }, obj);
    // 设置线几何体
    var lineGeometry = new THREE.Geometry;
    var size = obj.size;
    var i = -size;
    for (; i <= size; i = i + obj.step) {
        lineGeometry.vertices.push(new THREE.Vector3(-size, 0, i));
        lineGeometry.vertices.push(new THREE.Vector3(size, 0, i));
        lineGeometry.vertices.push(new THREE.Vector3(i, 0, -size));
        lineGeometry.vertices.push(new THREE.Vector3(i, 0, size));
    }
    // 设置线材质
    var lineBasicMaterial = new THREE.LineBasicMaterial({
        color : obj.color,
        opacity : obj.opacity,
        transparent : true
    });
    THREE.LineSegments.call(this, lineGeometry, lineBasicMaterial);
};
LineSegmentsInit.inherit(THREE.LineSegments);

export default LineSegmentsInit;
