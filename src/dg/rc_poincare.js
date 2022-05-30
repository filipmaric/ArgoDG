import * as DG from './dg.js';
import { Complex, CP1, Circline } from '../complex_geom.js';
import { REDRAW, NO_REDRAW } from './objects.js';

const unit_circle = Circline.unit_circle();
const in_disc = p => unit_circle.in_disc(p);
const absolute = (function() {
    const O = DG.point(0, 0).hide(false);
    const X = DG.point(0, 1).hide(false);
    return DG.circle(O, X);
})();


// free point (must be in the unit disc)
function point(x, y, redraw) {
    return DG.point(x, y, redraw, in_disc);
}

const free = point;

// line AB
function line(A, B, redraw) {
    return DG.poincareLine(A, B, redraw);
}

// intersection of lines l1 and l2
function intersectLL(l1, l2, redraw) {
    return DG.intersectCC_select(l1, l2, in_disc, redraw);
}

// both intersections of line l and circle c
function intersectLC_both(l, c, redraw) {
    return DG.intersectCC_both(l, c, redraw);
}

// other intersection of line l and circle c (different from given point A)
function intersectLC_other(l, c, A, redraw) {
    return DG.intersectCC_select(l, c, p => !p.eq(A), redraw);
}

// circle centered at O containing A
function circle(O, A, redraw) {
    return DG.poincareCircle(O, A, redraw);
}

// both intersection of circles c1 and c2
function intersectCC_both(c1, c2, redraw) {
    return DG.intersectCC_both(c1, c2, redraw);
}

// other intersection of circles c1 and c2 (different from the given point A)
function intersectCC_other(c1, c2, A, redraw) {
    return DG.intersectCC_select(c1, c2, p => !p.eq(A), redraw);
}

// bisector of segment AB
function bisector(A, B, redraw) {
    const c1 = circle(A, B, NO_REDRAW).hide(NO_REDRAW);
    const c2 = circle(B, A, NO_REDRAW).hide(NO_REDRAW);
    const [X1, X2] = intersectCC_both(c1, c2, NO_REDRAW).map(p => p.hide(NO_REDRAW));
    const m = line(X1, X2, NO_REDRAW);
    m.description("Bisector of segment " + A.label() + B.label(), redraw);
    return m;
}

// midpoint of segment AB
function midpoint(A, B, redraw) {
    const m = bisector(A, B, NO_REDRAW).hide(NO_REDRAW);
    const l = line(A, B, NO_REDRAW).hide(NO_REDRAW);
    const M = intersectLL(m, l, NO_REDRAW).hide(NO_REDRAW);
    const Mp = DG.If((A, B) => A.eq(B), DG.clone(B, NO_REDRAW).hide(NO_REDRAW), M, [A, B]);
    Mp.description("Midpoint of segment " + A.label() + B.label(), redraw);
    return Mp;
}

// circle over segment AB
function circle_over_segment(A, B, redraw) {
    const l1 = line(A, B, NO_REDRAW).hide(NO_REDRAW);
    const l2 = bisector(A, B, NO_REDRAW).hide(NO_REDRAW);
    const M = intersectLL(l1, l2, NO_REDRAW).hide(NO_REDRAW);
    const c = circle(M, A, NO_REDRAW);
    c.description("Circle over segment " + A.label() + B.label(), redraw);
    return c;
}


// line perpendicular to line l containing point A
function drop_perp(l, A, redraw) {
    const B = DG.randomPointOnCircle(l, NO_REDRAW, p => true, unit_circle).hide(NO_REDRAW); // FIXME: diffferent from A
    const c = circle(A, B, NO_REDRAW).hide(NO_REDRAW);
    const [X1, X2] = intersectLC_both(l, c, NO_REDRAW).map(p => p.hide(NO_REDRAW));
    const m = bisector(X1, X2, NO_REDRAW);
    m.description("Drop perpendicular from point " + A.label() + " onto line " + l.label(), redraw);
    return m;
}

