import { View } from './view.js';
import * as RC from './rc.js';
import * as ToolImages from './tool_images.js';

// -----------------------------------------------------------------------------
// highlighting specific objects as the mouse moves over them
// -----------------------------------------------------------------------------
class Highlighter {
    // this should be overridden
    shouldHighlight(obj) {
        return false;
    }
}

class HighlighterFreePoints extends Highlighter {
    shouldHighlight(obj) {
        return obj.isFreePoint();
    }
}
const highlighterFreePoints = new HighlighterFreePoints();

class HighlighterPoints extends Highlighter  {
    shouldHighlight(obj) {
        return obj.isPoint();
    }
}
const highlighterPoints = new HighlighterPoints();

class HighlighterLines extends Highlighter  {
    shouldHighlight(obj) {
        return obj.isLine();
    }
}
const highlighterLines = new HighlighterLines();

class HighlighterCircles extends Highlighter  {
    shouldHighlight(obj) {
        return obj.isCircle();
    }
}
const highlighterCircles = new HighlighterCircles();


// -----------------------------------------------------------------------------
// handling of mouse and keyboard events on a view
// -----------------------------------------------------------------------------
class Tool {
    constructor(view) {
        this._view = view;
    }

    mousemove(x, y, worldToScreen, screenToWorld) {
    }

    mousedown(x, y, worldToScreen, screenToWorld) {
    }

    mouseup(x, y, worldToScreen, screenToWorld) {
    }
    
    keydown(e, worldToScreen, screenToWorld) {
    }


    highlightAt(x, y, worldToScreen) {
        if (!this._highlighter)
            return;
        this._construction.highlightAt(x, y, worldToScreen, this._highlighter);
    }

    getObject() {
        return undefined;
    }
}


class ToolDragFree extends Tool {
    constructor(view, construction) {
        super(view);

        this._highlighter = highlighterFreePoints;
        
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

    mousemove(x, y, worldToScreen, screenToWorld) {
        if (this._mousedown && this._dragPoint !== undefined) {
            const [xw, yw] = screenToWorld(x, y);
            if (!this._dragPoint.moveTo(xw, yw)) {
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
                        const [xw, yw] = screenToWorld(x+dx, y+dy);
                        if (this._dragPoint.moveTo(xw, yw))
                            return;
                    }
                }
            }
        }
        this.highlightAt(x, y, worldToScreen);
    }

    mousedown(x, y, worldToScreen, screenToWorld) {
        this._mousedown = true;
        this._dragPoint = this._construction.findFreePointAt(x, y, worldToScreen);
        this._keyboardTarget = this._dragPoint;
    }

    mouseup(x, y, worldToScreen, screenToWorld) {
        this._mousedown = false;
        this._dragPoint = undefined;
    }

    keydown(e, worldToScreen, screenToWorld) {
        if (!this._keyboardTarget)
            return;
        const p = this._keyboardTarget;
        let [x, y] = [p.x(), p.y()];
        let [xt, yt] = worldToScreen(x, y);
        const eps = 2;
        if (e.key == "ArrowRight")
            xt += 1;
        else if (e.key == "ArrowLeft")
            xt -= 1;
        if (e.key == "ArrowUp")
            yt -= 1;
        else if (e.key == "ArrowDown")
            yt += 1;

        [x, y] = screenToWorld(xt, yt)
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
        this._highlighter = this.highlighter(this._types[0]);
    }

    typeName(t) {
        if (t == 'p') return "point";
        if (t == 'l') return "line";
        if (t == 'c') return "circle";
    }

    highlighter(t) {
        if (t == 'p') return highlighterPoints;
        if (t == 'l') return highlighterLines;
        if (t == 'c') return highlighterCircles;
    }

    mouseup(x, y, worldToScreen, screenToWorld) {
        let obj;
        const k = this._selected.length;
        if (this._types[k] == "p")
            obj = this._construction.findPointAt(x, y, worldToScreen);
        else if (this._types[k] == "l")
            obj = this._construction.findLineAt(x, y, worldToScreen);
        else if (this._types[k] == "c")
            obj = this._construction.findCircleAt(x, y, worldToScreen);
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
        this._highlighter = this.highlighter(this._types[this._selected.length]);
    }

    mousemove(x, y, worldToScreen, screenToWorld) {
        this.highlightAt(x, y, worldToScreen, screenToWorld);
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

class ToolIntersectLCBoth extends Tool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "lc", construction, callback);
    }

    construct(l, c) {
        return RC.intersectLC_both(l, c);
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

class ToolIntersectCCBoth extends Tool_ConstructObject {
    constructor(view, construction, callback) {
        super(view, "cc", construction, callback);
    }

    construct(c1, c2, p) {
        return RC.intersectCC_both(c1, c2);
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
        
        function createButton(title, src, onClick) {
            const img = document.createElement("img");
            img.style.border = "1px solid #555";
            img.style.borderRadius = "5px";
            img.style.margin = "1px";
            img.style.width = "32px";
            img.src = src;
            img.title = title;
            img.addEventListener("click", function() {
                [...divTools.getElementsByTagName("img")].forEach(img => { img.style.filter = "brightness(100%)"; });
                img.style.filter = "brightness(80%)";
                onClick();
            });
            divTools.append(img);
        }

        
        createButton("drag free points", ToolImages.drag, function() {
            self._view.message("");
            self.setTool(new ToolDragFree(self._view, self._construction));
        });

        createButton("line", ToolImages.line, function() {
            self.setTool(new ToolLine(self._view, self._construction, self._tool_callback));
        });

        createButton("circle", ToolImages.circle, function() {
            self.setTool(new ToolCircle(self._view, self._construction, self._tool_callback));
        });

        createButton("midpoint", ToolImages.midpoint, function() {
            self.setTool(new ToolMidpoint(self._view, self._construction, self._tool_callback));
        });

        createButton("segment bisector", ToolImages.bisector, function() {
            self.setTool(new ToolBisector(self._view, self._construction, self._tool_callback));
        });

        createButton("drop perpendicular", ToolImages.perp, function() {
            self.setTool(new ToolDropPerp(self._view, self._construction, self._tool_callback));
        });

        createButton("parallel", ToolImages.parallel, function() {
            self.setTool(new ToolParallel(self._view, self._construction, self._tool_callback));
        });

        divTools.append(document.createElement("br"));
        
        createButton("intersect two lines", ToolImages.intersectLL, function() {
            self.setTool(new ToolIntersectLL(self._view, self._construction, self._tool_callback));
        });

        createButton("both intersections of line and circle", ToolImages.intersectLC_both, function() {
            self.setTool(new ToolIntersectLCBoth(self._view, self._construction, self._tool_callback));
        });

        createButton("other intersection of line and circle", ToolImages.intersectLC_other, function() {
            self.setTool(new ToolIntersectLC(self._view, self._construction, self._tool_callback));
        });
        
        createButton("both intersections of two circles", ToolImages.intersectCC_both, function() {
            self.setTool(new ToolIntersectCCBoth(self._view, self._construction, self._tool_callback));
        });

        createButton("other intersection of two circles", ToolImages.intersectCC_other, function() {
            self.setTool(new ToolIntersectCC(self._view, self._construction, self._tool_callback));
        });
    }

    setTool(tool) {
        this._view.setTool(tool);
    }    
}

export { ToolDragFree, ConstructionToolbar };
