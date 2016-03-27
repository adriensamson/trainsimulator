import {Element} from "./element";
import {Block} from "./block";

export class Switch {
    /*
     1 2
     |/
     +
     |
     0
     */
    private tracks = {};
    private sw = false;
    private block : Block;
    
    toggle() {
        this.sw = !this.sw;
    };
    nextTrack(num) {
        if (num !== 0) {
            return 0;
        } else if (this.sw) {
            return 2;
        }
        return 1;
    };
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
                var newTrackNum = joint.nextTrack(num);
                var newTrack = joint.tracks[newTrackNum];
                var coeff = -1 * joint.tracks[num].direction * joint.tracks[newTrackNum].direction;
                elm.moveToTrack(this.getPosition(), newTrack.track, newTrack.position, coeff);
            }
        };
        element.putOnTrack(track, position, direction);
    };
    addBlock(innerDist, outerDist) {
        this.block = new Block();
        this.block.addEntry(this.tracks[0].track, this.tracks[0].position - this.tracks[0].direction * outerDist, this.tracks[0].position - this.tracks[0].direction * innerDist);
        this.block.addSignal(this.tracks[0].track, this.tracks[0].position - this.tracks[0].direction * outerDist, this.tracks[0].direction);
        this.block.addEntry(this.tracks[1].track, this.tracks[1].position - this.tracks[1].direction * outerDist, this.tracks[1].position - this.tracks[1].direction * innerDist);
        this.block.addSignal(this.tracks[1].track, this.tracks[1].position - this.tracks[1].direction * outerDist, this.tracks[1].direction);
        this.block.addEntry(this.tracks[2].track, this.tracks[2].position - this.tracks[2].direction * outerDist, this.tracks[2].position - this.tracks[2].direction * innerDist);
        this.block.addSignal(this.tracks[2].track, this.tracks[2].position - this.tracks[2].direction * outerDist, this.tracks[2].direction);
    };
}
