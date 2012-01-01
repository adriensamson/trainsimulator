var TrainSimulatorUi = function(canvas) {
    this.trainSimulator = new TrainSimulator();
    this.tracks = [];
    this.joints = [];
    this.switches = [];
    this.trains = [];
    
    this.canvas = canvas;
    
    this.scale = 1;
    this.trackWidth = 1;
    
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
    this.newCurveTrack = function(center, radius, originAngle, antiClockWise) {
        var track = this.newTrack();
        track.type = 'curve';
        track.center = center;
        track.radius = radius;
        track.originAngle = originAngle;
        track.antiClockWise = antiClockWise;
        track.draw = function(ctx, from, to) {
            var drawAntiClockWise = (from < to ) ? this.antiClockWise : !this.antiClockWise;
            var drawOriginAngle = this.originAngle + ((this.antiClockWise) ? -1 : 1) * from / this.radius;
            var drawEndAngle = this.originAngle + ((this.antiClockWise) ? -1 : 1) * to / this.radius;
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.radius, drawOriginAngle, drawEndAngle, drawAntiClockWise);
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
        ctx.lineWidth = this.trackWidth;
        var i;
        for (i = 0; i < this.tracks.length; i++) {
            var track = this.tracks[i];
            var from = track.elements[0].x;
            var to = track.elements[track.elements.length - 1].x;
            track.draw(ctx, from, to);
        }
    };
    
    this.drawSwitches = function() {
        var i;
        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.lineWidth = this.trackWidth * 1.5;
        for (i = 0; i < this.switches.length; i++) {
            
            var jointTrack = this.switches[i].tracks[1];
            jointTrack.track.draw(ctx, jointTrack.position, jointTrack.position - jointTrack.direction * 100);
            
            var jointTrack = this.switches[i].tracks[this.switches[i].nextTrack(1)];
            jointTrack.track.draw(ctx, jointTrack.position, jointTrack.position - jointTrack.direction * 100);
            
        }
    };
    this.drawTrains = function() {
        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = 'rgba(0, 0, 255, 1)';
        ctx.lineWidth = this.trackWidth * 2;
        var i, j;
        for (i = 0; i < this.trains.length; i++) {
            var train = this.trains[i];
            var parts = train.getTrackParts();
            for (j = 0; j < parts.length; j++) {
                var part = parts[j];
                part.track.draw(ctx, part.from, part.to);
            }
        }
    };
    
    this.redraw = function() {
        var ctx = canvas.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(this.scale, this.scale);
        ctx.save();
        this.drawTracks();
        this.drawSwitches();
        this.drawTrains();
        ctx.restore();
    }
}

