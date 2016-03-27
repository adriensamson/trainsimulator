import {Track} from "./track";

export class TrainSimulator {
    private tracks = [];
    newTrack() {
        var track = new Track();
        this.tracks.push(track);
        return track;
    };
    sortElements() {
        var sorted = true;
        for (var i = 0; i < this.tracks.length; i++) {
            sorted = this.tracks[i].sortElements() && sorted;
        }
        if (!sorted) {
            this.sortElements();
        }
    }
    tick() {
        this.sortElements();
    }
}
