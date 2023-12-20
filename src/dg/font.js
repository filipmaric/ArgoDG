const ctx = document.createElement("canvas").getContext("2d");

export function splitFont(font) {
    const m = font.match(/^(\d+)(\w+)\s+((\w|\s)+)$/)
    const size = parseInt(m[1]);
    const units = m[2];
    const family = m[3];
    return [size, units, family];
}

export function reduceFont(font, percent) {
    percent = percent || 0.75;
    const [size, units, family] = splitFont(font);
    return Math.ceil(percent*size) + units + " " + family;
}

export function textWidth(txt, font) {
    ctx.font = font;
    const metrics = ctx.measureText(txt);
    const width = metrics.width;
    return width;
}
