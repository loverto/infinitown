import {Geometry, LineBasicMaterial, LineSegments, Vector3} from "three";

class LineSegmentsInit extends LineSegments{
    constructor(obj) {
        obj = _.extend({
            size : 100,
            step : 10,
            color : 0,
            opacity : .2
        }, obj);
        // 设置线几何体
        var lineGeometry = new Geometry;
        var size = obj.size;
        var i = -size;
        for (; i <= size; i = i + obj.step) {
            lineGeometry.vertices.push(new Vector3(-size, 0, i));
            lineGeometry.vertices.push(new Vector3(size, 0, i));
            lineGeometry.vertices.push(new Vector3(i, 0, -size));
            lineGeometry.vertices.push(new Vector3(i, 0, size));
        }
        // 设置线材质
        var lineBasicMaterial = new LineBasicMaterial({
            color : obj.color,
            opacity : obj.opacity,
            transparent : true
        });
        super(lineGeometry, lineBasicMaterial);
    }
}

export default LineSegmentsInit;
