const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const validator = BaseJoi.extend(Extension);

// Extending JOI validator to have file validation functionality 
const fileArray = validator.extend((joi) => ({
    base: joi.any(),
    name: 'files',
    language: {

        required: 'field is required.',
        length: ' should have length {{l}}',
    },
    pre(value, state, options) {
        return value;
    },
    rules: [
        {
            name: 'required',
            setup(params) {
                this._flags.required = true;
            },
            validate(params, value, state, options) {
                if (value.length == 0) {
                    return this.createError('files.required', { v: value }, state, options);
                }
                return value;
            }
        },
        {
            name: 'length',
            params: {
                l: joi.number().required()
            },
            setup(params) {
                this._flags.length = true;
            },
            validate(params, value, state, options) {
                if (value.length != params.l) {

                    return this.createError('files.length', { v: value, l: params.l }, state, options);
                }
                return value;
            }
        }
    ]
}));

var options = {
    language: {
        root: "Request Object"
    }
};

validator.getErrorMessage = function (err) {
    console.log("err=================",err.details[0])
    err.details[0].message = err.details[0].message.replace(/\"/g, '')
    if (err.details[0].path.length == 1)
        return err.details[0].message;
    else {
        var path = err.details[0].path.join(".");
        if (path.trim().length > 0)
            path = " at path "+path;
        return err.details[0].message + path;

    }
}

module.exports = validator;