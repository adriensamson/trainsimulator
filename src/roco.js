var RocoDimensions = {
    L1: 200,
    L2: 185,
    L3: 76.5,
    Rsw: 502.7,
    Asw: Math.PI / 8,
    A: Math.PI / 6,
    R2: 358,
    R3: 434.5,
    R4:	511.1
};

var RocoPieces = (function() {
    var addPoints = function(piece, points) {
        if (points != undefined) {
            if (points.startPoint != undefined) {
                piece.startPoint = points.startPoint;
            }
            if (points.endPoint != undefined) {
                piece.endPoint = points.endPoint;
            }
            if (points.name != undefined) {
                piece.name = points.name;
            }
        }
        return piece;
    };
    return {
        straight200: function (points) {
            return addPoints({type: 'straight', length: RocoDimensions.L1}, points);
        },
        straight185: function (points) {
            return addPoints({type: 'straight', length: RocoDimensions.L2}, points);
        },
        curve2left: function (points) {
            return addPoints({type: 'curve', radius: RocoDimensions.R2, length: RocoDimensions.R2 * RocoDimensions.A, clockWise: false}, points);
        },
        curve2right: function (points) {
            return addPoints({type: 'curve', radius: RocoDimensions.R2, length: RocoDimensions.R2 * RocoDimensions.A, clockWise: true}, points);
        },
        curve3left: function (points) {
            return addPoints({type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: false}, points);
        },
        curve3right: function (points) {
            return addPoints({type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: true}, points);
        },
        curve4left: function (points) {
            return addPoints({type: 'curve', radius: RocoDimensions.R4, length: RocoDimensions.R4 * RocoDimensions.A, clockWise: false}, points);
        },
        curve4right: function (points) {
            return addPoints({type: 'curve', radius: RocoDimensions.R4, length: RocoDimensions.R4 * RocoDimensions.A, clockWise: true}, points);
        },
        switchLeft0: function (name, startPoint0, endPoint1, endPoint2) {
            return [
                {type: 'switch', name: name, point0: startPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'straight', length: RocoDimensions.L1, startPoint: name+'|1', endPoint: endPoint1},
                {type: 'curve', radius: RocoDimensions.Rsw, length: RocoDimensions.Rsw * RocoDimensions.Asw, clockWise: false, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        switchRight0: function (name, startPoint0, endPoint1, endPoint2) {
            return [
                {type: 'switch', name: name, point0: startPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'straight', length: RocoDimensions.L1, startPoint: name+'|1', endPoint: endPoint1},
                {type: 'curve', radius: RocoDimensions.Rsw, length: RocoDimensions.Rsw * RocoDimensions.Asw, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        switchLeft1: function (name, endPoint0, startPoint1, endPoint2) {
            return [
                {type: 'straight', length: RocoDimensions.L1, endPoint: name+'|1', startPoint: startPoint1},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'curve', radius: RocoDimensions.Rsw, length: RocoDimensions.Rsw * RocoDimensions.Asw, clockWise: false, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        switchRight1: function (name, endPoint0, startPoint1, endPoint2) {
            return [
                {type: 'straight', length: RocoDimensions.L1, endPoint: name+'|1', startPoint: startPoint1},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'curve', radius: RocoDimensions.Rsw, length: RocoDimensions.Rsw * RocoDimensions.Asw, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        switchLeft2: function (name, endPoint0, endPoint1, startPoint2) {
            return [
                {type: 'curve', radius: RocoDimensions.Rsw, length: RocoDimensions.Rsw * RocoDimensions.Asw, clockWise: true, endPoint: name+'|2', startPoint: startPoint2},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'straight', length: RocoDimensions.L1, startPoint: name+'|1', endPoint: endPoint1}
            ];
        },
        switchRight2: function (name, endPoint0, endPoint1, startPoint2) {
            return [
                {type: 'curve', radius: RocoDimensions.Rsw, length: RocoDimensions.Rsw * RocoDimensions.Asw, clockWise: false, endPoint: name+'|2', startPoint: startPoint2},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'straight', length: RocoDimensions.L1, startPoint: name+'|1', endPoint: endPoint1}
            ];
        },
        counterCurveLeft: function (points) {
            return addPoints({type: 'curve', radius: RocoDimensions.Rsw, length: RocoDimensions.Rsw * RocoDimensions.Asw, clockWise: false}, points);
        },
        counterCurveRight: function (points) {
            return addPoints({type: 'curve', radius: RocoDimensions.Rsw, length: RocoDimensions.Rsw * RocoDimensions.Asw, clockWise: true}, points);
        },
        curveSwitchLeft0: function (name, startPoint0, endPoint1, endPoint2) {
            return [
                {type: 'switch', name: name, point0: startPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'straight', length: RocoDimensions.L3, startPoint: name+'|1'},
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: false, endPoint:endPoint1},
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: false, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        curveSwitchRight0: function (name, startPoint0, endPoint1, endPoint2) {
            return [
                {type: 'switch', name: name, point0: startPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'straight', length: RocoDimensions.L3, startPoint: name+'|1'},
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: true, endPoint:endPoint1},
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        curveSwitchLeft1: function (name, endPoint0, startPoint1, endPoint2) {
            return [
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: true, startPoint: startPoint1},
                {type: 'straight', length: RocoDimensions.L1, endPoint: name+'|1'},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: false, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        curveSwitchRight1: function (name, endPoint0, startPoint1, endPoint2) {
            return [
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: false, startPoint: startPoint1},
                {type: 'straight', length: RocoDimensions.L1, endPoint: name+'|1'},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        curveSwitchLeft2: function (name, endPoint0, endPoint1, startPoint2) {
            return [
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: true, endPoint: name+'|2', startPoint: startPoint2},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'straight', length: RocoDimensions.L3, startPoint: name+'|1'},
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: false, endPoint:endPoint1}
            ];
        },
        curveSwitchRight2: function (name, endPoint0, endPoint1, startPoint2) {
            return [
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: false, endPoint: name+'|2', startPoint: startPoint2},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'straight', length: RocoDimensions.L3, startPoint: name+'|1'},
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: true, endPoint:endPoint1}
            ];
        }
    };
})();
