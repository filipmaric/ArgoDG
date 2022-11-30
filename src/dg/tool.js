import { View } from './view.js';

// -----------------------------------------------------------------------------
// highlighting specific objects as the mouse moves over them
// -----------------------------------------------------------------------------
class Highlighter {
    // this should be overridden
    shouldHighlight(obj) {
        return false;
    }
}

// -----------------------------------------------------------------------------
// handling of mouse and keyboard events on a view
// -----------------------------------------------------------------------------
class Tool {
    constructor(view) {
        this._view = view;
    }

    mousemove(x, y, worldToScreen, screenToWorld) {
    }

    mousedown(x, y, worldToScreen, screenToWorld) {
    }

    mouseup(x, y, worldToScreen, screenToWorld) {
    }
    
    keydown(e, worldToScreen, screenToWorld) {
    }


    highlightAt(x, y, worldToScreen) {
        if (!this._highlighter)
            return;
        this._construction.highlightAt(x, y, worldToScreen, this._highlighter);
    }

    getObject() {
        return undefined;
    }
}
