import DCL from "./Component.js";

export default class Router extends DCL {
    constructor(props) {
        super(props);

        this.id = props.id || "";
        this.class = props.class || "";
        this.style = props.style || "";

        this.routeList = [];
        this.view = null;

        this.middlewares = props.middlewares || [];

        this.init(props.routes);

    }

    async onMount() {
        DCL.onEvent("navigateTo", this.navigateTo);
        DCL.onEvent("ignoreRoute", this._goTo404);
        window.addEventListener("beforeunload", this._beforeUnload);
    }

    async onUnmount() {
        DCL.offEvent("navigateTo", this.navigateTo);
        DCL.offEvent("ignoreRoute", this._goTo404);
        window.removeEventListener("beforeunload", this._beforeUnload);
    }

    _beforeUnload(evt) {
        if (DCL._confirmNavigate()) {
            evt.preventDefault();
            evt.returnValue = '';
        } else {
            return;
        }
    }

    navigateTo = async url => {
        try {
            let navigateToUrl = true;
            const confirmNavigate = DCL._confirmNavigate();
            if (confirmNavigate) {
                navigateToUrl = confirm("Leave site?\n\nChanges you made may not be saved.") || false;
            }
            if (navigateToUrl) {
                history.pushState(null, null, url);
                await this.run();
            }
        } catch (err) {
            window.open(url, "_blank").focus();
        }
    };

    init = routes => {
        this.routeList = routes;

        this.defaultRoute = this.props.defaultRoute || routes[0];

        window.addEventListener("popstate", this.run);

        document.body.addEventListener("click", async e => {
            let target = e.target;
            // while (target != document.body && !target.matches("[data-dcl-link]") && target.parentElement) {
            //     target = target.parentElement;
            // }
            if (target.matches("[data-dcl-link]")) {
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
        const props = match.route.props;

        const params = this.getParams(match);
        const query = this.getQuery(location.search);

        DCL.params = params;
        DCL.query = query;


        return await this._displayView(match, loading, props, params, query);
    };

    _goTo404 = async () => {
        const match = {
            route: this.defaultRoute,
            result: [location.pathname]
        }

        const loading = await this._getLoadingView(match);
        const props = match.route.props;

        const params = this.getParams(match);
        const query = this.getQuery(location.search);

        DCL.params = params;
        DCL.query = query;

        return await this._displayView(match, loading, props, params, query);
    };



    _displayView = async (match, loading, props, params, query) => {
        for (const middleware of this.middlewares)
            if (typeof middleware === "function")
                await middleware();

        this.view = loading.default ?
            new loading.default({ ...props, params, query }) :
            new loading.view({ ...props, params, query });

        if (match.route.title) {
            this.setTitle(match.route.title);
            this.setActiveRouteOnElement(match);
        }
        if (match.route.description) {
            this.setDescription(match.route.description);
        }

        return await this._rerender();
    }

    async render() {
        if (this.view === null) return "";

        const id = this.id ? `id="${this.id}"` : "";
        const style = this.style ? `style="${this.style}"` : "";
        const classList = this.class ? `class="${this.class}"` : "";

        const content = (this.view.mount && typeof this.view.mount === "function") ? await this.view.mount(this) : "";

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
            Array.from(document.querySelectorAll("[data-dcl-link]")).forEach(
                (el) => el.removeAttribute("data-active")
            );
            document.querySelector(
                `[data-dcl-link][href="${match.route.path}"], [data-dcl-link="${match.route.path}"]`
            ).setAttribute("data-active", "route");
        } catch { }
    }

    pathToRegex = path => new RegExp("^" + path.replace(/\/?$/g, "").replace(/\//g, "\\/").replace(/:\w+/g, "([^/]+)") + "\/?$");

    getParams = match => {
        const values = match.result.slice(1);
        const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

        return Object.fromEntries(keys.map((key, i) => {
            return [key, decodeURI(values[i])];
        }));
    };

    getQuery = searchParams => {
        const urlSearchParams = new URLSearchParams(searchParams);
        const query = Object.fromEntries(urlSearchParams.entries());
        return query;
    };

    _getLoadingView = async (match) => typeof match.route.view === "function" ?
        await match.route.view() :
        await match.route.view
}
