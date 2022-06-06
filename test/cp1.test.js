const { CP1, Complex }  = require('../src/complex_geom.js');

test('cp1 of complex', () => {
    const c = new Complex(1, 2);
    const c1 = CP1.of_complex(c).to_complex();
    expect(c.eq(c1)).toBeTruthy();

    expect(CP1.of_xy(2, 3).eq(CP1.of_complex(new Complex(2, 3)))).toBeTruthy();
});

test('cp1 clone', () => {
    const c = CP1.of_xy(2, 3);
    expect(c.clone().eq(c));
});

test('complex cp1', () => {
    const c = new Complex(1, 2);
    expect(c.cp1().eq(CP1.of_complex(c)));
});

test('cp1 valid', () => {
    expect(CP1.of_complex(new Complex(1, 2)).is_valid()).toBeTruthy();
    expect(CP1.of_complex(Complex.zero).is_valid()).toBeTruthy();
    expect(new CP1(Complex.zero, Complex.one).is_valid()).toBeTruthy();
    expect(new CP1(Complex.one, Complex.zero).is_valid()).toBeTruthy();
    expect(new CP1(Complex.zero, Complex.zero).is_valid()).toBeFalsy();
});

test('cp1 of real', () => {
    const c1 = CP1.of_real(5).to_complex();
    expect(c1.eq(Complex.of_real(5))).toBeTruthy();
});


test('cp1 is zero', () => {
    const c = new CP1(Complex.zero);
    expect(c.is_zero()).toBeTruthy();
    expect(c.is_inf()).toBeFalsy();

    const c1 = new CP1(new Complex(1e-12, 1e-12), Complex.one);
    expect(c1.is_zero()).toBeTruthy();
    expect(c1.is_inf()).toBeFalsy();
});

test('cp1 is inf', () => {
    const c = new CP1(Complex.one, Complex.zero);
    expect(c.is_zero()).toBeFalsy();
    expect(c.is_inf()).toBeTruthy();

    const c1 = new CP1(new Complex(1, 2), Complex.zero);
    expect(c1.is_zero()).toBeFalsy();
    expect(c1.is_inf()).toBeTruthy();
});

test('cp1 eq', () => {
    const c1 = CP1.of_complex(new Complex(2, 3));
    const c2 = new CP1(new Complex(4, 6), Complex.of_real(2));
    const c3 = new CP1(new Complex(-3, 2), Complex.i);
    const c4 = new CP1(new Complex(2, 3), Complex.of_real(2));
    expect(c1.eq(c2)).toBeTruthy();
    expect(c1.eq(c3)).toBeTruthy();
    expect(c1.eq(c4)).toBeFalsy();

    const inf1 = new CP1(Complex.one, Complex.zero);
    const inf2 = new CP1(new Complex(1, 2), Complex.zero);
    expect(inf1.eq(inf2)).toBeTruthy();
    expect(inf1.eq(CP1.inf)).toBeTruthy();

    expect(inf1.eq(c1)).toBeFalsy();
});

test('cp1 add', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(3, 4);

    // of_complex(c1 + c2) = of_complex(c1) + of_complex(c2)
    expect(CP1.of_complex(c1).add(CP1.of_complex(c2)).eq(CP1.of_complex(c1.add(c2)))).toBeTruthy();
    // c1 + c2 = c2 + c1
    expect(CP1.of_complex(c1).add(CP1.of_complex(c2)).eq(CP1.of_complex(c2).add(CP1.of_complex(c1)))).toBeTruthy();
    // c1 + inf = inf
    expect(CP1.of_complex(c1).add(CP1.inf).eq(CP1.inf)).toBeTruthy();
    // inf + c1 = c1
    expect(CP1.inf.add(CP1.of_complex(c1)).eq(CP1.inf)).toBeTruthy();
    // inf + inf = inf
    expect(CP1.inf.add(CP1.inf).eq(CP1.inf)).toBeTruthy();
});

test('cp1 uminus', () => {
    const c1 = new Complex(1, 2);
    // of_complex(-c1) = -of_complex(c1)
    expect(CP1.of_complex(c1).uminus().eq(CP1.of_complex(c1.uminus()))).toBeTruthy();
    // -0 = 0
    expect(CP1.zero.uminus().eq(CP1.zero));
    // -inf = inf (ill defined, but holds)
    expect(CP1.inf.uminus().eq(CP1.inf));
});