// foot of the perpendicular projection of point A onto line l
function foot(l, A, redraw)  {
    const p = drop_perp(l, A, NO_REDRAW).hide(NO_REDRAW);
    const X = intersectLL(p, l, NO_REDRAW);
    X.description("Project point " + A.label() + " onto line " + l.label(), redraw);
    return X;
}

// reflection of point B around point O
function reflectP(O, B, redraw) {
    const l = line(O, B, NO_REDRAW).hide(NO_REDRAW);
    const c = circle(O, B, NO_REDRAW).hide(NO_REDRAW);
    const BB = intersectLC_other(l, c, B, NO_REDRAW).hide(NO_REDRAW);
    const r = DG.If((O, B) => O.eq(B), DG.clone(B, NO_REDRAW).hide(NO_REDRAW), BB, [O, B]);
    r.description("Reflect point " + B.label() + " over point " + O.label(), redraw);
    return r;
}

// reflection of pointb A around line l
function reflectL(l, A, redraw) {
    const p = drop_perp(l, A, NO_REDRAW).hide(NO_REDRAW);
    const M = intersectLL(p, l, NO_REDRAW).hide(NO_REDRAW);
    const c = circle(M, A, NO_REDRAW).hide(NO_REDRAW);
    const AA = intersectLC_other(p, c, A, NO_REDRAW).hide(NO_REDRAW);
    const r = DG.If((A, M) => A.eq(M), DG.clone(A, NO_REDRAW).hide(NO_REDRAW), AA, [A, M]);
    r.description("Reflect point " + A.label() + " over line " + l.label(), redraw);
    return r;
}

// reflection of line l around point O 
function reflectP_line(O, l, redraw) {
    var B1 = DG.randomPointOnCircle(l, NO_REDRAW, p => true, unit_circle).hide();
    var B2 = DG.randomPointOnCircle(l, NO_REDRAW, p => !B1.eq(p), unit_circle).hide();
    var B1p = reflectP(O, B1, NO_REDRAW).hide(NO_REDRAW);
    var B2p = reflectP(O, B2, NO_REDRAW).hide(NO_REDRAW);
    var lp = line(B1p, B2p, NO_REDRAW);
    lp.description("Reflect " + l.label() + " over line " + l.label(), redraw);
    return lp;
}


// circle centered at point A that touches line l
function touching_circle(A, l, redraw) {
    const p = drop_perp(l, A, NO_REDRAW).hide(NO_REDRAW);
    const M = intersectLL(p, l, NO_REDRAW).hide(NO_REDRAW);
    const c = circle(A, M, NO_REDRAW);
    c.description("Circle centered in " + A.label() + " touching line " + l.label(), redraw);
    return c;
}


// both tangents from point A that touch circle c centered at O
// FIXME: remove parameter O
function tangents(A, O, c, redraw) {
    var T = DG.randomPointOnCircle(c, NO_REDRAW, p => true, unit_circle).hide();
    var ot = line(O, T, NO_REDRAW).hide(NO_REDRAW);
    var t = drop_perp(ot, T, NO_REDRAW).hide(NO_REDRAW);
    var cA = circle(O, A, NO_REDRAW).hide(NO_REDRAW);
    var [X1, X2] = intersectLC_both(t, cA, NO_REDRAW).map(p => p.hide(NO_REDRAW));

    var p1 = bisector(X1, A, NO_REDRAW).hide(NO_REDRAW);
    var T1 = reflectL(p1, T, NO_REDRAW).hide(NO_REDRAW);
    var t1 = line(A, T1, NO_REDRAW);
    
    var p2 = bisector(X2, A, NO_REDRAW).hide(NO_REDRAW);
    var T2 = reflectL(p2, T, NO_REDRAW).hide(NO_REDRAW);
    var t2 = line(A, T2, NO_REDRAW);

    t1.description("Tangent from point " + A.label() + " onto circle " + c.label(), NO_REDRAW);
    t2.description("Tangent from point " + A.label() + " onto circle " + c.label(), redraw);

    return [t1, t2];
}

