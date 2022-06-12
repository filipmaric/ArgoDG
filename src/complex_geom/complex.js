/**
 * Complex number
 */
class Complex {
    constructor(re, im) {
        this._re = re;
        this._im = im;
    }

    static of_real(re) {
        return new Complex(re, 0);
    }

    static of_imag(im) {
        return new Complex(0, im);
    }

    static of_xy(x, y) {
        return new Complex(x, y);
    }

    static of_polar(rho, theta) {
        return new Complex(rho * Math.cos(theta), rho * Math.sin(theta));
    }

    // some special complex numbers
    
    static get zero() {
        return zero;
    }

    static get one() {
        return one;
    }

    static get minus_one() {
        return minus_one;
    }

    static get i() {
        return i;
    }
    
    static get minus_i() {
        return minus_i;
    }


    // copy of this object
    clone() {
        return new Complex(this.re(), this.im());
    }

    // getting basic properties
    re() {
        return this._re;
    }

    x() {
        return this.re();
    }

    im() {
        return this._im;
    }

    y() {
        return this.im();
    }
    
    coords() {
        return [this.re(), this.im()];
    }

    // precision for checking zero
    static EPS = 1e-8;

    // check if this complex number is zero (up to the given precision)
    is_zero(eps) {
        if (eps === undefined)
            eps = Complex.EPS;
        return this.norm2() < eps * eps;
    }

    // check if two numbers are equal (up to the given precision)
    eq(other, eps) {
        // default relative error
        if (eps === undefined)
            eps = 1e-8;
        return this.sub(other).norm() <= eps * (this.norm() + other.norm()) / 2;
    }

    // check if this complex number is real (up to the given precision)
    is_real(eps) {
        if (eps === undefined)
            eps = Complex.EPS;
        return Math.abs(this.im()) < eps;
    }

    // check if this complex number is pure imaginary (up to the given precision)
    is_imag(eps) {
        if (eps === undefined)
            eps = Complex.EPS;
        
        return Math.abs(this.re()) < eps;
    }

    // all complex numbers are finite
    is_inf() {
        return false;
    }

    // just in case that a conversion to complex is called on a complex number
    to_complex() {
        return this;
    }

    // Arithmetic operations

    // addition
    add(other) {
        return new Complex(this.re() + other.re(), this.im() + other.im());
    }

    // unary minus
    uminus() {
        return this.scale(-1);
    }

    // subtraction
    sub(other) {
        return this.add(other.uminus());
    }

    // multiplication
    mult(other) {
        if (typeof other == "number")
            return this.scale(other);
        return new Complex(this.re() * other.re() - this.im() * other.im(),
                           this.re() * other.im() + this.im() * other.re());
    }

    // multiplication (scaling) by a real scalar
    scale(k) {
        return new Complex(k * this.re(), k * this.im());
    }
    
    // division
    div(other) {
        return this.mult(other.reciprocal());
    }


    // Euclidean norm
    norm() {
        return Math.sqrt(this.norm2());
    }
    
    // square of Euclidean norm
    norm2() {
        return this.re() * this.re() + this.im() * this.im();
    }

    // argument (angle in (-pi, pi])
    arg() {
        return Math.atan2(this.im(), this.re());
    }

    // signum (z -> z / |z|)
    sgn() {
        return this.scale(1 / this.norm());
    }

    // complex conjugate (x + iy -> x - iy)
    cnj() {
        return new Complex(this.re(), -this.im());
    }

    // reciprocal (z -> 1/z)
    reciprocal() {
        return this.cnj().scale(1 / this.norm2())
    }

    // cnj_mix(x1 + iy2, x2 + iy2) = 2*(x1*x2 + y1*y2) + 0*i
    static cnj_mix(z1, z2) {
        return z1.cnj().mult(z2).add(z2.cnj().mult(z1));
    }

    // scalar product when complex numbers are looked as vectors [x1, y1] [x2, y2]
    // scalprod(x1 + iy1, x2 + iy2) = x1*x2 + y1*y2
    static scalprod(z1, z2) {
        return Complex.cnj_mix(z1, z2).scale(1 / 2).re();
    }
}

const zero      = new Complex( 0,  0);
const one       = new Complex( 1,  0);
const minus_one = new Complex(-1,  0);
const i         = new Complex( 0,  1);
const minus_i   = new Complex( 0, -1);

export { Complex };
