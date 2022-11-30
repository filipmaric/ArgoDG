const { Complex, CP1, Circline, INCLUDE_FICTIVE } = require('../src/complex_geom.js');

const {
    DGObject,
    DGPoint,
    DGLine,
    DGCircle,
    DGSegment,
    DGArc,
    DGRandomPoint,
    DGRandomPointOnCircline,
    DGCircleCenterPoint,
    DGIntersectLL,
    DGIntersectLC,
    DGIntersectCL,
    DGIntersectCC,
    
    DGClone,
    DGIf,
    DGConst,
    DGNum,
    DGPointFun,
    
    
    DGPoincareDiscLine,
    DGPoincareDiscCircle,
    DGPoincareDiscCircleR,
    DGPoincareHalfPlaneLine,
    DGPoincareHalfPlaneCircleR,
    DGPoincareHalfPlaneCircle,

    REDRAW, NO_REDRAW
} = require('../src/dg/objects.js');

const { Construction } = require('../src/dg/construction.js');

const { GraphicsView } = require('../src/dg/graphics_view.js');
jest.mock('../src/dg/graphics_view.js');


test('show/hide', () => {
    const obj = new DGObject();
    expect(obj.hidden()).toBeFalsy();
    expect(obj.visible()).toBeTruthy();

    obj.hide(NO_REDRAW);
    expect(obj.hidden()).toBeTruthy();
    expect(obj.visible()).toBeFalsy();

    obj.show(NO_REDRAW);
    expect(obj.hidden()).toBeFalsy();
    expect(obj.visible()).toBeTruthy();

    
    const p = new DGPoint(100, 100);
    expect(p.visible()).toBeTruthy();
    p.hide(NO_REDRAW);
    expect(p.visible()).toBeFalsy();
    p.show(NO_REDRAW);
    expect(p.visible()).toBeTruthy();

    const pc = new DGClone(p);
    expect(pc.visible()).toBeTruthy();
    expect(p.visible()).toBeTruthy();
    pc.hide(NO_REDRAW);
    expect(pc.visible()).toBeFalsy();
    expect(p.visible()).toBeTruthy();
    pc.show(NO_REDRAW);
    expect(pc.visible()).toBeTruthy();
    expect(p.visible()).toBeTruthy();

    const P1 = new DGPoint(50, 50);
    const P2 = new DGPoint(-50, -50);
    const P = new DGIf((P1, P2) => true, P1, P2, [P1, P2]);
    expect(P.visible()).toBeTruthy();
    expect(P1.visible()).toBeFalsy();
    expect(P2.visible()).toBeFalsy();
    P.hide(NO_REDRAW);
    expect(P.visible()).toBeFalsy();
    expect(P1.visible()).toBeFalsy();
    expect(P2.visible()).toBeFalsy();
    P.show(NO_REDRAW);
    expect(P.visible()).toBeTruthy();
    expect(P1.visible()).toBeFalsy();
    expect(P2.visible()).toBeFalsy();

    const n = new DGNum(() => 0, []);
    expect(n.hidden()).toBeTruthy();
});

test('set color', () => {
    const obj = new DGObject();
    expect(obj.getColor()).toBe("black");
    expect(obj.color()).toBe("black");
    obj.setColor("red", NO_REDRAW);
    expect(obj.getColor()).toBe("red");
    expect(obj.color()).toBe("red");
    obj.color("blue", NO_REDRAW);
    expect(obj.getColor()).toBe("blue");
    expect(obj.color()).toBe("blue");

    expect(obj.color("green") == obj).toBeTruthy();
    expect(obj.color("green", NO_REDRAW) == obj).toBeTruthy();

    const p = new DGPoint(100, 100);
    p.color("green", NO_REDRAW);
    expect(p.color()).toBe("green");

    const pc = new DGClone(p);
    expect(pc.color()).toBe("green");
    pc.color("blue");
    expect(pc.color()).toBe("blue");
    expect(p.color()).toBe("green");

    const P1 = new DGPoint(50, 50);
    const P2 = new DGPoint(-50, -50);
    const P = new DGIf((P1, P2) => true, P1, P2, [P1, P2]);
    expect(P.color()).toBe("black");
    P.setColor("red", NO_REDRAW);
    expect(P.color()).toBe("red");
    expect(P1.color()).toBe("red");
    expect(P2.color()).toBe("red");
    P.color("blue", NO_REDRAW);
    expect(P.color()).toBe("blue");
    expect(P1.color()).toBe("blue");
    expect(P2.color()).toBe("blue");
});

test('set opacity', () => {
    const obj = new DGObject();
    expect(obj.opacity()).toBe(1);
    expect(obj.getOpacity()).toBe(1);
    obj.opacity(0.8);
    expect(obj.opacity()).toBe(0.8);
    expect(obj.getOpacity()).toBe(0.8);
    obj.setOpacity(0.4);
    expect(obj.opacity()).toBe(0.4);
    expect(obj.getOpacity()).toBe(0.4);

    expect(obj.opacity(0.5) == obj).toBeTruthy();
    expect(obj.opacity(0.5, NO_REDRAW) == obj).toBeTruthy();
    
    const p = new DGPoint(100, 100);
    p.opacity(0.75);
    expect(p.opacity()).toBe(0.75);

    const pc = new DGClone(p);
    expect(pc.opacity()).toBe(0.75);
    pc.opacity(0.8);
    expect(pc.opacity()).toBe(0.8);
    expect(p.opacity()).toBe(0.75);
    
    const P1 = new DGPoint(50, 50);
    const P2 = new DGPoint(-50, -50);
    const P = new DGIf((P1, P2) => true, P1, P2, [P1, P2]);
    expect(P.opacity()).toBe(1);
    P.setOpacity(0.5);
    expect(P.opacity()).toBe(0.5);
    expect(P1.opacity()).toBe(0.5);
    expect(P2.opacity()).toBe(0.5);
    P.opacity(0.75);
    expect(P.opacity()).toBe(0.75);
    expect(P1.opacity()).toBe(0.75);
    expect(P2.opacity()).toBe(0.75);
});

