var mongoose = require('mongoose');
var md5 = require('md5');
var Schema = mongoose.Schema;

var LoginModelSchema = new Schema({
    full_name:{type:String,default:null},
    date_of_birth:{type:Date,},
    email:{type:String,default:null},
    password:{type:String},
    unique_id:{type:String},
    phone_number:{type:Number,default:9999999999},
    picture:{type:String,default:null},
    m_verification_code:{type:String},
    e_verification_code:{type:String},
    m_verification_status:{type:String,Default:"N"},
    e_verification_status:{type:String,Default:"N"}
});
var model = mongoose.model('users', LoginModelSchema);

function LoginModel(){

}

LoginModel.prototype.find = function(params,callback) {

};

LoginModel.prototype.findById = function(body,callback){
    model.findOne({email:body.email},function(err,res){
        if(err){
            callback({status:204,data:{message:"Something went wrong please try again later sorry for inconvenience"}});
        }else if(res){
            if(res.password === md5(body.password)) {
                callback({status:200,data:res});
            }else{
                callback({status:205,data:{message:"invalid  password"}});
            }
        }else{
            callback({status:205,data:{message:"invalid username and password please check"}});
        }
    });
}

LoginModel.prototype.create = function(body,callback){
   model.findOne({email:body.email},function(err,res){
       if(res) {
           callback({status:205,data:{message:"you already a member"}});
       } else {
           body.password = md5(body.password);
           body.unique_id = Math.floor(1000000000 + Math.random() * 9000000000);
           var col = new model(body);
           col.save(function (err,resp) {
               if (err) {
                   callback({status:204,data:{message:"Something went wrong please try again later sorry for inconvenience"}});
               } else {
                   callback({status:201,data:resp});
               }
           });
       }
    });
}

module.exports = LoginModel;