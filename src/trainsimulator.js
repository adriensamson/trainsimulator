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
    
    ts.Element = function () {
    	var track = undefined;
    	var position = 0;
    	var direction = 1;
    	
    	this.putOnTrack = function (newTrack, newPosition, newDirection, fromPosition) {
    	    if (track !== undefined) {
    	        throw "already on track";
    	    }
    	    position = newPosition;
    	    track = newTrack;
    	    direction = newDirection;
    	    if (fromPosition === undefined) {
    	        fromPosition = newPosition;
    	    }
    	    newTrack.addElement(this, fromPosition);
    	};
    	this.removeFromTrack = function () {
    	    if (track === undefined) {
                throw "not on track";
            }
    	    track.removeElement(this);
    	    track = undefined;
    	};
    	
    	this.getTrack = function () {
    	    return track;
    	};
    	this.getPosition = function () {
    	    return position;
    	};
    	
    	this.getDirection = function () {
    	    return direction;
    	};
    	
    	this.move = function (distance) {
    	    position += distance;
    	    track.notifyMove();
    	};
    	
    	this.moveToTrack = function (fromPosition, newTrack, newPosition, directionCoeff) {
    	    var oldTrack = track;
    	    var oldPosition = position;
    	    track.removeElement(this);
            position = newPosition + directionCoeff * (oldPosition - fromPosition);
            track = newTrack;
            direction *= directionCoeff;
            newTrack.addElement(this, newPosition);
            this.addPartition({removedTrack: oldTrack, removedPosition: fromPosition, addedTrack: newTrack, addedPosition: newPosition});
    	};
    };
    ts.Element.prototype.swaped = function () {};
    ts.Element.prototype.addPartition = function () {};
    

    ts.Track = function () {
        var elements = [];
        var sorted = true;
        
        this.addElement = function (elm, fromPosition) {
            var toPosition = elm.getPosition(),
                i = 0;
            while (i < elements.length &&
                    elements[i].getPosition() < fromPosition) {
                i++;
            }
            if (i < elements.length && elements[i].getPosition() === fromPosition && toPosition > fromPosition) {
                i++;
            }
            elements.splice(i, 0, elm);
        };
        this.notifyMove = function () {
            sorted = false;
        };
        this.removeElement = function (elm) {
            elements.splice(elements.indexOf(elm), 1);
        };
        this.sortElements = function () {
            if (sorted) {
                return true;
            }
            sorted = true;
            var alreadySorted = true;
            var i, first, second;
            for (i = 0; i < elements.length - 1; i++) {
                if (elements[i].getPosition() > elements[i+1].getPosition()) {
                    sorted = false;
                    // swap
                    first = elements[i];
                    second = elements[i+1];
                    elements[i] = second;
                    elements[i+1] = first;
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
        this.getMinPosition = function () {
            if (elements.length > 0) {
                return elements[0].getPosition();
            } else {
                return 0;
            }
        };
        this.getMaxPosition = function () {
            if (elements.length > 0) {
                return elements[elements.length - 1].getPosition();
            } else {
                return 0;
            }
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
            var element = new ts.Element();
            element.swaped = function(elm) {
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
            var element = new ts.Element();
            element.swaped = function(elm) {
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
            this.elementHead = new ts.Element();
            this.elementHead.swaped = function (elm) {
                if (train.isOnElm(elm)) {
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
                if (train.trackPartitions.length > 0 && ts.Utils.partitionEquals(train.trackPartitions[0], partition)) {
                    train.trackPartitions.splice(0, 1);
                } else {
                    train.trackPartitions.splice(0, 0, partition);
                }
            };
            this.elementHead.putOnTrack(track, position, direction);

            this.elementTail = new ts.Element();
            this.elementTail.swaped = function (elm) {
               if (train.isOnElm(elm)) {
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
                if (train.trackPartitions.length > 0 && ts.Utils.partitionEquals(train.trackPartitions[train.trackPartitions.length - 1], partition)) {
                    train.trackPartitions.splice(train.trackPartitions.length - 1, 1);
                } else {
                    train.trackPartitions.splice(train.trackPartitions.length, 0, partition);
                }
            };
            this.elementTail.putOnTrack(track, tailPosition, -direction, position);
        };
        this.move = function (dist) {
            this.elementHead.move(this.elementHead.getDirection() * dist);
            this.elementTail.move(-this.elementTail.getDirection() * dist);
        };
        this.getTrackParts = function() {
            var parts = [];
            var newPart = {track: this.elementHead.getTrack(), from: this.elementHead.getPosition()};
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
            newPart.to = this.elementTail.getPosition();
            parts[parts.length] = newPart;
            return parts;
        };
        this.isOnElm = function (elm) {
            var trackParts = this.getTrackParts();
            var i, trackPart;
            for (i = 0; i < trackParts.length; i++) {
                trackPart = trackParts[i];
                if (trackPart.track === elm.getTrack()) {
                    if (trackPart.from < elm.getPosition() && elm.getPosition() <= trackPart.to ||
                        trackPart.to < elm.getPosition() && elm.getPosition() <= trackPart.from ||
                        i !== 0 && i !== trackParts.length - 1 && (trackPart.from === elm.getPosition() && trackPart.to === elm.getPosition())
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
        this.putOnTrack = function (track, position, fromPosition) {
            var detector = this;
            this.element = new ts.Element();
            this.element.upped = function (train) {
                detector.hoverCount += 1;
            };
            this.element.downed = function (train) {
                detector.hoverCount -= 1;
            };
            this.element.putOnTrack(track, position, 1, fromPosition);
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
        this.addEntry = function (track, outerPosition, innerPosition, fromPosition) {
            var innerDetector = new ts.Detector();
            innerDetector.putOnTrack(track, innerPosition, 1, fromPosition);
            var outerElement = new ts.Element();
            outerElement.upped = function (train) {
                if (!innerDetector.isUp()) {
                    block.inCount++;
                }
            };
            outerElement.downed = function (train) {
                if (!innerDetector.isUp()) {
                    block.inCount--;
                }
            };
            outerElement.putOnTrack(track, outerPosition, 1, fromPosition);
            this.entries[this.entries.length] = {innerDetector: innerDetector, outer: outerElement};
        };
        this.addSignal = function (track, position, direction) {
            var signalElement = new ts.Element();
            signalElement.signal = function() {
                if (block.isBusy()) {
                    return 'stop';
                } else {
                    return 'go';
                }
            };
            signalElement.putOnTrack(track, position, direction);
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
