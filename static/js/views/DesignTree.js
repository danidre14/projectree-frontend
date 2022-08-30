import DCL, { Button, navigateTo, ignoreRoute, getContext, setContext, triggerFunc, useParams } from "../DCL/core.js";

import { get, post, patch, put, del, cancel } from "../utils/makeRequest.js";

import { isValidUrl } from "../utils/helperUtils.js";

import display from "../utils/displayProjectree.js";

import generateZippedProjectree from "../utils/generateProjectree.js";


const loggedInCreateProjectreeState = "loggedInCreateProjectreeState";
const loggedOutCreateProjectreeState = "loggedOutCreateProjectreeState";
export default class DesignTree extends DCL {
    constructor(props) {
        super(props);

        this.editing = props.editing;

        this.loggedIn = !!getContext("user");

        if (this.editing && !this.loggedIn)
            ignoreRoute();


        this.state = {
            projectSaved: true,
            savingProject: false,
            projectree: {
                id: null,
                title: "",
                favicon: "",
                theme: "standard",
                name: "",
                projectItems: []
            }
        }
        const s = {
            "id": null,
            "name": "My Project 1",
            "title": "Welcome to my ProjecTree",
            "favicon": "/static/images/projectree-logo-primary.png",
            "theme": "standard",
            "projectItems": [
                {
                    "name": "Project 1",
                    "description": "This project is super cool bleh",
                    "languages": "html, css, js, mongodb",
                    "date": "",
                    "image": "/link/to/photo/here",
                    "position": 1,
                    "demoLink": "",
                    "sourceLink": "",
                },
                {
                    "name": "Cool project 2",
                    "description": "foo bar",
                    "languages": "nodejs, python",
                    "date": "",
                    "image": "",
                    "position": 2,
                    "demoLink": "/demo/link/here",
                    "sourceLink": "",
                }
            ],
        }
    }

    async onMount() {
        this.loggedIn = !!getContext("user");

        const projectreeState = {
            id: null,
            name: "Untitled",
            title: "",
            favicon: "",
            theme: "standard",
            projectItems: [],
        }
        if (!this.loggedIn && !this.editing) {
            // then a logged out user is creating a projectree or continuing where they left off
            const data = localStorage.getItem(loggedOutCreateProjectreeState);

            if (data) {
                const localState = JSON.parse(data);
                projectreeState.title = localState.title || "";
                projectreeState.favicon = localState.favicon || "";
                projectreeState.theme = localState.theme || "standard";
                projectreeState.projectItems = (localState.projectItems.length && localState.projectItems[0].name) ? localState.projectItems : [];
            }
        } else if (this.loggedIn) {
            if (!this.editing) {
                // then a logged in user is creating a new projectree, so it will remain blank
                // unless a projectree was saved when they tried to save as anonymous and it prompted them to sign up/register
                const data = localStorage.getItem(loggedInCreateProjectreeState);

                if (data) {
                    const localState = JSON.parse(data);
                    projectreeState.title = localState.title || "";
                    projectreeState.favicon = localState.favicon || "";
                    projectreeState.theme = localState.theme || "standard";
                    projectreeState.projectItems = (localState.projectItems.length && localState.projectItems[0].name) ? localState.projectItems : [];
                }
            } else {
                // then a logged in user is editing an existing projectree
                const { projectreeId } = useParams();

                try {
                    const res = await get(`/projectrees/${projectreeId}`);

                    if (res.success) {
                        const remoteState = res.data.projectree;
                        projectreeState.id = remoteState.id;
                        projectreeState.name = remoteState.name;
                        projectreeState.title = remoteState.title || "";
                        projectreeState.favicon = remoteState.favicon || "";
                        projectreeState.theme = remoteState.theme || "standard";
                        projectreeState.publishtree = remoteState.publishtree;
                        projectreeState.projectItems = remoteState.projectItems;
                    } else {
                        ignoreRoute();
                    }
                } catch (err) {
                    ignoreRoute();
                }
            }
        }

        triggerFunc(this.setState("projectree", (prevState) => {
            const newState = { ...prevState, ...projectreeState };

            return newState;
        }));

        this.onReload = (evt) => {
            if (!this.editing) {
                if (!this.loggedIn)
                    saveLocalProjectreeForAnonymous(this.state.projectree);
                else {
                    if (this.state.projectSaved)
                        clearLocalProjectreeForRegistered();
                    else
                        saveLocalProjectreeForRegistered(this.state.projectree);
                }
                this.state.projectSaved = true;
            }
            if (this.state.projectSaved) return;
            evt.preventDefault();
            evt.returnValue = '';
        }

        DCL.onEvent("beforeNavigate", this.onReload);
    }