test('set size', () => {
    const obj = new DGObject();
    expect(obj.size()).toBe(1);
    expect(obj.getSize()).toBe(1);
    obj.size(2);
    expect(obj.size()).toBe(2);
    expect(obj.getSize()).toBe(2);
    obj.setSize(2.5);
    expect(obj.size()).toBe(2.5);
    expect(obj.getSize()).toBe(2.5);

    expect(obj.size(4) == obj).toBeTruthy();
    expect(obj.size(4, NO_REDRAW) == obj).toBeTruthy();
    
    const p = new DGPoint(100, 100);
    p.size(3, NO_REDRAW);
    expect(p.size()).toBe(3);
    
    const pc = new DGClone(p);
    expect(pc.size()).toBe(3);
    pc.size(1.2);
    expect(pc.size()).toBe(1.2);
    expect(p.size()).toBe(3);
    
    const P1 = new DGPoint(50, 50);
    const P2 = new DGPoint(-50, -50);
    const P = new DGIf((P1, P2) => true, P1, P2, [P1, P2]);
    expect(P.size()).toBe(1);
    P.setSize(2);
    expect(P.size()).toBe(2);
    expect(P1.size()).toBe(2);
    expect(P2.size()).toBe(2);
    P.size(0.75);
    expect(P.size()).toBe(0.75);
    expect(P1.size()).toBe(0.75);
    expect(P2.size()).toBe(0.75);
});

test('set width', () => {
    const obj = new DGObject();
    expect(obj.width()).toBe(1);
    expect(obj.getWidth()).toBe(1);
    obj.width(2);
    expect(obj.width()).toBe(2);
    expect(obj.getWidth()).toBe(2);
    obj.setWidth(2.5);
    expect(obj.width()).toBe(2.5);
    expect(obj.getWidth()).toBe(2.5);

    expect(obj.width(4) == obj).toBeTruthy();
    expect(obj.width(4, NO_REDRAW) == obj).toBeTruthy();
    
    const p1 = new DGPoint(100, 100);
    const p2 = new DGPoint(-100, -100);
    const l = new DGLine(p1, p2);
    l.width(3, NO_REDRAW);
    expect(l.width()).toBe(3);
    
    const lc = new DGClone(l);
    expect(lc.width()).toBe(3);
    lc.width(1.2);
    expect(lc.width()).toBe(1.2);
    expect(l.width()).toBe(3);
    
    const P1 = new DGPoint(50, 50);
    const P2 = new DGPoint(-50, -50);
    const P = new DGIf((P1, P2) => true, P1, P2, [P1, P2]);
    expect(P.width()).toBe(1);
    P.setWidth(2);
    expect(P.width()).toBe(2);
    expect(P1.width()).toBe(2);
    expect(P2.width()).toBe(2);
    P.width(0.75);
    expect(P.width()).toBe(0.75);
    expect(P1.width()).toBe(0.75);
    expect(P2.width()).toBe(0.75);
});

test('dashed or solid', () => {
    const obj = new DGObject();
    expect(obj.isDashed()).toBeFalsy();
    expect(obj.dash().length).toBe(0);
    obj.dashed(NO_REDRAW);
    expect(obj.isDashed()).toBeTruthy();
    expect(obj.dash().length > 0).toBeTruthy();
    obj.solid(NO_REDRAW);
    expect(obj.isDashed()).toBeFalsy();
    expect(obj.dash().length).toBe(0);

    expect(obj.dashed() == obj).toBeTruthy();
    expect(obj.dashed(NO_REDRAW) == obj).toBeTruthy();

    expect(obj.solid() == obj).toBeTruthy();
    expect(obj.solid(NO_REDRAW) == obj).toBeTruthy();
    
    const p1 = new DGPoint(100, 100);
    const p2 = new DGPoint(-100, -100);
    const l = new DGLine(p1, p2);
    l.dashed(NO_REDRAW);
    expect(l.isDashed()).toBeTruthy();
    l.solid(NO_REDRAW);
    expect(l.isDashed()).toBeFalsy();
    
    const lc = new DGClone(l);
    expect(lc.isDashed()).toBeFalsy();
    lc.dashed(NO_REDRAW);
    expect(lc.isDashed()).toBeTruthy();
    expect(l.isDashed()).toBeFalsy();
    lc.solid(NO_REDRAW);
    expect(lc.isDashed()).toBeFalsy();
    expect(l.isDashed()).toBeFalsy();
    
    
    const P1 = new DGPoint(50, 50);
    const P2 = new DGPoint(-50, -50);
    const P = new DGIf((P1, P2) => true, P1, P2, [P1, P2]);
    expect(P.isDashed()).toBeFalsy();
    P.dashed(NO_REDRAW);
    expect(P.isDashed()).toBeTruthy();
    expect(P1.isDashed()).toBeTruthy();
    expect(P2.isDashed()).toBeTruthy();
    P.solid();
    expect(P.isDashed()).toBeFalsy();
    expect(P1.isDashed()).toBeFalsy();
    expect(P2.isDashed()).toBeFalsy();
});

test('label', () => {
    const obj = new DGObject();
    expect(obj.label() == obj.defaultLabel()).toBeTruthy();
    expect(obj.hasLabel()).toBeFalsy();
    expect(obj.showingLabel()).toBeTruthy();
    obj.label("A", NO_REDRAW);
    expect(obj.label()).toBe("A");
    expect(obj.getLabel()).toBe("A");
    expect(obj.hasLabel()).toBeTruthy();

    obj.setLabel("B", NO_REDRAW);
    expect(obj.label()).toBe("B");
    expect(obj.getLabel()).toBe("B");
    expect(obj.hasLabel()).toBeTruthy();
    
    expect(obj.showingLabel()).toBeTruthy();
    obj.hideLabel(NO_REDRAW);
    expect(obj.showingLabel()).toBeFalsy();
    obj.showLabel(NO_REDRAW);
    expect(obj.showingLabel()).toBeTruthy();

    expect(obj.label("A") == obj).toBeTruthy();
    expect(obj.label("A", NO_REDRAW) == obj).toBeTruthy();

    const p = new DGPoint(100, 100);
    p.label("X");
    expect(p.label()).toBe("X");

    const pc = new DGClone(p);
    expect(pc.label()).toBe("X");
    expect(pc.showingLabel()).toBeTruthy();
    pc.label("Y", NO_REDRAW);
    expect(pc.label()).toBe("Y");
    expect(pc.showingLabel()).toBeTruthy();
    expect(p.label()).toBe("X");
    expect(p.showingLabel()).toBeTruthy();
    pc.hideLabel();
    expect(pc.showingLabel()).toBeFalsy();
    expect(p.showingLabel()).toBeTruthy();

    const P1 = new DGPoint(50, 50);
    const P2 = new DGPoint(-50, -50);
    const P = new DGIf((P1, P2) => true, P1, P2, [P1, P2]);
    expect(P.hasLabel()).toBeFalsy();
    P.label("P", NO_REDRAW);
    expect(P.hasLabel()).toBeTruthy();
    expect(P.label()).toBe("P");
    expect(P1.label()).toBe("P");
    expect(P2.label()).toBe("P");

    expect(P.showingLabel()).toBeTruthy();
    expect(P1.showingLabel()).toBeTruthy();
    expect(P2.showingLabel()).toBeTruthy();

    P.hideLabel(NO_REDRAW);

    expect(P.showingLabel()).toBeFalsy();
    expect(P1.showingLabel()).toBeFalsy();
    expect(P2.showingLabel()).toBeFalsy();

    P.showLabel(NO_REDRAW);

    expect(P.showingLabel()).toBeTruthy();
    expect(P1.showingLabel()).toBeTruthy();
    expect(P2.showingLabel()).toBeTruthy();
});

