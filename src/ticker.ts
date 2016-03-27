export class Ticker {
    private tickables = {
        input: [],
        move: [],
        resolve: [],
        output: []
    };
    public tickDelta = 0.1;
    private ticking = false;
    private interval;

    registerInputTickable(tickable) {
        if (typeof tickable === 'object') {
            this.tickables.input.push(tickable.tick.bind(tickable));
        } else {
            this.tickables.input.push(tickable);
        }
    };
    registerMoveTickable(tickable) {
        if (typeof tickable === 'object') {
            this.tickables.move.push(tickable.tick.bind(tickable));
        } else {
            this.tickables.move.push(tickable);
        }
    };
    registerResolveTickable(tickable) {
        if (typeof tickable === 'object') {
            this.tickables.resolve.push(tickable.tick.bind(tickable));
        } else {
            this.tickables.resolve.push(tickable);
        }
    };
    registerOutputTickable(tickable) {
        if (typeof tickable === 'object') {
            this.tickables.output.push(tickable.tick.bind(tickable));
        } else {
            this.tickables.output.push(tickable);
        }
    };
    tick() {
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
    run() {
        this.interval = setInterval(this.tick.bind(this), this.tickDelta * 1000);
    };
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    };
}
