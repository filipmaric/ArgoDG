const { ComplexMatrix2x2 }  = require('../src/complex_geom/complex_matrix.js');
const { Complex }  = require('../src/complex_geom.js');

test('det', () => {
    expect(ComplexMatrix2x2.eye().det().eq(Complex.one)).toBeTruthy();
    expect(ComplexMatrix2x2.zero().det().eq(Complex.zero)).toBeTruthy();
    expect(new ComplexMatrix2x2(Complex.of_real(1), Complex.of_real(2), Complex.of_real(3), Complex.of_real(4)).det().eq(new Complex(-2, 0))).toBeTruthy();
});

test('mult', () => {
    const A = new Complex(1, 2);
    const B = new Complex(3, 4);
    const C = new Complex(5, 6);
    const D = new Complex(7, 8);
    
    const M = new ComplexMatrix2x2(A, B, C, D);
    const c = new Complex(2, 3);
    const M1 = new ComplexMatrix2x2(A.mult(c), B.mult(c), C.mult(c), D.mult(c));
    expect(M.multC(c).eq(M1)).toBeTruthy();
});

test('is_hermitean', () => {
    const A = Complex.of_real(1);
    const B = new Complex(2, 3);
    const C = B.cnj();
    const D = Complex.of_real(2);
    expect(new ComplexMatrix2x2(A, B, C, D).is_hermitean()).toBeTruthy();
    expect(ComplexMatrix2x2.eye().is_hermitean()).toBeTruthy();

    expect(new ComplexMatrix2x2(Complex.of_real(1), Complex.of_real(2), Complex.of_real(2), Complex.of_real(1)).is_hermitean()).toBeTruthy();
    expect(new ComplexMatrix2x2(Complex.of_real(1), Complex.of_real(2), Complex.of_real(-2), Complex.of_real(1)).is_hermitean()).toBeFalsy();
    expect(new ComplexMatrix2x2(Complex.of_real(1), new Complex(2, 1), new Complex(2, 1), Complex.of_real(1)).is_hermitean()).toBeFalsy();


    const M = new ComplexMatrix2x2(new Complex(1, 2), new Complex(3, 4), new Complex(5, 6), new Complex(7, 8));
    expect(M.multM(M.adj()).is_hermitean()).toBeTruthy();
});

test('is_zero', () => {
    expect(ComplexMatrix2x2.zero().is_zero()).toBeTruthy();
    expect(ComplexMatrix2x2.eye().is_zero()).toBeFalsy();
});

test('transpose', () => {
    const A = new Complex(1, 2);
    const B = new Complex(3, 4);
    const C = new Complex(5, 6);
    const D = new Complex(7, 8);
    const M1 = new ComplexMatrix2x2(A, B, C, D);
    const M2 = new ComplexMatrix2x2(A, C, B, D);
    expect(M1.eq(M2.transpose())).toBeTruthy();
});

test('inv', () => {
    expect(ComplexMatrix2x2.eye().inv().eq(ComplexMatrix2x2.eye())).toBeTruthy();

    const M = new ComplexMatrix2x2(new Complex(1, 2), new Complex(3, 4), new Complex(5, 6), new Complex(7, 8));
    expect(M.multM(M.inv()).eq(ComplexMatrix2x2.eye())).toBeTruthy();
});

test('eq', () => {
    const A = new Complex(1, 2);
    const B = new Complex(3, 4);
    const C = new Complex(5, 6);
    const D = new Complex(7, 8);
    
    const M1 = new ComplexMatrix2x2(A, B, C, D);
    const M2 = new ComplexMatrix2x2(A, B, C, D);
    expect(M1.eq(M2)).toBeTruthy();
    
    const M3 = new ComplexMatrix2x2(A.add(new Complex(1e-10, 0)),
                                    B.add(new Complex(1e-10, 0)),
                                    C.add(new Complex(0, 1e-10)),
                                    D.add(new Complex(0, 1e-10)));
    expect(M1.eq(M3)).toBeTruthy();
    
    const M4 = new ComplexMatrix2x2(B, A, C, D);
    expect(M1.eq(M4)).toBeFalsy();
});