    async onUnmount() {
        DCL.offEvent("beforeNavigate", this.onReload);
    }

    async render() {
        const generateTheProjectree = this.createFunc(() => {
            generateZippedProjectree(this.state.projectree);
        })
        const setProjectreeTitle = this.setState("projectree", (projectreeState, evt) => {
            this.state.projectSaved = false;
            projectreeState["title"] = evt.target.value;
            return projectreeState;
        });
        const setProjectreeTheme = this.setState("projectree", (projectreeState, evt) => {
            this.state.projectSaved = false;
            projectreeState["theme"] = evt.target.value;
            return projectreeState;
        });
        const setProjectreeFavicon = this.setState("projectree", (projectreeState, evt) => {
            this.state.projectSaved = false;
            projectreeState["favicon"] = evt.target.value;
            return projectreeState;
        });
        const addProjectItem = this.setState("projectree", (projectreeState) => {
            this.state.projectSaved = false;
            const lastProjectItem = projectreeState["projectItems"][projectreeState["projectItems"].length - 1];
            const position = ((lastProjectItem && lastProjectItem.position) || 0) + 1;

            projectreeState["projectItems"].push({
                name: "",
                description: "",
                languages: "",
                date: "",
                image: "",
                position,
                demoLink: "",
                sourceLink: "",
            });

            return projectreeState;
        });

        const moveItemUp = this.setState("projectree", (projectreeState, evt) => {
            this.state.projectSaved = false;
            // TODO more validation and moveItemDown function
            const index = evt.target.dataset.index;
            const currPos = projectreeState["projectItems"][index].position;
            const prevPos = projectreeState["projectItems"][index - 1].position;
            projectreeState["projectItems"][index].position = prevPos;
            projectreeState["projectItems"][index - 1].position = currPos;
        });

        const removeProjectItem = this.setState("projectree", (projectreeState, evt) => {
            this.state.projectSaved = false;

            projectreeState["projectItems"].splice(evt.target.dataset.index, 1);

            return projectreeState;
        });

        const setProjectItem = this.setState("projectree", (projectreeState, evt) => {

            if (evt.target.name === "date") {
                console.log(evt.target.value)
            }
            this.state.projectSaved = false;

            projectreeState["projectItems"][evt.target.dataset.index][evt.target.name] = evt.target.value;

            return projectreeState;
        });

        const saveProjectree = this.createFunc(async () => {
            if (this.state.savingProject) return;
            if (!this.loggedIn) {
                this.state.savingProject = true;
                const goToSignIn = confirm("You must be signed in to save your projectree.\n\nSign in now? (Your progress will not be lost)") || false;

                if (goToSignIn) {
                    saveLocalProjectreeForAnonymous(this.state.projectree);
                    saveLocalProjectreeForRegistered(this.state.projectree);

                    this.state.projectSaved = true;

                    setContext("signInReferrer", "/create");
                    navigateTo("/signin");
                }
                this.state.savingProject = false;
            } else {
                if (!this.editing) {
                    this.state.savingProject = true;
                    const projectree = this.state.projectree;

                    const isValidTree = validateProjectree(projectree);

                    if (!isValidTree) {
                        this.state.savingProject = false;
                        return;
                    }
                    // logged in user creating a projectree
                    let name = prompt("Saving Projectree:\n\nEnter projectree name", projectree.name);
                    if (name)
                        name = name.trim();
                    else {
                        this.state.savingProject = false;
                        return;
                    }

                    while (!name) {
                        name = prompt("Enter valid name for projectree", projectree.name);
                        if (name)
                            name = name.trim();
                        else {
                            this.state.savingProject = false;
                            return;
                        }
                    }

                    const projectreeName = name;

                    try {
                        // create projectree in backend

                        const res = await post("/projectrees", {
                            ...projectree,
                            name: projectreeName,
                        });

                        if (res.success) {
                            const id = res.data.projectree.id;
                            // navigate to edit page
                            this.state.projectSaved = true;

                            alert("Projectree saved successfully");
                            this.state.savingProject = false;
                            navigateTo(`/edit/${id}`);
                        } else {
                            if (res.message)
                                alert(res.message);

                            this.state.savingProject = false;
                        }
                        this._rerender();
                    } catch (err) {
                        alert("Error saving projectree: " + err);
                        this.state.savingProject = false;
                    }
                } else {
                    this.state.savingProject = true;
                    // logged in user editing a projectree
                    try {
                        // update projectree in backend
                        const projectree = this.state.projectree;

                        const isValidTree = validateProjectree(projectree);

                        if (!isValidTree) {
                            this.state.savingProject = false;
                            return;
                        }

                        const res = await put(`/projectrees/${projectree.id}`, {
                            name: projectree.name,
                            title: projectree.title,
                            favicon: projectree.favicon,
                            theme: projectree.theme,
                            projectItems: projectree.projectItems
                        });

                        if (res.success) {
                            const { projectItems } = res.data.projectree;

                            projectree.projectItems = projectItems;

                            this.state.projectSaved = true;

                            alert("Projectree saved successfully");
                            this.state.savingProject = false;
                        } else {
                            if (res.message)
                                alert(res.message);
                            this.state.savingProject = false;
                        }
                        this._rerender();
                    } catch (err) {
                        alert("Error saving projectree: " + err);
                        this.state.savingProject = false;
                    }
                }
            }
        });

        const unpublishProjectree = this.createFunc(async () => {
            const projectreeId = this.state.projectree.id;
            if (!confirm("Are you sure you want to unpublish this projectree?"))
                return;
            try {
                const res = await del(`/publishtrees/${projectreeId}`);

                if (res.success) {
                    if (res.message)
                        alert(res.message);

                    // swap buttons
                    this.state.projectree.publishtree = null;
                    this._rerender();
                } else {
                    if (res.message)
                        alert(res.message);
                }
            } catch { }
        });

        const publishProjectree = this.createFunc(async () => {
            if (!this.loggedIn) {
                const goToSignIn = confirm("You must be signed in to publish your projectree.\n\nSign in now? (Your progress will not be lost)") || false;

                if (goToSignIn) {
                    saveLocalProjectreeForAnonymous(this.state.projectree);
                    saveLocalProjectreeForRegistered(this.state.projectree);

                    this.state.projectSaved = true;

                    setContext("signInReferrer", "/create");
                    navigateTo("/signin");
                }
            } else {
                if (!this.state.projectSaved || !this.state.projectree.id) {
                    alert("Please save projectree before publishing it.");
                } else {
                    const projectreeId = this.state.projectree.id;

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
                        const res = await post(`/publishtrees/${projectreeId}`, { name });

                        if (res.success) {
                            alert("Projectree successfully published!");
                            navigateTo(`/view/${res.data.publishtree.name}`);
                        } else {
                            if (res.message)
                                alert(res.message);
                        }
                    } catch { }
                }
            }

        });

