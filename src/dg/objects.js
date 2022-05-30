import { Complex, CP1, Circline } from '../complex_geom.js';
import { rgbColor, getOpacity, setOpacity } from './colors.js';

const REDRAW = true;
const NO_REDRAW = false;

// -----------------------------------------------------------------------------
// the base class for all geometric objects
// -----------------------------------------------------------------------------
class DGObject {
    // global number of created objects
    static num_objects = 0;
    
    constructor(construction) {
        // unique object identifier
        this._ID = DGObject.num_objects++;
        
        // objects dependent on the current one (the ones constructed
        // using this object)
        this._dependent_objects = [];

        // some objects can be invalid (e.g., intersection point
        // selected by some given criteria, when no selection point exists)
        this._valid = true;

        // style (visibility, color, width, size, dashed, ...)
        this._style = {};

        // no object is highlighted by default
        this._style._highlight = false;

        // each object can be a part of one or more constructions
        this._constructions = [];
        if (construction)
            this.addConstruction(construction);
    }

    addConstruction(construction) {
        this._constructions.push(construction);
    }

    removeConstruction(construction) {
        this._constructions = this._constructions.filter(c => c != construction);
    }

    type() {
        return "object";
    }

    valid() {
        return this._valid;
    }

    isFreePoint() {
        return false;
    }

    isPoint() {
        return false;
    }

    isLine() {
        return false;
    }

    isCircle() {
        return false;
    }

    // fire event that this object has changed
    fireChangeEvent() {
        // redraw constructions where this object occurs
        this._constructions.forEach(construction => {
            construction.draw();
        });
    }
    
    // set if this object should be visible
    show(yes, redraw) {
        if (yes == undefined)
            yes = true;
        this._style._hide = !yes;
        if (redraw === undefined || redraw)
            this.fireChangeEvent();
        return this;
    }

    // set that this object should not be visible
    hide(redraw) {
        this.show(false, redraw);
        return this;
    }

    // check if the object is hidden (not visible)
    hidden() {
        return this._style._hide;
    }

    // check if the object is visible (not hidden)
    visible() {
        return !this.hidden();
    }

    // get or set the color of the object
    color(c, redraw) {
        // if c is undefined get the color
        if (c === undefined)
            // return color that has been set or black otherwise
            return this._style._color ? this._style._color : "black";

        // otherwise set the color
        this._style._color = c;

        if (redraw === undefined || redraw)
            this.fireChangeEvent();
        return this;
    }

    // get or set the line width of the object
    width(w, redraw) {
        // w is undefined get the width
        if (w === undefined)
            // return width that has been set or 1 if it is undefined
            return this._style._width ? this._style._width : 1;

        // otherwise set the width
        this._style._width = w;
        
        if (redraw === undefined || redraw)
            this.fireChangeEvent();
        return this;
    }

    // set dashed pattern
    dashed(redraw) {
        this._style._dash = [8, 4];
        
        if (redraw === undefined || redraw)
            this.fireChangeEvent();
        return this;
    }

    // set solid line
    solid(redraw) {
        this._style._dash = [];
        
        if (redraw === undefined || redraw)
            this.fireChangeEvent();
        return this;
    }

    // get the dash pattern
    dash() {
        return this._style._dash ? this._style._dash : [];
    }

    // get or set opacity of the object
    opacity(o, redraw) {
        // o is undefined get the opacity
        if (o === undefined)
            return getOpacity(this.color());
        
        // otherwise set the opacity
        this.color(setOpacity(this.color(), o));
        
        if (redraw === undefined || redraw)
            this.fireChangeEvent();
        return this;
    }

    // get or set the size of the object (for drawing points)
    size(s, redraw) {
        // if s is undefined get the size
        if (s === undefined)
            // return size that has been set or 1 if it is undefined
            return this._style._size ? this._style._size : 1;

        // otherwise set the size
        this._style._size = s;

        if (redraw === undefined || redraw)
            this.fireChangeEvent();
        return this;
    }

    // default label for the object (if label is not set)
    defaultLabel() {
        return this.type() + "(" + this._ID + ")";
    }

    // default description for the object (if description is not set)
    defaultDescription() {
        return "";
    }

    // get/set the label of the object
    label(str, redraw, show) {
        // str is undefined get the label
        if (str === undefined) {
            if (this._style._label)
                return this._style._label;
            // label is not set - get the default label
            return this.defaultLabel();
        }
        
        // otherwise set the label
        this._style._label = str;

        // label should be shown unless showing it explicitly turned off
        this._style._showing_label = show == undefined || show;

        // change (redraw) event is fired unless that is explicitly turned off
        if (redraw === undefined || redraw)
            this.fireChangeEvent();
        return this;
    }

