import { Complex } from './complex.js';
import { CP1 } from './cp1.js';
import { ComplexMatrix2x2 } from './complex_matrix.js';
import { Moebius } from './moebius.js';

class Circline {
    // Circline is represented by a Hermitean matrix
    constructor(A, B, C, D) {
        if (arguments[0] instanceof ComplexMatrix2x2)
            this.H = arguments[0];
        else
            this.H = new ComplexMatrix2x2(A, B, C, D);
        this.normalize();
    }

    normalize() {
        this.H = Circline.normalizeOriented(this.H);
        this.H_unoriented = Circline.normalizeUnoriented(this.H);
    }

    // convert the H matrix to canonical form (used for easy circline comparison)
    // A is set to 1 if possible,
    // otherwise B is set to unit modulus and nonegative argument
    // WARNING: this can change orientation
    static normalizeUnoriented(H) {
        if (!H.A.is_zero()) {
            return H.multC(H.A.reciprocal());
        } else {
            const arg = H.B.arg();
            if (0 <= arg && arg < Math.PI)
                return H.multC(1 / H.B.norm());
            else
                return H.multC(- 1 / H.B.norm());
        }
    }

    static normalizeOriented(H) {
        if (!H.A.is_zero()) {
            return H.multC(1 / H.A.norm());
        } else {
            return H.multC(1 / H.B.norm());
        }
    }


    // Circline that represents an Euclidean circle with center in a (finite) complex number a
    // that has a radius r
    static mk_circle(a, r) {
        return new Circline(Complex.one, a.uminus(),
                            a.cnj().uminus(), a.mult(a.cnj()).sub(Complex.of_real(r*r)));
    }

    // Circline that represents an Euclidean line that joins two given (finite) complex numbers 
    static mk_line(z1, z2) {
        const B = z2.sub(z1).mult(Complex.i);
        return new Circline(Complex.zero, B,
                            B.cnj(), Complex.cnj_mix(B.uminus(), z1));
    }

    // Circline determined by tree points (either complex or CP1)
    static mk_circline3(z1, z2, z3) {
        if (!(z1 instanceof CP1)) z1 = z1.cp1();
        if (!(z2 instanceof CP1)) z2 = z2.cp1();
        if (!(z3 instanceof CP1)) z3 = z3.cp1();
        const M = Moebius.moebius_01inf(z1, z2, z3);
        return M.inv().moebius_circline(Circline.x_axis());
    }

    // oposite oriented circline
    opposite() {
        return new Circline(this.H.multC(-1));
    }

    // several special circlines
    
    static unit_circle() {
        return new Circline(Complex.one, Complex.zero, Complex.zero, Complex.minus_one);
    }

    static x_axis() {
        return new Circline(Complex.zero, Complex.i, Complex.minus_i, Complex.zero);
    }

    static y_axis() {
        return new Circline(Complex.zero, Complex.one, Complex.one, Complex.zero);
    }

    // check if this circline is an Euclidean line
    is_line() {
        return this.H.A.is_zero();
    }

    // check if this circline is an Euclidean circle
    is_circle() {
        return !this.is_line();
    }

    // Euclidean center of the current circline (works only if this is an Euclidean circle)
    circle_center() {
        return this.H.B.uminus().div(this.H.A);
    }

    // CP1 (euclidean center of infinity)
    center() {
        if (this.is_line())
            return CP1.inf;
        else
            return CP1.of_complex(this.circle_center());
    }

    // Euclidean radius of the current circline (works only if this is an Euclidean circle)
    circle_radius() {
        return Math.sqrt(this.H.B.mult(this.H.C).sub(this.H.A.mult(this.H.D)).div(this.H.A.mult(this.H.A)).re());
    }

    // Two points on the current circline (works only if this is an Euclidean line)
    line_points() {
        const z1 = this.H.D.mult(this.H.B).uminus().div(this.H.B.mult(this.H.C).scale(2));
        const z2 = z1.add(Complex.i.mult((this.H.B.arg() > 0 ? this.H.B.uminus() : this.H.B).sgn()));
        return [z1, z2];
    }

    // precision for checking in/on/out
    static EPS = 1e-10;

    quad_form(z) {
        if (!(z instanceof CP1))
            z = z.cp1();

        return z.cnj().vec_mult(this.H.multCP1(z, false)).re();
    }
    
    // checks if the given CP1 point lies on this circline (precision can be changed)
    on_circline(z, eps) {
        if (!eps)
            eps = Circline.EPS;
        return Math.abs(this.quad_form(z)) < eps;
    }

