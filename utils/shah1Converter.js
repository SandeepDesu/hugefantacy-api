var sha1 = require('sha1');

function SHA1(){

}

SHA1.prototype.convertToSha = function(text){
    return sha1(text);
};

module.exports = SHA1;