        let projectItems = "";
        const projectree = this.state.projectree;
        if (projectree.projectItems)
            for (let i = 0; i < projectree.projectItems.length; i++) {
                const projNum = i + 1;
                const projectItem = projectree.projectItems[i];
                projectItems +=
                    `<div class="${tw`my-12`}">
            <div class="${tw`flex items-end justify-between px-4 pb-4`}">
                <span class="${tw`text-3xl font-medium`}">Project ${projNum}</span>
                ${await new Button(`
                <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>`, { onClick: removeProjectItem, dataSet: { index: i }, class: tw`rounded bg-red-400 p-2 text-sm text-zinc-50 hover:bg-red-800`, title: "Delete Projectree" }).mount(this)}
            </div>
            <div class="${tw`overflow-hidden rounded-xl border border-zinc-200 text-xl font-thin`}">
                <div class="${tw`grid grid-cols-12`}">
                    <div class="${tw`col-span-8 border-b border-r border-zinc-200`}">
                        <input id="project_item_${projNum}_name" type="text" name="name" data-index="${i}" placeholder="Name"
                            class="${tw`w-full border-zinc-200 bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" oninput="${setProjectItem}" value="${projectItem.name}" />
                    </div>
                    <div class="${tw`col-span-4 border-b border-zinc-200`}">
                        <input id="project_item_${projNum}_date" type="date" name="date" data-index="${i}" placeholder="Development Date"
                            class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${formatDate(projectItem.date)}" />
                    </div>
                </div>

                <div class="${tw`grid grid-cols-12`}">
                    <div class="${tw`col-span-7 h-64 border-b border-r border-zinc-200`}">
                        <textarea id="project_item_${projNum}_description" name="description" data-index="${i}" placeholder="Description"
                            class="${tw`h-full w-full resize-none bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" oninput="${setProjectItem}">${projectItem.description}</textarea>
                    </div>
                    <div class="${tw`col-span-5 flex h-64 max-h-64 flex-col border-b border-zinc-200 bg-zinc-200`}">
                        <div
                            class="${tw`flex max-h-56 flex-grow items-center justify-center overflow-hidden`}">
                            <img id="project_item_${projNum}_photo_preview" class="${tw`w-full`}"
                                src="${projectItem.image}" alt="" onerror="if (this.src != '/static/images/default_project_photo.png') this.src = '/static/images/default_project_photo.png';" />
                        </div>
                        <input id="project_item_${projNum}_image" type="text" name="image" data-index="${i}" placeholder="Photo Link"
                            class="${tw`w-full border-t bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${projectItem.image}" />
                    </div>
                </div>

                <div class="${tw`border-b border-zinc-200`}">
                    <input id="project_item_${projNum}_languages" type="text" name="languages"
                    data-index="${i}" placeholder="Languages (comma separated)"
                        class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" oninput="${setProjectItem}" value="${projectItem.languages}" />
                </div>

                <div class="${tw`grid grid-cols-2`}">
                    <div class="${tw`border-r border-zinc-200`}">
                        <input id="project_item_${projNum}_sourceLink" type="text" name="sourceLink"
                        data-index="${i}" placeholder="Source Code Link (optional)"
                            class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" oninput="${setProjectItem}" value="${projectItem.sourceLink}" />
                    </div>
                    <div>
                        <input id="project_item_${projNum}_demoLink" type="text" name="demoLink" data-index="${i}" placeholder="Demo Link (optional)"
                            class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" oninput="${setProjectItem}" value="${projectItem.demoLink}" />
                    </div>
                </div>
            </div>
        </div>`

            }

        return (
            `
        <div class="${tw`flex h-full flex-grow flex-col`}">
        <div class="${tw`sticky top-[4.5rem] border-b border-zinc-200 bg-zinc-50`}">
            <div class="${tw`container mx-auto flex flex-row flex-wrap items-center justify-between gap-5 py-5 px-4 sm:px-12`}">
                <h1 class="${tw`text-4xl font-semibold`}">${this.editing ? "Edit" : "Create"}</h1>
                <div class="${tw`${this.loggedIn ? "" : "hidden"} max-w-sm flex-grow lg:max-w-xs`}">
                    <input type="text" id="name" name="name" disabled
                        class="${tw`w-full rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
                        value="${projectree.name}" />
                </div>
            </div>
        </div>
        <section class="${tw`container mx-auto flex-grow px-4 sm:px-12`}">
            <div class="${tw`py-5`}">
                <!-- Projectree Meta Data -->
                <div class="${tw`grid justify-between gap-4 sm:grid-cols-3`}">
                    <div class="${tw`flex flex-col gap-1`}">
                        <label for="title" class="${tw`text-xl font-medium italic text-neutral-600`}">Projectree
                            Title</label>
                        <input type="text" id="title" name="title"
                            class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
                            onchange="${setProjectreeTitle}" value="${projectree.title}"/>
                    </div>
                    <div class="${tw`flex flex-col gap-1`}">
                        <label for="theme" class="${tw`text-xl font-medium italic text-neutral-600`}">Theme</label>
                        <select onchange="${setProjectreeTheme}" id="theme" name="theme"
                            class="${tw`rounded-lg border border-zinc-200 py-1 px-3 text-xl`}">
                            <option disabled>Choose a theme</option>
                            ${Object.entries(display.themes).map(([key, value]) =>
                `<option ${key === projectree.theme ? "selected" : ""} value="${key}">${value}</option>`
            ).join("\n")}
                        </select>
                    </div>
                    <div class="${tw`flex flex-col gap-1`}">
                        <label for="favicon" class="${tw`text-xl font-medium italic text-neutral-600`}">Favicon</label>
                        <div class="${tw`flex overflow-hidden rounded-lg border border-zinc-200`}">
                            <div
                                class="${tw`flex w-12 items-center justify-center border-r border-zinc-200 bg-zinc-200`}">
                                <img id="projectree_favicon_preview" class="${tw`h-7 w-7`}"
                                    src="/static/images/projectree-logo-primary.png" alt="logo" />
                            </div>
                            <input type="text" id="favicon" name="favicon"
                                class="${tw`w-full bg-white py-1 px-1 text-xl outline-none focus:bg-gray-50`}"
                                onchange="${setProjectreeFavicon}" value="${projectree.favicon}"/>
                        </div>
                    </div>
                </div>

                <!-- Projectree Item -->
                ${projectItems}
            </div>
        </section>
        <div class="${tw`sticky bottom-0 border-t border-zinc-200`}">
            <div class="${tw`container mx-auto bg-zinc-50 px-4 sm:px-12`}">
                <div class="${tw`flex flex-row flex-wrap items-end justify-between gap-4 py-5`}">
                    <div class="${tw`flex justify-center gap-2 whitespace-nowrap`}">
                        ${await new Button("Add Project", { onClick: addProjectItem, class: tw`hidden whitespace-nowrap rounded border border-red-400 bg-zinc-50 py-2 px-5 font-bold text-red-400 hover:bg-red-400 hover:text-zinc-50 sm:inline-block`, title: "Add Project" }).mount(this)}
                        ${await new Button(`<svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                            </svg>`,
                { onClick: addProjectItem, class: tw`rounded border border-red-400 p-2 text-sm text-red-400 hover:bg-red-400 hover:text-zinc-50 sm:hidden`, title: "Add Project" }).mount(this)}
                        ${await new Button("Generate", { onClick: generateTheProjectree, class: tw`hidden whitespace-nowrap rounded border border-red-400 bg-zinc-50 py-2 px-5 font-bold text-red-400 hover:bg-red-400 hover:text-zinc-50 sm:inline-block`, title: "Generate Projectree" }).mount(this)}
                        ${await new Button(`<svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>`,
                    { onClick: generateTheProjectree, class: tw`rounded border border-red-400 p-2 text-sm text-red-400 hover:bg-red-400 hover:text-zinc-50 sm:hidden`, title: "Add Projecte Projectree" }).mount(this)}
                    </div>
                    <div class="${tw`ml-auto flex justify-center gap-2 whitespace-nowrap`}">
                        ${await new Button("Save", { onClick: saveProjectree, class: tw`hidden whitespace-nowrap rounded bg-red-400 py-2 px-5 font-bold text-zinc-50 hover:bg-red-800 sm:inline-block`, title: "Save Projectree" }).mount(this)}
                        ${await new Button(`<svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>`,
                        { onClick: saveProjectree, class: tw`rounded bg-red-400 p-2 text-sm text-zinc-50 hover:bg-red-800 sm:hidden`, title: "Save Projectree" }).mount(this)}
                        ${!projectree.publishtree ? `
                        ${await new Button("Publish", { onClick: publishProjectree, class: tw`hidden whitespace-nowrap rounded bg-red-400 py-2 px-5 font-bold text-zinc-50 hover:bg-red-800 sm:inline-block`, title: "Publish Projectree" }).mount(this)}
                        ${await new Button(`<svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>`,
                            { onClick: publishProjectree, class: tw`rounded bg-red-400 p-2 text-sm text-zinc-50 hover:bg-red-800 sm:hidden`, title: "Publish Projectree" }).mount(this)}
                        ` : `
                        ${await new Button("Unpublish", { onClick: unpublishProjectree, class: tw`hidden whitespace-nowrap rounded bg-red-400 py-2 px-5 font-bold text-zinc-50 hover:bg-red-800 sm:inline-block`, title: "Unpublish Projectree" }).mount(this)}
                        ${await new Button(`<svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>`,
                                { onClick: unpublishProjectree, class: tw`rounded bg-red-400 p-2 text-sm text-zinc-50 hover:bg-red-800 sm:hidden`, title: "Unpublish Projectree" }).mount(this)}
                        `}
                    </div>
                </div>
            </div>
        </div>
    </div>
        `
        );
    }
}

const saveLocalProjectreeForAnonymous = function (projectree) {
    // const state = this.state;
    const localState = {
        title: projectree.title,
        favicon: projectree.favicon,
        theme: projectree.theme,
        projectItems: projectree.projectItems
    }
    const data = JSON.stringify(localState);
    localStorage.setItem(loggedOutCreateProjectreeState, data);
}

const saveLocalProjectreeForRegistered = function (projectree) {
    // const state = this.state;
    const localState = {
        title: projectree.title,
        favicon: projectree.favicon,
        theme: projectree.theme,
        projectItems: projectree.projectItems
    }
    const data = JSON.stringify(localState);
    localStorage.setItem(loggedInCreateProjectreeState, data);
}

const clearLocalProjectreeForRegistered = function () {
    localStorage.removeItem(loggedInCreateProjectreeState);
}

const validateProjectree = function (projectree) {
    const messages = [];

    // check favicon url
    if (!isValidUrl(projectree.favicon)) {
        messages.push("Please enter a valid URL for the favicon.");
    }

    // check valid project items
    for (let i = 0; i < projectree.projectItems.length; i++) {
        const index = i + 1;
        const projectItem = projectree.projectItems[i];

        if (!isValidUrl(projectItem.demoLink)) {
            messages.push(`Please enter a valid URL for project ${index}'s demo link`);
        }
        if (!isValidUrl(projectItem.sourceLink)) {
            messages.push(`Please enter a valid URL for project ${index}'s source code link`);
        }
    }

    if (messages.length) {
        alert(messages.join("\n"));
    }

    return messages.length === 0;
}

const formatDate = function (date) {
    if (!date) return date;

    return new Date(date).toISOString().substring(0, 10);
}