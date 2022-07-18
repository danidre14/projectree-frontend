import DCL from "./Component.js";

export default class Loader extends DCL {
    async render() {
        return `<div>${this.props.condition ? this.props.loaded : this.props.loading }</div>`;
    }
}