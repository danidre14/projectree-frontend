import DCL, { Link, Button } from "../DCL/core.js";

export default class Page404 extends DCL {
    constructor(props = {}) {
        super(props);

        this.path = location.pathname;
    }
    async render() {
        const goBack = this.createFunc(() => {
            history.back();
        })
        return `
<div class="${tw`flex h-full flex-grow flex-col`}">
<div class="${tw`bg-neutral-300 px-12`}">
    <div class="${tw`container mx-auto flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-end`}">
        <h1 class="${tw`text-3xl sm:text-4xl`}">404 - Page Not Found</h1>
    </div>
</div>
<div class="${tw`flex-grow px-12`}">
    <div class="${tw`container mx-auto h-full py-5`}">
        <p class="${tw`text-lg`}">The page requested at "${this.path}" could not be found.</p>
        <p class="${tw`mt-4 text-sm italic`}">Broken link? 
            ${await new Link("Report it here", {
            to: "https://github.com/danidre14/projectree-frontend/issues",
            class: tw`rounded p-1 underline hover:bg-neutral-200`
        }).mount(this)}
        </p>
        <p class="${tw`mt-8 text-base italic`}">
            ${await new Button("Back", { onClick: goBack, class: tw`rounded p-1 underline hover:bg-neutral-200` }).mount(this)} |
            ${await new Link("Homepage", { to: "/", class: tw`rounded p-1 underline hover:bg-neutral-200` }).mount(this)}
        </p>
    </div>
</div>
</div>`
    }
}