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
        const addProjectItems = this.setState("project_items", (state) => {
            return [...state, {
                project_name: "name",
                project_description: "description",
                project_languages: "languages",
                project_photo: "",
                project_link: "",
                project_source: "",
                project_year: ""
            }]
        });

        let projectItems = "";
        for (let i = 0; i < this.state.project_items.length; i++) {
            const setProjectItem = this.setState("project_items", (state, evt) => {
                const project_items = state;
                project_items[i][evt.target.name] = evt.target.value;
                return project_items;
            })
            projectItems += `
            <h3>Item ${i}</h3>
            <p>Add project name</p>
            <input oninput="${setProjectItem}" type="text" name="project_name" placeholder="project_name" value="${this.state.project_items[i].project_name}" />

            <p>Add project description</p>
            <input oninput="${setProjectItem}" type="text" name="project_description" placeholder="project_description" value="${this.state.project_items[i].project_description}" />

            <p>Add languages used</p>
            <input oninput="${setProjectItem}" type="text" name="project_languages" placeholder="project_languages" value="${this.state.project_items[i].project_languages}" />

            <p>Add project photo</p>
            <input oninput="${setProjectItem}" type="text" name="project_photo" placeholder="project_photo" value="${this.state.project_items[i].project_photo}" />

            <p>Add project link</p>
            <input oninput="${setProjectItem}" type="text" name="project_link" placeholder="project_link" value="${this.state.project_items[i].project_link}" />

            <p>Add project source</p>
            <input oninput="${setProjectItem}" type="text" name="project_source" placeholder="project_source" value="${this.state.project_items[i].project_source}" />
            
            <p>Add project year</p>
            <input oninput="${setProjectItem}" type="text" name="project_year" placeholder="project_year" value="${this.state.project_items[i].project_year}" />
            `;
        }

        return `
        <div>
            <h1>Welcome back, Danidre</h1>

            <p>Projectree title</p>
            <input oninput="${setProjectTitle}" type="text" name="project_title" placeholder="project_title" value="${this.state.project_title}" />

            <p>Projectree favicon</p>
            <input oninput="${setProjectFavicon}" type="text" name="project_favicon" placeholder="project_favicon" value="${this.state.project_favicon}" />            

            <p>Projectree theme</p>
            <input disabled type="text" name="project_theme" placeholder="project_theme" value="${this.state.project_theme}" />

            ${await new Button("Add Project Item", { onClick: addProjectItems }).mount(this)}

            ${projectItems}

            
            ${await new Button("Generate Projectree", { onClick: generateTheProjectree }).mount(this)}
        </div>
        `;
    }
}