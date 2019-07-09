var town33=function(require, module, val) {
        !function(factory) {
            if ("function" == typeof define && define.amd) {
                define(["jquery"], factory);
            } else {
                if ("object" == typeof val) {
                    /** @type {function(!Object): undefined} */
                    module.exports = factory;
                } else {
                    factory(jQuery);
                }
            }
        }(function($) {
            /**
             * @param {!Object} event
             * @return {?}
             */
            function handler(event) {
                var orgEvent = event || window.event;
                /** @type {!Array<?>} */
                var args = slice.call(arguments, 1);
                /** @type {number} */
                var delta = 0;
                /** @type {number} */
                var deltaX = 0;
                /** @type {number} */
                var deltaY = 0;
                /** @type {number} */
                var absDelta = 0;
                /** @type {number} */
                var offsetX = 0;
                /** @type {number} */
                var offsetY = 0;
                if (event = $.event.fix(orgEvent), event.type = "mousewheel", "detail" in orgEvent && (deltaY = orgEvent.detail * -1), "wheelDelta" in orgEvent && (deltaY = orgEvent.wheelDelta), "wheelDeltaY" in orgEvent && (deltaY = orgEvent.wheelDeltaY), "wheelDeltaX" in orgEvent && (deltaX = orgEvent.wheelDeltaX * -1), "axis" in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS && (deltaX = deltaY * -1, deltaY = 0), delta = 0 === deltaY ? deltaX : deltaY, "deltaY" in orgEvent && (deltaY = orgEvent.deltaY *
                    -1, delta = deltaY), "deltaX" in orgEvent && (deltaX = orgEvent.deltaX, 0 === deltaY && (delta = deltaX * -1)), 0 !== deltaY || 0 !== deltaX) {
                    if (1 === orgEvent.deltaMode) {
                        var lineHeight = $.data(this, "mousewheel-line-height");
                        /** @type {number} */
                        delta = delta * lineHeight;
                        /** @type {number} */
                        deltaY = deltaY * lineHeight;
                        /** @type {number} */
                        deltaX = deltaX * lineHeight;
                    } else {
                        if (2 === orgEvent.deltaMode) {
                            var pageHeight = $.data(this, "mousewheel-page-height");
                            /** @type {number} */
                            delta = delta * pageHeight;
                            /** @type {number} */
                            deltaY = deltaY * pageHeight;
                            /** @type {number} */
                            deltaX = deltaX * pageHeight;
                        }
                    }
                    if (absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX)), (!lowestDelta || absDelta < lowestDelta) && (lowestDelta = absDelta, shouldAdjustOldDeltas(orgEvent, absDelta) && (lowestDelta = lowestDelta / 40)), shouldAdjustOldDeltas(orgEvent, absDelta) && (delta = delta / 40, deltaX = deltaX / 40, deltaY = deltaY / 40), delta = Math[delta >= 1 ? "floor" : "ceil"](delta / lowestDelta), deltaX = Math[deltaX >= 1 ? "floor" : "ceil"](deltaX / lowestDelta), deltaY = Math[deltaY >= 1 ? "floor" :
                        "ceil"](deltaY / lowestDelta), special.settings.normalizeOffset && this.getBoundingClientRect) {
                        var rect = this.getBoundingClientRect();
                        /** @type {number} */
                        offsetX = event.clientX - rect.left;
                        /** @type {number} */
                        offsetY = event.clientY - rect.top;
                    }
                    return event.deltaX = deltaX, event.deltaY = deltaY, event.deltaFactor = lowestDelta, event.offsetX = offsetX, event.offsetY = offsetY, event.deltaMode = 0, args.unshift(event, delta, deltaX, deltaY), timeout && clearTimeout(timeout), timeout = setTimeout(checkChanges, 200), ($.event.dispatch || $.event.handle).apply(this, args);
                }
            }
            /**
             * @return {undefined}
             */
            function checkChanges() {
                /** @type {null} */
                lowestDelta = null;
            }
            /**
             * @param {!Object} orgEvent
             * @param {number} absDelta
             * @return {?}
             */
            function shouldAdjustOldDeltas(orgEvent, absDelta) {
                return special.settings.adjustOldDeltas && "mousewheel" === orgEvent.type && absDelta % 120 === 0;
            }
            var timeout;
            var lowestDelta;
            /** @type {!Array} */
            var toFix = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"];
            /** @type {!Array} */
            var toBind = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"];
            /** @type {function(this:(IArrayLike<T>|string), *=, *=): !Array<T>} */
            var slice = Array.prototype.slice;
            if ($.event.fixHooks) {
                /** @type {number} */
                var i = toFix.length;
                for (; i;) {
                    $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
                }
            }
            var special = $.event.special.mousewheel = {
                version : "3.1.12",
                setup : function() {
                    if (this.addEventListener) {
                        /** @type {number} */
                        var i = toBind.length;
                        for (; i;) {
                            this.addEventListener(toBind[--i], handler, false);
                        }
                    } else {
                        /** @type {function(!Object): ?} */
                        this.onmousewheel = handler;
                    }
                    $.data(this, "mousewheel-line-height", special.getLineHeight(this));
                    $.data(this, "mousewheel-page-height", special.getPageHeight(this));
                },
                teardown : function() {
                    if (this.removeEventListener) {
                        /** @type {number} */
                        var i = toBind.length;
                        for (; i;) {
                            this.removeEventListener(toBind[--i], handler, false);
                        }
                    } else {
                        /** @type {null} */
                        this.onmousewheel = null;
                    }
                    $.removeData(this, "mousewheel-line-height");
                    $.removeData(this, "mousewheel-page-height");
                },
                getLineHeight : function(elem) {
                    var $elem = $(elem);
                    var d = $elem["offsetParent" in $.fn ? "offsetParent" : "parent"]();
                    return d.length || (d = $("body")), parseInt(d.css("fontSize"), 10) || parseInt($elem.css("fontSize"), 10) || 16;
                },
                getPageHeight : function(elem) {
                    return $(elem).height();
                },
                settings : {
                    adjustOldDeltas : true,
                    normalizeOffset : true
                }
            };
            $.fn.extend({
                mousewheel : function(fn) {
                    return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
                },
                unmousewheel : function(fn) {
                    return this.unbind("mousewheel", fn);
                }
            });
        });
    }
