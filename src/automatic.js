(function (ts) {
    'use strict';
    
    ts.Ticker = function () {
        this.tickables = [];
        this.tickDelta = 0.1;
        this.ticking = false;
        this.registerTickable = function (tickable) {
            this.tickables.push(tickable);
        };
        this.tick = function () {
            if (this.ticking) {
                return;
            }
            this.ticking = true;
            var i;
            for (i = 0; i < this.tickables.length; i++) {
                this.tickables[i].tick(this.tickDelta);
            }
            this.ticking = false;
        };
        this.run = function () {
            this.interval = setInterval(this.tick.bind(this), this.tickDelta * 1000);
        };
        this.stop = function () {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = undefined;
            }
        };
    };

    ts.AutomaticTrain = function (size) {
        ts.Train.bind(this)(size);
        var train = this;
        this.speed = 0;
        this.direction = 1;
        this.accel = 0;
        this.brakingAccel = 0;
        this.maxSpeed = 0;
        this.command = 'brake'; // or 'accelerate'
        this.order = 'go'; // or 'reverse'
        this.minForwardView = 0;
        this.forwardViewTime = 2;
        this.elementSignal = {
            direction: 1,
            swaped: function (elm) {
                if (elm.signal && elm.direction === this.direction) {
                    if (elm.signal() === 'stop') {
                        train.command = 'brake';
                    }
                }
            },
            upped: function (elm) {
                train.command = 'brake';
            }
        };
        this.tick = function (tickDelta) {
            var fromPosition;
            if (train.command === 'accelerate') {
                this.speed += this.accel * tickDelta;
                if (this.speed > this.maxSpeed) {
                    this.speed = this.maxSpeed;
                }
            } else {
                this.speed -= this.brakingAccel * tickDelta;
                if (this.speed < 0) {
                    this.speed = 0;
                }
            }
            
            if (this.elementSignal.track) {
                this.elementSignal.track.removeElement(this.elementSignal);
            }
            
            var forwardView = this.speed * this.forwardViewTime;
            if (forwardView < this.minForwardView) {
                forwardView = this.minForwardView;
            }
            
            if (this.direction > 0) {
                this.elementSignal.direction = this.elementHead.direction;
                this.elementSignal.x = this.elementHead.x + forwardView * this.elementSignal.direction + this.direction * this.speed * tickDelta;
                this.elementHead.track.addElement(this.elementSignal, this.elementHead.x);
            } else {
                this.elementSignal.direction = this.elementTail.direction;
                this.elementSignal.x = this.elementTail.x + forwardView * this.elementSignal.direction + this.direction * this.speed * tickDelta;
                this.elementTail.track.addElement(this.elementSignal, this.elementTail.x);
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
            }
            
        };
    };
})(TrainSimulator);
