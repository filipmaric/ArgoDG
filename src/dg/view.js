// -----------------------------------------------------------------------------
//  view enables displaying objects
// -----------------------------------------------------------------------------
class View {
    constructor() {
        // constructions that are shown by this view
        this._constructions = [];
    }

    setConstruction(construction) {
        this._constructions = [construction];
        construction.drawView(this);
    }

    addConstruction(construction) {
        this._constructions.push(construction);
        construction.drawView(this);
    }

    drawObject(obj) {
        obj.draw(this);
    }

    drawObjects(objects) {
        objects.forEach(obj => {
            this.drawObject(obj);
        });
    }

    redraw() {
        this.clear();
        this._constructions.forEach(construction => {
            construction.drawView(this);
        });
    }

    // this should be overriden
    clear() {
    }
}

export { View };
