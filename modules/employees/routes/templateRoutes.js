var express = require('express');
var router = express.Router();
var AuthMiddleware = require('../../authentication/src/AuthMiddleware');

// =========================================================================
// EMPLOYEES - GET ============================================================
// =========================================================================
router.get('/', AuthMiddleware.authenticate(), function(req, res) {
    res.render('index');
});

router.get('/create', AuthMiddleware.authenticate(), function(req, res) {
    res.render('modals/create');
});

router.get('/update/password', AuthMiddleware.authenticate(), function(req, res) {
    res.render('modals/updatePassword');
});

router.get('/update', AuthMiddleware.authenticate(), function(req, res) {
    res.render('modals/update');
});

router.get('/delete', AuthMiddleware.authenticate(), function(req, res) {
    res.render('modals/delete');
});

module.exports = router;
