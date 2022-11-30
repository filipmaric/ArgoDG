import { DGPoint, DGLine, DGCircle, DGSegment, DGArc, DGClone, DGRandomPoint, DGRandomPointOnCircline, DGCircleCenterPoint, DGPointFun, DGNum, DGIntersectLL, DGIntersectLC, DGIntersectCC, DGIf, DGPoincareDiscLine, DGPoincareDiscCircle, DGPoincareDiscCircleR, DGPoincareHalfPlaneLine, DGPoincareHalfPlaneCircle, DGPoincareHalfPlaneCircleR, REDRAW, NO_REDRAW } from './objects.js';
import { GraphicsView } from './graphis_view.js';
import { Construction } from './construction.js';
import { AnimationButtons } from './animation_buttons.js';
import { ToolDragFree, ConstructionToolbar } from './tool.js';

// -----------------------------------------------------------------------------
// API and a global register of all DGobjects
// -----------------------------------------------------------------------------

let _global_construction = new Construction();
let _global_view = null;

// current construction and view (either global or provided by the user)
let _construction = _global_construction;
let _view = _global_view;

let _animation_buttons = null;
let _construction_toolbar = null;

export function setup(element, options, xmin, xmax, ymin, ymax) {
    if (arguments.length == 2)
        _global_view = new GraphicsView(element, options);
    else
        _global_view = new GraphicsView(element, options, xmin, xmax, ymin, ymax);

    _construction = _global_construction;
    _view = _global_view;
    
    _construction.setView(_view);
    _view.setTool(new ToolDragFree(_view, _construction));
}

export function setConstruction(construction) {
    _construction = construction ? construction : _global_construction;
    _construction.setView(_view);
    _view.setConstruction(_construction);
    _view.setTool(new ToolDragFree(_view, _construction));
}

export function construction() {
    return _construction;
}

export function view() {
    return _view;
}

export function container() {
    return this.view().canvas().container();
}

export function addObject(o, redraw) {
    _construction.addObject(o, redraw);
}

export function removeObject(o, redraw) {
    _construction.removeObject(o, redraw);
}

export function point(x, y, redraw, validity_check) {
    const p = new DGPoint(x, y, validity_check);
    addObject(p, redraw);
    return p;
}

export function randomPoint(redraw, validity_check, xmin, xmax, ymin, ymax) {
    const p = new DGRandomPoint(validity_check, xmin, xmax, ymin, ymax);
    addObject(p, redraw);
    return p;
}

function randomPointOnCircline(cl, redraw, validity_check, disc) {
    const p = new DGRandomPointOnCircline(cl, {"validity_check": validity_check, "disc": disc});
    addObject(p, redraw);
    return p;
}

export function randomPointOnLine(line, redraw, validity_check, disc) {
    return randomPointOnCircline(line, redraw, validity_check, disc);
}

export function randomPointOnCircle(circle, redraw, validity_check, disc) {
    return randomPointOnCircline(circle, redraw, validity_check, disc);
}

export function pointFun(fun, dependent, redraw) {
    const p = new DGPointFun(fun, dependent);
    addObject(p, redraw);
    return p;
}

export function line(P1, P2) {
    const l = new DGLine(P1, P2);
    addObject(l);
    return l;
}

export function circle(C, P, redraw) {
    const c = new DGCircle(C, P);
    addObject(c, redraw);
    return c;
}

export function intersectLL(l1, l2, redraw) {
    const p = new DGIntersectLL(l1, l2);
    addObject(p, redraw);
    return p;
}

function intersectLC(l, c, redraw, includeFictive) {
    const p = new DGIntersectLC(l, c, includeFictive);
    addObject(p, redraw);
    return p;
}

export function intersectLC_both(l, c, redraw, includeFictive) {
    const i = intersectLC(l, c, redraw, includeFictive);
    const [p1, p2] = i.both();
    addObject(p1, false);
    addObject(p2, redraw);
    return [p1, p2];
}

export function intersectLC_any(l, c, redraw, includeFictive) {
    const i = intersectLC(l, c, redraw, includeFictive);
    const p = i.any();
    addObject(p, redraw);
    return p;
}

