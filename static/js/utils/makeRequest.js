// to send fetch requests directly to the server without specifying host url all the time
// to accept/send content-type application/json by default and return json response by default

/*
planned syntax:
req.get("/relative_path", params);

*/

import { getContext, setContext, clearContext, navigateTo } from "../DCL/core.js";


// const baseUrl = "https://projectree-app.herokuapp.com/api/v1";
const baseUrl = window.SERVER_URL || "http://127.0.0.1:3000/api/v1";

const fetchBus = {};
function addKeyToFetchBus(key) {
    if (!Array.isArray(fetchBus[key])) {
        const internalController = new AbortController();
        fetchBus[key] = [1, internalController];
    } else {
        fetchBus[key][0]++;
    }

    return fetchBus[key][1];
}
function removeControllerFromFetchBus(controllers) {
    for (const controller of controllers) {
        for (const [key, value] of Object.entries(fetchBus)) {
            if (value[1] === controller) {
                removeKeyFromBus(key);
                break;
            }
        }
    }
}
function removeKeyFromBus(key) {
    if (Array.isArray(fetchBus[key])) {
        fetchBus[key][0]--;
        if (fetchBus[key][0] <= 0)
            delete fetchBus[key];
    }
}
function abortRequestByKey(...keys) {
    for (const key of keys)
        if (Array.isArray(fetchBus[key]))
            if (fetchBus[key][1].abort) {
                fetchBus[key][1].abort("internalCancel");
                delete fetchBus[key];
            }
}

const req = (url, data = {}, externalHeaders = {}, externalSignals = [], method = "GET") => {
    if (!externalHeaders) externalHeaders = {};
    return new Promise((res, rej) => {
        const externalSignalsType = (typeof externalSignals === "string") ? "string" :
            ((externalSignals instanceof Array || Array.isArray(externalSignals)) ? "array" : "controller");

        const internalControllers = [];
        if (externalSignalsType === "string") {
            internalControllers.push(addKeyToFetchBus(externalSignals));
            externalSignals = [];
        } else if (externalSignalsType === "array") {
            for (const key of externalSignals.filter(elem => typeof elem === "string"))
                internalControllers.push(addKeyToFetchBus(key));
            externalSignals = externalSignals.filter(elem => typeof elem !== "string");
        } else {
            externalSignals = [externalSignals];
        }

        const internalSignals = internalControllers.map(elem => elem.signal);

        const multiSignal = anySignal([...externalSignals, ...internalSignals], () =>
            removeControllerFromFetchBus(internalControllers));

        let internalCancel = false;
        let internalReason = "AbortError";
        const internalOnAbort = (err) => {
            const reason = err.reason ? err.reason : (err.target && err.target.reason || "AbortError");
            if (reason === "internalCancel") {
                internalCancel = true;
            }
            internalReason = reason;
        }
        multiSignal.addEventListener("abort", internalOnAbort);
        const isGet = method === "GET";
        const options = {
            method,
            credentials: "include",
            headers: {
                "Content-Type": isGet ? "application/x-www-form-urlencoded" : "application/json",
                ...externalHeaders
            },
            signal: multiSignal
        };
        if (isGet) {
            if ((new URLSearchParams(data)).toString())
                url += "?" + (new URLSearchParams(data)).toString();
        } else {
            options.body = JSON.stringify(data);
        }
        fetch(url, options)
            .then(data => data.json())
            .then((reply) => {
                removeControllerFromFetchBus(internalControllers);
                multiSignal.removeEventListener("abort", internalOnAbort);

                res(reply);
                if (reply.lightReroute) {
                    return navigateTo(reply.lightReroute);
                }
                if (reply.hardReroute) {
                    navigateTo(reply.hardReroute);
                    document.location.reload();
                    return;
                }
            })
            .catch((err) => {
                removeControllerFromFetchBus(internalControllers);
                multiSignal.removeEventListener("abort", internalOnAbort);
                if (!internalCancel) {
                    if (err.name == "AbortError")
                        err.reason = internalReason;

                    if (err.message && err.message.includes("Failed to fetch")) {
                        signOut(true);
                        console.warn({ err });
                    }
                    rej(err);
                }
            });
    });
}
function anySignal(signals, externalOnAbort) {
    const controller = new AbortController();

    function onAbort(err) {
        const reason = err.reason ? err.reason : (err.target && err.target.reason || "AbortError");
        controller.abort(reason);

        // Cleanup
        for (const signal of signals) {
            signal.removeEventListener("abort", onAbort);
        }

        if (typeof externalOnAbort === "function")
            externalOnAbort();
    }

    for (const signal of signals) {
        if (signal.aborted) {
            onAbort(signal.reason);
            return signal;
        }
        signal.addEventListener("abort", onAbort);
    }

    return controller.signal;
}

function signOut(notify = false) {
    clearContext("user");
    if (!notify) return;
    alert("You have been signed out.");
    navigateTo("/");
}

function signIn(user, redirect = false) {
    setContext("user", user);
    if (!redirect) return;
    const successLink = getContext("signInReferrer") || "/dashboard";
    clearContext("signInReferrer");
    navigateTo(successLink);
}

req.get = (path, params, headers, signal) => req(baseUrl + path, params, headers, signal, "GET");
req.post = (path, params, headers, signal) => req(baseUrl + path, params, headers, signal, "POST");
req.put = (path, params, headers, signal) => req(baseUrl + path, params, headers, signal, "PUT");
req.patch = (path, params, headers, signal) => req(baseUrl + path, params, headers, signal, "PATCH");
req.del = (path, params, headers, signal) => req(baseUrl + path, params, headers, signal, "DELETE");
req.cancel = (key) => abortRequestByKey(key);

window.signout = signOut

export default req;
export let get = req.get;
export let post = req.post;
export let put = req.put;
export let patch = req.patch;
export let del = req.del;
export let cancel = req.cancel;
export let signout = signOut;
export let signin = signIn;