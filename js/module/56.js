var town56 = function (saveNotifs, module, n) {
    var Base = THREE.OrthographicCamera;
    /** @type {function(number): undefined} */
    var $ = (saveNotifs("7"), function(hValue) {
        Base.call(this);
        /** @type {number} */
        var r = window.innerWidth / window.innerHeight;
        /** @type {number} */
        this.left = hValue / -2 * r;
        /** @type {number} */
        this.right = hValue / 2 * r;
        /** @type {number} */
        this.top = hValue / 2;
        /** @type {number} */
        this.bottom = hValue / -2;
        /** @type {number} */
        this.near = .01;
        /** @type {number} */
        this.far = 500;
        this.updateProjectionMatrix();
    });
    $.inherit(Base, {
        update : function() {
        }
    });
    /** @type {function(number): undefined} */
    module.exports = $;
}