test('description', () => {
    const obj = new DGObject();
    expect(obj.description() == obj.defaultDescription()).toBeTruthy();
    expect(obj.hasDescription()).toBeFalsy();
    obj.description("Description", NO_REDRAW);
    expect(obj.description()).toBe("Description");
    expect(obj.hasDescription()).toBeTruthy();
    obj.addDescription(".", NO_REDRAW);
    expect(obj.description()).toBe("Description.");

    const p = new DGPoint(100, 100);
    p.label("X");
    expect(p.describe()).toBe("point X");
    p.description("intersection", NO_REDRAW);
    expect(p.description()).toBe("intersection");
    expect(p.describe()).toBe("X: intersection");

    const q = new DGPoint(50, 50);
    expect(q.describe()).toBe(q.defaultLabel());
    q.description("random point");
    expect(q.describe()).toBe("random point");
    q.label("A");
    expect(q.describe()).toBe("A: random point");

    const pc = new DGClone(p);
    expect(pc.description()).toBe("intersection");
    expect(pc.describe()).toBe("X: intersection");
    pc.description("new description");
    expect(pc.description()).toBe("new description");
    expect(p.description()).toBe("intersection");

    const P1 = new DGPoint(50, 50);
    const P2 = new DGPoint(-50, -50);
    const P = new DGIf((P1, P2) => true, P1, P2, [P1, P2]);
    expect(P.hasDescription()).toBeFalsy();
    expect(P1.hasDescription()).toBeFalsy();
    expect(P2.hasDescription()).toBeFalsy();
    P.description("description", NO_REDRAW);
    expect(P.hasDescription()).toBeTruthy();
    expect(P1.hasDescription()).toBeTruthy();
    expect(P2.hasDescription()).toBeTruthy();
    expect(P.description()).toBe("description");
    expect(P1.description()).toBe("description");
    expect(P2.description()).toBe("description");
});

test('highlight', () => {
    const obj = new DGObject();
    expect(obj.isHighlighted()).toBeFalsy();
    obj.highlightOn(NO_REDRAW);
    expect(obj.isHighlighted()).toBeTruthy();
    obj.highlightOff(NO_REDRAW);
    expect(obj.isHighlighted()).toBeFalsy();

    const p = new DGPoint(100, 100);
    expect(p.isHighlighted()).toBeFalsy();
    p.highlightOn(NO_REDRAW);
    expect(p.isHighlighted()).toBeTruthy();
    p.highlightOff(NO_REDRAW);
    expect(p.isHighlighted()).toBeFalsy();

    const pc = new DGClone(p);
    expect(pc.isHighlighted()).toBeFalsy();
    pc.highlightOn(NO_REDRAW);
    expect(pc.isHighlighted()).toBeTruthy();
    expect(p.isHighlighted()).toBeFalsy();
    pc.highlightOff(NO_REDRAW);
    expect(pc.isHighlighted()).toBeFalsy();
    expect(p.isHighlighted()).toBeFalsy();
    
    
    const P1 = new DGPoint(50, 50);
    const P2 = new DGPoint(-50, -50);
    const P = new DGIf((P1, P2) => true, P1, P2, [P1, P2]);
    expect(P.isHighlighted()).toBeFalsy();
    expect(P1.isHighlighted()).toBeFalsy();
    expect(P2.isHighlighted()).toBeFalsy();
    P.highlightOn(NO_REDRAW);
    expect(P.isHighlighted()).toBeTruthy();
    expect(P1.isHighlighted()).toBeTruthy();
    expect(P2.isHighlighted()).toBeTruthy();
    P.highlightOff(NO_REDRAW);
    expect(P.isHighlighted()).toBeFalsy();
    expect(P1.isHighlighted()).toBeFalsy();
    expect(P2.isHighlighted()).toBeFalsy();
});

test('valid', () => {
    const p = new DGPoint(100, 100);
    expect(p.valid()).toBeTruthy();
});

