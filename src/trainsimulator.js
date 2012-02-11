var TrainSimulator = {};

(function (ts) {
    'use strict';

    ts.Utils = {
        sign: function (number) {
            if (number > 0) {
                return 1;
            } else if (number < 0) {
                return -1;
            }
            return 0;
        },
        partitionEquals: function (part1, part2) {
            return (part1.removedTrack === part2.removedTrack && part1.removedPosition === part2.removedPosition &&
                    part1.addedTrack === part2.addedTrack && part1.addedPosition === part2.addedPosition) ||
                (part1.removedTrack === part2.addedTrack && part1.removedPosition === part2.addedPosition &&
                    part1.addedTrack === part2.removedTrack && part1.addedPosition === part2.removedPosition);
        },
        clone: function (object) {
            var newObject = {}, prop;
            for (prop in object) {
                if (object.hasOwnProperty(prop)) {
                    newObject[prop] = object[prop];
                }
            }
            return newObject;
        }
    };

    ts.Track = function () {
        this.elements = [];
        this.addElement = function (elm, fromPosition) {
            var toPosition = elm.x,
                i = 0;
            while (i < this.elements.length &&
                    this.elements[i].x < fromPosition) {
                i++;
            }
            if (i < this.elements.length && this.elements[i].x === fromPosition && toPosition > fromPosition) {
                i++;
            }
            this.elements.splice(i, 0, elm);
            elm.track = this;
        };
        this.removeElement = function (elm) {
            this.elements.splice(this.elements.indexOf(elm), 1);
            elm.track = null;
        };
        this.sortElements = function () {
            var sorted = true, alreadySorted = true;
            var i, first, second;
            for (i = 0; i < this.elements.length - 1; i++) {
                if (this.elements[i].x > this.elements[i+1].x) {
                    sorted = false;
                    // swap
                    first = this.elements[i];
                    second = this.elements[i+1];
                    this.elements[i] = second;
                    this.elements[i+1] = first;
                    // notify
                    first.swaped(second);
                    second.swaped(first);
                }
            }
            if (!sorted) {
                alreadySorted = false;
                this.sortElements();
            }
            return alreadySorted;
        };
    };

    ts.Joint = function () {
        this.tracks = {};
        this.connectTrack = function (num, track, position, direction) {
            this.tracks[num] = {
                track: track,
                position: position,
                direction: direction > 0 ? 1 : -1
            };
            var joint = this;
            var element = {
                x: position,
                swaped: function(elm) {
                    if (direction > 0 && elm.x > this.x ||
                        direction < 0 && elm.x < this.x
                    ) {
                        var newTrackNum = num === 1 ? 0 : 1;
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
    };

    ts.Switch = function () {
        /*
            1 2
            |/
            +
            |
            0
        */
        this.tracks = {};
        this.sw = false;
        this.toggle = function () {
            this.sw = !this.sw;
        };
        this.nextTrack = function (num) {
            if (num !== 0) {
                return 0;
            } else if (this.sw) {
                return 2;
            }
            return 1;
        };
        this.connectTrack = function (num, track, position, direction) {
            this.tracks[num] = {
                track: track,
                position: position,
                direction: direction > 0 ? 1 : -1
            };
            var joint = this;
            var element = {
                x: position,
                swaped: function(elm) {
                    if (direction > 0 && elm.x > this.x ||
                        direction < 0 && elm.x < this.x
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
        this.addBlock = function (innerDist, outerDist) {
            this.block = new ts.Block();
            this.block.addEntry(this.tracks[0].track, this.tracks[0].position - this.tracks[0].direction * outerDist, this.tracks[0].position - this.tracks[0].direction * innerDist);
            this.block.addSignal(this.tracks[0].track, this.tracks[0].position - this.tracks[0].direction * outerDist, this.tracks[0].direction);
            this.block.addEntry(this.tracks[1].track, this.tracks[1].position - this.tracks[1].direction * outerDist, this.tracks[1].position - this.tracks[1].direction * innerDist);
            this.block.addSignal(this.tracks[1].track, this.tracks[1].position - this.tracks[1].direction * outerDist, this.tracks[1].direction);
            this.block.addEntry(this.tracks[2].track, this.tracks[2].position - this.tracks[2].direction * outerDist, this.tracks[2].position - this.tracks[2].direction * innerDist);
            this.block.addSignal(this.tracks[2].track, this.tracks[2].position - this.tracks[2].direction * outerDist, this.tracks[2].direction);
        };
    };

    ts.Train = function (size) {
        this.size = size;
        this.trackPartitions = [];
        this.putOnTrack = function (track, position, direction) {
            var train = this;
            var tailPosition = position - direction * size;
            this.elementHead = {
                x: position,
                direction: direction,
                swaped: function (elm) {
                    if (train.isOnElm(elm)) {
                        if (elm.upped) {
                            elm.upped(train);
                        }
                    } else {
                        if (elm.downed) {
                            elm.downed(train);
                        }
                    }
                },
                addPartition: function (partition) {
                    if (train.trackPartitions.length > 0 && ts.Utils.partitionEquals(train.trackPartitions[0], partition)) {
                        train.trackPartitions.splice(0, 1);
                    } else {
                        train.trackPartitions.splice(0, 0, partition);
                    }
                }
            };
            track.addElement(this.elementHead, position);
            this.elementTail = {
                x: tailPosition,
                direction: -direction,
                swaped: function (elm) {
                   if (train.isOnElm(elm)) {
                        if (elm.upped) {
                            elm.upped(train);
                        }
                    } else {
                        if (elm.downed) {
                            elm.downed(train);
                        }
                    }
                },
                addPartition: function (partition) {
                    if (train.trackPartitions.length > 0 && ts.Utils.partitionEquals(train.trackPartitions[train.trackPartitions.length - 1], partition)) {
                        train.trackPartitions.splice(train.trackPartitions.length - 1, 1);
                    } else {
                        train.trackPartitions.splice(train.trackPartitions.length, 0, partition);
                    }
                }
            };
            track.addElement(this.elementTail, position);
            track.sortElements();
        };
        this.move = function (dist) {
            this.elementHead.x += this.elementHead.direction * dist;
            this.elementTail.x -= this.elementTail.direction * dist;
        };
        this.getTrackParts = function() {
            var parts = [];
            var newPart = {track: this.elementHead.track, from: this.elementHead.x};
            var i;
            for (i = 0; i < this.trackPartitions.length; i++) {
                var partition = this.trackPartitions[i];
                if (newPart.track === partition.removedTrack) {
                    newPart.to = partition.removedPosition;
                    parts[parts.length] = newPart;
                    newPart = {track: partition.addedTrack, from: partition.addedPosition};
                } else if (newPart.track === partition.addedTrack) {
                    newPart.to = partition.addedPosition;
                    parts[parts.length] = newPart;
                    newPart = {track: partition.removedTrack, from: partition.removedPosition};
                } else {
                    console.warn('getTrackParts: no corresponding track');
                }
            }
            newPart.to = this.elementTail.x;
            parts[parts.length] = newPart;
            return parts;
        };
        this.isOnElm = function (elm) {
            var trackParts = this.getTrackParts();
            var i, trackPart;
            for (i = 0; i < trackParts.length; i++) {
                trackPart = trackParts[i];
                if (trackPart.track === elm.track) {
                    if (trackPart.from < elm.x && elm.x <= trackPart.to ||
                        trackPart.to < elm.x && elm.x <= trackPart.from ||
                        i !== 0 && i !== trackParts.length - 1 && (trackPart.from === elm.x && trackPart.to === elm.x)
                    ) {
                        return true;
                    }
                }
            }
            return false;
        };
    };

    ts.Detector = function () {
        this.hoverCount = 0;
        this.putOnTrack = function (track, position) {
            var detector = this;
            this.element = {
                x: position,
                direction: 1,
                upped: function (train) {
                    detector.hoverCount += 1;
                },
                downed: function (train) {
                    detector.hoverCount -= 1;
                },
                swaped: function (){}
            };
            track.addElement(this.element, position);
        };
        this.isUp = function () {
            return this.hoverCount > 0;
        };
    };

    ts.Block = function () {
        this.entries = [];
        this.signals = [];
        this.inCount = 0;
        var block = this;
        this.addEntry = function (track, outerPosition, innerPosition) {
            var innerDetector = new ts.Detector();
            innerDetector.putOnTrack(track, innerPosition);
            var outerElement = {
                x: outerPosition,
                direction: 1,
                upped: function (train) {
                    if (!innerDetector.isUp()) {
                        block.inCount++;
                    }
                },
                downed: function (train) {
                    if (!innerDetector.isUp()) {
                        block.inCount--;
                    }
                },
                swaped: function(){}
            };
            track.addElement(outerElement, outerPosition);
            this.entries[this.entries.length] = {innerDetector: innerDetector, outer: outerElement};
        };
        this.addSignal = function (track, position, direction) {
            var signalElement = {
                x: position,
                direction: direction,
                signal: function() {
                    if (block.isBusy()) {
                        return 'stop';
                    } else {
                        return 'go';
                    }
                },
                swaped: function (){}
            };
            track.addElement(signalElement, position);
            this.signals.push(signalElement);
        };
        this.isBusy = function () {
            return this.inCount > 0;
        };
    };

    ts.TrainSimulator = function () {
        this.tracks = [];
        this.newTrack = function () {
            var track = new ts.Track();
            this.tracks.push(track);
            return track;
        };
        this.sortElements = function () {
            var sorted = true;
            for (var i = 0; i < this.tracks.length; i++) {
                sorted = this.tracks[i].sortElements() && sorted;
            }
            if (!sorted) {
                this.sortElements();
            }
        };
        this.tick = this.sortElements;
    };
})(TrainSimulator);
