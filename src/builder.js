var TrainSimulatorBuilder = function (canvas) {
    this.tsui = new TrainSimulatorUi(canvas);
    this.points = {};
    this.tracks = {};
    this.switches = {};
    
    this.addStraightPiece = function (piece, currentPoint) {
        var newTrack = this.tsui.newStraightTrack({x: currentPoint.x, y: currentPoint.y}, currentPoint.angle);
        currentPoint.x += piece.length * Math.cos(currentPoint.angle);
        currentPoint.y += piece.length * Math.sin(currentPoint.angle);
        this.addTrackPiecePoints(piece, newTrack, currentPoint);
        return newTrack;
    };
    
    this.addCurvePiece = function (piece, currentPoint) {
        var center, startAngle, endAngle, futureCurrentAngle, newTrack;
        if (piece.clockWise) {
            center = {
                x: currentPoint.x + piece.radius * Math.cos(currentPoint.angle + Math.PI/2),
                y: currentPoint.y + piece.radius * Math.sin(currentPoint.angle + Math.PI/2)
            };
            startAngle = currentPoint.angle - Math.PI / 2;
            endAngle = startAngle + piece.length / piece.radius;
            futureCurrentAngle = endAngle + Math.PI / 2;
        } else {
            center = {
                x: currentPoint.x + piece.radius * Math.cos(currentPoint.angle - Math.PI/2),
                y: currentPoint.y + piece.radius * Math.sin(currentPoint.angle - Math.PI/2)
            };
            startAngle = currentPoint.angle + Math.PI / 2;
            endAngle = startAngle - piece.length / piece.radius;
            futureCurrentAngle = endAngle - Math.PI / 2;
        }
        newTrack = this.tsui.newCurveTrack(center, piece.radius, startAngle, !piece.clockWise);
        currentPoint.x = center.x + piece.radius * Math.cos(endAngle);
        currentPoint.y = center.y + piece.radius * Math.sin(endAngle);
        currentPoint.angle = futureCurrentAngle;
        this.addTrackPiecePoints(piece, newTrack, currentPoint);
        return newTrack;
    };
    
    this.addTrackPiecePoints = function (piece, track, currentPoint) {
        if (piece.startPoint != undefined) {
            var inversedPoint = {
                x: currentPoint.x,
                y: currentPoint.y,
                angle: currentPoint.angle + Math.PI
            };
            this.addPoint(piece.startPoint, {
                type: 'track',
                track: track,
                position: 0,
                direction: -1,
                currentPoint: inversedPoint
            });
        }
        if (piece.endPoint != undefined) {
            this.addPoint(piece.endPoint, {
                type: 'track',
                track: track,
                position: piece.length,
                direction: 1,
                currentPoint: Utils.clone(currentPoint)
            });
        }
        if (piece.name != undefined) {
            this.tracks[piece.name] = track;
        }
    };
    
    this.addSwitchPiece = function (piece, currentPoint) {
        var sw = this.tsui.newSwitch();
        var inversedPoint = {
            x: currentPoint.x,
            y: currentPoint.y,
            angle: currentPoint.angle + Math.PI
        };
        this.addPoint(piece.point1, {type: 'switch', switch: sw, num: 1, currentPoint: inversedPoint});
        this.addPoint(piece.point2, {type: 'switch', switch: sw, num: 2, currentPoint: Utils.clone(currentPoint)});
        this.addPoint(piece.point3, {type: 'switch', switch: sw, num: 3, currentPoint: Utils.clone(currentPoint)});
        if (piece.name != undefined) {
            this.switches[piece.name] = sw;
        }
    };
    
    this.addPoint = function (name, pointInfo) {
        if (this.points[name] == undefined) {
            this.points[name] = [];
        }
        var pointArray = this.points[name];
        pointArray[pointArray.length] = pointInfo;
    };
    
    this.doConnects = function() {
        var connectSwitch = function (switchPointInfo, trackPointInfo) {
            switchPointInfo.switch.connectTrack(switchPointInfo.num, trackPointInfo.track, trackPointInfo.position, trackPointInfo.direction);
        };
        for (var pointName in this.points) {
            var pointArray = this.points[pointName];
            if (pointArray.length == 2) {
                if (pointArray[0].type == 'track' && pointArray[1].type == 'track') {
                    var joint = this.tsui.newJoint();
                    joint.connectTrack(1, pointArray[0].track, pointArray[0].position, pointArray[0].direction);
                    joint.connectTrack(2, pointArray[1].track, pointArray[1].position, pointArray[1].direction);
                } else if (pointArray[0].type == 'switch' && pointArray[1].type == 'track') {
                    connectSwitch(pointArray[0], pointArray[1]);
                }  else if (pointArray[1].type == 'switch' && pointArray[0].type == 'track') {
                    connectSwitch(pointArray[1], pointArray[0]);
                }
            }
        }
    };
    
    this.build = function (schema) {
        var points = {origin: schema.origin};
        var currentPoint = {x: points.origin.x, y: points.origin.y, angle: points.origin.angle};
        var lastTrack, newTrack;
        var i, piece, joint;
        for (i = 0; i < schema.pieces.length; i++) {
            newTrack = undefined;
            var piece = schema.pieces[i];
            if (piece.type == 'straight') {
                if (piece.startPoint != undefined) {
                    currentPoint = Utils.clone(this.points[piece.startPoint][0].currentPoint);
                }
                newTrack = this.addStraightPiece(piece, currentPoint);
            } else if (piece.type == 'curve') {
                if (piece.startPoint != undefined) {
                    currentPoint = Utils.clone(this.points[piece.startPoint][0].currentPoint);
                }
                newTrack = this.addCurvePiece(piece, currentPoint);
            } else if (piece.type == 'switch') {
                if (this.points[piece.point1] != undefined) {
                    currentPoint = Utils.clone(this.points[piece.point1][0].currentPoint);
                }
                if (this.points[piece.point2] != undefined) {
                    currentPoint = Utils.clone(this.points[piece.point2][0].currentPoint);
                    currentPoint.angle += Math.PI;
                }
                if (this.points[piece.point3] != undefined) {
                    currentPoint = Utils.clone(this.points[piece.point3][0].currentPoint);
                    currentPoint.angle += Math.PI;
                }
                this.addSwitchPiece(piece, currentPoint);
            }
            if (lastTrack !== undefined && newTrack !== undefined
                && schema.pieces[i-1].endPoint == undefined && piece.startPoint == undefined
            ) {
                var joint = this.tsui.newJoint();
                joint.connectTrack(1, lastTrack, schema.pieces[i-1].length, 1);
                joint.connectTrack(2, newTrack, 0, -1);
            }
            lastTrack = newTrack;
            if (i == 0) {
                this.addPoint('origin', {type: 'track', track: newTrack, position: 0, direction: -1});
            }
        }
        this.doConnects();
    };
}