test('redraw', () => {
    function construction() {
        return {
            calledDraw: 0,
            
            reset() {
                this.calledDraw = 0;
            },

            change() {
                this.draw();
            },
            
            draw: function() {
                this.calledDraw++;
            }
        };
    }
    const p = new DGPoint(100, 100);
    const c = construction();
    p.addConstruction(c);

    c.reset()
    expect(c.calledDraw).toBe(0);
    p.show();
    expect(c.calledDraw).toBe(1);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.show(NO_REDRAW);
    expect(c.calledDraw).toBe(0);

    c.reset()
    expect(c.calledDraw).toBe(0);
    p.hide();
    expect(c.calledDraw).toBe(1);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.hide(NO_REDRAW);
    expect(c.calledDraw).toBe(0);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.color("red");
    expect(c.calledDraw).toBe(1);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.color("red", NO_REDRAW);
    expect(c.calledDraw).toBe(0);

    c.reset()
    expect(c.calledDraw).toBe(0);
    p.opacity(0.5);
    expect(c.calledDraw).toBe(1);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.opacity(0.5, NO_REDRAW);
    expect(c.calledDraw).toBe(0);

    c.reset()
    expect(c.calledDraw).toBe(0);
    p.size(3);
    expect(c.calledDraw).toBe(1);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.size(3, NO_REDRAW);
    expect(c.calledDraw).toBe(0);

    c.reset()
    expect(c.calledDraw).toBe(0);
    p.width(3);
    expect(c.calledDraw).toBe(1);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.width(3, NO_REDRAW);
    expect(c.calledDraw).toBe(0);

    c.reset()
    expect(c.calledDraw).toBe(0);
    p.dashed();
    expect(c.calledDraw).toBe(1);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.dashed(NO_REDRAW);
    expect(c.calledDraw).toBe(0);

    c.reset()
    expect(c.calledDraw).toBe(0);
    p.solid();
    expect(c.calledDraw).toBe(1);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.solid(NO_REDRAW);
    expect(c.calledDraw).toBe(0);

    c.reset()
    expect(c.calledDraw).toBe(0);
    p.label("A");
    expect(c.calledDraw).toBe(1);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.label("A", NO_REDRAW);
    expect(c.calledDraw).toBe(0);

    c.reset()
    expect(c.calledDraw).toBe(0);
    p.showLabel();
    expect(c.calledDraw).toBe(1);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.showLabel(NO_REDRAW);
    expect(c.calledDraw).toBe(0);

    c.reset()
    expect(c.calledDraw).toBe(0);
    p.hideLabel();
    expect(c.calledDraw).toBe(1);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.hideLabel(NO_REDRAW);
    expect(c.calledDraw).toBe(0);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.description("description");
    expect(c.calledDraw).toBe(1);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.description("description", NO_REDRAW);
    expect(c.calledDraw).toBe(0);

    c.reset()
    expect(c.calledDraw).toBe(0);
    p.addDescription("description");
    expect(c.calledDraw).toBe(1);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.addDescription("description", NO_REDRAW);
    expect(c.calledDraw).toBe(0);

    c.reset()
    expect(c.calledDraw).toBe(0);
    p.highlightOn();
    expect(c.calledDraw).toBe(1);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.highlightOn(NO_REDRAW);
    expect(c.calledDraw).toBe(0);

    c.reset()
    expect(c.calledDraw).toBe(0);
    p.highlightOff();
    expect(c.calledDraw).toBe(1);
    
    c.reset()
    expect(c.calledDraw).toBe(0);
    p.highlightOff(NO_REDRAW);
    expect(c.calledDraw).toBe(0);
});

test('isPoint, isLine, isCircle', () => {
    const nc = new DGConst(0);
    expect(nc.isPoint()).toBeFalsy();
    expect(nc.isFreePoint()).toBeFalsy();
    expect(nc.isLine()).toBeFalsy();
    expect(nc.isCircle()).toBeFalsy();
    
    const n = new DGNum(() => 0, []);
    expect(n.isPoint()).toBeFalsy();
    expect(n.isFreePoint()).toBeFalsy();
    expect(n.isLine()).toBeFalsy();
    expect(n.isCircle()).toBeFalsy();
    
    const p = new DGPoint(100, 100);
    expect(p.isPoint()).toBeTruthy();
    expect(p.isFreePoint()).toBeTruthy();
    expect(p.isLine()).toBeFalsy();
    expect(p.isCircle()).toBeFalsy();

    p.fix();
    expect(p.isFreePoint()).toBeFalsy();

    p.unfix();
    expect(p.isFreePoint()).toBeTruthy();
    
    const rp = new DGRandomPoint();
    expect(rp.isPoint()).toBeTruthy();
    expect(rp.isFreePoint()).toBeFalsy();
    expect(rp.isLine()).toBeFalsy();
    expect(rp.isCircle()).toBeFalsy();

    rp.unfix();
    expect(rp.isFreePoint()).toBeFalsy();


    const pf = new DGPointFun(p => { const [x, y] = p.coords(); return [x+1, y+1]}, [p]);
    expect(pf.isPoint()).toBeTruthy();
    expect(pf.isFreePoint()).toBeFalsy();
    expect(pf.isLine()).toBeFalsy();
    expect(pf.isCircle()).toBeFalsy();
    
    pf.unfix();
    expect(pf.isFreePoint()).toBeFalsy();

    const p1 = new DGPoint(50, 50);
    const p2 = new DGPoint(80, 80);
    const l = new DGLine(p1, p2);
    expect(l.isPoint()).toBeFalsy();
    expect(l.isFreePoint()).toBeFalsy();
    expect(l.isLine()).toBeTruthy();
    expect(l.isCircle()).toBeFalsy();

    const s = new DGSegment(p1, p2);
    expect(l.isPoint()).toBeFalsy();
    expect(l.isFreePoint()).toBeFalsy();
    expect(l.isLine()).toBeTruthy();
    expect(l.isCircle()).toBeFalsy();

    const rpc = new DGRandomPointOnCircline(l);
    expect(rpc.isPoint()).toBeTruthy();
    expect(rpc.isFreePoint()).toBeFalsy();
    expect(rpc.isLine()).toBeFalsy();
    expect(rpc.isCircle()).toBeFalsy();

    rpc.unfix();
    expect(rpc.isFreePoint()).toBeFalsy();

    const c = new DGCircle(p1, p2);
    expect(c.isPoint()).toBeFalsy();
    expect(c.isFreePoint()).toBeFalsy();
    expect(c.isLine()).toBeFalsy();
    expect(c.isCircle()).toBeTruthy();

    const cc = c.center();
    expect(cc.isPoint()).toBeTruthy();
    expect(cc.isFreePoint()).toBeFalsy();
    expect(cc.isLine()).toBeFalsy();
    expect(cc.isCircle()).toBeFalsy();

    const q1 = new DGPoint(60, 60);
    const q2 = new DGPoint(90, 90);
    const l1 = new DGLine(q1, q2);
    const ll = new DGIntersectLL(l, l1);
    expect(ll.valid()).toBeTruthy();
    expect(ll.isPoint()).toBeTruthy();
    expect(ll.isFreePoint()).toBeFalsy();
    expect(ll.isLine()).toBeFalsy();
    expect(ll.isCircle()).toBeFalsy();

    const c1 = new DGCircle(q1, q2);
    const cci = new DGIntersectCC(c, c1);
    expect(cci.valid()).toBeTruthy();
    expect(cci.isPoint()).toBeFalsy();
    expect(cci.isFreePoint()).toBeFalsy();
    expect(cci.isLine()).toBeFalsy();
    expect(cci.isCircle()).toBeFalsy();

    const [ccA, ccB] = cci.both();
    expect(ccA.isPoint()).toBeTruthy();
    expect(ccA.isFreePoint()).toBeFalsy();
    expect(ccA.isLine()).toBeFalsy();
    expect(ccA.isCircle()).toBeFalsy();
    expect(ccB.isPoint()).toBeTruthy();
    expect(ccB.isFreePoint()).toBeFalsy();
    expect(ccB.isLine()).toBeFalsy();
    expect(ccB.isCircle()).toBeFalsy();
    ccA.unfix();
    expect(ccA.isFreePoint()).toBeFalsy();

    const lci = new DGIntersectLC(l, c);
    expect(lci.isPoint()).toBeFalsy();
    expect(lci.isFreePoint()).toBeFalsy();
    expect(lci.isLine()).toBeFalsy();
    expect(lci.isCircle()).toBeFalsy();
    const [lcA, lcB] = lci.both();
    expect(lcA.isPoint()).toBeTruthy();
    expect(lcA.isFreePoint()).toBeFalsy();
    expect(lcA.isLine()).toBeFalsy();
    expect(lcA.isCircle()).toBeFalsy();
    expect(lcB.isPoint()).toBeTruthy();
    expect(lcB.isFreePoint()).toBeFalsy();
    expect(lcB.isLine()).toBeFalsy();
    expect(lcB.isCircle()).toBeFalsy();
    lcA.unfix();
    expect(lcA.isFreePoint()).toBeFalsy();
    

    const P1 = new DGPoint(50, 50);
    const P2 = new DGPoint(-50, -50);
    const P = new DGIf((P1, P2) => true, P1, P2, [P1, P2]);
    expect(P.isPoint()).toBeTruthy();
    expect(P.isFreePoint()).toBeFalsy();
    expect(P.isLine()).toBeFalsy();
    expect(P.isCircle()).toBeFalsy();
    P.unfix();
    expect(P.isFreePoint()).toBeFalsy();

    const pc = new DGClone(p);
    expect(pc.isPoint()).toBeTruthy();
    expect(pc.isFreePoint()).toBeTruthy();
    expect(pc.isLine()).toBeFalsy();
    expect(pc.isCircle()).toBeFalsy();

    pc.fix();
    expect(pc.isFreePoint()).toBeFalsy();
    expect(p.isFreePoint()).toBeFalsy();

    const ccc = new DGClone(c);
    expect(ccc.isPoint()).toBeFalsy();
    expect(ccc.isFreePoint()).toBeFalsy();
    expect(ccc.isLine()).toBeFalsy();
    expect(ccc.isCircle()).toBeTruthy();
});

