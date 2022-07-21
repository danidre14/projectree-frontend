import DCL, { Router, Link } from "./DCL/core.js";
import Footer from "./views/components/Footer.js";
import Nav from "./views/components/Nav.js";

export default class App extends DCL {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    async render() {
        const router = new Router({
            routes: [
                {
                    path: "/",
                    title: "Homepage",
                    view: async() => await import("./views/Homepage.js")
                },
                {
                    path: "/create",
                    title: "Create",
                    view: async() => await import("./views/Create.js")
                },
                {
                    path: "/signin",
                    title: "Sign In",
                    view: async() => await import("./views/SignIn.js")
                },
                {
                    path: "/signup",
                    title: "Sign Up",
                    view: async() => await import("./views/SignUp.js")
                },
                {
                    path: "/dashboard",
                    title: "Dashboard",
                    view: async() => await import("./views/Dashboard.js")
                },
            ],
            defaultRoute: {
                path: "/404",
                title: "Error 404",
                view: async() => await import("./views/Page404.js")
            },
            class: tw`h-full flex flex-col flex-grow`
        });
        return `
        <div class="${tw`flex min-h-screen flex-col`}">
            ${await new Nav().mount(this)}

            <main class="${tw`flex flex-grow flex-col bg-neutral-100`}">
                ${await router.mount(this)}
            </main>

            ${await new Footer().mount(this)}
        </div>
        `
    }
}