    // does this object have a non-generic label
    hasLabel() {
        return this._style._label !== undefined;
    }

    // check if the label should be shown
    showingLabel() {
        return this._style._showing_label;
    }

    hideLabel(redraw) {
        this._style._showing_label = false;
        // change (redraw) event is fired unless that is explicitly turned off
        if (redraw === undefined || redraw)
            this.fireChangeEvent();
        return this;
    }

    // get or set the description
    description(desc, redraw) {
        if (desc != undefined) {
            // if description is given, set the description
            this._style._description = desc;
            
            if (redraw === undefined || redraw)
                this.fireChangeEvent();
            return this;
        } else {
            // otherwise get the description
            if (this._style._description)
                return this._style._description;
            // description is not set - get the default description
            return this.defaultDescription();
        }
    }

    // append string to the existing description
    addDescription(desc, redraw) {
        this._style._description += desc;
        
        if (redraw === undefined || redraw)
            this.fireChangeEvent();
        return this;
    }

    // returns a nice description for the object that might contain a label (if its given)
    // and description (given or default)
    describe() {
        let result;
        if (this.hasLabel()) {
            result = this.label();
            if (this.description())
                result += ": " + this.description();
            else
                result = this.type() + " " + result;
        } else {
            if (this.description())
                result = this.description();
            else
                result = this.label();
        }
        return result;
    }

    // get or set highlight (that shows that mouse is on the object) 
    highlight(h, redraw) {
        if (h === undefined)
            return this._style._highlight ? this._style._highlight : false;

        if (h != this._style._highlight) {
            this._style._highlight = h;
            if (redraw === undefined || redraw)
                this.fireChangeEvent();
        }
    }

    // get or set the entire style object
    style(st, redraw) {
        if (st === undefined)
            return this._style;
        
        this._style = st;
        
        // change (redraw) event is fired unless that is explicitly turned off
        if (redraw === undefined || redraw)
            this.fireChangeEvent();
        return this;
        
    }

    // draw object on the given View
    // this is a template method and the real drawing is done within
    // the polimorphic drawMe method
    draw(view) {
        if (this.hidden())
            return;
        if (!this.valid())
            return;
        this.drawMe(view);
        if (this.showingLabel())
            this.drawLabel(view);
    }

    // this should be overridden
    drawMe(view) {
    }

    // this should be overridden
    drawLabel(view) {
    }
    
    // Register a DGObject to depend on the current object, so that it
    // is updated whenever the current object changes
    addDependent(o) {
        this._dependent_objects.push(o);
    }

    // Recaculate the position of all dependent objects when this object changes
    // this is a template method that handles the order of
    // recalculations, while the coordinate calculations happen within
    // the polimorphic recalceMe method
    recalc() {
        // a topological sort is performed to determine the optimal
        // order of recalculation of dependent objects

        // first a BFS traversal is used to calculate the number of objects that 
        // each relevant object depends on (its degree)
        
        let queue = [];
        const n = DGObject.num_objects;
        const degree = new Array(n).fill(0);
        const objects = new Array(n).fill(null);
        
        function enqueue(obj) {
            degree[obj._ID]++;
            if (objects[obj._ID] == null) {
                objects[obj._ID] = obj;
                queue.push(obj);
            }
        }

        objects[this._ID] = this;
        this._dependent_objects.forEach(enqueue);
        while (queue.length > 0) {
            const obj = queue.shift();
            obj._dependent_objects.forEach(enqueue);
        }

        // next the Kahn's algoritm is performed
        queue = [this._ID];
        while (queue.length > 0) {
            const id = queue.shift();
            objects[id].recalcMe();
            objects[id]._dependent_objects.forEach(obj => {
                if (--degree[obj._ID] == 0)
                    queue.push(obj._ID);
            });
        }
    }

    // this should be overridden
    recalcMe() {
    }

    // check if this point is near the given point on the screen
    // (world-to-screen coordinate transform is given)
    isNear(x, y, worldToScreen) {
        return false;
    }
    
    // check if two objects are equal
    eq(other) {
        if (this.isPoint() && other.isPoint()) {
            return this.cp1().eq(other.cp1());
        }
        if (this instanceof DGCircline && other instanceof DGCircline) {
            return this.circline().eq(other.circline())
        }
        return false;
    }

    // data used when this object is passed as a function argument in DGPointFun
    funArg() {
        return null;
    }

    // clone
    clone() {
        return new DGClone(this);
    }
}

// -----------------------------------------------------------------------------
// clone - shallow copy of object that can have its own style and visibility
// -----------------------------------------------------------------------------

