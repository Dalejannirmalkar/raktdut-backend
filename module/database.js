var mongoose = require('mongoose');
var methods = {};
mongoose.connect("mongodb://localhost/raktdut",  {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}, function (err) {
  console.log(err)
  if (err) throw err;

  console.log('Successfully connected');
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("ghar")
});

const locationSchema = mongoose.Schema({
  latitude: String,
  longitude: String
});


const userCreate = mongoose.Schema({
  EMAIL: String,
  PASSWORD: String,
  USERNAME: String,
  DOB: String,
  BLOOD_GRPOUP: String,
  MOBILE: Number,
  LOCATION: locationSchema
});


let userSchema = mongoose.model('user', userCreate);

methods.UserCraete = async (data) => {
  let user = new userSchema(data);
  return user.save(data)
}
methods.findOne = async (data) => {
  return userSchema.findOne(data);
}
methods.deleteOne = async (data) => {
  return userSchema.deleteOne(data);
}
// methods.deleteMany = async (data) => {
//   return userSchema.deleteMany(data);
// }
methods.updateOne = async (query, data) => {
  return userSchema.updateOne(query, data);
}
methods.updateMany = async (query, data) => {
  return userSchema.updateMany(query, data);
}
module.exports = methods;