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
