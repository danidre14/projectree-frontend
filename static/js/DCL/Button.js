import DCL from "./Component.js";

export default class Button extends DCL {
    constructor(content, props = {}) {
        super(props);
        this.content = content || "";
        this.title = props.title || "";

        this.onClick = props.onClick || null;

        this.id = props.id || "";
        this.class = props.class || "";
        this.style = props.style || "";
        this.autofocus = props["data-dcl-autofocus"];
        this.form = props.form || "";
    }
    async render() {
        const id = this.id ? `id="${this.id}"` : "";
        const style = this.style ? `style="${this.style}"` : "";
        const title = this.title ? `title="${this.title}"` : "";
        const form = this.form ? `form="${this.form}"` : "";
        const autofocus = this.autofocus || "";
        const classList = this.class ? `class="${this.class}"` : "";

        const onClick = this.onClick ? `onclick="${this.onClick}"` : "";
        const content = this.content;
        return `<button
            ${id}
            ${title}
            ${classList}
            ${style}
            ${onClick}
            ${form}
            ${autofocus}
            data-dcl-button>${content}</button>`;
    }
}

// create a style element
const style = document.createElement('style');

// add the CSS as a string using template literals
style.appendChild(document.createTextNode(`
[data-dcl-button] > * {
    pointer-events: none;
}`
));

// add it to the head
const head = document.getElementsByTagName('head')[0];
head.appendChild(style);