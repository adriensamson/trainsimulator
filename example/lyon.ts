import * as TramPieces from '../src/tram';
import {Builder} from "../src/builder";
import {CanvasDrawer} from "../src/canvas-drawer";
import {TrainSimulator} from "../src/trainsimulator";
import {Controller, SwitchGroupController} from "../src/controller";
import {Ticker} from "../src/ticker";
import {Element} from "../src/element";
import {AutomaticTrain} from "../src/automatic-train";

var originAngle = Math.PI / 8;
var schema = {
    points: {
        origin1: {x: 0, y: 0, angle: originAngle},
        origin2: {
            x: -TramPieces.TramDimensions.SpacingStraight * Math.sin(originAngle),
            y: TramPieces.TramDimensions.SpacingStraight * Math.cos(originAngle),
            angle: originAngle
        },
    },
    pieces: [].concat(
        /* Pont Gallieni -> rive gauche */
        TramPieces.straightL1({startPoint: 'origin1', endPoint: 'sw-gallieni-1.0'}),
        TramPieces.switchLeft0c('sw-gallieni-1', 'sw-gallieni-1.0', 'sw-gallieni-1.1', 'sw-gallieni-1.2'),

        TramPieces.straightL1({startPoint: 'origin2'}),
        TramPieces.straightSpacing({endPoint: 'sw-gallieni-2.0'}),
        TramPieces.switchLeft0c('sw-gallieni-2', 'sw-gallieni-2.0', 'sw-gallieni-2.1', 'sw-gallieni-2.2'),

        /* T1 */
        TramPieces.curveLeft({startPoint: 'sw-gallieni-1.2'}),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.straightL6({endPoint: 'sw-bernard-1.0'}),

        TramPieces.curveLeft({startPoint: 'sw-gallieni-2.2'}),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.straightSpacing(),
        TramPieces.straightL6({endPoint: 'sw-bernard-2.1'}),

        TramPieces.switchRight0('sw-bernard-1', 'sw-bernard-1.0', 'sw-bernard-1.1', 'sw-bernard-1.2'),
        TramPieces.switchRight2('sw-bernard-2', 'sw-bernard-2.0', 'sw-bernard-2.1', 'sw-bernard-1.2'),

        TramPieces.straightL4({startPoint: 'sw-bernard-1.1'}),
        TramPieces.station({name: 'st-bernard-1'}),
        TramPieces.straightL10(),
        TramPieces.straightL4(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.straightL6(),
        TramPieces.station({name: 'st-universite-1'}),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.straightL10(),
        TramPieces.straightL2(),
        TramPieces.station({name: 'st-st-andre-1'}),
        TramPieces.straightL10(),
        TramPieces.straightL4(),
        TramPieces.station({name: 'st-guillotiere-1'}),
        TramPieces.curveLeft(),
        TramPieces.straightL10(),
        TramPieces.straightL6(),
        TramPieces.station({name: 'st-liberte-1', endPoint: 'sw-liberte-1.0'}),

        TramPieces.straightL4({startPoint: 'sw-bernard-2.0'}),
        TramPieces.station({name: 'st-bernard-2'}),
        TramPieces.straightL10(),
        TramPieces.straightL2(),
        TramPieces.straightL1(),
        TramPieces.straightUnSpacing(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.straightUnSpacing(),
        TramPieces.straightL1(),
        TramPieces.straightL4(),
        TramPieces.station({name: 'st-universite-2'}),
        TramPieces.straightSpacing(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.straightSpacing(),
        TramPieces.straightL10(),
        TramPieces.straightL2(),
        TramPieces.station({name: 'st-st-andre-2'}),
        TramPieces.straightL10(),
        TramPieces.straightL4(),
        TramPieces.station({name: 'st-guillotiere-2'}),
        TramPieces.straightSpacing8(),
        TramPieces.curveLeft(),
        TramPieces.straightSpacing8(),
        TramPieces.straightL10(),
        TramPieces.straightL6(),
        TramPieces.station({name: 'st-liberte-2', endPoint: 'sw-liberte-2.1'}),

        /* T1 Liberté */
        TramPieces.switchRight0('sw-liberte-1', 'sw-liberte-1.0', 'sw-liberte-1.1', 'sw-liberte-1.2'),
        TramPieces.switchRight2('sw-liberte-2', 'sw-liberte-2.0', 'sw-liberte-2.1', 'sw-liberte-1.2'),

        TramPieces.straightL1({startPoint: 'sw-liberte-1.1'}),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.straightL4(),
        TramPieces.straightL4(),
        TramPieces.station({name: 'st-prefecture-1'}),
        TramPieces.straightL10(),
        TramPieces.straightL2(),
        TramPieces.station({name: 'st-palais-justice-1'}),
        TramPieces.straightL10(),
        TramPieces.straightL10(),
        TramPieces.station({name: 'st-servient-1'}),
        TramPieces.straightL10(),
        TramPieces.straightL6(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft({endPoint: 'sw-part-dieu-1.2'}),

        TramPieces.straightUnSpacing({startPoint: 'sw-liberte-2.0'}),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.straightUnSpacing(),
        TramPieces.straightL1(),
        TramPieces.straightL6(),
        TramPieces.station({name: 'st-prefecture-2'}),
        TramPieces.straightL10(),
        TramPieces.straightL2(),
        TramPieces.station({name: 'st-palais-justice-2'}),
        TramPieces.straightL10(),
        TramPieces.straightL10(),
        TramPieces.station({name: 'st-servient-2'}),
        TramPieces.straightL10(),
        TramPieces.straightL6(),
        TramPieces.straightSpacing(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft({endPoint: 'sw-part-dieu-2.2'}),

        /* T1 - Part dieu */
        TramPieces.switchRight2c('sw-part-dieu-1', 'sw-part-dieu-1.0', 'sw-part-dieu-1.1', 'sw-part-dieu-1.2'),
        TramPieces.switchRight2c('sw-part-dieu-2', 'sw-part-dieu-2.0', 'sw-part-dieu-2.1', 'sw-part-dieu-2.2'),

        TramPieces.straightSpacing({startPoint: 'sw-part-dieu-1.1', endPoint: 'sw-part-dieu-arr-1.0'}),

        TramPieces.switchLeft0('sw-part-dieu-arr-1', 'sw-part-dieu-arr-1.0', 'sw-part-dieu-arr-1.1', 'sw-part-dieu-arr-1.2'),
        TramPieces.switchLeft2('sw-part-dieu-arr-2', 'sw-part-dieu-arr-2.0', 'sw-part-dieu-2.1', 'sw-part-dieu-arr-1.2'),

        TramPieces.straightL1({startPoint: 'sw-part-dieu-arr-1.1'}),
        TramPieces.straightL1({name: 'partdieu-1'}),
        TramPieces.jointTrack(),
        TramPieces.straightL1({startPoint: 'sw-part-dieu-arr-2.0'}),
        TramPieces.straightL1({name: 'partdieu-2'}),
        TramPieces.jointTrack(),

        TramPieces.station({name: 'st-part-dieu-1', startPoint: 'sw-part-dieu-1.0'}),
        TramPieces.straightL10(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.straightL10(),
        TramPieces.straightL4(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft({endPoint: 'sw-lafayette-1.2'}),

        TramPieces.straightSpacing({startPoint: 'sw-part-dieu-2.0'}),
        TramPieces.station({name: 'st-part-dieu-2'}),
        TramPieces.straightL6(),
        TramPieces.straightL2(),
        TramPieces.straightL1(),
        TramPieces.straightUnSpacing(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.straightUnSpacing(),
        TramPieces.straightL1(),
        TramPieces.straightL6(),
        TramPieces.straightL6(),
        TramPieces.straightSpacing(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft({endPoint: 'sw-lafayette-2.2'}),

        /* T1 T4 - Lafayette */
        TramPieces.switchRight2c('sw-lafayette-1', 'sw-lafayette-1.0', 'sw-lafayette-1.1', 'sw-lafayette-1.2'),
        TramPieces.switchRight2c('sw-lafayette-2', 'sw-lafayette-2.0', 'sw-lafayette-2.1', 'sw-lafayette-2.2'),

        TramPieces.station({name: 'st-lafayette-1', startPoint: 'sw-lafayette-1.0'}),
        TramPieces.straightL1({endPoint: 'sw-lafayette-arr-1.1'}),

        TramPieces.straightSpacing({startPoint: 'sw-lafayette-2.0'}),
        TramPieces.station({name: 'st-lafayette-2'}),
        TramPieces.straightL1({endPoint: 'sw-lafayette-arr-2.0'}),

        TramPieces.switchLeft0('sw-lafayette-arr-2', 'sw-lafayette-arr-2.0', 'sw-lafayette-arr-2.1', 'sw-lafayette-arr-2.2'),
        TramPieces.switchLeft2('sw-lafayette-arr-1', 'sw-lafayette-arr-1.0', 'sw-lafayette-arr-1.1', 'sw-lafayette-arr-2.2'),

        TramPieces.straightL1({startPoint: 'sw-lafayette-arr-1.0'}),
        TramPieces.straightL2({name: 'lafayette-1'}),
        TramPieces.jointTrack(),

        TramPieces.straightL1({startPoint: 'sw-lafayette-arr-2.1'}),
        TramPieces.straightL2({name: 'lafayette-2'}),
        TramPieces.jointTrack(),

        /* T3 - T4 */
        TramPieces.straightL6({startPoint: 'sw-lafayette-1.1'}),
        TramPieces.straightL2(),
        TramPieces.counterCurveRight(),
        TramPieces.counterCurveLeft(),
        TramPieces.straightL2(),
        TramPieces.straightL2(),
        TramPieces.counterCurveLeft({endPoint: 'sw-vilette-1.2'}),

        TramPieces.straightUnSpacing({startPoint: 'sw-lafayette-2.1'}),
        TramPieces.straightL1(),
        TramPieces.straightL4(),
        TramPieces.straightL6({endPoint: 'sw-vilette-2.1'}),

        TramPieces.switchLeft2('sw-vilette-1', 'sw-vilette-1.0', 'sw-vilette-1.1', 'sw-vilette-1.2'),
        TramPieces.switchLeft1('sw-vilette-2', 'sw-vilette-2.0', 'sw-vilette-2.1', 'sw-vilette-2.2'),
        TramPieces.switchLeft1('sw-vilette-3', 'sw-vilette-3.0', 'sw-vilette-1.1', 'sw-vilette-2.2'),
        TramPieces.straightL1({startPoint: 'sw-vilette-3.0'}),
        TramPieces.straightL1(),
        TramPieces.straightL1({name: 'tiroir-vilette'}),
        TramPieces.jointTrack(),

        TramPieces.straightL10({startPoint: 'sw-vilette-1.0'}),
        TramPieces.straightL1(),
        TramPieces.station({name: 'st-vilette-1'}),
        TramPieces.straightL1({endPoint: 'sw-rx-vilette-1.1'}),

        TramPieces.straightL6({startPoint: 'sw-vilette-2.0'}),
        TramPieces.straightL6(),
        TramPieces.station({name: 'st-vilette-2', endPoint: 'sw-rx-vilette-3.1'}),

        TramPieces.switchRight1('sw-rx-vilette-1', 'sw-rx-vilette-1.0', 'sw-rx-vilette-1.1', 'sw-rx-vilette-1.2'),
        TramPieces.switchRight2('sw-rx-vilette-2', 'sw-rx-vilette-2.0', 'sw-rx-vilette-2.1', 'sw-rx-vilette-1.2'),
        TramPieces.jointTrack({startPoint: 'sw-rx-vilette-2.0', endPoint: 'sw-rx-vilette-3.0'}),
        TramPieces.switchRight1('sw-rx-vilette-3', 'sw-rx-vilette-3.0', 'sw-rx-vilette-3.1', 'sw-rx-vilette-3.2'),

        TramPieces.counterCurveLeft({startPoint: 'sw-rx-vilette-3.2'}),
        TramPieces.station({name: 'st-vilette-rx'}),
        TramPieces.straightL1({name: 'vilette-rx'}),
        TramPieces.jointTrack(),

        TramPieces.straightL10({startPoint: 'sw-rx-vilette-1.0'}),
        TramPieces.straightL6({endPoint: 'sw-T3T4-2.0'}),

        TramPieces.straightL10({startPoint: 'sw-rx-vilette-2.1'}),
        TramPieces.straightL4(),
        TramPieces.straightL1(),
        TramPieces.straightUnSpacing({endPoint: 'sw-T3T4-1.0'}),

        TramPieces.switchLeft0c('sw-T3T4-1', 'sw-T3T4-1.0', 'sw-T3T4-1.1', 'sw-T3T4-1.2'),
        TramPieces.switchLeft0c('sw-T3T4-2', 'sw-T3T4-2.0', 'sw-T3T4-2.1', 'sw-T3T4-2.2'),

        TramPieces.curveLeft({startPoint: 'sw-T3T4-1.2'}),
        TramPieces.curveLeft({name: 'T3-1'}),
        TramPieces.jointTrack(),
        TramPieces.curveLeft({startPoint: 'sw-T3T4-2.2'}),
        TramPieces.curveLeft({name: 'T3-2'}),
        TramPieces.jointTrack(),

        TramPieces.straightSpacing({startPoint: 'sw-T3T4-1.1'}),
        TramPieces.straightL1(),
        TramPieces.jointTrack({endPoint: 'joint-T4-1'}),
        TramPieces.straightL1({startPoint: 'sw-T3T4-2.1'}),
        TramPieces.jointTrack({endPoint: 'joint-T4-2'}),


        /* T2 */
        TramPieces.straightSpacing({startPoint: 'sw-gallieni-1.1'}),
        TramPieces.straightL6(),
        TramPieces.straightL2(),
        TramPieces.straightL1({endPoint: 'sw-berthelot-1.0'}),

        TramPieces.straightL6({startPoint: 'sw-gallieni-2.1'}),
        TramPieces.straightL2(),
        TramPieces.straightL1({endPoint: 'sw-berthelot-2.1'}),

        /* Berthelot */
        TramPieces.switchRight0('sw-berthelot-1', 'sw-berthelot-1.0', 'sw-berthelot-1.1', 'sw-berthelot-1.2'),
        TramPieces.switchRight2('sw-berthelot-2', 'sw-berthelot-2.0', 'sw-berthelot-2.1', 'sw-berthelot-1.2'),
        TramPieces.straightL2({startPoint: 'sw-berthelot-1.1'}),
        TramPieces.station({name: 'st-berthelot-1'}),
        TramPieces.straightL25(),
        TramPieces.straightL1(),
        TramPieces.station({name: 'st-jean-mace-1'}),
        TramPieces.straightL10(),
        TramPieces.straightL10(),
        TramPieces.station({name: 'st-garibaldi-1'}),
        TramPieces.straightL10(),
        TramPieces.straightL10(),
        TramPieces.straightL2(),
        TramPieces.station({name: 'st-vienne-1'}),
        TramPieces.straightL25(),
        TramPieces.straightL10(),
        TramPieces.station({name: 'st-mendes-T2-1'}),
        TramPieces.straightL4({endPoint: 'sw-T2-T4.1'}),

        TramPieces.straightL2({startPoint: 'sw-berthelot-2.0'}),
        TramPieces.station({name: 'st-berthelot-2'}),
        TramPieces.straightL25(),
        TramPieces.straightL1(),
        TramPieces.station({name: 'st-jean-mace-2'}),
        TramPieces.straightL10(),
        TramPieces.straightL10(),
        TramPieces.station({name: 'st-garibaldi-2'}),
        TramPieces.straightL10(),
        TramPieces.straightL10(),
        TramPieces.straightL2(),
        TramPieces.station({name: 'st-vienne-2'}),
        TramPieces.straightL25(),
        TramPieces.straightL10(),
        TramPieces.station({name: 'st-mendes-T2-2'}),
        TramPieces.straightL4(),
        TramPieces.straightL1({endPoint: 'sw-villon-2.1'}),

        /* T2 x T4 */

        TramPieces.switchRight1c('sw-T2-T4', 'sw-T2-T4.0', 'sw-T2-T4.1', 'sw-T2-T4.2'),
        TramPieces.jointTrack({startPoint: 'sw-T2-T4.0', endPoint: 'sw-villon-1.0'}),

        TramPieces.jointTrack({startPoint: 'sw-T2-T4.2', endPoint: 'sw-T4-T2.2'}),
        TramPieces.switchLeft2c('sw-T4-T2', 'sw-T4-T2.0', 'sw-T4-T2.1', 'sw-T4-T2.2'),

        TramPieces.station({name: 'st-mendes-T4-1', startPoint: 'sw-T4-T2.0', endPoint: 'sw-mendes-1.0'}),

        TramPieces.switchLeft0('sw-mendes-1', 'sw-mendes-1.0', 'sw-mendes-1.1', 'sw-mendes-1.2'),
        TramPieces.switchLeft2('sw-mendes-2', 'sw-mendes-2.0', 'sw-mendes-2.1', 'sw-mendes-1.2'),

        /* T4 - Nord */
        TramPieces.straightL4({startPoint: 'sw-mendes-1.1'}),
        TramPieces.straightL1(),
        TramPieces.straightUnSpacing8(),
        TramPieces.curveRight(),
        TramPieces.straightUnSpacing8(),
        TramPieces.straightL10(),
        TramPieces.straightL10(),
        TramPieces.straightL10(),
        TramPieces.straightL10(),
        TramPieces.straightL4(),
        TramPieces.straightL4(),
        TramPieces.straightUnSpacing8(),
        TramPieces.curveRight(),
        TramPieces.straightUnSpacing8(),
        TramPieces.straightL10(),
        TramPieces.straightL10(),
        TramPieces.straightL2(),
        TramPieces.straightSpacing8(),
        TramPieces.curveLeft(),
        TramPieces.straightSpacing8(),
        TramPieces.straightL10(),
        TramPieces.straightL10(),
        TramPieces.straightL2(),
        TramPieces.jointTrack({endPoint: 'joint-T4-1'}),

        TramPieces.straightL6({startPoint: 'sw-mendes-2.0'}),
        TramPieces.curveRight(),
        TramPieces.straightL25(),
        TramPieces.straightL25(),
        TramPieces.curveRight(),
        TramPieces.straightL10(),
        TramPieces.straightL6(),
        TramPieces.straightL6(),
        TramPieces.straightL1(),
        TramPieces.curveLeft(),
        TramPieces.straightL10(),
        TramPieces.straightL10(),
        TramPieces.straightL2(),
        TramPieces.jointTrack({endPoint: 'joint-T4-2'}),

        /* T4 - Sud */
        TramPieces.station({name: 'st-mendes-T4-2', startPoint: 'sw-mendes-2.1'}),
        TramPieces.straightL1(),
        TramPieces.straightL1(),
        TramPieces.straightL1({endPoint: 'sw-lumiere-2.1'}),

        TramPieces.straightL1({startPoint: 'sw-T4-T2.1'}),
        TramPieces.straightL1({endPoint: 'sw-lumiere-1.0'}),

        /* T4 - Lycée Lumière */
        TramPieces.switchRight0('sw-lumiere-1', 'sw-lumiere-1.0', 'sw-lumiere-1.1', 'sw-lumiere-1.2'),
        TramPieces.switchRight2('sw-lumiere-2', 'sw-lumiere-2.0', 'sw-lumiere-2.1', 'sw-lumiere-1.2'),

        TramPieces.station({name: 'st-lumiere-1', startPoint: 'sw-lumiere-1.1'}),
        TramPieces.straightL1(),
        TramPieces.station({name: 'st-musee-garnier-1'}),
        TramPieces.straightL1(),
        TramPieces.station({name: 'st-beauvisage-1'}),
        TramPieces.straightL1(),
        TramPieces.station({name: 'st-viviani-1'}),
        TramPieces.straightL1(),
        TramPieces.straightL1(),
        TramPieces.station({name: 'st-curie-1'}),
        TramPieces.straightL1(),
        TramPieces.curveLeft(),
        TramPieces.station({name: 'st-borelle-1'}),
        TramPieces.straightSpacing3(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.straightSpacing3(),
        TramPieces.station({name: 'st-venissieux-1', endPoint: 'sw-venissieux-1.0'}),

        TramPieces.station({name: 'st-lumiere-2', startPoint: 'sw-lumiere-2.0'}),
        TramPieces.straightL1(),
        TramPieces.station({name: 'st-musee-garnier-2'}),
        TramPieces.straightL1(),
        TramPieces.station({name: 'st-beauvisage-2'}),
        TramPieces.straightL1(),
        TramPieces.station({name: 'st-viviani-2'}),
        TramPieces.straightL1(),
        TramPieces.straightL1(),
        TramPieces.station({name: 'st-curie-2'}),
        TramPieces.straightL1(),
        TramPieces.straightSpacing8(),
        TramPieces.curveLeft(),
        TramPieces.straightSpacing8(),
        TramPieces.station({name: 'st-borelle-2'}),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.station({name: 'st-venissieux-2', endPoint: 'sw-venissieux-2.1'}),

        /* T4 - Gare de Vénissieux */

        TramPieces.switchRight0('sw-venissieux-1', 'sw-venissieux-1.0', 'sw-venissieux-1.1', 'sw-venissieux-1.2'),
        TramPieces.switchRight2('sw-venissieux-2', 'sw-venissieux-2.0', 'sw-venissieux-2.1', 'sw-venissieux-1.2'),

        TramPieces.straightL1({startPoint: 'sw-venissieux-1.1'}),
        TramPieces.straightL1({name: 'venissieux-1'}),
        TramPieces.jointTrack(),
        TramPieces.straightL1({startPoint: 'sw-venissieux-2.0'}),
        TramPieces.straightL1({name: 'venissieux-2'}),
        TramPieces.jointTrack(),

        /* T2 -> Jean 23 */

        TramPieces.switchRight0('sw-villon-1', 'sw-villon-1.0', 'sw-villon-1.1', 'sw-villon-1.2'),
        TramPieces.switchRight2('sw-villon-2', 'sw-villon-2.0', 'sw-villon-2.1', 'sw-villon-1.2'),

        TramPieces.straightL1({startPoint: 'sw-villon-1.1'}),
        TramPieces.straightL2({name: 'villon-1'}),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.straightL1(),
        TramPieces.counterCurveLeft(),
        TramPieces.counterCurveRight(),
        TramPieces.straightL1(),
        TramPieces.straightL1({endPoint: 'sw-jean23-1-1.1'}),

        TramPieces.straightL1({startPoint: 'sw-villon-2.0'}),
        TramPieces.straightL2({name: 'villon-2'}),
        TramPieces.straightSpacing3(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.straightSpacing3(),
        TramPieces.straightL1(),
        TramPieces.straightL1(),
        TramPieces.straightL1(),
        TramPieces.straightL1({endPoint: 'sw-jean23-1-2.1'}),

        /* Tiroirs Jean 23 */

        TramPieces.switchRight1('sw-jean23-1-2', 'sw-jean23-1-2.0', 'sw-jean23-1-2.1', 'sw-jean23-1-2.2'),
        TramPieces.switchSym2('sw-jean23-1-3', 'sw-jean23-1-3.0', 'sw-jean23-1-1.2', 'sw-jean23-1-2.2'),
        TramPieces.straightL1({startPoint: 'sw-jean23-1-3.0'}),
        TramPieces.straightL1({name: 'tiroir-jean23-1'}),
        TramPieces.jointTrack(),
        TramPieces.switchLeft2('sw-jean23-1-1', 'sw-jean23-1-1.0', 'sw-jean23-1-1.1', 'sw-jean23-1-1.2'),

        TramPieces.straightL1({startPoint: 'sw-jean23-1-1.0'}),
        TramPieces.straightL1(),
        TramPieces.straightL1({endPoint: 'sw-jean23-2-1.1'}),

        TramPieces.straightL1({startPoint: 'sw-jean23-1-2.0'}),
        TramPieces.straightL1(),
        TramPieces.straightL1({endPoint: 'sw-jean23-2-2.1'}),

        TramPieces.switchRight1('sw-jean23-2-2', 'sw-jean23-2-2.0', 'sw-jean23-2-2.1', 'sw-jean23-2-2.2'),
        TramPieces.switchSym2('sw-jean23-2-3', 'sw-jean23-2-3.0', 'sw-jean23-2-1.2', 'sw-jean23-2-2.2'),
        TramPieces.straightL1({startPoint: 'sw-jean23-2-3.0'}),
        TramPieces.straightL1({name: 'tiroir-jean23-2'}),
        TramPieces.jointTrack(),
        TramPieces.switchLeft2('sw-jean23-2-1', 'sw-jean23-2-1.0', 'sw-jean23-2-1.1', 'sw-jean23-2-1.2'),

        TramPieces.straightL1({startPoint: 'sw-jean23-2-1.0'}),
        TramPieces.straightSpacing3(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.straightSpacing3(),
        TramPieces.straightSpacing({name: 'grangeblanche-1'}),
        TramPieces.jointTrack(),
        TramPieces.straightL1({startPoint: 'sw-jean23-2-2.0'}),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveRight({name: 'grangeblanche-2'}),
        TramPieces.jointTrack(),

        /* Gallieni -> Perrache */
        TramPieces.straightL1({startPoint: 'origin1'}),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.straightSpacing(),
        TramPieces.straightSpacing(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.straightSpacing(),
        TramPieces.station({name: 'st-perrache-1'}),
        TramPieces.straightL1({endPoint: 'perrache1'}),

        TramPieces.straightL1({startPoint: 'origin2'}),
        TramPieces.straightSpacing(),
        TramPieces.curveRight(),
        TramPieces.curveRight(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.curveLeft(),
        TramPieces.station({name: 'st-perrache-2'}),
        TramPieces.straightL1({endPoint: 'perrache2'}),

        TramPieces.switchLeft0('sw-perrache-1', 'perrache1', 'sw-perrache-1.1', 'sw-perrache-1.2'),
        TramPieces.switchLeft2('sw-perrache-2', 'sw-perrache-2.0', 'perrache2', 'sw-perrache-1.2'),
        TramPieces.straightSpacing({startPoint: 'sw-perrache-2.0', endPoint: 'sw-perrache-3.0'}),
        TramPieces.switchLeft0c('sw-perrache-3', 'sw-perrache-3.0', 'sw-perrache-3.1', 'sw-perrache-3.2'),

        TramPieces.curveLeft({startPoint: 'sw-perrache-3.2'}),
        TramPieces.curveLeft(),
        TramPieces.curveLeft({name: 'perrache-T2'}),
        TramPieces.jointTrack(),

        TramPieces.straightL1({startPoint: 'sw-perrache-1.1'}),
        TramPieces.curveRight(),
        TramPieces.curveLeft(),
        TramPieces.straightL1(),
        TramPieces.straightSpacing({endPoint: 'sw-perrache-arr1-1.0'}),

        TramPieces.curveRight({startPoint: 'sw-perrache-3.1'}),
        TramPieces.curveLeft(),
        TramPieces.straightL1({endPoint: 'sw-perrache-arr1-2.1'}),

        TramPieces.switchLeft0('sw-perrache-arr1-1', 'sw-perrache-arr1-1.0', 'sw-perrache-arr1-1.1', 'sw-perrache-arr1-1.2'),
        TramPieces.switchLeft2('sw-perrache-arr1-2', 'sw-perrache-arr1-2.0', 'sw-perrache-arr1-2.1', 'sw-perrache-arr1-1.2'),
        TramPieces.straightL1({startPoint: 'sw-perrache-arr1-2.0', endPoint: 'sw-perrache-arr2-2.0'}),
        TramPieces.straightL1({startPoint: 'sw-perrache-arr1-1.1', endPoint: 'sw-perrache-arr2-1.1'}),
        TramPieces.switchRight0('sw-perrache-arr2-2', 'sw-perrache-arr2-2.0', 'sw-perrache-arr2-2.1', 'sw-perrache-arr2-2.2'),
        TramPieces.switchRight2('sw-perrache-arr2-1', 'sw-perrache-arr2-1.0', 'sw-perrache-arr2-1.1', 'sw-perrache-arr2-2.2'),

        TramPieces.straightL1({startPoint: 'sw-perrache-arr2-1.0'}),
        TramPieces.curveRight({name: 'charlemagne-1'}),
        TramPieces.straightL1(),
        TramPieces.curveLeft(),
        TramPieces.straightL1(),
        TramPieces.jointTrack(),

        TramPieces.straightL1({startPoint: 'sw-perrache-arr2-2.1'}),
        TramPieces.curveRight({name: 'charlemagne-2'}),
        TramPieces.straightL1(),
        TramPieces.curveLeft(),
        TramPieces.straightL1(),
        TramPieces.jointTrack(),

        []
    )
};
var builder = new Builder();
var drawer = new CanvasDrawer(document.getElementById('canvas'));
var trainSimulator = new TrainSimulator();
var controller = new Controller(document.getElementById('controller'));
var ticker = new Ticker();
ticker.tickDelta = 0.1;
ticker.registerResolveTickable(trainSimulator);
ticker.registerOutputTickable(drawer);
ticker.registerInputTickable(controller.tickInput.bind(controller));
ticker.registerOutputTickable(controller.tickOutput.bind(controller));

builder.build(schema);
builder.registerToTrainSimulator(trainSimulator);
builder.registerToDrawer(drawer);
drawer.scale = 1;
drawer.trackWidth = 1.435;
drawer.switchLength = 9;
drawer.gridInfo = {
    minX: -200,
    maxX: 2500,
    minY: -2000,
    maxY: 1000,
    spacing: 15
};
//drawer.doGridDrawing = true;

var trackName;
for (trackName in builder.namedTracks) {
    if (trackName.match(/^st-*/)) {
        console.log(trackName);
        var track = builder.namedTracks[trackName];
        var element = new Element();
        element.label = trackName;
        element.putOnTrack(track, 1, -1);
        var element = new Element();
        element.label = trackName;
        element.putOnTrack(track, 44, 1);
    }
}

var revertElement = function (track, position) {
    var element = new Element();
    element.upped = function (train) {
        train.order = 'reverse';
    };
    element.putOnTrack(track, position, 1);
}
revertElement(builder.namedTracks['charlemagne-1'], 10);
revertElement(builder.namedTracks['charlemagne-2'], 10);
revertElement(builder.namedTracks['perrache-T2'], 10);
revertElement(builder.namedTracks['tiroir-jean23-1'], 15);
revertElement(builder.namedTracks['tiroir-jean23-2'], 15);
revertElement(builder.namedTracks['villon-1'], 25);
revertElement(builder.namedTracks['villon-2'], 25);
revertElement(builder.namedTracks['venissieux-1'], 15);
revertElement(builder.namedTracks['venissieux-2'], 15);
revertElement(builder.namedTracks['partdieu-1'], 15);
revertElement(builder.namedTracks['partdieu-2'], 15);
revertElement(builder.namedTracks['lafayette-1'], 25);
revertElement(builder.namedTracks['lafayette-2'], 25);
revertElement(builder.namedTracks['T3-1'], 10);
revertElement(builder.namedTracks['T3-2'], 10);
revertElement(builder.namedTracks['tiroir-vilette'], 15);
revertElement(builder.namedTracks['vilette-rx'], 15);

function addReturnSwitchGroup(swname) {
    var swGroup = new SwitchGroupController();
    swGroup.addSwitch(builder.namedSwitches['sw-' + swname + '-1']);
    swGroup.addSwitch(builder.namedSwitches['sw-' + swname + '-2']);
    swGroup.addSignal(swname + '-1-1', 0, 1, 2);
    swGroup.addBlockEntry(0, 1, 1, 2);
    swGroup.addSignal(swname + '-2-1', 1, 1, 2);
    swGroup.addBlockEntry(1, 1, 1, 2);
    swGroup.addSignal(swname + '-1-0', 0, 0, 2);
    swGroup.addBlockEntry(0, 0, 1, 2);
    swGroup.addSignal(swname + '-2-0', 1, 0, 2);
    swGroup.addBlockEntry(1, 0, 1, 2);
    swGroup.addPosition('||', [false, false], [true, true, true, true]);
    swGroup.addPosition('S', [true, true], [false, false, true, true]);
    swGroup.setPosition('||');
    controller.addSwitchGroup(swname, swGroup);
    ticker.registerInputTickable(swGroup);
}
function addTurnSwitchGroup(swname) {
    var swGroup = new SwitchGroupController();
    swGroup.addSwitch(builder.namedSwitches['sw-' + swname + '-1']);
    swGroup.addSwitch(builder.namedSwitches['sw-' + swname + '-2']);
    swGroup.addSignal(swname + '-1-1', 0, 1, 3);
    swGroup.addBlockEntry(0, 1, 2, 3);
    swGroup.addSignal(swname + '-1-2', 0, 2, 3);
    swGroup.addBlockEntry(0, 2, 2, 3);
    swGroup.addSignal(swname + '-2-1', 1, 1, 3);
    swGroup.addBlockEntry(1, 1, 2, 3);
    swGroup.addSignal(swname + '-2-2', 1, 2, 3);
    swGroup.addBlockEntry(1, 2, 2, 3);
    swGroup.addSignal(swname + '-1-0', 0, 0, 3);
    swGroup.addBlockEntry(0, 0, 2, 3);
    swGroup.addSignal(swname + '-2-0', 1, 0, 2);
    swGroup.addBlockEntry(1, 0, 1, 2);
    swGroup.addPosition('||', [false, false], [true, false, true, false, true, true]);
    swGroup.addPosition('//', [true, true], [false, true, false, true, true, true]);
    swGroup.setPosition('||');
    controller.addSwitchGroup(swname, swGroup);
    ticker.registerInputTickable(swGroup);
}
function addTiroir22SwitchGroup(swname) {
    var swGroup = new SwitchGroupController();
    swGroup.addSwitch(builder.namedSwitches['sw-' + swname + '-1']);
    swGroup.addSwitch(builder.namedSwitches['sw-' + swname + '-2']);
    swGroup.addSwitch(builder.namedSwitches['sw-' + swname + '-3']);
    swGroup.addSignal(swname + '-1-1', 0, 1, 3);
    swGroup.addBlockEntry(0, 1, 2, 3);
    swGroup.addSignal(swname + '-2-1', 1, 1, 3);
    swGroup.addBlockEntry(1, 1, 2, 3);
    swGroup.addSignal(swname + '-3-0', 2, 0, 3);
    swGroup.addBlockEntry(2, 0, 2, 3);
    swGroup.addSignal(swname + '-1-0', 0, 0, 3);
    swGroup.addBlockEntry(0, 0, 2, 3);
    swGroup.addSignal(swname + '-2-0', 1, 0, 3);
    swGroup.addBlockEntry(1, 0, 2, 3);
    swGroup.addPosition('||', [false, false, null], [true, true, false, true, true]);
    swGroup.addPosition('1', [true, false, false], [false, true, true, true, true]);
    swGroup.addPosition('2', [false, true, true], [true, false, true, true, true]);
    swGroup.setPosition('||');
    controller.addSwitchGroup(swname, swGroup);
    ticker.registerInputTickable(swGroup);
}
function addTiroir12SwitchGroup(swname) {
    var swGroup = new SwitchGroupController();
    swGroup.addSwitch(builder.namedSwitches['sw-' + swname + '-1']);
    swGroup.addSwitch(builder.namedSwitches['sw-' + swname + '-2']);
    swGroup.addSwitch(builder.namedSwitches['sw-' + swname + '-3']);
    swGroup.addSignal(swname + '-1-1', 0, 1, 3);
    swGroup.addBlockEntry(0, 1, 2, 3);
    swGroup.addSignal(swname + '-2-1', 1, 1, 3);
    swGroup.addBlockEntry(1, 1, 2, 3);
    swGroup.addSignal(swname + '-3-0', 2, 0, 3);
    swGroup.addBlockEntry(2, 0, 2, 3);
    swGroup.addSignal(swname + '-1-0', 0, 0, 3);
    swGroup.addBlockEntry(0, 0, 2, 3);
    swGroup.addSignal(swname + '-2-0', 1, 0, 3);
    swGroup.addBlockEntry(1, 0, 2, 3);
    swGroup.addPosition('||', [true, false, null], [true, true, false, true, true]);
    swGroup.addPosition('1', [false, false, false], [false, true, true, true, true]);
    swGroup.addPosition('2', [true, true, true], [true, false, true, true, true]);
    swGroup.setPosition('||');
    controller.addSwitchGroup(swname, swGroup);
    ticker.registerInputTickable(swGroup);
}
function addEscapeSwitchGroup(swname) {
    var swGroup = new SwitchGroupController();
    swGroup.addSwitch(builder.namedSwitches['sw-' + swname + '-1']);
    swGroup.addSwitch(builder.namedSwitches['sw-' + swname + '-2']);
    swGroup.addSwitch(builder.namedSwitches['sw-' + swname + '-3']);
    swGroup.addSignal(swname + '-1-1', 0, 1, 3);
    swGroup.addBlockEntry(0, 1, 2, 3);
    swGroup.addSignal(swname + '-2-1', 1, 1, 3);
    swGroup.addBlockEntry(1, 1, 2, 3);
    swGroup.addSignal(swname + '-3-1', 2, 1, 3);
    swGroup.addBlockEntry(2, 1, 2, 3);
    swGroup.addSignal(swname + '-3-2', 2, 2, 3);
    swGroup.addBlockEntry(2, 2, 2, 3);
    swGroup.addSignal(swname + '-1-0', 0, 0, 3);
    swGroup.addBlockEntry(0, 0, 2, 3);
    swGroup.addPosition('||', [false, false, false], [true, true, true, false, true]);
    swGroup.addPosition('|/', [false, false, true], [true, true, false, true, true]);
    swGroup.addPosition('//', [true, true, true], [false, false, false, true, true]);
    swGroup.setPosition('||');
    controller.addSwitchGroup(swname, swGroup);
    ticker.registerInputTickable(swGroup);
}

addTurnSwitchGroup('gallieni');

addReturnSwitchGroup('bernard');
addReturnSwitchGroup('liberte');
addTurnSwitchGroup('part-dieu');
addReturnSwitchGroup('part-dieu-arr');
addTurnSwitchGroup('lafayette');
addReturnSwitchGroup('lafayette-arr');

addReturnSwitchGroup('berthelot');
addReturnSwitchGroup('villon');

addEscapeSwitchGroup('rx-vilette');
addTurnSwitchGroup('T3T4');

addReturnSwitchGroup('mendes');
addReturnSwitchGroup('lumiere');
addReturnSwitchGroup('venissieux');
addEscapeSwitchGroup('perrache');
addReturnSwitchGroup('perrache-arr1');
addReturnSwitchGroup('perrache-arr2');

var t2t4 = new SwitchGroupController();
t2t4.addSwitch(builder.namedSwitches['sw-T2-T4']);
t2t4.addSwitch(builder.namedSwitches['sw-T4-T2']);
t2t4.addSignal('t2t4r', 0, 1, 3);
t2t4.addBlockEntry(0, 1, 2, 3);
t2t4.addSignal('t4t2r', 1, 1, 3);
t2t4.addBlockEntry(1, 1, 2, 3);
t2t4.addSignal('t2t4', 0, 0, 3);
t2t4.addBlockEntry(0, 0, 2, 3);
t2t4.addSignal('t4t2', 1, 0, 3);
t2t4.addBlockEntry(1, 0, 2, 3);
t2t4.addPosition('off', [false, false], [true, true, true, true]);
t2t4.addPosition('on', [true, true], [false, false, true, true]);
t2t4.setPosition('off');
controller.addSwitchGroup('t2t4', t2t4);
ticker.registerInputTickable(t2t4);

addTiroir22SwitchGroup('jean23-1');
addTiroir22SwitchGroup('jean23-2');
addTiroir12SwitchGroup('vilette');

var trainCounter = 0;
function addT1(trackName, position, direction) {
    var train1 = new AutomaticTrain(35);
    drawer.addTrain(train1);
    train1.putOnTrack(builder.namedTracks[trackName], position, direction);
    train1.maxSpeed = 18;
    train1.slowSpeed = 6;
    train1.accel = 6;
    train1.brakingAccel = 30;
    train1.direction = -1;
    train1.minForwardView = 10;
    train1.order = 'go';
    train1.remotes = {
        'perrache-arr1-2-0': '||',
        'perrache-3-1': '||',
        'gallieni-2-0': '//',
        'part-dieu-2-2': '//',
        'lafayette-2-2': '//',
        'lafayette-arr-2-0': 'S',
        'lafayette-arr-1-0': '||',
        'lafayette-1-0': '//',
        'part-dieu-1-0': '//',
        'gallieni-1-2': '//',
        'perrache-1-0': '||',
        'perrache-arr1-1-0': 'S'
    };
    trainCounter++;
    controller.addAutomaticTrain('T1-' + trainCounter, train1);
    ticker.registerMoveTickable(train1);
}


function addT2(trackName, position, direction) {
    var train2 = new AutomaticTrain(35);
    drawer.addTrain(train2);
    train2.putOnTrack(builder.namedTracks[trackName], position, direction);
    train2.maxSpeed = 18;
    train2.slowSpeed = 6;
    train2.accel = 6;
    train2.brakingAccel = 30;
    train2.direction = -1;
    train2.minForwardView = 10;
    train2.order = 'go';
    train2.remotes = {
        'perrache-3-2': '|/',
        'gallieni-2-0': '||',
        'villon-2-1': '||',
        'villon-2-0': 'S',
        'gallieni-1-1': '||',
        'perrache-1-0': '//'
    };
    trainCounter++;
    controller.addAutomaticTrain('T2-' + trainCounter, train2);
    ticker.registerMoveTickable(train2);
}

addT1('charlemagne-2', 10, 1);
addT1('st-perrache-2', 45, 1);
addT1('st-bernard-2', 5, -1);
addT1('st-universite-2', 5, -1);
addT1('st-st-andre-2', 5, -1);
addT1('st-guillotiere-2', 5, -1);
addT1('st-liberte-2', 5, -1);
addT1('st-prefecture-2', 5, -1);
addT1('st-palais-justice-2', 5, -1);
addT1('st-servient-2', 5, -1);
addT1('st-part-dieu-2', 5, -1);
addT1('st-lafayette-2', 5, -1);
addT1('st-lafayette-1', 45, 1);
addT1('st-part-dieu-1', 45, 1);
addT1('st-servient-1', 45, 1);
addT1('st-palais-justice-1', 45, 1);
addT1('st-prefecture-1', 45, 1);
addT1('st-liberte-1', 45, 1);
addT1('st-guillotiere-1', 45, 1);
addT1('st-st-andre-1', 45, 1);
addT1('st-universite-1', 45, 1);
addT1('st-bernard-1', 45, 1);
addT1('st-perrache-1', 5, -1);

addT2('perrache-T2', 5, -1);
addT2('st-berthelot-2', 5, -1);
addT2('st-jean-mace-2', 5, -1);
addT2('st-garibaldi-2', 5, -1);
addT2('st-vienne-2', 5, -1);
addT2('st-mendes-T2-2', 5, -1);
addT2('st-mendes-T2-1', 45, 1);
addT2('st-vienne-1', 45, 1);
addT2('st-garibaldi-1', 45, 1);
addT2('st-jean-mace-1', 45, 1);
addT2('st-berthelot-1', 45, 1);


ticker.run();
console.log('RUN');