export function intersectLC_select(l, c, select_fun, redraw, includeFictive) {
    const i = intersectLC(l, c, redraw, includeFictive);
    const p = i.select(select_fun);
    addObject(p, redraw);
    return p;
}

function intersectCC(c1, c2, redraw, includeFictive) {
    const p = new DGIntersectCC(c1, c2, includeFictive);
    addObject(p, redraw);
    return p;
}

export function intersectCC_both(c1, c2, redraw, includeFictive) {
    const i = intersectCC(c1, c2, redraw, includeFictive);
    const [p1, p2] = i.both();
    addObject(p1, false);
    addObject(p2, redraw);
    return [p1, p2];
}

export function intersectCC_any(c1, c2, redraw, includeFictive) {
    const i = intersectCC(c1, c2, redraw, includeFictive);
    const p = i.any();
    addObject(p, redraw);
    return p;
}

export function intersectCC_select(c1, c2, select_fun, redraw, includeFictive) {
    const i = intersectCC(c1, c2, redraw, includeFictive);
    const p = i.select(select_fun);
    addObject(p, redraw);
    return p;
}

export function clone(obj, redraw) {
    const c = new DGClone(obj);
    addObject(c, redraw);
    return c;
}

export function If(cond, then_object, else_object, dependencies, redraw) {
    const p = new DGIf(cond, then_object, else_object, dependencies);
    addObject(p, redraw);
    return p;
}

export function center(c, redraw) {
    const cc = new DGCircleCenterPoint(c);
    addObject(cc, redraw);
    return cc;
}

export function poincareDiscLine(p1, p2, redraw) {
    const l = new DGPoincareDiscLine(p1, p2);
    addObject(l, redraw);
    return l;
}

export function poincareDiscCircle(c, p, redraw) {
    const pc = new DGPoincareDiscCircle(c, p);
    addObject(pc, redraw);
    return pc;
}

export function poincareDiscCircleR(c, r, redraw) {
    const pc = new DGPoincareDiscCircleR(c, r);
    addObject(pc, redraw);
    return pc;
}

export function poincareHalfPlaneLine(p1, p2, redraw) {
    const l = new DGPoincareHalfPlaneLine(p1, p2);
    addObject(l, redraw);
    return l;
}

export function poincareHalfPlaneCircle(o, a, redraw) {
    const c = new DGPoincareHalfPlaneCircle(o, a);
    addObject(c, redraw);
    return c;
}

export function poincareHalfPlaneCircleR(c, r, redraw) {
    const pc = new DGPoincareHalfPlaneCircleR(c, r);
    addObject(pc, redraw);
    return pc;
}

export function segment(p1, p2, redraw) {
    const s = new DGSegment(p1, p2);
    addObject(s, redraw);
    return s;
}

export function arc(p1, p, p2, redraw) {
    const a = new DGArc(p1, p, p2);
    addObject(a, redraw);
    return a;
}

export function num(fun, dependencies, redraw) {
    const n = new DGNum(fun, dependencies);
    addObject(n, redraw);
    return n;
}

export function findFreePointAt(x, y, transform) {
    return _construction.findFreePointAt(x, y, transform);
}
    
export function findPointAt(x, y, transform) {
    return _construction.findPointAt(x, y, transform);
}

export function findLineAt(x, y, transform) {
    return _construction.findLineAt(x, y, transform);
}

export function findCircleAt(x, y, transform) {
    return _construction.findCircleAt(x, y, transform);
}

export function findObjectsAt(x, y, transform) {
    return _construction.findObjectsAt(x, y, transform);
}

export function nextAnimationStep() {
    _construction.nextAnimationStep();
}

export function prevAnimationStep() {
    _construction.prevAnimationStep();
}

export function animate() {
    _construction.animate();
}

export function animationButtons(element) {
    if (!element)
        element = _view.canvas().container();
    if (!_animation_buttons)
        _animation_buttons = new AnimationButtons(_construction, element);
}

export function constructionToolbar(element) {
    if (!element)
        element = _view.canvas().container();
    
    if (!_construction_toolbar)
        _construction_toolbar = new ConstructionToolbar(_construction, _view, element);
}
