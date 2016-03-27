export var TramDimensions = {
    SpacingStraight: 3,
    L1: 15,
    R: 30,// 36.21320343559643, // L1 / tan(A)
    Rsw: 19.5, // (L1^2 + sp^2) / (4 * sp)
    Asw: 0.39479111969976155, // arcsin (L1 / (2 * Rsw))
    A: Math.PI / 8
};

var addPoints = function(piece, points?) {
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

export function jointTrack(points?) {
    return addPoints({type: 'straight', length: 1e-10}, points);
}
export function straightL1(points?) {
    return addPoints({type: 'straight', length: TramDimensions.L1}, points);
}
export function straightL2(points?) {
    return addPoints({type: 'straight', length: TramDimensions.L1 * 2}, points);
}
export function straightL4(points?) {
    return addPoints({type: 'straight', length: TramDimensions.L1 * 4}, points);
}
export function straightL6(points?) {
    return addPoints({type: 'straight', length: TramDimensions.L1 * 6}, points);
}
export function straightL10(points?) {
    return addPoints({type: 'straight', length: TramDimensions.L1 * 10}, points);
}
export function straightL25(points?) {
    return addPoints({type: 'straight', length: TramDimensions.L1 * 25}, points);
}
export function station(points?) {
    return addPoints({type: 'straight', length: TramDimensions.L1 * 3, color:{r:0, g:255, b:0}}, points);
}
/* 4 curve elements */
export function straightSpacing(points?) {
    return addPoints({type: 'straight', length: TramDimensions.SpacingStraight}, points);
}
/* 3 curve elements */
export function straightSpacing3(points?) {
    return addPoints({type: 'straight', length: TramDimensions.SpacingStraight * Math.tan(3 * Math.PI / 16)}, points);
}
/* 2 curve elements */
export function straightSpacing4(points?) {
    return addPoints({type: 'straight', length: TramDimensions.SpacingStraight * Math.tan(Math.PI / 8)}, points);
}
/* 1 curve element */
export function straightSpacing8(points?) {
    return addPoints({type: 'straight', length: TramDimensions.SpacingStraight * Math.tan(Math.PI / 16)}, points);
}
/* 4 curve elements */
export function straightUnSpacing(points?) {
    return addPoints({type: 'straight', length: TramDimensions.L1 - TramDimensions.SpacingStraight}, points);
}
/* 3 curve elements */
export function straightUnSpacing3(points?) {
    return addPoints({type: 'straight', length: TramDimensions.L1 - TramDimensions.SpacingStraight * Math.tan(3 * Math.PI / 16)}, points);
}
/* 2 curve elements */
export function straightUnSpacing4(points?) {
    return addPoints({type: 'straight', length: TramDimensions.L1 - TramDimensions.SpacingStraight * Math.tan(Math.PI / 8)}, points);
}
/* 1 curve element */
export function straightUnSpacing8(points?) {
    return addPoints({type: 'straight', length: TramDimensions.L1 - TramDimensions.SpacingStraight * Math.tan(Math.PI / 16)}, points);
}
export function curveLeft(points?) {
    return addPoints({type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: false}, points);
}
export function curveRight(points?) {
    return addPoints({type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: true}, points);
}
export function switchLeft0(name, startPoint0, endPoint1, endPoint2) {
    return [
        {type: 'switch', name: name, point0: startPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'straight', length: TramDimensions.L1, startPoint: name+'|1', endPoint: endPoint1},
        {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: false, startPoint: name+'|2', endPoint:endPoint2}
    ];
}
export function switchRight0(name, startPoint0, endPoint1, endPoint2) {
    return [
        {type: 'switch', name: name, point0: startPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'straight', length: TramDimensions.L1, startPoint: name+'|1', endPoint: endPoint1},
        {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
    ];
}
export function switchSym0(name, startPoint0, endPoint1, endPoint2) {
    return [
        {type: 'switch', name: name, point0: startPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: false, startPoint: name+'|1', endPoint: endPoint1},
        {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
    ];
}
export function switchLeft1(name, endPoint0, startPoint1, endPoint2) {
    return [
        {type: 'straight', length: TramDimensions.L1, endPoint: name+'|1', startPoint: startPoint1},
        {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: false, startPoint: name+'|2', endPoint:endPoint2}
    ];
}
export function switchRight1(name, endPoint0, startPoint1, endPoint2) {
    return [
        {type: 'straight', length: TramDimensions.L1, endPoint: name+'|1', startPoint: startPoint1},
        {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
    ];
}
export function switchSym1(name, endPoint0, startPoint1, endPoint2) {
    return [
        {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: true, endPoint: name+'|1', startPoint: startPoint1},
        {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
    ];
}
export function switchLeft2(name, endPoint0, endPoint1, startPoint2) {
    return [
        {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: true, endPoint: name+'|2', startPoint: startPoint2},
        {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'straight', length: TramDimensions.L1, startPoint: name+'|1', endPoint: endPoint1}
    ];
}
export function switchRight2(name, endPoint0, endPoint1, startPoint2) {
    return [
        {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: false, endPoint: name+'|2', startPoint: startPoint2},
        {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'straight', length: TramDimensions.L1, startPoint: name+'|1', endPoint: endPoint1}
    ];
}
export function switchSym2(name, endPoint0, endPoint1, startPoint2) {
    return [
        {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: false, endPoint: name+'|2', startPoint: startPoint2},
        {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: false, startPoint: name+'|1', endPoint: endPoint1}
    ];
}
export function switchLeft0c(name, startPoint0, endPoint1, endPoint2) {
    return [
        {type: 'switch', name: name, point0: startPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'straight', length: TramDimensions.L1, startPoint: name+'|1', endPoint: endPoint1},
        {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: false, startPoint: name+'|2', endPoint:endPoint2}
    ];
}
export function switchRight0c(name, startPoint0, endPoint1, endPoint2) {
    return [
        {type: 'switch', name: name, point0: startPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'straight', length: TramDimensions.L1, startPoint: name+'|1', endPoint: endPoint1},
        {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
    ];
}
export function switchSym0c(name, startPoint0, endPoint1, endPoint2) {
    return [
        {type: 'switch', name: name, point0: startPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: false, startPoint: name+'|1', endPoint: endPoint1},
        {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
    ];
}
export function switchLeft1c(name, endPoint0, startPoint1, endPoint2) {
    return [
        {type: 'straight', length: TramDimensions.L1, endPoint: name+'|1', startPoint: startPoint1},
        {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: false, startPoint: name+'|2', endPoint:endPoint2}
    ];
}
export function switchRight1c(name, endPoint0, startPoint1, endPoint2) {
    return [
        {type: 'straight', length: TramDimensions.L1, endPoint: name+'|1', startPoint: startPoint1},
        {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
    ];
}
export function switchSym1c(name, endPoint0, startPoint1, endPoint2) {
    return [
        {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: true, endPoint: name+'|1', startPoint: startPoint1},
        {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: true, startPoint: name+'|2', endPoint:endPoint2}
    ];
}
export function switchLeft2c(name, endPoint0, endPoint1, startPoint2) {
    return [
        {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: true, endPoint: name+'|2', startPoint: startPoint2},
        {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'straight', length: TramDimensions.L1, startPoint: name+'|1', endPoint: endPoint1}
    ];
}
export function switchRight2c(name, endPoint0, endPoint1, startPoint2) {
    return [
        {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: false, endPoint: name+'|2', startPoint: startPoint2},
        {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'straight', length: TramDimensions.L1, startPoint: name+'|1', endPoint: endPoint1}
    ];
}
export function switchSym2c(name, endPoint0, endPoint1, startPoint2) {
    return [
        {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: false, endPoint: name+'|2', startPoint: startPoint2},
        {type: 'switch', name: name, point0: endPoint0, point1: name+'|1', point2: name+'|2'},
        {type: 'curve', radius: TramDimensions.R, length: TramDimensions.R * TramDimensions.A, clockWise: false, startPoint: name+'|1', endPoint: endPoint1}
    ];
}
export function counterCurveLeft(points?) {
    return addPoints({type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: false}, points);
}
export function counterCurveRight(points?) {
    return addPoints({type: 'curve', radius: TramDimensions.Rsw, length: TramDimensions.Rsw * TramDimensions.Asw, clockWise: true}, points);
}
