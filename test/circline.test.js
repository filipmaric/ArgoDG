const { Circline, Complex, CP1, Moebius, ComplexMatrix2x2 }  = require('../src/complex_geom.js');

test('mk_line', () => {
    expect(Circline.mk_line(Complex.zero, Complex.one).eq(Circline.x_axis())).toBeTruthy();
    expect(Circline.mk_line(Complex.zero, Complex.i).eq(Circline.y_axis())).toBeTruthy();
    
    const ll = Circline.mk_line(Complex.zero, Complex.one);
    expect(ll.is_circle()).toBeFalsy();
    expect(ll.is_line()).toBeTruthy();
});


test('mk_circle', () => {
    const cc = Circline.mk_circle(Complex.zero, 1);
    expect(cc.eq(Circline.unit_circle())).toBeTruthy();
    expect(cc.eq(Circline.mk_circline3(Complex.one, Complex.i, Complex.one.uminus()))).toBeTruthy();

    expect(cc.circle_center().eq(Complex.zero)).toBeTruthy();
    expect(cc.circle_radius()).toBe(1);

    expect(cc.is_circle()).toBeTruthy();
    expect(cc.is_line()).toBeFalsy();
});


test('on_circline', () => {
    const c = new Complex(1, 2);
    const cc = Circline.mk_circle(c, 1);
    expect(cc.on_circline(c)).toBeFalsy();
    expect(cc.on_circline(new Complex(2, 2))).toBeTruthy();
    expect(cc.on_circline(new Complex(0, 2))).toBeTruthy();
    expect(cc.on_circline(new Complex(1, 3))).toBeTruthy();
    expect(cc.on_circline(new Complex(1, 1))).toBeTruthy();
    expect(cc.on_circline(new Complex(1 + Math.cos(Math.PI/4), 2 + Math.sin(Math.PI/4)))).toBeTruthy();
    expect(cc.on_circline(new Complex(2, 3))).toBeFalsy();
    expect(cc.on_circline(new Complex(1 + Math.cos(Math.PI/4), 1 + Math.sin(Math.PI/4)))).toBeFalsy();

    const ll = Circline.mk_line(Complex.zero, new Complex(1, 1));
    expect(ll.on_circline(new Complex(0, 0))).toBeTruthy();
    expect(ll.on_circline(new Complex(1, 1))).toBeTruthy();
    expect(ll.on_circline(new Complex(2, 2))).toBeTruthy();
    expect(ll.on_circline(new Complex(1.2345, 1.2345))).toBeTruthy();
    expect(ll.on_circline(new Complex(-1.2345, -1.2345))).toBeTruthy();
    expect(ll.on_circline(new Complex(1.2345, 1.2346))).toBeFalsy();
    expect(ll.on_circline(new Complex(-1.2345, -1.2346))).toBeFalsy();

    const [A, B] = ll.line_points();
    expect(ll.on_circline(A)).toBeTruthy();
    expect(ll.on_circline(B)).toBeTruthy();
    expect(A.eq(B)).toBeFalsy();

    const cc3 = Circline.mk_circline3(Complex.zero, Complex.one, Complex.i);
    expect(cc3.on_circline(Complex.zero)).toBeTruthy();
    expect(cc3.on_circline(Complex.one)).toBeTruthy();
    expect(cc3.on_circline(Complex.i)).toBeTruthy();
    expect(cc3.on_circline(new Complex(1, 1))).toBeTruthy();
    expect(cc3.on_circline(new Complex(-1, -1))).toBeFalsy();
    expect(cc3.circle_center().eq(new Complex(0.5, 0.5))).toBeTruthy();
    expect(cc3.circle_radius()).toBeCloseTo(Math.sqrt(0.5), 1e-15);

    const [X, Y, Z] = cc3.three_points();
    expect(cc3.on_circline(X)).toBeTruthy();
    expect(cc3.on_circline(Y)).toBeTruthy();
    expect(cc3.on_circline(Z)).toBeTruthy();
    expect(X.eq(Y)).toBeFalsy();
    expect(X.eq(Z)).toBeFalsy();
    expect(Y.eq(Z)).toBeFalsy();
});

