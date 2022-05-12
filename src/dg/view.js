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
        this.setZoom(xmin, xmax, ymin, ymax);

        if (tool)
            this._tool = tool;
        else
            this._tool = new ToolDragFree(this);

        // constructions that are shown by this view
        this._constructions = [];

        // panning tool
        this._startPan = undefined;
        
        this.addEventListener('mousemove', this.mousemove.bind(this), false);
        this.addEventListener('mousedown', this.mousedown.bind(this), false);
        this.addEventListener('mouseup', this.mouseup.bind(this), false);
        document.body.addEventListener('keydown', this.keydown.bind(this), false);
    }

    addConstruction(construction) {
        this._constructions.push(construction);
    }

    setZoom(xmin, xmax, ymin, ymax) {
        this._xmin = xmin;
        this._xmax = xmax;
        this._ymin = ymin;
        this._ymax = ymax;
        const ratio = window.devicePixelRatio;
        this._scalex = (this._canvas.width()) / (xmax - xmin);
        this._scaley = (this._canvas.height()) / (ymax - ymin);
        this._x0 = -xmin * this._scalex;
        this._y0 = ymax * this._scaley;
    }

    zoom(factor) {
        const w = this._xmax - this._xmin;
        const h = this._ymax - this._ymin;
        const cx = (this._xmin + this._xmax) / 2;
        const cy = (this._ymin + this._ymax) / 2;
        this.setZoom(cx - w/(2 * factor), cx + w/(2 * factor), cy - h/(2 * factor), cy + h/(2 * factor));
        this.redraw();
    }

    pan(startPan, endPan) {
        const dX = endPan.X - startPan.X;
        const dY = endPan.Y - startPan.Y;
        const w = this._canvas.width();
        const h = this._canvas.height();
        const dx = -dX / w * (this._xmax - this._xmin);
        const dy = dY / w * (this._xmax - this._xmin);
        this.setZoom(this._xmin + dx, this._xmax + dx,
                     this._ymin + dy, this._ymax + dy);
        this.redraw();
    }

    redraw() {
        this._constructions.forEach(construction => {
            construction.draw();
        });
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

    getMousePosition(e) {
        return {X: e.offsetX, Y: e.offsetY};
    }
    
    mousemove(e) {
        if (this._tool)
            this._tool.mousemove(e);

        // panning
        if (this._startPan) {
            this.pan(this._startPan, this.getMousePosition(e));
            this._startPan = this.getMousePosition(e);
        }
    }

    mousedown(e) {
        if (this._tool)
            this._tool.mousedown(e);

        // panning
        if (e.ctrlKey)
            this._startPan = this.getMousePosition(e);
    }

    mouseup(e) {
        if (this._tool)
            this._tool.mouseup(e);

        // panning
        if (this._startPan) {
            this.pan(this._startPan, this.getMousePosition(e));
            this._startPan = undefined;
        }
    }

    keydown(e) {
        if (this._tool)
            this._tool.keydown(e);
        
        // zooming
        if (e.ctrlKey && e.code == 'NumpadAdd') { // numpad +
            e.preventDefault();
            this.zoom(1.5);
        } else if (e.ctrlKey && e.code == 'NumpadSubtract') { // numpad -
            e.preventDefault();
            this.zoom(1 / 1.5);
        }
    }
}

export { View };
