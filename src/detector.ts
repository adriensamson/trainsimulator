import {Element} from "./element";

export class Detector {
    private hoverCount = 0;
    private element : Element;

    putOnTrack(track, position, fromPosition) {
        var detector = this;
        this.element = new Element();
        this.element.upped = function (train) {
            detector.hoverCount += 1;
        };
        this.element.downed = function (train) {
            detector.hoverCount -= 1;
        };
        this.element.putOnTrack(track, position, 1, fromPosition);
    };
    isUp() {
        return this.hoverCount > 0;
    };
}