test('in_disc', () => {
    const c = Circline.unit_circle();
    expect(c.in_disc(Complex.zero)).toBeTruthy();
    expect(c.in_disc(Complex.one)).toBeFalsy();
    expect(c.in_disc(Complex.one.sub(new Complex(1e-10, 1e-10)))).toBeTruthy();
    expect(c.in_disc(Complex.one.sub(new Complex(1e-15, 1e-15)))).toBeFalsy();
    expect(c.in_disc(Complex.of_polar(1.0, Math.PI/3))).toBeFalsy();
    expect(c.in_disc(Complex.of_polar(1.0 - 1e-8, Math.PI/3))).toBeTruthy();

    const l = Circline.x_axis();
    expect(l.in_disc(Complex.zero)).toBeFalsy();
    expect(l.in_disc(Complex.one)).toBeFalsy();
    expect(l.in_disc(Complex.i)).toBeFalsy();
    expect(l.in_disc(Complex.i.uminus())).toBeTruthy();
    expect(l.in_disc(new Complex(0, -1e-10))).toBeTruthy();
    expect(l.in_disc(new Complex(0, 1e-10))).toBeFalsy();
});

test('same circline', () => {
    expect(Circline.same_circline(Complex.zero, Complex.one, Complex.i, new Complex(1, 1))).toBeTruthy();
    expect(Circline.same_circline(Complex.zero, Complex.one, Complex.i, new Complex(-1, -1))).toBeFalsy();
    expect(Circline.same_circline(Complex.zero, Complex.one, Complex.of_real(-2), Complex.of_real(3))).toBeTruthy();
    expect(Circline.same_circline(Complex.zero, Complex.one, Complex.of_real(-2), Complex.of_imag(3))).toBeFalsy();
    expect(Circline.same_circline(new Complex(1, 1), new Complex(2, 2), new Complex(3, 3), new Complex(4, 4))).toBeTruthy();
});

test('collinear', () => {
    expect(Circline.collinear(Complex.zero, Complex.one, Complex.of_real(2))).toBeTruthy();
    expect(Circline.collinear(Complex.zero, Complex.of_real(2), Complex.one)).toBeTruthy();
    expect(Circline.collinear(Complex.one, Complex.zero, Complex.of_real(-1))).toBeTruthy();
    expect(Circline.collinear(Complex.zero, Complex.one, Complex.i)).toBeFalsy();
    expect(Circline.collinear(Complex.zero, Complex.i, Complex.one)).toBeFalsy();
    expect(Circline.collinear(new Complex(0, 1), new Complex(1, 3), new Complex(2, 5))).toBeTruthy();
    expect(Circline.collinear(new Complex(0, 1), new Complex(2, 5), new Complex(1, 3))).toBeTruthy();
    expect(Circline.collinear(new Complex(0, 1), new Complex(1, 3), new Complex(2, 5 + 1e-8))).toBeFalsy();
});

test('same arc', () => {
    expect(Circline.same_arc(Complex.zero, Complex.one, Complex.i, new Complex(1, 1))).toBeTruthy();
    expect(Circline.same_arc(Complex.zero, Complex.one, Complex.i, new Complex(1 + 1e-8, 1 + 1e-8))).toBeFalsy();
    expect(Circline.same_arc(Complex.zero, Complex.one, new Complex(1, 1), Complex.i)).toBeFalsy();
    expect(Circline.same_arc(Complex.zero, Complex.one, Complex.of_real(-2), Complex.of_real(3))).toBeTruthy();
    expect(Circline.same_arc(Complex.zero, Complex.one, Complex.of_real(5), Complex.of_real(6))).toBeFalsy();
});

test('other arc', () => {
    expect(Circline.other_arc(Complex.zero, Complex.one, Complex.i, new Complex(1, 1))).toBeFalsy();
    expect(Circline.other_arc(Complex.zero, Complex.one, new Complex(1, 1), Complex.i)).toBeTruthy();
    expect(Circline.other_arc(Complex.zero, Complex.one, Complex.of_real(-2), Complex.of_real(3))).toBeFalsy();
    expect(Circline.other_arc(Complex.zero, Complex.one, Complex.of_real(5), Complex.of_real(6))).toBeTruthy();
    expect(Circline.other_arc(Complex.zero, Complex.one, new Complex(1 + 1e-8, 1 + 1e-8), Complex.i)).toBeFalsy();
});


