var town10 = function (canCreateDiscussions, m, n) {
    /**
     * @param {string} data
     * @return {undefined}
     */
    var load = function(data) {
        THREE.XHRLoader.call(this);
        this.setResponseType("arraybuffer");
        this.manager = void 0 !== data ? data : THREE.DefaultLoadingManager;
    };
    /** @type {!Object} */
    load.prototype = Object.create(THREE.XHRLoader.prototype);
    /** @type {function(string): undefined} */
    m.exports = load;
}