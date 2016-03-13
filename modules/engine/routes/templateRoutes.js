var express = require('express');
var router = express.Router();
var AuthMiddleware = require('../../authentication/src/AuthMiddleware');

// =========================================================================
// Create Contact - GET ============================================================
// =========================================================================
router.get('/dashboard', /*AuthMiddleware.authenticateApi(),*/ function(req, res) {
    res.render('dashboard');
});

module.exports = router;
