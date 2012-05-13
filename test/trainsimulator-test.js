test.addTests('TrainSimulator.Utils', {
    signPositiveNumber: function() {
        test.assertEquals(TrainSimulator.Utils.sign(2), 1);
    },
    signNegativeNumber: function() {
        test.assertEquals(TrainSimulator.Utils.sign(-2), -1);
    },
    signZero: function() {
        test.assertEquals(TrainSimulator.Utils.sign(0), 0);
    },
    partitionEquals: function() {
        var track1 = {}, track2 = {};
        var part1 = {removedTrack: track1, removedPosition: 10, addedTrack: track2, addedPosition: 20};
        var part2 = {removedTrack: track2, removedPosition: 20, addedTrack: track1, addedPosition: 10};
        var part3 = {removedTrack: track1, removedPosition: 20, addedTrack: track1, addedPosition: 10};
        test.assertTrue(TrainSimulator.Utils.partitionEquals(part1, part1));
        test.assertTrue(TrainSimulator.Utils.partitionEquals(part1, part2));
        test.assertTrue(TrainSimulator.Utils.partitionEquals(part2, part1));
        test.assertFalse(TrainSimulator.Utils.partitionEquals(part1, part3));
    },
    clone: function() {
        var obj1 = {prop: 'test', objProp: {}};
        var obj2 = TrainSimulator.Utils.clone(obj1);
        test.assertTrue(obj1 !== obj2);
        test.assertEquals(obj1.prop, obj2.prop);
        test.assertEquals(obj1.objProp, obj2.objProp);
    }
});
test.addTests('TrainSimulator.Element', {
    putOnTrack: function() {
        var fakeTrack = {
            addElement: function (elm, pos) {this.elm = elm; this.pos = pos;}
        };
        var elm = new TrainSimulator.Element();
        var newPos = 134, newDir = -1, fromPos = 100;
        elm.putOnTrack(fakeTrack, newPos, newDir, fromPos);
        
        test.assertEquals(fakeTrack, elm.getTrack());
        test.assertEquals(newPos, elm.getPosition());
        test.assertEquals(newDir, elm.getDirection());
        test.assertEquals(fakeTrack.elm, elm);
        test.assertEquals(fakeTrack.pos, fromPos);
        
        try {
            elm.putOnTrack(fakeTrack, newPos, newDir, fromPos);
            test.assertTrue(false);
        } catch (e) {
            test.assertEquals('already on track', e);
        }
    },
    removeFromTrack: function () {
        var fakeTrack = {
            addElement: function (elm, pos) {this.elm = elm; this.pos = pos;},
            removeElement: function(elm) {this.remElm = elm;}
        };
        var elm = new TrainSimulator.Element();
        try {
            elm.removeFromTrack();
            test.assertTrue(false);
        } catch (e) {
            test.assertEquals('not on track', e);
        }
        var newPos = 134, newDir = -1, fromPos = 100;
        elm.putOnTrack(fakeTrack, newPos, newDir, fromPos);
        
        elm.removeFromTrack();
        test.assertEquals(fakeTrack.remElm, elm);
        test.assertEquals(elm.getTrack(), undefined);
    },
    move: function () {
        var fakeTrack = {
            addElement: function (elm, pos) {this.elm = elm; this.pos = pos;},
            notifyMove: function () {this.notified = true;}
        };
        var elm = new TrainSimulator.Element();
        var newPos = 134, newDir = -1, fromPos = 100, dist = 80;
        elm.putOnTrack(fakeTrack, newPos, newDir, fromPos);
        
        elm.move(dist);
        test.assertEquals(newPos + dist, elm.getPosition());
        test.assertTrue(fakeTrack.notified);
    },
    moveToTrack: function() {
        var fakeTrack1 = {
            addElement: function (elm, pos) {this.elm = elm; this.pos = pos;},
            removeElement: function(elm) {this.remElm = elm;}
        };
        var fakeTrack2 = {
            addElement: function (elm, pos) {this.elm = elm; this.pos = pos;},
            removeElement: function(elm) {this.remElm = elm;}
        };
        var elm = new TrainSimulator.Element();
        elm.addPartition = function(partition) {this.partition = partition;};
        var newPos = 134, newDir = -1, fromPos = 100, toPos = 200, coeff = -1;
        elm.putOnTrack(fakeTrack1, newPos, newDir, fromPos);
        
        elm.moveToTrack(fromPos, fakeTrack2, toPos, coeff);
        
        // test position
        test.assertEquals(fakeTrack2, elm.getTrack());
        test.assertEquals(toPos + coeff * (newPos - fromPos), elm.getPosition());
        test.assertEquals(newDir * coeff , elm.getDirection());
        // test removal from fakeTrack1
        test.assertEquals(fakeTrack1.remElm, elm);
        // test add to fakeTrack2
        test.assertEquals(fakeTrack2.elm, elm);
        test.assertEquals(fakeTrack2.pos, toPos);
        // test partition
        test.assertTrue(TrainSimulator.Utils.partitionEquals(elm.partition, {removedTrack: fakeTrack1, removedPosition: fromPos, addedTrack: fakeTrack2, addedPosition: toPos}));
    }
});