    // checks if the given CP1 point lines within the disc surounded by this circline (precision
    // can be changed)
    in_disc(z, eps) {
        if (!eps)
            eps = Circline.EPS;
        return this.quad_form(z) < -eps;
    }

    static cross_ratio(w1, z1, w2, z2) {
        if (!(z1 instanceof CP1)) z1 = z1.cp1();
        if (!(w1 instanceof CP1)) w1 = w1.cp1();
        if (!(z2 instanceof CP1)) z2 = z2.cp1();
        if (!(w2 instanceof CP1)) w2 = w2.cp1();
        return CP1.cross_ratio(w1, z1, w2, z2);
    }

    // check if w1, z1, w2, and z2 all lie on the same circline
    // w1, z1, w2, z2 are either all CP1 elements, or can be converted to those by means of
    // cp1 method
    static same_circline(w1, z1, w2, z2, eps) {
        if (!eps)
            eps = Circline.EPS;
        const cr = Circline.cross_ratio(w1, z1, w2, z2);
        return cr.is_inf() || cr.to_complex().is_real(eps);
    }

    // check if z1 and z2 lie on the same arc determined by w1 and w2 (i.e., if z2 is on the
    // same arc as z1 between w1 and w2, on the circline determined by w1, z1 and w2)
    // w1, z1, w2, z2 are either all CP1 elements, or can be converted to those by means of
    // cp1 method
    static same_arc(w1, z1, w2, z2, eps) {
        if (!eps)
            eps = Circline.EPS;
        const cr = Circline.cross_ratio(w1, z1, w2, z2);
        return !cr.is_inf() && cr.to_complex().is_real(eps) && cr.to_complex().re() >= eps;
    }
    
    // check if z1 and z2 lie different arcs determined by w1 and w2 (i.e., if z2 is on the
    // on the circline determined by w1, z1 and w2, but not on the same arc between w1 and w2
    // as z1)
    // w1, z1, w2, z2 are either all CP1 elements, or can be converted to those by means of
    // cp1 method
    static other_arc(w1, z1, w2, z2, eps) {
        if (!eps)
            eps = Circline.EPS;
        const cr = Circline.cross_ratio(w1, z1, w2, z2);
        return !cr.is_inf() && cr.to_complex().is_real(eps) && cr.to_complex().re() < -eps;
    }

    // check if w is between z1 and z2 (in Euclidean sense)
    // w, z1, z2 are either all CP1 elements, or can be converted to those by means of
    // cp1 method
    static between(z1, w, z2, eps) {
        return Circline.other_arc(CP1.inf, z1, w, z2, eps);
    }

    // check if z1, z2, and z3 are collinear (in Euclidean sense)
    // z1, z2, z3 are either all CP1 elements, or can be converted to those by means of
    // cp1 method
    static collinear(z1, z2, z3, eps) {
        return Circline.same_circline(z1, z2, z3, CP1.inf, eps);
    }

    // check if w1 and w2 are on the same side of z (on the same Euclidean half-line)
    // w1, w2, z are either all CP1 elements, or can be converted to those by means of
    // cp1 method
    static same_side(w1, w2, z, eps) {
        return Circline.collinear(w1, w2, z, eps) && !Circline.between(w1, z, w2, eps);
    }

    // check if w is h-betwen z1 and z2 on the Poincare line joining z1 and z2 within the unit disc
    // z1, w, z2 are either all CP1 elements, or can be converted to those by means of
    // cp1 method
    static h_between(z1, w, z2, eps) {
        if (!(w instanceof CP1))
            w = w.cp1();
        return unit_circle.in_disc(w, eps) && Circline.other_arc(w, z1, w.inversion(), z2, eps) 
    }

    static h_between_hp(z1, w, z2, eps) {
        if (!(w instanceof CP1))
            w = w.cp1();
        return !x_axis.in_disc(w, eps) && Circline.other_arc(w, z1, w.cnj(), z2, eps) 
    }

    // cosine of the angle between two circlines
    static cosAngle(c1, c2) {
        function det12(H1, H2) {
            return H1.A.mult(H2.D).add(H2.A.mult(H1.D)).sub(H1.B.mult(H2.C)).sub(H2.B.mult(H1.C));
        }
        return - det12(c1.H, c2.H).re() / (2 * Math.sqrt(c1.H.det().re() * c2.H.det().re()));
    }

