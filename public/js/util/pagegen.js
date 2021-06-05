/** Class for creating a fullpage overlay that can be closed */
export class Page {
    /**
     * Init all default objects like close button and contentbox
     * @param {Number} zIndex the z-index of the page
     */
    constructor(zIndex = 1) {
        this.page = document.createElement("div");
        this.page.classList.add("pagegen-page");
        this.page.style.zIndex = zIndex;
        document.body.appendChild(this.page);

        this.closebtn = document.createElement("a");
        this.closebtn.innerHTML =
            '<svg viewBox="0 0 500 500"><path class="fill" d="M84,430.8c-4,0-7.7-1.5-10.5-4.3s-4.3-6.5-4.3-10.5s1.5-7.7,4.3-10.5L229,250L73.5,94.5c-5.8-5.8-5.8-15.2,0-21c2.8-2.8,6.5-4.3,10.5-4.3s7.7,1.5,10.5,4.3L250,229L405.5,73.5c2.8-2.8,6.5-4.3,10.5-4.3s7.7,1.5,10.5,4.3s4.3,6.5,4.3,10.5s-1.5,7.7-4.3,10.5L271,250l155.5,155.5c5.8,5.8,5.8,15.2,0,21c-2.8,2.8-6.5,4.3-10.5,4.3s-7.7-1.5-10.5-4.3L250,271L94.5,426.5C91.7,429.3,88,430.8,84,430.8z"/></svg>';
        this.closebtn.classList.add("pagegen-closebtn");
        this.closebtn.addEventListener("click", () => {
            this.toggle(false);
        });
        this.page.appendChild(this.closebtn);

        this.content = document.createElement("div");
        this.content.classList.add("content");
        this.page.appendChild(this.content);

        this.active = false;
    }

    /**
     * toggle the visibility state of the page
     * @param {boolean} state if the page is visible or not
     */
    toggle(state = null) {
        if (state != null) this.active = state;
        else this.active = !this.active;
        this.page.style.top = this.active ? "0px" : "";
    }

    /**
     * adds a DOM object to the page
     *
     * @param {String} type dom type
     * @param {String} innerHTML content of the dom
     * @param {Array} attr 2d array containing attributes and their value (this could have been done in an object but it is easier to parse this way)
     * the structure is: [[key1, value1],[key2, value2],[key3, value3]]
     */
    addObj(type, innerHTML, attr = []) {
        let obj = document.createElement(type);
        attr.forEach((ele) => {
            obj.setAttribute(ele[0], ele[1]);
        });
        obj.innerHTML = innerHTML;
        this.content.appendChild(obj);
    }
}
