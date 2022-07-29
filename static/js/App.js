import DCL, { Router, Link, setContext } from "./DCL/core.js";
import Footer from "./views/components/Footer.js";
import Nav from "./views/components/Nav.js";
import { get, post, patch, put, del, cancel } from "./utils/makeRequest.js";

export default class App extends DCL {
    constructor(props) {
        super(props);

        setContext("loggedIn", localStorage.getItem("loggedIn") || false);
        setContext("userEmail", localStorage.getItem("userEmail") || "");

        this.state = {

        }
    }

    async onMount() {
        await checkLoggedIn();
    }

    async render() {
        const router = new Router({
            routes: [
                {
                    path: "/",
                    title: "Projectree | Home",
                    description: "Projectree helps you create your project showcase in as little as 5 minutes!",
                    view: async() => await import("./views/Home.js")
                },
                {
                    path: "/create",
                    title: "Projectree | Create Projectree",
                    description: "Create a Projectree.",
                    view: async() => await import("./views/DesignTree.js"),
                    props: { editing: false }
                },
                {
                    path: "/edit/:projectreeId",
                    title: "Projectree | Edit Projectree",
                    description: "Edit your Projectree.",
                    view: async() => await import("./views/DesignTree.js"),
                    props: { editing: true }
                },
                {
                    path: "/signin",
                    title: "Projectree | Sign In",
                    description: "Sign into your Projectree account.",
                    view: async() => await import("./views/SignIn.js")
                },
                {
                    path: "/signup",
                    title: "Projectree | Sign Up",
                    description: "Sign up for a Projectree account.",
                    view: async() => await import("./views/SignUp.js")
                },
                {
                    path: "/view/:name",
                    title: "Projectree | View Projectree",
                    view: async() => await import("./views/ViewProjectree.js")
                },
                {
                    path: "/dashboard",
                    title: "Projectree | Dashboard",
                    description: "Edit, publish, or delete your Projectree drafts.",
                    view: async() => await import("./views/Dashboard.js")
                },
                {
                    path: "/legal/privacy",
                    title: "Projectree | Privacy Policy",
                    description: "Projectree privacy policy.",
                    view: async() => await import("./views/Privacy.js")
                },
                {
                    path: "/legal/tos",
                    title: "Projectree | Terms of Service",
                    description: "Projectree terms of service.",
                    view: async() => await import("./views/TOS.js")
                },
            ],
            defaultRoute: {
                path: "/404",
                title: "Error 404",
                description: "No page found. The link may be broken, or the page does not exist.",
                view: async() => await import("./views/Page404.js")
            },
            class: tw`flex h-full flex-grow flex-col`,
            middlewares: [checkLoggedIn]
        });
        return `
        <div class="${tw`flex min-h-screen flex-col`}">
            ${await new Nav().mount(this)}

            <main class="${tw`flex h-full flex-grow flex-col bg-zinc-50`}">
                ${await router.mount(this)}
            </main>

            ${await new Footer().mount(this)}
        </div>
        `
    }
}

async function checkLoggedIn() {
    try {
        const res = await get("/auth/loggedIn");

        console.log("trying to be signed in")

        if (res.success) {
            setContext("loggedIn", true);
            localStorage.setItem("loggedIn", true);
        } else {
            setContext("loggedIn", false);
            localStorage.setItem("loggedIn", false);
        }
    } catch (e) {}
}