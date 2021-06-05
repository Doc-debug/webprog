/**
 * creates a stroke animation that will fill out the stroke from a starting point to an end point
 * @param {string} id id of the DOM element
 * @param {number} seconds the length of the animation
 * @param {number} delay the delay of the animation start
 * @param {number} startoff the starting point of the stroke
 * @param {number} endoff the ending point of the stroke
 */
export function strokeAnim(
    id,
    seconds = 1,
    delay = 0,
    startoff = 0,
    endoff = 0
) {
    var path = document.getElementById(id);
    var length = path.getTotalLength();
    // Clear any previous transition
    path.style.transition = path.style.WebkitTransition = "none";
    // Set up the starting positions
    path.style.strokeDasharray = length + " " + length;
    path.style.strokeDashoffset = length - startoff;
    setTimeout(() => {
        // Trigger a layout so styles are calculated & the browser
        // picks up the starting position before animating
        path.getBoundingClientRect();
        // Define our transition
        path.style.transition = path.style.WebkitTransition =
            "stroke-dashoffset " + seconds + "s ease-in-out";
        // Go!
        path.style.strokeDashoffset = endoff;
    }, delay * 1000);
}
/**
 * creates an animation for the opacity of a DOM object
 * @param {string} id the id of the DOM element
 * @param {number} seconds the animation time in seconds
 * @param {number} delay the delay of the animation start
 * @param {boolean} fadein if the animation should fadein or out
 * @param {number} amount the amount to which the opacity should be changed
 */
export function opacityAnim(
    id,
    seconds = 1,
    delay = 0,
    fadein = true,
    amount = 1
) {
    var object = document.getElementById(id);
    object.style.opacity = fadein ? 0 : amount;
    object.style.transition = object.style.WebkitTransition = "none";
    setTimeout(() => {
        object.style.transition = object.style.WebkitTransition =
            "opacity " + seconds + "s ease-in-out";
        object.style.opacity = fadein ? amount : 0;
    }, delay * 1000);
    if (!fadein) {
        setTimeout(() => {
            object.style.display = "none";
        }, delay * 1000 + seconds * 1000);
    }
}
/**
 * destroys a dom object after a specified delay
 * @param {String} id of the DOM object
 * @param {Number} delay the delay of the deletion
 */
export function destroy(id, delay = 0) {
    setTimeout(() => {
        document.getElementById(id).remove();
    }, delay * 1000);
}
