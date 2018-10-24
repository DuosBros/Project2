export const isNum = (value) => {
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