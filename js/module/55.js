var town55 = function (require, module, n) {
    var rect = require("50");
    var $ = require("59");
    /** @type {number} */
    var MIN_BUFFER_ROWS = rect.CHUNK_SIZE * rect.TABLE_SIZE;
    var clamp = THREE.Math.euclideanModulo;
    /**
     * @param {string} data
     * @return {undefined}
     */
    var render = function(data) {
        THREE.Object3D.call(this);
        /** @type {null} */
        this.previousChunk = null;
        /** @type {string} */
        this.table = data;
        this.tablePosition = new THREE.Vector3;
        this.lastTablePosition = new THREE.Vector3;
        this.lastPosition = new THREE.Vector3;
    };
    render.inherit(THREE.Object3D, {
        _updateTablePosition : function() {
            $.getTablePosition(this.position, this.parent.tableX, this.parent.tableY, this.tablePosition);
            if (0 === this.lastTablePosition.length()) {
                this.lastTablePosition.copy(this.tablePosition);
            }
            /** @type {number} */
            var t = this.tablePosition.x - this.lastTablePosition.x;
            /** @type {number} */
            var e = this.tablePosition.z - this.lastTablePosition.z;
            this.lastTablePosition.copy(this.tablePosition);
            /** @type {number} */
            var i = Math.floor(clamp(this.tablePosition.x + 40, MIN_BUFFER_ROWS) / rect.CHUNK_SIZE);
            /** @type {number} */
            var name = Math.floor(clamp(this.tablePosition.z + 40, MIN_BUFFER_ROWS) / rect.CHUNK_SIZE);
            var context = this.parent;
            var dom = this.table.chunks[i][name].node;
            if (Math.abs(t) < 500 && Math.abs(t) > 20 && console.log("warp on X", t, context.tableX, dom.tableX), Math.abs(e) < 500 && Math.abs(e) > 20 && console.log("warp on Z", e, context.tableY, dom.tableY), this.previousChunk !== context && context !== dom, this.lastPosition.copy(this.position), dom !== context) {
                dom.add(this);
                /** @type {number} */
                var min_x = clamp(this.position.x + 40, rect.CHUNK_SIZE) - 40;
                /** @type {number} */
                var _depth = clamp(this.position.z + 40, rect.CHUNK_SIZE) - 40;
                /** @type {number} */
                this.position.x = min_x;
                /** @type {number} */
                this.position.z = _depth;
            }
            this.previousChunk = context;
        }
    });
    /** @type {function(string): undefined} */
    module.exports = render;
}