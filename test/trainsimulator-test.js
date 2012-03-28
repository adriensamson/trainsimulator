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