// tangent from point A that touch circle c, that is different from the given line t
function other_tangent(A, O, c, t, redraw) {
    const [t1, t2] = tangents(A, O, c, NO_REDRAW).map(t => t.hide(NO_REDRAW));
    const t_ = DG.If((x, y) => x.eq(y), t2, t1, [t, t1]);
    t_.description("Tangent from point " + A.label() + " to circle " + c.label(), redraw);
    return t_;
}


// hyperparallel line to line l that contains point A 
function hyperparallel(l, A, redraw) {
    const n = drop_perp(l, A, NO_REDRAW).hide(NO_REDRAW);
    const p = drop_perp(n, A, NO_REDRAW);
    p.description("Line trough point " + A.label() + " hyperparallel to " + l.label(), redraw);
    return p;
}

// a line that bisect the angle BAC
function angle_bisector(B, A, C, redraw) {
    const k = circle(A, B, NO_REDRAW).hide(NO_REDRAW);
    const c = line(A, B, NO_REDRAW).hide(NO_REDRAW);
    const b = line(A, C, NO_REDRAW).hide(NO_REDRAW);
    const X = DG.intersectCC_select(b, k, p => !Circline.h_between(p, A, C), NO_REDRAW).hide(NO_REDRAW);
    const k1 = circle(B, X, NO_REDRAW).hide(NO_REDRAW);
    const k2 = circle(X, B, NO_REDRAW).hide(NO_REDRAW);
    const Y = DG.intersectCC_any(k1, k2, NO_REDRAW).hide(NO_REDRAW);
    const l = line(A, Y, NO_REDRAW);
    l.description("Angle " + B.label() + A.label() + C.label() + " bisector", redraw);
    return l;
}

function segment(A, B, redraw) {
    const M = midpoint(A, B, NO_REDRAW).hide(NO_REDRAW);
    const s =  DG.arc(A, M, B, NO_REDRAW);
    s.description("Segment " + A.label() + B.label(), redraw);
    return s;
}

function dist(A, B) {
    const [xa, ya] = A.coords();
    const [xb, yb] = B.coords();
    return Math.sqrt((xa - xb)*(xa - xb) + (ya - yb)*(ya - yb));
}

function hdist(A, B) {
    const u = A.to_complex();
    const v = B.to_complex();
    return Math.acosh(1 + (2 * u.sub(v).norm2()) / ((1 - u.norm2()) * (1 - v.norm2())));
}

function cosPhi(A, B, C) {
    const u = A.to_complex();
    const v = B.to_complex();
    const w = C.to_complex();
    const a = u.sub(v);
    const b = w.sub(v);
    return Complex.scalprod(a, b) / (a.norm() * b.norm());
}

// point X between P and Q such that hdist(P, X) : hdist(X, Q) = r
function ratio(P, Q, r, redraw) {
    //    if (r.value() == 1)
    //        return midpoint(P, Q);

    function fun(P, Q, r) {
        const v = dist(P.to_complex(), Q.to_complex());
        const [px, py] = P.coords();
        const [qx, qy] = Q.coords();
        const cx = (qx-r*r*px)/(1-r*r);
        const cy = (qy-r*r*py)/(1-r*r);
        const rr = v * r / Math.abs(1 - r*r);
        return [cx, cy, rr];
    }
    
    const C1 = DG.pointFun((P, Q, r) => {
        const [cx, cy, rr] = fun(P, Q, r);
        return new CP1(new Complex(cx, cy));
    }, [P, Q, r], NO_REDRAW).hide(NO_REDRAW);
    const C2 = DG.pointFun((P, Q, r) => {
        const [cx, cy, rr] = fun(P, Q, r);
        return new CP1(new Complex(cx+rr, cy));
    }, [P, Q, r], NO_REDRAW).hide(NO_REDRAW);
    const k = DG.circle(C1, C2, NO_REDRAW).hide(NO_REDRAW);
    const h = line(P, Q, NO_REDRAW).hide(NO_REDRAW);
    return DG.intersectCC_select(h, k, p => Circline.h_between(P, p, Q), redraw);
}

