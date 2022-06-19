import { Complex } from './complex.js';
import { CP1 } from './cp1.js';
import { Circline } from './circline.js';
import { Moebius } from './moebius.js';

class PoincareDisc {
    // hyperbolic distance between two given (finite) complex numbers inside the disc
    static hdist(u, v) {
        return Math.acosh(1 + (2 * u.sub(v).norm2()) / ((1 - u.norm2()) * (1 - v.norm2())));
    }

    // cosine of the hyperbolic angle ABC given by three (finite) complex numbers inside the disc
    static cosPhi(A, B, C) {
        const l1 = PoincareDisc.mk_line(A, B);
        const l2 = PoincareDisc.mk_line(C, B);
        return Circline.cosAngle(l1, l2);
    }
    
    // Circline that represents a Poincare disc line that joins two given (finite) complex numbers
    // inside the disc
    static mk_line(z1, z2) {
        const A = Complex.i.mult((z1.mult(z2.cnj())).sub(z2.mult(z1.cnj())));
        const B = Complex.i.mult(z2.scale(z1.norm2() + 1).sub(z1.scale(z2.norm2() + 1)));
        return new Circline(A, B, B.cnj(), A);
    }

    // Circline that represents a Poincare circle that is centered in a (finite) complex number a
    // and has the radius r
    static mk_circle(a, r) {
        const ae = a.scale(1 / ((1 - a.norm2())*(Math.cosh(r) - 1)/2 + 1));
        const re = ((1 - a.norm2()) * Math.sinh(r)) / ((1 - a.norm2()) * (Math.cosh(r) - 1) + 2);
        return Circline.mk_circle(ae, re);
    }
}

const half_plane_to_disc = new Moebius(Complex.one, Complex.i.uminus(), Complex.one, Complex.i);
const disc_to_half_plane = half_plane_to_disc.inv();

class PoincareHalfPlane {
    // hyperbolic distance between two given (finite) complex numbers inside the upper half plane
    static hdist(u, v) {
        return Math.acosh(1 + (u.sub(v).norm2()) / (2*u.im()*v.im()));
    }

    // cosine of the hyperbolic angle ABC given by three (finite) complex numbers inside the disc
    static cosPhi(A, B, C) {
        const l1 = PoincareHalfPlane.mk_line(A, B);
        const l2 = PoincareHalfPlane.mk_line(C, B);
        return Circline.cosAngle(l1, l2);
    }
    
    // Circline that represents a Poincare half plane line that joins
    // two given (finite) complex numbers inside the disc
    static mk_line(z1, z2) {
        // FIXME: find a direct formula
        const zz1 = half_plane_to_disc.moebius_pt(z1);
        const zz2 = half_plane_to_disc.moebius_pt(z2);
        const ll = PoincareDisc.mk_line(zz1.to_complex(), zz2.to_complex());
        return disc_to_half_plane.moebius_circline(ll);
    }

    // Circline that represents a Poincare circle that is centered in a (finite) complex number a
    // and has the radius r
    static mk_circle(a, r) {
        // FIXME: find a direct formula
        const aa = half_plane_to_disc.moebius_pt(a);
        const cc = PoincareDisc.mk_circle(aa.to_complex(), r);
        return disc_to_half_plane.moebius_circline(cc);
    }
}

export { PoincareDisc, PoincareHalfPlane };
