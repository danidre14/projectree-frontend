import DCL, { Button, Link, Loader } from "../DCL/core.js";

export default class TemplateView extends DCL {
    constructor(props) {
        super(props);
        this.setTitle("TemplateView");

        this.state = { 
            count: 0
        }
    }

    async onMount() {
        DCL.triggerFunc(this.setState("count", this.state.count + 5));
    }

    async onUnmount() {
        
    }

    async render() {
        const setCount = this.setState("count", this.state.count + 1);
        return `
            ${await new Button("Click here to increase", { onClick: setCount }).mount(this)}
        `;
    }
}