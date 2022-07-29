import DCL, { Button, navigateTo, ignoreRoute, getContext, setContext, triggerFunc, useParams } from "../DCL/core.js";

import { get, post, patch, put, del, cancel } from "../utils/makeRequest.js";

import generateZippedProjectree from "../utils/generateProjectree.js";

export default class Create extends DCL {
    constructor(props) {
        super(props);

        this.editing = props.editing;

        this.loggedIn = getContext("loggedIn");

        if (this.editing && !this.loggedIn)
            ignoreRoute();


        this.state = {
            projectSaved: true
        }
        const s = {
            "project_id": null,
            "project_name": "My Project 1",
            "project_title": "Welcome to my ProjecTree",
            "project_favicon": "/static/images/projectree-logo-primary.png",
            "project_theme": "standard",
            "project_items": [
                {
                    "project_name": "Project 1",
                    "project_description": "This project is super cool bleh",
                    "project_languages": "html, css, js, mongodb",
                    "project_photo": "/link/to/photo/here",
                    "project_link": "",
                    "project_source": "",
                    "project_year": ""
                },
                {
                    "project_name": "Cool project 2",
                    "project_description": "foo bar",
                    "project_languages": "nodejs, python",
                    "project_photo": "",
                    "project_link": "/demo/link/here",
                    "project_source": "",
                    "project_year": ""
                }
            ],
        }
    }

    async onMount() {
        this.loggedIn = getContext("loggedIn");

        const state = {
            project_name: "Untitled",
            project_title: "",
            project_favicon: "",
            project_theme: "standard",
            project_items: [],
        }
        if (!this.loggedIn && !this.editing) {
            // then a logged out user is creating a projectree or continuing where they left off
            const data = localStorage.getItem("loggedOutCreateProjectreeState");

            if (data) {
                const localState = JSON.parse(data);
                state.project_title = localState.project_title;
                state.project_favicon = localState.project_favicon;
                state.project_theme = localState.project_theme;
                state.project_items = localState.project_items;
            }
        } else if (this.loggedIn) {
            if (!this.editing) {
                // then a logged in user is creating a new projectree, so it will remain blank
                // unless a projectree was saved when they tried to save as anonymous and it prompted them to sign up/register
                const data = localStorage.getItem("loggedInCreateProjectreeState");

                if (data) {
                    const localState = JSON.parse(data);
                    state.project_title = localState.project_title;
                    state.project_favicon = localState.project_favicon;
                    state.project_theme = localState.project_theme;
                    state.project_items = localState.project_items;
                }
            } else {
                // then a logged in user is editing an existing projectree
                const { projectreeId } = useParams();

                try {
                    const res = await get(`/projectree/edit/${projectreeId}`);

                    if (res.success) {
                        const remoteState = res.projectree;
                        state.project_id = remoteState.project_id;
                        state.project_title = remoteState.project_title;
                        state.project_favicon = remoteState.project_favicon;
                        state.project_theme = remoteState.project_theme;
                        state.project_items = remoteState.project_items;
                    } else {
                        alert("Could not get projectree");
                        navigateTo("/dashboard");
                    }
                } catch (e) {
                    alert("Could not get projectree");
                    navigateTo("/dashboard");
                }
                // await sendRequest to get projectree from server
            }
        }

        triggerFunc(this.setState((prevState) => {
            const newState = { ...prevState, ...state };
            return newState
        }));

        this.onReload = (e) => {
            if (this.state.projectSaved) return;
            e.preventDefault();
            e.returnValue = '';
        }

        DCL.onEvent("beforeNavigate", this.onReload);
    }

    async onUnmount() {

        if (!this.loggedIn && !this.editing) {
            this.state.projectSaved = true;
            saveLocalProjectreeForAnonymous(this.state);
        } else if (this.loggedIn) {
            if (!this.editing) {
                // then a logged in user is creating a new projectree, so it will remain blank
            } else {
                // then a logged in user is editing an existing projectree
                const { projectreeId } = useParams();
                // sendRequest to get projectree from server
            }
        }

        DCL.offEvent("beforeNavigate", this.onReload);
    }

