var TrainSimulatorUi = function(canvas) {
    this.trainSimulator = new TrainSimulator();
    this.tracks = [];
    this.joints = [];
    this.switches = [];
    this.trains = [];
    
    this.canvas = canvas;
    
    this.newTrack = function() {
        var track = this.trainSimulator.newTrack();
        this.tracks.push(track);
        return track;
    };
    this.newStraightTrack = function(origin, angle) {
        var track = this.newTrack();
        track.type = 'straight';
        track.origin = origin;
        track.angle = angle;
        track.draw = function(ctx, from, to) {
            ctx.beginPath();
            ctx.moveTo(this.origin.x + from * Math.cos(this.angle), this.origin.y + from * Math.sin(this.angle));
            ctx.lineTo(this.origin.x + to * Math.cos(this.angle), this.origin.y + to * Math.sin(this.angle));
            ctx.stroke();
        };
        return track;
    };
    this.newCurveTrack = function(center, radius, originAngle, turnDirection) {
        var track = this.newTrack();
        track.type = 'curve';
        track.center = center;
        track.radius = radius;
        track.originAngle = originAngle;
        track.turnDirection = turnDirection;
        track.draw = function(ctx, from, to) {
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.radius, this.originAngle + from / this.radius, this.originAngle + to / this.radius, this.turnDirection)
            ctx.stroke();
        };
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
        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        var i;
        for (i = 0; i < this.tracks.length; i++) {
            var track = this.tracks[i];
            var from = track.elements[0].x;
            var to = track.elements[track.elements.length - 1].x;
            track.draw(ctx, from, to);
        }
    };
    
    this.drawJoints = function() {
        var i;
        for (i = 0; i < this.joints.length; i++) {
            /*
            var j1 = document.getElementById('joint-'+i+'-1');
            j1.style.left = this.joints[i].tracks[1].position + 'px';
            var j2 = document.getElementById('joint-'+i+'-2');
            j2.style.left = this.joints[i].tracks[2].position + 'px';
            */
        }
    };
    this.drawSwitches = function() {
        var i;
        for (i = 0; i < this.switches.length; i++) {
            /*
            var j1 = document.getElementById('switch-'+i+'-1');
            j1.style.left = this.switches[i].tracks[1].position + 'px';
            var j2 = document.getElementById('switch-'+i+'-2');
            j2.style.left = this.switches[i].tracks[2].position + 'px';
            var j3 = document.getElementById('switch-'+i+'-3');
            j3.style.left = this.switches[i].tracks[3].position + 'px';
            */
        }
    };
    this.drawTrains = function() {
        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = 'rgba(0, 0, 255, 1)';
        ctx.lineWidth = 3;
        var i, j;
        for (i = 0; i < this.trains.length; i++) {
            var train = this.trains[i];
            var parts = train.getTrackParts();
            for (j = 0; j < parts.length; j++) {
                var part = parts[j];
                part.track.draw(ctx, part.from, part.to);
            }
            //var headTrack = train.elementHead.track;
            //headTrack.draw(ctx, train.elementHead.x, train.elementTail.x);
        }
    };
    
    this.redraw = function() {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawTracks();
        this.drawTrains();
    }
}

