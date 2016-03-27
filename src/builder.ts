import {Track} from "./track";
import {clone} from "./utils";
import {Switch} from "./switch";
import {Joint} from "./joint";

class DrawableTrack extends Track {
    public type;
    public origin;
    public angle;
    public length;
    public color;
    public end;
    public control;
    public points;
}

export class Builder {
    private points = {};
    private tracks = [];
    private switches = [];
    public namedTracks = {};
    public namedSwitches = {};

    constructor() {}
                
    addStraightPiece(piece, currentPoint) {
        var newTrack = new DrawableTrack();
        newTrack.type = 'straight';
        this.tracks.push(newTrack);
        newTrack.origin = {x: currentPoint.x, y: currentPoint.y};
        newTrack.angle = currentPoint.angle;
        newTrack.length = piece.length;
        currentPoint.x += piece.length * Math.cos(currentPoint.angle);
        currentPoint.y += piece.length * Math.sin(currentPoint.angle);
        if (piece.color !== undefined) {
            newTrack.color = piece.color;
        }
        this.addTrackPiecePoints(piece, newTrack, currentPoint);
        return newTrack;
    };

    addCurvePiece(piece, currentPoint) {
        var endAngle, futureCurrentAngle, newTrack;
        newTrack = new DrawableTrack();
        this.tracks.push(newTrack);
        newTrack.type = 'curve';
        newTrack.origin = {x: currentPoint.x, y: currentPoint.y};
        newTrack.radius = piece.radius;
        newTrack.length = piece.length;
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
        if (piece.color !== undefined) {
            newTrack.color = piece.color;
        }
        this.addTrackPiecePoints(piece, newTrack, currentPoint);
        return newTrack;
    };

    addQuadraticPiece(piece, currentPoint) {
        var newTrack = new DrawableTrack();
        this.tracks.push(newTrack);
        newTrack.type = 'quadratic';
        newTrack.origin = {x: currentPoint.x, y: currentPoint.y};
        newTrack.end = {x:currentPoint.x + piece.offsetX * Math.cos(currentPoint.angle) - piece.offsetY * Math.sin(currentPoint.angle),
                y: currentPoint.y + piece.offsetX * Math.sin(currentPoint.angle) + piece.offsetY * Math.cos(currentPoint.angle)
        };
        newTrack.control = {x:currentPoint.x + (piece.offsetX - piece.offsetY*Math.tan(Math.PI/2-piece.offsetAngle)) * Math.cos(currentPoint.angle),
                y: currentPoint.y + (piece.offsetX - piece.offsetY*Math.tan(Math.PI/2-piece.offsetAngle)) * Math.sin(currentPoint.angle)
        };
        newTrack.points = [];

        var i, nbPoints = 20;
        for (i = 0; i <= nbPoints; i++) {
            var t = i / nbPoints;
            newTrack.points[i] = {
                x: newTrack.origin.x * (1 - t) * (1 - t) + 2 * t * (1 - t) * newTrack.control.x + t * t * newTrack.end.x,
                y: newTrack.origin.y * (1 - t) * (1 - t) + 2 * t * (1 - t) * newTrack.control.y + t * t * newTrack.end.y
            };
            if (i > 0) {
                newTrack.points[i].length = newTrack.points[i-1].length + Math.sqrt(Math.pow(newTrack.points[i].x - newTrack.points[i-1].x, 2) + Math.pow(newTrack.points[i].y - newTrack.points[i-1].y, 2));
            } else {
                newTrack.points[0].length = 0;
            }
        }
        newTrack.length = newTrack.points[nbPoints].length;
        currentPoint.x = newTrack.end.x;
        currentPoint.y = newTrack.end.y;
        currentPoint.angle = currentPoint.angle + piece.offsetAngle;

        if (piece.color !== undefined) {
            newTrack.color = piece.color;
        }
        this.addTrackPiecePoints(piece, newTrack, currentPoint);
        return newTrack;
    };

