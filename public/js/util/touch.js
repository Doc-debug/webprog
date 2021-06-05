/** Class for recognition of different touch events
 *  this is actually not used anywhere.
 *  It could be useful if we where to continue with this project
 */
export class TouchEvent {
    /**
     *
     * @param {DOMobj} obj the object that should be listened
     * @param {function} longFunct the function for touch hold
     * @param {function} shortFunct the function for short taps
     */
    constructor(obj, longFunct, shortFunct) {
        this.obj = obj;

        this.longFunct = longFunct;
        this.shortFunct = shortFunct;

        this.longTouchDuration = 500;
        this.timer = null;
        let that = this;
        this.done = false;
        this.obj.addEventListener("touchstart", function (e) {
            that.touchstart(that);
        });
        this.obj.addEventListener("touchend", function (e) {
            that.touchend(that);
        });
    }

    /**
     * called when the user touches the object
     * since this is called in an event listener we have to pass the class object to access variables
     * @param {TouchEvent} that the class object
     */
    touchstart(that) {
        that.timer = setTimeout(function () {
            that.longFunct();
            that.done = true;
        }, that.longTouchDuration);
    }

    /**
     * called when the user lifts their finger from the object
     * since this is called in an event listener we have to pass the class object to access variables
     * @param {TouchEvent} that the class object
     */
    touchend(that) {
        if (!that.done) {
            clearTimeout(that.timer);
            if (that.shortFunct) that.shortFunct();
        }
    }
}
