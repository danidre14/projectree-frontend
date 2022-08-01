import DCL, { setContext, clearContext, useParams, ignoreRoute } from "../DCL/core.js";
import { get, post, patch, put, del, cancel } from "../utils/makeRequest.js";

import display from "../utils/displayProjectree.js";

export default class ViewProjectree extends DCL {
    constructor(props) {
        super(props);

        this.state = { 
            content: ""
        }
    }

    async onMount() {
        const { name } = useParams();
        console.log(name)
        try {
            const res = await get(`/view-publish/${name}`);
            
            if (res.success) {
                const projectree = res.data.projectree;
                const title = projectree.title;
                const description = projectree.description || `Generated Projectree for ${title}`;
                this.setTitle(title);
                this.setDescription(description);

                const theme = display.themes[projectree.theme] ? projectree.theme : "standard";
                DCL.triggerFunc(this.setState("content", display[theme](projectree)));
                setContext("viewing_projectree", true);
            } else {
                ignoreRoute();
            }
        } catch {
            ignoreRoute();
        }
    }

    async onUnmount() {
        clearContext("viewing_projectree");
    }

    async render() {
        return `<div class="${tw`flex flex-grow flex-col`}">
            ${this.state.content}
        </div>`;
    }
}