const { Circline, Complex, CP1, Moebius, ComplexMatrix2x2, PoincareDisc, PoincareHalfPlane }  = require('../src/complex_geom.js');

test('poincare_disc_line', () => {
    let l = PoincareDisc.mk_line(Complex.of_xy(0, 0), Complex.of_xy(0.5, 0.5));
    const s2 = Math.sqrt(2) / 2;
    expect(l.is_line()).toBeTruthy();
    expect(l.H.eq(new ComplexMatrix2x2(Complex.zero, Complex.of_xy(-s2, s2), Complex.of_xy(-s2, -s2), Complex.zero))).toBeTruthy();

    const A = new Complex(0.2, 0.3);
    const B = new Complex(-0.2, 0.5);
    l = PoincareDisc.mk_line(A, B);
    expect(l.is_circle()).toBeTruthy();
    expect(l.on_circline(A)).toBeTruthy();
    expect(l.on_circline(B)).toBeTruthy();
    expect(Circline.cosAngle(l, Circline.unit_circle())).toBeCloseTo(0, 1e-12);
});

test('poincare_disc_circle', () => {
    const A = new Complex(0.2, 0.3);
    const r = 20;
    const c = PoincareDisc.mk_circle(A, r);
    expect(c.is_circle()).toBeTruthy();
    const B = c.random_point();
    expect(c.on_circline(B)).toBeTruthy();
    expect(PoincareDisc.hdist(A.to_complex(), B.to_complex())).toBeCloseTo(r);
});

test('poincare_half_plane_line', () => {
    let l = PoincareHalfPlane.mk_line(Complex.of_xy(1, 1), Complex.of_xy(2, 2));
    expect(l.H.eq(new ComplexMatrix2x2(Complex.of_real(1), Complex.of_real(-3), Complex.of_real(-3), Complex.of_real(4)))).toBeTruthy();

    l = PoincareHalfPlane.mk_line(Complex.of_xy(0, 1), Complex.of_xy(0, 2));
    expect(l.H.eq(new ComplexMatrix2x2(Complex.of_real(0), Complex.of_real(-1), Complex.of_real(-1), Complex.of_real(0)))).toBeTruthy();
});

test('poincare_half_plane_circle', () => {
    const A = new Complex(1, 2);
    const r = 5;
    const c = PoincareHalfPlane.mk_circle(A, r);
    expect(c.is_circle()).toBeTruthy();
    const B = c.random_point();
    expect(c.on_circline(B)).toBeTruthy();
    expect(PoincareHalfPlane.hdist(A.to_complex(), B.to_complex())).toBeCloseTo(r);
});
