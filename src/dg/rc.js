import * as DG from './dg.js';
import { Circline } from '../complex_geom.js';

// free point
function point(x, y) {
    return DG.point(x, y);
}

const free = point;

// line AB
// det: A != B
function line(A, B) {
    return DG.line(A, B);
}

// segment AB
// det: A != B
function segment(A, B) {
    return DG.segment(A, B);
}

// intersection of lines l1 and l2
// non-deg: !parallel(l1, l2)
// det: l1 != l2
function intersectLL(l1, l2) {
    return DG.intersectLL(l1, l2);
}

// both intersections of line l and circle c
// non-deg: l intersects c
function intersectLC(l, c) {
    return DG.intersectLC(l, c).both();
}

// other intersection of line l and circle c (different from given point A)
// non-deg: l intersects c (in two points)
function intersectLC_other(l, c, A) {
    const I = DG.intersectLC(l, c).select(p => !p.eq(A.cp1()))
    return I;
}

// circle centered at C containing A
// non-deg: C != A
function circle(C, A) {
    return DG.circle(C, A);
}

// both intersection of circles c1 and c2
// non-deg: c1 intersects c2
// det: c1 != c2
function intersectCC(c1, c2) {
    return DG.intersectCC(c1, c2).both();
}

// other intersection of circles c1 and c2 (different from the given point A)
// non-deg: c1 intersects c2 (in two different points)
// det: c1 != c2
function intersectCC_other(c1, c2, A) {
    return DG.intersectCC(c1, c2).select(p => !p.eq(A.cp1()));
}

// bisector of segment AB
// nondeg: A != B
function bisector(A, B) {
    const c1 = circle(A, B).hide();
    const c2 = circle(B, A).hide();
    const [X1, X2] = intersectCC(c1, c2).map(p => p.hide());
    const m = line(X1, X2);
    m.description("Bisector of segment " + A.label() + B.label());
    return m;
}


// midpoint of segment AB
function midpoint(A, B) {
    const m = bisector(A, B).hide();
    const l = line(A, B).hide();
    const M = intersectLL(m, l).hide();
    const Mp = DG.If((A, B) => A.eq(B), B.clone().hide(), M, [A, B]);
    Mp.description("Midpoint of segment " + A.label() + B.label());
    return Mp;
}


// circle over segment AB
// non-deg: A != B
function circle_over_segment(A, B) {
    const l1 = line(A, B).hide();
    const l2 = bisector(A, B).hide();
    const M = intersectLL(l1, l2).hide();
    return circle(M, A);
}

// line perpendicular to line l containing point A
function drop_perp(l, A) {
    const B = l.randomPoint().hide(); // FIXME: diffferent from A
    const c = circle(A, B).hide();
    const [X1, X2] = intersectLC(l, c).map(p => p.hide());
    const m = bisector(X1, X2);
    m.description("Drop perpendicular from point " + A.label() + " onto line " + l.label());
    return m;
}

// foot of the perpendicular projection of point A onto line l
function foot(l, A)  {
    const p = drop_perp(l, A).hide();
    const X = intersectLL(p, l);
    X.description("Project point " + A.label() + " onto line " + l.label());
    return X;
}

// circle centered at point A that touches line l
// non-deg: A not on l
function touching_circle(A, l) {
    const p = drop_perp(l, A).hide();
    const M = intersectLL(p, l).hide();
    const c = circle(A, M);
    c.description("Circle centered in " + A.label() + " touching line " + l.label());
    return c;
}

// both tangents from point A that touch circle c
// non-deg: A outside c
function tangents(A, c) {
    const O = c.center().hide();
    const c1 = circle_over_segment(O, A).hide();
    const [X1, X2] = intersectCC(c, c1).map(p => p.hide());
    return [line(A, X1).hide(), line(A, X2).hide()];
}

// tangent from point A that touch circle c, that is different from the given line t
// non-deg: A outside c
function other_tangent(A, c, t) {
    const [t1, t2] = tangents(A, c);
    const t_ = DG.If((x, y) => x.eq(y), t2, t1, [t, t1]);
    t_.description("Tangent from point " + A.label() + " to circle " + c.label());
    return t_.show();
}

