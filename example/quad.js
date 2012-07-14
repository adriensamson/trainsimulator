var QuadDimensions = {
    A0: 0,
    A1: Math.atan(0.5),
    A2: Math.PI / 4,
    A3: Math.atan(2),
    A4: Math.PI / 2,
    ACT: Math.PI/9,
    L1: 15,
    L1A1: 15 / Math.cos(Math.atan(0.5)),
    L1A2: 15 / Math.cos(Math.PI/4),
    SpacingStraight: 3,
    angle: function (a) {
        return this['A'+((a+16) % 4)] + Math.floor(a / 4) * this.A4;
    },
    offsets: {
        '-4': {
            '-3': {x:1, y:-3},
            '-2': {x:1, y:-2},
            '-1': {x:2, y:-2},
            '0' : {x:2, y:-2}
        },
        '-3': {
            '-2': {x:2, y:-3},
            '-1': {x:2, y:-2},
            '0' : {x:2, y:-2},
            '1' : {x:2, y:0}
        },
        '-2': {
            '-1': {x:3, y:-2},
            '0' : {x:2, y:-1},
            '1' : {x:3, y:0},
            '2' : {x:3, y:0}
        },
        '-1': {
            '0': {x:3, y:-1},
            '1': {x:2, y:0},
            '2': {x:3, y:0},
            '3': {x:3, y:0}
        },
        '0': {
            '1': {x:3, y:1},
            '2': {x:2, y:1},
            '3': {x:2, y:2},
            '4': {x:2, y:2}
        },
        '1': {
            '2': {x:3, y:2},
            '3': {x:2, y:2},
            '4': {x:2, y:2}
        },
        '2': {
            '3': {x:2, y:3},
            '4': {x:1, y:2}
        },
        '3': {
            '4' : {x:1, y:3}
        }
    }
};
function rotate(angle, vect) {
    return {
        x: vect.x*Math.cos(angle) - vect.y*Math.sin(angle),
        y: vect.y*Math.sin(angle) + vect.y*Math.cos(angle)
    };
}
var QuadPieces = (function() {
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
            if (points.color != undefined) {
                piece.color = points.color;
            }
        }
        return piece;
    };
    return {
        jointTrack: function (points) {
    		return addPoints({type: 'straight', length: 1e-10}, points);
    	},
        straightA0: function (len, points) {
            return addPoints({type: 'straight', length: QuadDimensions.L1*len}, points);
        },
        straightA1: function (len, points) {
            return addPoints({type: 'straight', length: QuadDimensions.L1A1*len}, points);
        },
        straightA2: function (len, points) {
            return addPoints({type: 'straight', length: QuadDimensions.L1A2*len}, points);
        },
        straight: function (angle, len, points) {
            var l = (angle % 4 == 0) ? QuadDimensions.L1 : (angle % 4 == 2) ? QuadDimensions.L1A2 : QuadDimensions.L1A1;
            return addPoints({type: 'straight', length: l*len}, points);
        },
        straightSpacing: function (angle, len, points) {
            var l = (angle % 4 == 0) ? QuadDimensions.SpacingStraight : (angle % 4 == 2) ? QuadDimensions.SpacingStraight / Math.cos(QuadDimensions.A2) : QuadDimensions.SpacingStraight / Math.cos(QuadDimensions.A1);
            return addPoints({type: 'straight', length: l*len}, points);
        },
        straightUnSpacing: function (angle, len, points) {
            var l0 = (angle % 4 == 0) ? QuadDimensions.L1 : (angle % 4 == 2) ? QuadDimensions.L1A2 : QuadDimensions.L1A1;
            var l = (angle % 4 == 0) ? QuadDimensions.SpacingStraight : (angle % 4 == 2) ? QuadDimensions.SpacingStraight / Math.cos(QuadDimensions.A2) : QuadDimensions.SpacingStraight / Math.cos(QuadDimensions.A1);
            return addPoints({type: 'straight', length: l0 - l*len}, points);
        },
        curveSpacing: function (from, to, points) {
            var offsetAngle = QuadDimensions.angle(to) - QuadDimensions.angle(from);
            return addPoints({type: 'straight', length: QuadDimensions.SpacingStraight * Math.abs(Math.tan(offsetAngle / 2))}, points);
        },
        curveUnSpacing: function (from, to, points) {
            var offsetAngle = QuadDimensions.angle(to) - QuadDimensions.angle(from);
            var l = (from % 4 == 0) ? QuadDimensions.L1 : (from % 4 == 2) ? QuadDimensions.L1A2 : QuadDimensions.L1A1;
            return addPoints({type: 'straight', length: l - QuadDimensions.SpacingStraight * Math.abs(Math.tan(offsetAngle / 2))}, points);
        },
        curve: function(from, to, points) {
            var realFrom = from, realTo = to;
            while (realFrom > 4 || realTo > 4) {
                realFrom -= 4;
                realTo -= 4;
                realFrom = (realFrom < -4) ? realFrom + 16 : realFrom;
                realTo = (realTo < -4) ? realTo + 16 : realTo;
                if (Math.abs(realTo - realFrom) > 4 && Math.abs(realTo - realFrom) < 12) {
                    console.warn('impossible curve');
                    return [];
                }
            }   
            var offset = QuadDimensions.offsets[Math.min(realFrom, realTo)][Math.max(realFrom, realTo)];
            var angleFrom = QuadDimensions.angle(realFrom);
            return addPoints({type: 'quadratic',
                offsetX: QuadDimensions.L1*offset.x*Math.cos(-angleFrom) - QuadDimensions.L1*offset.y*Math.sin(-angleFrom),
                offsetY: QuadDimensions.L1*offset.x*Math.sin(-angleFrom) + QuadDimensions.L1*offset.y*Math.cos(-angleFrom),
                offsetAngle: QuadDimensions.angle(to) - QuadDimensions.angle(from)
            }, points);
        },
        curveA0A1: function (points) {
            return addPoints({type: 'quadratic', offsetX:QuadDimensions.L1*3, offsetY:QuadDimensions.L1, offsetAngle:QuadDimensions.A1}, points);
        },
        curveA1A0: function (points) {
            return addPoints({type: 'quadratic',
                offsetX:QuadDimensions.L1*3*Math.cos(-QuadDimensions.A1) - QuadDimensions.L1*Math.sin(-QuadDimensions.A1),
                offsetY:QuadDimensions.L1*3*Math.sin(-QuadDimensions.A1) + QuadDimensions.L1*Math.cos(-QuadDimensions.A1),
                offsetAngle:-QuadDimensions.A1
            }, points);
        },
        curveA0A2: function (points) {
            return addPoints({type: 'quadratic', offsetX:QuadDimensions.L1*2, offsetY:QuadDimensions.L1, offsetAngle:QuadDimensions.A2}, points);
        },
        curveA2A0: function (points) {
            return addPoints({type: 'quadratic',
                offsetX:QuadDimensions.L1*2*Math.cos(-QuadDimensions.A2) - QuadDimensions.L1*Math.sin(-QuadDimensions.A2),
                offsetY:QuadDimensions.L1*2*Math.sin(-QuadDimensions.A2) + QuadDimensions.L1*Math.cos(-QuadDimensions.A2),
                offsetAngle:-QuadDimensions.A2
            }, points);
        },
        curveA0A3: function (points) {
            return addPoints({type: 'quadratic', offsetX:QuadDimensions.L1*2, offsetY:QuadDimensions.L1*2, offsetAngle:QuadDimensions.A3}, points);
        },
        curveA3A0: function (points) {
            return addPoints({type: 'quadratic',
                offsetX:QuadDimensions.L1*2*Math.cos(-QuadDimensions.A3) - QuadDimensions.L1*2*Math.sin(-QuadDimensions.A3),
                offsetY:QuadDimensions.L1*2*Math.sin(-QuadDimensions.A3) + QuadDimensions.L1*2*Math.cos(-QuadDimensions.A3),
                offsetAngle:-QuadDimensions.A3
            }, points);
        },
        curveA0A4: function (points) {
            return addPoints({type: 'quadratic', offsetX:QuadDimensions.L1*2, offsetY:QuadDimensions.L1*2, offsetAngle:QuadDimensions.A4}, points);
        },
        curveA4A0: function (points) {
            return addPoints({type: 'quadratic',
                offsetX:QuadDimensions.L1*2,
                offsetY:-QuadDimensions.L1*2,
                offsetAngle:-QuadDimensions.A4
            }, points);
        },
        changeTrackA0N: function (points) {
            return addPoints({type: 'quadratic',
                offsetX: QuadDimensions.L1,
                offsetY: -.5*QuadDimensions.SpacingStraight,
                offsetAngle: -QuadDimensions.ACT
            }, points);
        },
        changeTrackA0P: function (points) {
            return addPoints({type: 'quadratic',
                offsetX: QuadDimensions.L1,
                offsetY: .5*QuadDimensions.SpacingStraight,
                offsetAngle: QuadDimensions.ACT
            }, points);
        },
        changeTrackA0Ncc: function (points) {
            return addPoints({type: 'quadratic',
                offsetX: QuadDimensions.L1*Math.cos(QuadDimensions.ACT) + .5*QuadDimensions.SpacingStraight*Math.sin(QuadDimensions.ACT),
                offsetY: QuadDimensions.L1*Math.sin(QuadDimensions.ACT) - .5*QuadDimensions.SpacingStraight*Math.cos(QuadDimensions.ACT),
                offsetAngle: QuadDimensions.ACT
            }, points);
        },
        changeTrackA0Pcc: function (points) {
            return addPoints({type: 'quadratic',
                offsetX: QuadDimensions.L1*Math.cos(-QuadDimensions.ACT) - .5*QuadDimensions.SpacingStraight*Math.sin(-QuadDimensions.ACT),
                offsetY: QuadDimensions.L1*Math.sin(-QuadDimensions.ACT) + .5*QuadDimensions.SpacingStraight*Math.cos(-QuadDimensions.ACT),
                offsetAngle: -QuadDimensions.ACT
            }, points);
        },
        changeTrackA1N: function (points) {
            return addPoints({type: 'quadratic',
                offsetX: QuadDimensions.L1A1,
                offsetY: -.5*QuadDimensions.SpacingStraight,
                offsetAngle: -QuadDimensions.ACT
            }, points);
        },
        changeTrackA1P: function (points) {
            return addPoints({type: 'quadratic',
                offsetX: QuadDimensions.L1A1,
                offsetY: .5*QuadDimensions.SpacingStraight,
                offsetAngle: QuadDimensions.ACT
            }, points);
        },
        changeTrackA1Ncc: function (points) {
            return addPoints({type: 'quadratic',
                offsetX: QuadDimensions.L1A1*Math.cos(QuadDimensions.ACT) + .5*QuadDimensions.SpacingStraight*Math.sin(QuadDimensions.ACT),
                offsetY: QuadDimensions.L1A1*Math.sin(QuadDimensions.ACT) - .5*QuadDimensions.SpacingStraight*Math.cos(QuadDimensions.ACT),
                offsetAngle: QuadDimensions.ACT
            }, points);
        },
        changeTrackA1Pcc: function (points) {
            return addPoints({type: 'quadratic',
                offsetX: QuadDimensions.L1A1*Math.cos(-QuadDimensions.ACT) - .5*QuadDimensions.SpacingStraight*Math.sin(-QuadDimensions.ACT),
                offsetY: QuadDimensions.L1A1*Math.sin(-QuadDimensions.ACT) + .5*QuadDimensions.SpacingStraight*Math.cos(-QuadDimensions.ACT),
                offsetAngle: -QuadDimensions.ACT
            }, points);
        },
        changeTrackA2N: function (points) {
            return addPoints({type: 'quadratic',
                offsetX: QuadDimensions.L1A2,
                offsetY: -.5*QuadDimensions.SpacingStraight,
                offsetAngle: -QuadDimensions.ACT
            }, points);
        },
        changeTrackA2P: function (points) {
            return addPoints({type: 'quadratic',
                offsetX: QuadDimensions.L1A2,
                offsetY: .5*QuadDimensions.SpacingStraight,
                offsetAngle: QuadDimensions.ACT
            }, points);
        },
        changeTrackA2Ncc: function (points) {
            return addPoints({type: 'quadratic',
                offsetX: QuadDimensions.L1A2*Math.cos(QuadDimensions.ACT) + .5*QuadDimensions.SpacingStraight*Math.sin(QuadDimensions.ACT),
                offsetY: QuadDimensions.L1A2*Math.sin(QuadDimensions.ACT) - .5*QuadDimensions.SpacingStraight*Math.cos(QuadDimensions.ACT),
                offsetAngle: QuadDimensions.ACT
            }, points);
        },
        changeTrackA2Pcc: function (points) {
            return addPoints({type: 'quadratic',
                offsetX: QuadDimensions.L1A2*Math.cos(-QuadDimensions.ACT) - .5*QuadDimensions.SpacingStraight*Math.sin(-QuadDimensions.ACT),
                offsetY: QuadDimensions.L1A2*Math.sin(-QuadDimensions.ACT) + .5*QuadDimensions.SpacingStraight*Math.cos(-QuadDimensions.ACT),
                offsetAngle: -QuadDimensions.ACT
            }, points);
        },
        sw: function (name) {
            return {type: 'switch', name: name, point0: name+'|0', point1: name+'|1', point2: name+'|2'};
        }
    };
})();
