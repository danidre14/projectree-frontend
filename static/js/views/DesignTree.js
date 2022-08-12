import DCL, { Button, navigateTo, ignoreRoute, getContext, setContext, triggerFunc, useParams } from "../DCL/core.js";

import { get, post, patch, put, del, cancel } from "../utils/makeRequest.js";

import { isValidUrl } from "../utils/helperUtils.js";

import display from "../utils/displayProjectree.js";

import generateZippedProjectree from "../utils/generateProjectree.js";


const loggedInCreateProjectreeState = "loggedInCreateProjectreeState";
const loggedOutCreateProjectreeState = "loggedOutCreateProjectreeState";
export default class Create extends DCL {
    constructor(props) {
        super(props);

        this.editing = props.editing;

        this.loggedIn = getContext("loggedIn");

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
                projectree_name: "",
                project_items: []
            },
            editMeta: {
                deletedIds: [],
                editedIds: [],
            }
        }
        const s = {
            "id": null,
            "projectree_name": "My Project 1",
            "title": "Welcome to my ProjecTree",
            "favicon": "/static/images/projectree-logo-primary.png",
            "theme": "standard",
            "project_items": [
                {
                    "name": "Project 1",
                    "description": "This project is super cool bleh",
                    "programming_language": "html, css, js, mongodb",
                    "image": "/link/to/photo/here",
                    "demo_link": "",
                    "source_code": "",
                },
                {
                    "name": "Cool project 2",
                    "description": "foo bar",
                    "programming_language": "nodejs, python",
                    "image": "",
                    "demo_link": "/demo/link/here",
                    "source_code": "",
                }
            ],
        }
    }

    async onMount() {
        this.loggedIn = getContext("loggedIn");

        const projectreeState = {
            id: null,
            projectree_name: "Untitled",
            title: "",
            favicon: "",
            theme: "standard",
            project_items: [],
        }
        if (!this.loggedIn && !this.editing) {
            // then a logged out user is creating a projectree or continuing where they left off
            const data = localStorage.getItem(loggedOutCreateProjectreeState);

            if (data) {
                const localState = JSON.parse(data);
                projectreeState.title = localState.title || "";
                projectreeState.favicon = localState.favicon || "";
                projectreeState.theme = localState.theme || "standard";
                projectreeState.project_items = (localState.project_items.length && localState.project_items[0].name) ? localState.project_items : [];
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
                    projectreeState.project_items = (localState.project_items.length && localState.project_items[0].name) ? localState.project_items : [];
                }
            } else {
                // then a logged in user is editing an existing projectree
                const { projectreeId } = useParams();

                try {
                    const res = await get(`/projectree/${projectreeId}`);

                    if (res.success) {
                        const remoteState = res.data[0];
                        projectreeState.id = remoteState.id;
                        projectreeState.projectree_name = remoteState.projectree_name;
                        projectreeState.title = remoteState.title;
                        projectreeState.favicon = remoteState.favicon;
                        projectreeState.theme = remoteState.theme;
                        projectreeState.project_items = remoteState.project_items;
                    } else {
                        ignoreRoute();
                    }
                } catch (e) {
                    ignoreRoute();
                }
            }
        }

        triggerFunc(this.setState("projectree", (prevState) => {
            const newState = { ...prevState, ...projectreeState };


            return newState;
        }));

        if (this.loggedIn) {
            this.onReload = (e) => {
                if (this.state.projectSaved) return;
                e.preventDefault();
                e.returnValue = '';
            }

            DCL.onEvent("beforeNavigate", this.onReload);
        }
    }

    async onUnmount() {

        if (!this.loggedIn && !this.editing) {
            this.state.projectSaved = true;
            saveLocalProjectreeForAnonymous(this.state.projectree);
        }

        if (this.loggedIn) {
            DCL.offEvent("beforeNavigate", this.onReload);
        }
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

            projectreeState["project_items"].push({
                name: "",
                description: "",
                programming_language: "",
                image: "",
                demo_link: "",
                source_code: "",
            });

            return projectreeState;
        });

        const removeProjectItem = this.setState("projectree", (projectreeState, evt) => {
            this.state.projectSaved = false;

            if (this.loggedIn && this.editing) {
                const projectItem = projectreeState["project_items"][evt.target.dataset.index];

                if (projectItem && projectItem.id) {
                    this.state.editMeta.deletedIds.push(projectItem.id);
                }
            }

            projectreeState["project_items"].splice(evt.target.dataset.index, 1);

            return projectreeState;
        });

        const setProjectItem = this.setState("projectree", (projectreeState, evt) => {
            this.state.projectSaved = false;


            if (this.loggedIn && this.editing) {
                const projectItem = projectreeState["project_items"][evt.target.dataset.index];

                if (projectItem && projectItem.id) {
                    this.state.editMeta.editedIds.push(projectItem.id);
                }
            }

            projectreeState["project_items"][evt.target.dataset.index][evt.target.name] = evt.target.value;

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
                const userId = getContext("userId");
                if (!this.editing) {
                    this.state.savingProject = true;
                    // logged in user creating a projectree
                    let name = prompt("Saving Projectree:\n\nEnter projectree name", this.state.projectree.projectree_name);
                    if (name)
                        name = name.trim();
                    else {
                        this.state.savingProject = false;
                        return;
                    }


                    while (!name) {
                        name = prompt("Enter valid name for projectree", this.state.projectree.projectree_name);
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
                        const projectree = this.state.projectree;

                        const isValidTree = validateProjectree(projectree);

                        if(!isValidTree) {
                            this.state.savingProject = false;
                            return;
                        }

                        const res = await post("/projectree", {
                            projectree_name: projectreeName,
                            title: projectree.title,
                            favicon: projectree.favicon,
                            theme: projectree.theme
                        });

                        if (res.success) {
                            const projectreeId = res.data.id;
                            const projectItemIds = [];
                            // create project items
                            for (const projectItem of projectree.project_items) {
                                try {
                                    const res = await post("/project", {
                                        name: projectItem.name,
                                        description: projectItem.description,
                                        programming_language: projectItem.programming_language,
                                        image: projectItem.image,
                                        demo_link: projectItem.demo_link,
                                        source_code: projectItem.source_code
                                    });

                                    if (res.success) {
                                        const projectItemId = res.data.id;
                                        projectItemIds.push(projectItemId);
                                    } else {
                                        // if (res.detail)
                                        //     alert(res.detail);
                                    }
                                } catch { }
                            }

                            // link project items to projectree
                            try {
                                await put(`/update-projectree/${projectreeId}/`, {
                                    project_items: [...new Set(projectItemIds)]
                                });
                            } catch { }

                            // navigate to edit page
                            this.state.projectSaved = true;

                            alert("Projectree saved successfully");
                            this.state.savingProject = false;
                            navigateTo(`/edit/${projectreeId}`);
                        } else {
                            if (res.detail)
                                alert(res.detail);
                            this.state.savingProject = false;
                        }
                    } catch (e) {
                        alert("Error saving projectree: " + e);
                        this.state.savingProject = false;
                    }

                    /*
                        sendRequest to save creation
                        on success: navigateTo("/dashboard")
                        on fail: alert fail message
                    */
                } else {
                    this.state.savingProject = true;
                    // logged in user editing a projectree
                    try {
                        // update projectree in backend
                        const projectree = this.state.projectree;

                        const isValidTree = validateProjectree(projectree);

                        if(!isValidTree) {
                            this.state.savingProject = false;
                            return;
                        }

                        const res = await put(`/update-projectree/${projectree.id}/`, {
                            projectree_name: projectree.projectree_name,
                            title: projectree.title,
                            favicon: projectree.favicon,
                            theme: projectree.theme,
                            project_items: []
                        });

                        if (res.success) {
                            const projectreeId = res.data.id;
                            const projectItemIds = [];

                            // remove deleted project items
                            const deletedIds = [...new Set(this.state.editMeta.deletedIds)];
                            for (const projectItemId of deletedIds) {
                                try {
                                    await del(`/delete-project/${projectItemId}`);
                                } catch { }
                            }

                            // update edited project items
                            const editedIds = [...new Set(this.state.editMeta.editedIds)];
                            for (const projectItemId of editedIds) {
                                try {
                                    const projectItem = projectree.project_items.find(item => item.id === projectItemId);
                                    await put(`/update-project/${projectItemId}/`, {
                                        name: projectItem.name,
                                        description: projectItem.description,
                                        programming_language: projectItem.programming_language,
                                        image: projectItem.image,
                                        demo_link: projectItem.demo_link,
                                        source_code: projectItem.source_code
                                    });
                                } catch { }
                            }

                            // add new created project items
                            const addedItems = projectree.project_items.filter(item => (item.id === null || item.id === undefined));
                            for (const projectItem of addedItems) {
                                try {
                                    const res = await post("/project", {
                                        name: projectItem.name,
                                        description: projectItem.description,
                                        programming_language: projectItem.programming_language,
                                        image: projectItem.image,
                                        demo_link: projectItem.demo_link,
                                        source_code: projectItem.source_code
                                    });

                                    if (res.success) {
                                        const projectItemId = res.data.id;
                                        projectItemIds.push(projectItemId);
                                        projectItem.id = projectItemId;
                                    } else {
                                        // if (res.detail)
                                        //     alert(res.detail);
                                    }
                                } catch { }
                            }

                            // link new project items to projectree
                            try {
                                await put(`/update-projectree/${projectreeId}/`, {
                                    project_items: [...new Set(projectItemIds)]
                                });
                            } catch { }

                            // clear edit meta to allow for more edits
                            this.state.projectSaved = true;

                            alert("Projectree saved successfully");
                            this.state.editMeta.deletedIds.length = 0;
                            this.state.editMeta.editedIds.length = 0;
                            this.state.savingProject = false;
                        } else {
                            if (res.detail)
                                alert(res.detail);
                            this.state.savingProject = false;
                        }
                    } catch (e) {
                        alert("Error saving projectree: " + e);
                        this.state.savingProject = false;
                    }
                    /*
                        sendRequest to save edit
                        on success: navigateTo("/dashboard")
                        on fail: alert fail message
                    */
                }
            }
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
                        const res = await post(`/publish-projectree/${projectreeId}`, { name });

                        if (res.success) {
                            alert("Projectree successfully published!");
                            navigateTo(`/view/${res.data.name}`);
                        } else {
                            if (res.detail)
                                alert(res.detail);
                        }
                    } catch { }
                }
            }

        });

        let projectItems = "";
        const projectree = this.state.projectree;
        if (projectree.project_items)
            for (let i = 0; i < projectree.project_items.length; i++) {
                const projNum = i + 1;
                const projectItem = projectree.project_items[i];
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
                    <div class="${tw`col-span-7 flex h-64 flex-col border-b border-r border-zinc-200`}">
                        <input id="project_item_${projNum}_name" type="text" name="name" data-index="${i}" placeholder="Name"
                            class="${tw`w-full border-b border-zinc-200 bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${projectItem.name}" />
                        <textarea id="project_item_${projNum}_description" name="description" data-index="${i}" placeholder="Description"
                            class="${tw`h-full w-full resize-none bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}">${projectItem.description}</textarea>
                    </div>
                    <div class="${tw`col-span-5 flex h-64 max-h-64 flex-col border-b border-zinc-200 bg-zinc-200`}">
                        <div
                            class="${tw`flex max-h-56 flex-grow items-center justify-center overflow-hidden`}">
                            <img id="project_item_${projNum}_photo_preview" class="${tw`w-full`}"
                                src="${projectItem.image}" alt="" onerror="if (this.src != '/static/images/default_project_photo.png') this.src = '/static/images/default_project_photo.png';" />
                        </div>
                        <input id="project_item_${projNum}_photo" type="text" name="image" data-index="${i}" placeholder="Photo Link"
                            class="${tw`w-full border-t bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${projectItem.image}" />
                    </div>
                </div>

                <div class="${tw`border-b border-zinc-200`}">
                    <input id="project_item_${projNum}_languages" type="text" name="programming_language"
                    data-index="${i}" placeholder="Languages (comma separated)"
                        class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${projectItem.programming_language}" />
                </div>

                <div class="${tw`grid grid-cols-2`}">
                    <div class="${tw`border-r border-zinc-200`}">
                        <input id="project_item_${projNum}_source" type="text" name="source_code"
                        data-index="${i}" placeholder="Source Code Link (optional)"
                            class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${projectItem.source_code}" />
                    </div>
                    <div>
                        <input id="project_item_${projNum}_link" type="text" name="demo_link" data-index="${i}" placeholder="Demo Link (optional)"
                            class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${projectItem.demo_link}" />
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
                    <input type="text" id="projectree_name" name="projectree_name" disabled
                        class="${tw`w-full rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
                        value="${projectree.projectree_name}" />
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
                        ${await new Button("Publish", { onClick: publishProjectree, class: tw`hidden whitespace-nowrap rounded bg-red-400 py-2 px-5 font-bold text-zinc-50 hover:bg-red-800 sm:inline-block`, title: "Publish Projectree" }).mount(this)}
                        ${await new Button(`<svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>`,
                            { onClick: publishProjectree, class: tw`rounded bg-red-400 p-2 text-sm text-zinc-50 hover:bg-red-800 sm:hidden`, title: "Publish Projectree" }).mount(this)}
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
        project_items: projectree.project_items
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
        project_items: projectree.project_items
    }
    const data = JSON.stringify(localState);
    localStorage.setItem(loggedInCreateProjectreeState, data);
}

const validateProjectree = function(projectree) {
    const messages = [];

    // check favicon url
    if(!isValidUrl(projectree.favicon)) {
        messages.push("Please enter a valid URL for the favicon.");
    }

    // check valid project items
    for(let i = 0; i < projectree.project_items.length; i++) {
        const index = i + 1;
        const projectItem = projectree.project_items[i];

        if(!isValidUrl(projectItem.demo_link)) {
            messages.push(`Please enter a valid URL for project ${index}'s demo link`);
        }
        if(!isValidUrl(projectItem.source_code)) {
            messages.push(`Please enter a valid URL for project ${index}'s source code link`);
        }
    }

    if(messages.length) {
        alert(messages.join("\n"));
    }

    return messages.length === 0;
}