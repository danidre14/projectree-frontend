const helperUtils = {
    makeString(string = "") {
        try {
            return ("" + string).trim();
        } catch {
            return "";
        }
    },
    isValidPassword(password = "") {
        return password.match(/^[\w ]{4,}$/g) !== null;
    }
}

export default helperUtils;
export let makeString = helperUtils.makeString;
export let isValidPassword = helperUtils.isValidPassword;