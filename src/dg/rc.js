import * as DG from './dg.js';
import { Circline } from '../complex_geom.js';
import { REDRAW, NO_REDRAW } from './objects.js';

// free point
function point(x, y, redraw) {
    return DG.point(x, y, redraw);
}

const free = point;

// line AB
// det: A != B
function line(A, B, redraw) {
    return DG.line(A, B, redraw);
}

// segment AB
// det: A != B
function segment(A, B, redraw) {
    return DG.segment(A, B, redraw);
}

// intersection of lines l1 and l2
// non-deg: !parallel(l1, l2)
// det: l1 != l2
function intersectLL(l1, l2, redraw) {
    return DG.intersectLL(l1, l2, redraw);
}

// both intersections of line l and circle c
// non-deg: l intersects c
function intersectLC_both(l, c, redraw) {
    return DG.intersectLC_both(l, c, redraw);
}

// other intersection of line l and circle c (different from given point A)
// non-deg: l intersects c (in two points)
function intersectLC_other(l, c, A, redraw) {
    const I = DG.intersectLC_select(l, c, p => !p.eq(A.cp1()), redraw)
    return I;
}

// circle centered at C containing A
// non-deg: C != A
function circle(C, A, redraw) {
    return DG.circle(C, A, redraw);
}

// both intersection of circles c1 and c2
// non-deg: c1 intersects c2
// det: c1 != c2
function intersectCC_both(c1, c2, redraw) {
    return DG.intersectCC_both(c1, c2, redraw);
}

// other intersection of circles c1 and c2 (different from the given point A)
// non-deg: c1 intersects c2 (in two different points)
// det: c1 != c2
function intersectCC_other(c1, c2, A, redraw) {
    return DG.intersectCC_select(c1, c2, p => !p.eq(A.cp1()), redraw);
}

// bisector of segment AB
// nondeg: A != B
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
    const Mp = DG.If((A, B) => A.eq(B), DG.clone(B, NO_REDRAW).hide(NO_REDRAW), M, [A, B], NO_REDRAW);
    Mp.description("Midpoint of segment " + A.label() + B.label(), redraw);
    return Mp;
}


// circle over segment AB
// non-deg: A != B
function circle_over_segment(A, B, redraw) {
    const l1 = line(A, B, NO_REDRAW).hide(NO_REDRAW);
    const l2 = bisector(A, B, NO_REDRAW).hide(NO_REDRAW);
    const M = intersectLL(l1, l2, NO_REDRAW).hide(NO_REDRAW);
    const c = circle(M, A, NO_REDRAW)
    c.description("Circle over segment " + A.label() + B.label(), redraw);
    return c;
}

