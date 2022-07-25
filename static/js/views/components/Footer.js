import DCL, { Link } from "../../DCL/core.js";

export default class Footer extends DCL {
    constructor(props) {
        super(props);

        this.props.loggedIn = true;
    }

    async render() {
        return `
<footer class="${tw`border-t border-zinc-300 bg-zinc-50 p-5 px-12 text-stone-700 shadow`}">
    <div class="${tw`container mx-auto flex items-center justify-between`}">
        <div>
            ${await new Link(`
                <span class="${tw`inline-flex flex-wrap gap-1 text-xl font-semibold`}">
                    <span class="${tw`hidden sm:inline`}">©</span>
                    <span>ProjecTree</span>
                </span>
            `, { to: "/", class: tw`flex items-center` }).mount(this)}
        </div>
        <div class="${tw`text-right`}">
            Created for the ${await new Link("Planetscale x Hashnode Hackathon", { to: "https://townhall.hashnode.com/planetscale-hackathon", class: tw`rounded p-1 font-semibold underline hover:bg-zinc-200` }).mount(this)}</div>
    </div>
</footer>
        `;
    }
}