test('DGNum', () => {
    const p = new DGPoint(1, 1);
    const c = new DGNum(p => { let [x, y] = p.coords(); return x + y; }, [p]);
    expect(c.value()).toBe(2);
    expect(c.funArg()).toBe(2);
    p.moveTo(100, 150);
    expect(c.value()).toBe(250);

    const c1 = new DGNum(n => 1 / n, [c]);
    const c2 = new DGNum(n => n + 1, [c1]);
    expect(c1.value()).toBe(1/250);
    expect(c1.valid()).toBeTruthy();
    expect(c2.value()).toBe(1 + 1/250);
    expect(c2.valid()).toBeTruthy();

    p.moveTo(0, 0);
    expect(c1.valid()).toBeFalsy();
    expect(c2.valid()).toBeFalsy();

    p.moveTo(1, 2);
    expect(c1.valid()).toBeTruthy();
    expect(c1.value()).toBe(1 / 3);
    expect(c2.valid()).toBeTruthy();
    expect(c2.value()).toBe(1 + 1 / 3);

    const nc = new DGConst(0);
    expect(nc.valid()).toBeTruthy();
    expect(nc.value()).toBe(0);
    nc.setValue(1);
    expect(nc.value()).toBe(1);
});

test('DGPoint', () => {
    const p = new DGPoint(100, 120);
    expect(p.type()).toBe("point");
    expect(p.x()).toBe(100);
    expect(p.y()).toBe(120);
    expect(p.coords()).toStrictEqual([100, 120]);
    expect(p.cp1()).toStrictEqual(CP1.of_xy(100, 120));
    expect(p.isInf()).toBeFalsy();
    expect(p.toComplex()).toStrictEqual(Complex.of_xy(100, 120));
    expect(p.funArg()).toStrictEqual(CP1.of_xy(100, 120));

    const p1 = new DGPoint(100, 120);
    const p2 = new DGPoint(100, 121);
    expect(p.eq(p1)).toBeTruthy();
    expect(p.eq(p2)).toBeFalsy();
    expect(p.eq(Complex.of_xy(100, 120))).toBeTruthy();
    expect(p.eq(CP1.of_xy(100, 120))).toBeTruthy();
    expect(p.eq(Complex.of_xy(101, 120))).toBeFalsy();
    expect(p.eq(CP1.of_xy(101, 120))).toBeFalsy();

    const q1 = new DGPoint(1, 2);
    const q2 = new DGPoint(2, 3);
    expect(q1.distance(q2)).toBeCloseTo(Math.sqrt(2), 1e-15);

    expect(p1.size()).toBe(1);
    expect(p1.isNear(100, 120, (x, y) => [x, y])).toBeTruthy();
    expect(p1.isNear(101, 120, (x, y) => [x, y])).toBeTruthy();
    expect(p1.isNear(100, 121, (x, y) => [x, y])).toBeTruthy();
    expect(p1.isNear(101, 121, (x, y) => [x, y])).toBeTruthy();
    expect(p1.isNear(103, 123, (x, y) => [x, y])).toBeTruthy();
    expect(p1.isNear(105, 120, (x, y) => [x, y])).toBeTruthy();
    expect(p1.isNear(100, 125, (x, y) => [x, y])).toBeTruthy();
    expect(p1.isNear(95, 120, (x, y) => [x, y])).toBeTruthy();
    expect(p1.isNear(100, 115, (x, y) => [x, y])).toBeTruthy();
    expect(p1.isNear(104, 124, (x, y) => [x, y])).toBeFalsy();
    expect(p1.isNear(106, 120, (x, y) => [x, y])).toBeFalsy();
    expect(p1.isNear(100, 126, (x, y) => [x, y])).toBeFalsy();
    expect(p1.isNear(94, 120, (x, y) => [x, y])).toBeFalsy();
    expect(p1.isNear(100, 114, (x, y) => [x, y])).toBeFalsy();

    p1.size(2);
    expect(p1.isNear(110, 120, (x, y) => [x, y])).toBeTruthy();
    expect(p1.isNear(111, 120, (x, y) => [x, y])).toBeFalsy();

    let ret = p1.moveTo(50, 70);
    expect(ret).toBeTruthy();
    expect(p1.isInf()).toBeFalsy();
    expect(p1.x()).toBe(50);
    expect(p1.y()).toBe(70);
    expect(p1.valid()).toBeTruthy();
    
    p1.validityCheck(c => !c.is_inf() &&
                        Math.abs(c.to_complex().x() <= 100) &&
                        Math.abs(c.to_complex().y() <= 100));
    expect(p1.valid()).toBeTruthy();
    ret = p1.moveTo(80, -90);
    expect(ret).toBeTruthy();
    expect(p1.valid()).toBeTruthy();
    expect(p1.x()).toBe(80);
    expect(p1.y()).toBe(-90);

    
    ret = p1.moveTo(120, -90);
    expect(ret).toBeFalsy();
    expect(p1.valid()).toBeTruthy();
    expect(p1.x()).toBe(80);
    expect(p1.y()).toBe(-90);
});

