(function (ts) {
    'use strict';

    ts.CanvasDrawer = function (canvas) {
        this.tracks = [];
        this.switches = [];
        this.trains = [];
        
        this.canvas = canvas;
        
        this.scale = 1;
        this.trackWidth = 1;
        
        this.addTrack = function (track) {
            this.tracks.push(track);
            return track;
        };
        this.newStraightTrack = function(origin, angle) {
            var track = this.newTrack();
            track.type = 'straight';
            track.origin = origin;
            track.angle = angle;
            return track;
        };
        
        this.addSwitch = function (sw) {
            this.switches.push(sw);
            return sw;
        };
        
        this.addTrain = function (train) {
            this.trains.push(train);
            return train;
        };
        
        this.drawTrack = function (track, ctx, from, to) {
            if (track.center) {
                var drawAntiClockWise = (from < to ) ? track.antiClockWise : !track.antiClockWise;
                var drawOriginAngle = track.originAngle + ((track.antiClockWise) ? -1 : 1) * from / track.radius;
                var drawEndAngle = track.originAngle + ((track.antiClockWise) ? -1 : 1) * to / track.radius;
                ctx.beginPath();
                ctx.arc(track.center.x, track.center.y, track.radius, drawOriginAngle, drawEndAngle, drawAntiClockWise);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(track.origin.x + from * Math.cos(track.angle), track.origin.y + from * Math.sin(track.angle));
                ctx.lineTo(track.origin.x + to * Math.cos(track.angle), track.origin.y + to * Math.sin(track.angle));
                ctx.stroke();
            }
        }
        
        this.drawTracks = function () {
            var ctx = canvas.getContext("2d");
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = this.trackWidth;
            var i;
            for (i = 0; i < this.tracks.length; i++) {
                var track = this.tracks[i];
                var from = track.elements[0].x;
                var to = track.elements[track.elements.length - 1].x;
                this.drawTrack(track, ctx, from, to);
            }
        };
        
        this.drawSwitches = function () {
            var i;
            var ctx = canvas.getContext("2d");
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
            ctx.lineWidth = this.trackWidth * 1.5;
            for (i = 0; i < this.switches.length; i++) {
                
                var jointTrack = this.switches[i].tracks[1];
                this.drawTrack(jointTrack.track, ctx, jointTrack.position, jointTrack.position - jointTrack.direction * 20 / this.scale);
                
                jointTrack = this.switches[i].tracks[this.switches[i].nextTrack(1)];
                this.drawTrack(jointTrack.track, ctx, jointTrack.position, jointTrack.position - jointTrack.direction * 20 / this.scale);
                
            }
        };
        this.drawTrains = function () {
            var ctx = canvas.getContext("2d");
            ctx.strokeStyle = 'rgba(0, 0, 255, 1)';
            ctx.lineWidth = this.trackWidth * 2;
            var i, j;
            for (i = 0; i < this.trains.length; i++) {
                var train = this.trains[i];
                var parts = train.getTrackParts();
                for (j = 0; j < parts.length; j++) {
                    var part = parts[j];
                    this.drawTrack(part.track, ctx, part.from, part.to);
                }
            }
        };
        
        this.redraw = function () {
            var ctx = canvas.getContext("2d");
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.scale(this.scale, this.scale);
            ctx.save();
            this.drawTracks();
            this.drawSwitches();
            this.drawTrains();
            ctx.restore();
        };
    };
})(TrainSimulator);
