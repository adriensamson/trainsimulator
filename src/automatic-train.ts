import {Train} from "./train";
import {Element} from "./element";

export class AutomaticTrain extends Train {

    private speed = 0;
    public direction = 1;
    public accel = 0;
    public brakingAccel = 0;
    public maxSpeed = 0;
    public slowSpeed = 0;
    private command = 'brake'; // brake/slow/accelerate
    public order = 'go'; //  go/stop/reverse/wait
    private waitingTime = 1;
    private waitTime = 1;
    public minForwardView = 0;
    private forwardViewTime = 2;
    public remotes = {};
    private elementSignal = new Element();
    private lastStation;

    constructor(size) {
        super(size);

        this.elementSignal.swaped = (elm) => {
            if (elm.getDirection() === this.elementSignal.getDirection()) {
                if (elm.signal) {
                    if (elm.signal() === 'stop') {
                        this.command = 'brake';
                    }
                }
                if (elm.label && elm.setControllerPosition && this.remotes[elm.label]) {
                    elm.setControllerPosition(this.remotes[elm.label]);
                }
                if (elm.label && elm.getControllerPosition && this.remotes[elm.label]) {
                    if (elm.getControllerPosition() !== this.remotes[elm.label]) {
                        this.command = 'brake';
                    }
                }
                if (elm.label && elm.label.match(/^st-/) && elm.label !== this.lastStation) {
                    if (this.speed > this.slowSpeed) {
                        if (this.command !== 'brake') {
                            this.command = 'slow';
                        }
                    } else {
                        this.order = 'wait';
                        this.lastStation = elm.label;
                    }
                }
            }
        };
        this.elementSignal.upped = () => {
            this.command = 'brake';
        };
    }

    tick(tickDelta) {
        if (this.command === 'accelerate') {
            this.speed += this.accel * tickDelta;
            if (this.speed > this.maxSpeed) {
                this.speed = this.maxSpeed;
            }
        } else if (this.command === 'slow') {
            if (this.speed > this.slowSpeed) {
                this.speed -= this.brakingAccel * tickDelta;
                if (this.speed < 0) {
                    this.speed = 0;
                }
            }
        } else {
            this.speed -= this.brakingAccel * tickDelta;
            if (this.speed < 0) {
                this.speed = 0;
            }
        }

        if (this.elementSignal.getTrack()) {
            this.elementSignal.removeFromTrack();
        }

        var forwardView = this.speed * this.forwardViewTime;
        if (forwardView < this.minForwardView) {
            forwardView = this.minForwardView;
        }

        if (this.direction > 0) {
            this.elementSignal.putOnTrack(this.elementHead.getTrack(),
                    this.elementHead.getPosition() + forwardView * this.elementHead.getDirection() + this.direction * this.speed * tickDelta,
                    this.elementHead.getDirection(),
                    this.elementHead.getPosition());
        } else {
            this.elementSignal.putOnTrack(this.elementTail.getTrack(),
                    this.elementTail.getPosition() + forwardView * this.elementTail.getDirection() + this.direction * this.speed * tickDelta,
                    this.elementTail.getDirection(),
                    this.elementTail.getPosition());
        }

        this.move(this.direction * this.speed * tickDelta);

        if (this.order === 'go') {
            this.command = 'accelerate';
        } else if (this.order === 'reverse') {
            if (this.speed === 0) {
                this.direction *= -1;
                this.order = 'go';
                this.command = 'accelerate';
            } else {
                this.command = 'brake';
            }
        } else if (this.order === 'stop') {
            this.command = 'brake';
        } else if (this.order === 'wait') {
            if (this.speed > 0){
                this.command = 'brake';
            } else if (this.waitingTime > 0) {
                this.waitingTime -= tickDelta;
            } else {
                this.order = 'go';
                this.command = 'accelerate';
                this.waitingTime = this.waitTime;
            }
        }

    };
}

