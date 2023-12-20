"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ANP"] = factory();
	else
		root["ANP"] = factory();
})(self, () => {
return (self["webpackChunkArgoDG"] = self["webpackChunkArgoDG"] || []).push([["ANP"],{

/***/ "./src/an_poincare.js":
/*!****************************!*\
  !*** ./src/an_poincare.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AB_from_cCGMc\": () => (/* reexport safe */ _dg_an_poincare_js__WEBPACK_IMPORTED_MODULE_0__.AB_from_cCGMc),\n/* harmony export */   \"C_from_ABG\": () => (/* reexport safe */ _dg_an_poincare_js__WEBPACK_IMPORTED_MODULE_0__.C_from_ABG),\n/* harmony export */   \"C_from_GOMc\": () => (/* reexport safe */ _dg_an_poincare_js__WEBPACK_IMPORTED_MODULE_0__.C_from_GOMc),\n/* harmony export */   \"Mc_from_GOC\": () => (/* reexport safe */ _dg_an_poincare_js__WEBPACK_IMPORTED_MODULE_0__.Mc_from_GOC),\n/* harmony export */   \"cosPhi\": () => (/* reexport safe */ _dg_an_poincare_js__WEBPACK_IMPORTED_MODULE_0__.cosPhi),\n/* harmony export */   \"dist\": () => (/* reexport safe */ _dg_an_poincare_js__WEBPACK_IMPORTED_MODULE_0__.dist),\n/* harmony export */   \"hdist\": () => (/* reexport safe */ _dg_an_poincare_js__WEBPACK_IMPORTED_MODULE_0__.hdist),\n/* harmony export */   \"on_line_hdist\": () => (/* reexport safe */ _dg_an_poincare_js__WEBPACK_IMPORTED_MODULE_0__.on_line_hdist),\n/* harmony export */   \"ratio\": () => (/* reexport safe */ _dg_an_poincare_js__WEBPACK_IMPORTED_MODULE_0__.ratio)\n/* harmony export */ });\n/* harmony import */ var _dg_an_poincare_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dg/an_poincare.js */ \"./src/dg/an_poincare.js\");\n\n\n\n//# sourceURL=webpack://ArgoDG/./src/an_poincare.js?");

/***/ }),

/***/ "./src/dg/an_poincare.js":
/*!*******************************!*\
  !*** ./src/dg/an_poincare.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AB_from_cCGMc\": () => (/* binding */ AB_from_cCGMc),\n/* harmony export */   \"C_from_ABG\": () => (/* binding */ C_from_ABG),\n/* harmony export */   \"C_from_GOMc\": () => (/* binding */ C_from_GOMc),\n/* harmony export */   \"Mc_from_GOC\": () => (/* binding */ Mc_from_GOC),\n/* harmony export */   \"cosPhi\": () => (/* binding */ cosPhi),\n/* harmony export */   \"dist\": () => (/* binding */ dist),\n/* harmony export */   \"hdist\": () => (/* binding */ hdist),\n/* harmony export */   \"on_line_hdist\": () => (/* binding */ on_line_hdist),\n/* harmony export */   \"ratio\": () => (/* binding */ ratio)\n/* harmony export */ });\n/* harmony import */ var _dg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dg.js */ \"./src/dg/dg.js\");\n/* harmony import */ var _rc_poincare_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rc_poincare.js */ \"./src/dg/rc_poincare.js\");\n/* harmony import */ var _complex_geom_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../complex_geom.js */ \"./src/complex_geom.js\");\n/* harmony import */ var _objects_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./objects.js */ \"./src/dg/objects.js\");\n\n\n\n\n\nfunction dist(A, B) {\n    const [xa, ya] = A.coords();\n    const [xb, yb] = B.coords();\n    return Math.sqrt((xa - xb)*(xa - xb) + (ya - yb)*(ya - yb));\n}\n\nfunction hdist(A, B) {\n    const u = A.to_complex();\n    const v = B.to_complex();\n    return _complex_geom_js__WEBPACK_IMPORTED_MODULE_2__.PoincareDisc.hdist(u, v);\n}\n\nfunction hyp_cosPhi(A, B, C) {\n    return _complex_geom_js__WEBPACK_IMPORTED_MODULE_2__.PoincareDisc.cosPhi(A.to_complex(), B.to_complex(), C.to_complex());\n}\n    \nfunction cosPhi(A, B, C) {\n    const u = A.to_complex();\n    const v = B.to_complex();\n    const w = C.to_complex();\n    const a = u.sub(v);\n    const b = w.sub(v);\n    return _complex_geom_js__WEBPACK_IMPORTED_MODULE_2__.Complex.scalprod(a, b) / (a.norm() * b.norm());\n}\n\n// point X between P and Q such that hdist(P, X) : hdist(X, Q) = r\nfunction ratio(P, Q, r, redraw) {\n    function fun(P, Q, r) {\n        const v = dist(P.to_complex(), Q.to_complex());\n        const [px, py] = P.coords();\n        const [qx, qy] = Q.coords();\n        const cx = (qx-r*r*px)/(1-r*r);\n        const cy = (qy-r*r*py)/(1-r*r);\n        const rr = v * r / Math.abs(1 - r*r);\n        return [cx, cy, rr];\n    }\n    \n    const C1 = _dg_js__WEBPACK_IMPORTED_MODULE_0__.pointFun((P, Q, r) => {\n        const [cx, cy, rr] = fun(P, Q, r);\n        return new _complex_geom_js__WEBPACK_IMPORTED_MODULE_2__.Complex(cx, cy);\n    }, [P, Q, r], _objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW);\n    const C2 = _dg_js__WEBPACK_IMPORTED_MODULE_0__.pointFun((P, Q, r) => {\n        const [cx, cy, rr] = fun(P, Q, r);\n        return new _complex_geom_js__WEBPACK_IMPORTED_MODULE_2__.Complex(cx+rr, cy);\n    }, [P, Q, r], _objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW);\n    const k = _dg_js__WEBPACK_IMPORTED_MODULE_0__.circle(C1, C2, _objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW);\n    const h = line(P, Q, _objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW);\n    const X = _dg_js__WEBPACK_IMPORTED_MODULE_0__.intersectCC_select(h, k, p => _complex_geom_js__WEBPACK_IMPORTED_MODULE_2__.Circline.h_between(P, p, Q), _objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW);\n    const M = _rc_poincare_js__WEBPACK_IMPORTED_MODULE_1__.midpoint(P, Q, _objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW);\n    const res = _dg_js__WEBPACK_IMPORTED_MODULE_0__.If(r => r != 1, X, M, [r]);\n    res.descriptions(\"Point X between \" + P.label() + \" and \" + Q.label() + \" determined by ratio\").show(redraw);\n    return res;\n}\n\nfunction on_line_hdist(l, A, d, cond) {\n    const c = _dg_js__WEBPACK_IMPORTED_MODULE_0__.poincareDiscCircleR(A, d, _objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW);\n    if (cond === undefined)\n        return _dg_js__WEBPACK_IMPORTED_MODULE_0__.intersectCC_both(l, c);\n    else\n        return _dg_js__WEBPACK_IMPORTED_MODULE_0__.intersectCC_select(l, c, cond);\n}\n\nfunction C_from_ABG(A, B, G, redraw)\n{\n    const Mc = _rc_poincare_js__WEBPACK_IMPORTED_MODULE_1__.midpoint(A, B, _objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW);\n    const mc = _rc_poincare_js__WEBPACK_IMPORTED_MODULE_1__.line(Mc, G, _objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW);\n    const s = _dg_js__WEBPACK_IMPORTED_MODULE_0__.num((A, B, G, Mc) => 2 * Math.cosh(hdist(A, B)/2) * Math.sinh(hdist(G, Mc)), [A, B, G, Mc]);\n    const r = _dg_js__WEBPACK_IMPORTED_MODULE_0__.num(s => Math.asinh(s), [s]);\n    // point C on line mc such that sinh(hdist(C, G)) = s and h_between(C, G, Mc)\n    const C = on_line_hdist(mc, G, r, p => _complex_geom_js__WEBPACK_IMPORTED_MODULE_2__.Circline.h_between(p, G, Mc, 1e-10));\n    C.description(\"Calculated from centroid \" + G.label() + \" and vertices \" + A.label() + \" and \" + B.label(), redraw)\n    return C;\n}\n\n\nfunction AB_from_cCGMc(c, C, G, Mc, redraw) {\n    const s = _dg_js__WEBPACK_IMPORTED_MODULE_0__.num((C, G, Mc) => Math.sinh(hdist(C, G)) / (2 * Math.sinh(hdist(G, Mc))), [C, G, Mc]);\n    const r = _dg_js__WEBPACK_IMPORTED_MODULE_0__.num(s => Math.acosh(s), [s]);\n    // points A and B on line c such that cosh(d(Mc, A)) = cosh(d(Mc, B)) = s\n    const [A, B] = on_line_hdist(c, Mc, r)\n    const desc = \"Calculated from centroid \" + G.label() + \" and midpoint \" + Mc.label();\n    A.description(desc, _objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW);\n    B.description(desc, redraw);\n    return [A, B];\n}\n\nfunction C_from_GOMc(G, O, Mc, redraw) {\n    const s = _dg_js__WEBPACK_IMPORTED_MODULE_0__.num((G, O, Mc) => (Math.cosh(hdist(O, Mc)))/(2*Math.cosh(hdist(G, O))*Math.sinh(hdist(G, Mc))) - Math.tanh(hdist(G, O)) * hyp_cosPhi(Mc, G, O), [G, O, Mc]);\n    const r = _dg_js__WEBPACK_IMPORTED_MODULE_0__.num(s => Math.atanh(1/s), [s]);\n    const mc = _rc_poincare_js__WEBPACK_IMPORTED_MODULE_1__.line(Mc, G, _objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW);\n    const C = on_line_hdist(mc, G, r, p => _complex_geom_js__WEBPACK_IMPORTED_MODULE_2__.Circline.h_between(p, G, Mc, 1e-10));\n    C.description(\"Calcluated from centroid \" + G.label() + \", circumcenter \" + O.label() + \", and midpoint \" + Mc.label(), redraw);\n    return C;\n}\n\n\nfunction Mc_from_GOC(G, O, C, redraw) {\n    const s = _dg_js__WEBPACK_IMPORTED_MODULE_0__.num((G, O, C) => (2*Math.cosh(hdist(C, O)) / (Math.cosh(hdist(G, O))*Math.sinh(hdist(C, G)))) - Math.tanh(hdist(G, O)) * hyp_cosPhi(C, G, O), [G, O, C]);\n    const r = _dg_js__WEBPACK_IMPORTED_MODULE_0__.num(s => Math.atanh(1/s), [s]);\n\n    const mc = _rc_poincare_js__WEBPACK_IMPORTED_MODULE_1__.line(C, G, _objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_3__.NO_REDRAW);\n    const Mc = on_line_hdist(mc, G, r, p => _complex_geom_js__WEBPACK_IMPORTED_MODULE_2__.Circline.h_between(C, G, p, 1e-10));\n    \n    Mc.description(\"Calcluated from centroid \" + G.label() + \", circumcenter \" + O.label() + \", and vertex \" + C.label(), redraw);\n    return Mc;\n}\n\n\n\n\n//# sourceURL=webpack://ArgoDG/./src/dg/an_poincare.js?");

