(function (ts) {
    'use strict';

    ts.TrainSimulatorBuilder = function (trainSimulator) {
        this.points = {};
        this.tracks = [];
        this.switches = [];
        this.namedTracks = {};
        this.namedSwitches = {};
                
        this.addStraightPiece = function (piece, currentPoint) {
            var newTrack = new ts.Track();
            this.tracks.push(newTrack);
            newTrack.origin = {x: currentPoint.x, y: currentPoint.y};
            newTrack.angle = currentPoint.angle;
            
            currentPoint.x += piece.length * Math.cos(currentPoint.angle);
            currentPoint.y += piece.length * Math.sin(currentPoint.angle);
            this.addTrackPiecePoints(piece, newTrack, currentPoint);
            return newTrack;
        };
        
        this.addCurvePiece = function (piece, currentPoint) {
            var endAngle, futureCurrentAngle, newTrack;
            newTrack = new ts.Track();
            this.tracks.push(newTrack);
            newTrack.radius = piece.radius;
            newTrack.antiClockWise = !piece.clockWise;
            if (piece.clockWise) {
                newTrack.center = {
                    x: currentPoint.x + piece.radius * Math.cos(currentPoint.angle + Math.PI/2),
                    y: currentPoint.y + piece.radius * Math.sin(currentPoint.angle + Math.PI/2)
                };
                newTrack.originAngle = currentPoint.angle - Math.PI / 2;
                endAngle = newTrack.originAngle + piece.length / piece.radius;
                futureCurrentAngle = endAngle + Math.PI / 2;
            } else {
                newTrack.center = {
                    x: currentPoint.x + piece.radius * Math.cos(currentPoint.angle - Math.PI/2),
                    y: currentPoint.y + piece.radius * Math.sin(currentPoint.angle - Math.PI/2)
                };
                newTrack.originAngle = currentPoint.angle + Math.PI / 2;
                endAngle = newTrack.originAngle - piece.length / piece.radius;
                futureCurrentAngle = endAngle - Math.PI / 2;
            }
            currentPoint.x = newTrack.center.x + piece.radius * Math.cos(endAngle);
            currentPoint.y = newTrack.center.y + piece.radius * Math.sin(endAngle);
            currentPoint.angle = futureCurrentAngle;
            this.addTrackPiecePoints(piece, newTrack, currentPoint);
            return newTrack;
        };
        
        this.addTrackPiecePoints = function (piece, track, currentPoint) {
            if (piece.startPoint !== undefined) {
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
            if (piece.endPoint !== undefined) {
                this.addPoint(piece.endPoint, {
                    type: 'track',
                    track: track,
                    position: piece.length,
                    direction: 1,
                    currentPoint: ts.Utils.clone(currentPoint)
                });
            }
            if (piece.name !== undefined) {
                this.namedTracks[piece.name] = track;
            }
        };
        
        this.addSwitchPiece = function (piece, currentPoint) {
            var sw = new ts.Switch()
            this.switches.push(sw);
            var inversedPoint = {
                x: currentPoint.x,
                y: currentPoint.y,
                angle: currentPoint.angle + Math.PI
            };
            this.addPoint(piece.point0, {type: 'switch', sw: sw, num: 0, currentPoint: inversedPoint});
            this.addPoint(piece.point1, {type: 'switch', sw: sw, num: 1, currentPoint: ts.Utils.clone(currentPoint)});
            this.addPoint(piece.point2, {type: 'switch', sw: sw, num: 2, currentPoint: ts.Utils.clone(currentPoint)});
            if (piece.name !== undefined) {
                this.namedSwitches[piece.name] = sw;
            }
        };
        
        this.addPoint = function (name, pointInfo) {
            if (this.points[name] === undefined) {
                this.points[name] = [];
            }
            var pointArray = this.points[name];
            pointArray[pointArray.length] = pointInfo;
        };
        
        this.doConnects = function() {
            var connectSwitch = function (switchPointInfo, trackPointInfo) {
                switchPointInfo.sw.connectTrack(switchPointInfo.num, trackPointInfo.track, trackPointInfo.position, trackPointInfo.direction);
            };
            var pointName, pointArray, joint;
            for (pointName in this.points) {
                if (this.points.hasOwnProperty(pointName)) {
                    pointArray = this.points[pointName];
                    if (pointArray.length === 2) {
                        if (pointArray[0].type === 'track' && pointArray[1].type === 'track') {
                            joint = new ts.Joint();
                            joint.connectTrack(0, pointArray[0].track, pointArray[0].position, pointArray[0].direction);
                            joint.connectTrack(1, pointArray[1].track, pointArray[1].position, pointArray[1].direction);
                        } else if (pointArray[0].type === 'switch' && pointArray[1].type === 'track') {
                            connectSwitch(pointArray[0], pointArray[1]);
                        }  else if (pointArray[1].type === 'switch' && pointArray[0].type === 'track') {
                            connectSwitch(pointArray[1], pointArray[0]);
                        }
                    }
                }
            }
        };
        
        this.build = function (schema) {
            var currentPoint = {x: schema.origin.x, y: schema.origin.y, angle: schema.origin.angle};
            var lastTrack, newTrack;
            var i, piece, joint;
            for (i = 0; i < schema.pieces.length; i++) {
                newTrack = undefined;
                piece = schema.pieces[i];
                if (piece.type === 'straight') {
                    if (piece.startPoint !== undefined) {
                        currentPoint = ts.Utils.clone(this.points[piece.startPoint][0].currentPoint);
                    }
                    newTrack = this.addStraightPiece(piece, currentPoint);
                } else if (piece.type === 'curve') {
                    if (piece.startPoint !== undefined) {
                        currentPoint = ts.Utils.clone(this.points[piece.startPoint][0].currentPoint);
                    }
                    newTrack = this.addCurvePiece(piece, currentPoint);
                } else if (piece.type === 'switch') {
                    if (this.points[piece.point0] !== undefined) {
                        currentPoint = ts.Utils.clone(this.points[piece.point0][0].currentPoint);
                    }
                    if (this.points[piece.point1] !== undefined) {
                        currentPoint = ts.Utils.clone(this.points[piece.point1][0].currentPoint);
                        currentPoint.angle += Math.PI;
                    }
                    if (this.points[piece.point2] !== undefined) {
                        currentPoint = ts.Utils.clone(this.points[piece.point2][0].currentPoint);
                        currentPoint.angle += Math.PI;
                    }
                    this.addSwitchPiece(piece, currentPoint);
                }
                if (lastTrack !== undefined && newTrack !== undefined &&
                    schema.pieces[i-1].endPoint === undefined && piece.startPoint === undefined
                ) {
                    joint = new ts.Joint();
                    joint.connectTrack(0, lastTrack, schema.pieces[i-1].length, 1);
                    joint.connectTrack(1, newTrack, 0, -1);
                }
                lastTrack = newTrack;
                if (i === 0 && newTrack !== undefined) {
                    this.addPoint('origin', {type: 'track', track: newTrack, position: 0, direction: -1});
                }
            }
            this.doConnects();
        };
        
        this.registerToTrainSimulator = function (trainSimulator) {
            var i;
            for (i = 0; i < this.tracks.length; i++) {
                trainSimulator.tracks.push(this.tracks[i]);
            }
        };
        
        this.registerToDrawer = function (drawer) {
            var i;
            for (i = 0; i < this.tracks.length; i++) {
                drawer.addTrack(this.tracks[i]);
            }
            for (i = 0; i < this.switches.length; i++) {
                drawer.addSwitch(this.switches[i]);
            }
        };
    };
})(TrainSimulator);

