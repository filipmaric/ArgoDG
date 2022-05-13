import { laTeX2HTML } from './latex.js';
import { opacity } from './colors.js';

// -----------------------------------------------------------------------------
// encapsulate drawing canvas with a few basic drawing primitives
// -----------------------------------------------------------------------------
class Canvas {
    constructor(element, options) {
        if (typeof element == "string")
            element = document.getElementById(element);

        if (element instanceof HTMLCanvasElement) {
            this._canvas = element;
            this._container = document.createElement("div");
            this._canvas.parentNode.replaceChild(this._container, this._canvas);
            this._container.append(this._canvas);
            this._container.style.width = "500px";
            const h1 = document.getElementsByTagName("h1")[0];
            h1.style.textAlign = "center";
            h1.style.marginTop = "45px";
        } else {
            this._container = element;
            this._canvas = document.createElement("canvas");
            this._container.append(this._canvas);
            this._canvas.width = this._container.width;
            this._canvas.height = this._container.height;
        }

        this._container.style.marginLeft = "auto";
        this._container.style.marginRight = "auto";

        const ratio = window.devicePixelRatio;
        
        if (options.width) {
            this._canvas.width = options.width * ratio;
            this._canvas.style.width = options.width + "px";
        }

        if (options.height) {
            this._canvas.height = options.height * ratio;
            this._canvas.style.height = options.height + "px";
        }

        this._canvas.getContext("2d").scale(ratio, ratio);
        
        if (options.border)
            this._canvas.style.border = options.border;

        this._defaultColor = "black";
        this._defaultWidth = 1;
        this._defaultDash = [];

        // add status line paragraph
        const p = document.createElement("p");;
        this._p_status = p;
        const divContainer = document.createElement("div");
        this._canvas.parentNode.replaceChild(divContainer, this._canvas);
        divContainer.style.position = "relative";
        divContainer.append(this._canvas);
        divContainer.append(p);
        p.style.position = "absolute";
        p.style.top = "0px";
        p.style.left = "0px";
        p.style.margin = "5px";
        p.style.backgroundColor = "white";
    }

    canvas() {
        return this._canvas;
    }
    
    container() {
        return this._container;
    }

    addEventListener(event, fun) {
        this._canvas.addEventListener(event, fun);
    }

    width() {
        const ratio = window.devicePixelRatio;
        return this._canvas.width / ratio;
    }

    height() {
        const ratio = window.devicePixelRatio;
        return this._canvas.height / ratio;
    }

    context() {
        return this._canvas.getContext("2d");
    }

    clear() {
        const ctx = this.context();
        ctx.clearRect(0, 0, this.width(), this.height());
    }

    arc(x, y, r, angle_from, angle_to, color, width, dash, fill) {
        color = color || this._defaultColor;
        width = width || this._defaultWidth;
        dash = dash || this._defaultDash;
        if (fill === undefined)
            fill = false;
        
        const ctx = this.context();
        ctx.lineWidth = width;
        ctx.setLineDash(dash);
        ctx.beginPath();
        ctx.arc(x, y, r, angle_from, angle_to, true);
        if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
            const o = opacity(color)
            if (!o)
                ctx.strokeStyle = "black";
            else
                ctx.strokeStyle = "rgba(0, 0, 0, " + o + ")";
            ctx.stroke();
        } else {
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    }
    
    circle(x, y, r, color, width, dash, fill) {
        this.arc(x, y, r, 0, 2*Math.PI, color, width, dash, fill);
    }

    segment(x1, y1, x2, y2, color, width, dash) {
        color = color || this._defaultColor;
        width = width || this._defaultWidth;
        dash = dash || this._defaultDash;
        const ctx = this.context();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.setLineDash(dash);
        ctx.stroke();
    }

    line_endpoints(x1, y1, x2, y2) {
        const [w, h] = [this.width(), this.height()];

        if (x1 == x2)
            return [x1, 0, x1, h];
        else if (y1 == y2)
            return [0, y1, w, y1];
        else {
            let result = []

            function point(t) {
                const x = x1 + t * (x2 - x1);
                const y = y1 + t * (y2 - y1);
                return [x, y];
            }

            let t, x, y;
            
            t = (0 - x1) / (x2 - x1);
            [x, y] = point(t);

            if (0 <= y && y <= h)
                result.push.apply(result, [x, y]);

            t = (w - x1) / (x2 - x1);
            [x, y] = point(t);

            if (0 <= y && y <= h)
                result.push.apply(result, [x, y]);

            if (result.length == 4)
                return result;

            t = (0 - y1) / (y2 - y1);
            [x, y] = point(t);

            if (0 <= x && x <= w)
                result.push.apply(result, [x, y]);
            
            if (result.length == 4)
                return result;
            
            t = (h - y1) / (y2 - y1);
            [x, y] = point(t);

            if (0 <= x && x <= w)
                result.push.apply(result, [x, y]);

            return result;
        }
    }

    line(x1, y1, x2, y2, color, width, dash) {
        const [x1l, y1l, x2l, y2l] = this.line_endpoints(x1, y1, x2, y2);
        this.segment(x1l, y1l, x2l, y2l, color, width, dash);
    }

    line_label(x1, y1, x2, y2, color, label) {
        let [x1l, y1l, x2l, y2l] = this.line_endpoints(x1, y1, x2, y2).map(x => Math.round(x));
        if (y1l > y2l)
            [x1l, y1l] = [x2l, y2l];


        const offset = 15;
        let x, y;
        if (x1l == 0) {
            x = 0;
            y = y1l;
        } else if (x1l == this.width()) {
            x = this.width() - offset;
            y = y1l;
        } if (y1l == 0) {
            x = x1l;
            y = offset;
        } else if (y1l == this.height()) {
            x = x1l;
            y = this.height() - offset;
        }
        this.text(x, y, label, "15px Arial", color);
    }
    
    text(x, y, txt, font, color) {
        const ctx = this.context();
        ctx.font = font || "15px Arial";
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.lineJoin = "miter";
	ctx.miterLimit = 2;
        ctx.strokeText(txt, x, y);
        if (color)
            ctx.fillStyle = color;
        ctx.fillText(txt, x, y);
    }

    message(msg) {
        // this.text(5, 15, msg, "15px Arial", "black");
        this._p_status.innerHTML = laTeX2HTML(msg);
    }
}

export { Canvas };
