const ctx = document.createElement("canvas").getContext("2d");

// convert color in any format to rgb
export function rgbColor(str){
    function hexToRGB(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function parseRGB(str) {
        const m = str.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*(\d+([.]\d*)?))?\s*\)$/i);
        return m ? {
            r: m[1],
            g: m[2],
            b: m[3]
        } : null;
    }
    
    ctx.fillStyle = str;
    const color = ctx.fillStyle;
    if (color[0] == '#')
        return hexToRGB(color);
    else
        return parseRGB(color);
}
