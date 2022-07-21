import DCL, { Button, Link, ignoreRoute, getContext } from "../DCL/core.js";

export default class Dashboard extends DCL {
    constructor(props) {
        super(props);
        this.setTitle("Dashboard");

        this.loggedIn = getContext("loggedIn");
        if (!this.loggedIn) {
            ignoreRoute();
        }

        this.state = {
            projectrees: [
                { id: 2, name: "Project 2", modifiedAt: "20/02/2022 04:32 pm" },
                { id: 1, name: "Project 1", modifiedAt: "20/07/2021 11:23 pm" }
            ]
        }

    }

    async onMount() {
        // const hi = this.setState("count", this.state.count + 5);
        // await window.asyncWait(1000);

        // DCL.triggerFunc(hi);
    }

    async render() {
        const projectrees = this.state.projectrees;

        const publishProjectree = this.createFunc((evt) => {
            const id = evt.target.dataset.id;


        });

        const deleteProjectree = this.createFunc((evt) => {
            const id = evt.target.dataset.id;


        });

        return `
<div class="${tw`flex h-full flex-grow flex-col`}">
    <div class="${tw`bg-neutral-300 px-12`}">
        <div class="${tw`container mx-auto flex flex-row items-center justify-between gap-4 py-5 sm:items-end`}">
            <h1 class="${tw`text-3xl sm:text-4xl`}">Dashboard</h1>
            <div class="${tw`text-right`}">
                ${await new Link("New Projectree", { to: "/create", class: tw`hidden whitespace-nowrap rounded bg-blue-500 py-2 px-5 font-semibold text-slate-50 shadow-lg hover:bg-blue-600 sm:block` }).mount(this)}
                ${await new Button(`
                <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                `, { class: tw`rounded bg-blue-500 stroke-2 p-2 text-sm text-slate-50 sm:hidden`, title: "New Projectree" }).mount(this)}
            </div>
        </div>
    </div>
    <div class="${tw`mt-6 flex flex-grow flex-col px-12`}">
        <div class="${tw`container mx-auto flex h-full flex-grow flex-col py-5 gap-4`}">
        ${(await Promise.all(projectrees.map(async projectree => (
            `<div class="${tw`flex items-end justify-between gap-4 sm:grid sm:grid-cols-3`}" data-id="${projectree.id}">
                <p class="${tw`flex w-full truncate text-2xl`}">${projectree.name}</p>
                <!-- 20/07/2021 11:23 pm | dd/MM/YYYY HH:MM TT-->
                <p class="${tw`hidden w-full truncate text-lg sm:flex`}">${projectree.modifiedAt}</p>
                <div class="${tw`flex items-center justify-end gap-2`}">
                    ${await new Link(`
                    <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>`,
                { class: tw`rounded bg-blue-500 stroke-2 p-2 text-sm text-slate-50`, title: "Edit", to: `edit/${projectree.id}`, dataSet: { id: projectree.id } }).mount(this)}
                    ${await new Button(`<svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>`,
                    { onClick: publishProjectree, class: tw`rounded bg-blue-500 stroke-2 p-2 text-sm text-slate-50`, title: "Publish", dataSet: { id: projectree.id } }).mount(this)}
                    ${await new Button(`<svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>`,
                        { onClick: deleteProjectree, class: tw`rounded bg-blue-500 stroke-2 p-2 text-sm text-slate-50`, title: "Delete", dataSet: { id: projectree.id } }).mount(this)}
                </div>
            </div>`)))).join("\n")}
        </div>
    </div>
</div>
        `;
    }
}