import DCL, { Router, Link, setContext } from "./DCL/core.js";
import Footer from "./views/components/Footer.js";
import Nav from "./views/components/Nav.js";

export default class App extends DCL {
    constructor(props) {
        super(props);

        setContext("loggedIn", false);

        this.state = {

        }
    }

    async render() {
        const router = new Router({
            routes: [
                {
                    path: "/",
                    title: "Projectree",
                    description: "Projectree helps you create your project showcase in as little as 5 minutes!",
                    view: async() => await import("./views/Homepage.js")
                },
                {
                    path: "/create",
                    title: "Create",
                    description: "Create a Projectree.",
                    view: async() => await import("./views/DesignTree.js"),
                    props: { editing: false }
                },
                {
                    path: "/edit/:projectreeId",
                    title: "Edit",
                    description: "Edit your Projectree.",
                    view: async() => await import("./views/DesignTree.js"),
                    props: { editing: true }
                },
                {
                    path: "/signin",
                    title: "Sign In",
                    description: "Sign into your Projectree account.",
                    view: async() => await import("./views/SignIn.js")
                },
                {
                    path: "/signup",
                    title: "Sign Up",
                    description: "Sign up for a Projectree account.",
                    view: async() => await import("./views/SignUp.js")
                },
                {
                    path: "/view/:code",
                    title: "View Projectree",
                    view: async() => await import("./views/ViewProjectree.js")
                },
                {
                    path: "/dashboard",
                    title: "Dashboard",
                    description: "Edit, publish, or delete your Projectree drafts.",
                    view: async() => await import("./views/Dashboard.js")
                },
            ],
            defaultRoute: {
                path: "/404",
                title: "Error 404",
                description: "No page found. The link may be broken, or the page does not exist.",
                view: async() => await import("./views/Page404.js")
            },
            class: tw`flex h-full flex-grow flex-col`
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