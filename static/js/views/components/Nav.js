import DCL, { Link, Button, setContext, getContext, navigateTo } from "../../DCL/core.js";


export default class Nav extends DCL {
    constructor(props) {
        super(props);

        this.props.loggedIn = getContext("loggedIn");

    }

    async onMount() {
        await super.onMount();

        this.monitorContext("loggedIn", (value) => {
            this.props.loggedIn = value;
        });


    }

    async onUnmount() {
        await super.onUnmount();
    }

    async render() {
        const setSignedOut = this.createFunc(() => {
            attemptSignOut();
        });

        return this.props.loggedIn ? `
<nav class="${tw`sticky top-0 z-30 bg-stone-700 py-3 px-12 text-slate-50`}">
    <div class="${tw`container mx-auto flex items-center justify-between gap-4`}">
        <div class="${tw`w-full`}">
            ${await new Link(`
            <img class="${tw`h-10 w-10`}"
                src="/static/images/projectree-logo-primary.png" alt="logo" />
            <span class="${tw`hidden text-2xl sm:inline`}">rojectree</span>
            `, { to: "/", class: tw`flex items-center` }).mount(this)}
        </div>
        <div class="${tw`hidden w-full flex-grow truncate sm:inline`}">user@email.com</div>
        <div class="${tw`flex w-full items-center justify-end gap-2 whitespace-nowrap`}">
            ${await new Link("Dashboard", { to: "/dashboard", class: tw`rounded py-2 px-5 font-semibold hover:bg-stone-800 hover:text-slate-100` }).mount(this)}
            ${await new Button("Sign Out", { onClick: setSignedOut, class: tw`rounded bg-slate-100 py-2 px-5 font-semibold text-black hover:bg-slate-200` }).mount(this)}
        </div>
    </div>
</nav>`

            :
            `
<nav class="${tw`sticky top-0 z-30 bg-stone-700 py-3 px-12 text-slate-50`}">
    <div class="${tw`container mx-auto flex items-center justify-between`}">
    <div>
        ${await new Link(
                `<img class="${tw`h-10 w-10`}" src="/static/images/projectree-logo-primary.png" alt="logo" />
            <span class="${tw`hidden text-2xl sm:inline`}">rojectree</span>`,
                { to: "/", class: tw`flex flex-wrap items-center` }).mount(this)}
    </div>
    <div class="${tw`flex flex-grow-0 flex-wrap items-center justify-end gap-2`}">
        ${await new Link("Sign In", { to: "/signin", class: tw`inline-block rounded bg-slate-100 py-2 px-5 font-semibold text-black hover:bg-slate-200` }).mount(this)}
        ${await new Link("Sign Up", { to: "/signup", class: tw`inline-block rounded bg-slate-100 py-2 px-5 font-semibold text-black hover:bg-slate-200` }).mount(this)}
    </div>
    </div>
</nav>
        `;
    }
}

function attemptSignOut() {
    setContext("loggedIn", false);
    navigateTo("/");
}