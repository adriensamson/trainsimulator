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
    }
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
        switchLeft1: function (name, startPoint1, endPoint2, endPoint3) {
            return [
                {type: 'switch', name: name, point1: startPoint1, point2: name+'|2', point3: name+'|3'},
                {type: 'straight', length: RocoDimensions.L1, startPoint: name+'|2', endPoint: endPoint2},
                {type: 'curve', radius: RocoDimensions.Rsw, length: RocoDimensions.Rsw * RocoDimensions.Asw, clockWise: false, startPoint: name+'|3', endPoint:endPoint3}
            ];
        },
        switchRight1: function (name, startPoint1, endPoint2, endPoint3) {
            return [
                {type: 'switch', name: name, point1: startPoint1, point2: name+'|2', point3: name+'|3'},
                {type: 'straight', length: RocoDimensions.L1, startPoint: name+'|2', endPoint: endPoint2},
                {type: 'curve', radius: RocoDimensions.Rsw, length: RocoDimensions.Rsw * RocoDimensions.Asw, clockWise: true, startPoint: name+'|3', endPoint:endPoint3}
            ];
        },
        switchLeft2: function (name, endPoint1, startPoint2, endPoint3) {
            return [
                {type: 'straight', length: RocoDimensions.L1, endPoint: name+'|2', startPoint: startPoint2},
                {type: 'switch', name: name, point1: endPoint1, point2: name+'|2', point3: name+'|3'},
                {type: 'curve', radius: RocoDimensions.Rsw, length: RocoDimensions.Rsw * RocoDimensions.Asw, clockWise: false, startPoint: name+'|3', endPoint:endPoint3}
            ];
        },
        switchRight2: function (name, endPoint1, startPoint2, endPoint3) {
            return [
                {type: 'straight', length: RocoDimensions.L1, endPoint: name+'|2', startPoint: startPoint2},
                {type: 'switch', name: name, point1: endPoint1, point2: name+'|2', point3: name+'|3'},
                {type: 'curve', radius: RocoDimensions.Rsw, length: RocoDimensions.Rsw * RocoDimensions.Asw, clockWise: true, startPoint: name+'|3', endPoint:endPoint3}
            ];
        },
        switchLeft3: function (name, endPoint1, endPoint2, startPoint3) {
            return [
                {type: 'curve', radius: RocoDimensions.Rsw, length: RocoDimensions.Rsw * RocoDimensions.Asw, clockWise: true, endPoint: name+'|3', startPoint: startPoint3},
                {type: 'switch', name: name, point1: endPoint1, point2: name+'|2', point3: name+'|3'},
                {type: 'straight', length: RocoDimensions.L1, startPoint: name+'|2', endPoint: endPoint2}
            ];
        },
        switchRight3: function (name, endPoint1, endPoint2, startPoint3) {
            return [
                {type: 'curve', radius: RocoDimensions.Rsw, length: RocoDimensions.Rsw * RocoDimensions.Asw, clockWise: false, endPoint: name+'|3', startPoint: startPoint3},
                {type: 'switch', name: name, point1: endPoint1, point2: name+'|2', point3: name+'|3'},
                {type: 'straight', length: RocoDimensions.L1, startPoint: name+'|2', endPoint: endPoint2}
            ];
        },
        counterCurveLeft: function (points) {
            return addPoints({type: 'curve', radius: RocoDimensions.Rsw, length: RocoDimensions.Rsw * RocoDimensions.Asw, clockWise: false}, points);
        },
        counterCurveRight: function (points) {
            return addPoints({type: 'curve', radius: RocoDimensions.Rsw, length: RocoDimensions.Rsw * RocoDimensions.Asw, clockWise: true}, points);
        },
        curveSwitchLeft1: function (name, startPoint1, endPoint2, endPoint3) {
            return [
                {type: 'switch', name: name, point1: startPoint1, point2: name+'|2', point3: name+'|3'},
                {type: 'straight', length: RocoDimensions.L3, startPoint: name+'|2'},
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: false, endPoint:endPoint2},
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: false, startPoint: name+'|3', endPoint:endPoint3}
            ];
        },
        curveSwitchRight1: function (name, startPoint1, endPoint2, endPoint3) {
            return [
                {type: 'switch', name: name, point1: startPoint1, point2: name+'|2', point3: name+'|3'},
                {type: 'straight', length: RocoDimensions.L3, startPoint: name+'|2'},
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: true, endPoint:endPoint2},
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: true, startPoint: name+'|3', endPoint:endPoint3}
            ];
        },
        curveSwitchLeft2: function (name, endPoint1, startPoint2, endPoint3) {
            return [
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: true, startPoint: startPoint2},
                {type: 'straight', length: RocoDimensions.L1, endPoint: name+'|2'},
                {type: 'switch', name: name, point1: endPoint1, point2: name+'|2', point3: name+'|3'},
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: false, startPoint: name+'|3', endPoint:endPoint3}
            ];
        },
        curveSwitchRight2: function (name, endPoint1, startPoint2, endPoint3) {
            return [
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: false, startPoint: startPoint2},
                {type: 'straight', length: RocoDimensions.L1, endPoint: name+'|2'},
                {type: 'switch', name: name, point1: endPoint1, point2: name+'|2', point3: name+'|3'},
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: true, startPoint: name+'|3', endPoint:endPoint3}
            ];
        },
        curveSwitchLeft3: function (name, endPoint1, endPoint2, startPoint3) {
            return [
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: true, endPoint: name+'|3', startPoint: startPoint3},
                {type: 'switch', name: name, point1: endPoint1, point2: name+'|2', point3: name+'|3'},
                {type: 'straight', length: RocoDimensions.L3, startPoint: name+'|2'},
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: false, endPoint:endPoint2}
            ];
        },
        curveSwitchRight3: function (name, endPoint1, endPoint2, startPoint3) {
            return [
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: false, endPoint: name+'|3', startPoint: startPoint3},
                {type: 'switch', name: name, point1: endPoint1, point2: name+'|2', point3: name+'|3'},
                {type: 'straight', length: RocoDimensions.L3, startPoint: name+'|2'},
                {type: 'curve', radius: RocoDimensions.R3, length: RocoDimensions.R3 * RocoDimensions.A, clockWise: true, endPoint:endPoint2}
            ];
        }
    };
})();
