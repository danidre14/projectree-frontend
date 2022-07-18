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
    }
    async render() {
        const id = this.id ? `id="${this.id}"` : "";
        const style = this.style ? `style="${this.style}"` : "";
        const title = this.title ? `title="${this.title}"` : "";
        const classList = this.class ? `class="${this.class}"` : "";
        const content = this.content;
        return `<a
            href="${this.to}"
            ${id}
            ${title}
            ${classList}
            ${style}
            data-link>${content}</a>`;
    }
}