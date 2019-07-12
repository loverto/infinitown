var bindHandlers = require("module/seedrandomProperties");
var seg = require("module/state");
var types = {
    random : function() {
        var colContentLeft = bindHandlers(seg.RANDOM_SEED);
        return function() {
            return seg.RANDOM_SEED_ENABLED ? colContentLeft() : Math.random();
        };
    }(),
    roundVector : function(center, size) {
        if (void 0 === size || 0 === size) {
            return center.round(), center;
        }
        /** @type {number} */
        var scale = Math.pow(10, size);
        return center.x = Math.round(center.x * scale) / scale, center.y = Math.round(center.y * scale) / scale, center.z = Math.round(center.z * scale) / scale, center;
    },
    getTablePosition : function(origin, scale, radius, first) {
        return first.x = seg.CHUNK_SIZE * scale + origin.x, first.z = seg.CHUNK_SIZE * radius + origin.z, first;
    }
};
module.exports = types;
var town59=function(require, module, n) {
        var bindHandlers = require("module/seedrandomProperties");
        var seg = require("module/50");
        var types = {
            random : function() {
                var colContentLeft = bindHandlers(seg.RANDOM_SEED);
                return function() {
                    return seg.RANDOM_SEED_ENABLED ? colContentLeft() : Math.random();
                };
            }(),
            roundVector : function(center, size) {
                if (void 0 === size || 0 === size) {
                    return center.round(), center;
                }
                /** @type {number} */
                var scale = Math.pow(10, size);
                return center.x = Math.round(center.x * scale) / scale, center.y = Math.round(center.y * scale) / scale, center.z = Math.round(center.z * scale) / scale, center;
            },
            getTablePosition : function(origin, scale, radius, first) {
                return first.x = seg.CHUNK_SIZE * scale + origin.x, first.z = seg.CHUNK_SIZE * radius + origin.z, first;
            }
        };
        module.exports = types;
    }
