const { Complex }  = require('../src/complex_geom.js');

test('complex real and imag part', () => {
    const c = new Complex(1, 2);
    expect(c.re()).toBe(1);
    expect(c.im()).toBe(2);
});

test('complex of_real', () => {
    const c = Complex.of_real(5);
    expect(c.re()).toBe(5);
    expect(c.im()).toBe(0);
});

test('complex of_imag', () => {
    const c = Complex.of_imag(5);
    expect(c.re()).toBe(0);
    expect(c.im()).toBe(5);
});

test('complex of_xy', () => {
    const c = Complex.of_xy(3, 5);
    expect(c.re()).toBe(3);
    expect(c.im()).toBe(5);
});

test('complex of_polar', () => {
    const c = Complex.of_polar(2.0, Math.PI/4);
    expect(c.re()).toBeCloseTo(Math.sqrt(2), 1e-15);
    expect(c.im()).toBeCloseTo(Math.sqrt(2), 1e-15);
});

test('complex coords', () => {
    const c = new Complex(1, 2);
    expect(c.coords()).toStrictEqual([1, 2]);
});

test('complex is finite', () => {
    const c = new Complex(1, 2);
    expect(c.is_inf()).toBeFalsy();
});

test('complex to complex', () => {
    const c = new Complex(1, 2);
    expect(c.to_complex().eq(c)).toBeTruthy();
});

test('complex clone', () => {
    const c = new Complex(1, 2);
    const c1 = c.clone();
    expect(c.eq(c1)).toBeTruthy();
});

test('add complex numbers / integer coordinates', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(3, 4);
    const c = c1.add(c2);
    expect(c.re()).toBe(4);
    expect(c.im()).toBe(6);
});

test('add complex numbers / real coordinates', () => {
    const c1 = new Complex(1.2, 3.4);
    const c2 = new Complex(5.6, 7.8);
    const c = c1.add(c2);
    expect(c.re()).toBe(6.8);
    expect(c.im()).toBe(11.2);
});

test('multiply complex numbers / integer coordinates', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(3, 4);
    const c = c1.mult(c2);
    expect(c.re()).toBe(-5);
    expect(c.im()).toBe(10);

    const cc = c1.mult(2);
    expect(cc.re()).toBe(2);
    expect(cc.im()).toBe(4);
});

test('multiply complex numbers / real coordinates', () => {
    const c1 = new Complex(1.2, 3.4);
    const c2 = new Complex(5.6, 7.8);
    const c = c1.mult(c2);
    expect(c.re()).toBe(1.2*5.6 - 3.4*7.8);
    expect(c.im()).toBe(1.2*7.8 + 3.4*5.6);
});

test('uminus complex number', () => {
    const c1 = new Complex(1, 2);
    const c = c1.uminus();
    expect(c.re()).toBe(-1);
    expect(c.im()).toBe(-2);
});

test('scale complex number', () => {
    const c1 = new Complex(1, 2);
    const c = c1.scale(5);
    expect(c.re()).toBe(5);
    expect(c.im()).toBe(10);
});

test('reciprocal complex number', () => {
    const c1 = new Complex(1, 2);
    const c = c1.reciprocal();
    expect(c.re()).toBe(1/5)
    expect(c.im()).toBe(-2/5)
});

test('divide complex numbers', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(3, 4);
    const c = c2.div(c1);
    expect(c.re()).toBe(0.2*3 + 0.4*4);
    expect(c.im()).toBe(0.2*4 - 0.4*3);
});

test('argument of complex number', () => {
    expect(new Complex(1, 0).arg()).toBeCloseTo(0, 15);
    expect(new Complex(0, 1).arg()).toBeCloseTo(Math.PI / 2, 15);
    expect(new Complex(0, -1).arg()).toBeCloseTo(-Math.PI / 2, 15);
    expect(Complex.of_polar(1.0, Math.PI/4).arg()).toBeCloseTo(Math.PI / 4, 15);
    expect(Complex.of_polar(3.0, -Math.PI/4).arg()).toBeCloseTo(-Math.PI / 4, 15);
    expect(new Complex(-1, 0).arg()).toBeCloseTo(Math.PI);
    expect(new Complex(-1, 1e-10).arg()).toBeCloseTo(Math.PI);
    expect(new Complex(-1, -1e-10).arg()).toBeCloseTo(-Math.PI);
});

test('norm of complex number', () => {
    expect(new Complex(3, 4).norm()).toBe(5);
    expect(new Complex(2, 3).norm()).toBeCloseTo(Math.sqrt(13), 15);
});

test('squared norm of complex number', () => {
    expect(new Complex(3, 4).norm2()).toBe(25);
    expect(new Complex(2, 3).norm2()).toBe(13);
});

