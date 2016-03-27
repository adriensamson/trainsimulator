export class Track {
    private elements = [];
    private sorted = true;

    addElement(elm, fromPosition) {
        this.sorted = false;
        var toPosition = elm.getPosition(),
            i = 0;
        while (i < this.elements.length &&
        (this.elements[i].insertedPosition < fromPosition ||
        this.elements[i].insertedPosition === fromPosition &&
        this.elements[i].insertedPosition === this.elements[i].element.getPosition() &&
        toPosition > fromPosition)
            ) {
            i++;
        }
        this.elements.splice(i, 0, {insertedPosition: fromPosition, element: elm});
    };
    notifyMove() {
        this.sorted = false;
    };
    removeElement(elm) {
        this.elements = this.elements.filter(function (e) {
            return e.element !== elm;
        });
    };
    sortElements() {
        if (this.sorted) {
            return true;
        }
        this.sorted = true;
        var alreadySorted = true;
        var i, first, second;
        for (i = 0; i < this.elements.length - 1; i++) {
            if (this.elements[i].element.getPosition() > this.elements[i + 1].element.getPosition()) {
                this.sorted = false;
                // swap
                first = this.elements[i];
                second = this.elements[i + 1];
                this.elements[i] = second;
                this.elements[i + 1] = first;
                // notify
                first.element.swaped(second.element);
                second.element.swaped(first.element);
            }
            this.elements[i].insertedPosition = this.elements[i].element.getPosition();
        }
        if (this.elements.length !== 0 && this.elements[i]) {
            this.elements[i].insertedPosition = this.elements[i].element.getPosition();
        }
        if (!this.sorted) {
            alreadySorted = false;
            this.sortElements();
        }
        return alreadySorted;
    };
    getMinPosition() {
        if (this.elements.length === 1) {
            return this.elements[0].element.getPosition();
        } else if (this.elements.length > 0) {
            return this.elements.reduce(function (lastValue, elm2) {
                return Math.min(lastValue, elm2.element.getPosition());
            }, Infinity);
        } else {
            return 0;
        }
    };
    getMaxPosition() {
        if (this.elements.length === 1) {
            return this.elements[0].element.getPosition();
        } else if (this.elements.length > 0) {
            return this.elements.reduce(function (lastValue, elm2) {
                return Math.max(lastValue, elm2.element.getPosition());
            }, -Infinity);
        } else {
            return 0;
        }
    };
}
