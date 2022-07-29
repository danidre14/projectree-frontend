import DCL, { setContext, clearContext, useParams, ignoreRoute } from "../DCL/core.js";
import { get, post, patch, put, del, cancel } from "../utils/makeRequest.js";

export default class ViewProjectree extends DCL {
    constructor(props) {
        super(props);

        this.state = { 
            content: "Hi"
        }
    }

    async onMount() {
        const { name } = useParams();
        try {
            const res = await get(`/view-publish/${name}`);
            
            if (res.success) {
                const projectree = res.data;
                const title = projectree.project_title;
                const description = projectree.project_description || `Generated Projectree for ${title}`;
                this.setTitle(title);
                this.setDescription(description);
                DCL.triggerFunc(this.setState("content", renderProjectree(projectree)));
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
        return `<div>
            ${this.state.content}
        </div>`;
    }
}

function renderProjectree(data = {}) {
    return "";
}