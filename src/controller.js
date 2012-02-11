(function (ts) {
    'use strict';
    
    ts.SwitchGroupController = function () {
    	this.switches = [];
    	this.signals = [];
    	this.positions = {};
    	this.block = new ts.Block();
    	
    	this.addSwitch = function (sw) {
    		this.switches.push(sw);
    	};
    	
    	this.addSignal = function (label, swNum, trackNum, dist) {
    		var trackInfo = this.switches[swNum].tracks[trackNum];
    		var controller = this;
    		var signalElement = {
                x: trackInfo.position - trackInfo.direction * dist,
                direction: trackInfo.direction,
                label: label,
                signal: function() {
                    if (!this.isOpen || controller.block.isBusy()) {
                        return 'stop';
                    } else {
                        return 'go';
                    }
                },
                getPosition: function() {
                    return controller.getPosition();
                },
                getAvailablePositions: function() {
                    return controller.positions;
                },
                setPosition: function(pos) {
            		controller.setPosition(pos);
                },
                swaped: function (){},
                isOpen: false
            };
    		trackInfo.track.addElement(signalElement, signalElement.x);
    		this.signals.push(signalElement);
    	};
    	
    	this.addBlockEntry = function (swNum, trackNum, innerDist, outerDist) {
    		var trackInfo = this.switches[swNum].tracks[trackNum];
    		this.block.addEntry(trackInfo.track, trackInfo.position - trackInfo.direction * outerDist, trackInfo.position - trackInfo.direction * innerDist);
    	};
    	
    	this.addPosition = function (name, positions, signals) {
    		this.positions[name] = {positions: positions, signals: signals};
    	};
    	
    	this.setPosition = function (name) {
    		if (this.block.isBusy()) {
    			return;
    		}
    		var position = this.positions[name];
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
    	
    	this.addSwitch = function (name, sw) {
    		this.switches['name'] = sw;
    		var swLi = document.createElement('li');
    		swLi.setAttribute('class', 'switch');
    		swUl.appendChild(swLi);
    		var input = document.createElement('input');
    		input.id = 'controller-sw-' + name;
    		input.type = 'checkbox';
    		input.checked = sw.sw;
    		input.sw = sw;
    		var label = document.createElement('label');
    		label.setAttribute('for', 'controller-sw-' + name);
    		label.innerHTML = name;
    		swLi.appendChild(input);
    		swLi.appendChild(label);
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
	    		var radio = document.createElement('input');
	    		radio.type = 'radio';
				radio.value = option;
				radio.name = 'controller-swgroup-' + name;
				radio.id = 'controller-swgroup-' + name + '-' + option;
				radio.switchGroup = group;
				var label = document.createElement('label');
				label.setAttribute('for', 'controller-swgroup-' + name + '-' + option);
				label.innerHTML = option;
				swLi.appendChild(radio);
				swLi.appendChild(label);
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
	    		var radio = document.createElement('input');
	    		radio.type = 'radio';
				radio.value = option;
				radio.name = 'controller-train-' + name;
				radio.id = 'controller-train-' + name + '-' + option;
				radio.train = train;
				var label = document.createElement('label');
				label.setAttribute('for', 'controller-train-' + name + '-' + option);
				label.innerHTML = option;
				trainLi.appendChild(radio);
				trainLi.appendChild(label);
    		}
    		addOption('go');
    		addOption('stop');
    		addOption('reverse');
    		var selected = trainLi.querySelector('input[value="'+train.order+'"]');
    		if (selected) {
				selected.checked = true;
    		}
    	};
    	
    	this.tickInput = function () {
    		var inputs = swUl.querySelectorAll('li.switch input');
    		var i;
    		for (i = 0; i < inputs.length; i++) {
    			if (inputs[i].checked ^ inputs[i].sw.sw) {
    				inputs[i].sw.toggle();
    			}
    		}
    		var groups = swUl.querySelectorAll('li.switch-group input:checked');
    		for (i= 0; i < groups.length; i++) {
    			groups[i].switchGroup.setPosition(groups[i].value);
    		}
    		
    		var trains = trainUl.querySelectorAll('input:checked');
    		for (i= 0; i < trains.length; i++) {
    			trains[i].train.order = trains[i].value;
    		}
    	};
    	
    	this.tickOutput = function () {
    		var inputs = swUl.querySelectorAll('li.switch input');
    		var i;
    		for (i = 0; i < inputs.length; i++) {
    			inputs[i].checked = inputs[i].sw.sw;
    		}
    		for (i in this.switchGroups) {
    			if (this.switchGroups.hasOwnProperty(i)) {
    				var el = document.getElementById('controller-swgroup-' + i + '-' + this.switchGroups[i].getPosition());
    				if (el) {
    					el.checked = true;
    				}
    			}
    		}
    		for (i in this.trains) {
    			if (this.trains.hasOwnProperty(i)) {
    				var el = document.getElementById('controller-train-' + i + '-' + this.trains[i].order);
    				if (el) {
    					el.checked = true;
    				}
    			}
    		}
    	};
    };

})(TrainSimulator);