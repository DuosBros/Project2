import moment from 'moment'

export const mapDataForMinMaxAvgChart = (data) => {
    return data.map(e => ({
        name: moment(e.ts).format("HH:mm"),
        "Min-Max": [+e.min.toFixed(2), +e.max.toFixed(2)],
        avg: + e.avg.toFixed(2)
    }))
}

export const getUniqueValuesOfKey = (array, key) => {
    return array.reduce((carry, item) => {
        if (item[key] && !~carry.indexOf(item[key])) carry.push(item[key]);
        return carry;
    }, []);
}

export const mapDataForGenericChart = (data, key, filter, filterZeroCount) => {
    var grouped = groupBy(data, key);
    var keys = Object.keys(grouped);

    if (filter) {
        if (key === Object.keys(filter)[0]) {
            keys = keys.filter(y => y.search(filter[Object.keys(filter)[0]], "i") >= 0)
        }
    }
    var mapped = keys.map(x => {
        var count = grouped[x].length

        if (filterZeroCount) {
            if (filter) {
                if (count !== 0 && grouped[x].filter(y =>
                    y[Object.keys(filter)[0]].toString().search(filter[Object.keys(filter)[0]], "i") >= 0)) {
                    return ({
                        name: x && x !== "null" ? x : "Unknown",
                        count: grouped[x].filter(y =>
                            y[Object.keys(filter)[0]].toString().search(filter[Object.keys(filter)[0]], "i") >= 0).length
                    })
                }
            }
            else {
                if (count !== 0) {
                    return ({
                        name: x && x !== "null" ? x : "Unknown",
                        count: count
                    })
                }
            }

        }
        else {
            return ({
                name: x && x !== "null" ? x : "Unknown",
                count: filter ? grouped[x].filter(y =>
                    y[Object.keys(filter)[0]].toString().search(filter[Object.keys(filter)[0]], "i") >= 0).length : count
            })
        }
    })

    return mapped.filter(x => x).sort((a, b) => b.count - a.count)
}

export const mapDataForStackedGenericBarChart = (data, key, categories, property, filter) => {
    var grouped = groupBy(data, key);
    var keys = Object.keys(grouped);

    if (filter) {
        if (key === Object.keys(filter)[0]) {
            keys = keys.filter(y => y.search(filter[Object.keys(filter)[0]], "i") >= 0)
        }
    }
    var mapped = keys.map(x => {
        var count = grouped[x].length

        if (filter) {
            if (count !== 0 && grouped[x].filter(y =>
                y[Object.keys(filter)[0]].toString().search(filter[Object.keys(filter)[0]], "i") >= 0)) {

                var result = {
                    name: x && x !== "null" ? x : "Unknown"
                }

                categories.forEach((z, i) => {
                    result[z] = grouped[x].filter(y =>
                        y[Object.keys(filter)[0]].toString().search(filter[Object.keys(filter)[0]], "i") >= 0
                        && y[property] === z).length
                })

                return result;
            }
        }
        else {
            if (count !== 0) {
                var result = {
                    name: x && x !== "null" ? x : "Unknown"
                }

                categories.forEach((z, i) => {
                    result[z] = grouped[x].filter(y => y[property] === z).length
                })

                return result;
            }
        }

    })

    return mapped;
}

export const pick = (array, keys) => {
    return array.map(x => {
        return keys.map(k => k in x ? { [k]: x[k] } : {})
            .reduce((res, o) => Object.assign(res, o), {})
    })
}

export const exportToJsonFile = (data) => {
    let dataStr = JSON.stringify(data);
    return ('data:application/json;charset=utf-8,' + encodeURIComponent(dataStr));
}

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

export const promiseMap = function (n, arr, transformer, ignoreErrors) {
    var res = new Array(arr.length);
    var last = 0;
    var tranformOrFinish = function (runner, idx) {
        if (idx >= arr.length) {
            return res;
        }
        return Promise.resolve(transformer(arr[idx], idx))
            .then((ret) => {
                res[idx] = ret;
                return tranformOrFinish(runner, last++);
            }, (err) => {
                if (ignoreErrors === false) {
                    last = arr.length;
                    throw err;
                }
                res[idx] = err;
                return tranformOrFinish(runner, last++);
            });
    };

    var tasks = [];
    for (let i = 0; i < n && i < arr.length; i++) {
        tasks.push(tranformOrFinish(i, last++));
    }

    return Promise.all(tasks)
        .then(() => res);
};
