var TrainSimulatorUi = function() {
    this.trainSimulator = new TrainSimulator();
    this.tracks = [];
    this.joints = [];
    this.switches = [];
    this.trains = [];
    
    this.newTrack = function() {
        var track = this.trainSimulator.newTrack();
        this.tracks.push(track);
        return track;
    };
    this.newJoint = function() {
        var joint = new Joint();
        this.joints.push(joint);
        return joint;
    };
    this.newSwitch = function() {
        var sw = new Switch();
        this.switches.push(sw);
        return sw;
    };
    this.newTrain = function(size) {
        var train = new Train(size);
        this.trains.push(train);
        return train;
    };
    this.drawTracks = function() {
        var i;
        for (i = 0; i < this.tracks.length; i++) {
            var min = this.tracks[i].elements[0].x;
            var max = this.tracks[i].elements[this.tracks[i].elements.length - 1].x;
            var width = max - min;
            var track = document.getElementById('track-'+i);
            track.style.width = width + 'px';
        }
    };
    this.drawJoints = function() {
        var i;
        for (i = 0; i < this.joints.length; i++) {
            var j1 = document.getElementById('joint-'+i+'-1');
            j1.style.left = this.joints[i].tracks[1].position + 'px';
            var j2 = document.getElementById('joint-'+i+'-2');
            j2.style.left = this.joints[i].tracks[2].position + 'px';
        }
    };
    this.drawSwitches = function() {
        var i;
        for (i = 0; i < this.switches.length; i++) {
            var j1 = document.getElementById('switch-'+i+'-1');
            j1.style.left = this.switches[i].tracks[1].position + 'px';
            var j2 = document.getElementById('switch-'+i+'-2');
            j2.style.left = this.switches[i].tracks[2].position + 'px';
            var j3 = document.getElementById('switch-'+i+'-3');
            j3.style.left = this.switches[i].tracks[3].position + 'px';
        }
    };
    this.drawTrains = function() {
        var i;
        for (i = 0; i < this.trains.length; i++) {
            var headTrack = this.trains[i].elementHead.track;
            var domHeadTrack = document.getElementById('track-'+this.tracks.indexOf(headTrack));
            var head = document.getElementById('train-'+i+'-head');
            domHeadTrack.appendChild(head);
            head.style.left = this.trains[i].elementHead.x + 'px';
            
            var tailTrack = this.trains[i].elementTail.track;
            var domTailTrack = document.getElementById('track-'+this.tracks.indexOf(tailTrack));
            var tail = document.getElementById('train-'+i+'-tail');
            domTailTrack.appendChild(tail);
            tail.style.left = this.trains[i].elementTail.x + 'px';
        }
    };
}