class DGClone extends DGObject {
    constructor(object) {
        super();
        this._object = object;
        this._style = {...this._object.style()};
        return new Proxy(this, this);
    }

    type() {
        return "clone";
    }

    valid() {
        return this._object.valid();
    }

    drawMe(view) {
        const old_style = this._object.style();
        this._object.style(this._style, false);
        this._object.drawMe(view);
        this._object.style(old_style, false);
    }

    drawLabel(view) {
        const old_style = this._object.style();
        this._object.style(this._style, false);
        this._object.drawLabel(view);
        this._object.style(old_style, false);
    }

    isPoint() {
        return this._object.isPoint();
    }

    get(target, prop) {
        return this[prop] || this._object[prop];
    }
}


// -----------------------------------------------------------------------------
// free point
// -----------------------------------------------------------------------------
// the point is internally represented by a CP1 object
class DGPoint extends DGObject {
    constructor(x, y) {
        super();
        
        this._validity_check = undefined;
        if (arguments.length == 2)
            this._valid = this.moveTo(x, y);

        return this;
    }

    type() {
        return "point";
    }

    // fix the point so that it cannot be moved
    fix() {
        this._fixed = true;
        return this;
    }

    // free the point so that it can be moved
    free() {
        this._fixed = false;
        return this;
    }

    // this is the only class that defines free points (points that
    // can be moved by using the mouse, unless they are fixed)
    isFreePoint() {
        if (this._fixed)
            return false;
        return true;
    }

    // this object is a point
    isPoint() {
        return true;
    }

    // user can constrain this point to satisfy some criteria defined
    // by the function fun cp1 -> bool
    validityCheck(fun) {
        this._validity_check = fun;
        return this;
    }

    // trying to move the point to the given position
    // moving is not allowed if the target position does not satisfy
    // the validity check
    moveTo(x, y) {
        if (this._validity_check == undefined || this._validity_check(CP1.of_xy(x, y))) {
            // update the internal CP1 object
            this._coords = new CP1(new Complex(x, y));
            this._valid = true; 
            // update all dependent objects
            this.recalc();

            this.fireChangeEvent();
            // the point was successfully moved
            return true;
        }
        // the point could not be moved
        this._valid = false; 
        return false;
    }

    // theoretically, the point can be infinite
    is_inf() {
        return this._coords.is_inf();
    }

    // conversion to complex number (unless infinite)
    to_complex() {
        return this._coords.to_complex();
    }

    // x coordinate (unless infinite)
    x() {
        const c = this.to_complex();
        return c.re();
    }

    // y coordinate (unless infinite)
    y() {
        const c = this.to_complex();
        return c.im();
    }
    
    // both coordinates (unless infinite)
    coords() {
        return this.to_complex().coords();
    }

    // internal cp1 representation
    cp1() {
        return this._coords;
    }

    funArg() {
        return this.cp1();
    }

    // check equality of two points
    eq(other) {
        if (other instanceof CP1)
            return this.cp1().eq(other);
        if (other.isPoint()) {
            return this.cp1().eq(other.cp1());
        }
        return false;
    }

    // distance to the other point (unless one of them is infinite)
    distance(other) {
        return this.to_complex().sub(other.to_complex()).norm();
    }

    // check if this point is near the given point on the screen
    // (world-to-screen coordinate transform is given)
    isNear(x, y, worldToScreen) {
        if (!this.valid())
            return false;
        const [xt, yt] = worldToScreen(this.x(), this.y());
        const dist2 = (xt - x)*(xt - x) + (yt - y)*(yt - y);
        let EPS = 5;
        EPS *= this.size();
        return dist2 <= EPS * EPS;
    }

    // drawing the point on the given View
    drawMe(view) {
        if (!this.is_inf()) {
            if (this.highlight()) {
                view.point(this.x(), this.y(), {color: setOpacity(this.color(), 0.5*this.opacity()), size: 1.5*this.size()});
            }
            view.point(this.x(), this.y(), {color: this.color(), size: this.size()});
            
        }
    }

    // drawing the point label on the given View 
    drawLabel(view) {
        if (!this.is_inf() && this._style._label)
            view.text(this.x(), this.y(), this._style._label);
    }
}

// -----------------------------------------------------------------------------
// random point
// -----------------------------------------------------------------------------
class DGRandomPoint extends DGPoint {
    constructor(validity_check, xmin, xmax, ymin, ymax) {
        super();
        
        xmin = xmin || -1;
        xmax = xmax || 1;
        ymin = ymin || -1;
        ymax = ymax || 1;
        this._xmin = xmin; this._xmax = xmax;
        this._ymin = ymin; this._ymax = ymax;
        this._validity_check = validity_check ? validity_check : (p => true);
        this.recalcMe();
    }