/***/ }),

/***/ "./src/dg/rc_poincare.js":
/*!*******************************!*\
  !*** ./src/dg/rc_poincare.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"absolute\": () => (/* binding */ absolute),\n/* harmony export */   \"bisector\": () => (/* binding */ bisector),\n/* harmony export */   \"circle\": () => (/* binding */ circle),\n/* harmony export */   \"drop_perp\": () => (/* binding */ drop_perp),\n/* harmony export */   \"foot\": () => (/* binding */ foot),\n/* harmony export */   \"free\": () => (/* binding */ free),\n/* harmony export */   \"hyperparallel\": () => (/* binding */ hyperparallel),\n/* harmony export */   \"in_disc\": () => (/* binding */ in_disc),\n/* harmony export */   \"intersectCC_both\": () => (/* binding */ intersectCC_both),\n/* harmony export */   \"intersectCC_other\": () => (/* binding */ intersectCC_other),\n/* harmony export */   \"intersectLC_both\": () => (/* binding */ intersectLC_both),\n/* harmony export */   \"intersectLC_other\": () => (/* binding */ intersectLC_other),\n/* harmony export */   \"intersectLL\": () => (/* binding */ intersectLL),\n/* harmony export */   \"line\": () => (/* binding */ line),\n/* harmony export */   \"midpoint\": () => (/* binding */ midpoint),\n/* harmony export */   \"other_tangent\": () => (/* binding */ other_tangent),\n/* harmony export */   \"point\": () => (/* binding */ point),\n/* harmony export */   \"reflectL\": () => (/* binding */ reflectL),\n/* harmony export */   \"reflectP\": () => (/* binding */ reflectP),\n/* harmony export */   \"reflectP_line\": () => (/* binding */ reflectP_line),\n/* harmony export */   \"segment\": () => (/* binding */ segment),\n/* harmony export */   \"tangents\": () => (/* binding */ tangents),\n/* harmony export */   \"tangents_both\": () => (/* binding */ tangents_both),\n/* harmony export */   \"touching_circle\": () => (/* binding */ touching_circle),\n/* harmony export */   \"triangle\": () => (/* binding */ triangle),\n/* harmony export */   \"unit_circle\": () => (/* binding */ unit_circle)\n/* harmony export */ });\n/* harmony import */ var _dg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dg.js */ \"./src/dg/dg.js\");\n/* harmony import */ var _complex_geom_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../complex_geom.js */ \"./src/complex_geom.js\");\n/* harmony import */ var _objects_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./objects.js */ \"./src/dg/objects.js\");\n\n\n\n\nconst unit_circle = _complex_geom_js__WEBPACK_IMPORTED_MODULE_1__.Circline.unit_circle();\nconst in_disc = p => unit_circle.in_disc(p);\nconst absolute = (function() {\n    const O = _dg_js__WEBPACK_IMPORTED_MODULE_0__.point(0, 0).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const X = _dg_js__WEBPACK_IMPORTED_MODULE_0__.point(0, 1).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const abs = _dg_js__WEBPACK_IMPORTED_MODULE_0__.circle(O, X, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"abs\");\n    abs.description(\"absolute\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.REDRAW);\n    return abs;\n})();\n\n\n// free point (must be in the unit disc)\nfunction point(x, y, redraw) {\n    return _dg_js__WEBPACK_IMPORTED_MODULE_0__.point(x, y, redraw, in_disc);\n}\n\nconst free = point;\n\n// line AB\nfunction line(A, B, redraw) {\n    return _dg_js__WEBPACK_IMPORTED_MODULE_0__.poincareDiscLine(A, B, redraw);\n}\n\n// intersection of lines l1 and l2\nfunction intersectLL(l1, l2, redraw) {\n    return _dg_js__WEBPACK_IMPORTED_MODULE_0__.intersectCC_select(l1, l2, in_disc, redraw);\n}\n\n// both intersections of line l and circle c\nfunction intersectLC_both(l, c, redraw) {\n    return _dg_js__WEBPACK_IMPORTED_MODULE_0__.intersectCC_both(l, c, redraw);\n}\n\n// other intersection of line l and circle c (different from given point A)\nfunction intersectLC_other(l, c, A, redraw) {\n    return _dg_js__WEBPACK_IMPORTED_MODULE_0__.intersectCC_select(l, c, p => !p.eq(A), redraw);\n}\n\n// circle centered at O containing A\nfunction circle(O, A, redraw) {\n    return _dg_js__WEBPACK_IMPORTED_MODULE_0__.poincareDiscCircle(O, A, redraw);\n}\n\n// both intersection of circles c1 and c2\nfunction intersectCC_both(c1, c2, redraw) {\n    return _dg_js__WEBPACK_IMPORTED_MODULE_0__.intersectCC_both(c1, c2, redraw);\n}\n\n// other intersection of circles c1 and c2 (different from the given point A)\nfunction intersectCC_other(c1, c2, A, redraw) {\n    return _dg_js__WEBPACK_IMPORTED_MODULE_0__.intersectCC_select(c1, c2, p => !p.eq(A), redraw);\n}\n\n// bisector of segment AB\nfunction bisector(A, B, redraw) {\n    const c1 = circle(A, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const c2 = circle(B, A, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const [X1, X2] = intersectCC_both(c1, c2, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).map(p => p.hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW));\n    const m = line(X1, X2, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    m.description(\"Bisector of segment \" + A.label() + B.label(), redraw);\n    return m;\n}\n\n// midpoint of segment AB\nfunction midpoint(A, B, redraw) {\n    const m = bisector(A, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const l = line(A, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const M = intersectLL(m, l, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const Mp = _dg_js__WEBPACK_IMPORTED_MODULE_0__.If((A, B) => A.eq(B), _dg_js__WEBPACK_IMPORTED_MODULE_0__.clone(B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW), M, [A, B], _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    Mp.description(\"Midpoint of segment \" + A.label() + B.label(), redraw);\n    return Mp;\n}\n\n// circle over segment AB\nfunction circle_over_segment(A, B, redraw) {\n    const l1 = line(A, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const l2 = bisector(A, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const M = intersectLL(l1, l2, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const c = circle(M, A, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    c.description(\"Circle over segment \" + A.label() + B.label(), redraw);\n    return c;\n}\n\n\n// line perpendicular to line l containing point A\nfunction drop_perp(l, A, redraw) {\n    const B = _dg_js__WEBPACK_IMPORTED_MODULE_0__.randomPointOnCircle(l, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW, p => true, unit_circle).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); // FIXME: diffferent from A\n    const c = circle(A, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const [X1, X2] = intersectLC_both(l, c, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).map(p => p.hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW));\n    const m = bisector(X1, X2, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    m.description(\"Drop perpendicular from point \" + A.label() + \" onto line \" + l.label(), redraw);\n    return m;\n}\n\n// foot of the perpendicular projection of point A onto line l\nfunction foot(l, A, redraw)  {\n    const p = drop_perp(l, A, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const X = intersectLL(p, l, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    X.description(\"Project point \" + A.label() + \" onto line \" + l.label(), redraw);\n    return X;\n}\n\n// reflection of point B around point O\nfunction reflectP(O, B, redraw) {\n    const l = line(O, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const c = circle(O, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const BB = intersectLC_other(l, c, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const r = _dg_js__WEBPACK_IMPORTED_MODULE_0__.If((O, B) => O.eq(B), _dg_js__WEBPACK_IMPORTED_MODULE_0__.clone(B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW), BB, [O, B]);\n    r.description(\"Reflect point \" + B.label() + \" about point \" + O.label(), redraw);\n    return r;\n}\n\n// reflection of pointb A around line l\nfunction reflectL(l, A, redraw) {\n    const p = drop_perp(l, A, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const M = intersectLL(p, l, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const c = circle(M, A, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const AA = intersectLC_other(p, c, A, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const r = _dg_js__WEBPACK_IMPORTED_MODULE_0__.If((A, M) => A.eq(M), _dg_js__WEBPACK_IMPORTED_MODULE_0__.clone(A, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW), AA, [A, M]);\n    r.description(\"Reflect point \" + A.label() + \" about line \" + l.label(), redraw);\n    return r;\n}\n\n// reflection of line l around point O \nfunction reflectP_line(O, l, redraw) {\n    var B1 = _dg_js__WEBPACK_IMPORTED_MODULE_0__.randomPointOnCircle(l, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW, p => true, unit_circle).hide();\n    var B2 = _dg_js__WEBPACK_IMPORTED_MODULE_0__.randomPointOnCircle(l, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW, p => !B1.eq(p), unit_circle).hide();\n    var B1p = reflectP(O, B1, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    var B2p = reflectP(O, B2, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    var lp = line(B1p, B2p, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    lp.description(\"Reflect line \" + l.label() + \" about point \" + O.label(), redraw);\n    return lp;\n}\n\n\n// circle centered at point A that touches line l\nfunction touching_circle(A, l, redraw) {\n    const p = drop_perp(l, A, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const M = intersectLL(p, l, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const c = circle(A, M, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    c.description(\"Circle centered in \" + A.label() + \" touching line \" + l.label(), redraw);\n    return c;\n}\n\n\n// both tangents from point A that touch circle c centered at O\n// FIXME: remove parameter O\nfunction tangents_both(A, O, c, redraw) {\n    var T = _dg_js__WEBPACK_IMPORTED_MODULE_0__.randomPointOnCircle(c, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW, p => true, unit_circle).hide();\n    var ot = line(O, T, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    var t = drop_perp(ot, T, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    var cA = circle(O, A, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    var [X1, X2] = intersectLC_both(t, cA, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).map(p => p.hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW));\n\n    var p1 = bisector(X1, A, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    var T1 = reflectL(p1, T, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    var t1 = line(A, T1, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    \n    var p2 = bisector(X2, A, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    var T2 = reflectL(p2, T, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    var t2 = line(A, T2, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n\n    t1.description(\"Tangent from point \" + A.label() + \" onto circle \" + c.label(), _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    t2.description(\"Tangent from point \" + A.label() + \" onto circle \" + c.label(), redraw);\n\n    return [t1, t2, X1, X2];\n}\n\nfunction tangents(A, O, c, redraw) {\n    const [t1, t2, X1, X2] = tangents_both(A, O, c, redraw);\n    return [t1, t2];\n}\n\n// tangent from point A that touch circle c, that is different from the given line t\nfunction other_tangent(A, O, c, t, redraw) {\n    const [t1, t2] = tangents(A, O, c, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).map(t => t.hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW));\n    const t_ = _dg_js__WEBPACK_IMPORTED_MODULE_0__.If((t, t1) => t.eq(t1, 1e-7), t2, t1, [t, t1]);\n    t_.description(\"Tangent from point \" + A.label() + \" to circle \" + c.label(), redraw);\n    return t_;\n}\n\n\n// hyperparallel line to line l that contains point A \nfunction hyperparallel(l, A, redraw) {\n    const n = drop_perp(l, A, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const p = drop_perp(n, A, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    p.description(\"Line trough point \" + A.label() + \" hyperparallel to \" + l.label(), redraw);\n    return p;\n}\n\n// a line that bisect the angle BAC\nfunction angle_bisector(B, A, C, redraw) {\n    const k = circle(A, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const c = line(A, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const b = line(A, C, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const X = _dg_js__WEBPACK_IMPORTED_MODULE_0__.intersectCC_select(b, k, p => !_complex_geom_js__WEBPACK_IMPORTED_MODULE_1__.Circline.h_between(p, A, C), _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const k1 = circle(B, X, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const k2 = circle(X, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const Y = _dg_js__WEBPACK_IMPORTED_MODULE_0__.intersectCC_any(k1, k2, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const l = line(A, Y, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    l.description(\"Angle \" + B.label() + A.label() + C.label() + \" bisector\", redraw);\n    return l;\n}\n\nfunction segment(A, B, redraw) {\n    const M = midpoint(A, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    const s =  _dg_js__WEBPACK_IMPORTED_MODULE_0__.arc(A, M, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW);\n    s.description(\"Segment \" + A.label() + B.label(), redraw);\n    return s;\n}\n\nfunction triangle(A, B, C) {\n    const elements = [A, B, C];\n    // sides\n    const a = line(B, C, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"a\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).width(2, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(a);\n    const b = line(A, C, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"b\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).width(2, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(b);\n    const c = line(A, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"c\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).width(2, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(c);\n\n    // side midpoints\n    const Ma = midpoint(B, C, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"green\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"M_{a}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Ma);\n    const Mb = midpoint(A, C, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"green\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"M_{b}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Mb);\n    const Mc = midpoint(A, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"green\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"M_{c}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Mc);\n    \n    // side bisectors\n    const ba = bisector(B, C, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"blue\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"b_{a}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(ba);\n    const bb = bisector(A, C, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"blue\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"b_{b}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(bb);\n    const bc = bisector(A, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"blue\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"b_{c}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(bc);\n\n    // circumcenter\n    const O = intersectLL(ba, bb, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"blue\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"O\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(O);\n\n    // circumcircle\n    const o = circle(O, A, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"blue\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"o\"); elements.push(o);\n\n    // medians\n    const ma = line(A, Ma, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"green\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"m_{a}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(ma);\n    const mb = line(B, Mb, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"green\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"m_{b}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(mb);\n    const mc = line(C, Mc, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"green\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"m_{c}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(mc);\n\n    // centroid\n    const G = intersectLL(ma, mb, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"green\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"G\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(G);\n\n    // midlines\n    const MaMb = line(Ma, Mb, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"DarkTurquoise\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"MaMb\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(MaMb);\n    const MaMc = line(Ma, Mc, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"DarkTurquoise\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"MaMc\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(MaMc);\n    const MbMc = line(Mb, Mc, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"DarkTurquoise\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"MbMc\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(MbMc);\n    \n    // angle bisectors\n    const ta = angle_bisector(B, A, C, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"orange\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"t_{a}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(ta);\n    const tb = angle_bisector(A, B, C, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"orange\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"t_{b}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(tb);\n    const tc = angle_bisector(B, C, A, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"orange\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"t_{c}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(tc);\n    \n    // incenter\n    const I = intersectLL(ta, tb, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"orange\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"I\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(I);\n\n    // angle bisector feet\n    const Ta = intersectLL(ta, a, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"orange\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"T_{a}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Ta);\n    const Tb = intersectLL(tb, b, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"orange\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"T_{b}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Tb);\n    const Tc = intersectLL(tc, c, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"orange\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"T_{c}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Tc);\n\n    // incenter perpendicular projections onto triangle sides\n    const tpa = drop_perp(a, I, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"Chocolate\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"t'_{a}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(tpa);\n    const tpb = drop_perp(b, I, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"Chocolate\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"t'_{b}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(tpb);\n    const tpc = drop_perp(c, I, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"Chocolate\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"t'_{c}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(tpc);\n\n    // incenter projection feet\n    const Tpa = intersectLL(tpa, a, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"Chocolate\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"T'_{a}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Tpa);\n    const Tpb = intersectLL(tpb, b, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"Chocolate\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"T'_{b}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Tpb);\n    const Tpc = intersectLL(tpc, c, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"Chocolate\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"T'_{c}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Tpc);\n\n    // incircle\n    const i = circle(I, Tpa, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"orange\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"i\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(i);\n    \n    // altitudes\n    const ha = drop_perp(a, A, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"red\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"h_{a}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(ha);\n    const hb = drop_perp(b, B, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"red\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"h_{b}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(hb);\n    const hc = drop_perp(c, C, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"red\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"h_{c}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(hc);\n\n    // orthocenter\n    const H = intersectLL(ha, hb, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"red\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"H\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(H);\n\n    // altitude feet\n    const Ha = intersectLL(ha, a, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"red\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"H_{a}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Ha);\n    const Hb = intersectLL(hb, b, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"red\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"H_{b}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Hb);\n    const Hc = intersectLL(hc, c, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"red\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"H_{c}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Hc);\n\n\n    // angle bisector feet projections onto other triangle sides\n    const Ta_b = foot(b, Ta, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"Olive\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"T_{ab}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Ta_b);\n    const Ta_c = foot(c, Ta, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"Olive\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"T_{ac}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Ta_c);\n    const cTa = circle(Ta, Ta_b, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"Olive\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"c_{T_a}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(cTa);\n\n    const Tb_a = foot(a, Tb, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"Olive\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"T_{ba}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Tb_a);\n    const Tb_c = foot(c, Tb, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"Olive\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"T_{bc}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Tb_c);\n    const cTb = circle(Tb, Tb_a, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"Olive\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"c_{T_b}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(cTb);\n\n    const Tc_a = foot(a, Tc, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"Olive\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"T_{ca}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Tc_a);\n    const Tc_b = foot(b, Tc, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"Olive\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"T_{cb}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(Tc_b);\n    const cTc = circle(Tc, Tc_a, _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).color(\"Olive\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW).label(\"c_{T_c}\", _objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW); elements.push(cTc);\n    \n    elements.map(obj => obj.hide(_objects_js__WEBPACK_IMPORTED_MODULE_2__.NO_REDRAW));    \n    return elements;\n}\n\n\n\n\n//# sourceURL=webpack://ArgoDG/./src/dg/rc_poincare.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/an_poincare.js"));
/******/ return __webpack_exports__;
/******/ }
]);
});