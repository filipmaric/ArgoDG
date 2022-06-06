const { Moebius } = require('../src/complex_geom/moebius.js');
const { Complex, CP1 } = require('../src/complex_geom.js');

test('moebius_pt', () => {
    const M = Moebius.moebius_01inf(Complex.zero.cp1(), Complex.one.cp1(), Complex.i.cp1());
    expect(M.moebius_pt(Complex.zero.cp1()).eq(Complex.zero.cp1())).toBeTruthy();
    expect(M.moebius_pt(Complex.one.cp1()).eq(Complex.one.cp1())).toBeTruthy();
    expect(M.moebius_pt(Complex.i.cp1()).is_inf()).toBeTruthy();
    expect(M.moebius_inv_pt(CP1.inf).eq(Complex.i.cp1()));

    const M1 = new Moebius(Complex.zero, Complex.one, Complex.one, Complex.zero);
    const c = new Complex(2, 3);
    expect(M1.moebius_pt(c).to_complex().eq(c.reciprocal())).toBeTruthy();
    expect(M1.moebius_pt(Complex.one).to_complex().eq(Complex.one)).toBeTruthy();

    const M3 = new Moebius(Complex.of_real(1), Complex.of_real(2), Complex.of_real(3), Complex.of_real(4));
    expect(M3.moebius_pt(c).to_complex().eq(c.add(Complex.of_real(2)).div(c.scale(3).add(Complex.of_real(4))))).toBeTruthy();
    
});

test('moebius group', () => {
    const M1 = Moebius.moebius_01inf(Complex.zero.cp1(), Complex.one.cp1(), Complex.i.cp1());
    const M2 = Moebius.moebius_01inf(Complex.one.cp1(), Complex.zero.cp1(), Complex.i.cp1());
    const M1M2 = M1.comp(M2);
    expect(M1.moebius_pt(M2.moebius_pt(Complex.zero)).eq(M1M2.moebius_pt(Complex.zero))).toBeTruthy();
    expect(M1.moebius_pt(M2.moebius_pt(Complex.one)).eq(M1M2.moebius_pt(Complex.one))).toBeTruthy();
    const c = new Complex(2, 3);
    expect(M1.moebius_pt(M2.moebius_pt(c)).eq(M1M2.moebius_pt(c))).toBeTruthy();

    expect(M1.moebius_pt(c).eq(M1.comp(Moebius.id()).moebius_pt(c))).toBeTruthy();
    expect(M1.moebius_pt(c).eq(Moebius.id().comp(M1).moebius_pt(c))).toBeTruthy();

    const M1i = M1.inv();
    expect(M1.moebius_inv_pt(c).eq(M1i.moebius_pt(c))).toBeTruthy();

    expect(M1.comp(M1i).moebius_pt(c).eq(c)).toBeTruthy();
});

