require('exit-on-epipe');
const app = require('../lib/routerredirect');
const user = require('../controller/user');


app.group("/user",()=>{
  app.get("/login/:EMAIL?",user.login);
  app.get("/get/:EMAIL?",user.getUser)
  app.post("/delete",user.deleteOne);
  app.post("/delete/all",user.deleteAll);
  app.post("/update",user.updateOne);
  app.post("/update/all",user.updateAll);
  app.post("/create",user.create);
  
})
app.post("/balanced",user.checkBalnce);


module.exports = app.router;