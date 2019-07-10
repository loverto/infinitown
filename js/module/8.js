var town8 = function (canCreateDiscussions, context, n) {
    /**
     * @param {!Object} obj
     * @return {undefined}
     */
    var init = function(obj) {
        obj = _.extend({
            size : 100,
            step : 10,
            color : 0,
            opacity : .2
        }, obj);
        var lineGeometry = new THREE.Geometry;
        var size = obj.size;
        /** @type {number} */
        var i = -size;
        for (; i <= size; i = i + obj.step) {
            lineGeometry.vertices.push(new THREE.Vector3(-size, 0, i));
            lineGeometry.vertices.push(new THREE.Vector3(size, 0, i));
            lineGeometry.vertices.push(new THREE.Vector3(i, 0, -size));
            lineGeometry.vertices.push(new THREE.Vector3(i, 0, size));
        }
        var throw42 = new THREE.LineBasicMaterial({
            color : obj.color,
            opacity : obj.opacity,
            transparent : true
        });
        THREE.LineSegments.call(this, lineGeometry, throw42);
    };
    init.inherit(THREE.LineSegments);
    /** @type {function(!Object): undefined} */
    context.exports = init;
}