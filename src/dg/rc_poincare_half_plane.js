import * as DG from './dg.js';
import * as RC from './rc.js';
import { Circline, Complex } from '../complex_geom.js';
import { REDRAW, NO_REDRAW } from './objects.js';

const x_axis = Circline.x_axis();
const disc_up = Circline.mk_circle(new Complex(0, 10), 10);
const absolute = (function() {
    const O = DG.point(0, 0).hide(NO_REDRAW);
    const A = DG.point(1, 0).hide(NO_REDRAW);
    const a = DG.line(O, A).label("abs", NO_REDRAW).hideLabel();
    a.description("absolute", REDRAW)
    return a;
})();
const in_plane = p => { return !x_axis.in_disc(p); }

// free point (must be in the upper plane)
function point(x, y, redraw) {
    return DG.point(x, y, redraw, in_plane);
}

const free = point;

// line AB
function line(A, B, redraw) {
    return DG.poincareHalfPlaneLine(A, B);
    /*
    const b = RC.bisector(A, B).hide(NO_REDRAW);
    const O = DG.intersectLL(b, absolute).hide(NO_REDRAW);
    const c = DG.circle(O, A, NO_REDRAW);
    const l = DG.line(A, B, NO_REDRAW);
    const res = DG.If(O => O.cp1().is_inf(), l, c, [O]);
    return res;
    */
}

// intersection of lines l1 and l2
function intersectLL(l1, l2, redraw) {
    return DG.intersectCC_select(l1, l2, in_plane, redraw);
}

// both intersections of line l and circle c
function intersectLC_both(l, c, redraw) {
    return DG.intersectCC_both(l, c, redraw);
}

// other intersection of line l and circle c (different from given point A)
function intersectLC_other(l, c, A, redraw) {
    return DG.intersectCC_select(l, c, p => !p.eq(A), redraw);
}

// circle O, A
function circle(O, A, redraw) {
    return DG.poincareHalfPlaneCircle(O, A);
    
    /*
    const c = line(O, A, NO_REDRAW).hide(NO_REDRAW);
    function nondeg() {
        const p = RC.drop_perp(absolute, O, NO_REDRAW).hide(NO_REDRAW);
        const [t1, t2] = RC.tangents(A, c, NO_REDRAW).map(t => t.hide(NO_REDRAW));
        const OO = RC.intersectLL(p, t1, NO_REDRAW).hide(NO_REDRAW);
        return RC.circle(OO, A, NO_REDRAW).hide(NO_REDRAW);
    }

    function deg_O_above() {
        const M = RC.intersectLL(absolute, c, NO_REDRAW).hide(NO_REDRAW);
        const cMO = RC.circle(M, O, NO_REDRAW).hide(NO_REDRAW);
        const lA = RC.parallel(absolute, A, NO_REDRAW).hide(NO_REDRAW);

        const [X1, X2] = RC.intersectLC_both(lA, cMO, NO_REDRAW, true).map(obj => obj.hide(NO_REDRAW));
        const [t1, t2] = RC.tangents(X1, cMO, NO_REDRAW).map(obj => obj.hide(NO_REDRAW));
        const Y = RC.intersectLL(t1, c, NO_REDRAW).hide(NO_REDRAW);
        const OO = RC.midpoint(Y, A, NO_REDRAW).hide(NO_REDRAW);
        return RC.circle(OO, A, NO_REDRAW).hide(NO_REDRAW);
    }

    function deg_O_below() {
        const M = RC.intersectLL(absolute, c, NO_REDRAW).hide(NO_REDRAW);
        const cMO = RC.circle(M, O, NO_REDRAW).hide(NO_REDRAW);
        const [X1, X2] = RC.points_of_tangency(A, cMO, NO_REDRAW).map(obj => obj.hide(NO_REDRAW));
        const lA = RC.parallel(absolute, X1, NO_REDRAW).hide(NO_REDRAW);
        const Y = RC.intersectLL(lA, c, NO_REDRAW).hide(NO_REDRAW);
        const OO = RC.midpoint(Y, A, NO_REDRAW).hide(NO_REDRAW);
        return RC.circle(OO, A, NO_REDRAW).hide(NO_REDRAW);
    }
    
    const deg = DG.If((O, A) => O.y() < A.y(), deg_O_below(), deg_O_above(), [O, A], NO_REDRAW);
    return DG.If((O, A, c) => c.isLine(), deg, nondeg(), [O, A, c], redraw);
    */
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
    if (!c1.valid())
        return;
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
    const Mp = DG.If((A, B) => A.eq(B), DG.clone(B, NO_REDRAW).hide(NO_REDRAW), M, [A, B], NO_REDRAW);
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
    const B = DG.randomPointOnCircle(l, NO_REDRAW, p => !p.eq(A), disc_up).hide(NO_REDRAW);
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
    r.description("Reflect point " + B.label() + " about point " + O.label(), redraw);
    return r;
}