function on_line_hdist(l, A, d, cond, redraw) {
    const c = DG.poincareCircleR(A, d, NO_REDRAW).hide(NO_REDRAW);
    if (cond === undefined)
        return DG.intersectCC_both(l, c, redraw);
    else
        return DG.intersectCC_select(l, c, cond, redraw);
}

function w28(A, B, G, redraw)
{
    const Mc = midpoint(A, B, NO_REDRAW).hide(NO_REDRAW);
    const h = line(Mc, G, NO_REDRAW).hide(NO_REDRAW);
    const s = DG.num((A, B, G, Mc) => 2 * Math.cosh(hdist(A, B)/2) * Math.sinh(hdist(G, Mc)), [A, B, G, Mc]);
    const r = DG.num(s => Math.asinh(s), [s]);
    // point C on line h such that sinh(hdist(C, G)) = s and h_between(C, G, Mc)
    const C = on_line_hdist(h, G, r, p => Circline.h_between(p, G, Mc), redraw);
    return C;
}

function w29(h, C, G, Mc, redraw) {
    const s = DG.num((C, G, Mc) => Math.sinh(hdist(C, G)) / (2 * Math.sinh(hdist(G, Mc))), [C, G, Mc]);
    const r = DG.num(s => Math.acosh(s), [s]);
    // points A and B on line h such that cosh(d(Mc, A)) = cosh(d(Mc, B)) = s
    const [A, B] = on_line_hdist(h, Mc, r, redraw);
    return [A, B];
}

function w30(G, O, Mc, redraw) {
    const s = DG.num((G, O, Mc) => (Math.cosh(hdist(O, Mc)))/(2*Math.cosh(hdist(G, O))*Math.sinh(hdist(G, Mc))) - Math.tanh(hdist(G, O)) * cosPhi(Mc, G, O), [G, O, Mc]);
    const r = DG.num(s => Math.atanh(1/s), [s]);
    const h = line(Mc, G, NO_REDRAW).hide(NO_REDRAW);
    const C = on_line_hdist(h, G, r, p => Circline.h_between(p, G, Mc), redraw);
    return C;
}


function w31(G, O, C, redraw) {
    const s = DG.num((G, O, C) => (2*Math.cosh(hdist(C, O)) / (Math.cosh(hdist(G, O))*Math.sinh(hdist(C, G)))) - Math.tanh(hdist(G, O)) * cosPhi(C, G, O), [G, O, C]);
    const r = DG.num(s => Math.atanh(1/s), [s]);
    const h = line(C, G, NO_REDRAW).hide(NO_REDRAW);
    const Mc = on_line_hdist(h, G, r, p => Circline.h_between(C, G, p), redraw);
    return Mc;
}

