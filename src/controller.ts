import {Block} from "./block";
import {Element} from "./element";

class SignalElement extends Element {
    private isOpen = false;
    constructor(private controller) {
        super();
    }
    signal() {
        if (!this.isOpen) {
            return 'stop';
        } else {
            return 'go';
        }
    };
    getControllerPosition = function () {
        return this.controller.getPosition();
    };
    getControllerAvailablePositions = function () {
        return this.controller.positions;
    };
    setControllerPosition = function (pos) {
        this.controller.setPosition(pos);
    };
}

export class SwitchGroupController {
    private switches = [];
    private signals = [];
    private positions = {};
    private askedPosition = undefined;
    private block = new Block();

    addSwitch(sw) {
        this.switches.push(sw);
    };

    addSignal(label, swNum, trackNum, dist) {
        var trackInfo = this.switches[swNum].tracks[trackNum];
        var signalElement = new SignalElement(this);
        signalElement.label = label;
        signalElement.putOnTrack(trackInfo.track, trackInfo.position - trackInfo.direction * dist, trackInfo.direction);
        this.signals.push(signalElement);
    };

    addBlockEntry(swNum, trackNum, innerDist, outerDist) {
        var trackInfo = this.switches[swNum].tracks[trackNum];
        this.block.addEntry(trackInfo.track, trackInfo.position - trackInfo.direction * outerDist, trackInfo.position - trackInfo.direction * innerDist, trackInfo.position);
    };

    addPosition(name, positions, signals) {
        this.positions[name] = {positions: positions, signals: signals};
    };

    setPosition(name) {
        if (this.block.isBusy() || this.askedPosition !== undefined) {
            return;
        }
        this.askedPosition = name;
    };
    tick() {
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

    getPosition() {
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

    getAvailablePositions() {
        return this.positions;
    };
}
    
export class Controller {
    private switches = {};
    private switchGroups = {};
    private trains = {};
    private actions = [];
    private swUl;
    private trainUl;

    constructor(element) {
        var document = element.ownerDocument;
        this.swUl = document.createElement('ul');
        element.appendChild(this.swUl);
        this.trainUl = document.createElement('ul');
        element.appendChild(this.trainUl);
    }

    addSwitch(name, sw) {
        this.switches['name'] = sw;
        var swLi = document.createElement('li');
        swLi.setAttribute('class', 'switch');
        this.swUl.appendChild(swLi);
        var input = document.createElement('button');
        input.id = 'controller-sw-' + name;
        input.type = 'button';
        input.onclick = () => {this.actions.push(function(){sw.toggle();});};
        input.innerHTML = 'Toggle';
        swLi.appendChild(input);
    };

    addSwitches(switches) {
        var name;
        for (name in switches) {
            if (switches.hasOwnProperty(name)) {
                this.addSwitch(name, switches[name]);
            }
        }
    };

    addSwitchGroup(name, group) {
        this.switchGroups[name] = group;
        var swLi = document.createElement('li');
        swLi.setAttribute('class', 'switch-group');
        this.swUl.appendChild(swLi);
        swLi.innerHTML = name + '<br />';

        function addOption(option) {
            var button = document.createElement('button');
            button.type = 'button';
            button.value = option;
            button.name = 'controller-swgroup-' + name;
            button.id = 'controller-swgroup-' + name + '-' + option;
            button.onclick = () => {
                this.actions.push(function() {group.setPosition(option);});};
            button.innerHTML = option;
            swLi.appendChild(button);
        }

        for (var posname in group.positions) {
            if (group.positions.hasOwnProperty(posname)) {
                addOption(posname);
            }
        }
    };

    addAutomaticTrain(name, train) {
        this.trains[name] = train;
        var trainLi = document.createElement('li');
        this.trainUl.appendChild(trainLi);
        trainLi.innerHTML = name + '<br />';

        function addOption(option) {
            var button = document.createElement('button');
            button.type = 'button';
            button.value = option;
            button.name = 'controller-train-' + name;
            button.id = 'controller-train-' + name + '-' + option;
            button.onclick = () => {
                this.actions.push(function() {train.order = option;});};
            button.innerHTML = option;
            trainLi.appendChild(button);
        }
        addOption('go');
        addOption('stop');
        addOption('reverse');
        addOption('wait');
    };

    tickInput() {
        var i;
        for  (i = 0; i < this.actions.length; i++) {
            this.actions[i]();
        }
        this.actions = [];
    };

    tickOutput() {
        var inputs = this.swUl.querySelectorAll('li.switch button');
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
}
