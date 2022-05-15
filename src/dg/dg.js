import { DGPoint, DGLine, DGCircle, DGSegment, DGClone, DGRandomPoint, DGCircleCenterPoint, DGIntersectLL, DGIntersectLC, DGIntersectCC, DGIf, DGPoincareLine, DGPoincareCircle } from './objects.js';
import { View } from './view.js';
import { Construction } from './construction.js';
import { AnimationButtons } from './animation_buttons.js';
import { ConstructionToolbar } from './tool.js';

// -----------------------------------------------------------------------------
// API and a global register of all DGobjects
// -----------------------------------------------------------------------------

let _construction = new Construction();
let _view = null;
let _animation_buttons = null;
let _construction_toolbar = null;

export function setup(element, options, xmin, xmax, ymin, ymax) {
    if (arguments.length == 2)
        _view = new View(element, options);
    else
        _view = new View(element, options, xmin, xmax, ymin, ymax);
    _construction.addView(_view);
}

export function construction() {
    return _construction;
}

export function view() {
    return _view;
}

export function addObject(o, redraw) {
    _construction.addObject(o, redraw);
}
    
export function draw() {
    _construction.draw();
}

export function point(x, y, validity_check) {
    const p = new DGPoint(x, y);
    if (validity_check)
        p.validityCheck(validity_check);
    addObject(p);
    return p;
}

export function randomPoint(validity_check, xmin, xmax, ymin, ymax) {
    const p = new DGRandomPoint(validity_check, xmin, xmax, ymin, ymax);
    addObject(p);
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

export function intersectLC(l, c, redraw) {
    const p = new DGIntersectLC(l, c);
    addObject(p, redraw);
    return p;
}

export function intersectCC(c1, c2, redraw) {
    const p = new DGIntersectCC(c1, c2);
    addObject(p, redraw);
    return p;
}

export function If(cond, then_object, else_object, dependencies, redraw) {
    const p = new DGIf(cond, then_object, else_object, dependencies);
    addObject(p, redraw);
    return p;
}

export function poincareLine(p1, p2, redraw) {
    const l = new DGPoincareLine(p1, p2);
    addObject(l, redraw);
    return l;
}

export function poincareCircle(c, p, redraw) {
    const pc = new DGPoincareCircle(c, p);
    addObject(pc, redraw);
    return pc;
}

export function segment(p1, p2, redraw) {
    const s = new DGSegment(p1, p2);
    addObject(s, redraw);
    return s;
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

export function animationButtons() {
    if (!_animation_buttons)
        _animation_buttons = new AnimationButtons(_construction, _view.canvas().container());
}

export function constructionToolbar() {
    if (!_construction_toolbar)
        _construction_toolbar = new ConstructionToolbar(_construction, _view, _view.canvas().container());
}