test('DGPointFun', () => {
    const p = new DGPoint(1, 2);
    const q = new DGPointFun(p => { let [x, y] = p.coords(); return [x + 1, y + 1]; }, [p]);
    expect(q.valid()).toBeTruthy();
    expect(q.x()).toBe(2);
    expect(q.y()).toBe(3);

    p.moveTo(3, 4);
    expect(q.valid()).toBeTruthy();
    expect(q.x()).toBe(4);
    expect(q.y()).toBe(5);

    const n = new DGConst(2);
    const r = new DGPointFun((p, n) => { let [x, y] = p.coords(); return [x * n, y * n]; }, [p, n]);
    expect(r.valid()).toBeTruthy();
    expect(r.x()).toBe(6);
    expect(r.y()).toBe(8);
    n.setValue(3);
    expect(n.value()).toBe(3);
    expect(r.valid()).toBeTruthy();
    expect(r.x()).toBe(9);
    expect(r.y()).toBe(12);
});

test('DGRandomPoint', () => {
    for (let i = 1; i <= 10; i++) {
        const p = new DGRandomPoint();
        expect(p.valid()).toBeTruthy();
        expect(-1 <= p.x() && p.x() <= 1).toBeTruthy();
        expect(-1 <= p.y() && p.y() <= 1).toBeTruthy();
    }

    for (let i = 1; i <= 10; i++) {
        const p = new DGRandomPoint(p => { const [x, y] = p.coords(); return x*x + y*y <= 5; }, -5, 5, -5, 5);
        expect(p.valid()).toBeTruthy();
        expect(-5 <= p.x() && p.x() <= 5).toBeTruthy();
        expect(-5 <= p.y() && p.y() <= 5).toBeTruthy();
        expect(p.x()*p.x() + p.y()*p.y() <= 5).toBeTruthy();
    }

    const q = new DGRandomPoint(p => false);
    expect(q.valid()).toBeFalsy();
});

test('DGLine', () => {
    const p = new DGPoint(0, 0);
    const q = new DGPoint(100, 100);
    const l = new DGLine(p, q);
    expect(l.isNear(50, 50)).toBeTruthy();
    expect(l.isNear(-30, -30)).toBeTruthy();
    expect(l.isNear(150, 150)).toBeTruthy();
    expect(l.isNear(51, 50)).toBeFalsy();
});


test('DGCircle', () => {
    const p = new DGPoint(0, 0);
    const q = new DGPoint(0, 1);
    const c = new DGCircle(p, q);
    expect(c.isNear(1, 0)).toBeTruthy();
    expect(c.isNear(1, 1)).toBeFalsy();
    expect(c.isNear(Math.sqrt(2)/2, Math.sqrt(2)/2)).toBeTruthy();
    expect(c.isNear(Math.sqrt(2)/2 + 1e-2, Math.sqrt(2)/2)-1e-2).toBeTruthy();

    expect(c.inDisc(p)).toBeTruthy();
    expect(c.inDiscXY(0, 0)).toBeTruthy();
    expect(c.onCircle(q)).toBeTruthy();
    expect(c.onCircleXY(1, 0)).toBeTruthy();
    expect(c.onCircleXY(Math.sqrt(2)/2, Math.sqrt(2)/2)).toBeTruthy();
    expect(c.onCircleXY(Math.sqrt(2)/2 + 1e-2, Math.sqrt(2)/2-1e-2)).toBeFalsy();
});

test('DGRandomPointOnCircline', () => {
    const p1 = new DGPoint(0, 0);
    const p2 = new DGPoint(1, 1);
    const l = new DGLine(p1, p2);
    for (let i = 1; i <= 10; i++) {
        const p = new DGRandomPointOnCircline(l);
        expect(p.isFreePoint()).toBeFalsy();
        expect(p.x()).toBe(p.y());
        expect(p.valid()).toBeTruthy();
    }

    const uc = Circline.unit_circle();
    for (let i = 1; i <= 10; i++) {
        const p = new DGRandomPointOnCircline(l, {disc: uc});
        expect(p.valid()).toBeTruthy();
        expect(p.x()).toBe(p.y());
        expect(uc.in_disc(p)).toBeTruthy();
    }

    const vc = p => !p.is_inf() && p.to_complex().x() > 0 && p.to_complex().y() > 0;
    for (let i = 1; i <= 10; i++) {
        const p = new DGRandomPointOnCircline(l, {validity_check: vc});
        expect(p.valid()).toBeTruthy();
        expect(p.x()).toBe(p.y());
        expect(vc(p.cp1())).toBeTruthy();
    }

    
    for (let i = 1; i <= 10; i++) {
        const p = new DGRandomPointOnCircline(l, {disc: uc, validity_check: vc});
        expect(p.valid()).toBeTruthy();
        expect(p.x()).toBe(p.y());
        expect(uc.in_disc(p)).toBeTruthy();
        expect(vc(p.cp1())).toBeTruthy();
    }

    const circ = new DGCircle(p1, p2);
    for (let i = 1; i <= 10; i++) {
        const p = new DGRandomPointOnCircline(circ);
        expect(p.valid()).toBeTruthy();
        expect(circ.onCircle(p)).toBeTruthy();
    }

    const disc = Circline.mk_circle(new Complex(10, 10), 1);
    for (let i = 1; i <= 10; i++) {
        const p = new DGRandomPointOnCircline(circ, {disc: disc});
        expect(p.valid()).toBeFalsy();
    }
});