    addTrackPiecePoints(piece, track, currentPoint) {
        if (piece.startPoint !== undefined) {
            var inversedPoint = {
                x: track.origin.x,
                y: track.origin.y,
                angle: track.angle + Math.PI
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
                position: track.length,
                direction: 1,
                currentPoint: clone(currentPoint)
            });
        }
        if (piece.name !== undefined) {
            this.namedTracks[piece.name] = track;
        }
    };

    addSwitchPiece(piece, currentPoint) {
        var sw = new Switch();
        this.switches.push(sw);
        var inversedPoint = {
            x: currentPoint.x,
            y: currentPoint.y,
            angle: currentPoint.angle + Math.PI
        };
        this.addPoint(piece.point0, {type: 'switch', sw: sw, num: 0, currentPoint: inversedPoint});
        this.addPoint(piece.point1, {type: 'switch', sw: sw, num: 1, currentPoint: clone(currentPoint)});
        this.addPoint(piece.point2, {type: 'switch', sw: sw, num: 2, currentPoint: clone(currentPoint)});
        if (piece.name !== undefined) {
            this.namedSwitches[piece.name] = sw;
        }
    };

    addPoint(name, pointInfo) {
        if (this.points[name] === undefined || this.points[name][0].type === 'fake') {
            this.points[name] = [];
        }
        var pointArray = this.points[name];
        pointArray[pointArray.length] = pointInfo;
    };

    doConnects() {
        var connectSwitch = (switchPointInfo, trackPointInfo) => {
            switchPointInfo.sw.connectTrack(switchPointInfo.num, trackPointInfo.track, trackPointInfo.position, trackPointInfo.direction);
        };
        var pointName, pointArray, joint;
        for (pointName in this.points) {
            if (this.points.hasOwnProperty(pointName)) {
                pointArray = this.points[pointName];
                if (pointArray.length === 2) {
                    if (pointArray[0].type === 'track' && pointArray[1].type === 'track') {
                        joint = new Joint();
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

    build(schema) {
        var currentPoint = {x: 0, y: 0, angle: 0};
        var lastTrack, newTrack;
        var i, piece, joint;
        for (i in schema.points) {
            if (schema.points.hasOwnProperty(i)) {
                this.addPoint(i, {type: 'fake', currentPoint: schema.points[i]});
            }
        }
        for (i = 0; i < schema.pieces.length; i++) {
            newTrack = undefined;
            piece = schema.pieces[i];
            if (piece.type === 'straight') {
                if (piece.startPoint !== undefined) {
                    currentPoint = clone(this.points[piece.startPoint][0].currentPoint);
                }
                newTrack = this.addStraightPiece(piece, currentPoint);
            } else if (piece.type === 'curve') {
                if (piece.startPoint !== undefined) {
                    currentPoint = clone(this.points[piece.startPoint][0].currentPoint);
                }
                newTrack = this.addCurvePiece(piece, currentPoint);
            } else if (piece.type === 'quadratic') {
                if (piece.startPoint !== undefined) {
                    currentPoint = clone(this.points[piece.startPoint][0].currentPoint);
                }
                newTrack = this.addQuadraticPiece(piece, currentPoint);
            } else if (piece.type === 'switch') {
                if (this.points[piece.point0] !== undefined) {
                    currentPoint = clone(this.points[piece.point0][0].currentPoint);
                }
                if (this.points[piece.point1] !== undefined) {
                    currentPoint = clone(this.points[piece.point1][0].currentPoint);
                    currentPoint.angle += Math.PI;
                }
                if (this.points[piece.point2] !== undefined) {
                    currentPoint = clone(this.points[piece.point2][0].currentPoint);
                    currentPoint.angle += Math.PI;
                }
                this.addSwitchPiece(piece, currentPoint);
            }
            if (lastTrack !== undefined && newTrack !== undefined &&
                schema.pieces[i-1].endPoint === undefined && piece.startPoint === undefined
            ) {
                joint = new Joint();
                joint.connectTrack(0, lastTrack, lastTrack.length, 1);
                joint.connectTrack(1, newTrack, 0, -1);
            }
            lastTrack = newTrack;
        }
        this.doConnects();
    };

    registerToTrainSimulator(trainSimulator) {
        var i;
        for (i = 0; i < this.tracks.length; i++) {
            trainSimulator.tracks.push(this.tracks[i]);
        }
    };

    registerToDrawer(drawer) {
        var i;
        for (i = 0; i < this.tracks.length; i++) {
            drawer.addTrack(this.tracks[i]);
        }
        for (i = 0; i < this.switches.length; i++) {
            drawer.addSwitch(this.switches[i]);
        }
    };
}
