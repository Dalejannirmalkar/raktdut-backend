const user = require('../module/user');
const validator = require('../lib/validator');
const schema = require('../module/validator-schema');


exports.create = async (req, res) => {
    try {
        console.log(req.body)
        const reqData = req.body;
        const validate = await new Promise((resolve, reject) => {
            validator.validate(reqData, schema.create, (err, value) => {
                if (err) {
                    reject({ status: false, message: validator.getErrorMessage(err) });
                } else {
                    resolve({ status: true });
                }
            })
        });
        const userCreate = await user.create(reqData);
        console.log(userCreate)
        return res.send(userCreate);
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}


exports.getUser = async (req, res) => {
    try {
        const accessVerify = await user.checkUser(req, "R");
        if (!accessVerify.status) {
            return res.send(accessVerify);
        }
        const reqData = req.params;
        const validate = await new Promise((resolve, reject) => {
            validator.validate(reqData, schema.getUser, (err, value) => {
                if (err) {
                    reject({ status: false, message: validator.getErrorMessage(err) });
                } else {
                    resolve({ status: true });
                }
            })
        });
        return res.send(await user.get(reqData));
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
exports.deleteOne = async (req, res) => {
    try {
        const accessVerify = await user.checkUser(req, "D");
        if (!accessVerify.status) {
            return res.send(accessVerify);
        }
        const reqData = req.body;
        const validate = await new Promise((resolve, reject) => {
            validator.validate(reqData, schema.delete, (err, value) => {
                if (err) {
                    reject({ status: false, message: validator.getErrorMessage(err) });
                } else {
                    resolve({ status: true });
                }
            })
        });
        reqData.ALL = false;
        return res.send(await user.delete(reqData));
    } catch (err) {
        return res.send(err)
    }
}
exports.deleteAll = async (req, res) => {
    try {
        const accessVerify = await user.checkUser(req, "D");
        if (!accessVerify.status) {
            return res.send(accessVerify);
        }
        const reqData = req.body;
        const validate = await new Promise((resolve, reject) => {
            validator.validate(reqData, schema.delete, (err, value) => {
                if (err) {
                    reject({ status: false, message: validator.getErrorMessage(err) });
                } else {
                    resolve({ status: true });
                }
            })
        });
        reqData.ALL = true;
        return res.send(await user.delete(reqData));
    } catch (err) {
        return res.send(err)
    }
}

exports.updateOne = async (req, res) => {
    try {
        const accessVerify = await user.checkUser(req, "U");
        if (!accessVerify.status) {
            return res.send(accessVerify);
        }
        const reqData = req.body;
        const validate = await new Promise((resolve, reject) => {
            validator.validate(reqData, schema.update, (err, value) => {
                if (err) {
                    reject({ status: false, message: validator.getErrorMessage(err) });
                } else {
                    resolve({ status: true });
                }
            })
        });
        reqData.ALL = false;
        return res.send(await user.update(reqData));
    } catch (err) {
        return res.send(err)
    }
}
exports.updateAll = async (req, res) => {
    try {
        const accessVerify = await user.checkUser(req, "U");
        if (!accessVerify.status) {
            return res.send(accessVerify);
        }
        const reqData = req.body;
        const validate = await new Promise((resolve, reject) => {
            validator.validate(reqData, schema.update, (err, value) => {
                if (err) {
                    reject({ status: false, message: validator.getErrorMessage(err) });
                } else {
                    resolve({ status: true });
                }
            })
        });
        reqData.ALL = true;
        return res.send(await user.update(reqData));
    } catch (err) {
        return res.send(err)
    }
}

exports.login = async (req, res) => {
    try {
        const reqData = req.params;
        const validate = await new Promise((resolve, reject) => {
            validator.validate(reqData, schema.getUser, (err, value) => {
                if (err) {
                    reject({ status: false, message: validator.getErrorMessage(err) });
                } else {
                    resolve({ status: true });
                }
            })
        });
        let userGet = await user.get(reqData);
        if (userGet.status) {
            userGet.response = await user.jwtToken(userGet.response);
        }
        return res.send(userGet);
    } catch (err) {
        return res.send(err)
    }
}
exports.checkBalnce = async (req, res)=>{
    try {
        const accessVerify = await user.checkUser(req, "CHECK");
        if (!accessVerify.status) {
            return res.send(accessVerify);
        }
        const reqData = req.body;
        const validate = await new Promise((resolve, reject) => {
            validator.validate(reqData, schema.checkBalence, (err, value) => {
                if (err) {
                    reject({ status: false, message: validator.getErrorMessage(err) });
                } else {
                    resolve({ status: true });
                }
            })
        });
        return res.send(await user.checkBalence(reqData,accessVerify.response));

    } catch (err) {
        return res.send(err)
    }
}