// homothety of a line
function homothety_line() {
    // TODO
}

// parallel line to line l that contains point A
function parallel(l, A) {
    const n = drop_perp(l, A).hide();
    return drop_perp(n, A);
}


// point Z such that XY : XZ = p : q
function towards_aux(X, Y, p, q) {

    const pp = Math.abs(p), qq = Math.abs(q);
    const M = DG.randomPoint().hide();
    // change M whenever X and Y change
    X.addDependent(M); Y.addDependent(M);
    const l = line(X, M).hide();
    const points = [X, M];
    for (let i = 0; i < Math.max(pp, qq); i++) {
        const O = points[points.length - 1];
        const A = points[points.length - 2];
        const c = circle(O, A).hide();
        const MM = intersectLC_other(l, c, A).hide();
        points.push(MM);
    }

    const p1 = line(Y, points[pp]).hide();
    const p2 = parallel(p1, points[qq]).hide();
    const xy = line(X, Y).hide();
    let Z =  intersectLL(xy, p2).hide();

    if (p*q < 0)
        Z = reflectP(X, Z).hide();
    
    return DG.If((X, Y) => X.eq(Y), X.clone().hide(), Z, [X, Y]);
}

// point B such that vector AB equals vector XY
function translate_vec(X, Y, A) {
    const xy = line(X, Y).hide();
    const xa = line(X, A).hide();
    const p1 = parallel(xy, A).hide();
    const p2 = parallel(xa, Y).hide();
    const B = intersectLL(p1, p2).hide();
    return DG.If((X, Y) => X.eq(Y),
                 A.clone().hide(),
                 DG.If((X, A) => X.eq(A),
                       Y.clone().hide(),
                       B,
                       [X, A]).hide(),
                 [X, Y]);
}

// point W such that XY : ZW = p : q
function towards(X, Y, Z, p, q) {
    const YY = towards_aux(X, Y, p, q).hide();
    const w = translate_vec(X, YY, Z).show();
    w.description("Point X such that " + X.label() + Y.label() + ":" + Z.label() + "X" + " = " + p + ":" + q);
    return w;
}


// angle divide
function angle_divide() {
    // TODO
}

// a line that bisect the angle BAC
function angle_bisector(B, A, C) {
    const k = circle(A, B).hide();
    const c = line(A, B).hide();
    const b = line(A, C).hide();
    const X = DG.intersectLC(b, k).select(p => Circline.same_side(p, C.cp1(), A.cp1())).hide();
    const k1 = circle(B, X).hide();
    const k2 = circle(X, B).hide();
    const Y = DG.intersectCC(k1, k2).any().hide();
    const l = line(A, Y);
    return l;
}

// reflection of point B around point O
function reflectP(O, B) {
    const l = line(O, B).hide();
    const c = circle(O, B).hide();
    const BB = intersectLC_other(l, c, B).hide();
    const r = DG.If((O, B) => O.eq(B), B.clone().hide(), BB, [O, B]);
    r.description("Reflect point " + B.label() + " over point " + O.label());
    return r;
}

// reflection of point A around line l
function reflectL(l, A) {
    const p = drop_perp(l, A).hide();
    const M = intersectLL(p, l).hide();
    const c = circle(M, A).hide();
    const AA = intersectLC_other(p, c, A).hide();
    const r = DG.If((A, M) => A.eq(M), A.clone().hide(), AA, [A, M]);
    r.description("Reflect point " + A.label() + " over line " + l.label());
    return r;
}

// circumcenter of triangle ABC 
function circle3_center(A, B, C) {
    const ma = bisector(B, C).hide();
    const mb = bisector(A, C).hide();
    const O = intersectLL(ma, mb);
    return O;
}