test('between', () => {
    expect(Circline.between(Complex.zero, Complex.one, Complex.of_real(2))).toBeTruthy();
    expect(Circline.between(Complex.zero, Complex.of_real(2), Complex.one)).toBeFalsy();
    expect(Circline.between(Complex.one, Complex.zero, Complex.of_real(-1))).toBeTruthy();
    expect(Circline.between(Complex.zero, Complex.one, Complex.i)).toBeFalsy();
    expect(Circline.between(Complex.zero, Complex.i, Complex.one)).toBeFalsy();
    expect(Circline.between(new Complex(0, 1), new Complex(1, 3), new Complex(2, 5))).toBeTruthy();
    expect(Circline.between(new Complex(0, 1), new Complex(2, 5), new Complex(1, 3))).toBeFalsy();
    expect(Circline.between(new Complex(0, 1), new Complex(1, 3), new Complex(2, 5 + 1e-8))).toBeFalsy();
});

test('same_side', () => {
    expect(Circline.same_side(Complex.zero, Complex.one, Complex.of_real(2))).toBeTruthy();
    expect(Circline.same_side(Complex.one, Complex.of_real(2), Complex.zero)).toBeTruthy();
    expect(Circline.same_side(Complex.of_real(2), Complex.zero, Complex.one)).toBeFalsy();
    expect(Circline.same_side(new Complex(0, 1), new Complex(1, 3), new Complex(2, 5))).toBeTruthy();
    expect(Circline.same_side(new Complex(0, 1), new Complex(2, 5), new Complex(1, 3))).toBeFalsy();
    expect(Circline.same_side(Complex.zero, Complex.one, Complex.i)).toBeFalsy();
    expect(Circline.same_side(Complex.zero, Complex.i, Complex.one)).toBeFalsy();
    expect(Circline.same_side(new Complex(0, 1), new Complex(1, 3+1e-8), new Complex(2, 5))).toBeFalsy();
});

test('moebius_to_x_axis', () => {
    const cc = Circline.mk_circline3(Complex.one, Complex.zero, Complex.i);
    const M = cc.moebius_to_x_axis();
    expect(Circline.x_axis().on_circline(M.moebius_pt(Complex.one))).toBeTruthy();
    expect(Circline.x_axis().on_circline(M.moebius_pt(Complex.zero))).toBeTruthy();
    expect(Circline.x_axis().on_circline(M.moebius_pt(Complex.i))).toBeTruthy();
    expect(Circline.x_axis().on_circline(M.moebius_pt(new Complex(1, 1)))).toBeTruthy();
    expect(Circline.x_axis().on_circline(M.moebius_pt(new Complex(1+1e-5, 1+1e-5)))).toBeFalsy();
});

test('random_point()', () => {
    const cc = Circline.mk_circline3(Complex.one, Complex.zero, Complex.i);
    for (let i = 1; i <= 10; i++)
        expect(cc.on_circline(cc.random_point())).toBeTruthy();
});

test('random_point_in_disc()', () => {
    const cc = Circline.mk_circline3(Complex.one, Complex.zero, Complex.i);
    const unit_circle = Circline.unit_circle();
    for (let i = 1; i <= 10; i++) {
        const A = cc.random_point_in_disc(unit_circle);
        expect(cc.on_circline(A) && unit_circle.in_disc(A)).toBeTruthy();
    }

    const out_circle = Circline.mk_circle(new Complex(10, 10), 1);
    const A = cc.random_point_in_disc(out_circle);
    expect(A).toBeNull();
});

