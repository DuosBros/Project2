
export const groupBy = (items, key) => items.reduce(
    (result, item) => ({
        ...result,
        [item[key]]: [
            ...(result[item[key]] || []),
            item,
        ],
    }),
    {},
);

const REGEX_DIGITS = /^\d+$/;
export const isNum = (value) => {
    if (value === null || value === undefined) {
        return false;
    }
    const valueString = value.toString();

    const length = valueString.length;
    var isNum = REGEX_DIGITS.test(valueString);

    if (length > 0 && isNum) {
        return true;
    }
    else {
        return false;
    }
}

const REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
export const isValidIPv4 = (value) => {
    if (value === null || value === undefined) {
        return false;
    }
    const valueString = value.toString();

    const length = valueString.length;
    var isNum = REGEX.test(valueString);

    if (length > 0 && isNum) {
        return true;
    }
    else {
        return false;
    }
}

export const getServerState = (id) => {
    switch (id) {
        case 1:
            return "online";
        case 2:
            return "offline";
        case 3:
            return "unknown";
        case 4:
            return "not reachable";
        default:
            return ""
    }
}

export const getDismeState = (state) => {
    if (state) {
        return "active"
    }
    else {
        return "not active"
    }
}

export const getAvailabiltyAndEnabledState = (availabilityState, enabledState) => {
    switch (availabilityState) {
        case "available":
            switch (enabledState) {
                case "disabled":
                    return "red";
                case "disabled-by-parent":
                    return "red";
                case "enabled":
                    return "green";
                default:
                    return "grey"
            }
        case "offline":
            switch (enabledState) {
                case "disabled":
                    return "red"
                case "disabled-by-parent":
                    return "red";
                case "enabled":
                    return "red"
                default:
                    return "grey"
            }
        case "unknown":
            switch (enabledState) {
                case "disabled":
                    return "red"
                case "enabled":
                    return "blue"
                default:
                    return "grey"
            }
        default:
            return "grey"
    }
}



export const debounce = (fn, time) => {
    let timeout;

    return function () {
        const functionCall = () => fn.apply(this, arguments);

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    }
}

function trimString(s) {
    var l = 0, r = s.length - 1;
    while (l < s.length && s[l] === ' ') l++;
    while (r > l && s[r] === ' ') r -= 1;
    return s.substring(l, r + 1);
}

/*
 * "keys" (optional) Specifies which properties of objects should be inspected.
 *                   If omitted, all properties will be inspected.
 */
export const filterInArrayOfObjects = (toSearch, array, keys) => {
    toSearch = trimString(toSearch); // trim it
    return array.filter(element => {
        let objk = keys ? keys : Object.keys(element);
        for (let key of objk) {
            if (element[key]) { // fuken lodash returning isEmpty true for numbers
                if (element[key].toString().toLowerCase().indexOf(toSearch.toString().toLowerCase()) !== -1) {
                    return true
                }
            }
        }
        return false;
    });
}

export const isAdmin = (user) => {
    if (user.IsLocoAdmin === true) {
        return true
    }

    return false;
}

export const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
