var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function EncryptData(){

}

EncryptData.prototype.encoding = function(text,callback){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    callback(crypted);
};

EncryptData.prototype.decoding = function(text,callback){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    callback(dec);
};

module.export = EncryptData;