test('intersect', () => {
    const c1 = Circline.unit_circle();
    const c2 = Circline.x_axis();
    const c3 = Circline.y_axis();
    
    const [A, B] = c1.intersect(c2);
    expect(c1.on_circline(A)).toBeTruthy();
    expect(c1.on_circline(B)).toBeTruthy();
    expect(c2.on_circline(A)).toBeTruthy();
    expect(c2.on_circline(B)).toBeTruthy();
    expect(A.eq(B)).toBeFalsy();

    const [A1, B1] = c2.intersect(c3);
    expect(c2.on_circline(A1)).toBeTruthy();
    expect(c2.on_circline(B1)).toBeTruthy();
    expect(c3.on_circline(A1)).toBeTruthy();
    expect(c3.on_circline(B1)).toBeTruthy();
    expect(A1.eq(B1)).toBeFalsy();
    expect(A1.is_inf() || B1.is_inf()).toBeTruthy();

    // check case when A == 0 in intersect
    const c4 = Circline.mk_circle(Complex.i, 1);
    const [A2, B2] = c3.intersect(c4);
    expect(c3.on_circline(A2)).toBeTruthy();
    expect(c3.on_circline(B2)).toBeTruthy();
    expect(c4.on_circline(A2)).toBeTruthy();
    expect(c4.on_circline(B2)).toBeTruthy();
    expect(A2.eq(B2)).toBeFalsy();

    // tangent (single intersection point)
    const [A3, B3] = c2.intersect(c4);
    expect(c2.on_circline(A3)).toBeTruthy();
    expect(c2.on_circline(B3)).toBeTruthy();
    expect(c4.on_circline(A3)).toBeTruthy();
    expect(c4.on_circline(B3)).toBeTruthy();
    expect(A3.eq(B3)).toBeTruthy();

    // no intersections (no fictive)
    const c5 = Circline.mk_circle(Complex.of_real(3), 1);
    expect(c1.intersect(c5).length).toBe(0);

    // no intersections (fictive)
    expect(c1.intersect(c5, true).length).toBe(2);
    const [A4, B4] = c1.intersect(c5, true);
    // TODO: test properties of fictive intersections 
});

test('transform', () => {
    const M = new Moebius(Complex.zero, Complex.one, Complex.one, Complex.zero);
    const H1 = M.moebius_circline(Circline.unit_circle());
    const H2 = Circline.unit_circle().transform((x, y) => new Complex(x, y).reciprocal().coords());
    expect(H1.eq(H2)).toBeTruthy();
});

test('eq', () => {
    const H1 = new Circline(Complex.of_real(5), new Complex(2, 1), new Complex(2, -1), Complex.of_real(4));
    const H2 = new Circline(Complex.of_real(1), new Complex(0.4, 0.2), new Complex(0.4, -0.2), Complex.of_real(0.8));
    expect(H1.eq(H2)).toBeTruthy();

    
    const H3 = new Circline(Complex.zero, new Complex(2, 1), new Complex(2, -1), Complex.of_real(4));
    const H4 = new Circline(Complex.zero, new Complex(0.5, 0.25), new Complex(0.5, -0.25), Complex.one);
    expect(H3.eq(H4)).toBeTruthy();

    expect(H1.eq(H3)).toBeFalsy();
});

test('cosAngle', () => {
    expect(Circline.cosAngle(Circline.x_axis(), Circline.y_axis())).toBeCloseTo(0, 1e-12);
    expect(Circline.cosAngle(Circline.x_axis(), Circline.unit_circle())).toBeCloseTo(0, 1e-12);
    expect(Circline.cosAngle(Circline.y_axis(), Circline.unit_circle())).toBeCloseTo(0, 1e-12);
    const yeqx = Circline.mk_line(Complex.zero, new Complex(1, 1));
    expect(Math.abs(Circline.cosAngle(Circline.x_axis(), yeqx))).toBeCloseTo(Math.sqrt(2)/2, 1e-12);
    expect(Math.abs(Circline.cosAngle(Circline.y_axis(), yeqx))).toBeCloseTo(Math.sqrt(2)/2, 1e-12);

    const M = Moebius.moebius_01inf(CP1.of_xy(3, 3), CP1.of_xy(2, 5), CP1.of_xy(5, 3));
    expect(Circline.cosAngle(M.moebius_circline(Circline.x_axis()), M.moebius_circline(Circline.y_axis()))).toBeCloseTo(0, 1e-12);
    expect(Math.abs(Circline.cosAngle(M.moebius_circline(Circline.y_axis()), M.moebius_circline(yeqx)))).toBeCloseTo(Math.sqrt(2)/2, 1e-12);
});

