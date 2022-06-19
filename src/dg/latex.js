function fixpointReplace(str, re, replacement) {
    while(true) {
        const newStr = str.replace(re, replacement);
        if (newStr == str)
            return str;
        str = newStr;
    }
}

function normalizeBraces(str) {
    return str ? fixpointReplace(str, /([\w'()]+)_(\w)/g, '$1_{$2}') : "";
}

function laTeX2HTML(str) {
    return str ? fixpointReplace(normalizeBraces(str), /([\w'()]+)_{([\w<>/]+)}/g, '$1<sub>$2</sub>') : "";
}

function removeLaTeX(str) {
    return str ? fixpointReplace(normalizeBraces(str), /([\w'()]+)_{(\w+)}/g, '$1$2') : "";
}

function splitSubscript(str) {
    if (!str)
        return {};

    str = normalizeBraces(str);

    let i = 0;
    while (i < str.length && str[i] != "_")
        i++;
    let result = {text: str.substring(0, i)};
    i++;
    let braces = 0;
    const subscriptStart = i + 1;
    while (i < str.length) {
        if (str[i] == '{')
            braces++;
        if (str[i] == '}')
            braces--;
        if (braces == 0) {
            const subscriptEnd = i - 1;
            result.subscript = str.substring(subscriptStart, subscriptEnd + 1);
            if (i + 1 < str.length)
                result.rest = str.substring(i+1);
            return result;
        }
        i++;
    }
    return result;
}

export { normalizeBraces, laTeX2HTML, removeLaTeX, splitSubscript };