    // random three different points on this circline
    three_points() {
        if (!this._three_points) {
            if (this.is_line()) {
                const [z1, z2] = this.line_points();
                this._three_points = [z1, z2, z1.add(z2.sub(z1).scale(2))];
            } else {
                const c = this.circle_center();
                const r = this.circle_radius();
                this._three_points = [c.add(Complex.of_real(r)), c.add(Complex.of_real(-r)), c.add(Complex.of_imag(r))];
            }
        }
        return this._three_points;
    }

    // a single random point on this circline
    random_point() {
        const [z1, z2, z3] = this.three_points().map(p => CP1.of_complex(p));
        const M = Moebius.moebius_01inf(z1, z2, z3);
        const part = Math.floor(Math.random() * 3);
        let x;
        if (part == 0)
            // [0, 1]
            x = Math.random();
        else if (part == 1)
            // [1, infty]
            x = 1 / Math.random();
        else
            // [-infty, 0]
            x = 1 - 1 / Math.random();

        return M.inv().moebius_pt(CP1.of_real(x));
    }

    // random point on this circline that lies within the given disc (usually the unit disc)
    random_point_in_disc(disc) {
        const [p1, p2] = this.intersect(disc, true);
        const [z1, z2, z3] = this.three_points().map(p => CP1.of_complex(p));
        const M = Moebius.moebius_01inf(z1, z2, z3);
        const [x1, x2] = [p1, p2].map(p => M.moebius_pt(p).to_complex().re()).sort()
        let p;
        const MAX_ITER = 100;
        let iter = 0;
        do {
            let x;
            if (Math.random() < 0.5)
                x = x1 + Math.random() * (x2 - x1);
            else {
                const k = Math.floor(5*Math.random());
                const d = Math.pow(10, k)*Math.random();
                x = Math.random() < 0.5 ? x1 - d : x2 + d;
            }
            p = M.inv().moebius_pt(CP1.of_real(x));
            iter++;
        } while (!disc.in_disc(p) && iter < MAX_ITER);
        return p;
    }

    // Moebius transformation that maps this circline to x-axis
    moebius_to_x_axis() {
        if (!this._moebius_to_x_axis) {
            const [z1, z2, z3] = this.three_points().map(p => CP1.of_complex(p));
            this._moebius_to_x_axis = Moebius.moebius_01inf(z1, z2, z3);
        }
        return this._moebius_to_x_axis;
    }

    // intersection of this and other circline (fictive intersections can also be returned)
    intersect(other, includeFictive) {
        const M = this.moebius_to_x_axis();
        const cm = M.moebius_circline(other);
        const [A, B, D] = [cm.H.A, cm.H.B, cm.H.D];
        let p1, p2;
        if (A.is_zero()) {
            p1 = CP1.inf;
            if (B.is_imag())
                return [p1, p1];
            p2 = CP1.of_real(- D.re() / (2 * B.re()));
            return [p1, p2].map(p => M.moebius_inv_pt(p));
        } else {
            let discr = B.re() * B.re() - A.re() * D.re();
            ////////////////////////////////////
            if (Math.abs(discr) < 1e-12)
                discr = 0;
            ////////////////////////////////////
            if (discr < 0) {
                if (includeFictive) {
                    // fictive intersections
                    const sqrt = Math.sqrt(-discr);
                    const [p1, p2] = [new Complex(-B.re() / A.re(), +sqrt / A.re()),
                                      new Complex(-B.re() / A.re(), -sqrt / A.re())];
                    return [p1, p2].map(p => M.moebius_inv_pt(CP1.of_complex(p)));
                } else
                    return [];
            } else {
                const sqrt = Math.sqrt(discr);
                const [p1, p2] = [(-B.re() + sqrt) / A.re(),
                                  (-B.re() - sqrt) / A.re()];
                return [p1, p2].map(p => M.moebius_inv_pt(CP1.of_real(p)));
            }
        }
    }

    // apply the given Moebius transform (given by a function that acts on pairs of coordinates)
    // to this circline
    transform(t) {
        let three_points = this.three_points();
        if (three_points.some(p => isNaN(p.re())))
            return this;
        three_points = three_points.map(p => {
            const [re, im] = t(p.re(), p.im());
            return CP1.of_complex(new Complex(re, im));
        });
        return Circline.mk_circline3(...three_points);
    }

    // check if this circline is equal to the other one (ignoring orientation)
    eq(other, eps) {
        return this.H_unoriented.eq(other.H_unoriented, eps);
    }
}

const unit_circle = Circline.unit_circle();
const x_axis = Circline.x_axis();


export { Circline };
