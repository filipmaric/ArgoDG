import { View } from './view';
import { Canvas } from './canvas.js';
import { textWidth } from './font.js';
import { removeLaTeX } from './latex.js';

// -----------------------------------------------------------------------------
// drawing view enables drawing objects given in the world coordinate system
// -----------------------------------------------------------------------------
class GraphicsView extends View {
    constructor(element, options, xmin, xmax, ymin, ymax) {
        super();
        
        if (arguments.length == 2) {
            [xmin, xmax] = [-5, 5];
            [ymin, ymax] = [-5, 5];
        }
        this._canvas = new Canvas(element, options);
        this.setVisibleRange(xmin, xmax, ymin, ymax);
        
        // tool that react to the mouse and keyboard events
        this._tool = undefined;

        // panning tool
        this._startPan = undefined;
        
        this.addEventListener('mousemove', this.mousemove.bind(this), false);
        this.addEventListener('mousedown', this.mousedown.bind(this), false);
        this.addEventListener('mouseup', this.mouseup.bind(this), false);
        document.body.addEventListener('keydown', this.keydown.bind(this), false);
    }

    setVisibleRange(xmin, xmax, ymin, ymax) {
        this._xmin = xmin;
        this._xmax = xmax;
        this._ymin = ymin;
        this._ymax = ymax;
        this._scalex = (this._canvas.width()) / (xmax - xmin);
        this._scaley = (this._canvas.height()) / (ymax - ymin);
        this._x0 = -xmin * this._scalex;
        this._y0 = ymax * this._scaley;
    }

    drawObjects(objects) {
        // draw points above other objects
        objects.filter(o => !o.isPoint()).forEach(obj => {this.drawObject(obj);});
        objects.filter(o => o.isPoint()).forEach(obj => {this.drawObject(obj);});
    }

    zoom(factor) {
        const w = this._xmax - this._xmin;
        const h = this._ymax - this._ymin;
        const cx = (this._xmin + this._xmax) / 2;
        const cy = (this._ymin + this._ymax) / 2;
        this.setVisibleRange(cx - w/(2 * factor), cx + w/(2 * factor),
                             cy - h/(2 * factor), cy + h/(2 * factor));
        this.redraw();
    }