test.addTests('TrainSimulator.Track', {
    minMaxPosition: function () {
        var track = new TrainSimulator.Track();
        test.assertEquals(0, track.getMinPosition());
        test.assertEquals(0, track.getMaxPosition());
        
        var elm1 = new TrainSimulator.Element();
        var newPos1 = 134, newDir1 = -1, fromPos1 = 100;
        elm1.putOnTrack(track, newPos1, newDir1, fromPos1);
        test.assertEquals(newPos1, track.getMinPosition());
        test.assertEquals(newPos1, track.getMaxPosition());
        
        var elm2 = new TrainSimulator.Element();
        var newPos2 = 97, newDir2 = -1, fromPos2 = 100;
        elm2.putOnTrack(track, newPos2, newDir2, fromPos2);
        test.assertEquals(Math.min(newPos1, newPos2), track.getMinPosition());
        test.assertEquals(Math.max(newPos1, newPos2), track.getMaxPosition());
        
        var elm3 = new TrainSimulator.Element();
        var newPos3 = 167, newDir3 = 1, fromPos3 = 100;
        elm3.putOnTrack(track, newPos3, newDir3, fromPos3);
        test.assertEquals(Math.min(newPos1, newPos2, newPos3), track.getMinPosition());
        test.assertEquals(Math.max(newPos1, newPos2, newPos3), track.getMaxPosition());
        
        elm1.removeFromTrack();
        elm3.removeFromTrack();
        test.assertEquals(newPos2, track.getMinPosition());
        test.assertEquals(newPos2, track.getMaxPosition());
    },
    swap: function () {
        var track = new TrainSimulator.Track();
        var elm1 = new TrainSimulator.Element();
        var newPos1 = 134, newDir1 = -1, fromPos1 = 100;
        elm1.swaped = function(elm) {this.swapElm = elm;};
        elm1.putOnTrack(track, newPos1, newDir1, fromPos1);
        
        var elm2 = new TrainSimulator.Element();
        elm2.swaped = function(elm) {this.swapElm = elm;};
        var newPos2 = 97, newDir2 = -1, fromPos2 = 200;
        elm2.putOnTrack(track, newPos2, newDir2, fromPos2);
        
        track.sortElements();
        test.assertEquals(elm1, elm2.swapElm);
        test.assertEquals(elm2, elm1.swapElm);
        
        elm2.swapElm = undefined;
        elm1.swapElm = undefined;
        track.sortElements();
        test.assertEquals(undefined, elm2.swapElm);
        test.assertEquals(undefined, elm1.swapElm);
    },
    addElementsUnsorted: function () {
        var track = new TrainSimulator.Track();
        var elm0 = new TrainSimulator.Element();
        var elm1 = new TrainSimulator.Element();
        var elm2 = new TrainSimulator.Element();
        
        elm0.swaped = function(elm) {this.swapElm = this.swapElm || [];this.swapElm.push(elm);};
        elm1.swaped = function(elm) {this.swapElm = this.swapElm || [];this.swapElm.push(elm);};
        elm2.swaped = function(elm) {this.swapElm = this.swapElm || [];this.swapElm.push(elm);};
        var fromPos = 100, dir = 1;
        
        elm0.putOnTrack(track, fromPos, dir, fromPos);
        elm2.putOnTrack(track, fromPos + 2, dir, fromPos - 1);
        elm1.putOnTrack(track, fromPos + 1, dir, fromPos);
        
        // elm0-elm2, elm2-elm1
        track.sortElements();
        test.assertEquals(1, elm0.swapElm.length, 'elm0 swap nb');
        test.assertEquals(1, elm1.swapElm.length, 'elm1 swap nb');
        test.assertEquals(2, elm2.swapElm.length, 'elm2 swap nb');
        test.assertEquals(elm2, elm0.swapElm[0], 'elm0 swap elm');
        test.assertEquals(elm2, elm1.swapElm[0], 'elm1 swap elm');
    },
    swapEdgeCase: function () {
        var track = new TrainSimulator.Track();
        var elm0 = new TrainSimulator.Element();
        var elm00 = new TrainSimulator.Element();
        var elm1 = new TrainSimulator.Element();
        var elm2 = new TrainSimulator.Element();
        
        elm0.swaped = function(elm) {this.swapElm = elm;};
        elm00.swaped = function(elm) {this.swapElm = elm;};
        elm1.swaped = function(elm) {this.swapElm = elm;};
        elm2.swaped = function(elm) {this.swapElm = elm;};
        var fromPos = 100, dir = 1;
        
        
        elm0.putOnTrack(track, fromPos, dir, fromPos);
        elm00.putOnTrack(track, fromPos, dir, fromPos);
        elm1.putOnTrack(track, fromPos + 1, dir, fromPos);
        elm2.putOnTrack(track, fromPos + 2, dir, fromPos);
        
        // elm0 and elm00 should not swap, elm1 and elm2 should swap each other
        track.sortElements();
        test.assertEquals(undefined, elm0.swapElm);
        test.assertEquals(undefined, elm00.swapElm);
        test.assertEquals(elm2, elm1.swapElm);
        test.assertEquals(elm1, elm2.swapElm);
    }
});

