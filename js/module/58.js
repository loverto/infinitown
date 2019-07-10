var town58 = function (canCreateDiscussions, module, n) {
    var ctor = THREE.PerspectiveCamera;
    var value = new THREE.Vector3;
    /**
     * @return {undefined}
     */
    var $ = function() {
        ctor.apply(this, arguments);
        /** @type {number} */
        this.targetHeight = 140;
    };
    $.inherit(ctor, {
        updateHeight : function() {
            /** @type {number} */
            var length = 1E3;
            /** @type {number} */
            var vertCoords = -100;
            return function(i, canCreateDiscussions) {
                /** @type {number} */
                i = i * vertCoords;
                length = length + i;
                /** @type {number} */
                length = Math.min(Math.max(length + i, 0), 1E3);
                this.targetHeight = THREE.Math.mapLinear(length, 0, 1E3, 30, 140);
                if (canCreateDiscussions) {
                    this.position.y = this.targetHeight;
                }
            };
        }(),
        update : function() {
            this.position.y += .05 * (this.targetHeight - this.position.y);
            this.lookAt(value);
        }
    });
    /** @type {function(): undefined} */
    module.exports = $;
}