test('complex conjugate', () => {
    const c1 = new Complex(1, 2);
    const c = c1.cnj();
    expect(c.re()).toBe(1);
    expect(c.im()).toBe(-2);
});

test('complex scalar product', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(3, 4);
    const c = Complex.scalprod(c1, c2);
    expect(c).toBe(11);
});

test('check real', () => {
    expect(new Complex(0.0, 0.0).is_real()).toBeTruthy();
    expect(new Complex(0.0, 1e-15).is_real()).toBeTruthy();
    expect(new Complex(0.0, 1e-10).is_real()).toBeTruthy();
    expect(new Complex(0.0, 1e-9).is_real()).toBeTruthy();
    expect(new Complex(0.0, 1e-8).is_real()).toBeFalsy();
    expect(new Complex(0.0, -1e-15).is_real()).toBeTruthy();
    expect(new Complex(0.0, -1e-10).is_real()).toBeTruthy();
    expect(new Complex(0.0, -1e-9).is_real()).toBeTruthy();
    expect(new Complex(0.0, -1e-8).is_real()).toBeFalsy();

    expect(new Complex(0.0, 1e-9).is_real(1e-10)).toBeFalsy();
    expect(new Complex(0.0, 1e-8).is_real(1e-5)).toBeTruthy();
});

test('check imag', () => {
    expect(new Complex(0.0, 0.0).is_imag()).toBeTruthy();
    expect(new Complex(1e-15, 0.0).is_imag()).toBeTruthy();
    expect(new Complex(1e-10, 0.0).is_imag()).toBeTruthy();
    expect(new Complex(1e-9, 0.0).is_imag()).toBeTruthy();
    expect(new Complex(1e-8, 0.0).is_imag()).toBeFalsy();
    expect(new Complex(-1e-15, 0.0).is_imag()).toBeTruthy();
    expect(new Complex(-1e-10, 0.0).is_imag()).toBeTruthy();
    expect(new Complex(-1e-9, 0.0).is_imag()).toBeTruthy();
    expect(new Complex(-1e-8, 0.0).is_imag()).toBeFalsy();

    expect(new Complex(1e-9, 0.0).is_imag(1e-10)).toBeFalsy();
    expect(new Complex(1e-8, 0.0).is_imag(1e-5)).toBeTruthy();
});


test('complex number is zero', () => {
    expect(new Complex(0.0, 0.0).is_zero()).toBeTruthy();
    expect(new Complex(1e-15, 1e-15).is_zero()).toBeTruthy();
    expect(new Complex(1e-8, 1e-8).is_zero()).toBeFalsy();
    expect(new Complex(1e-9, 1e-9).is_zero()).toBeTruthy();
    
    expect(new Complex(0.0, 1e-9).is_zero()).toBeTruthy();
    expect(new Complex(1e-9, 0.0).is_zero()).toBeTruthy();
    expect(new Complex(0.0, 1.5e-8).is_zero()).toBeFalsy();
    expect(new Complex(1.5e-8, 0.0).is_zero()).toBeFalsy();
    expect(new Complex(0.0, -1e-9).is_zero()).toBeTruthy();
    expect(new Complex(-1.5e-8, 0.0).is_zero()).toBeFalsy();

    expect(new Complex(1e-5, 1e-5).is_zero()).toBeFalsy();
    expect(new Complex(1e-5, 1e-5).is_zero(1e-4)).toBeTruthy();
    expect(new Complex(1e-5, 1e-5).is_zero(1.5e-5)).toBeTruthy();
});

test('eq complex numbers', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(3, 4);
    const c3 = new Complex(1, 2);
    expect(c1.eq(c2)).toBeFalsy();
    expect(c1.eq(c3)).toBeTruthy();
    expect(c1.eq(new Complex(1, 2 + 1e-15))).toBeTruthy();
    expect(c1.eq(new Complex(1, 2 + 1e-7))).toBeFalsy();
    expect(c1.eq(new Complex(1 + 1e-9, 2 + 1e-9))).toBeTruthy();

    expect(c1.eq(new Complex(1 + 1e-5, 2 + 1e-5))).toBeFalsy();
    expect(c1.eq(new Complex(1 + 1e-5, 2 + 1e-5), 1e-4)).toBeTruthy();

    expect(new Complex(1e5, 1e5).eq(new Complex(1e5+1e-3, 1e5))).toBeTruthy();
    expect(new Complex(1e5, 1e5).eq(new Complex(1e5+1, 1e5))).toBeFalsy();
    expect(new Complex(1e5, 1e5).eq(new Complex(1e5+1, 1e5), 1e-5)).toBeTruthy();
    expect(new Complex(1e9, 1e9).eq(new Complex(1e9+1, 1e9+1))).toBeTruthy();

    expect(new Complex(3, 4).eq(undefined)).toBeFalsy();
});