test.addTests('TrainSimulator.Joint', {
    joint: function() {
        var track0 = new TrainSimulator.Track();
        var track1 = new TrainSimulator.Track();
        var joint = new TrainSimulator.Joint();
        joint.connectTrack(0, track0, 100, 1);
        joint.connectTrack(1, track1, 100, 1);
        var elm = new TrainSimulator.Element();
        elm.putOnTrack(track0, 80, 1, 80);
        track0.sortElements();
        elm.move(100);
        track0.sortElements();
        test.assertEquals(elm.getTrack(), track1);
        test.assertEquals(elm.getPosition(), 20);
        test.assertEquals(elm.getDirection(), -1);
    }
});
test.addTests('TrainSimulator.Switch', {
    sw: function() {
        var track0 = new TrainSimulator.Track();
        var track1 = new TrainSimulator.Track();
        var track2 = new TrainSimulator.Track();
        var sw = new TrainSimulator.Switch();
        sw.connectTrack(0, track0, 100, 1);
        sw.connectTrack(1, track1, 100, 1);
        sw.connectTrack(2, track2, 100, 1);
        var elm = new TrainSimulator.Element();
        elm.putOnTrack(track0, 80, 1, 80);
        track0.sortElements();
        
        elm.move(100);
        track0.sortElements();
        track1.sortElements();
        test.assertEquals(elm.getTrack(), track1);
        test.assertEquals(elm.getPosition(), 20);
        test.assertEquals(elm.getDirection(), -1);
        
        elm.move(-100 * elm.getDirection());
        track1.sortElements();
        track0.sortElements();
        test.assertEquals(elm.getTrack(), track0);
        test.assertEquals(elm.getPosition(), 80);
        test.assertEquals(elm.getDirection(), 1);
        
        sw.toggle();
        elm.move(100 * elm.getDirection());
        track0.sortElements();
        test.assertEquals(elm.getTrack(), track2);
        test.assertEquals(elm.getPosition(), 20);
        test.assertEquals(elm.getDirection(), -1);
        
    }
});
test.addTests('TrainSimulator.Detector', {
    
});
test.addTests('TrainSimulator.Block', {
    
});
test.addTests('TrainSimulator.Train', {
    
});
test.addTests('TrainSimulator.TrainSimulator', {
    
});
