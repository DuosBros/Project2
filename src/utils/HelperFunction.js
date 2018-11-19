import _ from 'lodash';

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

export const isNum = (value) => {
    if (value === null || value === undefined) {
        return false;
    }
    const valueString = value.toString();

    const length = valueString.length;
    var isNum = /^\d+$/.test(valueString);

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

function compareObjects(o1, o2) {
    var k = '';
    for (k in o1) if (o1[k] !== o2[k]) return false;
    for (k in o2) if (o1[k] !== o2[k]) return false;
    return true;
}

function itemExists(haystack, needle) {
    for (var i = 0; i < haystack.length; i++) if (compareObjects(haystack[i], needle)) return true;
    return false;
}

export const filterInArrayOfObjects = (toSearch, array) => {
    var results = [];
    toSearch = trimString(toSearch); // trim it
    for (var i = 0; i < array.length; i++) {
        Object.keys(array[i]).map((key, index) => {
            if (array[i][key]) { // fuken lodash returning isEmpty true for numbers
                if (array[i][key].toString().toLowerCase().indexOf(toSearch.toString().toLowerCase()) !== -1) {
                    if (!itemExists(results, array[i])) results.push(array[i]);
                }
            }
        })
    }
    return results;
}

export const isAdmin = (user) => {
    if(user.IsLocoAdmin === true) {
        return true
    }

    return false;
}