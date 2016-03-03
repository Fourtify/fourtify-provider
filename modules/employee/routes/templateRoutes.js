var express = require('express');
var router = express.Router();
var AuthMiddleware = require('../../authentication/src/AuthMiddleware');

// =========================================================================
// Create Employee - GET ============================================================
// =========================================================================
router.get('/create', AuthMiddleware.authenticateApi(), function(req, res) {
    res.render('modals/create');
});

// =========================================================================
// Update Employee - GET ============================================================
// =========================================================================
router.get('/update', AuthMiddleware.authenticateApi(), function(req, res) {
    res.render('modals/update');
});

// =========================================================================
// Contact Details - GET ============================================================
// =========================================================================
router.get('/details', AuthMiddleware.authenticateApi(), function(req, res) {
    res.render('details');
});


// =========================================================================
// DELETE CONFIRM MODAL - GET ============================================================
// =========================================================================
router.get('/delete', AuthMiddleware.authenticateApi(), function(req, res) {
    res.render('modals/delete');
});

// =========================================================================
// Employee Settings - GET ============================================================
// =========================================================================
router.get('/settings', AuthMiddleware.authenticateApi(), function(req, res) {
    res.render('settings');
});

// =========================================================================
// Create Group - GET ============================================================
// =========================================================================
router.get('/groups/create', AuthMiddleware.authenticateApi(), function(req, res) {
    res.render('groups/modals/create');
});

// =========================================================================
// Update Group - GET ============================================================
// =========================================================================
router.get('/groups/update', AuthMiddleware.authenticateApi(), function(req, res) {
    res.render('groups/modals/update');
});

// =========================================================================
// Delete Group - GET ============================================================
// =========================================================================
router.get('/groups/delete', AuthMiddleware.authenticateApi(), function(req, res) {
    res.render('groups/modals/delete');
});

// =========================================================================
// Main Employee Page (default)  - GET ============================================================
// =========================================================================
router.get('/', /*AuthMiddleware.authenticateApi(),*/ function(req, res) {
    res.render('index');
});

module.exports = router;
