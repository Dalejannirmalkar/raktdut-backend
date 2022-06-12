var express = require("express");
var router = express.Router();
var methods = {};

methods.group = function (prefix, fn) {
    if (!this.prefix)
        this.prefix = "";
    this.prefix += prefix;
    fn();
    this.prefix = "";
}
methods.get = function (path, callback) {
    
        let urlPath = this.prefix + path;
        router.get(urlPath, (req, res) => {
    
            let urlParam = urlPath.split('/');
            for (let i = 0; i < urlParam.length; i++) {
                let param = urlParam[i];
                if (param.length > 0 && param.charAt(0) === ':') {
                    let paramName = param.substring(1, param.length - 1);
                    if (typeof req.params[paramName] === 'undefined') {
                        return res.send({status: false, error: `Parameter ${paramName} is missing`})
                    }
                }
            }
            callback(req, res)
        });
    }
    
    methods.post = function (path, callback) {
        router.post(this.prefix + path, callback);
    }
    
    methods.router = router;
    module.exports = methods;
