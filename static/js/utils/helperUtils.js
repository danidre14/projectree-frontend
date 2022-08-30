const helperUtils = {
    makeString(string = "") {
        try {
            return ("" + string).trim();
        } catch {
            return "";
        }
    },
    isValidUrl(url = "") {
        if (!url) return true;
        try {
            return !!new URL(url);
        } catch {
            return false
        }
    }
}

export default helperUtils;
export let makeString = helperUtils.makeString;
export let isValidPassword = helperUtils.isValidPassword;
export let isValidUrl = helperUtils.isValidUrl;