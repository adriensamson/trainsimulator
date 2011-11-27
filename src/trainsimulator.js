var Utils = {
    sign: function(number) {
        if (number > 0) {
            return 1;
        } else if (number < 0) {
            return -1;
        }
        return 0;
    },
    partitionEquals: function (part1, part2) {
        return part1.removedTrack == part2.removedTrack && part1.removedPosition == part2.removedPosition && part1.addedTrack == part2.addedTrack && part1.addedPosition == part2.addedPosition
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
                    if (elm.addPartition) {
                        elm.addPartition({removedTrack: track, removedPosition: position, addedTrack: newTrack.track, addedPosition: newTrack.position});
                    }
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
                    track.removeElement(elm);
                    newTrack.track.addElement(elm, newTrack.position);
                    if (elm.addPartition) {
                        elm.addPartition({removedTrack: track, removedPosition: position, addedTrack: newTrack.track, addedPosition: newTrack.position});
                    }
                }
            }
        };
        track.addElement(element, position);
    };
}

var Train = function(size) {
    this.size = size;
    this.trackPartitions = [];
    this.putOnTrack = function(track, position, direction) {
        var train = this;
        var tailPosition = position - direction * size;
        this.elementHead = {
            x: position,
            direction: direction,
            swaped: function(elm) {},
            addPartition: function(partition) {
                if (train.trackPartitions.length > 0 && Utils.partitionEquals(train.trackPartitions[0], partition)) {
                    train.trackPartitions.splice(0, 1);
                } else {
                    train.trackPartitions.splice(0, 0, partition);
                }
            }
        };
        track.addElement(this.elementHead, position);
        this.elementTail = {
            x: tailPosition,
            direction: direction,
            swaped: function(elm) {},
            addPartition: function(partition) {
                if (train.trackPartitions.length > 0 && Utils.partitionEquals(train.trackPartitions[train.trackPartitions.length - 1], partition)) {
                    train.trackPartitions.splice(train.trackPartitions.length - 1, 1);
                } else {
                    train.trackPartitions.splice(train.trackPartitions.length, 0, partition);
                }
            }
        };
        track.addElement(this.elementTail, tailPosition);
    };
    this.move = function(dist) {
        this.elementHead.x += this.elementHead.direction * dist;
        this.elementTail.x += this.elementTail.direction * dist;
    };
    this.getTrackParts = function() {
        var parts = [];
        var newPart = {track: this.elementTail.track, from: this.elementTail.x};
        var i;
        for (i = 0; i < this.trackPartitions.length; i++) {
            var partition = this.trackPartitions[i];
            newPart.to = partition.removedPosition;
            parts[parts.length] = newPart;
            newPart = {track: partition.addedTrack, from: partition.addedPosition};
        }
        newPart.to = this.elementHead.x;
        parts[parts.length] = newPart;
        return parts;
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
