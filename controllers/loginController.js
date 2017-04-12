var LoginModel = require('../models/loginModel');
var lm = new LoginModel();
function LoginController(){

}

LoginController.prototype.authenticate = function(req,res,next) {
   if(req.params.authenticate === "login") {
       this.login(req,res,next);
   }else if(req.params.authenticate === "register") {
       this.register(req,res,next);
   }

}
LoginController.prototype.login = function(req,res,next) {
    lm.findById(req.body,function(res){
        res.status(res.status).send(res.data);
    });
}
LoginController.prototype.register = function(req,res,next) {
    lm.create(req.body,function(data){
        res.status(res.status).send(res.data);
    });
}

module.exports = LoginController;