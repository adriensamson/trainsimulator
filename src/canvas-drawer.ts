export class CanvasDrawer {
    private tracks = [];
    private switches = [];
    private trains = [];

    public scale = 1;
    private translation = {x: 0, y:0};
    public trackWidth = 1;
    public switchLength = 20;
    private doGridDrawing = false;
    public gridInfo = {
            minX: -100,
            maxX: 100,
            minY: -100,
            maxY: 100,
            spacing: 10
    };

    constructor(private canvas) {
        this.canvas.addEventListener('DOMMouseScroll', (function (evt) {
            this.scale = this.scale * (1 - evt.detail / 10);
            evt.preventDefault();
        }).bind(this), false);
        var mouseInfo = {x: 0, y: 0, down: false};
        this.canvas.addEventListener('mousedown', function (evt) {
            mouseInfo.x = evt.clientX;
            mouseInfo.y = evt.clientY;
            mouseInfo.down = true;
        }, false);
        this.canvas.addEventListener('mouseup', function (evt) {
            mouseInfo.down = false;
        }, false);
        this.canvas.addEventListener('mouseout', function (evt) {
            mouseInfo.down = false;
        }, false);
        this.canvas.addEventListener('mousemove', (function (evt) {
            if (mouseInfo.down) {
                this.translation.x += (evt.clientX - mouseInfo.x) / this.scale;
                this.translation.y += (evt.clientY - mouseInfo.y) / this.scale;
            }
            mouseInfo.x = evt.clientX;
            mouseInfo.y = evt.clientY;
        }).bind(this), false);
    }

    addTrack(track) {
        this.tracks.push(track);
        return track;
    };

    addSwitch(sw) {
        this.switches.push(sw);
        return sw;
    };

    addTrain(train) {
        this.trains.push(train);
        return train;
    };

    drawTrack(track, ctx, from, to) {
        if (track.type === 'curve') {
            var drawAntiClockWise = (from < to ) ? track.antiClockWise : !track.antiClockWise;
            var drawOriginAngle = track.originAngle + ((track.antiClockWise) ? -1 : 1) * from / track.radius;
            var drawEndAngle = track.originAngle + ((track.antiClockWise) ? -1 : 1) * to / track.radius;
            ctx.beginPath();
            ctx.arc(track.center.x, track.center.y, track.radius, drawOriginAngle, drawEndAngle, drawAntiClockWise);
            ctx.stroke();
        } else if (track.type === 'quadratic') {
            if (from === 0 && to === track.length || to === 0 && from === track.length) {
                ctx.beginPath();
                ctx.moveTo(track.origin.x, track.origin.y);
                ctx.quadraticCurveTo(track.control.x, track.control.y, track.end.x, track.end.y);
                ctx.stroke();
            } else {
                var i = 0, min = Math.min(from, to), max = Math.max(from, to);
                while (i < track.points.length && track.points[i].length < min) {
                    i++;
                }
                ctx.beginPath();
                ctx.moveTo(track.points[i].x, track.points[i].y);
                while (i < track.points.length && track.points[i].length <= max) {
                    ctx.lineTo(track.points[i].x, track.points[i].y);
                    i++;
                }
                ctx.stroke();
            }
        } else {
            ctx.beginPath();
            ctx.moveTo(track.origin.x + from * Math.cos(track.angle), track.origin.y + from * Math.sin(track.angle));
            ctx.lineTo(track.origin.x + to * Math.cos(track.angle), track.origin.y + to * Math.sin(track.angle));
            ctx.stroke();
        }
    };

    drawTracks() {
        var ctx = this.canvas.getContext("2d");
        ctx.lineWidth = this.trackWidth;
        var i;
        for (i = 0; i < this.tracks.length; i++) {
            var track = this.tracks[i];
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            if (track.color !== undefined) {
                ctx.strokeStyle = 'rgba('+track.color.r+','+track.color.g+','+track.color.b+',0.3)';
            }
            var from = track.getMinPosition();
            var to = track.getMaxPosition();
            this.drawTrack(track, ctx, from, to);
        }
    };

    drawSwitches() {
        var i;
        var ctx = this.canvas.getContext("2d");
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.lineWidth = this.trackWidth * 1.5;
        for (i = 0; i < this.switches.length; i++) {

            var jointTrack = this.switches[i].tracks[0];
            //this.drawTrack(jointTrack.track, ctx, jointTrack.position, jointTrack.position - jointTrack.direction * this.switchLength * 1/3);

            jointTrack = this.switches[i].tracks[this.switches[i].nextTrack(0)];
            this.drawTrack(jointTrack.track, ctx, jointTrack.position, jointTrack.position - jointTrack.direction * this.switchLength);

        }
    };
    drawTrains() {
        var ctx = this.canvas.getContext("2d");
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
    drawGrid() {
        var i;
        var ctx = this.canvas.getContext("2d");
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

    redraw() {
        var ctx = this.canvas.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
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

    tick() {
        this.redraw();
    }
}
