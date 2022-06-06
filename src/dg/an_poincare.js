import * as DG from './dg.js';
import * as RCP from './rc_poincare.js';
import { Complex, CP1, Circline } from '../complex_geom.js';
import { REDRAW, NO_REDRAW } from './objects.js';

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
        return new Complex(cx, cy);
    }, [P, Q, r], NO_REDRAW).hide(NO_REDRAW);
    const C2 = DG.pointFun((P, Q, r) => {
        const [cx, cy, rr] = fun(P, Q, r);
        return new Complex(cx+rr, cy);
    }, [P, Q, r], NO_REDRAW).hide(NO_REDRAW);
    const k = DG.circle(C1, C2, NO_REDRAW).hide(NO_REDRAW);
    const h = line(P, Q, NO_REDRAW).hide(NO_REDRAW);
    const X = DG.intersectCC_select(h, k, p => Circline.h_between(P, p, Q), NO_REDRAW).hide(NO_REDRAW);
    const M = RCP.midpoint(P, Q, NO_REDRAW).hide(NO_REDRAW);
    const res = DG.If(r => r != 1, X, M, [r]);
    res.descriptions("Point X between " + P.label() + " and " + Q.label() + " determined by ratio").show(redraw);
    return res;
}

function on_line_hdist(l, A, d, cond) {
    const c = DG.poincareCircleR(A, d, NO_REDRAW).hide(NO_REDRAW);
    if (cond === undefined)
        return DG.intersectCC_both(l, c);
    else
        return DG.intersectCC_select(l, c, cond);
}

function C_from_ABG(A, B, G, redraw)
{
    const Mc = RCP.midpoint(A, B, NO_REDRAW).hide(NO_REDRAW);
    const mc = RCP.line(Mc, G, NO_REDRAW).hide(NO_REDRAW);
    const s = DG.num((A, B, G, Mc) => 2 * Math.cosh(hdist(A, B)/2) * Math.sinh(hdist(G, Mc)), [A, B, G, Mc]);
    const r = DG.num(s => Math.asinh(s), [s]);
    // point C on line mc such that sinh(hdist(C, G)) = s and h_between(C, G, Mc)
    const C = on_line_hdist(mc, G, r, p => Circline.h_between(p, G, Mc));
    C.description("Calculated from centroid " + G.label() + " and vertices " + A.label() + " and " + B.label(), redraw)
    return C;
}

function AB_from_cCGMc(c, C, G, Mc, redraw) {
    const s = DG.num((C, G, Mc) => Math.sinh(hdist(C, G)) / (2 * Math.sinh(hdist(G, Mc))), [C, G, Mc]);
    const r = DG.num(s => Math.acosh(s), [s]);
    // points A and B on line c such that cosh(d(Mc, A)) = cosh(d(Mc, B)) = s
    const [A, B] = on_line_hdist(c, Mc, r)
    const desc = "Calculated from centroid " + G.label() + " and midpoint " + Mc.label();
    A.description(desc, NO_REDRAW);
    B.description(desc, redraw);
    return [A, B];
}

function C_from_GOMc(G, O, Mc, redraw) {
    const s = DG.num((G, O, Mc) => (Math.cosh(hdist(O, Mc)))/(2*Math.cosh(hdist(G, O))*Math.sinh(hdist(G, Mc))) - Math.tanh(hdist(G, O)) * cosPhi(Mc, G, O), [G, O, Mc]);
    const r = DG.num(s => Math.atanh(1/s), [s]);
    const mc = RCP.line(Mc, G, NO_REDRAW).hide(NO_REDRAW);
    const C = on_line_hdist(mc, G, r, p => Circline.h_between(p, G, Mc));
    C.description("Calcluated from centroid " + G.label() + ", circumcenter " + O.label() + ", and midpoint " + Mc.label(), redraw);
    return C;
}


function Mc_from_GOC(G, O, C, redraw) {
    const s = DG.num((G, O, C) => (2*Math.cosh(hdist(C, O)) / (Math.cosh(hdist(G, O))*Math.sinh(hdist(C, G)))) - Math.tanh(hdist(G, O)) * cosPhi(C, G, O), [G, O, C]);
    const r = DG.num(s => Math.atanh(1/s), [s]);
    const mc = RCP.line(C, G, NO_REDRAW).hide(NO_REDRAW);
    const Mc = on_line_hdist(mc, G, r, p => Circline.h_between(C, G, p));
    Mc.description("Calcluated from centroid " + G.label() + ", circumcenter " + O.label() + ", and vertex " + C.label(), redraw);
    return Mc;
}

export {
    ratio,

    dist,
    hdist,
    cosPhi,
    on_line_hdist,
    
    C_from_ABG,
    AB_from_cCGMc,
    C_from_GOMc,
    Mc_from_GOC
};