test('DGIf', () => {
    const A = new DGPoint(0, 0);
    const B = new DGPoint(1, 1);
    const c = new DGConst(3);
    const X = new DGIf(c => c.value() == 3, A, B, [c]);
    expect(X.x()).toBe(0);
    expect(X.y()).toBe(0);
    expect(X.coords()).toStrictEqual([0, 0]);
    expect(X.isInf()).toBeFalsy();
    expect(X.toComplex()).toStrictEqual(new Complex(0, 0));
    expect(X.cp1()).toStrictEqual(CP1.of_xy(0, 0));
    expect(X.eq(A)).toBeTruthy();
    expect(X.eq(B)).toBeFalsy();

    c.setValue(2);
    expect(X.x()).toBe(1);
    expect(X.y()).toBe(1);
    expect(X.eq(B)).toBeTruthy();
    expect(X.eq(A)).toBeFalsy();
    

    const C = new DGPoint(-1, 2);
    const l1 = new DGLine(A, B);
    const l2 = new DGLine(A, C);
    expect(l1.eq(l2)).toBeFalsy();
    const Y = new DGIf(c => c.value() == 2, l1, l2, [c]);
    expect(Y.circline()).toBe(l1.circline());
    expect(Y.eq(l1)).toBeTruthy();
    expect(Y.eq(l2)).toBeFalsy();

    c.setValue(3);
    expect(Y.circline()).toBe(l2.circline());
    expect(Y.eq(l2)).toBeTruthy();
    expect(Y.eq(l1)).toBeFalsy();
});

test('move validity check', () => {
    const uc = Circline.unit_circle();
    const p = new DGPoint(0, 0, p => uc.in_disc(p));
    expect(p.valid()).toBeTruthy();
    expect(p.x()).toBe(0);
    expect(p.y()).toBe(0);
    expect(p.valid()).toBeTruthy();
    expect(p.moveTo(0.5, 0.5)).toBeTruthy();
    expect(p.valid()).toBeTruthy();
    expect(p.x()).toBe(0.5);
    expect(p.y()).toBe(0.5);
    expect(p.moveTo(2, 2)).toBeFalsy();
    expect(p.valid()).toBeTruthy();
    expect(p.x()).toBe(0.5);
    expect(p.y()).toBe(0.5);
    p.validityCheck(null);
    expect(p.moveTo(2, 2)).toBeTruthy();
    expect(p.valid()).toBeTruthy();
    expect(p.x()).toBe(2);
    expect(p.y()).toBe(2);

    const q = new DGPoint(2, 2, p => uc.in_disc(p));
    expect(q.valid()).toBeFalsy();
    expect(q.moveTo(0.5, 0.5)).toBeTruthy();
    expect(q.valid()).toBeTruthy();
    expect(q.x()).toBe(0.5);
    expect(q.y()).toBe(0.5);
});

test('construction from invalid', () => {
    // invalid point
    const uc = Circline.unit_circle();
    const p1 = new DGPoint(2, 2, p => uc.in_disc(p));
    expect(p1.valid()).toBeFalsy();
    const p2 = new DGPoint(0, 0);
    expect(p2.valid()).toBeTruthy();
    
    const l = new DGLine(p1, p2);
    expect(l.valid()).toBeFalsy();

    const c = new DGCircle(p1, p2);
    expect(c.valid()).toBeFalsy();

    const p = new DGRandomPointOnCircline(l);
    expect(p.valid()).toBeFalsy();

    expect(p1.moveTo(0.5, 0.5)).toBeTruthy();
    expect(p1.valid()).toBeTruthy();

    expect(l.valid()).toBeTruthy();
    expect(c.valid()).toBeTruthy();
    expect(p.valid()).toBeTruthy();
});

test('dg if invalid condition', () => {
    // invalid point
    const uc = Circline.unit_circle();
    const p = new DGPoint(2, 2, p => uc.in_disc(p));
    expect(p.valid()).toBeFalsy();
    const q = new DGPoint(2, 2);
    expect(q.valid()).toBeTruthy();

    const a = new DGPoint(0, 0);
    const b = new DGPoint(1, 1);
    const x = new DGIf((p, q) => p.eq(q), a, b, [p, q]);

    expect(x.valid()).toBeFalsy()
    expect(x._object).toBeDefined();
    expect(x._object).not.toBeNull();

    expect(p.moveTo(0.5, 0.5)).toBeTruthy();
    expect(p.valid()).toBeTruthy();
    expect(x.valid()).toBeTruthy();
    expect(x._object).toBeDefined();
    expect(x._object).not.toBeNull();
});

test('dg if invalid condition', () => {
    // invalid point
    const uc = Circline.unit_circle();
    const p = new DGPoint(2, 2, p => uc.in_disc(p));
    expect(p.valid()).toBeFalsy();
    const q = new DGPoint(2, 2);
    expect(q.valid()).toBeTruthy();

    const a = new DGPoint(0, 0);
    const b = new DGPoint(1, 1);
    const x = new DGIf((a, b) => a.eq(b), p, q, [a, b]);
    expect(x.valid()).toBeTruthy()
    expect(x._object).toBeDefined();
    expect(x._object).not.toBeNull();
    
    const y = new DGIf((a, b) => a.eq(b), q, p, [a, b]);
    expect(y.valid()).toBeFalsy();
    expect(y._object).toBeDefined();
    expect(y._object).not.toBeNull();

    expect(p.moveTo(0.5, 0.5)).toBeTruthy();
    expect(p.valid()).toBeTruthy();
    expect(x.valid()).toBeTruthy();
    expect(x._object).toBeDefined();
    expect(x._object).not.toBeNull();
    expect(y.valid()).toBeTruthy();
    expect(y._object).toBeDefined();
    expect(y._object).not.toBeNull();
});

