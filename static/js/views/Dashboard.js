import DCL, { Button, Link, ignoreRoute, getContext, triggerFunc, navigateTo } from "../DCL/core.js";
import { get, post, patch, put, del, cancel } from "../utils/makeRequest.js";

export default class Dashboard extends DCL {
    constructor(props) {
        super(props);

        this.loggedIn = getContext("loggedIn");
        if (!this.loggedIn) {
            ignoreRoute();
        }

        this.state = {
            projectrees: [
                // { id: 2, name: "Project 2", modifiedAt: "20/02/2022 04:32 pm" },
                // { id: 1, name: "Project 1", modifiedAt: "20/07/2021 11:23 pm" }
            ],
            loaded: false
        }

    }

    async onMount() {
        if (!this.loggedIn) return;

        try {
            const res = await get("/get-user-projectree");

            if (res.success) {
                triggerFunc(this.setState(() => ({ loaded: true, projectrees: res.data })));
            }
        } catch (e) {
            alert("Failed to get projectrees");
            navigateTo("/");
        }
    }

    async render() {
        const projectrees = this.state.projectrees;

        const publishProjectree = this.createFunc(async (evt) => {
            const projectreeId = evt.target.dataset.id;

            let name = prompt("Enter publish name for projectree");
            if (name)
                name = name.trim();
            else
                return;

            while (!name) {
                name = prompt("Enter valid name for projectree");
                if (name)
                    name = name.trim();
                else
                    return;
            }

            try {
                const res = await post(`/publish-projectree/${projectreeId}`, { name });

                if (res.success) {
                    alert("Projectree successfully published!");
                    navigateTo(`/view/${res.data.name}`);
                } else {
                    if (res.detail)
                        alert(res.detail);
                }
            } catch { }
        });

        const deleteProjectree = this.createFunc(async (evt) => {
            const projectreeId = evt.target.dataset.id;

            try {
                const res = await del(`/delete-projectree/${projectreeId}`);

                if (res.success) {
                    // remove from dashboard view
                    const index = this.state.projectrees.findIndex(projectree => projectree.id === projectreeId);

                    triggerFunc(this.setState("projectrees", (projectreeState) => {
                        projectreeState.splice(index, 1);
                        return projectreeState;
                    }));
                }
            } catch { }
        });

        return `
<div class="${tw`flex h-full flex-grow flex-col`}">
    <div class="${tw`border-b border-zinc-200 bg-zinc-50`}">
        <div class="${tw`container mx-auto flex flex-row items-center justify-between gap-4 py-5 sm:items-end px-4 sm:px-12`}">
            <h1 class="${tw`text-4xl font-semibold`}">Dashboard</h1>
            <div class="${tw`text-right`}">
                ${await new Link("Create", { to: "/create", class: tw`hidden whitespace-nowrap rounded bg-red-400 py-2 px-5 font-bold text-zinc-50 hover:bg-red-800 sm:inline-block` }).mount(this)}
                ${await new Button(`
                <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                `, { class: tw`rounded bg-red-400 p-2 text-zinc-50 hover:bg-red-800 text-sm sm:hidden`, title: "Create" }).mount(this)}
            </div>
        </div>
    </div>
    <div class="${tw`container mx-auto mt-6 flex flex-grow flex-col px-4 sm:px-12`}">
        <div class="${tw`flex h-full flex-grow flex-col gap-8 py-5`}">
        ${this.state.loaded ? (projectrees.length ? (await Promise.all(projectrees.map(async projectree => {
            let modifiedDate = "";
            const modifiedAt = projectree.updated_at || projectree.created_at;
            if (modifiedAt) {
                const date = new Date(modifiedAt)
                modifiedDate = date.toDateString() + ", " + date.toLocaleTimeString();
            }
            return (
                `<div class="${tw`flex items-end justify-between gap-4 sm:grid sm:grid-cols-3`}" data-id="${projectree.id}">
                <p class="${tw`flex w-full truncate text-xl`}">${projectree.projectree_name}</p>
                <!-- 20/07/2021 11:23 pm | dd/MM/YYYY HH:MM TT-->
                <p class="${tw`hidden w-full truncate text-base sm:flex`}">${modifiedDate}</p>
                <div class="${tw`flex items-center justify-end gap-2`}">
                    ${await new Link(`
                    <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>`,
                    { class: tw`rounded bg-red-400 p-2 text-zinc-50 hover:bg-red-800 text-sm`, title: "Edit Projectree", to: `edit/${projectree.id}`, dataSet: { id: projectree.id } }).mount(this)}
                    ${await new Button(`<svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>`,
                        { onClick: publishProjectree, class: tw`rounded bg-red-400 p-2 text-zinc-50 hover:bg-red-800 text-sm`, title: "Publish Projectree", dataSet: { id: projectree.id } }).mount(this)}
                    ${await new Button(`<svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>`,
                            { onClick: deleteProjectree, class: tw`rounded bg-red-400 p-2 text-zinc-50 hover:bg-red-800 text-sm`, title: "Delete Projectree", dataSet: { id: projectree.id } }).mount(this)}
                </div>
            </div>`)
        }))).join("\n") :
                `<p class="mt-6 text-xl text-center sm:text-2xl">You have no projectrees yet.
        ${await new Link("Create", { to: "/create", class: tw`text-red-400 underline hover:text-red-800` }).mount(this)} one now!
    </p>`) : `<p class="mt-6 text-xl text-center sm:text-2xl">Loading dashboard. Please wait...</p>`}
        </div>
    </div>
</div>
        `;
    }
}