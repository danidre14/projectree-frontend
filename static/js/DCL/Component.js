document.body.addEventListener('click', async evt => {
    checkForSelectedItem(evt.target)
});

const selectedElementTypes = `textarea, input[type="text"], input[type="password"]`;
function checkForSelectedItem(target) {
    const elem = createXPathFromElement(target);
    if (target && target.matches(selectedElementTypes)) {
        Component.selectedElement = {
            path: elem,
            start: target.selectionStart || 0,
            end: target.selectionEnd || 0
        };

    } else {
        Component.selectedElement = {
            path: elem,
            start: 0,
            end: 0
        };
    }
    return elem;
}

function createXPathFromElement(elm) {
    const segs = [];
    for (; elm && elm.nodeType == 1; elm = elm.parentNode) {
        let i = 1;
        for (let sib = elm.previousSibling; sib; sib = sib.previousSibling) {
            if (sib.localName == elm.localName) i++;
        };
        segs.unshift(elm.localName.toLowerCase() + '[' + i + ']');
    };
    const xpath = segs.length ? '/' + segs.join('/').replace(/\[1\]/g, "") : null;
    return xpath
};

function snakeCaseToDashCase(str = "") {
    try {
        return str.trim().split(/(?=[A-Z])/).join('-').toLowerCase();
    } catch {
        return "";
    }
}

function dataSetObjectToString(dataSet = {}) {
    try {
        return Object.entries(dataSet).
            filter(([key]) => !["dcl", "dclId"].includes(key)).
            map(([key, value]) =>
                `data-${snakeCaseToDashCase(key)}="${value}"`).
            join(" ");
    } catch {
        return "";
    }
}

function lookupElementByXPath(path) {
    var evaluator = new XPathEvaluator();
    var result = evaluator.evaluate(path, document.documentElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue;
}

function handleDOMChange(m) {
    for (const dcl of [...document.querySelectorAll("[data-dcl]")].reverse()) {
        const dclId = dcl.dataset.dclId;
        const child = dcl.firstElementChild;
        if (child) {
            child.dataset.dclId = dclId;
            for (const [key, value] of Object.entries(dcl.dataset))
                if (!["dcl", "dclId"].includes(key))
                    child.dataset[key] = value;
            dcl.replaceWith(dcl.firstElementChild)
        }
    }

    let autoFocusedElement = document.querySelector("[data-dcl-autofocus]");

    if (autoFocusedElement) {
        autoFocusedElement.focus();
        delete autoFocusedElement.dataset.dclAutofocus;
    } else {
        const selectedElem = lookupElementByXPath(Component.selectedElement.path);
        if (selectedElem && selectedElem.matches(selectedElementTypes)) {
            selectedElem.focus();
            if (selectedElem.setSelectionRange) selectedElem.setSelectionRange(Component.selectedElement.start, Component.selectedElement.end);
        }
    }
}

var observeDOM = (function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    return function (obj, callback) {
        if (!obj || obj.nodeType !== 1) return;

        if (MutationObserver) {
            // define a new observer
            var mutationObserver = new MutationObserver(callback)

            // have the observer observe foo for changes in children
            mutationObserver.observe(obj, { childList: true, subtree: true })
            return mutationObserver
        }

        // browser support fallback
        else if (window.addEventListener) {
            obj.addEventListener('DOMNodeInserted', callback, false)
            obj.addEventListener('DOMNodeRemoved', callback, false)
        }
    }
})()

observeDOM(document.body, handleDOMChange);

class Component {
    constructor(props = {}) {
        this.props = props;
        this.state = {};
        this.params = props.params || {};
        this.query = props.query || {};
        this.dclName = `dcl-${this.constructor.name.toLowerCase()}`;
        this.dclId = `${this.dclName.substring(4)}_${this._generateUID()}`;
        this._refs = {
            children: [],
            childrenIDs: [],
            childrenIDIndex: 0,
            stateFuncIDs: [],
            stateFuncIDs: [],
            createFuncIDs: [],
            contextFuncs: []
        }

        this._dataSet = dataSetObjectToString(this.props.dataSet || {});

        this.init();
    }

    init() { }

    setTitle(title) {
        document.title = title;
        try {
            document.querySelector(`meta[property="og:title"]`).setAttribute("content", title);
        } catch {
            this.constructor._addMetaTag({ property: "og:title", content: title });
        }
    }
    setDescription(description) {
        try {
            document.querySelector(`meta[name="description"]`).setAttribute("content", description);
        } catch {
            this.constructor._addMetaTag({ name: "description", content: description });
        }
        try {
            document.querySelector(`meta[property="og:description"]`).setAttribute("content", description);
        } catch {
            this.constructor._addMetaTag({ property: "og:description", content: description });
        }
    }

