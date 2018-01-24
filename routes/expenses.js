//Expenses router

var express = require('express');
var expensesController = require('../controllers/expenses/expenses.controller');
var router = express.Router();

//expnses list
router.get('/',expensesController.getExpensesList)
    //add new expense
    .post('/',expensesController.addExpenses)
    //get an expense by id
    .get('/:id',expensesController.getExpensesDetails)
    //updating an expense
    .put('/update/:id',expensesController.updateExpense)
    //delete an expense
    .delete('/remove/:id',expensesController.deleteExpense);

module.exports = router;