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

    setView(view) {
        this._views = [view];
        view.addConstruction(this);
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

    visibleObjects() {
        let objects = this.animationInProgress() ?
                      this._objects.slice(0, this._animation_step+1) :
                      this._objects;
        return objects.filter(obj => obj.visible());
    }

    drawView(view) {
        view.clear();
        view.drawObjects(this.visibleObjects());
        if (this.animationInProgress()) {
            const currentAnimationObject = this._objects[this._animation_step];
            view.message(currentAnimationObject.describe());
        }
    }

    draw() {
        this._views.forEach(view => {
            this.drawView(view);
        });            
    }

    animationInProgress() {
        return this._animation_step != -1;
    }

    doAnimationStep(increment) {
        do {
            const n = this._objects.length;
            this._animation_step = (this._animation_step + n + increment) % n;
        } while (!this._objects[this._animation_step].visible());
        this.draw();
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


    highlightAt(x, y, worldToScreen, highlighter) {
        this._objects.forEach(obj => {
            obj.highlight(obj.isNear(x, y, worldToScreen) && highlighter.shouldHighlight(obj));
        });
    }

    findObjectsAt(x, y, worldToScreen) {
        return this.visibleObjects().filter(p => p.isNear(x, y, worldToScreen));
    }

    findFreePointAt(x, y, worldToScreen) {
        return this.findObjectsAt(x, y, worldToScreen).find(o => o.isFreePoint());
    }
    
    findPointAt(x, y, worldToScreen) {
        return this.findObjectsAt(x, y, worldToScreen).find(o => o.isPoint());
    }

    findLineAt(x, y, worldToScreen) {
        return this.findObjectsAt(x, y, worldToScreen).find(o => o.isLine());
    }

    findCircleAt(x, y, worldToScreen) {
        return this.findObjectsAt(x, y, worldToScreen).find(o => o.isCircle());
    }

    includes(label) {
        // this can be faster if all object labels are put in a hash-set  
        return this._objects.some(o => o.label() == label);
    }
}

export { Construction };
