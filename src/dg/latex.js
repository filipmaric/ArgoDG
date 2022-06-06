function fixpointReplace(str, re, replacement) {
    while(true) {
        const newStr = str.replaceAll(re, replacement);
        if (newStr == str)
            return str;
        str = newStr;
    }
}

function normalizeBraces(str) {
    return str ? str.replace(/([\w'()]+)_(\w)/g, '$1_{$2}') : "";
}

function laTeX2HTML(str) {
    return str ? fixpointReplace(normalizeBraces(str), /([\w'()]+)_{([\w<>/]+)}/g, '$1<sub>$2</sub>') : "";
}

function removeLaTeX(str) {
    return str ? fixpointReplace(normalizeBraces(str), /([\w'()]+)_{(\w+)}/g, '$1$2') : "";
}

export { normalizeBraces, laTeX2HTML, removeLaTeX };