test('cp1 sub', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(3, 4);
    // of_complex(c1 - c2) = of_complex(c1) - of_complex(c2)
    expect(CP1.of_complex(c1).sub(CP1.of_complex(c2)).eq(CP1.of_complex(c1.sub(c2)))).toBeTruthy();
    // c1 - 0 = c1
    expect(CP1.of_complex(c1).sub(CP1.zero).eq(CP1.of_complex(c1))).toBeTruthy();
    // 0 - c1 = -c1
    expect(CP1.zero.sub(CP1.of_complex(c1)).eq(CP1.of_complex(c1).uminus())).toBeTruthy();
    // c1 - c1 = 0
    expect(CP1.of_complex(c1).sub(CP1.of_complex(c1)).eq(CP1.zero)).toBeTruthy();
    // c1 - inf = inf
    expect(CP1.of_complex(c1).sub(CP1.inf).eq(CP1.inf)).toBeTruthy();
    // inf - c1 = inf
    expect(CP1.inf.sub(CP1.of_complex(c1)).eq(CP1.inf)).toBeTruthy();
    // inf - inf = inf (ill defined, but holds)
    expect(CP1.inf.sub(CP1.inf).eq(CP1.inf)).toBeTruthy();
});

test('cp1 mult', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(3, 4);
    // of_complex(c1 * c2) = of_complex(c1) * of_complex(c2)
    expect(CP1.of_complex(c1).mult(CP1.of_complex(c2)).eq(CP1.of_complex(c1.mult(c2)))).toBeTruthy();
    // c1 * c2 = c2 * c1
    expect(CP1.of_complex(c1).mult(CP1.of_complex(c2)).eq(CP1.of_complex(c2).mult(CP1.of_complex(c1)))).toBeTruthy();
    // c1 * inf = inf
    expect(CP1.of_complex(c1).mult(CP1.inf).eq(CP1.inf)).toBeTruthy();
    // inf * c1 = inf
    expect(CP1.inf.mult(CP1.of_complex(c1)).eq(CP1.inf)).toBeTruthy();
    // inf * inf = inf
    expect(CP1.inf.add(CP1.inf).eq(CP1.inf)).toBeTruthy();

    // c1 * 0 = 0
    expect(CP1.of_complex(c1).mult(CP1.zero).eq(CP1.zero)).toBeTruthy();
    // 0 * c1 = 0
    expect(CP1.zero.mult(CP1.of_complex(c1)).eq(CP1.zero)).toBeTruthy();

    // c1 * 1 = c1
    expect(CP1.of_complex(c1).mult(CP1.one).eq(CP1.of_complex(c1))).toBeTruthy();
    // 1 * c1 = c1
    expect(CP1.one.mult(CP1.of_complex(c1)).eq(CP1.of_complex(c1))).toBeTruthy();
    
    // 0 * inf = inf * 0 = 1 (ill defined, but holds)
    expect(CP1.zero.mult(CP1.inf).eq(CP1.one)).toBeTruthy();
    expect(CP1.inf.mult(CP1.zero).eq(CP1.one)).toBeTruthy();
});

test('cp1 reciprocal', () => {
    const c1 = new Complex(1, 2);
    // of_complex(1/c1) = 1 / of_complex(c1)
    expect(CP1.of_complex(c1).reciprocal().eq(CP1.of_complex(c1.reciprocal())));
    // 1 / inf = 0
    expect(CP1.inf.reciprocal().eq(CP1.zero));
    // 1 / 0 = inf
    expect(CP1.zero.reciprocal().eq(CP1.inf));
});

test('cp1 div', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(3, 4);
    // of_complex(c1 : c2) = of_complex(c1) : of_complex(c2)
    expect(CP1.of_complex(c1).div(CP1.of_complex(c2)).eq(CP1.of_complex(c1.div(c2))));
    // inf : c1 = inf
    expect(CP1.inf.div(CP1.of_complex(c1)).eq(CP1.inf));
    // c1 : inf = 0
    expect(CP1.of_complex(c1).div(CP1.inf).eq(CP1.zero));

    // 0 : c1 = 0
    expect(CP1.zero.div(CP1.of_complex(c1)).eq(CP1.zero));
    // c1 : 0 = inf
    expect(CP1.of_complex(c1).div(CP1.zero).eq(CP1.inf));

    // 0 : 0 = 1 (ill defined, but holds)
    expect(CP1.zero.div(CP1.zero).eq(CP1.one));
    
    // inf : inf = 1 (ill defined, but holds)
    expect(CP1.inf.div(CP1.inf).eq(CP1.one));
});

