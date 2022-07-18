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
    }
    async render() {
        const id = this.id ? `id="${this.id}"` : "";
        const style = this.style ? `style="${this.style}"` : "";
        const title = this.title ? `title="${this.title}"` : "";
        const classList = this.class ? `class="${this.class}"` : "";

        const onClick = this.onClick ? `onclick="${this.onClick}"` : "";
        const content = this.content;
        return `<button
            ${id}
            ${title}
            ${classList}
            ${style}
            ${onClick}
            >${content}</button>`;
    }
}