// point D such that H(A, B, C, D)=-1 
// non-deg: collinear A, B, C and C != A and C != B and C is not midpoint of AB
function harmonic_conjugate(A, B, C) {
    const R = DG.randomPoint().hide();
    A.addDependent(R); B.addDependent(R); C.addDependent(R);
    const ra = line(R, A).hide();
    const rb = line(R, B).hide();
    const Q = ra.randomPoint().hide();
    const qc = line(Q, C).hide();
    const P = intersectLL(rb, qc).hide();
    const ap = line(A, P).hide();
    const bq = line(B, Q).hide();
    const S = intersectLL(ap, bq).hide();
    const ab = line(A, B).hide();
    const rs = line(R, S).hide();
    return intersectLL(ab, rs);
}

// all significant points of the triangle
function triangle(A, B, C) {
    const elements = [A, B, C];
    // sides
    const a = line(B, C).label("a").color("black").width(2); elements.push(a);
    const b = line(A, C).label("b").color("black").width(2); elements.push(b);
    const c = line(A, B).label("c").color("black").width(2); elements.push(c);

    // side bisectors
    const ba = bisector(B, C).color("blue").label("b_{a}"); elements.push(ba);
    const bb = bisector(A, C).color("blue").label("b_{b}"); elements.push(bb);
    const bc = bisector(A, B).color("blue").label("b_{c}"); elements.push(bc);
    
    // circumcenter
    const O = intersectLL(ba, bb).color("blue").label("O"); elements.push(O);
    // circumcircle
    const o = circle(O, A).color("blue"); elements.push(o);

    // side midpoints
    const Ma = midpoint(B, C).color("green").label("M_{a}"); elements.push(Ma);
    const Mb = midpoint(A, C).color("green").label("M_{b}"); elements.push(Mb);
    const Mc = midpoint(A, B).color("green").label("M_{c}"); elements.push(Mc);

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

    // circles over triangle sides
    const ca = circle(Ma, B).color("DimGray"); elements.push(ca);
    const cb = circle(Mb, A).color("DimGray"); elements.push(cb);
    const cc = circle(Mc, A).color("DimGray"); elements.push(cc);
    
    // medians
    const ma = line(A, Ma).color("green").label("m_{a}"); elements.push(ma);
    const mb = line(B, Mb).color("green").label("m_{b}"); elements.push(mb);
    const mc = line(C, Mc).color("green").label("m_{c}"); elements.push(mc);

    // centroid
    const G = intersectLL(ma, mb).color("green").label("G"); elements.push(G);

    // midlines
    const MaMb = line(Ma, Mb).color("DarkTurquoise"); elements.push(MaMb);
    const MaMc = line(Ma, Mc).color("DarkTurquoise"); elements.push(MaMc);
    const MbMc = line(Mb, Mc).color("DarkTurquoise"); elements.push(MbMc);

    // Euler line
    const e = line(O, H).color("purple").label("e"); elements.push(e);
    // Euler points
    const Ea = midpoint(A, H).color("purple").label("E_{a}"); elements.push(Ea);
    const Eb = midpoint(B, H).color("purple").label("E_{b}"); elements.push(Eb);
    const Ec = midpoint(C, H).color("purple").label("E_{c}"); elements.push(Ec);

    // Euler (nine-point) circle center
    const N = circle3_center(Ma, Mb, Mc).color("purple").label("N"); elements.push(N);
    // Euler (nine-point) circle
    const n = circle(N, Ma).color("purple").label("Ec"); elements.push(n);

    // Euler circles
    const cEaA = circle(Ea, A).color("magenta"); elements.push(cEaA);
    const cEbB = circle(Eb, B).color("magenta"); elements.push(cEbB);
    const cEcC = circle(Ec, C).color("magenta"); elements.push(cEcC);

    // angle bisector and side bisector intersections
    const Na = intersectLL(ba, ta).label("N_{a}").color("DeepPink"); elements.push(Na);
    const Nb = intersectLL(bb, tb).label("N_{b}").color("DeepPink"); elements.push(Nb);
    const Nc = intersectLL(bc, tc).label("N_{c}").color("DeepPink"); elements.push(Nc);

    const cNaI = circle(Na, I).color("DeepPink"); elements.push(cNaI);
    const cNbI = circle(Nb, I).color("DeepPink"); elements.push(cNbI);
    const cNcI = circle(Nc, I).color("DeepPink"); elements.push(cNcI);

    // angle bisector feet projections onto other triangle sides
    const Ta_b = foot(b, Ta).color("Olive").label("T_{ab}"); elements.push(Ta_b);
    const Ta_c = foot(c, Ta).color("Olive").label("T_{ac}"); elements.push(Ta_c);
    const cTa = circle(Ta, Ta_b).color("Olive").label("c_{Ta}"); elements.push(cTa);

    const Tb_a = foot(a, Tb).color("Olive").label("T_{ba}"); elements.push(Tb_a);
    const Tb_c = foot(c, Tb).color("Olive").label("T_{bc}"); elements.push(Tb_c);
    const cTb = circle(Tb, Tb_a).color("Olive").label("c_{Tb}"); elements.push(cTb);

    const Tc_a = foot(a, Tc).color("Olive").label("T_{ca}"); elements.push(Tc_a);
    const Tc_b = foot(b, Tc).color("Olive").label("T_{cb}"); elements.push(Tc_b);
    const cTc = circle(Tc, Tc_a).color("Olive").label("c_{Tc}"); elements.push(cTc);


    // out angle bisectors
    const sa = drop_perp(ta, A).color("tomato").label("s_{a}"); elements.push(sa);
    const sb = drop_perp(tb, B).color("tomato").label("s_{b}"); elements.push(sb);
    const sc = drop_perp(tc, C).color("tomato").label("s_{c}"); elements.push(sc);

    // outcircle centers
    const Ia = intersectLL(sb, sc).color("tomato").label("I_{a}"); elements.push(Ia);
    const Ib = intersectLL(sa, sc).color("tomato").label("I_{b}"); elements.push(Ib);
    const Ic = intersectLL(sa, sb).color("tomato").label("I_{c}"); elements.push(Ic);

    // outcenters perpendicular projections onto triangle sides
    const Spa = foot(a, Ia).color("tomato").label("S'_{a}"); elements.push(Spa);
    const Spb = foot(b, Ib).color("tomato").label("S'_{b}"); elements.push(Spb);
    const Spc = foot(c, Ic).color("tomato").label("S'_{b}"); elements.push(Spc);

    // outcircles
    const ia = circle(Ia, Spa).color("tomato").label("i_{a}"); elements.push(ia);
    const ib = circle(Ib, Spb).color("tomato").label("i_{b}"); elements.push(ib);
    const ic = circle(Ic, Spc).color("tomato").label("i_{c}"); elements.push(ic);

    // out angle bisector feet
    const Sa = intersectLL(sa, a).color("tomato").label("S_{a}"); elements.push(Sa);
    const Sb = intersectLL(sb, b).color("tomato").label("S_{b}"); elements.push(Sb);
    const Sc = intersectLL(sc, c).color("tomato").label("S_{c}"); elements.push(Sc);

    // circles over segments formed by inner and outer angle bisector feet
    const cTaSa = circle_over_segment(Ta, Sa).color("IndianRed"); elements.push(cTaSa);
    const cTbSb = circle_over_segment(Tb, Sb).color("IndianRed"); elements.push(cTbSb);
    const cTcSc = circle_over_segment(Tc, Sc).color("IndianRed"); elements.push(cTcSc);

    // some parallel lines :)
    const IMa = line(I, Ma).color("DarkGray").width(1.5); elements.push(IMa);
    const ASpa = line(A, Spa).color("DarkGray").width(1.5); elements.push(ASpa);

    const IMb = line(I, Mb).color("DarkGray").width(1.5); elements.push(IMb);
    const BSpb = line(B, Spb).color("DarkGray").width(1.5); elements.push(BSpb);

    const IMc = line(I, Mc).color("DarkGray").width(1.5); elements.push(IMc);
    const CSpc = line(C, Spc).color("DarkGray").width(1.5); elements.push(CSpc);
    
    elements.map(obj => obj.hide());
    return elements;
}


export {
    point, free,
    line,
    segment,
    circle,
    intersectLL,
    intersectLC,
    intersectLC_other,
    intersectCC,
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
