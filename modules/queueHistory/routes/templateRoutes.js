var express = require('express');
var router = express.Router();
var AuthMiddleware = require('../../authentication/src/AuthMiddleware');

// =========================================================================
// Queue - GET ============================================================
// =========================================================================
router.get('/', AuthMiddleware.authenticate(), function(req, res) {
    res.render('index');
});
router.get('/delete', AuthMiddleware.authenticate(), function(req, res) {
    res.render('modals/delete');
});
module.exports = router;
