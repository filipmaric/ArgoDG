import { View } from './view';

class ListView extends View {
    constructor(element) {
        super();
        this._element = element;
    }
    
    drawObjects(objects) {
        const table = document.createElement("table");
        table.classList.add("objects");
        this._element.append(table);
        let tr = document.createElement("tr");
        table.append(tr);
        const th1 = document.createElement("th");
        th1.innerHTML = "Label";
        tr.append(th1);
        const th2 = document.createElement("th");
        th2.innerHTML = "Description";
        tr.append(th2);
        
        objects.forEach(obj => {
            tr = document.createElement("tr");
            table.append(tr);
            const td1 = document.createElement("td");
            tr.append(td1);
            td1.innerHTML = obj.label();
            const td2 = document.createElement("td");
            tr.append(td2);
            td2.innerHTML = obj.description();

            tr.addEventListener("mouseenter", () => { obj.highlightOn(); });
            tr.addEventListener("mouseleave", () => { obj.highlightOff(); });
            td1.addEventListener("click", (e) => {
                const input = document.createElement("input");
                input.type = "text";
                input.value = obj.label();
                td1.innerHTML = "";
                td1.append(input);
                input.focus();
                input.addEventListener("blur", (e) => {
                    obj.label(input.value);
                });
            });
        });
    }

    redraw() {
        this.clear();
        this._constructions.forEach(construction => {
            construction.drawView(this);
        });
    }

    clear() {
        this._element.innerHTML = "";
    }
}

export { ListView };