    pan(startPan, endPan) {
        const dX = endPan.X - startPan.X;
        const dY = endPan.Y - startPan.Y;
        const w = this._canvas.width();
        const h = this._canvas.height();
        const dx = -dX / w * (this._xmax - this._xmin);
        const dy = dY / w * (this._xmax - this._xmin);
        this.setVisibleRange(this._xmin + dx, this._xmax + dx,
                             this._ymin + dy, this._ymax + dy);
        this.redraw();
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

    worldToScreen(x, y) {
        return [this._x0 + x * this._scalex, this._y0 - y * this._scaley];
    }

    screenToWorld(x, y) {
        return [(x - this._x0) / this._scalex, (this._y0 - y) / this._scaley];
    }

    point(x, y, options) {
        options = options || {}
        const size = options.size || 1;
        const [xt, yt] = this.worldToScreen(x, y);
        const r = 4*size;
        if (r >= 2)
            this._canvas.circle(xt, yt, 4 * size, "black", undefined, undefined, options.color)
        else
            this._canvas.point(xt, yt, "black");
    }

    vector(x1, y1, x2, y2, options) {
        options = options || {};
        const [x1t, y1t] = this.worldToScreen(x1, y1);
        const [x2t, y2t] = this.worldToScreen(x2, y2);
        this._canvas.vector(x1t, y1t, x2t, y2t, options.color, options.width, options.dash);
    }

    text(x, y, txt, font, color, size) {
        size = size || 0;
        const [xt, yt] = this.worldToScreen(x, y);
        const displace = 7 + 3*size;
        if (xt < this._canvas.width() / 2)
            this._canvas.text(xt - displace - textWidth(removeLaTeX(txt), font), yt, txt, font, color);
        else
            this._canvas.text(xt + displace, yt, txt, font, color);
    }
    
    segment(x1, y1, x2, y2, options) {
        options = options || {};
        const [x1t, y1t] = this.worldToScreen(x1, y1);
        const [x2t, y2t] = this.worldToScreen(x2, y2);
        this._canvas.segment(x1t, y1t, x2t, y2t, options.color, options.width, options.dash);
    }

    segment_complement(x1, y1, x2, y2, options) {
        options = options || {}
        const [x1t, y1t] = this.worldToScreen(x1, y1);
        const [x2t, y2t] = this.worldToScreen(x2, y2);
        this._canvas.segment_complement(x1t, y1t, x2t, y2t, options.color, options.width, options.dash);
    }
    
    line(x1, y1, x2, y2, options) {
        options = options || {};
        const [x1t, y1t] = this.worldToScreen(x1, y1);
        const [x2t, y2t] = this.worldToScreen(x2, y2);
        this._canvas.line(x1t, y1t, x2t, y2t, options.color, options.width, options.dash);
    }

    ray(x1, y1, x2, y2, options) {
        options = options || {};
        const [x1t, y1t] = this.worldToScreen(x1, y1);
        const [x2t, y2t] = this.worldToScreen(x2, y2);
        this._canvas.ray(x1t, y1t, x2t, y2t, options.color, options.width, options.dash);
    }
    
    circle(x, y, r, options) {
        options = options || {};
        const [xt, yt] = this.worldToScreen(x, y);
        const rt = r * this._scalex; // FIXME: different scales
        this._canvas.circle(xt, yt, rt, options.color, options.width, options.dash);
    }

    arc(x, y, r, start_angle, end_angle, counterclockwise, options) {
        options = options || {};
        const [xt, yt] = this.worldToScreen(x, y);
        const rt = r * this._scalex; // FIXME: different scales
        this._canvas.arc(xt, yt, rt, start_angle, end_angle, counterclockwise, options.color, options.width, options.dash, options.fillColor);
    }

    polygon(points, options) {
        options = options || {};
        this._canvas.polygon(points.map(p => this.worldToScreen(p[0], p[1])), options.borderColor, options.width, options.dash, options.fillColor);
    }

    line_label(x1, y1, x2, y2, label, color) {
        const [x1t, y1t] = this.worldToScreen(x1, y1);
        const [x2t, y2t] = this.worldToScreen(x2, y2);
        this._canvas.line_label(x1t, y1t, x2t, y2t, label, color);
    }

    message(msg) {
        this._canvas.message(msg);
    }

    addMessage(msg) {
        this._canvas.addMessage(msg);
    }

    setTool(tool) {
        this._tool = tool;
    }    

    getMousePosition(e) {
        return {X: e.offsetX, Y: e.offsetY};
    }
    
    mousemove(e) {
        // mouse position
        const p = this.getMousePosition(e);
        
        // panning
        if (this._startPan) {
            this.pan(this._startPan, p);
            this._startPan = p;
        }

        // specific actions by the current tool 
        if (this._tool)
            this._tool.mousemove(p.X, p.Y,
                                 this.worldToScreen.bind(this),
                                 this.screenToWorld.bind(this));
    }

    findObjectsAt(x, y) {
        let objects = [];
        this._constructions.forEach(construction => {
            const c_objects = construction.findObjectsAt(x, y,
                                                         this.worldToScreen.bind(this));
            objects.push(...c_objects);
        });
        return objects;
    }

    mousedown(e) {
        // mouse position
        const p = this.getMousePosition(e);
        
        // panning
        if (e.ctrlKey)
            this._startPan = p;

        // show description
        if (e.shiftKey) {
            const p = this.getMousePosition(e);
            const objects = this.findObjectsAt(p.X, p.Y);
            
            this.message("");
            objects.forEach(obj => {
                this.addMessage(obj.describe());
            });
        }
        
        // specific actions by the current tool 
        if (this._tool)
            this._tool.mousedown(p.X, p.Y,
                                 this.worldToScreen.bind(this),
                                 this.screenToWorld.bind(this));
    }

    mouseup(e) {
        // mouse position
        const p = this.getMousePosition(e);
        
        // panning
        if (this._startPan) {
            this.pan(this._startPan, p);
            this._startPan = undefined;
        }

        // reset message
        if (e.shiftKey)
            this.message("");

        // specific actions by the current tool 
        if (this._tool)
            this._tool.mouseup(p.X, p.Y,
                               this.worldToScreen.bind(this),
                               this.screenToWorld.bind(this));
    }

    keydown(e) {
        // zooming
        if (e.ctrlKey && e.code == 'NumpadAdd') { // numpad +
            e.preventDefault();
            this.zoom(1.5);
        } else if (e.ctrlKey && e.code == 'NumpadSubtract') { // numpad -
            e.preventDefault();
            this.zoom(1 / 1.5);
        }

        // specific actions by the current tool 
        if (this._tool)
            this._tool.keydown(e,
                               this.worldToScreen.bind(this),
                               this.screenToWorld.bind(this));
    }

    svgString() {
        return this._canvas.svgString();
    }
}

export { GraphicsView }
