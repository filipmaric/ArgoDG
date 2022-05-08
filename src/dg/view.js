import { removeLaTeX } from './latex.js';
import { Canvas } from './canvas.js';
import { ToolDragFree } from './tool.js';

// -----------------------------------------------------------------------------
// drawing view enables drawing objects given in the world coordinate system
// -----------------------------------------------------------------------------
class View {
    constructor(element, options, xmin, xmax, ymin, ymax, tool) {
        if (arguments.length == 2) {
            [xmin, xmax] = [-5, 5];
            [ymin, ymax] = [-5, 5];
        }

        this._canvas = new Canvas(element, options);

        this._xmin = xmin;
        this._xmax = xmin;
        this._ymin = ymin;
        this._ymin = ymax;
        const ratio = window.devicePixelRatio;
        this._scalex = (this._canvas.width()) / (xmax - xmin);
        this._scaley = (this._canvas.height()) / (ymax - ymin);
        this._x0 = -xmin * this._scalex;
        this._y0 = ymax * this._scaley;
        if (tool)
            this._tool = tool;
        else
            this._tool = new ToolDragFree(this);
        
        this.addEventListener('mousemove', this.mousemove.bind(this), false);
        this.addEventListener('mousedown', this.mousedown.bind(this), false);
        this.addEventListener('mouseup', this.mouseup.bind(this), false);
        document.body.addEventListener('keydown', this.keydown.bind(this), false);
    }

    canvas() {
        return this._canvas;
    }

    addEventListener(event, fun) {
        this._canvas.addEventListener(event, fun);
    }

    clear() {
        this._canvas.clear();
    }

    transform(x, y) {
        return [this._x0 + x * this._scalex, this._y0 - y * this._scaley];
    }

    transformInverse(x, y) {
        return [(x - this._x0) / this._scalex, (this._y0 - y) / this._scaley];
    }

    point(x, y, options) {
        options = options || {}
        const size = options.size || 1;
        const [xt, yt] = this.transform(x, y);
        this._canvas.circle(xt, yt, 4 * size, options.color, undefined, undefined, true)
    }

    text(x, y, txt) {
        txt = removeLaTeX(txt);
        const [xt, yt] = this.transform(x, y);
        const displace = 8;
        this._canvas.text(xt + displace, yt + displace, txt);
    }
    
    segment(x1, y1, x2, y2, options) {
        options = options || {}
        const [x1t, y1t] = this.transform(x1, y1);
        const [x2t, y2t] = this.transform(x2, y2);
        this._canvas.segment(x1t, y1t, x2t, y2t, options.color, options.width, options.dash);
    }

    line(x1, y1, x2, y2, options) {
        options = options || {}
        const [x1t, y1t] = this.transform(x1, y1);
        const [x2t, y2t] = this.transform(x2, y2);
        this._canvas.line(x1t, y1t, x2t, y2t, options.color, options.width, options.dash);
    }

    circle(x, y, r, options) {
        options = options || {};
        const [xt, yt] = this.transform(x, y);
        const rt = r * this._scalex; // FIXME: different scales
        this._canvas.circle(xt, yt, rt, options.color, options.width, options.dash);
    }

    line_label(x1, y1, x2, y2, color, label) {
        label = removeLaTeX(label);
        const [x1t, y1t] = this.transform(x1, y1);
        const [x2t, y2t] = this.transform(x2, y2);
        this._canvas.line_label(x1t, y1t, x2t, y2t, color, label);
    }

    message(msg) {
        this._canvas.message(msg);
    }

    setTool(tool) {
        this._tool = tool;
    }    
    
    mousemove(e) {
        if (this._tool)
            this._tool.mousemove(e);
    }

    mousedown(e) {
        if (this._tool)
            this._tool.mousedown(e);
    }

    mouseup(e) {
        if (this._tool)
            this._tool.mouseup(e);
    }

    keydown(e) {
        if (this._tool)
            this._tool.keydown(e);
    }
}

export { View };
