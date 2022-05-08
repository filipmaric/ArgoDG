class AnimationButtons {
    constructor(construction, element) {
        const divBtns = document.createElement("div");
        element.appendChild(divBtns);
        
        const btnPrev = document.createElement("button");
        btnPrev.innerHTML = "<<";
        btnPrev.addEventListener("click", construction.prevAnimationStep.bind(construction));
        divBtns.appendChild(btnPrev);
        
        const btnNext = document.createElement("button");
        btnNext.innerHTML = ">>";
        btnNext.addEventListener("click", construction.nextAnimationStep.bind(construction));
        divBtns.append(btnNext);
    }
}

export { AnimationButtons };