    type() {
        return "random point";
    }
    
    // random point is not free
    isFreePoint() {
        return false;
    }

    recalcMe() {
        const MAX_ITER = 100;
        let x, y;
        let i = 0;
        do {
            x = this._xmin + Math.random() * (this._xmax - this._xmin);
            y = this._ymin + Math.random() * (this._ymax - this._ymin);
            this._coords = new CP1(new Complex(x, y));
            i++;
        } while (!this._validity_check(this._coords) && i < MAX_ITER);
        if (i == MAX_ITER) {
            this._valid = false;
            throw "Could not generate valid random point";
        } else
            this._valid = true;
    }
}

class DGPointFun extends DGPoint {
    constructor(fun, dependencies) {
        super();
        this._fun = fun;
        this._dependencies = dependencies;
        
        dependencies.forEach(obj => {
            obj.addDependent(this);
        });
        this.recalcMe();
    }

    // point is not free
    isFreePoint() {
        return false;
    }
    
    recalcMe() {
        this._valid = this._dependencies.every(obj => obj.valid());
        if (!this._valid)
            return;
        
        const args = this._dependencies.map(obj => obj.funArg());
        this._coords = this._fun(...args);
    }
}

class DGNum extends DGObject {
    constructor(fun, dependencies) {
        super();
        this._fun = fun;
        this._dependencies = dependencies;
        
        dependencies.forEach(obj => {
            obj.addDependent(this);
        });
        this.recalcMe();
        this.hide(false);
    }

    value() {
        return this._value;
    }
    
    funArg() {
        return this.value();
    }
    
    recalcMe() {
        this._valid = this._dependencies.every(obj => obj.valid());
        if (!this._valid)
            return;
        const args = this._dependencies.map(obj => obj.funArg());
        this._value = this._fun(...args);
        this._valid = isFinite(this._value);
    }
    
}

// -----------------------------------------------------------------------------
// joint class for circles and lines
// -----------------------------------------------------------------------------

class DGCircline extends DGObject {
    constructor() {
        super();
    }

    type() {
        return "circline";
    }

    drawMe(view) {
        function doDraw(cl, style) {
            if (cl._circline.is_line()) {
                const [p1, p2] = cl._circline.line_points();
                const [x1, y1] = p1.coords();
                const [x2, y2] = p2.coords();
                view.line(x1, y1, x2, y2, style);
            } else {
                const c = cl._circline.circle_center();
                const r = cl._circline.circle_radius();
                const [x, y] = c.coords();
                view.circle(x, y, r, style);
            }
        }
        
        const style = {
            color: this.color(),
            width: this.width(),
            dash: this.dash()
        };
        doDraw(this, style);
        
        if (this.highlight()) {
            const style = {
                color: setOpacity(this.color(), 0.5*getOpacity(this.color())),
                width: 3*this.width(),
                dash: this.dash()
            };
            doDraw(this, style);
        }
    }

    // drawing the line label on the given View 
    drawLabel(view) {
        if (this._circline.is_line() && this._style._label) {
            const [p1, p2] = this._circline.line_points();
            const [x1, y1] = p1.coords();
            const [x2, y2] = p2.coords();
            view.line_label(x1, y1, x2, y2, this._style._color, this._style._label);
        }
    }

    // check if this line is near the given point on the screen
    // (world-to-screen coordinate transform is given)
    isNear(x, y, worldToScreen) {
        if (!this.valid())
            return false;
        return this._circline.transform(worldToScreen).on_circline(CP1.of_complex(new Complex(x, y)));
    }
    
    // return internal representation (FIXME: this should be private)
    circline() {
        return this._circline;
    }

    funArg() {
        return this.circline();
    }

    intersect(other, includeFictive) {
        return this.circline().intersect(other.circline(), includeFictive);
    }
}

// -----------------------------------------------------------------------------
// straight line between two given points
// -----------------------------------------------------------------------------
// internally the line is represented by a CP1 circline (a Hermitean matrix)
class DGLine extends DGCircline {
    // construct a line given the two points
    constructor(p1, p2) {
        super();
        
        this._p1 = p1;
        this._p2 = p2;
        // if any of the two points move, this line must be updated
        p1.addDependent(this);
        p2.addDependent(this);
        // initialize the internal circline representation (Hermitean matrix)
        this.recalcMe();
    }

    type() {
        return "line";
    }

    defaultDescription() {
        return "line " + this._p1.label() + this._p2.label();
    }

