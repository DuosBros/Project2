import moment from 'moment'

export const mapDataForMinMaxAvgChart = (data) => {
    return data.map(e => ({
        name: moment(e.ts).format("HH:mm"),
        "Min-Max": [+e.min.toFixed(2), +e.max.toFixed(2)],
        avg: + e.avg.toFixed(2)
    }))
}

export const axiosHandler = function (a) {
    // TODO set error field on error handler
    return a.then(
        response => ({ success: true, data: response.data }),
        response => ({ success: false, response: response })
    );
};

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
        let result;
        if (filterZeroCount) {
            if (filter) {
                if (count !== 0 && grouped[x].filter(y =>
                    y[Object.keys(filter)[0]].toString().search(filter[Object.keys(filter)[0]], "i") >= 0)) {
                    result = ({
                        name: x && x !== "null" ? x : "Unknown",
                        count: grouped[x].filter(y =>
                            y[Object.keys(filter)[0]].toString().search(filter[Object.keys(filter)[0]], "i") >= 0).length
                    })
                }
            }
            else {
                if (count !== 0) {
                    result = ({
                        name: x && x !== "null" ? x : "Unknown",
                        count: count
                    })
                }
            }

        }
        else {
            result = ({
                name: x && x !== "null" ? x : "Unknown",
                count: filter ? grouped[x].filter(y =>
                    y[Object.keys(filter)[0]].toString().search(filter[Object.keys(filter)[0]], "i") >= 0).length : count
            })
        }

        return result;
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
        let result;
        var count = grouped[x].length

        if (filter) {
            if (count !== 0 && grouped[x].filter(y =>
                y[Object.keys(filter)[0]].toString().search(filter[Object.keys(filter)[0]], "i") >= 0)) {

                result = {
                    name: x && x !== "null" ? x : "Unknown"
                }

                categories.forEach(z => {
                    result[z] = grouped[x].filter(y =>
                        y[Object.keys(filter)[0]].toString().search(filter[Object.keys(filter)[0]], "i") >= 0
                        && y[property] === z).length
                })


            }
        }
        else {
            if (count !== 0) {
                result = {
                    name: x && x !== "null" ? x : "Unknown"
                }

                categories.forEach(z => {
                    result[z] = grouped[x].filter(y => y[property] === z).length
                })
            }
        }

        return result;
    })

    return mapped;
}

export const pick = (array, keys) => {
    return array.map(x => {
        return keys.map(k => k in x ? { [k]: x[k] } : {})
            .reduce((res, o) => Object.assign(res, o), {})
    })
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
                    return "orange"
                case "disabled-by-parent":
                    return "red";
                case "enabled":
                    return "orange"
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

/*
 * "keys" (optional) Specifies which properties of objects should be inspected.
 *                   If omitted, all properties will be inspected.
 */
export const filterInArrayOfObjects = (filter, array, keys) => {
    return array.filter(element => {
        let objk = keys ? keys : Object.keys(element);
        for (let key of objk) {
            if (element[key] !== undefined &&
                element[key] !== null &&
                filter(element[key])
            ) { // fuken lodash returning isEmpty true for numbers
                return true;
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

export const isUser = (user) => {
    if (user.IsLocoUser === true) {
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

export const convertToCSV = (array) => {
    if (!array) return;
    if (!array[0]) return;

    var str = '';
    var keys = Object.keys(array[0])
    str = keys.join(',') + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line !== '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}
