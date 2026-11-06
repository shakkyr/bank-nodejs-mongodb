const express = require('express');
const bankController = require('../bankController/bank.controller');

const router = express.Router();

// Mounted at /api/bank in server.js, so paths here are relative to that.
// Specific paths ("/trans", "/account/:n") must stay separate: two "/:param"
// routes in a row would make the second one unreachable.
router.get('/', bankController.getAllCostumers);
router.get('/trans', bankController.allTransictions);
router.get('/account/:accountNumber', bankController.getOneUserData);
router.post('/', bankController.addCostumers);
router.put('/', bankController.trackTransiction);

module.exports = router;
