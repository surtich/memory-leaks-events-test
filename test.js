//Events Simulation

function EventEmitter() {
    var events = {};
    
    this.addListener = function (event, observer, listener) {
        if (!events[event]) {
            events[event] = [];
        }
        events[event].push([observer, listener]);
    };

    this.removeListener = function (event, observer, listener) {
        if (!events[event]) {
            return;
        }
        for (var i = events[event].length - 1; i >= 0 ; i--) {
            if (events[event][i][0] === observer && events[event][i][1] === listener) { 
                events[event].splice(i, 1);
            }
        }
    };

    this.emitEvent = function (event, params) {
        if (events[event]) {
            for (var i = 0; i < events[event].length; i++) {
                events[event][i][1].apply(events[event][i][0], [event, params]);
            }
        }
    };
}

function Model(number) {
    EventEmitter.call(this);
    this.number = number;
    var self = this;    
    
    this.listener1 = function (event, params) {
        console.log('The ' + event + ' event has been recived by listener1 in model ' + self.number + ' emitted by model ' + params.number);
    }
}

Model.prototype.listener2 = function (event, params) {
    console.log('The ' + event + ' event has been recived by listener2 in model ' + this.number + ' emitted by model ' + params.number);
}

var models = [], i, j, model;

while (models.length < 5) {
    models.push(new Model(models.length));
}

for (i = 0; i < models.length; i++) {
    for (j = 0; j < models.length; j++) {
        if (i !== j) {
           models[i].addListener('foo', models[j], models[j].listener1); 
        }
    }
}

console.log("Emit foo");

for (i = 0; i < models.length; i++) {
    models[i].emitEvent('foo', {number: models[i].number});
}

for (i = 0; i < models.length; i++) {
    for (j = 1; j < models.length; j++) {
        if (i !== j) {
           models[i].removeListener('foo', models[j], models[j].listener1); 
        }
    }
}

console.log("Emit foo");
for (i = 0; i < models.length; i++) {
    models[i].emitEvent('foo', {number: models[i].number});
}


for (i = models.length - 1 ; i > 0; i--) {
     model = models.splice(i, 1);
}

model = null;