var express = require('express');
var router = express.Router();
var auth = require('../utils/middleAuth');
var loginController = require('../controllers/loginController');
var lc = new loginController();

router.post('/:authenticate',auth,lc.authenticate.bind(lc));

module.exports = router;
