import DCL, { Link, Button, setContext, navigateTo } from "../../DCL/core.js";


export default class Nav extends DCL {
    constructor(props) {
        super(props);

        this.props.loggedIn = setContext("loggedIn", false);

    }
    
    async onMount() {
        await super.onMount();
        
        this.monitorContext("loggedIn", (value) => {
            // DCL.triggerFunc(this.setState("loggedIn", this.state.count + 5));
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
    <div class="${tw`container mx-auto flex items-center justify-between`}">
    <div>
        ${await new Link(
            `<img class="${tw`mr-2 h-10 w-10`}" src="https://10minuteendpoint.net/icons/10me-logo-primary.png" alt="logo" />
            <span class="${tw`hidden text-2xl sm:inline`}">Projectree</span>`,
        { to: "/", class: tw`flex flex-wrap items-center` }).mount(this)}
    </div>
    <div class="${tw`hidden sm:block`}">user@email.com</div>
    <div class="${tw`flex flex-grow-0 flex-wrap items-center justify-end gap-2`}">
        ${await new Link("Dashboard", { to: "/dashboard", class: tw`inline-block rounded py-2 px-5 font-semibold hover:bg-stone-800 hover:text-slate-100` }).mount(this)}
        ${await new Button("Sign Out", { onClick:setSignedOut, class: tw`inline-block rounded bg-slate-100 py-2 px-5 font-semibold text-black hover:bg-slate-200` }).mount(this)}
    </div>
    </div>
</nav>`

    :
    `
<nav class="${tw`sticky top-0 z-30 bg-stone-700 py-3 px-12 text-slate-50`}">
    <div class="${tw`container mx-auto flex items-center justify-between`}">
    <div>
        ${await new Link(
            `<img class="${tw`mr-2 h-10 w-10`}" src="https://10minuteendpoint.net/icons/10me-logo-primary.png" alt="logo" />
            <span class="${tw`hidden text-2xl sm:inline`}">Projectree</span>`,
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