// reflection of pointb A around line l
function reflectL(l, A, redraw) {
    const p = drop_perp(l, A, NO_REDRAW).hide(NO_REDRAW);
    const M = intersectLL(p, l, NO_REDRAW).hide(NO_REDRAW);
    const c = circle(M, A, NO_REDRAW).hide(NO_REDRAW);
    const AA = intersectLC_other(p, c, A, NO_REDRAW).hide(NO_REDRAW);
    const r = DG.If((A, M) => A.eq(M), DG.clone(A, NO_REDRAW).hide(NO_REDRAW), AA, [A, M]);
    r.description("Reflect point " + A.label() + " about line " + l.label(), redraw);
    return r;
}

// reflection of line l around point O 
function reflectP_line(O, l, redraw) {
    var B1 = DG.randomPointOnCircle(l, NO_REDRAW, p => true, x_axis.opposite()).hide();
    var B2 = DG.randomPointOnCircle(l, NO_REDRAW, p => !B1.eq(p), x_axis.opposite()).hide();
    var B1p = reflectP(O, B1, NO_REDRAW).hide(NO_REDRAW);
    var B2p = reflectP(O, B2, NO_REDRAW).hide(NO_REDRAW);
    var lp = line(B1p, B2p, NO_REDRAW);
    lp.description("Reflect line " + l.label() + " about point " + O.label(), redraw);
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
function tangents_both(A, O, c, redraw) {
    var T = DG.randomPointOnCircle(c, NO_REDRAW, p => true, disc_up).hide();
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

    return [t1, t2, X1, X2];
}

function tangents(A, O, c, redraw) {
    const [t1, t2, X1, X2] = tangents_both(A, O, c, redraw);
    return [t1, t2];
}

// tangent from point A that touch circle c, that is different from the given line t
function other_tangent(A, O, c, t, redraw) {
    const [t1, t2] = tangents(A, O, c, NO_REDRAW).map(t => t.hide(NO_REDRAW));
    const t_ = DG.If((t, t1) => t.eq(t1, 1e-7), t2, t1, [t, t1]);
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
    const X = DG.intersectCC_select(b, k, p => !Circline.h_between_hp(p, A, C), NO_REDRAW).hide(NO_REDRAW);
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

function triangle(A, B, C) {
    const elements = [A, B, C];
    // sides
    const a = line(B, C, NO_REDRAW).label("a", NO_REDRAW).width(2, NO_REDRAW); elements.push(a);
    const b = line(A, C, NO_REDRAW).label("b", NO_REDRAW).width(2, NO_REDRAW); elements.push(b);
    const c = line(A, B, NO_REDRAW).label("c", NO_REDRAW).width(2, NO_REDRAW); elements.push(c);

    // side midpoints
    const Ma = midpoint(B, C, NO_REDRAW).color("green", NO_REDRAW).label("M_{a}", NO_REDRAW); elements.push(Ma);
    const Mb = midpoint(A, C, NO_REDRAW).color("green", NO_REDRAW).label("M_{b}", NO_REDRAW); elements.push(Mb);
    const Mc = midpoint(A, B, NO_REDRAW).color("green", NO_REDRAW).label("M_{c}", NO_REDRAW); elements.push(Mc);
    
    // side bisectors
    const ba = bisector(B, C, NO_REDRAW).color("blue", NO_REDRAW).label("b_{a}", NO_REDRAW); elements.push(ba);
    const bb = bisector(A, C, NO_REDRAW).color("blue", NO_REDRAW).label("b_{b}", NO_REDRAW); elements.push(bb);
    const bc = bisector(A, B, NO_REDRAW).color("blue", NO_REDRAW).label("b_{c}", NO_REDRAW); elements.push(bc);

    // circumcenter
    const O = intersectLL(ba, bb, NO_REDRAW).color("blue", NO_REDRAW).label("O", NO_REDRAW); elements.push(O);

    // circumcircle
    const o = circle(O, A, NO_REDRAW).color("blue", NO_REDRAW).label("o"); elements.push(o);

    // medians
    const ma = line(A, Ma, NO_REDRAW).color("green", NO_REDRAW).label("m_{a}", NO_REDRAW); elements.push(ma);
    const mb = line(B, Mb, NO_REDRAW).color("green", NO_REDRAW).label("m_{b}", NO_REDRAW); elements.push(mb);
    const mc = line(C, Mc, NO_REDRAW).color("green", NO_REDRAW).label("m_{c}", NO_REDRAW); elements.push(mc);

    // centroid
    const G = intersectLL(ma, mb, NO_REDRAW).color("green", NO_REDRAW).label("G", NO_REDRAW); elements.push(G);

    // midlines
    const MaMb = line(Ma, Mb, NO_REDRAW).color("DarkTurquoise", NO_REDRAW).label("MaMb", NO_REDRAW); elements.push(MaMb);
    const MaMc = line(Ma, Mc, NO_REDRAW).color("DarkTurquoise", NO_REDRAW).label("MaMc", NO_REDRAW); elements.push(MaMc);
    const MbMc = line(Mb, Mc, NO_REDRAW).color("DarkTurquoise", NO_REDRAW).label("MbMc", NO_REDRAW); elements.push(MbMc);
    
    // angle bisectors
    const ta = angle_bisector(B, A, C, NO_REDRAW).color("orange", NO_REDRAW).label("t_{a}", NO_REDRAW); elements.push(ta);
    const tb = angle_bisector(A, B, C, NO_REDRAW).color("orange", NO_REDRAW).label("t_{b}", NO_REDRAW); elements.push(tb);
    const tc = angle_bisector(B, C, A, NO_REDRAW).color("orange", NO_REDRAW).label("t_{c}", NO_REDRAW); elements.push(tc);
    
    // incenter
    const I = intersectLL(ta, tb, NO_REDRAW).color("orange", NO_REDRAW).label("I", NO_REDRAW); elements.push(I);

    // angle bisector feet
    const Ta = intersectLL(ta, a, NO_REDRAW).color("orange", NO_REDRAW).label("T_{a}", NO_REDRAW); elements.push(Ta);
    const Tb = intersectLL(tb, b, NO_REDRAW).color("orange", NO_REDRAW).label("T_{b}", NO_REDRAW); elements.push(Tb);
    const Tc = intersectLL(tc, c, NO_REDRAW).color("orange", NO_REDRAW).label("T_{c}", NO_REDRAW); elements.push(Tc);

    // incenter perpendicular projections onto triangle sides
    const tpa = drop_perp(a, I, NO_REDRAW).color("Chocolate", NO_REDRAW).label("t'_{a}", NO_REDRAW); elements.push(tpa);
    const tpb = drop_perp(b, I, NO_REDRAW).color("Chocolate", NO_REDRAW).label("t'_{b}", NO_REDRAW); elements.push(tpb);
    const tpc = drop_perp(c, I, NO_REDRAW).color("Chocolate", NO_REDRAW).label("t'_{c}", NO_REDRAW); elements.push(tpc);

    // incenter projection feet
    const Tpa = intersectLL(tpa, a, NO_REDRAW).color("Chocolate", NO_REDRAW).label("T'_{a}", NO_REDRAW); elements.push(Tpa);
    const Tpb = intersectLL(tpb, b, NO_REDRAW).color("Chocolate", NO_REDRAW).label("T'_{b}", NO_REDRAW); elements.push(Tpb);
    const Tpc = intersectLL(tpc, c, NO_REDRAW).color("Chocolate", NO_REDRAW).label("T'_{c}", NO_REDRAW); elements.push(Tpc);

    // incircle
    const i = circle(I, Tpa, NO_REDRAW).color("orange", NO_REDRAW).label("i", NO_REDRAW); elements.push(i);
    
    // altitudes
    const ha = drop_perp(a, A, NO_REDRAW).color("red", NO_REDRAW).label("h_{a}", NO_REDRAW); elements.push(ha);
    const hb = drop_perp(b, B, NO_REDRAW).color("red", NO_REDRAW).label("h_{b}", NO_REDRAW); elements.push(hb);
    const hc = drop_perp(c, C, NO_REDRAW).color("red", NO_REDRAW).label("h_{c}", NO_REDRAW); elements.push(hc);

    // orthocenter
    const H = intersectLL(ha, hb, NO_REDRAW).color("red", NO_REDRAW).label("H", NO_REDRAW); elements.push(H);

    // altitude feet
    const Ha = intersectLL(ha, a, NO_REDRAW).color("red", NO_REDRAW).label("H_{a}", NO_REDRAW); elements.push(Ha);
    const Hb = intersectLL(hb, b, NO_REDRAW).color("red", NO_REDRAW).label("H_{b}", NO_REDRAW); elements.push(Hb);
    const Hc = intersectLL(hc, c, NO_REDRAW).color("red", NO_REDRAW).label("H_{c}", NO_REDRAW); elements.push(Hc);


    // angle bisector feet projections onto other triangle sides
    const Ta_b = foot(b, Ta, NO_REDRAW).color("Olive", NO_REDRAW).label("T_{ab}", NO_REDRAW); elements.push(Ta_b);
    const Ta_c = foot(c, Ta, NO_REDRAW).color("Olive", NO_REDRAW).label("T_{ac}", NO_REDRAW); elements.push(Ta_c);
    const cTa = circle(Ta, Ta_b, NO_REDRAW).color("Olive", NO_REDRAW).label("c_{T_a}", NO_REDRAW); elements.push(cTa);

    const Tb_a = foot(a, Tb, NO_REDRAW).color("Olive", NO_REDRAW).label("T_{ba}", NO_REDRAW); elements.push(Tb_a);
    const Tb_c = foot(c, Tb, NO_REDRAW).color("Olive", NO_REDRAW).label("T_{bc}", NO_REDRAW); elements.push(Tb_c);
    const cTb = circle(Tb, Tb_a, NO_REDRAW).color("Olive", NO_REDRAW).label("c_{T_b}", NO_REDRAW); elements.push(cTb);

    const Tc_a = foot(a, Tc, NO_REDRAW).color("Olive", NO_REDRAW).label("T_{ca}", NO_REDRAW); elements.push(Tc_a);
    const Tc_b = foot(b, Tc, NO_REDRAW).color("Olive", NO_REDRAW).label("T_{cb}", NO_REDRAW); elements.push(Tc_b);
    const cTc = circle(Tc, Tc_a, NO_REDRAW).color("Olive", NO_REDRAW).label("c_{T_c}", NO_REDRAW); elements.push(cTc);
    
    elements.map(obj => obj.hide(NO_REDRAW));    
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

    angle_bisector,

    hyperparallel,

    touching_circle,
    tangents,
    tangents_both,
    other_tangent,
    
    
    triangle,
    
};