function triangle(A, B, C) {
    const elements = [A, B, C];
    // sides
    const a = line(B, C).label("a").width(2); elements.push(a);
    const b = line(A, C).label("b").width(2); elements.push(b);
    const c = line(A, B).label("c").width(2); elements.push(c);

    // side midpoints
    const Ma = midpoint(B, C).color("green").label("M_{a}"); elements.push(Ma);
    const Mb = midpoint(A, C).color("green").label("M_{b}"); elements.push(Mb);
    const Mc = midpoint(A, B).color("green").label("M_{c}"); elements.push(Mc);
    
    // side bisectors
    const ba = bisector(B, C).color("blue").label("b_{a}"); elements.push(ba);
    const bb = bisector(A, C).color("blue").label("b_{b}"); elements.push(bb);
    const bc = bisector(A, B).color("blue").label("b_{c}"); elements.push(bc);

    // circumcenter
    const O = intersectLL(ba, bb).color("blue").label("O"); elements.push(O);

    // circumcircle
    const o = circle(O, A).color("blue"); elements.push(o);

    // medians
    const ma = line(A, Ma).color("green").label("m_{a}"); elements.push(ma);
    const mb = line(B, Mb).color("green").label("m_{b}"); elements.push(mb);
    const mc = line(C, Mc).color("green").label("m_{c}"); elements.push(mc);

    // centroid
    const G = intersectLL(ma, mb).color("green").label("G"); elements.push(G);

    // midlines
    const MaMb = line(Ma, Mb).color("DarkTurquoise").label("MaMb"); elements.push(MaMb);
    const MaMc = line(Ma, Mc).color("DarkTurquoise").label("MaMc"); elements.push(MaMc);
    const MbMc = line(Mb, Mc).color("DarkTurquoise").label("MbMc"); elements.push(MbMc);
    
    // angle bisectors
    const ta = angle_bisector(B, A, C).color("orange").label("t_{a}"); elements.push(ta);
    const tb = angle_bisector(A, B, C).color("orange").label("t_{b}"); elements.push(tb);
    const tc = angle_bisector(B, C, A).color("orange").label("t_{c}"); elements.push(tc);
    
    // incenter
    const I = intersectLL(ta, tb).color("orange").label("I"); elements.push(I);

    // angle bisector feet
    const Ta = intersectLL(ta, a).color("orange").label("T_{a}"); elements.push(Ta);
    const Tb = intersectLL(tb, b).color("orange").label("T_{b}"); elements.push(Tb);
    const Tc = intersectLL(tc, c).color("orange").label("T_{c}"); elements.push(Tc);

    // incenter perpendicular projections onto triangle sides
    const tpa = drop_perp(a, I).color("Chocolate").label("t'_{a}"); elements.push(tpa);
    const tpb = drop_perp(b, I).color("Chocolate").label("t'_{b}"); elements.push(tpb);
    const tpc = drop_perp(c, I).color("Chocolate").label("t'_{c}"); elements.push(tpc);

    // incenter projection feet
    const Tpa = intersectLL(tpa, a).color("Chocolate").label("T'_{a}"); elements.push(Tpa);
    const Tpb = intersectLL(tpb, b).color("Chocolate").label("T'_{b}"); elements.push(Tpb);
    const Tpc = intersectLL(tpc, c).color("Chocolate").label("T'_{c}"); elements.push(Tpc);

    // incircle
    const i = circle(I, Tpa).color("orange").label("i"); elements.push(i);
    
    // altitudes
    const ha = drop_perp(a, A).color("red").label("h_{a}"); elements.push(ha);
    const hb = drop_perp(b, B).color("red").label("h_{b}"); elements.push(hb);
    const hc = drop_perp(c, C).color("red").label("h_{c}"); elements.push(hc);

    // orthocenter
    const H = intersectLL(ha, hb).color("red").label("H"); elements.push(H);

    // altitude feet
    const Ha = intersectLL(ha, a).color("red").label("H_{a}"); elements.push(Ha);
    const Hb = intersectLL(hb, b).color("red").label("H_{b}"); elements.push(Hb);
    const Hc = intersectLL(hc, c).color("red").label("H_{c}"); elements.push(Hc);

    elements.map(obj => obj.hide());
    return elements;
}

export {
    absolute,
    
    point, free,

    line,
    circle,
    segment,

    intersectLL,
    intersectLC_both,
    intersectLC_other,
    intersectCC_both,
    intersectCC_other,

    midpoint,
    reflectP,
    reflectL,
    reflectP_line,

    bisector,
    drop_perp,
    foot,

    hyperparallel,

    touching_circle,
    tangents,
    other_tangent,
    
    
    ratio,
    w28, w29, w30, w31,
    
    triangle,
    
};
