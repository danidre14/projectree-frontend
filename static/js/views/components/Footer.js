import DCL, { Link } from "../../DCL/core.js";

export default class Footer extends DCL {
    constructor(props) {
        super(props);

        this.props.loggedIn = true;
    }

    async onMount() {
        this.monitorContext("viewing_projectree", (value) => {
            this.props.hidden = value;
        });
    }

    async render() {
        const hiddenText = this.props.hidden ? "hidden" : "";

        return `
<footer>
    <div class="${tw`border-t ${hiddenText} border-zinc-300 bg-zinc-50 p-5 px-12 text-stone-700 shadow`}">
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
                Created for the ${await new Link("Planetscale x Hashnode Hackathon", { to: "https://townhall.hashnode.com/planetscale-hackathon", class: tw`rounded p-1 font-semibold underline hover:bg-zinc-200` }).mount(this)}
            </div>
        </div>
    </div>    
    <div class="${tw`border-t border-zinc-300 bg-zinc-50 p-3 px-12 text-stone-700 shadow`}">
        <div class="${tw`container mx-auto flex items-center justify-center gap-2 text-xl md:gap-4`}">
            ${await new Link(`<img class="${tw`sm:mr-2 h-7 w-7`}" src="/static/images/icons/hashnode-icon.png"
            alt="Hashnode Icon" title="Hashnode" />
            <span class="${tw`hidden sm:inline`}">Hashnode</span>`, { to: "https://hashnode.com/?source=planetscale_hackathon_announcement", class: tw`flex items-center rounded p-2 hover:bg-zinc-200` }).mount(this)}
            ${await new Link(`<img class="${tw`sm:mr-2 h-7 w-7`}" src="/static/images/icons/planetscale-icon.png"
            alt="PlanetScale Icon" title="PlanetScale" />
            <span class="${tw`hidden sm:inline`}">PlanetScale</span>`, { to: "https://planetscale.com/?utm_source=hashnode&utm_medium=hackathon&utm_campaign=announcement_article", class: tw`flex items-center rounded p-2 hover:bg-zinc-200` }).mount(this)}
            ${await new Link(`<img class="${tw`sm:mr-2 h-7 w-7`}" src="/static/images/icons/blog-icon.png"
            alt="About Project Icon" title="About Project" />
            <span class="${tw`hidden sm:inline`}">About</span>`, { to: "https://blog.danidre.com/introducing-projectree", class: tw`flex items-center rounded p-2 hover:bg-zinc-200` }).mount(this)}
            ${await new Link(`<img class="${tw`sm:mr-2 h-7 w-7`}" src="/static/images/icons/github-icon.png"
            alt="Github Source Icon" title="Github Source" />
            <span class="${tw`hidden sm:inline`}">Github</span>`, { to: "https://github.com/danidre14/projectree_frontend", class: tw`flex items-center rounded p-2 hover:bg-zinc-200` }).mount(this)}
        </div>
    </div>
</footer>
        `;
    }
}