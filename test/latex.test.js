import { normalizeBraces, laTeX2HTML, removeLaTeX, splitSubscript } from '../src/dg/latex.js';

test('normalizeBraces', () => {
    expect(normalizeBraces("A_1")).toBe("A_{1}");
    expect(normalizeBraces("Line M_aM_b")).toBe("Line M_{a}M_{b}");
});

test('LaTeX2HTML', () => {
    expect(laTeX2HTML("A_1")).toBe("A<sub>1</sub>");
    expect(laTeX2HTML("A_{10}")).toBe("A<sub>10</sub>");
    expect(laTeX2HTML("Line M_aM_b")).toBe("Line M<sub>a</sub>M<sub>b</sub>");
});

test('splitSubscript', () => {
    let m = splitSubscript("A_1");
    expect(m.text).toBe("A");
    expect(m.subscript).toBe("1");

    m = splitSubscript("H_{A}");
    expect(m.text).toBe("H");
    expect(m.subscript).toBe("A");

    m = splitSubscript("M'_{AB}");
    expect(m.text).toBe("M'");
    expect(m.subscript).toBe("AB");

    m = splitSubscript("A");
    expect(m.text).toBe("A");
    expect(m.subscript).toBeUndefined();

    m = splitSubscript("Ha'");
    expect(m.text).toBe("Ha'");
    expect(m.subscript).toBeUndefined();

    m = splitSubscript("A_{B_1}");
    expect(m.text).toBe("A");
    expect(m.subscript).toBe("B_{1}");

    m = splitSubscript("r_{s_b}(A)");
    expect(m.text).toBe("r");
    expect(m.subscript).toBe("s_{b}");
    expect(m.rest).toBe("(A)");

    m = splitSubscript("M_aM_b");
    expect(m.text).toBe("M");
    expect(m.subscript).toBe("a");
    expect(m.rest).toBe("M_{b}");
});
