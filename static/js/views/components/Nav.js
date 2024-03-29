import DCL, { Link, Button, getContext } from "../../DCL/core.js";
import { del, signout } from "../../utils/makeRequest.js";


export default class Nav extends DCL {
    constructor(props) {
        super(props);

        const user = getContext("user");
        this.props.loggedIn = !!user;
        this.setDisplayName(user);
    }

    async onMount() {
        this.monitorContext("user", (user) => {
            this.props.loggedIn = !!user;
            if (user)
                this.setDisplayName(user);
        });

        this.monitorContext("viewing_projectree", (value) => {
            this.props.hidden = value;
        });
    }

    setDisplayName(user) {
        if (user && user.email)
            this.props.displayName = user.email;
    }

    async render() {
        const setSignedOut = this.createFunc(() => {
            attemptSignOut();
        });

        const hiddenText = this.props.hidden ? "hidden" : "";

        return this.props.loggedIn ? `
<nav class="${tw`sticky ${hiddenText} top-0 z-30 border-b border-zinc-300 bg-zinc-50 py-4 px-4 sm:px-12 text-red-600 shadow-sm`}">
    <div class="${tw`container mx-auto flex items-center justify-between gap-4`}">
        <div class="${tw`w-full`}">
            ${await new Link(`
            <img class="${tw`h-10 w-10`}"
                src="/static/images/projectree-logo-primary.png" alt="logo" />
            <span class="${tw`hidden text-3xl font-semibold sm:inline`}">rojectree</span>
            `, { to: "/", class: tw`flex items-center` }).mount(this)}
        </div>
        <div class="${tw`hidden w-full flex-grow truncate text-center font-medium text-stone-700 sm:inline`}">${this.props.displayName}</div>
        <div class="${tw`flex w-full items-center justify-end gap-2 whitespace-nowrap`}">
            ${await new Link("Dashboard", { to: "/dashboard", class: tw`inline-block whitespace-nowrap rounded py-2 px-5 font-semibold text-red-400 border border-red-400 hover:bg-red-400 hover:text-zinc-50` }).mount(this)}
            ${await new Button("Sign Out", { onClick: setSignedOut, class: tw`inline-block whitespace-nowrap rounded bg-red-400 py-2 px-5 font-bold text-zinc-50 hover:bg-red-800` }).mount(this)}
        </div>
    </div>
</nav>`

            :
            `
<nav class="${tw`sticky ${hiddenText} top-0 z-30 border-b border-zinc-300 bg-zinc-50 py-4 px-4 sm:px-12 text-red-600 shadow-sm`}">
    <div class="${tw`container mx-auto flex items-center justify-between`}">
    <div>
        ${await new Link(
                `<img class="${tw`h-10 w-10`}" src="/static/images/projectree-logo-primary.png" alt="logo" />
            <span class="${tw`hidden text-3xl font-semibold sm:inline`}">rojectree</span>`,
                { to: "/", class: tw`flex flex-wrap items-center` }).mount(this)}
    </div>
    <div class="${tw`flex flex-grow-0 flex-wrap items-center justify-end gap-2`}">
        ${await new Link("Sign In", { to: "/signin", class: tw`inline-block whitespace-nowrap rounded bg-red-400 py-2 px-5 font-bold text-zinc-50 hover:bg-red-800` }).mount(this)}
        ${await new Link("Sign Up", { to: "/signup", class: tw`inline-block whitespace-nowrap rounded bg-red-400 py-2 px-5 font-bold text-zinc-50 hover:bg-red-800` }).mount(this)}
    </div>
    </div>
</nav>
        `;
    }
}

async function attemptSignOut() {
    try {
        const res = await del("/auth/signout");

        if (res.success) {
            signout();
        } else {
            if (res.message)
                alert(res.message);
        }
    } catch (err) {
        if (err.name != "SyntaxError")
            alert("Sign out failed: " + err);
    }
}