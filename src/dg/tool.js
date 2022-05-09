import { View } from './view.js';
import * as RC from './rc.js';
import * as DG from './dg.js';

// -----------------------------------------------------------------------------
// handling of mouse and keyboard events on a view
// -----------------------------------------------------------------------------
class Tool {
    constructor(view) {
        this._view = view;
    }

    getMousePosition(e) {
        return [e.offsetX, e.offsetY];
    }

    mousemove(e) {
    }

    mousedown(e) {
    }

    mouseup(e) {
    }
    
    keydown(e) {
    }

    getObject() {
        return undefined;
    }
}

class ToolDragFree extends Tool {
    constructor(view, construction) {
        super(view);
        // mouse button is not yet pressed
        this._mousedown = false;
        // point dragged by the mouse
        this._dragPoint = undefined;
        // point moved by the keyboard
        this._keyboardTarget = undefined;
        // construction whose points can be dragged
        // (if not specified all existing points free points can be dragged)
        this._construction = construction;
    }

    mousemove(e) {
        if (this._mousedown && this._dragPoint !== undefined) {
            const [xm, ym] = this.getMousePosition(e);
            const [x, y] = this._view.transformInverse(xm, ym);
            if (!this._dragPoint.moveTo(x, y)) {
                const N = 10;
                for (let d = 1; d <= N; d++) {
                    let ring = [];
                    for (let x = -d; x <= d; x++)
                        ring.push([x, -d]);
                    for (let y = -d+1; y <= d; y++)
                        ring.push([d, y]);
                    for (let x = d-1; x >= -d; x--)
                        ring.push([x, d]);
                    for (let y = d-1; y >= -d+1; y--)
                        ring.push([-d, y]);

                    for (let i = 0; i < ring.length; i++) {
                        const [dx, dy] = ring[i];
                        const [x, y] = this._view.transformInverse(xm+dx, ym+dy);
                        if (this._dragPoint.moveTo(x, y))
                            return;
                    }
                }
            }
        }
    }

    mousedown(e) {
        this._mousedown = true;
        const [x, y] = this.getMousePosition(e);
        if (this._construction)
            this._dragPoint = this._construction.findFreePointAt(x, y, this._view.transform.bind(this._view));
        else
            this._dragPoint = DG.findFreePointAt(x, y, this._view.transform.bind(this._view));
        this._keyboardTarget = this._dragPoint;
    }

    mouseup(e) {
        this._mousedown = false;
        this._dragPoint = undefined;
    }

    keydown(e) {
        if (!this._keyboardTarget)
            return;
        const p = this._keyboardTarget;
        let [x, y] = [p.x(), p.y()];
        let [xt, yt] = this._view.transform(x, y);
        const eps = 2;
        if (e.key == "ArrowRight")
            xt += 1;
        else if (e.key == "ArrowLeft")
            xt -= 1;
        if (e.key == "ArrowUp")
            yt -= 1;
        else if (e.key == "ArrowDown")
            yt += 1;

        [x, y] = this._view.transformInverse(xt, yt)
        p.moveTo(x, y);
    }
}


class Tool_ConstructObject extends Tool {
    constructor(view, types, construction, callback) {
        super(view);
        this._object = undefined;
        this._types = types;
        this._selected = [];
        this._construction = construction;
        this._callback = callback;

        this._view.message("Select a " + this.typeName(this._types[0]));
    }

    typeName(t) {
        if (t == 'p') return "point";
        if (t == 'l') return "line";
        if (t == 'c') return "circle";
    }

    mouseup(e) {
        const [x, y] = this.getMousePosition(e);
        let obj;
        const k = this._selected.length;
        if (this._types[k] == "p")
            obj = this._construction.findPointAt(x, y, this._view.transform.bind(this._view));
        else if (this._types[k] == "l")
            obj = this._construction.findLineAt(x, y, this._view.transform.bind(this._view));
        else if (this._types[k] == "c")
            obj = this._construction.findCircleAt(x, y, this._view.transform.bind(this._view));
        if (!obj)
            return;

        this._selected.push(obj);
        
        if (this._selected.length == this._types.length) {
            this._object = this.construct(...this._selected);
            if (this._callback)
                this._callback(this._object);
            this._selected = [];
        }

        let msg = "";
        this._selected.forEach((obj, i) => {msg += "Selected " + this.typeName(this._types[i]) + " " + obj.label() + ". "});
        msg += "Select a " + this.typeName(this._types[this._selected.length]);
        this._view.message(msg);
    }
    
