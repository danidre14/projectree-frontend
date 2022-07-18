import DCL, { Button, Link, Loader } from "../DCL/core.js";

import generateZippedProjectree from "../utils/generateProjectree.js";

export default class Create extends DCL {
    constructor(props) {
        super(props);

        this.state = {
            project_title: "",
            project_favicon: "",
            project_theme: "standard",
            project_items: [],
            // project_name: "",
            // project_description: "",
            // project_languages: "",
            // project_photo: "",
            // project_link: "",
            // project_source: "",
            // project_year: ""
        }
    }

    async onMount() {
        // const hi = this.setState("count", this.state.count + 5);
        // await window.asyncWait(1000);

        // DCL.triggerFunc(hi);
    }

    async render() {
        const generateTheProjectree = this.createFunc(() => {
            generateZippedProjectree(this.state);
        })
        const setProjectTitle = this.setState("project_title", (state, evt) => evt.target.value);
        const setProjectFavicon = this.setState("project_favicon", (state, evt) => evt.target.value);
        const addProjectItem = this.setState("project_items", (state) => {
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
            const project_items = state;

            project_items.splice(evt.target.dataset.id, 1);

            return project_items;
        });
        const setProjectItem = this.setState("project_items", (state, evt) => {
            const project_items = state;
            project_items[evt.target.dataset.id][evt.target.name] = evt.target.value;
            return project_items;
        })

        const setBatchedItem = this.createFunc((evt) => {
            setTimeout(() => {
                console.log("batched called")
                DCL.triggerFunc(this.setState("project_items", (state, evt) => {
                    const project_items = state;
                    project_items[evt.target.dataset.id][evt.target.name] = evt.target.value;
                    return project_items;
                }), evt)
            }, 1000);
        });

        let projectItems = "";
        for (let i = 0; i < this.state.project_items.length; i++) {
            const projNum = i + 1;
            const project = this.state.project_items[i];
            projectItems +=
                `<div class="${tw`my-12`}">
            <div class="${tw`flex items-end justify-between px-4 pb-4`}">
                <span class="${tw`text-4xl`}">Project ${projNum}</span>
                ${await new Button(`
                <svg xmlns="http://www.w3.org/2000/svg" class="${tw`h-10 w-10`}" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>`, { onClick: removeProjectItem, dataSet: { id: i } }).mount(this)}
            </div>
            <div class="${tw`overflow-hidden rounded-xl border border-neutral-300 text-xl font-thin`}">
                <div class="${tw`grid grid-cols-12`}">
                    <div class="${tw`col-span-8 border`}">
                        <input id="project_item_${projNum}_name" type="text" name="project_name" data-id="${i}" placeholder="Name"
                            class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${project.project_name}" />
                    </div>
                    <dcl style="display: none;"></dcl>
                    <!-- <template></template> -->
                    <div class="${tw`col-span-4 border`}">
                        <input id="project_item_${projNum}_year" type="date" name="project_year" data-id="${i}" placeholder="Year Developed"
                            class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${project.project_year}" />
                    </div>
                </div>

                <div class="${tw`grid grid-cols-12`}">
                    <div class="${tw`col-span-7 row-span-3 h-64 border`}">
                        <textarea id="project_item_${projNum}_description" name="project_description" data-id="${i}" placeholder="Description"
                            class="${tw`h-full w-full resize-none bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}">${project.project_description}</textarea>
                    </div>
                    <div class="${tw`col-span-5 flex h-64 max-h-64 flex-col border bg-neutral-200`}">
                        <div
                            class="${tw`flex max-h-56 flex-grow items-center justify-center overflow-hidden`}">
                            <img id="project_item_${projNum}_photo_preview" class="${tw`w-full`}"
                                src="https://flevar.com/images/hero-images/home-hero-image.jpg" alt=""
                                onerror="console.log(event)" />
                        </div>
                        <input id="project_item_${projNum}_photo" type="text" name="project_photo" data-id="${i}" placeholder="Photo"
                            class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${project.project_photo}" />
                    </div>
                </div>

                <div class="${tw``}">
                    <div class="${tw`border`}">
                        <input id="project_item_${projNum}_languages" type="text" name="project_languages"
                        data-id="${i}" placeholder="Languages (comma separated)"
                            class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${project.project_languages}" />
                    </div>
                </div>

                <div class="${tw`grid grid-cols-2`}">
                    <div class="${tw`border`}">
                        <input id="project_item_${projNum}_source" type="text" name="project_source"
                        data-id="${i}" placeholder="Source Code Link (optional)"
                            class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${project.project_source}" />
                    </div>
                    <div class="${tw`border`}">
                        <input id="project_item_${projNum}_link" type="text" name="project_link" data-id="${i}" placeholder="Demo Link (optional)"
                            class="${tw`w-full bg-white px-3 py-2 italic outline-none focus:bg-gray-50`}" onchange="${setProjectItem}" value="${project.project_link}" />
                    </div>
                </div>
            </div>
        </div>`

        }

        return (
            // ${await new Button("Click me", { onClick: setBatchedItem }).mount(this)}
            `
        <div class="${tw`flex h-full flex-col flex-grow`}">
        <div class="${tw`sticky top-16 bg-neutral-300 px-12`}">
            <div class="${tw`container mx-auto flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-end`}">
                <h1 class="${tw`text-3xl sm:text-4xl`}">Create ProjecTree</h1>
                <div class="${tw`hidden text-right`}">
                    
                </div>
            </div>
        </div>
        <section class="${tw`flex-grow px-12`}">
            <div class="${tw`container mx-auto py-5`}">
                <!-- Projectree Meta Data -->
                <div class="${tw`grid justify-between gap-4 sm:grid-cols-3`}">
                    <div class="${tw`flex flex-col gap-1`}">
                        <label for="projectree_title" class="${tw`text-xl italic text-neutral-600`}">Projectree
                            Title</label>
                        <input type="text" id="projectree_title" name="projectree_title"
                            class="${tw`rounded-lg border border-neutral-300 bg-white py-1 px-3 text-xl shadow-inner outline-none focus:bg-gray-50`}"
                            onchange="${setProjectTitle}" value="${this.state.project_title}" />
                    </div>
                    <div class="${tw`flex flex-col gap-1`}">
                        <label for="projectree_theme" class="${tw`text-xl italic text-neutral-600`}">Theme</label>
                        <select id="projectree_theme" name="project_theme"
                            class="${tw`rounded-lg border border-neutral-300 py-1 px-3 text-xl shadow-inner`}">
                            <option disabled>Choose a theme</option>
                            <option selected value="standard">Standard</option>
                        </select>
                    </div>
                    <div class="${tw`flex flex-col gap-1`}">
                        <label for="projectree_favicon" class="${tw`text-xl italic text-neutral-600`}">Favicon</label>
                        <div class="${tw`flex overflow-hidden rounded-lg border border-neutral-300 shadow-inner`}">
                            <div
                                class="${tw`flex w-12 items-center justify-center border-r border-neutral-300 bg-neutral-200`}">
                                <img id="projectree_favicon_preview" class="${tw`h-7 w-7`}"
                                    src="https://10minuteendpoint.net/icons/10me-logo-primary.png" alt="logo" />
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
        <div class="${tw`sticky bottom-0 bg-neutral-300 px-12`}">
            <div
                class="${tw`container mx-auto flex flex-col flex-wrap justify-between gap-4 py-5 sm:flex-row sm:items-end`}">
                <div class="${tw`flex justify-center gap-2 whitespace-nowrap`}">
                    ${await new Button("Add Project Item", { onClick: addProjectItem, class: tw`rounded bg-slate-100 py-2 px-5 font-semibold text-black shadow-lg hover:bg-slate-200` }).mount(this)}
                    ${await new Button("Generate Projectree", { onClick: generateTheProjectree, class: tw`rounded bg-slate-100 py-2 px-5 font-semibold text-black shadow-lg hover:bg-slate-200` }).mount(this)}
                </div>
                <div class="${tw`ml-auto flex justify-center gap-2 whitespace-nowrap`}">
                    <button
                        class="${tw`rounded bg-blue-500 py-2 px-5 font-semibold text-slate-50 shadow-lg hover:bg-blue-600`}">
                        <a href="#save_projectree">Save Projectree</a>
                    </button>
                    <button
                        class="${tw`rounded bg-blue-500 py-2 px-5 font-semibold text-slate-50 shadow-lg hover:bg-blue-600`}">
                        <a href="#save_projectree">Publish Projectree</a>
                    </button>
                </div>
            </div>
        </div>
    </div>
        `
        );
    }
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