    // recalculate the coordinates
    recalcMe() {
        this._valid = this._p1.valid() && this._p2.valid();
        if (!this._valid)
            return;
        this._circline = Circline.mk_circline3(this._p1.cp1(), this._p2.cp1(), CP1.inf);
    }

    // find intersection of two lines (infinite point if the lines are parallel)
    static intersect(l1, l2) {
        const p = l1.intersect(l2, false);
        if (!p[0].is_inf())
            return p[0];
        if (!p[1].is_inf())
            return p[1];
        // both points are infinite (lines are parallel)
        return CP1.inf;
    }

    isLine() {
        return true;
    }

    circline() {
        return this._circline;
    }
}

// -----------------------------------------------------------------------------
// a line segment
// -----------------------------------------------------------------------------
class DGSegment extends DGLine {
    constructor(p1, p2) {
        super(p1, p2);
    }

    type() {
        return "segment";
    }

    defaultDescription() {
        return "segment " + this._p1.label() + this._p2.label();
    }

    drawMe(view) {
        const [x1, y1] = this._p1.coords();
        const [x2, y2] = this._p2.coords();
        view.segment(x1, y1, x2, y2, {color: this._style._color, width: this._style._width, dash: this._style._dash});
    }

    // drawing the segment label on the given View 
    drawLabel(view) {
        // TODO
    }
}

// -----------------------------------------------------------------------------
// a random point on the line
// -----------------------------------------------------------------------------
class DGRandomPointOnCircline extends DGPoint {
    constructor(l, params) {
        super();
        this._line = l;
        this._validity_check = params.validity_check ? params.validity_check : p => true;
        this._disc = params.disc;
        // if the line moves, this point must be updated
        l.addDependent(this);
        // initialize (randomly) the point coordinates
        this.recalcMe();
        // fix the point so that it cannot be moved
        this.fix();
    }

    type() {
        return "point on circline";
    }

    // point on circline is semi-free
    isFreePoint() {
        return !this._fixed;
    }

    // recalculate the coordinates
    recalcMe() {
        this._valid = this._line.valid();
        if (!this._valid)
            return;
        const MAX_ITER = 100;
        let iter = 0;
        do {
            if (this._disc)
                this._coords = this._line.circline().random_point_in_disc(this._disc);
            else
                this._coords = this._line.circline().random_point();
            iter++;
        } while (!this._validity_check(this._coords) && iter < MAX_ITER);
        if (iter == MAX_ITER) {
            this._valid = false;
            console.log(this._line.circline());
            throw "Unable to generate valid random point";
        }
    }
}

// -----------------------------------------------------------------------------
// a circle with a given center and point
// -----------------------------------------------------------------------------
// internally the line is represented by a CP1 circline (a Hermitean matrix)
class DGCircle extends DGCircline {
    constructor(c, p) {
        super();
        
        this._c = c;
        this._p = p;
        // if any of the two points move, this line must be updated
        c.addDependent(this);
        p.addDependent(this);
        // initialize the internal circline representation (Hermitean matrix)
        this.recalcMe();
    }

    type() {
        return "circle";
    }

    defaultDescription() {
        return "circle c(" + this._c.label() + ", " + this._p.label() + ")";
    }

    // this is a circle
    isCircle() {
        return true;
    }

    // recalculate the coordinates
    recalcMe() {
        this._valid = this._c.valid() && this._p.valid();
        if (!this._valid)
            return;
        this._r = this._c.distance(this._p);
        this._circline = Circline.mk_circle(this._c.to_complex(), this._r);
    }

    // return the center of the circle
    center() {
        return new DGCircleCenterPoint(this);
    }

    // check if the given CP1 object lies in the current circle disc (boundary excluded)
    inDisc(p) {
        return this._circline.in_disc(p);
    }

    // check if the point (x, y) lies in the current circle disc (boundary excluded)
    inDiscXY(x, y) {
        return this._circline.in_disc(CP1.of_complex(new Complex(x, y)));
    }

    // check if the point (x, y) lies on the current circle
    onCircleXY(x, y) {
        return this._circline.on_circline(CP1.of_complex(new Complex(x, y)), 1e-3);
    }

    // intersect a line and a circle
    static intersectLC(l, c, includeFictive) {
        return l.intersect(c, includeFictive);
    }

    // intersect two circles
    static intersectCC(c1, c2, includeFictive) {
        return c1.intersect(c2, includeFictive);
    }
}

// -----------------------------------------------------------------------------
// center of the given circle
// -----------------------------------------------------------------------------
class DGCircleCenterPoint extends DGPoint {
    constructor(c) {
        super();
        
        this._circle = c;
        // if the circle moves, this point must be updated
        c.addDependent(this);
        // initialize center coordinates
        this.recalcMe();
    }

