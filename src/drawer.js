(function (ts) {
    'use strict';

    ts.CanvasDrawer = function (canvas) {
        this.tracks = [];
        this.switches = [];
        this.trains = [];
        
        this.canvas = canvas;
        
        this.scale = 1;
        this.translation = {x: 0, y:0};
        this.trackWidth = 1;
        this.switchLength = 20;
        this.doGridDrawing = false;
        this.gridInfo = {
        		minX: -100,
        		maxX: 100,
        		minY: -100,
        		maxY: 100,
        		spacing: 10
        };
        
        this.canvas.addEventListener('DOMMouseScroll', (function(evt) {this.scale = this.scale * (1 - evt.detail / 10); evt.preventDefault();}).bind(this), false);
        var mouseInfo = {x:0, y:0, down: false};
        this.canvas.addEventListener('mousedown', function(evt) {mouseInfo.x = evt.clientX; mouseInfo.y = evt.clientY; mouseInfo.down = true;}, false);
        this.canvas.addEventListener('mouseup', function(evt) {mouseInfo.down = false;}, false);
        this.canvas.addEventListener('mouseout', function(evt) {mouseInfo.down = false;}, false);
        this.canvas.addEventListener('mousemove', (function(evt) {
        	if (mouseInfo.down) {
        		this.translation.x += (evt.clientX - mouseInfo.x) / this.scale;
        		this.translation.y += (evt.clientY - mouseInfo.y) / this.scale;
        	}
        	mouseInfo.x = evt.clientX;
        	mouseInfo.y = evt.clientY;
        }).bind(this), false);
        
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
        };
        
        this.drawTracks = function () {
            var ctx = canvas.getContext("2d");
            ctx.lineWidth = this.trackWidth;
            var i;
            for (i = 0; i < this.tracks.length; i++) {
                var track = this.tracks[i];
            	ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                if (track.color !== undefined) {
                	ctx.strokeStyle = 'rgba('+track.color.r+','+track.color.g+','+track.color.b+',0.3)';
                }
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
                
                var jointTrack = this.switches[i].tracks[0];
                //this.drawTrack(jointTrack.track, ctx, jointTrack.position, jointTrack.position - jointTrack.direction * this.switchLength * 1/3);
                
                jointTrack = this.switches[i].tracks[this.switches[i].nextTrack(0)];
                this.drawTrack(jointTrack.track, ctx, jointTrack.position, jointTrack.position - jointTrack.direction * this.switchLength);
                
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
        this.drawGrid = function () {
        	var i;
        	var ctx = canvas.getContext("2d");
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 1;
        	for (i = 0; i <= this.gridInfo.maxX; i += this.gridInfo.spacing) {
        		ctx.beginPath();
                ctx.moveTo(i, this.gridInfo.minY);
                ctx.lineTo(i, this.gridInfo.maxY);
                ctx.stroke();
        	}
        	for (i = 0; i >= this.gridInfo.minX; i -= this.gridInfo.spacing) {
        		ctx.beginPath();
                ctx.moveTo(i, this.gridInfo.minY);
                ctx.lineTo(i, this.gridInfo.maxY);
                ctx.stroke();
        	}
        	for (i = 0; i <= this.gridInfo.maxY; i += this.gridInfo.spacing) {
        		ctx.beginPath();
                ctx.moveTo(this.gridInfo.minX, i);
                ctx.lineTo(this.gridInfo.maxX, i);
                ctx.stroke();
        	}
        	for (i = 0; i >= this.gridInfo.minY; i -= this.gridInfo.spacing) {
        		ctx.beginPath();
                ctx.moveTo(this.gridInfo.minX, i);
                ctx.lineTo(this.gridInfo.maxX, i);
                ctx.stroke();
        	}
        };
        
        this.redraw = function () {
            var ctx = canvas.getContext("2d");
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(this.scale, this.scale);
            ctx.translate(this.translation.x, this.translation.y);
            ctx.save();
            if (this.doGridDrawing) {
            	this.drawGrid();
            }
            this.drawTracks();
            this.drawSwitches();
            this.drawTrains();
            ctx.restore();
        };
        
        this.tick = this.redraw;
    };
})(TrainSimulator);
