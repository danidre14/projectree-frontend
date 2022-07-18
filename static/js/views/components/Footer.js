import DCL, { Link } from "../../DCL/core.js";

export default class Footer extends DCL {
    constructor(props) {
        super(props);

        this.props.loggedIn = true;
    }

    async render() {
        return `
<footer class="${tw`bg-stone-700 p-5 px-12 text-slate-50`}">
    <div class="${tw`container mx-auto flex items-center justify-between`}">
        <div>
            ${await new Link(`
                <span class="${tw`inline-flex flex-wrap gap-1 text-xl`}">
                    <span class="${tw`hidden sm:inline`}">©</span>
                    <span>ProjecTree</span></span
                >
            `, { to: "/", class: tw`flex items-center` }).mount(this)}
        </div>
        <div class="${tw`text-right`}">Created for the ${await new Link("Planetscale x Hashnode Hackathon", { to: "https://townhall.hashnode.com/planetscale-hackathon", class: tw`rounded p-1 font-semibold underline hover:bg-stone-800 hover:text-slate-100` }).mount(this)}</div>
    </div>
</footer>
        `;
    }
}