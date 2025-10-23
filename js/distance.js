"use strict";
class Distance {
    activityType;
    values = [];
    constructor(activityType) {
        this.activityType = activityType;
        this.values = [];
    }
    get average() {
        var size = this.values.length;
        var total = this.values.reduce((sum, current) => sum + current, 0);
        return total / size;
    }
    insertValue(value) {
        this.values.push(value);
    }
}
