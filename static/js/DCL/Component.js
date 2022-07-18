// import setImmediate from "./setImmediate.js"



document.body.addEventListener('click', async evt => {
    console.log(
        checkForSelectedItem(evt.target)
    )
});

const selectedElementTypes = `textarea, input[type="text"]`;
function checkForSelectedItem(target) {
    const elem = createXPathFromElement(target);
    if (target && target.matches(selectedElementTypes)) {
        // if (["textarea", "input"].includes(target && target.tagName.toLowerCase())) {
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
    console.log(elem)
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

    const selectedElem = lookupElementByXPath(Component.selectedElement.path);
    if (selectedElem && selectedElem.matches(selectedElementTypes)) {
        selectedElem.focus();
        if (selectedElem.setSelectionRange) selectedElem.setSelectionRange(Component.selectedElement.start, Component.selectedElement.end);
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

    init() {
    }

    setTitle(title) {
        document.title = title;
    }

    monitorContext(key, callback, ...args) {
        this._refs.contextFuncs.push([key, callback]);
        this.constructor.onContext(key, callback, this, ...args);
    }

    setState(key, state) {
        const funcID = `stateID_${this.dclId}_${this._generateUID()}`;

        if (!this.rendered) return;
        this.constructor.setStatePool[funcID] = async (event) => {
            const prevStateSignature = JSON.stringify(this.state);
            if (state === undefined) {
                const prevState = JSON.parse(JSON.stringify(this.state));
                const newState = typeof key === "function" ? await key(prevState, event) : key;
                try {
                    if (newState.constructor === Object && prevState.constructor === Object) {
                        this.state = { ...prevState, ...newState }
                    } else {
                        this.state = newState;
                    }
                } catch (e) { }
            } else {
                const prevState = JSON.parse(JSON.stringify(this.state[key]));
                this.state[key] = typeof state === "function" ? await state(prevState, event) : state;
            }
            const newStateSignature = JSON.stringify(this.state);
            if (prevStateSignature !== newStateSignature)
                setTimeout(async () => {
                    checkForSelectedItem(document.activeElement);
                    this._rerender();
                }, 100)
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

    async onMount() {

    }

    async onUnmount() {

    }

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
        } catch (e) {
            console.warn("Failed mounting component:", e);
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
                } catch (e) {
                    console.warn("Failed rerendering component: ", e);
                }
                frag.outerHTML = this._getFragHTML(view);
            }
        } catch (e) { }
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
    static selectedElement = {
        target: null,
        start: 0,
        end: 0
    };
    static useParams() {
        return this.params;
    }

    static triggerFunc(funcCall = "", ...args) {
        try {
            const [match, key, funcName] = funcCall.match(/(\w*).(\w*)\(event\)$/);
            this[key] && this[key][funcName] && this[key][funcName](...args);
        } catch { }
    }

    static eventBus = {};
    static navigateTo(url) {
        this.emitEvent("navigateTo", url);
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


    static context = {};
    static contextBus = {};
    static onContext(key, callback, target, ...args) {
        if (!Array.isArray(this.contextBus[key])) {
            this.contextBus[key] = [];
        }
        this.contextBus[key].push([callback, target, ...args]);
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
    static setContext(key, value) {
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
    static getContext(key) {
        return this.context[key];
    }

}

window.DCL = Component;

export default Component;
export let setContext = Component.setContext.bind(Component);
export let getContext = Component.getContext.bind(Component);
export let monitorContext = Component.monitorContext.bind(Component);
export let onEvent = Component.onEvent.bind(Component);
export let offEvent = Component.offEvent.bind(Component);
export let emitEvent = Component.emitEvent.bind(Component);
export let navigateTo = Component.navigateTo.bind(Component);
export let useParams = Component.useParams.bind(Component);
export let triggerFunc = Component.triggerFunc.bind(Component);