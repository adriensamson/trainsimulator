(function (ts) {
    'use strict';
    
    ts.SwitchGroupController = function () {
    	this.switches = [];
    	this.signals = [];
    	this.positions = {};
    	this.askedPosition = undefined;
    	this.block = new ts.Block();
    	
    	this.addSwitch = function (sw) {
    		this.switches.push(sw);
    	};
    	
    	this.addSignal = function (label, swNum, trackNum, dist) {
    		var trackInfo = this.switches[swNum].tracks[trackNum];
    		var controller = this;
    		var signalElement = new ts.Element();
    		signalElement.label = label;
    		signalElement.signal = function() {
                if (!this.isOpen) {
                    return 'stop';
                } else {
                    return 'go';
                }
            };
            signalElement.getControllerPosition = function() {
                return controller.getPosition();
            };
            signalElement.getControllerAvailablePositions = function() {
                return controller.positions;
            };
            signalElement.setControllerPosition = function(pos) {
        		controller.setPosition(pos);
            };
            signalElement.isOpen = false;
    		signalElement.putOnTrack(trackInfo.track, trackInfo.position - trackInfo.direction * dist, trackInfo.direction);
    		this.signals.push(signalElement);
    	};
    	
    	this.addBlockEntry = function (swNum, trackNum, innerDist, outerDist) {
    		var trackInfo = this.switches[swNum].tracks[trackNum];
    		this.block.addEntry(trackInfo.track, trackInfo.position - trackInfo.direction * outerDist, trackInfo.position - trackInfo.direction * innerDist, trackInfo.position);
    	};
    	
    	this.addPosition = function (name, positions, signals) {
    		this.positions[name] = {positions: positions, signals: signals};
    	};
    	
    	this.setPosition = function (name) {
    		if (this.block.isBusy() || this.askedPosition !== undefined) {
    			return;
    		}
    		this.askedPosition = name;
    	};
		this.tick = function () {
			if (this.askedPosition === undefined) {
				return;
			}
    		var position = this.positions[this.askedPosition];
    		if (position) {
    			var i;
    			for (i = 0; i < position.positions.length; i++) {
    				if (position.positions[i] !== null && this.switches[i].sw ^ position.positions[i]) {
    					this.switches[i].toggle();
    				}
    			}
    			for (i = 0; i < position.signals.length; i++) {
    					this.signals[i].isOpen = position.signals[i];
				}
    		}
    		this.askedPosition = undefined;
    	};
    	
    	this.getPosition = function () {
    		var position = [];
    		var i;
    		for (i = 0; i < this.switches.length; i++) {
    			position.push(this.switches[i].sw);
    		}
    		var name;
    		for (name in this.positions) {
    			if (this.positions.hasOwnProperty(name)) {
    				if (this.positions[name].positions.every(function(value, idx) {return value === null || value === position[idx];})) {
    					return name;
    				}
    			}
    		}
    		return undefined;
    	};
    	
    	this.getAvailablePositions = function () {
    	    return this.positions;
    	};
    };
    
    ts.Controller = function (element) {
    	var document = element.ownerDocument;
    	var swUl = document.createElement('ul');
    	element.appendChild(swUl);
    	this.switches = {};
    	this.switchGroups = {};
    	var trainUl = document.createElement('ul');
    	element.appendChild(trainUl);
    	this.trains = {};
    	var actions = [];
    	
    	this.addSwitch = function (name, sw) {
    		this.switches['name'] = sw;
    		var swLi = document.createElement('li');
    		swLi.setAttribute('class', 'switch');
    		swUl.appendChild(swLi);
    		var input = document.createElement('button');
    		input.id = 'controller-sw-' + name;
    		input.type = 'button';
    		input.onclick = function () {actions.push(function(){sw.toggle();});};
    		input.innerHTML = 'Toggle';
    		swLi.appendChild(input);
    	};
    	
    	this.addSwitches = function (switches) {
    		var name;
    		for (name in switches) {
    			if (switches.hasOwnProperty(name)) {
    				this.addSwitch(name, switches[name]);
    			}
    		}
    	};
    	
    	this.addSwitchGroup = function (name, group) {
    		this.switchGroups[name] = group;
    		var swLi = document.createElement('li');
    		swLi.setAttribute('class', 'switch-group');
    		swUl.appendChild(swLi);
    		swLi.innerHTML = name + '<br />';
    		
    		function addOption(option) {
	    		var button = document.createElement('button');
	    		button.type = 'button';
	    		button.value = option;
	    		button.name = 'controller-swgroup-' + name;
	    		button.id = 'controller-swgroup-' + name + '-' + option;
	    		button.onclick = function () {actions.push(function() {group.setPosition(option);});};
				button.innerHTML = option;
				swLi.appendChild(button);
    		}
    		
    		for (var posname in group.positions) {
    			if (group.positions.hasOwnProperty(posname)) {
    				addOption(posname);
    			}
    		}
    	};
    	
    	this.addAutomaticTrain = function (name, train) {
    		this.trains[name] = train;
    		var trainLi = document.createElement('li');
    		trainUl.appendChild(trainLi);
    		trainLi.innerHTML = name + '<br />';
    		
    		function addOption(option) {
                var button = document.createElement('button');
                button.type = 'button';
                button.value = option;
                button.name = 'controller-train-' + name;
                button.id = 'controller-train-' + name + '-' + option;
                button.onclick = function () {actions.push(function() {train.order = option;});};
                button.innerHTML = option;
                trainLi.appendChild(button);
            }
    		addOption('go');
    		addOption('stop');
    		addOption('reverse');
    		addOption('wait');
    	};
    	
    	this.tickInput = function () {
    		var i;
    		for  (i = 0; i < actions.length; i++) {
    		    actions[i]();
    		}
    		actions = [];
    	};
    	
    	this.tickOutput = function () {
    		var inputs = swUl.querySelectorAll('li.switch button');
    		var i, j;
    		var el, positions;
    		for (i = 0; i < inputs.length; i++) {
    			inputs[i].setAttribute('class', inputs[i].sw.sw ? 'on' : 'off');
    		}
    		for (i in this.switchGroups) {
    			if (this.switchGroups.hasOwnProperty(i)) {
    			    positions = this.switchGroups[i].getAvailablePositions();
    			    for (j in positions) {
    			        if (positions.hasOwnProperty(j)) {
        			        el = document.getElementById('controller-swgroup-' + i + '-' + j);
                            if (el) {
                                el.setAttribute('class', '');
                            }
    			        }
    			    }
    				el = document.getElementById('controller-swgroup-' + i + '-' + this.switchGroups[i].getPosition());
    				if (el) {
    					el.setAttribute('class', 'on');
    				}
    			}
    		}
    		positions = ['go', 'stop', 'reverse', 'wait'];
    		for (i in this.trains) {
                if (this.trains.hasOwnProperty(i)) {
                    for (j = 0; j < positions.length; j++) {
                        if (positions.hasOwnProperty(j)) {
                            el = document.getElementById('controller-train-' + i + '-' + positions[j]);
                            if (el) {
                                el.setAttribute('class', '');
                            }
                        }
                    }
                    el = document.getElementById('controller-train-' + i + '-' + this.trains[i].order);
                    if (el) {
                        el.setAttribute('class', 'on');
                    }
                }
            }
    	};
    };

})(TrainSimulator);