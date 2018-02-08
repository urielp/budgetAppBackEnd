var expensesService = require('../../services/expenses.service');


_this=this;

//getting the expenses list from exepensesService
exports.getExpensesList = async function getExpensesList(req,res,next){

    //setting the pagnitation of expenses list
    var page = req.query.page ? req.query.page:1;
    var limit = req.query.limit ? req.query.limit:10;

    try {
        var expenses = await expensesService.getExpensesList({},page,limit);
        return res.status(200).json({success:true,data:expenses,message:'Successfully received expenses list'});
    }
    catch(exception){
        return res.status(400).json({success:false,data:{},message:exception.message});
    }
};

//get Expenses by specific month
exports.getExpensesByMonth = async function getExpensesByMonth(req,res,next) {
    try {

        var month = req.params.month;
        let expensesByMonth = await expensesService.getExpensesByMonth(month);

        return res.status(200).json({success:true,data:expensesByMonth,message:'Successfully received expenses list by month'});
    }

    catch(excption) {
        return res.status(400).json({success:false,data:{},message:excption.message});
    }
}


exports.getTotalExpensesAmountPerMonth = async function getTotalExpensesAmountPerMonth(req,res,next) {
    try{

        let totalExpensesAmountByMonth = await expensesService.getTotalAmountOfExpensesPerMonth();
        return res.status(200).json({success:true,data:totalExpensesAmountByMonth,message:'Successfully received total expenses per month list'})
    }

    catch(exception) {
        return res.status(400).json({success:false,data:{},message:exception.message});
    }
}
//adding new expense
exports.addExpenses = async function addExpenses(req,res,next){

/*    let newExpense = {
        name:req.body.name,
        title:req.body.title,
        amount:req.body.amount,
        description:req.body.description,
        date:new Date(),
        status:'N/A'
    };*/
let newExpense =req.body;

    try {
        let createdExpense = await expensesService.addExpenses(newExpense);
        return res.status(200).json({success:true,data:createdExpense,message:'Expense created successfully '})
    }
    catch(exception){
        return res.status(400).json({status:400,data:{},message:exception.message})
    }
};

//get expense details by id
exports.getExpensesDetails = async function getExpensesDetails(req,res,next){


    if(!req.params.id){
        return res.status(400).json({success:false,data:{},message:'must send id!'})
    }
    var id = req.params.id;
    try{
        var requestedExpense = await expensesService.getExpensesDetails(id);
        return res.status(200).json({success:true,data:requestedExpense,message:'expense found'});
    }
    catch (exception){
        return res.status(400).json({success:false,data:{},message:'error' + exception.message});
    }
};

//updating an exists expense
exports.updateExpense = async function updateExpense(req,res,next){

    if(!req.params.id){
        return res.status(400).json({status:400,message:'Id must be presented'});
    }

    let id = req.params.id;

    let expense ={
        id,
        name:req.body.name?req.body.name:null,
        title:req.body.title?req.body.title:null,
        amount:req.body.amount?req.body.amount:null,
        description:req.body.description?req.body.description:null,
        status:req.body.status?req.body.status:null
    }

    try{
        let updatedExpense = await expensesService.updateExpense(expense);
        return res.status(200).json({success:true,data:updatedExpense,message:"expense updated"});
    }
    catch(exception){
        return res.status(400).json({success:false,data:updatedExpense,message:"somthing went wrong, "+exception.message})

    }

};

//deleting an expense
exports.deleteExpense = async function deleteExpense(req,res,next){


    try{
        let id = req.params.id;
        let deletedExpense = await expensesService.deleteExpense(id);
        return res.status(200).json({success:true,data:deletedExpense,message:"expense was deleted"});
    }
    catch(exception){
        return res.status(400).json({success:false,data:{},message:'expense was not deleted due to : ' + exception.message});
    }
};