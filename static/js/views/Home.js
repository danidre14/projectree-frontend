import DCL, { Link } from "../DCL/core.js";
import { get } from "../utils/makeRequest.js";

export default class Homepage extends DCL {
    async onMount() {

    }
    async render() {
        return `
<div class="${tw`flex h-full flex-grow flex-col`}">
    <div class="${tw`container mx-auto flex flex-grow flex-col px-4 sm:px-12`}">
        <div
            class="${tw`flex-w flex flex-col-reverse items-center justify-center gap-0 space-y-6 pb-8 sm:justify-between sm:gap-8 md:flex-row md:space-y-0 md:pb-0`}">
            <div
                class="${tw`flex max-w-lg flex-col items-center space-y-8 text-center md:max-w-3xl md:items-start lg:py-16 lg:text-left`}">
                <p
                    class="${tw`mt-4 text-[40px] font-extrabold tracking-tight text-gray-600 sm:mt-5 sm:text-6xl lg:mt-2 xl:text-6xl`}">
                    <span class="${tw`block leading-tight`}">Create your</span>
                    <span
                        class="${tw`bg-gradient-to-b from-red-800 to-red-400 bg-clip-text py-2 leading-tight text-transparent`}">Project
                        Showcase</span>
                    <span class="${tw`block leading-tight`}">in 5 minutes!</span>
                </p>
                <div class="${tw`px-4 sm:px-12 md:mt-3 md:px-2`}">
                    <p
                        class="${tw`text-base font-normal text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl`}">
                        Create and showcase your projects lists without the hassle of building it yourself.
                        Just add your project details, choose a theme, and generate!
                    </p>
                    ${await new Link("Create", { to: "/create", class: tw`inline-block mt-8 mb-8 whitespace-nowrap rounded bg-red-400 py-2 px-5 font-bold text-zinc-50 hover:bg-red-800` }).mount(this)}
                </div>
            </div>
            <div class="${tw`min-w-min sm:min-w-max pt-12 pb-12 md:pt-0 md:pb-0`}">
                <div
                    class="${tw`relative flex items-center justify-center`}">
                    <img src="/static/images/projectree-hero-image.png" alt="Projectree Hero Image" />
                </div>
            </div>
        </div>
    </div>
</div>
        `;
    }
}