test('eq', () => {
    const p1 = new DGPoint(1, 1);
    const p2 = new DGPoint(2, 2);
    expect(p1.eq(p2)).toBeFalsy();
    p2.moveTo(1, 1);
    expect(p1.eq(p2)).toBeTruthy();
    p2.moveTo(2, 2);
    const l1 = new DGLine(p1, p2);
    const l2 = new DGLine(p2, p1);
    expect(l1.eq(l2)).toBeTruthy();
    const p3 = new DGPoint(-1, -1);
    const l3 = new DGLine(p1, p3);
    expect(l1.eq(l3)).toBeTruthy();

    const c1 = new DGCircle(p1, p2);
    expect(c1.eq(l1)).toBeFalsy();
    const c2 = new DGCircle(p1, p3);
    expect(c1.eq(c2)).toBeFalsy();
    p3.moveTo(2, 2);
    expect(c1.eq(c2)).toBeTruthy();
});

test('intersectLL', () => {
    const p1 = new DGPoint(0, 0);
    const p2 = new DGPoint(2, 0);
    const p3 = new DGPoint(1, 1);
    const p4 = new DGPoint(1, 2);
    const l1 = new DGLine(p1, p2);
    const l2 = new DGLine(p3, p4);
    const p = new DGIntersectLL(l1, l2);
    expect(p.valid()).toBeTruthy();
    expect(p.x()).toBe(1);
    expect(p.y()).toBe(0);

    const p5 = new DGPoint(-1, 1);
    const l3 = new DGLine(p3, p5);
    const q = new DGIntersectLL(l1, l3);
    expect(q.valid()).toBeTruthy();
    expect(q.isInf()).toBeTruthy();
});

test('intersectLC', () => {
    const p1 = new DGPoint(-3, 0);
    const p2 = new DGPoint(3, 0);
    const p3 = new DGPoint(0, 0);
    const p4 = new DGPoint(0, 2);
    const l = new DGLine(p1, p2);
    const c = new DGCircle(p3, p4);
    const ii = new DGIntersectLC(l, c);
    expect(ii.valid()).toBeTruthy();

    // both intersections
    const [A, B] = ii.both();
    expect(A.valid()).toBeTruthy();
    expect(B.valid()).toBeTruthy();
    let xx = [A.x(), B.x()];
    xx.sort();
    expect(xx[0]).toBe(-2);
    expect(xx[1]).toBe(2);
    expect(A.y()).toBe(0);
    expect(B.y()).toBe(0);

    // any intersection
    const C = ii.any();
    expect(C.valid()).toBeTruthy();
    expect(Math.abs(C.x())).toBe(2);
    expect(C.y()).toBe(0);

    // select intersection
    const D = ii.select(p => p.x() > 0);
    expect(D.valid()).toBeTruthy();
    expect(D.x()).toBe(2);
    expect(D.y()).toBe(0);

    // select non-existent
    const E = ii.select(p => p.y() < -5);
    expect(E.valid()).toBeFalsy();

    // intersectLC vs intersectCL (class name)
    const ii1 = new DGIntersectCL(l, c);
    const C1 = ii1.any();
    expect(C1.valid()).toBeTruthy();
    expect(Math.abs(C1.x())).toBe(2);
    expect(C1.y()).toBe(0);
    
    
    // non-existant intersections
    p3.moveTo(0, 5);
    expect(ii.valid()).toBeTruthy();
    expect(A.valid()).toBeFalsy();
    expect(B.valid()).toBeFalsy();

    // fictive intersections
    const jj = new DGIntersectLC(l, c, INCLUDE_FICTIVE);
    const [A1, B1] = jj.both();
    expect(jj.valid()).toBeTruthy();
    expect(A1.valid()).toBeTruthy();
    expect(B1.valid()).toBeTruthy();
    expect(A1.x()).toBeCloseTo(0);
    expect(B1.x()).toBeCloseTo(0);
    const yy = [A1.y(), B1.y()];
    yy.sort();
    expect(yy[0]).toBeCloseTo(-4);
    expect(yy[1]).toBeCloseTo(4);

});

test('circle center', () => {
    const O = new DGPoint(0, 0);
    const A = new DGPoint(1, 0);
    const c = new DGCircle(O, A);
    const cc = new DGCircleCenterPoint(c);
    expect(cc.valid()).toBeTruthy();
    expect(cc.x()).toBe(0);
    expect(cc.y()).toBe(0);

    O.moveTo(3, 4);
    expect(cc.valid()).toBeTruthy();
    expect(cc.x()).toBe(3);
    expect(cc.y()).toBe(4);
});

test('construction', () => {
    const O = new DGPoint(0, 0);
    expect(O.constructions()).toStrictEqual([]);
    const c = new Construction();
    O.addConstruction(c);
    expect(O.constructions()).toStrictEqual([c]);
    O.removeConstruction(c);
    expect(O.constructions()).toStrictEqual([]);
});

test('drawMe', () => {
    const view = new GraphicsView();
    const p = new DGPoint(3, 4);
    p.drawMe(view);
    expect(view.point).toBeCalledTimes(1);
    expect(view.point).toBeCalledWith(3, 4, {color: 'black', size: 1});
    p.color("red").size(2);
    p.drawMe(view);
    expect(view.point).toBeCalledWith(3, 4, {color: 'red', size: 2});
    
    const a = new DGPoint(2, 3);
    const b = new DGPoint(4, 5);
    const l = new DGLine(a, b);
    l.drawMe(view);
    expect(view.line).toBeCalledTimes(1);
    const x1 = view.line.mock.calls[0][0];
    const y1 = view.line.mock.calls[0][1];
    const x2 = view.line.mock.calls[0][2];
    const y2 = view.line.mock.calls[0][3];
    expect(l.onCirclineXY(x1, y1)).toBeTruthy();
    expect(l.onCirclineXY(x2, y2)).toBeTruthy();
    expect(view.line.mock.calls[0][4].color).toBe('black');
    expect(view.line.mock.calls[0][4].width).toBe(1);
    
    const c = new DGCircle(a, b);
    c.drawMe(view);
    expect(view.circle).toBeCalledTimes(1);
    expect(view.circle.mock.calls[0][0]).toBe(2);
    expect(view.circle.mock.calls[0][1]).toBe(3);
    expect(view.circle.mock.calls[0][2]).toBeCloseTo(Math.sqrt(8));
    expect(view.circle.mock.calls[0][3].color).toBe('black');
    expect(view.circle.mock.calls[0][3].width).toBe(1);

    jest.clearAllMocks();
    a.highlightOn();
    a.drawMe(view);
    expect(view.point).toBeCalledTimes(2);
});