    type() {
        return "circle center";
    }

    // circle center point is not free
    isFreePoint() {
        return false;
    }

    defaultDescription() {
        return "center of " + this._circle.label();
    }

    // recalculate the coordinates
    recalcMe() {
        this._valid = this._circle.valid();
        if (!this._valid)
            return;
        this._coords = CP1.of_complex(this._circle.circline().circle_center());
    }
}

// -----------------------------------------------------------------------------
// intersection of two lines
// -----------------------------------------------------------------------------
// a finte CP1 point, unless lines are parallel
class DGIntersectLL extends DGPoint {
    constructor(l1, l2) {
        super();
        this._l1 = l1;
        this._l2 = l2;
        // if any of the two line line changes, the intersection must be updated
        l1.addDependent(this);
        l2.addDependent(this);

        // initialize the coordinates of the intersection
        this.recalcMe();
    }

    type() {
        return "intersectLL";
    }

    defaultDescription() {
        return "intersection of " + this._l1.label() + " and " + this._l2.label();
    }

    // although the intersection is a point, it is not a free point
    isFreePoint() {
        return false;
    }

    // recalculate the coordinates
    recalcMe() {
        this._valid = this._l1.valid() && this._l2.valid();
        if (!this._valid)
            return;
        this._coords = DGLine.intersect(this._l1, this._l2);
    }
}


// -----------------------------------------------------------------------------
// object that represents the set of all intersection points between two
// geometric objects (e.g. a line and a circle, or two circles)
// -----------------------------------------------------------------------------
class DGIntersections extends DGObject {
    constructor() {
        super();
        this.hide(false);
    }

    type() {
        return "intersections";
    }
    
    // creates a single intersection point based on the given
    // selection criterion cp1 -> bool
    intersectionPoint(selectionCriterion) {
        const p = new DGIntersectPoint(this, selectionCriterion, this.description());
        // if this set of all intersection points changes, then the
        // single selected intersection point must be updated
        this.addDependent(p);
        return p;
    }

    // return any intersection point
    any() {
        return this.intersectionPoint(p => true);
    }

    // return both intersection points
    both() {
        return [this.intersectionPoint(0), this.intersectionPoint(1)];
    }

    // return any point that satisfies the given criterion (the point
    // is invalid if no intersections satisfy the given criterion)
    select(selectionFun, redraw) {
        return this.intersectionPoint(selectionFun, redraw);
    }

    // perform the selection based on the given criterion (this method
    // is called by the single intersection point objects)
    selectPoint(selectionCriterion) {
        if (typeof selectionCriterion == "function") {
            const selected = this._intersections.filter(selectionCriterion);
            if (selected.length > 0)
                return selected[0];
            console.log(selectionCriterion);
            throw "No selected points";
        }
        
        if (typeof selectionCriterion == "number") {
            if (this._intersections.length <= selectionCriterion) {
                throw "No selected points";
            }
            return this._intersections[selectionCriterion];
        }

        throw "Unknown criterion";
    }

    isNear(x, y, worldToScreen) {
        // FIXME: perform the check
        return false;
    }
}

// -----------------------------------------------------------------------------
// all intersections of a line and a circle
// -----------------------------------------------------------------------------
class DGIntersectLC extends DGIntersections {
    constructor(l, c, includeFictive) {
        super();
        this._l = l;
        this._c = c;
        this._includeFictive = includeFictive;
        // if the circle or the line changes, the intersection must be updated
        c.addDependent(this);
        l.addDependent(this);
        // initialize the intersection coordinates
        this.recalcMe();
    }

    type() {
        return "intersectLC";
    }

    defaultDescription() {
        return "intersection of " + this._l.label() + " and " + this._c.label();
    }

    // recalculate the coordinates
    recalcMe() {
        this._valid = this._l.valid() && this._c.valid();
        if (!this._valid)
            return;
        this._intersections = DGCircle.intersectLC(this._l, this._c, this._includeFictive);
    }
}


// -----------------------------------------------------------------------------
// all intersections of two circles
// -----------------------------------------------------------------------------
class DGIntersectCC extends DGIntersections {
    constructor(c1, c2, includeFictive) {
        super();
        this._c1 = c1;
        this._c2 = c2;
        this._includeFictive = includeFictive;
        // if any of the circles changes, the intersection must be updated
        c1.addDependent(this);
        c2.addDependent(this);
        // initialize the intersection coordinates
        this.recalcMe();
    }

    type() {
        return "intersectCC";
    }
    
    defaultDescription() {
        return "intersection of " + this._c1.label() + " and " + this._c2.label();
    }