    getObject() {
        return this._object;
    }
}


class ToolLine extends Tool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "pp", construction, callback);
    }
    
    construct(p1, p2) {
        return RC.line(p1, p2);
    }
}

class ToolMidpoint extends Tool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "pp", construction, callback);
    }
    
    construct(p1, p2) {
        return RC.midpoint(p1, p2);
    }
}

class ToolBisector extends Tool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "pp", construction, callback);
    }
    
    construct(p1, p2) {
        return RC.bisector(p1, p2);
    }
}

class ToolCircle extends Tool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "pp", construction, callback);
    }
    
    construct(p1, p2) {
        return RC.circle(p1, p2);
    }
}

class ToolDropPerp extends Tool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "pl", construction, callback);
    }

    construct(p, l) {
        return RC.drop_perp(l, p);
    }
}

class ToolParallel extends Tool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "pl", construction, callback);
    }

    construct(p, l) {
        return RC.parallel(l, p);
    }
}

class ToolIntersectLL extends Tool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "ll", construction, callback);
    }

    construct(l1, l2) {
        return RC.intersectLL(l1, l2);
    }
}

class ToolIntersectLC extends Tool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "lcp", construction, callback);
    }

    construct(l, c, p) {
        return RC.intersectLC_other(l, c, p);
    }
}

class ToolIntersectCC extends Tool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "ccp", construction, callback);
    }

    construct(c1, c2, p) {
        return RC.intersectCC_other(c1, c2, p);
    }
}


class ConstructionToolbar {
    constructor(construction, view, element, callback) {
        this._construction = construction;
        this._view = view;
        this._tool_callback = callback;
        
        const divTools = document.createElement("div");
        element.prepend(divTools);
        
        const self = this;
        
        const btnDrag = document.createElement("button");
        btnDrag.innerHTML = "drag";
        btnDrag.addEventListener("click", function() {
            self._view.message("");
            self.setTool(new ToolDragFree(self._view, self._construction));

        });
        divTools.append(btnDrag);

        const btnLine = document.createElement("button");
        btnLine.innerHTML = "line";
        btnLine.addEventListener("click", function() {
            self.setTool(new ToolLine(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnLine);

        const btnCircle = document.createElement("button");
        btnCircle.innerHTML = "circle";
        btnCircle.addEventListener("click", function() {
            self.setTool(new ToolCircle(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnCircle);
        
        const btnMidpoint = document.createElement("button");
        btnMidpoint.innerHTML = "midpoint";
        btnMidpoint.addEventListener("click", function() {
            self.setTool(new ToolMidpoint(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnMidpoint);

        const btnBisector = document.createElement("button");
        btnBisector.innerHTML = "bisector";
        btnBisector.addEventListener("click", function() {
            self.setTool(new ToolBisector(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnBisector);
        
        const btnDropPerp = document.createElement("button");
        btnDropPerp.innerHTML = "perp";
        btnDropPerp.addEventListener("click", function() {
            self.setTool(new ToolDropPerp(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnDropPerp);

        const btnParallel = document.createElement("button");
        btnParallel.innerHTML = "parallel";
        btnParallel.addEventListener("click", function() {
            self.setTool(new ToolParallel(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnParallel);

        divTools.append(document.createElement("br"));
        
        const btnIntersectLL = document.createElement("button");
        btnIntersectLL.innerHTML = "intersectLL";
        btnIntersectLL.addEventListener("click", function() {
            self.setTool(new ToolIntersectLL(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnIntersectLL);

        const btnIntersectLC = document.createElement("button");
        btnIntersectLC.innerHTML = "intersectLC";
        btnIntersectLC.addEventListener("click", function() {
            self.setTool(new ToolIntersectLC(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnIntersectLC);

        const btnIntersectCC = document.createElement("button");
        btnIntersectCC.innerHTML = "intersectCC";
        btnIntersectCC.addEventListener("click", function() {
            self.setTool(new ToolIntersectCC(self._view, self._construction, self._tool_callback));
        });
        divTools.append(btnIntersectCC);
        
        [...divTools.getElementsByTagName("button")].forEach(button => { button.style.fontSize = "12px"; });
    }

    setTool(tool) {
        this._view.setTool(tool);
    }    
}

export { ToolDragFree, ConstructionToolbar };