    async render() {
        const generateTheProjectree = this.createFunc(() => {
            generateZippedProjectree(this.state);
        })
        const setProjectTitle = this.setState("project_title", (state, evt) => {
            this.state.projectSaved = false;
            return evt.target.value;
        });
        const setProjectFavicon = this.setState("project_favicon", (state, evt) => {
            this.state.projectSaved = false;
            return evt.target.value;
        });
        const addProjectItem = this.setState("project_items", (state) => {
            this.state.projectSaved = false;
            return [...state, {
                project_name: "name",
                project_description: "description",
                project_languages: "languages",
                project_photo: "",
                project_link: "",
                project_source: "",
                project_year: dateFormat(Date.now(), "yyyy-MM-dd")
            }]
        });

        const removeProjectItem = this.setState("project_items", (state, evt) => {
            this.state.projectSaved = false;
            const project_items = state;

            project_items.splice(evt.target.dataset.id, 1);

            return project_items;
        });
        const setProjectItem = this.setState("project_items", (state, evt) => {
            this.state.projectSaved = false;
            const project_items = state;
            project_items[evt.target.dataset.id][evt.target.name] = evt.target.value;
            return project_items;
        });

        const saveProjectree = this.createFunc(() => {
            if (!this.loggedIn) {
                const goToSignIn = confirm("You must be signed in to save your projectree.\n\nSign in now? (Your progress will not be lost)") || false;

                if (goToSignIn) {
                    saveLocalProjectreeForAnonymous(this.state);
                    saveLocalProjectreeForRegistered(this.state);

                    this.state.projectSaved = true;

                    setContext("signInReferrer", "/create");
                    navigateTo("/signin");
                }
            } else {
                if (!this.editing) {
                    let projectreeName = (prompt("Saving Project:\n\nEnter projectree name", this.state.project_name) || (this.state.project_name || "Untitled Projectree"));
                    if (projectreeName.trim() === "") {
                        projectreeName = "Untitled Projectree"
                    }

                    /*
                        sendRequest to save creation
                        on success: navigateTo("/dashboard")
                        on fail: alert fail message
                    */
                } else {
                    /*
                        sendRequest to save edit
                        on success: navigateTo("/dashboard")
                        on fail: alert fail message
                    */
                }
            }
        });

        const publishProjectree = this.createFunc(() => {
            if (!this.loggedIn) {
                const goToSignIn = confirm("You must be signed in to publish your projectree.\n\nSign in now? (Your progress will not be lost)") || false;

                if (goToSignIn) {
                    saveLocalProjectreeForAnonymous(this.state);
                    saveLocalProjectreeForRegistered(this.state);

                    this.state.projectSaved = true;

                    setContext("signInReferrer", "/create");
                    navigateTo("/signin");
                }
            } else {
                if (!this.editing) {
                    let projectreeName = (prompt("Saving Project:\n\nEnter projectree name", this.state.project_name) || (this.state.project_name || "Untitled Projectree"));
                    if (projectreeName.trim() === "") {
                        projectreeName = "Untitled Projectree"
                    }

                    /*
                        sendRequest to save creation
                        on success: {
                            // publish project
                            
                            let publishedTreeName = (prompt("Publishing Project:\n\nEnter published name", this.state.published_name) || (this.state.published_name || "username_projectree");
                            if (publishedTreeName.trim() === "") {
                                publishedTreeName = "username_projectree"
                            }
                        }
                        on fail: alert fail message
                    */

                } else {
                    /*
                        sendRequest to save edit
                        on success: navigateTo("/dashboard")
                        on fail: alert fail message
                    */
                }
            }

        });

        let projectItems = "";
        if (this.state.project_items)
            for (let i = 0; i < this.state.project_items.length; i++) {
                const projNum = i + 1;
                const project = this.state.project_items[i];
                projectItems +=
                    `<div class="${tw`my-12`}">
            <div class="${tw`flex items-end justify-between px-4 pb-4`}">
                <span class="${tw`text-3xl font-medium`}">Project ${projNum}</span>
                ${await new Button(`
                <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-6 w-6`}" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>`, { onClick: removeProjectItem, dataSet: { id: i }, class: tw`rounded bg-red-400 p-2 text-sm text-zinc-50 hover:bg-red-800`, title: "Delete Projectree" }).mount(this)}
            </div>
            <div class="${tw`overflow-hidden rounded-xl border border-zinc-200 text-xl font-thin`}">
                <div class="${tw`grid grid-cols-12`}">
                    <div class="${tw`col-span-8 border-b border-r border-zinc-200`}">
                        <input id="project_item_${projNum}_name" type="text" name="project_name" data-id="${i}" placeholder="Name"
                            class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${project.project_name}" />
                    </div>
                    <div class="${tw`col-span-4 border-b border-zinc-200`}">
                        <input id="project_item_${projNum}_year" type="date" name="project_year" data-id="${i}" placeholder="Year Developed"
                            class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${project.project_year}" />
                    </div>
                </div>

