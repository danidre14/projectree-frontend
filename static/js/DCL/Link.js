import DCL from "./Component.js";

export default class Link extends DCL {
    constructor(content, props = {}) {
        super(props);
        this.content = content || "";
        this.title = props.title || "";

        this.to = props.to || "#";

        this.id = props.id || "";
        this.class = props.class || "";
        this.style = props.style || "";
        this.autofocus = props["data-dcl-autofocus"];
    }
    async render() {
        const id = this.id ? `id="${this.id}"` : "";
        const style = this.style ? `style="${this.style}"` : "";
        const title = this.title ? `title="${this.title}"` : "";
        const classList = this.class ? `class="${this.class}"` : "";
        const autofocus = this.autofocus || "";
        const content = this.content;
        return `<a
            href="${this.to}"
            ${id}
            ${title}
            ${classList}
            ${style}
            ${autofocus}
            data-dcl-link>${content}</a>`;
    }
}

// create a style element
const style = document.createElement('style');

// add the CSS as a string using template literals
style.appendChild(document.createTextNode(`
[data-dcl-link] > * {
    pointer-events: none;
}`
));

// add it to the head
const head = document.getElementsByTagName('head')[0];
head.appendChild(style);