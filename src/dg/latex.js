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

function splitSubscript(str) {
    if (!str)
        return [];
    
    const m = normalizeBraces(str).match(/^([\w'()]+)(_{([\w{}]+)})?([\w'()]+)?$/);
    if (!m)
        return str;

    let result = {text: m[1]};
    if (m[3])
        result.subscript = m[3];
    if (m[4])
        result.rest = m[4];

    return result;
}

export { normalizeBraces, laTeX2HTML, removeLaTeX, splitSubscript };
