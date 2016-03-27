export class Element {
    private track = undefined;
    private position = 0;
    private direction = 1;
    public label;

    putOnTrack(newTrack, newPosition, newDirection, fromPosition?) {
        if (this.track !== undefined) {
            throw "already on track";
        }
        this.position = newPosition;
        this.track = newTrack;
        this.direction = newDirection;
        if (fromPosition === undefined) {
            fromPosition = newPosition;
        }
        newTrack.addElement(this, fromPosition);
    }

    removeFromTrack() {
        if (this.track === undefined) {
            throw "not on track";
        }
        this.track.removeElement(this);
        this.track = undefined;
    };

    getTrack() {
        return this.track;
    };
    getPosition() {
        return this.position;
    };

    getDirection() {
        return this.direction;
    };

    move(distance) {
        this.position += distance;
        this.track.notifyMove();
    };

    moveToTrack(fromPosition, newTrack, newPosition, directionCoeff) {
        var oldTrack = this.track;
        var oldPosition = this.position;
        this.track.removeElement(this);
        this.position = newPosition + directionCoeff * (oldPosition - fromPosition);
        this.track = newTrack;
        this.direction *= directionCoeff;
        newTrack.addElement(this, newPosition);
        this.addPartition({
            removedTrack: oldTrack,
            removedPosition: fromPosition,
            addedTrack: newTrack,
            addedPosition: newPosition
        });
    };

    swaped(elm) {}
    upped(elm) {}
    downed(elm) {}
    addPartition(partition) {}
    signal() {}
}
