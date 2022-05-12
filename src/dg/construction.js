import { View } from './view.js';

/**
 * Construction is a list of DGObjects
 */
class Construction {
    constructor() {
        this._objects = [];
        this._views = [];
        this._animation_step = -1;
    }

    addView(view) {
        this._views.push(view);
    }

    addObject(o) {
        this._objects.push(o);
        this.draw();
    }

    draw() {
        this._views.forEach(view => {
            view.clear();
            this._objects.filter(o => !o.isPoint()).forEach(o => {o.draw(view)});
            this._objects.filter(o => o.isPoint()).forEach(o => {o.draw(view)});
        });
    }

    drawAnimationStep() {
        this._views.forEach(view => {
            view.clear();
            this._objects.slice(0, this._animation_step+1).forEach(o => o.draw(view));
            view.message(this._objects[this._animation_step].description());
        });
    }
    
    doAnimationStep(increment) {
        do {
            const n = this._objects.length;
            this._animation_step = (this._animation_step + n + increment) % n;
        } while (!this._objects[this._animation_step].visible());
        this.drawAnimationStep();
    }

    nextAnimationStep() {
        this.doAnimationStep(+1);
    }
    
    prevAnimationStep() {
        this.doAnimationStep(-1);
    }
    
    animate() {
        var self = this;
        window.setInterval(function() {
            self.nextAnimationStep();
            self.drawAnimationStep();
        }, 1000);
    }

    findFreePointAt(x, y, transform) {
        return this._objects.filter(o => o.isFreePoint() && !o.hidden()).find(p => p.isNear(x, y, transform));
    }
    
    findPointAt(x, y, transform) {
        return this._objects.filter(o => o.isPoint() && !o.hidden()).find(p => p.isNear(x, y, transform));
    }

    findLineAt(x, y, transform) {
        return this._objects.filter(o => o.isLine() && !o.hidden()).find(l => l.isNearLine(x, y, transform));
    }

    findCircleAt(x, y, transform) {
        return this._objects.filter(o => o.isCircle() && !o.hidden()).find(l => l.isNearCircle(x, y, transform));
    }

    includes(label) {
        // this can be faster if all object labels are put in a hash-set  
        return this._objects.some(o => o.label() == label);
    }
}

export { Construction };
