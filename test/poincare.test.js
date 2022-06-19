const { Circline, Complex, CP1, Moebius, ComplexMatrix2x2, PoincareDisc, PoincareHalfPlane }  = require('../src/complex_geom.js');

test('poincare_half_plane_line', () => {
    let l = PoincareHalfPlane.mk_line(CP1.of_xy(1, 1), CP1.of_xy(2, 2));
    expect(l.H.eq(new ComplexMatrix2x2(Complex.of_real(1), Complex.of_real(-3), Complex.of_real(-3), Complex.of_real(4)))).toBeTruthy();


    l = PoincareHalfPlane.mk_line(CP1.of_xy(0, 1), CP1.of_xy(0, 2));
    expect(l.H.eq(new ComplexMatrix2x2(Complex.of_real(0), Complex.of_real(-1), Complex.of_real(-1), Complex.of_real(0)))).toBeTruthy();
});
