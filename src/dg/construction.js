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
        view.addConstruction(this);
    }

    addObject(o, redraw) {
        this._objects.push(o);
        if (redraw === undefined || redraw)
            this.draw();
    }

    drawObjects(objects) {
        this._views.forEach(view => {
            view.clear();
            // draw points at the top
            objects.filter(o => !o.isPoint()).forEach(o => {o.draw(view)});
            objects.filter(o => o.isPoint()).forEach(o => {o.draw(view)});
        });
    }

    highlight(x, y, transform, highlighter) {
        this._objects.forEach(obj => {
            obj.highlight(obj.isNear(x, y, transform) && highlighter.shouldHighlight(obj));
        });
    }

    draw() {
        if (this.animationInProgress())
            this.drawAnimationStep();
        else
            this.drawObjects(this._objects);
    }

    animationInProgress() {
        return this._animation_step != -1;
    }

    drawAnimationStep() {
        const objects = this._objects.slice(0, this._animation_step+1);
        this.drawObjects(objects);
        const obj = this._objects[this._animation_step];
        this._views.forEach(view => {
            view.message(obj.describe());
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

    findObjectsAt(x, y, transform) {
        return this._objects.filter(o => !o.hidden()).filter(p => p.isNear(x, y, transform));
    }

    findFreePointAt(x, y, transform) {
        return this._objects.filter(o => o.isFreePoint() && !o.hidden()).find(p => p.isNear(x, y, transform));
    }
    
    findPointAt(x, y, transform) {
        return this._objects.filter(o => o.isPoint() && !o.hidden()).find(p => p.isNear(x, y, transform));
    }

    findLineAt(x, y, transform) {
        return this._objects.filter(o => o.isLine() && !o.hidden()).find(l => l.isNear(x, y, transform));
    }

    findCircleAt(x, y, transform) {
        return this._objects.filter(o => o.isCircle() && !o.hidden()).find(l => l.isNear(x, y, transform));
    }

    includes(label) {
        // this can be faster if all object labels are put in a hash-set  
        return this._objects.some(o => o.label() == label);
    }
}

export { Construction };