test('cp1 conjugate', () => {
    const c1 = new Complex(1, 2);
    // of_complex(cnj(c1)) = cnj(of_complex(c1))
    expect(CP1.of_complex(c1).cnj().eq(CP1.of_complex(c1.cnj())));
    // cnj(inf) = inf
    expect(CP1.inf.cnj().eq(CP1.inf));
});

test('cp1 inversion', () => {
    const c1 = new Complex(1, 2);
    expect(CP1.of_complex(c1).inversion().eq(CP1.of_complex(c1.reciprocal().cnj())));
    expect(CP1.zero.inversion().eq(CP1.inf));
    expect(CP1.inf.inversion().eq(CP1.zero));
});

test('cp1 cross ratio', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(3, 4);
    const c3 = new Complex(5, 6);
    const c4 = new Complex(7, 8);

    // cross-ratio 0, 1, inf is identity
    expect(CP1.cross_ratio(CP1.of_complex(c1), CP1.zero, CP1.one, CP1.inf).eq(CP1.of_complex(c1))).toBeTruthy();

    // 0, 1, inf
    expect(CP1.cross_ratio(CP1.of_complex(c2), CP1.of_complex(c2), CP1.of_complex(c3), CP1.of_complex(c4)).eq(CP1.zero)).toBeTruthy();
    expect(CP1.cross_ratio(CP1.of_complex(c3), CP1.of_complex(c2), CP1.of_complex(c3), CP1.of_complex(c4)).eq(CP1.one)).toBeTruthy();
    expect(CP1.cross_ratio(CP1.of_complex(c4), CP1.of_complex(c2), CP1.of_complex(c3), CP1.of_complex(c4)).eq(CP1.inf)).toBeTruthy();
    //  ((c1-c2)/(c1-c4)) * ((c3-c4)/(c3-c2))
    expect(CP1.cross_ratio(CP1.of_complex(c1), CP1.of_complex(c2), CP1.of_complex(c3), CP1.of_complex(c4)).to_complex().eq((c1.sub(c2).mult(c3.sub(c2))).div(c1.sub(c4).mult(c3.sub(c4))))).toBeTruthy();

    // ill defined (but holds)
    expect(CP1.cross_ratio(CP1.of_complex(c1), CP1.of_complex(c1), CP1.of_complex(c1), CP1.of_complex(c1)).eq(Complex.one)).toBeTruthy();
});

test('cp1 ratio', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(3, 4);
    const c3 = new Complex(5, 6);
    
    const r = CP1.ratio(c1.cp1(), c2.cp1(), c3.cp1());
    expect(r.is_inf()).toBeFalsy();
    expect(r.to_complex().eq((c1.sub(c2)).div(c1.sub(c3)))).toBeTruthy();

    const r1 = CP1.ratio(c1.cp1(), c1.cp1(), c3.cp1());
    expect(r1.is_inf()).toBeFalsy();
    expect(r1.to_complex().eq(Complex.zero)).toBeTruthy();

    const r2 = CP1.ratio(c1.cp1(), c2.cp1(), c1.cp1());
    expect(r2.is_inf()).toBeTruthy();
});

// reveals internal structure
test('cp1 coords', () => {
    expect(CP1.zero.coords()).toStrictEqual([0, 0]);
    expect(CP1.one.coords()).toStrictEqual([1, 0]);
    expect(CP1.inf.coords()).toBeNull();

    // coords are normalized
    const c1 = CP1.of_complex(new Complex(2, 3));
    const c2 = new CP1(new Complex(4, 6), Complex.of_real(2));
    const c3 = new CP1(new Complex(-3, 2), Complex.i);
    expect(c1.coords()).toStrictEqual([2, 3]);
    expect(c2.coords()).toStrictEqual([2, 3]);
    expect(c3.coords()).toStrictEqual([2, 3]);
});
