let calc = require('../inc/calc'),
    utils = require('../inc/utils');

const DEFAULT_PROP = 'current';

class Action {
    constructor(props, defaultProp) {
        var action = this;

        utils.each(this.getDefaultProps(), function (key, value) {
            action[key] = value;
        });

        this.values = {};
        this.set(props, this.getDefaultValueProp());
    }

    set(props = {}, defaultProp = DEFAULT_PROP) {
        // Add properties
        for (let key in props) {
            if (props.hasOwnProperty(key) && key !== 'values') {
                this[key] = props[key];
            }
        }

        // Merge values
        if (props.values) {
            let currentValues = this.values,
                values = props.values;

            for (let key in values) {
                let existingValue = currentValues[key],
                    value = values[key],
                    newValue = {};

                if (utils.isObj(value)) {
                    newValue = value;
                } else {
                    newValue[defaultProp] = value;
                }

                currentValues[key] = existingValue ? utils.merge(existingValue, newValue) : newValue;
            }
        }

        return this;
    }

    process(value) {
        return value.current;
    }
        
    limit(output, value) {
        var restricted = calc.restricted(output, value.min, value.max),
            escapeAmp = value.escapeAmp !== undefined ? value.escapeAmp : 0;
        return restricted + ((output - restricted) * escapeAmp);
    }

    getName() {
        return 'action';
    }

    getDefaultProps() {
        return {};
    }

    getDefaultValue() {
        return {
            amp: 1,
            escapeAmp: 0,
            round: false
        };
    }

    getDefaultValueProp() {
        return DEFAULT_PROP;
    }

    extend(props) {
        return new this.constructor(utils.merge(this, props), this.getDefaultValueProp());
    }
}

module.exports = Action;