    // recalculate the coordinates
    recalcMe() {
        this._valid = this._c1.valid() && this._c2.valid();
        if (!this._valid)
            return;
        this._intersections = DGCircle.intersectCC(this._c1, this._c2, this._includeFictive);
    }
}

// -----------------------------------------------------------------------------
// a single intersection point selected from the set of all intersection points
// by some criteria
// -----------------------------------------------------------------------------
class DGIntersectPoint extends DGPoint {
    constructor(intersections, selectionCriterion, description) {
        super();
        this._intersections = intersections;
        this._selectionCriterion = selectionCriterion;
        this.description(description, false);
        
        // initialize the coordinates
        this.recalcMe();
    }

    type() {
        return "intersection point";
    }

    // although this is a single point, it is not free
    isFreePoint() {
        return false;
    }
    
    // recalculate the coordinates
    recalcMe() {
        // if no point satisfies the selection criterion, then this point is invalid
        this._valid = this._intersections.valid();
        if (!this._valid)
            return;
        try {
            this._coords = this._intersections.selectPoint(this._selectionCriterion);
        } catch (err) {
            console.log(err);
            this._valid = false;
        }
    }
}

// -----------------------------------------------------------------------------
// condition
// -----------------------------------------------------------------------------

class DGIf extends DGObject {
    constructor(condition, thenObject, elseObject, dependencies) {
        super();
        this._condition = condition;
        this._thenObject = thenObject;
        this._elseObject = elseObject;
        this._dependencies = dependencies;
        thenObject.addDependent(this);
        elseObject.addDependent(this);
        dependencies.forEach(o => o.addDependent(this));
        this.recalcMe();
    }

    type() {
        return "if";
    }

    isPoint() {
        if (!this._valid)
            return false;
        return this._object.isPoint();
    }

    isLine() {
        if (!this._valid)
            return false;
        return this._object.isLine();
    }

    isCircle() {
        if (!this._valid)
            return false;
        return this._object.isLine();
    }
    
    color(c) {
        // if c is undefined get the color
        if (c === undefined)
            return this._object.color();
        
        // otherwise set the color
        this._thenObject.color(c);
        this._elseObject.color(c);
        return this;
    }

    width(w) {
        // if w is undefined get the width
        if (w === undefined)
            return this._object.width();

        // otherwise set the width
        this._thenObject.width(w);
        this._elseObject.width(w);
        return this;
    }
    
    label(l, redraw, show_label) {
        // if l is undefined get the label
        if (l === undefined)
            return this._object.label();
        
        // otherwise set the label
        this._thenObject.label(l, redraw, show_label);
        this._elseObject.label(l, redraw, show_label);
        return this;
    }

    showingLabel() {
        return this._object.showingLabel();
    }

    hasLabel() {
        return this._object.hasLabel();
    }

    defaultDescription() {
        return this._object.defaultDescription();
    }

    description(d) {
        // if d is undefined get the description
        if (d === undefined)
            return this._object.description();

        // otherwise set the description
        this._thenObject.description(d);
        this._elseObject.description(d);
        return this;
    }

    style(st, redraw) {
        if (st === undefined)
            return this._object.style();

        this._thenObject.style(st, redraw);
        this._elseObject.style(st, redraw);
    }

    is_inf() {
        return this._object.is_inf();
    }
    
    to_complex() {
        return this._object.to_complex();
    }
    
    cp1() {
        return this._object.cp1();
    }

    funArg() {
        return this._object.funArg();
    }

    x() {
        return this._object.x();
    }

    y() {
        return this._object.y();
    }
    
    coords() {
        return this._object.coords();
    }

    distance(other) {
        return this._object.distance(other);
    }

    intersect(l) {
        return this._object.intersect(l);
    }

    circline() {
        return this._object.circline();
    }

    randomPoint() {
        return this._object.randomPoint();
    }

    recalcMe() {
        this._valid = this._dependencies.every(obj => obj.valid());
        if (!this._valid)
            return;

        if (this._condition(...this._dependencies)) {
            this._object = this._thenObject;
        } else {
            this._object = this._elseObject;
        }
        this._valid = this._object.valid();
    }

    valid() {
        return this._valid && this._object.valid();
    }

    drawMe(view) {
        this._object.drawMe(view);
    }

    highlight(h, redraw) {
        if (!this._valid)
            return false;
        this._object.highlight(h, redraw);
    }

    isNear(x, y, worldToScreen) {
        if (!this._valid)
            return false;
        return this._object.isNear(x, y, worldToScreen);
    }
    
    drawLabel(view) {
        this._object.drawLabel(view);
    }

    eq(other) {
        return this._object.eq(other);
    }
}

