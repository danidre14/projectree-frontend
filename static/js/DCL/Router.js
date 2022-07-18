import DCL from "./Component.js";

export default class Router extends DCL {
    constructor(props) {
        super(props);

        this.id = props.id || "";
        this.class = props.class || "";
        this.style = props.style || "";

        this.routeList = [];
        this.view = null;

        this.init(props.routes);

    }
    
    async onMount() {
        await super.onMount();
        
        DCL.onEvent("navigateTo", this.navigateTo);
    }

    async onUnmount() {
        await super.onUnmount();

        DCL.off("navigateTo", this.navigateTo);
    }

    navigateTo = async url => {
        try {
            history.pushState(null, null, url);
            await this.run();
        } catch {
            window.open(url, "_blank").focus();
        }
    };

    init = routes => {
        this.routeList = routes;

        this.defaultRoute = this.props.defaultRoute || routes[0];

        window.addEventListener("popstate", this.run);

        document.body.addEventListener("click", async e => {
            let target = e.target;
            while (target != document.body && !target.matches("[data-link]") && target.parentElement) {
                target = target.parentElement;
            }
            if (target.matches("[data-link]")) {
                e.preventDefault();
                await this.navigateTo(target.href);
            }
        });
        this.run();
    };

    run = async () => {
        const routes = this.routeList;

        // Test each route for potential match
        const potentialMatches = routes.map(route => ({
            route: route,
            result: location.pathname.match(this.pathToRegex(route.path))
        })
        );

        let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

        if (!match) {
            match = {
                route: this.defaultRoute,
                result: [location.pathname]
            };
        }

        const loading = await this._getLoadingView(match);

        const params = this.getParams(match);

        DCL.params = params;

        this.view = loading.default ?
            new loading.default({ params }) :
            new loading.view({ params });

        if (match.route.title) {
            document.title = match.route.title;
            this.setActiveRouteOnElement(match);
        }

        return await this._rerender();
    };

    async render() {
        if (this.view === null) return "";

        const id = this.id ? `id="${this.id}"` : "";
        const style = this.style ? `style="${this.style}"` : "";
        const classList = this.class ? `class="${this.class}"` : "";

        const content = await this.view.mount(this);

        const view = `<div
        ${id}
        ${classList}
        ${style}
        >${content}</div>`;

        return view;
    }

    async _rerender() {
        await super._rerender();
    }

    setActiveRouteOnElement = (match) => {
        try {
            Array.from(document.querySelectorAll("[data-link]")).forEach(
                (el) => el.removeAttribute("data-active")
            );
            document.querySelector(
                `[data-link][href="${match.route.path}"], [data-link="${match.route.path}"]`
            ).setAttribute("data-active", "route");
        } catch { }
    }

    pathToRegex = path => new RegExp("^" + path.replace(/\/?$/g, "").replace(/\//g, "\\/").replace(/:\w+/g, "([^/]+)") + "\/?$");

    getParams = match => {
        const values = match.result.slice(1);
        const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

        return Object.fromEntries(keys.map((key, i) => {
            return [key, values[i]];
        }));
    };

    _getLoadingView = async (match) => typeof match.route.view === "function" ?
        await match.route.view() :
        await match.route.view
}
