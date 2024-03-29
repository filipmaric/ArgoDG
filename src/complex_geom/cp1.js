import { Complex } from './complex.js';

/**
 * Point in CP1 space (complex projective line),
 * given by its complex homogeneous coordinates
 */
class CP1 {
    constructor(z1, z2, normalize) {
        if (!z2)
            z2 = Complex.one;
        this.z1 = z1;
        this.z2 = z2;
        if (normalize === undefined || normalize)
            this.normalize();
    }

    normalize() {
        if (!this.z2.is_zero()) {
            this.z1 = this.z1.div(this.z2);
            this.z2 = Complex.one;
        } else if (!this.z1.is_zero()) {
            this.z1 = Complex.one;
            this.z2 = Complex.zero;
        }
    }

    is_valid(eps) {
        return !this.z1.is_zero(eps) || !this.z2.is_zero(eps);
    }

    is_zero(eps) {
        return this.z1.is_zero(eps);
    }
    
    is_inf(eps) {
        return this.z2.is_zero(eps);
    }

    static of_complex(z) {
        return new CP1(z);
    }

    static of_real(r) {
        return CP1.of_complex(Complex.of_real(r));
    }
    
    static of_xy(x, y) {
        return CP1.of_complex(new Complex(x, y));
    }
    
    static get inf() {
        return inf;
    }
    
    static get zero() {
        return zero;
    }
    
    static get one() {
        return one;
    }

    to_complex() {
        return this.z1.div(this.z2);
    }

    coords() {
        if (!this.is_inf())
            return this.to_complex().coords();
        else
            return null;
    }

    x() {
        if (!this.is_inf())
            return this.to_complex().x();
        else
            return null;
    }

    y() {
        if (!this.is_inf())
            return this.to_complex().y();
        else
            return null;
    }    
    
    add(other) {
        if (!this.z2.is_zero() || !other.z2.is_zero())
            return new CP1(this.z1.mult(other.z2).add(other.z1.mult(this.z2)),
                           this.z2.mult(other.z2));
        else
            return CP1.inf;
    }

    uminus() {
        return new CP1(this.z1.uminus(), this.z2);
    }

    sub(other) {
        return this.add(other.uminus());
    }

    mult(other) {
        if ((this.z1.is_zero() && other.z2.is_zero()) ||
            (other.z1.is_zero() && this.z2.is_zero()))
            return CP1.one;
        else
            return new CP1(this.z1.mult(other.z1), this.z2.mult(other.z2));
    }

    reciprocal() {
        return new CP1(this.z2, this.z1);
    }

    div(other) {
        return this.mult(other.reciprocal());
    }

    cnj() {
        return new CP1(this.z1.cnj(), this.z2.cnj());
    }

    inversion() {
        return this.reciprocal().cnj();
    }

    eq(other, eps) {
        if (!other)
            return false;
        
        if (!(other instanceof CP1))
            other = other.cp1();

        if (!other)
            return false;
        
        this.normalize();
        other.normalize();
        
        if (this.is_inf())
            return other.is_inf();
        if (other.is_inf())
            return this.is_inf();
        return this.sub(other).is_zero(eps);
    }

    clone() {
        return new CP1(this.z1.clone(), this.z2.clone());
    }

    static ratio(a, b, c) {
        return (a.sub(b)).div(a.sub(c));
    }

    static cross_ratio(z, u, v, w) {
        const n1 = z.z1.mult(u.z2).sub(u.z1.mult(z.z2));
        const n2 = v.z1.mult(w.z2).sub(w.z1.mult(v.z2));
        const d1 = z.z1.mult(w.z2).sub(w.z1.mult(z.z2));
        const d2 = v.z1.mult(u.z2).sub(u.z1.mult(v.z2));
        if (!n1.mult(n2).is_zero() || !d1.mult(d2).is_zero())
            return new CP1(n1.mult(n2), d1.mult(d2));
        else
            return CP1.one;
    }

    vec_mult(other) {
        return this.z1.mult(other.z1).add(this.z2.mult(other.z2));
    }
}

const inf  = new CP1(Complex.one, Complex.zero);
const zero = CP1.of_real(0);
const one  = CP1.of_real(1);

Complex.prototype.cp1 = function() {
    return CP1.of_complex(this);
}
      
export { CP1 };
