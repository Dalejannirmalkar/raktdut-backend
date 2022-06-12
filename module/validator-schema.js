const Joi = require('joi');
const validator = require("../lib/validator");



exports.create = validator.object().keys({
    EMAIL : validator.string().regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).required(),
    USERNAME : validator.string().required(),
    PASSWORD : validator.string().required(),
    DOB : validator.date().format('DD/MM/YYYY').required(),
}).unknown(true);

exports.getUser = validator.object().keys({
    EMAIL : validator.string().regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).required()
}).unknown(true);


exports.delete = validator.object().keys({
    EMAIL : validator.string().regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}).unknown(true);

exports.update = validator.object().keys({
    USERNAME : validator.string(),
    EMAIL : validator.string().regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).required(),    
    DOB : validator.date().format('DD/MM/YYYY'),
    PASSWORD : validator.string(),
}).unknown(true);
exports.checkBalence = validator.object().keys({
    CHECK : validator.string().required()
})