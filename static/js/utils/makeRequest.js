// to send fetch requests directly to the server without specifying host url all the time
// to accept/send content-type application/json by default and return json response by default

/*
planned syntax:
req.get("/relative_path", params);



*/

const baseUrl = "https://projectree-app.herokuapp.com/api/v1"; // "http://localhost:5000/api/v1/";

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
        const internalOnAbort = (e) => {
            const reason = e.reason ? e.reason : (e.target && e.target.reason || "AbortError");
            if (reason === "internalCancel") {
                internalCancel = true;
            }
            internalReason = reason;
        }
        multiSignal.addEventListener("abort", internalOnAbort);
        const isGet = method === "GET";
        const user = localStorage.getItem("user");
        const token = user? JSON.parse(user).token : undefined;
        const options = {
            method,
            headers: {
                "Content-Type": isGet ? "application/x-www-form-urlencoded" : "application/json",
                ...externalHeaders
            },
            signal: multiSignal
        };
        if (isGet) {
            url += "?" + (new URLSearchParams(data)).toString();
        } else {
            options.body = JSON.stringify(data);
        }
        if(token) {
            options.headers["Authorization"] = `Basic ${token}`;
        }
        fetch(url, options)
            .then(response => response.json())
            .then((msg) => {
                removeControllerFromFetchBus(internalControllers);
                multiSignal.removeEventListener("abort", internalOnAbort);
                res(msg);
            })
            .catch((err) => {
                removeControllerFromFetchBus(internalControllers);
                multiSignal.removeEventListener("abort", internalOnAbort);
                if (!internalCancel) {
                    if (err.name == "AbortError")
                        err.reason = internalReason;
                    rej(err);
                }
            });
    });
}
function anySignal(signals, externalOnAbort) {
    const controller = new AbortController();

    function onAbort(e) {
        const reason = e.reason ? e.reason : (e.target && e.target.reason || "AbortError");
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
req.get = (path, params, headers, signal) => req(baseUrl + path, params, headers, signal, "GET");
req.post = (path, params, headers, signal) => req(baseUrl + path, params, headers, signal, "POST");
req.put = (path, params, headers, signal) => req(baseUrl + path, params, headers, signal, "PUT");
req.patch = (path, params, headers, signal) => req(baseUrl + path, params, headers, signal, "PATCH");
req.del = (path, params, headers, signal) => req(baseUrl + path, params, headers, signal, "DELETE");
req.cancel = (key) => abortRequestByKey(key);


export default req;
export let get = req.get;
export let post = req.post;
export let put = req.put;
export let patch = req.patch;
export let del = req.del;
export let cancel = req.cancel;