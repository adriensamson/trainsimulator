(function (ts) {
    'use strict';
    
    ts.Ticker = function () {
        this.tickables = {
    		input: [],
    		move: [],
    		resolve: [],
    		output: []
        };
        this.tickDelta = 0.1;
        this.ticking = false;
        this.registerInputTickable = function (tickable) {
        	if (typeof tickable === 'object') {
        		this.tickables.input.push(tickable.tick.bind(tickable));
        	} else {
        		this.tickables.input.push(tickable);
        	}
        };
        this.registerMoveTickable = function (tickable) {
        	if (typeof tickable === 'object') {
        		this.tickables.move.push(tickable.tick.bind(tickable));
        	} else {
        		this.tickables.move.push(tickable);
        	}
        };
        this.registerResolveTickable = function (tickable) {
        	if (typeof tickable === 'object') {
        		this.tickables.resolve.push(tickable.tick.bind(tickable));
        	} else {
        		this.tickables.resolve.push(tickable);
        	}
        };
        this.registerOutputTickable = function (tickable) {
        	if (typeof tickable === 'object') {
        		this.tickables.output.push(tickable.tick.bind(tickable));
        	} else {
        		this.tickables.output.push(tickable);
        	}
        };
        this.tick = function () {
            if (this.ticking) {
            	console.log('previous tick not finished!');
                return;
            }
            this.ticking = true;
            var i;
            for (i = 0; i < this.tickables.input.length; i++) {
                this.tickables.input[i](this.tickDelta);
            }
            for (i = 0; i < this.tickables.move.length; i++) {
                this.tickables.move[i](this.tickDelta);
            }
            for (i = 0; i < this.tickables.resolve.length; i++) {
                this.tickables.resolve[i](this.tickDelta);
            }
            for (i = 0; i < this.tickables.output.length; i++) {
                this.tickables.output[i](this.tickDelta);
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
        this.slowSpeed = 0;
        this.command = 'brake'; // brake/slow/accelerate
        this.order = 'go'; //  go/stop/reverse/wait
        this.lastStation;
        this.waitingTime = 1;
        this.waitTime = 1;
        this.minForwardView = 0;
        this.forwardViewTime = 2;
        this.remotes = {};
        this.elementSignal = new ts.Element();
        this.elementSignal.swaped = function (elm) {
        	if (elm.getDirection() === this.getDirection()) {
                if (elm.signal) {
                    if (elm.signal() === 'stop') {
                        train.command = 'brake';
                    }
                }
                if (elm.label && elm.setControllerPosition && train.remotes[elm.label]) {
                	elm.setControllerPosition(train.remotes[elm.label]);
                }
                if (elm.label && elm.getControllerPosition && train.remotes[elm.label]) {
                	if (elm.getControllerPosition() !== train.remotes[elm.label]) {
                		train.command = 'brake';
                	}
                }
                if (elm.label && elm.label.match(/^st-/) && elm.label !== train.lastStation) {
                	if (train.speed > train.slowSpeed) {
                	    if (train.command !== 'brake') {
                	        train.command = 'slow';
                	    }
                	} else {
	                	train.order = 'wait';
	                	train.lastStation = elm.label;
                	}
                }
        	}
        };
        this.elementSignal.upped = function () {
            train.command = 'brake';
        };
        this.tick = function (tickDelta) {
            if (train.command === 'accelerate') {
                this.speed += this.accel * tickDelta;
                if (this.speed > this.maxSpeed) {
                    this.speed = this.maxSpeed;
                }
            } else if (train.command === 'slow') {
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
    };
})(TrainSimulator);
