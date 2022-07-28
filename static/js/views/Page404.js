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
    <div class="${tw`border-b border-zinc-200 bg-zinc-50`}">
        <div class="${tw`container mx-auto py-5 px-4 sm:px-12`}">
            <h1 class="${tw`text-4xl font-semibold`}">404 - Page Not Found</h1>
        </div>
    </div>
    <div class="${tw`container mx-auto flex-grow px-4 sm:px-12`}">
        <div class="${tw`flex h-full flex-col gap-12 py-12`}">
            <div>
                <p class="${tw`text-lg sm:text-xl`}">The page requested at "${this.path}" could not be found.</p>
                <p class="${tw`mt-4 text-sm italic sm:text-base`}">Broken link? 
                    ${await new Link("Report it here", {
                    to: "https://github.com/danidre14/projectree-frontend/issues",
                    class: tw`font-semibold text-red-400 underline hover:text-red-800`
                }).mount(this)}
                </p>
            </div>
            <p class="${tw`mt-8 text-base sm:text-lg`}">
                ${await new Button("Back", { onClick: goBack, class: tw`font-semibold italic text-red-400 underline hover:text-red-800` }).mount(this)} |
                ${await new Link("Homepage", { to: "/", class: tw`font-semibold italic text-red-400 underline hover:text-red-800` }).mount(this)}
            </p>
        </div>
    </div>
</div>`
    }
}