                <div class="${tw`grid grid-cols-12`}">
                    <div class="${tw`col-span-7 row-span-3 h-64 border-b border-r border-zinc-200`}">
                        <textarea id="project_item_${projNum}_description" name="project_description" data-id="${i}" placeholder="Description"
                            class="${tw`h-full w-full resize-none bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}">${project.project_description}</textarea>
                    </div>
                    <div class="${tw`col-span-5 flex h-64 max-h-64 flex-col border-b border-zinc-200 bg-zinc-200`}">
                        <div
                            class="${tw`flex max-h-56 flex-grow items-center justify-center overflow-hidden`}">
                            <img id="project_item_${projNum}_photo_preview" class="${tw`w-full`}"
                                src="${project.project_photo}" alt="" onerror="if (this.src != '/static/images/default_project_photo.png') this.src = '/static/images/default_project_photo.png';" />
                        </div>
                        <input id="project_item_${projNum}_photo" type="text" name="project_photo" data-id="${i}" placeholder="Photo"
                            class="${tw`w-full border-t bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${project.project_photo}" />
                    </div>
                </div>

                <div class="${tw`border-b border-zinc-200`}">
                    <input id="project_item_${projNum}_languages" type="text" name="project_languages"
                    data-id="${i}" placeholder="Languages (comma separated)"
                        class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${project.project_languages}" />
                </div>

                <div class="${tw`grid grid-cols-2`}">
                    <div class="${tw`border-r border-zinc-200`}">
                        <input id="project_item_${projNum}_source" type="text" name="project_source"
                        data-id="${i}" placeholder="Source Code Link (optional)"
                            class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${project.project_source}" />
                    </div>
                    <div>
                        <input id="project_item_${projNum}_link" type="text" name="project_link" data-id="${i}" placeholder="Demo Link (optional)"
                            class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${project.project_link}" />
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
                        value="${this.state.project_name}" />
                </div>
            </div>
        </div>
        <section class="${tw`container mx-auto flex-grow px-4 sm:px-12`}">
            <div class="${tw`py-5`}">
                <!-- Projectree Meta Data -->
                <div class="${tw`grid justify-between gap-4 sm:grid-cols-3`}">
                    <div class="${tw`flex flex-col gap-1`}">
                        <label for="projectree_title" class="${tw`text-xl font-medium italic text-neutral-600`}">Projectree
                            Title</label>
                        <input type="text" id="projectree_title" name="projectree_title"
                            class="${tw`rounded-lg border border-zinc-200 bg-white py-1 px-3 text-xl outline-none focus:bg-gray-50`}"
                            onchange="${setProjectTitle}" value="${this.state.project_title}" />
                    </div>
                    <div class="${tw`flex flex-col gap-1`}">
                        <label for="projectree_theme" class="${tw`text-xl font-medium italic text-neutral-600`}">Theme</label>
                        <select id="projectree_theme" name="project_theme"
                            class="${tw`rounded-lg border border-zinc-200 py-1 px-3 text-xl`}">
                            <option disabled>Choose a theme</option>
                            <option selected value="standard">Standard</option>
                        </select>
                    </div>
                    <div class="${tw`flex flex-col gap-1`}">
                        <label for="projectree_favicon" class="${tw`text-xl font-medium italic text-neutral-600`}">Favicon</label>
                        <div class="${tw`flex overflow-hidden rounded-lg border border-zinc-200`}">
                            <div
                                class="${tw`flex w-12 items-center justify-center border-r border-zinc-200 bg-zinc-200`}">
                                <img id="projectree_favicon_preview" class="${tw`h-7 w-7`}"
                                    src="/static/images/projectree-logo-primary.png" alt="logo" />
                            </div>
                            <input type="text" id="projectree_favicon" name="project_favicon"
                                class="${tw`w-full bg-white py-1 px-1 text-xl outline-none focus:bg-gray-50`}"
                                onchange="${setProjectFavicon}" value="${this.state.project_favicon}"/>
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

const saveLocalProjectreeForAnonymous = function (state) {
    // const state = this.state;
    const localState = {
        project_name: state.project_name,
        project_title: state.project_title,
        project_favicon: state.project_favicon,
        project_theme: state.project_theme,
        project_items: state.project_items
    }
    const data = JSON.stringify(localState);
    localStorage.setItem("loggedOutCreateProjectreeState", data);
}

const saveLocalProjectreeForRegistered = function (state) {
    // const state = this.state;
    const localState = {
        project_name: state.project_name,
        project_title: state.project_title,
        project_favicon: state.project_favicon,
        project_theme: state.project_theme,
        project_items: state.project_items
    }
    const data = JSON.stringify(localState);
    localStorage.setItem("loggedInCreateProjectreeState", data);
}

function dateFormat(inputDate, format) {
    const date = new Date(inputDate);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    format = format.replace("MM", month.toString().padStart(2, "0"));

    if (format.indexOf("yyyy") > -1) {
        format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
        format = format.replace("yy", year.toString().substr(2, 2));
    }

    format = format.replace("dd", day.toString().padStart(2, "0"));

    return format;
}

// window.addEventListener('beforeunload', function (e) {
//     // if (objectUtils.objectLength(asyncQueue) === 0) return; // if already saved
//     e.preventDefault();
//     e.returnValue = '';
// });