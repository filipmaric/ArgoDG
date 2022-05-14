function normalizeBraces(str) {
    return str ? str.replace(/([\w'()]+)_(\w)/g, '$1_{$2}') : "";
}

function laTeX2HTML(str) {
    return str ? normalizeBraces(str).replace(/([\w'()]+)_{(\w+)}/g, '$1<sub>$2</sub>') : "";
}

function removeLaTeX(str) {
    return str ? normalizeBraces(str).replace(/([\w'()]+)_{(\w+)}/g, '$1$2') : "";
}

export { normalizeBraces, laTeX2HTML, removeLaTeX };