    static _addMetaTag(data) {
        const meta = document.createElement("meta");
        for (const [key, value] of Object.entries(data))
            if (meta[key])
                meta[key] = value;
        document.getElementsByTagName("head")[0].appendChild(meta);
    }

    monitorContext(key, callback, ...args) {
        this._refs.contextFuncs.push([key, callback]);
        this.constructor.onContext(key, callback, this, ...args);
    }

    setState(key, value) {
        const funcID = `stateID_${this.dclId}_${this._generateUID()}`;

        if (!this.rendered) return;
        this.constructor.setStatePool[funcID] = async (event) => {
            const prevStateSignature = JSON.stringify(this.state);
            if (value === undefined) {
                const prevState = JSON.parse(JSON.stringify(this.state));
                const newState = typeof key === "function" ? await key(prevState, event) : key;
                try {
                    if (newState.constructor === Object && prevState.constructor === Object) {
                        this.state = { ...prevState, ...newState }
                    } else {
                        this.state = newState;
                    }
                } catch (err) { }
            } else {
                const prevState = JSON.parse(JSON.stringify(this.state[key] || {}));
                this.state[key] = typeof value === "function" ? await value(prevState, event) : value;
            }
            const newStateSignature = JSON.stringify(this.state);
            if (prevStateSignature !== newStateSignature) {
                setTimeout(async () => {
                    checkForSelectedItem(document.activeElement);
                    this._rerender();
                }, 100)
            }
        }

        this._refs.stateFuncIDs.push(funcID);

        return `DCL.setStatePool.${funcID}(event)`;
    }

    createFunc(func, ...params) {
        const funcID = `funcID_${this.dclId}_${this._generateUID()}`;

        if (!this.rendered) return;

        this.constructor.createFuncPool[funcID] = async (event, ...args) => {
            if (typeof func === "function")
                await func(event, ...args, ...params);
        }

        this._refs.createFuncIDs.push(funcID);

        return `DCL.createFuncPool.${funcID}(event)`;
    }

    async onMount() { }

    async onUnmount() { }

    async mount(parent) {
        this.mounted = true;

        if (!parent) return await this.getHTML();
        await parent._mountChild(this);

        return await this.getHTML();
    }

    async render() {
        return "";
    }

    async getHTML() {
        let view = "";

        this.rendered = true;
        try {
            view = await this.render();
        } catch (err) {
            console.warn("Failed mounting component:", err);
        }

        this.onMount();

        return this._getFragHTML(view);
    }

    async _mountChild(child) {
        const id = child.dclId;
        if (this._refs.children.find(child => child.dclId === id)) {
            await this._unmountChild(id);
        } else {
            this._refs.children.push(child);
        }
    }

    async _unmountChild(id) {
        const index = this._refs.children.findIndex(child => child.dclId === id);

        if (index === -1) return;

        this._refs.children[index].rendered = false;

        await this._refs.children[index]._unmount();


        this._refs.children.splice(index, 1);
    }

    async _unmount(light = false) {
        for (let index = this._refs.children.length - 1; index > -1; index--) {
            await this._unmountChild(this._refs.children[index].dclId);
        }

        for (let i = 0; i < this._refs.stateFuncIDs.length; i++) {
            delete Component.setStatePool[this._refs.stateFuncIDs[i]];
        }
        this._refs.stateFuncIDs.length = 0;

        for (let i = 0; i < this._refs.createFuncIDs.length; i++) {
            delete Component.createFuncPool[this._refs.createFuncIDs[i]];
        }
        this._refs.createFuncIDs.length = 0;

        if (!light) {
            for (let i = 0; i < this._refs.contextFuncs.length; i++) {
                const [key, callback] = this._refs.contextFuncs[i];
                this.constructor.offContext(key, callback, this);
            }
            this._refs.contextFuncs.length = 0;

            await this.onUnmount();

            this.mounted = false;
        }
    }

    _generateUID() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    _getFragHTML(view = "") {
        this._validateDCLX(view);
        return `
<${this.dclName} style="display: none;" data-dcl data-dcl-id="${this.dclId}" ${this._dataSet}>
    ${view}
</${this.dclName}>
        `;
    }

    async _rerender() {
        if (!this.rendered) return;
        try {
            document.querySelector(`[data-dcl-id="${this.dclId}"]`).innerHTML = "";
        } catch { }
        await this._unmount(true);
        try {
            const frag = document.querySelector(`[data-dcl-id="${this.dclId}"]`);
            if (frag) {
                let view = "";
                try {
                    view = await this.render();
                } catch (err) {
                    console.warn("Failed rerendering component: ", err);
                }
                frag.outerHTML = this._getFragHTML(view);
            }
        } catch (err) { }
    }