// line perpendicular to line l containing point A
function drop_perp(l, A, redraw) {
    const B = DG.randomPointOnLine(l, NO_REDRAW).hide(NO_REDRAW); // FIXME: diffferent from A
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

// circle centered at point A that touches line l
// non-deg: A not on l
function touching_circle(A, l, redraw) {
    const p = drop_perp(l, A, NO_REDRAW).hide(NO_REDRAW);
    const M = intersectLL(p, l, NO_REDRAW).hide(NO_REDRAW);
    const c = circle(A, M, NO_REDRAW);
    c.description("Circle centered in " + A.label() + " touching line " + l.label(), redraw);
    return c;
}

// both tangents from point A that touch circle c
// non-deg: A outside c
function tangents(A, c, redraw) {
    const O = DG.center(c, NO_REDRAW).hide(NO_REDRAW);
    const c1 = circle_over_segment(O, A, NO_REDRAW).hide(NO_REDRAW);
    const [X1, X2] = intersectCC_both(c, c1, NO_REDRAW).map(p => p.hide(NO_REDRAW));
    return [line(A, X1, NO_REDRAW), line(A, X2, NO_REDRAW)].map(l => l.description(
        "Tangent from point " + A.label() + " to circle " + c.label(), redraw
    ));
}

// tangent from point A that touch circle c, that is different from the given line t
// non-deg: A outside c
function other_tangent(A, c, t, redraw) {
    const [t1, t2] = tangents(A, c, false).map(t => t.hide(NO_REDRAW));
    const t_ = DG.If((x, y) => x.eq(y), t2, t1, [t, t1], NO_REDRAW);
    t_.show(NO_REDRAW);
    t_.description("Tangent from point " + A.label() + " to circle " + c.label(), redraw);
    return t_;
}

// homothety of a line
function homothety_line() {
    // TODO
}

// parallel line to line l that contains point A
function parallel(l, A, redraw) {
    const n = drop_perp(l, A, NO_REDRAW).hide(NO_REDRAW);
    const p = drop_perp(n, A, NO_REDRAW);
    p.description("Parallel to line " + l.label() + " containing point " + A.label(), redraw);
    return p;
}


// point Z such that XY : XZ = p : q
function towards_aux(X, Y, p, q, redraw) {
    const pp = Math.abs(p), qq = Math.abs(q);
    const M = DG.randomPoint(NO_REDRAW).hide(NO_REDRAW);
    // change M whenever X and Y change
    X.addDependent(M); Y.addDependent(M);
    const l = line(X, M, NO_REDRAW).hide(NO_REDRAW);
    const points = [X, M];
    for (let i = 0; i < Math.max(pp, qq); i++) {
        const O = points[points.length - 1];
        const A = points[points.length - 2];
        const c = circle(O, A, NO_REDRAW).hide(NO_REDRAW);
        const MM = intersectLC_other(l, c, A, NO_REDRAW).hide(NO_REDRAW);
        points.push(MM);
    }

    const p1 = line(Y, points[pp], NO_REDRAW).hide(NO_REDRAW);
    const p2 = parallel(p1, points[qq], NO_REDRAW).hide(NO_REDRAW);
    const xy = line(X, Y, NO_REDRAW).hide(NO_REDRAW);
    let Z =  intersectLL(xy, p2, NO_REDRAW).hide(NO_REDRAW);

    if (p*q < 0)
        Z = reflectP(X, Z, NO_REDRAW).hide(NO_REDRAW);

    return DG.If((X, Y) => X.eq(Y), DG.clone(X, NO_REDRAW).hide(NO_REDRAW), Z, [X, Y], redraw).show(redraw);
}

// point B such that vector AB equals vector XY
function translate_vec(X, Y, A, redraw) {
    const xy = line(X, Y, NO_REDRAW).hide(NO_REDRAW);
    const xa = line(X, A, NO_REDRAW).hide(NO_REDRAW);
    const p1 = parallel(xy, A, NO_REDRAW).hide(NO_REDRAW);
    const p2 = parallel(xa, Y, NO_REDRAW).hide(NO_REDRAW);
    const B = intersectLL(p1, p2, NO_REDRAW).hide(NO_REDRAW);
    return DG.If((X, Y) => X.eq(Y),
                 DG.clone(A, NO_REDRAW).hide(NO_REDRAW),
                 DG.If((X, A) => X.eq(A),
                       DG.clone(Y, NO_REDRAW).hide(NO_REDRAW),
                       B,
                       [X, A]).hide(NO_REDRAW),
                 [X, Y], NO_REDRAW).show(redraw);
}

// point W such that XY : ZW = p : q
function towards(X, Y, Z, p, q, redraw) {
    const YY = towards_aux(X, Y, p, q, NO_REDRAW).hide(NO_REDRAW);
    const w = translate_vec(X, YY, Z, NO_REDRAW);
    let description;
    if (X == Z && p == 2 && q == 1)
        description = "Midpoint of segment " + X.label() + Y.label();
    else if (X == Z && p == 1 && q == 2)
        description = "Reflection of point " + X.label() + " about point " + Y.label();
    else if (X == Z && p == 1 && q == -1)
        description = "Reflection of point " + Y.label() + " about point " + X.label();
    else
        description = "Point X such that " + X.label() + Y.label() + ":" + Z.label() + "X" + " = " + p + ":" + q;
    w.description(description, redraw);
    return w;
}


// angle divide
function angle_divide() {
    // TODO
}

// a line that bisect the angle BAC
function angle_bisector(B, A, C, redraw) {
    const k = circle(A, B, NO_REDRAW).hide(NO_REDRAW);
    const c = line(A, B, NO_REDRAW).hide(NO_REDRAW);
    const b = line(A, C, NO_REDRAW).hide(NO_REDRAW);
    const X = DG.intersectLC_select(b, k, p => Circline.same_side(p, C, A), NO_REDRAW).hide(NO_REDRAW);
    const k1 = circle(B, X, NO_REDRAW).hide(NO_REDRAW);
    const k2 = circle(X, B, NO_REDRAW).hide(NO_REDRAW);
    const Y = DG.intersectCC_any(k1, k2, NO_REDRAW).hide(NO_REDRAW);
    const l = line(A, Y, NO_REDRAW);
    l.description("Angle " + B.label() + A.label() + C.label() + " bisector", redraw);
    return l;
}

// reflection of point B around point O
function reflectP(O, B, redraw) {
    const l = line(O, B, NO_REDRAW).hide(NO_REDRAW);
    const c = circle(O, B, NO_REDRAW).hide(NO_REDRAW);
    const BB = intersectLC_other(l, c, B, NO_REDRAW).hide(NO_REDRAW);
    const r = DG.If((O, B) => O.eq(B), DG.clone(B, NO_REDRAW).hide(NO_REDRAW), BB, [O, B], NO_REDRAW);
    r.description("Reflect point " + B.label() + " about point " + O.label(), redraw);
    return r;
}

// reflection of point A around line l
function reflectL(l, A, redraw) {
    const p = drop_perp(l, A, NO_REDRAW).hide(NO_REDRAW);
    const M = intersectLL(p, l, NO_REDRAW).hide(NO_REDRAW);
    const c = circle(M, A, NO_REDRAW).hide(NO_REDRAW);
    const AA = intersectLC_other(p, c, A, NO_REDRAW).hide(NO_REDRAW);
    const r = DG.If((A, M) => A.eq(M), DG.clone(A, NO_REDRAW).hide(NO_REDRAW), AA, [A, M], NO_REDRAW);
    r.description("Reflect point " + A.label() + " about line " + l.label(), redraw);
    return r;
}

// reflection of line l around point O 
function reflectP_line(O, l, redraw) {
    var B1 = DG.randomPointOnLine(l, NO_REDRAW).hide();
    var B2 = DG.randomPointOnLine(l, NO_REDRAW, p => !B1.eq(p)).hide();
    var B1p = reflectP(O, B1, NO_REDRAW).hide(NO_REDRAW);
    var B2p = reflectP(O, B2, NO_REDRAW).hide(NO_REDRAW);
    var lp = line(B1p, B2p, NO_REDRAW);
    lp.description("Reflect line " + l.label() + " about point " + O.label(), redraw);
    return lp;
}

// circumcenter of triangle ABC
function circle3_center(A, B, C, redraw) {
    const ma = bisector(B, C, NO_REDRAW).hide(NO_REDRAW);
    const mb = bisector(A, C, NO_REDRAW).hide(NO_REDRAW);
    const O = intersectLL(ma, mb, redraw);
    return O;
}

// point D such that H(A, B, C, D)=-1
// non-deg: collinear A, B, C and C != A and C != B and C is not midpoint of AB
function harmonic_conjugate(A, B, C, redraw) {
    const R = DG.randomPoint(NO_REDRAW).hide(NO_REDRAW);
    A.addDependent(R); B.addDependent(R); C.addDependent(R);
    const ra = line(R, A, NO_REDRAW).hide(NO_REDRAW);
    const rb = line(R, B, NO_REDRAW).hide(NO_REDRAW);
    const Q = DG.randomPointOnLine(la, NO_REDRAW).hide(NO_REDRAW);
    const qc = line(Q, C, NO_REDRAW).hide(NO_REDRAW);
    const P = intersectLL(rb, qc, NO_REDRAW).hide(NO_REDRAW);
    const ap = line(A, P, NO_REDRAW).hide(NO_REDRAW);
    const bq = line(B, Q, NO_REDRAW).hide(NO_REDRAW);
    const S = intersectLL(ap, bq, NO_REDRAW).hide(NO_REDRAW);
    const ab = line(A, B, NO_REDRAW).hide(NO_REDRAW);
    const rs = line(R, S, NO_REDRAW).hide(NO_REDRAW);
    return intersectLL(ab, rs, redraw);
}

// all significant points of the triangle
function triangle(A, B, C) {
    const elements = [A, B, C];
    // sides
    const a = line(B, C, NO_REDRAW).label("a", NO_REDRAW).color("black", NO_REDRAW).width(2, NO_REDRAW); elements.push(a);
    const b = line(A, C, NO_REDRAW).label("b", NO_REDRAW).color("black", NO_REDRAW).width(2, NO_REDRAW); elements.push(b);
    const c = line(A, B, NO_REDRAW).label("c", NO_REDRAW).color("black", NO_REDRAW).width(2, NO_REDRAW); elements.push(c);

    // side bisectors
    const ba = bisector(B, C, NO_REDRAW).color("blue", NO_REDRAW).label("b_{a}", NO_REDRAW); elements.push(ba);
    const bb = bisector(A, C, NO_REDRAW).color("blue", NO_REDRAW).label("b_{b}", NO_REDRAW); elements.push(bb);
    const bc = bisector(A, B, NO_REDRAW).color("blue", NO_REDRAW).label("b_{c}", NO_REDRAW); elements.push(bc);

    // circumcenter
    const O = intersectLL(ba, bb, NO_REDRAW).color("blue", NO_REDRAW).label("O", NO_REDRAW); elements.push(O);
    // circumcircle
    const o = circle(O, A, NO_REDRAW).color("blue", NO_REDRAW); elements.push(o);

    // side midpoints
    const Ma = midpoint(B, C, NO_REDRAW).color("green", NO_REDRAW).label("M_{a}", NO_REDRAW); elements.push(Ma);
    const Mb = midpoint(A, C, NO_REDRAW).color("green", NO_REDRAW).label("M_{b}", NO_REDRAW); elements.push(Mb);
    const Mc = midpoint(A, B, NO_REDRAW).color("green", NO_REDRAW).label("M_{c}", NO_REDRAW); elements.push(Mc);

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

    // circles over triangle sides
    const ca = circle(Ma, B, NO_REDRAW).color("DimGray", NO_REDRAW).label("c(B, C)", NO_REDRAW); elements.push(ca);
    const cb = circle(Mb, A, NO_REDRAW).color("DimGray", NO_REDRAW).label("c(A, C)", NO_REDRAW); elements.push(cb);
    const cc = circle(Mc, A, NO_REDRAW).color("DimGray", NO_REDRAW).label("c(A, B)", NO_REDRAW); elements.push(cc);

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

    // Euler line
    const e = line(O, H, NO_REDRAW).color("purple", NO_REDRAW).label("e", NO_REDRAW); elements.push(e);
    // Euler points
    const Ea = midpoint(A, H, NO_REDRAW).color("purple", NO_REDRAW).label("E_{a}", NO_REDRAW); elements.push(Ea);
    const Eb = midpoint(B, H, NO_REDRAW).color("purple", NO_REDRAW).label("E_{b}", NO_REDRAW); elements.push(Eb);
    const Ec = midpoint(C, H, NO_REDRAW).color("purple", NO_REDRAW).label("E_{c}", NO_REDRAW); elements.push(Ec);

    // Euler (nine-point) circle center
    const N = circle3_center(Ma, Mb, Mc, NO_REDRAW).color("purple", NO_REDRAW).label("N", NO_REDRAW); elements.push(N);
    // Euler (nine-point) circle
    const n = circle(N, Ma, NO_REDRAW).color("purple", NO_REDRAW).label("Ec", NO_REDRAW); elements.push(n);

    // Euler circles
    const cEaA = circle(Ea, A, NO_REDRAW).color("magenta", NO_REDRAW); elements.push(cEaA);
    const cEbB = circle(Eb, B, NO_REDRAW).color("magenta", NO_REDRAW); elements.push(cEbB);
    const cEcC = circle(Ec, C, NO_REDRAW).color("magenta", NO_REDRAW); elements.push(cEcC);

    // angle bisector and side bisector intersections
    const Na = intersectLL(ba, ta, NO_REDRAW).label("N_{a}", NO_REDRAW).color("DeepPink", NO_REDRAW); elements.push(Na);
    const Nb = intersectLL(bb, tb, NO_REDRAW).label("N_{b}", NO_REDRAW).color("DeepPink", NO_REDRAW); elements.push(Nb);
    const Nc = intersectLL(bc, tc, NO_REDRAW).label("N_{c}", NO_REDRAW).color("DeepPink", NO_REDRAW); elements.push(Nc);

    const cNaI = circle(Na, I, NO_REDRAW).color("DeepPink", NO_REDRAW); elements.push(cNaI);
    const cNbI = circle(Nb, I, NO_REDRAW).color("DeepPink", NO_REDRAW); elements.push(cNbI);
    const cNcI = circle(Nc, I, NO_REDRAW).color("DeepPink", NO_REDRAW); elements.push(cNcI);

    // angle bisector feet projections onto other triangle sides
    const Ta_b = foot(b, Ta, NO_REDRAW).color("Olive", NO_REDRAW).label("T_{ab}", NO_REDRAW); elements.push(Ta_b);
    const Ta_c = foot(c, Ta, NO_REDRAW).color("Olive", NO_REDRAW).label("T_{ac}", NO_REDRAW); elements.push(Ta_c);
    const cTa = circle(Ta, Ta_b, NO_REDRAW).color("Olive", NO_REDRAW).label("c_{Ta}", NO_REDRAW); elements.push(cTa);

    const Tb_a = foot(a, Tb, NO_REDRAW).color("Olive", NO_REDRAW).label("T_{ba}", NO_REDRAW); elements.push(Tb_a);
    const Tb_c = foot(c, Tb, NO_REDRAW).color("Olive", NO_REDRAW).label("T_{bc}", NO_REDRAW); elements.push(Tb_c);
    const cTb = circle(Tb, Tb_a, NO_REDRAW).color("Olive", NO_REDRAW).label("c_{Tb}", NO_REDRAW); elements.push(cTb);

    const Tc_a = foot(a, Tc, NO_REDRAW).color("Olive", NO_REDRAW).label("T_{ca}", NO_REDRAW); elements.push(Tc_a);
    const Tc_b = foot(b, Tc, NO_REDRAW).color("Olive", NO_REDRAW).label("T_{cb}", NO_REDRAW); elements.push(Tc_b);
    const cTc = circle(Tc, Tc_a, NO_REDRAW).color("Olive", NO_REDRAW).label("c_{Tc}", NO_REDRAW); elements.push(cTc);


    // out angle bisectors
    const sa = drop_perp(ta, A, NO_REDRAW).color("tomato", NO_REDRAW).label("s_{a}", NO_REDRAW); elements.push(sa);
    const sb = drop_perp(tb, B, NO_REDRAW).color("tomato", NO_REDRAW).label("s_{b}", NO_REDRAW); elements.push(sb);
    const sc = drop_perp(tc, C, NO_REDRAW).color("tomato", NO_REDRAW).label("s_{c}", NO_REDRAW); elements.push(sc);

    // outcircle centers
    const Ia = intersectLL(sb, sc, NO_REDRAW).color("tomato", NO_REDRAW).label("I_{a}", NO_REDRAW); elements.push(Ia);
    const Ib = intersectLL(sa, sc, NO_REDRAW).color("tomato", NO_REDRAW).label("I_{b}", NO_REDRAW); elements.push(Ib);
    const Ic = intersectLL(sa, sb, NO_REDRAW).color("tomato", NO_REDRAW).label("I_{c}", NO_REDRAW); elements.push(Ic);

    // outcenters perpendicular projections onto triangle sides
    const Spa = foot(a, Ia, NO_REDRAW).color("tomato", NO_REDRAW).label("S'_{a}", NO_REDRAW); elements.push(Spa);
    const Spb = foot(b, Ib, NO_REDRAW).color("tomato", NO_REDRAW).label("S'_{b}", NO_REDRAW); elements.push(Spb);
    const Spc = foot(c, Ic, NO_REDRAW).color("tomato", NO_REDRAW).label("S'_{b}", NO_REDRAW); elements.push(Spc);

    // outcircles
    const ia = circle(Ia, Spa, NO_REDRAW).color("tomato", NO_REDRAW).label("i_{a}", NO_REDRAW); elements.push(ia);
    const ib = circle(Ib, Spb, NO_REDRAW).color("tomato", NO_REDRAW).label("i_{b}", NO_REDRAW); elements.push(ib);
    const ic = circle(Ic, Spc, NO_REDRAW).color("tomato", NO_REDRAW).label("i_{c}", NO_REDRAW); elements.push(ic);

    // out angle bisector feet
    const Sa = intersectLL(sa, a, NO_REDRAW).color("tomato", NO_REDRAW).label("S_{a}", NO_REDRAW); elements.push(Sa);
    const Sb = intersectLL(sb, b, NO_REDRAW).color("tomato", NO_REDRAW).label("S_{b}", NO_REDRAW); elements.push(Sb);
    const Sc = intersectLL(sc, c, NO_REDRAW).color("tomato", NO_REDRAW).label("S_{c}", NO_REDRAW); elements.push(Sc);

    // circles over segments formed by inner and outer angle bisector feet
    const cTaSa = circle_over_segment(Ta, Sa, NO_REDRAW).color("IndianRed", NO_REDRAW); elements.push(cTaSa);
    const cTbSb = circle_over_segment(Tb, Sb, NO_REDRAW).color("IndianRed", NO_REDRAW); elements.push(cTbSb);
    const cTcSc = circle_over_segment(Tc, Sc, NO_REDRAW).color("IndianRed", NO_REDRAW); elements.push(cTcSc);

    // some parallel lines :)
    const IMa = line(I, Ma, NO_REDRAW).color("DarkGray", NO_REDRAW).width(1.5, NO_REDRAW); elements.push(IMa);
    const ASpa = line(A, Spa, NO_REDRAW).color("DarkGray", NO_REDRAW).width(1.5, NO_REDRAW); elements.push(ASpa);

    const IMb = line(I, Mb, NO_REDRAW).color("DarkGray", NO_REDRAW).width(1.5, NO_REDRAW); elements.push(IMb);
    const BSpb = line(B, Spb, NO_REDRAW).color("DarkGray", NO_REDRAW).width(1.5, NO_REDRAW); elements.push(BSpb);

    const IMc = line(I, Mc, NO_REDRAW).color("DarkGray", NO_REDRAW).width(1.5, NO_REDRAW); elements.push(IMc);
    const CSpc = line(C, Spc, NO_REDRAW).color("DarkGray", NO_REDRAW).width(1.5, NO_REDRAW); elements.push(CSpc);

    elements.map(obj => obj.hide());
    return elements;
}


export {
    point, free,
    line,
    segment,
    circle,
    intersectLL,
    intersectLC_both,
    intersectLC_other,
    intersectCC_both,
    intersectCC_other,

    bisector,
    drop_perp,
    foot,
    parallel,

    midpoint,
    reflectP,
    reflectL,
    homothety_line,

    circle_over_segment,
    circle3_center,
    touching_circle,
    tangents,
    other_tangent,

    towards,
    angle_bisector,
    angle_divide,

    harmonic_conjugate,

    triangle
};