class DGPoincareLine extends DGCircline {
    constructor(p1, p2) {
        super();
        this._p1 = p1;
        this._p2 = p2;
        // if any of the two points move, this line must be updated
        p1.addDependent(this);
        p2.addDependent(this);
        // initialize the internal circline representation (Hermitean matrix)
        this.recalcMe();
    }

    type() {
        return "poincare line";
    }

    defaultDescription() {
        return "Poincare line " + this._p1.label() + this._p2.label();
    }

    recalcMe() {
        this._valid = this._p1.valid() && this._p2.valid();
        if (!this._valid)
            return;
        const u = this._p1.cp1().to_complex();
        const v = this._p2.cp1().to_complex();
        this._circline = Circline.mk_poincare_line(u, v);
    }
}

class DGArc extends DGCircline {
    constructor(p1, p, p2) {
        super();
        this._p1 = p1;
        this._p = p;
        this._p2 = p2;
        p1.addDependent(this);
        p.addDependent(this);
        p2.addDependent(this);
        this.recalcMe();
    }

    type() {
        return "arc";
    }
    
    recalcMe() {
        this._valid = this._p1.valid() && this._p.valid() && this._p2.valid();
        if (!this._valid)
            return;
        this._circline = Circline.mk_circline3(this._p1, this._p, this._p2);
    }

    drawMe(view) {
        function canonAngle(alpha) {
            const k = Math.floor((alpha + Math.PI) / (2 * Math.PI));
            let res = alpha - 2*k*Math.PI;
            if (res < 0)
                res += 2*Math.PI;
            return res;
        }
        
        function doDraw(cl, style) {
            if (cl._circline.is_line()) {
                const [x1, y1] = cl._p1.coords();
                const [x, y] = cl._p.coords();
                const [x2, y2] = cl._p2.coords();
                if (Circline.between(cl._p1, cl._p, cl._p2))
                    view.segment(x1, y1, x2, y2, style);
                else
                    view.segment_complement(x1, y1, x2, y2, style);
            } else {
                const c = cl._circline.circle_center();
                const r = cl._circline.circle_radius();
                const a1 = -cl._p1.cp1().to_complex().sub(c).arg();
                const a = -cl._p.cp1().to_complex().sub(c).arg();
                const a2 = -cl._p2.cp1().to_complex().sub(c).arg();
                const [x, y] = c.coords();
                view.arc(x, y, r, a1, a2, canonAngle(a2 - a1) < canonAngle(a - a1), style);
            }
        }
        doDraw(this, {color: this.color(), width: this.width(), dash: this.dash()});
    }
}

class DGPoincareCircleR extends DGCircline {
    constructor(c, r) {
        super();
        this._c = c;
        this._r = r;
        // if the center moves, this circle must be updated
        c.addDependent(this);
        // if r is symbolic and it changes, this circle must be updated
        if (r instanceof DGNum)
            r.addDependent(this);
        // initialize the circline
        this.recalcMe();
    }

    type() {
        return "poincare circle";
    }

    defaultDescription() {
        return "Poincare circle c(" + this._c.label() + ", " + this.r() + ")";
    }

    r() {
        return this._r instanceof DGNum ? this._r.value() : this._r;
    }

    recalcMe() {
        this._valid = this._c.valid() && (!(this._r instanceof DGNum) || this._r.valid());
        if (!this._valid)
            return;
        const r = this.r();
        if (r <= 0) {
            this._valid = false;
            return;
        }
        const u = this._c.cp1().to_complex();
        this._circline = Circline.mk_poincare_circle(u, r);
    }
}

class DGPoincareCircle extends DGPoincareCircleR {
    constructor(c, p) {
        function r(c, p) {
            const u = c.to_complex();
            const v = p.to_complex();
            return Math.acosh(1 + (2 * u.sub(v).norm2()) / ((1 - u.norm2())* (1 - v.norm2())));
        }
        super(c, new DGNum((c, p) => r(c, p), [c, p]));
        // if the point p moves, this circle must be updated
        this._p = p;
        p.addDependent(this);
        // initialize the circline
        this.recalcMe();
    }

    type() {
        return "poincare circle";
    }

    defaultDescription() {
        return "Poincare circle c(" + this._c.label() + ", " + this._p.label() + ")";
    }
}

export { DGPoint, DGLine, DGCircle, DGSegment, DGArc, DGClone, DGRandomPoint, DGRandomPointOnCircline, DGCircleCenterPoint, DGPointFun, DGNum, DGIntersectLL, DGIntersectLC, DGIntersectCC, DGIf, DGPoincareLine, DGPoincareCircle, DGPoincareCircleR, REDRAW, NO_REDRAW };