    _validateDCLX(dclx = "") {
        const frag = document.createElement("div");
        frag.innerHTML = dclx;
        const children = frag.children;
        if (children.length > 1) {
            const childrenRep = [...frag.children].map(val => `    <${val.tagName.toLowerCase()}>...`).join("\n");

            throw `${this.constructor.name} must only return 1 top element. Found ${children.length}:\n<${this.dclName} dcl-id="${this.dclId.substring(this.dclId.indexOf("_") + 1)}">\n${childrenRep}\n<\\${this.dclName}>`;
        }
    }


    static setStatePool = {};
    static createFuncPool = {};
    static params = {};
    static query = {};
    static selectedElement = {
        target: null,
        start: 0,
        end: 0
    };
    static useParams() {
        return this.params;
    }
    static useQuery() {
        return this.query;
    }

    static triggerFunc(funcCall = "", ...args) {
        try {
            const [match, key, funcName] = funcCall.match(/(\w*).(\w*)\(event\)$/);
            this[key] && this[key][funcName] && this[key][funcName](...args);
        } catch { }
    }

    static async triggerAsyncFunc(funcCall = "", ...args) {
        try {
            const [match, key, funcName] = funcCall.match(/(\w*).(\w*)\(event\)$/);
            this[key] && this[key][funcName] && await this[key][funcName](...args);
        } catch { }
    }

    static autoFocus = "data-dcl-autofocus";
    static eventBus = {};
    static navigateTo(url) {
        this.emitEvent("navigateTo", url);
    }
    static ignoreRoute() {
        this.emitEvent("ignoreRoute");
    }

    static onEvent(event, callback) {
        if (!Array.isArray(this.eventBus[event])) {
            this.eventBus[event] = [];
        }
        this.eventBus[event].push(callback);
    }
    static emitEvent(event, ...args) {
        if (!this.eventBus[event]) return;

        this.eventBus[event].forEach((callback) => callback(...args));
    }
    static offEvent(event, callback) {
        if (!Array.isArray(this.eventBus[event])) return;

        const index = this.eventBus[event].indexOf(callback);
        if (index != -1) {
            this.eventBus[event].splice(index, 1);
        }
    }

    static _confirmNavigate() {
        const eventName = "beforeNavigate";
        if (!this.eventBus[eventName]) return false;

        let confirmNavigate = false;
        const event = {
            preventDefault() {
                confirmNavigate = true;
            }
        }
        try {
            const beforeNavigateEvents = this.eventBus[eventName];
            for (let i = 0; i < beforeNavigateEvents.length; i++) {
                const callback = beforeNavigateEvents[i];
                callback(event);
                if (confirmNavigate || event.returnValue) return true;
            }
            return false;
        } catch (err) {
            console.warn("Error confirming navigate", err)
            return false;
        }
    }


    static context = {};
    static contextBus = {};
    static onContext(key, callback, target, ...args) {
        if (!Array.isArray(this.contextBus[key])) {
            this.contextBus[key] = [];
        }
        this.contextBus[key].push([callback, target, ...args]);

        const value = this.context[key];
        callback(value, ...args);
        try {
            target._rerender();
        } catch { }
    }
    static offContext(key, callback, target) {
        if (!Array.isArray(this.contextBus[key])) return;

        const index = this.contextBus[key].findIndex(item => {
            return item[0] === callback && item[1] === target;
        });
        if (index != -1) {
            this.contextBus[key].splice(index, 1);
        }
    }
    static getContext(key) {
        return this.context[key];
    }
    static setContext(key, value) {
        if (JSON.stringify(value) === JSON.stringify(this.context[key])) return;
        if (value === undefined)
            delete this.context[key];
        else
            this.context[key] = value;

        if (!this.contextBus[key]) return value;

        this.contextBus[key].forEach(([callback, target, ...args]) => {
            callback(value, ...args);
            try {
                target._rerender();
            } catch { }
        });

        return value;
    }
    static clearContext(key) {
        delete this.context[key];

        if (!this.contextBus[key]) return;

        this.contextBus[key].forEach(([callback, target, ...args]) => {
            callback(undefined, ...args);
            try {
                target._rerender();
            } catch { }
        });
    }

}

window.DCL = Component;

export default Component;
export let getContext = Component.getContext.bind(Component);
export let setContext = Component.setContext.bind(Component);
export let clearContext = Component.clearContext.bind(Component);
export let onEvent = Component.onEvent.bind(Component);
export let offEvent = Component.offEvent.bind(Component);
export let emitEvent = Component.emitEvent.bind(Component);
export let navigateTo = Component.navigateTo.bind(Component);
export let ignoreRoute = Component.ignoreRoute.bind(Component);
export let useParams = Component.useParams.bind(Component);
export let useQuery = Component.useQuery.bind(Component);
export let triggerFunc = Component.triggerFunc.bind(Component);
export let triggerAsyncFunc = Component.triggerAsyncFunc.bind(Component);