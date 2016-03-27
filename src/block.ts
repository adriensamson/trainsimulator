import {Detector} from "./detector";
import {Element} from "./element";

export class Block {
    private entries = [];
    private signals = [];
    private inCount = 0;

    addEntry(track, outerPosition, innerPosition, fromPosition?) {
        var innerDetector = new Detector();
        innerDetector.putOnTrack(track, innerPosition, 1);
        var outerElement = new Element();
        outerElement.upped = (train) => {
            if (!innerDetector.isUp()) {
                this.inCount++;
            }
        };
        outerElement.downed = (train) => {
            if (!innerDetector.isUp()) {
                this.inCount--;
            }
        };
        outerElement.putOnTrack(track, outerPosition, 1, fromPosition);
        this.entries[this.entries.length] = {innerDetector: innerDetector, outer: outerElement};
    };
    addSignal(track, position, direction) {
        var signalElement = new Element();
        signalElement.signal = () => {
            if (this.isBusy()) {
                return 'stop';
            } else {
                return 'go';
            }
        };
        signalElement.putOnTrack(track, position, direction);
        this.signals.push(signalElement);
    };
    isBusy() {
        return this.inCount > 0;
    };
}
