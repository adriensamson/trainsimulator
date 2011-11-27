var Utils = {
    sign: function(number) {
        if (number > 0) {
            return 1;
        } else if (number < 0) {
            return -1;
        }
        return 0;
    }
};

var Track = function() {
    this.elements = [];
    this.addElement = function(elm, fromPosition) {
        var toPosition = elm.x;
        var i = 0;
        while (i < this.elements.length
            && this.elements[i].x < fromPosition
        ) {
            i++;
        }
        if (i < this.elements.length && this.elements[i].x === fromPosition && elm.direction > 0) {
            i++;
        }
        this.elements.splice(i, 0, elm);
        elm.track = this;
    };
    this.removeElement = function(elm) {
        this.elements.splice(this.elements.indexOf(elm), 1);
        elm.track = null;
    };
    this.sortElements = function() {
        var sorted = true;
        var i, first, second;
        for (i = 0; i < this.elements.length - 1; i++) {
            if (this.elements[i].x > this.elements[i+1].x) {
                sorted = false;
                // swap
                first = this.elements[i];
                second = this.elements[i+1]
                this.elements[i] = second;
                this.elements[i+1] = first;
                // notify
                first.swaped(second);
                second.swaped(first);
            }
        }
        if (!sorted) {
            this.sortElements();
        }
    };
}

var Joint = function() {
    this.tracks = {};
    this.connectTrack = function(num, track, position, direction) {
        this.tracks[num] = {
            track: track,
            position: position,
            direction: direction > 0 ? 1 : -1
        };
        var joint = this;
        var element = {
            x: position,
            swaped: function(elm) {
                if (direction > 0 && elm.x > this.x
                    || direction < 0 && elm.x < this.x
                ) {
                    var newTrack = joint.tracks[num == 1 ? 2 : 1];
                    elm.x = newTrack.position + newTrack.direction * (this.x - elm.x);
                    elm.direction *= -1 * joint.tracks[1].direction * joint.tracks[2].direction;
                    track.removeElement(elm);
                    newTrack.track.addElement(elm, newTrack.position);
                }
            }
        };
        track.addElement(element, position);
    };
}

var Switch = function() {
    /*
      2   3
       \ /
        y
        |
        1
    */
    this.tracks = {};
    this.switch = false;
    this.toggle = function() {
        this.switch = !this.switch;
    };
    this.nextTrack = function(num) {
        if (num != 1) {
            return 1;
        } else if (this.switch) {
            return 3;
        }
        return 2;
    };
    this.connectTrack = function(num, track, position, direction) {
        this.tracks[num] = {
            track: track,
            position: position,
            direction: direction > 0 ? 1 : -1
        };
        var joint = this;
        var element = {
            x: position,
            swaped: function(elm) {
                if (direction > 0 && elm.x > this.x
                    || direction < 0 && elm.x < this.x
                ) {
                    var newTrackNum = joint.nextTrack(num);
                    var newTrack = joint.tracks[newTrackNum];
                    var coeff = -1 * joint.tracks[num].direction * joint.tracks[newTrackNum].direction;
                    elm.x = newTrack.position + coeff * (elm.x - this.x);
                    elm.direction *= coeff;
                    console.log(elm);
                    track.removeElement(elm);
                    newTrack.track.addElement(elm, newTrack.position);
                }
            }
        };
        track.addElement(element, position);
    };
}

var Train = function(size) {
    this.size = size;
    this.putOnTrack = function(track, position, direction) {
        var tailPosition = position - direction * size;
        this.elementHead = {
            x: position,
            direction: direction,
            swaped: function(elm) {}
        };
        track.addElement(this.elementHead, position);
        this.elementTail = {
            x: tailPosition,
            direction: direction,
            swaped: function(elm) {}
        };
        track.addElement(this.elementTail, tailPosition);
    };
    this.move = function(dist) {
        this.elementHead.x += this.elementHead.direction * dist;
        this.elementTail.x += this.elementTail.direction * dist;
    };
}

var TrainSimulator = function() {
    this.tracks = [];
    this.newTrack = function() {
        var track = new Track();
        this.tracks.push(track);
        return track;
    };
    this.sortElements = function() {
        for (var i = 0; i < this.tracks.length; i++) {
            this.tracks[i].sortElements();
        }
    };
}
