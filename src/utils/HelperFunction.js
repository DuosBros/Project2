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
    switch(id) {
        case 1:
            return "SUCCESS";
        case 2:
            return "DANGER";
        case 3:
            return "DEFAULT";
        case 4:
            return "WARNING";
        default:
            return ""
    }
}
