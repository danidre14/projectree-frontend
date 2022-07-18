import DCL, { Button, Link, Loader } from "../DCL/core.js";

export default class Dashboard extends DCL {
    constructor(props) {
        super(props);
        this.setTitle("Dashboard");

    }

    async onMount() {
        // const hi = this.setState("count", this.state.count + 5);
        // await window.asyncWait(1000);

        // DCL.triggerFunc(hi);
    }

    async render() {

        return `
        <div>
            Dashboard
        </div>
        `;
    }
}