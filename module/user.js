const methods = {};
const db = require('./database');
var jwt = require('jsonwebtoken');
methods.create = async (data) => {
    try {
        let prevuser = await methods.get(data);
console.log(prevuser)
        if (check(prevuser)) {
            return { status: true, response: { message: "User already exist with this email id" } };;
        }
        const userSave = await db.UserCraete(data);
        console.log(userSave);
        return { status: true, response: userSave };
    } catch (err) {
        return { status: false, response: err };
    }
}

function check(data) {
    return data && data.response && data.response.EMAIL;
}
methods.get = async (data) => {
    try {
        let search = {};
        if (data.EMAIL) {
            search.EMAIL = data.EMAIL;
        } if (data.ID) {
            search._id = data.ID;
        }
        let prevuser = await db.findOne(search);
        if (prevuser && prevuser.EMAIL) {
            return { status: true, response: prevuser };
        }
        return { status: false, response: { message: "user Not Exist" } };
    } catch (err) {
        return { status: false, response: err };
    }
}
methods.delete = async (data) => {
    try {
        let search = {};
        if (data.EMAIL) {
            search.EMAIL = data.EMAIL;
        } if (data.ID) {
            search._id = data.ID;
        }
        let prevuser = await methods.get(search);
        if (check(prevuser)) {
            let record;
            if (data.ALL) {
                record = await db.deleteMany(search);
                return { status: true, response: { message: "User deleted", record: record } };
            }
            record = await db.deleteOne(search);
            return { status: true, response: { message: "User deleted", record: record } };

        }
        return { status: false, response: { message: "user Not Exist" } };
    } catch (err) {
        return { status: false, response: err };
    }
}
methods.update = async (data) => {
    try {
        let setValues = {};
         setValues["$set"] = {}
        if (data.PASSWORD) {
            setValues["$set"].PASSWORD = data.PASSWORD;
        }
        if (data.DOB) {
            setValues["$set"].DOB = data.DOB;
        }
        if (data.ROLES) {
            setValues["$set"].ROLES = data.ROLES;
        }
        if (data.USERNAME) {
            setValues["$set"].USERNAME = data.USERNAME;
        }
       
        if(data.isUpdate && data.ATTEMPT){
            setValues["$set"].ATTEMPT = data.ATTEMPT;
        }
        if(data.isUpdate && data.BALANCED){
            setValues["$set"].BALANCED = data.BALANCED
        }
        let prevuser = await methods.get(data);
        if (check(prevuser)) {
            let record;
            if (data.ALL) {
                record = await db.updateMany({EMAIL:data.EMAIL},setValues);
                
                return { status: true, response: { message: "User updated", record: record } };
            }
            record = await db.updateOne({EMAIL:data.EMAIL},setValues);
            return { status: true, response: { message: "User updated", record: record } };

        }
        return { status: false, response: { message: "user Not Exist" } };
    } catch (err) {
        return { status: false, response: err };
    }
}

methods.jwtToken = async (data) => {
    try {
        let tokenObj = {};
        for (let value in data.ROLE) {
            tokenObj[value] = data.ROLE[value];
        }
        let jwtToken = jwt.sign(tokenObj, new Buffer("login", 'base64'), {
            expiresIn: 60000
        });
        return jwtToken;
    } catch (err) {
        console.log(err)
        return err;
    }

}
methods.tokenVerify = async (data) => {
    try {
        let key = data.headers['api-key']

        let tokenObj = await new Promise((resolve, reject) => {
            jwt.verify(key, new Buffer("login", 'base64'), function (err, decoded) {
                if (err) {
                    reject(err)
                }
                resolve(decoded["_parent"])
            });
        })
        return tokenObj;
    } catch (err) {
        return err
    }

}

methods.checkUser = async (data, access) => {
    try {
        const checkUserRole = await methods.tokenVerify(data);
        let isAccess = false;
        if (checkUserRole && checkUserRole.ROLE) {
            for (let val of checkUserRole.ROLE) {
                if (access == val) {
                    isAccess = true;
                    break;
                }
            }
        }
        if (isAccess) {
            return { status: isAccess, response: { message: "Allow Access", details: checkUserRole } }
        }
        let message = "Access Denied";
        if (checkUserRole.message) {
            message = message + " " + checkUserRole.message
        }
        return { status: isAccess, response: { message: message } }
    } catch (err) {
        return err;
    }
}

methods.checkBalence = async (data,userDetails) => {
    try {
        let user = await methods.get(userDetails.details);
        let objBracket = 0;
        let sqarebracket = 0;
        for (let val of data.CHECK.split('')) {
            if (val == "{") {
                objBracket++;
            }
            if (val == "}") {
                objBracket--;
            }
            if (val == "[") {
                sqarebracket++;
            } if (val == "]") {
                sqarebracket--;
            }
        }
        let missing = '';
        if(objBracket > 0){
            missing = "}";
        }if(objBracket < 0){
            missing = missing +" {"
        }
        if(sqarebracket > 0){
            missing = missing +" ]"
        }
        if(sqarebracket < 0){
            missing = missing +" ["
        }
        if(!missing){
            userDetails.details.BALANCED = data.CHECK;
        }
        if(user.response.ATTEMPT){
            userDetails.details.ATTEMPT = user.response.ATTEMPT + 1;
        }else{
            userDetails.details.ATTEMPT = 1;
        }
        userDetails.details.isUpdate = true;
        await methods.update(userDetails.details);
        
        if(!missing){
            return {status:true,response:{username:userDetails.details.USERNAME,message:"succed to be balanced",attempts:userDetails.details.ATTEMPT}}
        }
        return { status: false, response: { message: "Unbalanced "+missing+" is missing",attempts:userDetails.details.ATTEMPT } }
    } catch (err) {

    }
}
module.exports = methods;