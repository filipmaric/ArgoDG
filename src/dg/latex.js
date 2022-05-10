function laTeX2HTML(str) {
    return str ? str.replace(/([\w'()]+)_{(\w+)}/g, '$1<sub>$2</sub>') : "";
}

function removeLaTeX(str) {
    return str ? str.replace(/([\w'()]+)_{(\w+)}/g, '$1$2') : "";
}

export { laTeX2HTML, removeLaTeX };
