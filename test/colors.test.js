import { parseRGB, rgbColor, getOpacity, setOpacity } from '../src/dg/colors.js';

test('parseRGB', () => {
    expect(parseRGB("rgb(255,0,0)")).toStrictEqual({"r":255, "g":0, "b":0});
    expect(parseRGB("rgba(255,0,0,0.3)")).toStrictEqual({"r":255, "g":0, "b":0});
    expect(parseRGB("rgba(255,0,0,1)")).toStrictEqual({"r":255, "g":0, "b":0});
    expect(parseRGB("rgb(1, 2, 3)")).toStrictEqual({"r":1, "g":2, "b":3});
    expect(parseRGB("rgb(100, 100,   100)")).toStrictEqual({"r":100, "g":100, "b":100});
});

test('rgbColor', () => {
    expect(rgbColor("red")).toStrictEqual({"r":255, "g":0, "b":0});
    expect(rgbColor("#00FF00")).toStrictEqual({"r":0, "g":255, "b":0});
    expect(rgbColor("#00F")).toStrictEqual({"r":0, "g":0, "b":255});
});

test('setOpacity', () => {
    expect(setOpacity("red", 0.8)).toBe("rgba(255, 0, 0, 0.8)");
    expect(setOpacity("rgb(0, 255, 255)", 0.2)).toBe("rgba(0, 255, 255, 0.2)");
    expect(setOpacity("#0F0F0F", 0.3)).toBe("rgba(15, 15, 15, 0.3)");
});

test('getOpacity', () => {
    expect(getOpacity("red")).toBe(1);
    expect(getOpacity("rgba(255, 0, 0, 0.4)")).toBe(0.4);
    expect(getOpacity("rgba(255,255,255, 0.25)")).toBe(0.25);
    expect(getOpacity("")).toBe(1);
});
