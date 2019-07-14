import canvas from 'module/Events';
require('jquery-mousewheel')($);
/**
 * @param {!Object} touches
 * @return {?}
 */
function getDistance(touches) {
    return Math.sqrt((touches[0].clientX - touches[1].clientX) * (touches[0].clientX - touches[1].clientX) + (touches[0].clientY - touches[1].clientY) * (touches[0].clientY - touches[1].clientY));
}

/**
 * @param {!Object} obj
 * @return {undefined}
 */
var init = function(obj) {
    /** @type {boolean} */
    var e = false;
    /** @type {number} */
    var radius = 0;
    obj = void 0 !== obj ? obj : window;
    $(obj).on('mousedown', function(event) {
        var e = {
            x : event.pageX,
            y : event.pageY
        };
        this.trigger('startdrag', e);
    }.bind(this));
    $(obj).on('mouseup', function(event) {
        var e = {
            x : event.pageX,
            y : event.pageY
        };
        this.trigger('enddrag', e);
    }.bind(this));
    $(obj).on('mousemove', function(event) {
        var e = {
            x : event.pageX,
            y : event.pageY
        };
        this.trigger('drag', e);
    }.bind(this));
    $(obj).on('mouseleave', function(event) {
        var e = {
            x : event.pageX,
            y : event.pageY
        };
        this.trigger('enddrag', e);
    }.bind(this));
    $(obj).on('touchstart', function(event) {
        if (2 === event.touches.length) {
            /** @type {boolean} */
            e = true;
            radius = getDistance(event.originalEvent.touches);
            this.trigger('pinchstart');
        } else {
            if (1 === event.touches.length) {
                var startP1 = {
                    x : event.touches[0].pageX,
                    y : event.touches[0].pageY
                };
                this.trigger('startdrag', startP1);
            }
        }
    }.bind(this));
    $(obj).on('touchend', function(event) {
        var startP1 = {
            x : 0,
            y : 0
        };
        if (0 === event.originalEvent.touches.length) {
            if (e) {
                /** @type {boolean} */
                e = false;
                this.trigger('pinchend');
            }
            this.trigger('enddrag', startP1);
        }
    }.bind(this));
    $(obj).on('touchmove', function(event) {
        if (e) {
            var touches = event.originalEvent.touches;
            if (2 === touches.length) {
                /** @type {number} */
                var y1 = getDistance(touches) - radius;
                /** @type {number} */
                var sql_date = Math.max(1 + y1 / 100, 0);
                this.trigger('pinchchange', sql_date);
            }
        } else {
            var startP1 = {
                x : event.touches[0].pageX,
                y : event.touches[0].pageY
            };
            this.trigger('drag', startP1);
        }
        event.preventDefault();
    }.bind(this));
    $(obj).on('mousewheel', function(touch) {
        var dy = touch.deltaY;
        this.trigger('mousewheel', dy);
    }.bind(this));
};
init.mixin(canvas);

/** @type {function(!Object): undefined} */
export default init;
