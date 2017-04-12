var express = require('express'),
    router = express.Router();

router.use('/v1/auth', require('./loginRouter'));

module.exports = router;