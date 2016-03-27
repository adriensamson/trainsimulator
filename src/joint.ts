import {Element} from "./element";

export class Joint {
    private tracks = {};
    connectTrack(num, track, position, direction) {
        this.tracks[num] = {
            track: track,
            position: position,
            direction: direction > 0 ? 1 : -1
        };
        var joint = this;
        var element = new Element();
        element.swaped = function (elm) {
            if (direction > 0 && elm.getPosition() > this.getPosition() ||
                direction < 0 && elm.getPosition() < this.getPosition()
            ) {
                var newTrackNum = num === 1 ? 0 : 1;
                var newTrack = joint.tracks[newTrackNum];
                var coeff = -1 * joint.tracks[num].direction * joint.tracks[newTrackNum].direction;
                elm.moveToTrack(this.getPosition(), newTrack.track, newTrack.position, coeff);
            }
        };
        element.putOnTrack(track, position, direction);
    };
}
