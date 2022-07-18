import DCL, { Link } from "../DCL/core.js";

export default class Homepage extends DCL {
    async render() {
        return `
<div class="${tw`h-full flex-grow`}">
    <div class="${tw`bg-neutral-300 px-12`}">
        <div class="${tw`container mx-auto flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-end`}">
            <h1 class="${tw`text-3xl sm:text-4xl`}">Welcome to ProjecTree!</h1>
            <div class="${tw`text-right`}">
                ${await new Link("New Projectree", { to: "/create", class: tw`inline-block whitespace-nowrap rounded bg-blue-500 py-2 px-5 font-semibold text-slate-50 shadow-lg hover:bg-blue-600` }).mount(this)}
            </div>
        </div>
    </div>
    <div class="${tw`flex-grow px-12`}">
        <div class="${tw`container mx-auto flex h-full flex-col justify-between py-5`}">
            <p class="${tw`text-lg`}">Create and showcase your projects lists without the hassle of building it yourself. Just add your project details, choose a theme, and generate!</p>
            <div class="${tw`text-center mt-4`}">
                ${await new Link("New Projectree", { to: "/create", class: tw`inline-block whitespace-nowrap rounded bg-blue-500 py-2 px-5 font-semibold text-slate-50 shadow-lg hover:bg-blue-600` }).mount(this)}
            </div>
        </div>
    </div>
    </div>
        `;
    }
}