import {Element} from "./element";
import {partitionEquals} from "./utils";

export class Train {
    private trackPartitions = [];
    protected elementHead : Element;
    protected elementTail : Element;

    constructor (private size) {}

    putOnTrack(track, position, direction) {
        var train = this;
        var tailPosition = position - direction * this.size;
        this.elementHead = new Element();
        this.elementHead.swaped = function (elm) {
            if (this.getPosition() * this.getDirection() > elm.getPosition() * this.getDirection()) {
                if (elm.upped) {
                    elm.upped(train);
                }
            } else {
                if (elm.downed) {
                    elm.downed(train);
                }
            }
        };
        this.elementHead.upped = function () {
            console.warn('colision');
        };
        this.elementHead.addPartition = function (partition) {
            if (train.trackPartitions.length > 0 && partitionEquals(train.trackPartitions[0], partition)) {
                train.trackPartitions.splice(0, 1);
            } else {
                train.trackPartitions.splice(0, 0, partition);
            }
        };
        this.elementHead.putOnTrack(track, position, direction);

        this.elementTail = new Element();
        this.elementTail.swaped = function (elm) {
            if (this.getPosition() * this.getDirection() > elm.getPosition() * this.getDirection()) {
                if (elm.upped) {
                    elm.upped(train);
                }
            } else {
                if (elm.downed) {
                    elm.downed(train);
                }
            }
        };
        this.elementTail.upped = function () {
            console.warn('colision');
        };
        this.elementTail.addPartition = function (partition) {
            if (train.trackPartitions.length > 0 && partitionEquals(train.trackPartitions[train.trackPartitions.length - 1], partition)) {
                train.trackPartitions.splice(train.trackPartitions.length - 1, 1);
            } else {
                train.trackPartitions.splice(train.trackPartitions.length, 0, partition);
            }
        };
        this.elementTail.putOnTrack(track, tailPosition, -direction, position);
    };
    move(dist) {
        this.elementHead.move(this.elementHead.getDirection() * dist);
        this.elementTail.move(-this.elementTail.getDirection() * dist);
    };
    getTrackParts() {
        var parts = [];
        var newPart = {track: this.elementHead.getTrack(), from: this.elementHead.getPosition(), to: null};
        var i;
        for (i = 0; i < this.trackPartitions.length; i++) {
            var partition = this.trackPartitions[i];
            if (newPart.track === partition.removedTrack) {
                newPart.to = partition.removedPosition;
                parts[parts.length] = newPart;
                newPart = {track: partition.addedTrack, from: partition.addedPosition, to: null};
            } else if (newPart.track === partition.addedTrack) {
                newPart.to = partition.addedPosition;
                parts[parts.length] = newPart;
                newPart = {track: partition.removedTrack, from: partition.removedPosition, to: null};
            } else {
                console.warn('getTrackParts: no corresponding track');
            }
        }
        newPart.to = this.elementTail.getPosition();
        parts[parts.length] = newPart;
        return parts;
    };
    isOnElm(elm) {
        var trackParts = this.getTrackParts();
        var i, trackPart;
        for (i = 0; i < trackParts.length; i++) {
            trackPart = trackParts[i];
            if (trackPart.track === elm.getTrack()) {
                if (trackPart.from < elm.getPosition() && elm.getPosition() <= trackPart.to ||
                    trackPart.to < elm.getPosition() && elm.getPosition() <= trackPart.from ||
                    i !== 0 && i !== trackParts.length - 1 && (trackPart.from === elm.getPosition() || trackPart.to === elm.getPosition())
                ) {
                    return true;
                }
            }
        }
        return false;
    };
}
