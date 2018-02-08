//bank router

var express = require('express');
var banksController = require('../controllers/banks/banks.controller');
var router = express.Router();

router.get('/',banksController.getBankAccountsList)
    .post('/',banksController.addBankAccount);


module.exports = router;