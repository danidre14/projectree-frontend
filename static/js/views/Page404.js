import Component from "../DCL/core.js";
import Link from "../DCL/Link.js";

export default class Page404 extends Component {
    constructor(title, props = {}) {
        super(props);
        this.title = title || "Button";
    }
    async render() {
        return `
        <div>
        <h1>404 Not found</h1>
        ${await new Link("Go home", { to: "/" }).mount(this)}
        </div>
        `;
    }
}