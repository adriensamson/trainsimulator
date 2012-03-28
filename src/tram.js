var TramDimensions = {
    SpacingStraight: 3,
    L1: 15,
    R: 30,// 36.21320343559643, // L1 / tan(A)
    Rsw: 19.5, // (L1^2 + sp^2) / (4 * sp)
    Asw: 0.39479111969976155, // arcsin (L1 / (2 * Rsw))
    A: Math.PI / 8
};

var TramPieces = (function() {
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
    	jointTrack: function (points) {
    		return addPoints({type: 'straight', length: 1e-10}, points);
    	},
        straightL1: function (points) {
            return addPoints({type: 'straight', length: TramDimensions.L1}, points);
        },
        straightL2: function (points) {
            return addPoints({type: 'straight', length: TramDimensions.L1 * 2}, points);
        },
        straightL4: function (points) {
            return addPoints({type: 'straight', length: TramDimensions.L1 * 4}, points);
        },
        straightL6: function (points) {
            return addPoints({type: 'straight', length: TramDimensions.L1 * 6}, points);
        },
        straightL10: function (points) {
            return addPoints({type: 'straight', length: TramDimensions.L1 * 10}, points);
        },
        straightL25: function (points) {
            return addPoints({type: 'straight', length: TramDimensions.L1 * 25}, points);
        },
        station: function (points) {
            return addPoints({type: 'straight', length: TramDimensions.L1 * 3, color:{r:0, g:255, b:0}}, points);
        },
        /* 4 curve elements */
        straightSpacing: function (points) {
        	return addPoints({type: 'straight', length: TramDimensions.SpacingStraight}, points);
        },
        /* 3 curve elements */
        straightSpacing3: function (points) {
        	return addPoints({type: 'straight', length: TramDimensions.SpacingStraight * Math.tan(3 * Math.PI / 16)}, points);
        },
        /* 2 curve elements */
        straightSpacing4: function (points) {
        	return addPoints({type: 'straight', length: TramDimensions.SpacingStraight * Math.tan(Math.PI / 8)}, points);
        },
        /* 1 curve element */
        straightSpacing8: function (points) {
        	return addPoints({type: 'straight', length: TramDimensions.SpacingStraight * Math.tan(Math.PI / 16)}, points);
        },
        /* 4 curve elements */
        straightUnSpacing: function (points) {
            return addPoints({type: 'straight', length: TramDimensions.L1 - TramDimensions.SpacingStraight}, points);
        },
        /* 3 curve elements */
        straightUnSpacing3: function (points) {
            return addPoints({type: 'straight', length: TramDimensions.L1 - TramDimensions.SpacingStraight * Math.tan(3 * Math.PI / 16)}, points);
        },
        /* 2 curve elements */
        straightUnSpacing4: function (points) {
            return addPoints({type: 'straight', length: TramDimensions.L1 - TramDimensions.SpacingStraight * Math.tan(Math.PI / 8)}, points);
        },
        /* 1 curve element */
        straightUnSpacing8: function (points) {
            return addPoints({type: 'straight', length: TramDimensions.L1 - TramDimensions.SpacingStraight * Math.tan(Math.PI / 16)}, points);
        },
        curveLeft: function (points) {
            return addPoints({type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: false}, points);
        },
        curveRight: function (points) {
            return addPoints({type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: true}, points);
        },
        switchLeft0: function (name, startPoint0, endPoint1, endPoint2) {
            return [
                {type: 'switch', name: name, point0: startPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'straight', length: TramDimensions.L1, startPoint: name+'|1', endPoint: endPoint1},
                {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: false, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        switchRight0: function (name, startPoint0, endPoint1, endPoint2) {
            return [
                {type: 'switch', name: name, point0: startPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'straight', length: TramDimensions.L1, startPoint: name+'|1', endPoint: endPoint1},
                {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        switchSym0: function (name, startPoint0, endPoint1, endPoint2) {
            return [
                {type: 'switch', name: name, point0: startPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: false, startPoint: name+'|1', endPoint: endPoint1},
                {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        switchLeft1: function (name, endPoint0, startPoint1, endPoint2) {
            return [
                {type: 'straight', length: TramDimensions.L1, endPoint: name+'|1', startPoint: startPoint1},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: false, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        switchRight1: function (name, endPoint0, startPoint1, endPoint2) {
            return [
                {type: 'straight', length: TramDimensions.L1, endPoint: name+'|1', startPoint: startPoint1},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        switchSym1: function (name, endPoint0, startPoint1, endPoint2) {
            return [
                {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: true, endPoint: name+'|1', startPoint: startPoint1},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        switchLeft2: function (name, endPoint0, endPoint1, startPoint2) {
            return [
                {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: true, endPoint: name+'|2', startPoint: startPoint2},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'straight', length: TramDimensions.L1, startPoint: name+'|1', endPoint: endPoint1}
            ];
        },
        switchRight2: function (name, endPoint0, endPoint1, startPoint2) {
            return [
                {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: false, endPoint: name+'|2', startPoint: startPoint2},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'straight', length: TramDimensions.L1, startPoint: name+'|1', endPoint: endPoint1}
            ];
        },
        switchSym2: function (name, endPoint0, endPoint1, startPoint2) {
            return [
                {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: false, endPoint: name+'|2', startPoint: startPoint2},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: false, startPoint: name+'|1', endPoint: endPoint1}
            ];
        },
        switchLeft0c: function (name, startPoint0, endPoint1, endPoint2) {
            return [
                {type: 'switch', name: name, point0: startPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'straight', length: TramDimensions.L1, startPoint: name+'|1', endPoint: endPoint1},
                {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: false, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        switchRight0c: function (name, startPoint0, endPoint1, endPoint2) {
            return [
                {type: 'switch', name: name, point0: startPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'straight', length: TramDimensions.L1, startPoint: name+'|1', endPoint: endPoint1},
                {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        switchSym0c: function (name, startPoint0, endPoint1, endPoint2) {
            return [
                {type: 'switch', name: name, point0: startPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: false, startPoint: name+'|1', endPoint: endPoint1},
                {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        switchLeft1c: function (name, endPoint0, startPoint1, endPoint2) {
            return [
                {type: 'straight', length: TramDimensions.L1, endPoint: name+'|1', startPoint: startPoint1},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: false, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        switchRight1c: function (name, endPoint0, startPoint1, endPoint2) {
            return [
                {type: 'straight', length: TramDimensions.L1, endPoint: name+'|1', startPoint: startPoint1},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        switchSym1c: function (name, endPoint0, startPoint1, endPoint2) {
            return [
                {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: true, endPoint: name+'|1', startPoint: startPoint1},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
            ];
        },
        switchLeft2c: function (name, endPoint0, endPoint1, startPoint2) {
            return [
                {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: true, endPoint: name+'|2', startPoint: startPoint2},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'straight', length: TramDimensions.L1, startPoint: name+'|1', endPoint: endPoint1}
            ];
        },
        switchRight2c: function (name, endPoint0, endPoint1, startPoint2) {
            return [
                {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: false, endPoint: name+'|2', startPoint: startPoint2},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'straight', length: TramDimensions.L1, startPoint: name+'|1', endPoint: endPoint1}
            ];
        },
        switchSym2c: function (name, endPoint0, endPoint1, startPoint2) {
            return [
                {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: false, endPoint: name+'|2', startPoint: startPoint2},
                {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
                {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: false, startPoint: name+'|1', endPoint: endPoint1}
            ];
        },
        counterCurveLeft: function (points) {
            return addPoints({type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: false}, points);
        },
        counterCurveRight: function (points) {
            return addPoints({type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: true}, points);
        }
    };
})();
