var Expense =require ('../models/expenses.model');

_this = this;

//getting expenses list
exports.getExpensesList = async function getExpensesList(query,page,limit){

    //mongos paginate settings

    var options = {
        page,
        limit
    }

    try{
        let expenses = await Expense.paginate(query,options);
        return expenses;
    }

    catch(exception){
        throw new Error('Error while trying to get expenses '+ exception.message);
    }
};

//get expenses by month
exports.getExpensesByMonth = async function getExpensesByMonth(month) {

    try {
        let expensesByDate = await Expense.aggregate([
            {
                $project:
                    {
                        doc: "$$ROOT",
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        day: { $dayOfMonth: "$date" }
                    }
            },
            {$match : { "month" : +month, "year": 2018 } }],(err,results) =>{
                if(err){
                    console.log(err);
                    return;
                }

               return results;
            }
        );
        console.log(expensesByDate);
        return expensesByDate;
    }

    catch(exception) {
        throw new Error('Error while trying to get expenses by month '+ exception.message);
    }
}

//adding new expense
exports.addExpenses = async function addExpenses(expense){

    let newExpense = new Expense({
        name:expense.name,
        title:expense.title,
        amount:expense.amount,
        description:expense.description,
        date:expense.date,
        status:expense.status
    })
    try{

        let savedExpense = await newExpense.save();
        return savedExpense;
    }

    catch(exception){
        throw new Error('Error while trying to save to db : ' + exception.message);
    }
};

//getting expense by id
exports.getExpensesDetails = async function getExpensesDetails(id){

    try{
        var expense = await Expense.findById(id);
        return expense;
    }
    catch(exception){
        return Error('error while trying to find expense')
    }
};

//updating an expense
exports.updateExpense = async function updateExpense(expense){

    let id = expense.id;

    try {
        var oldExpense = await Expense.findById(id);
    }
    catch(exception){
        throw new Error("Error while trying to find expense in db due to : "+exception.message);
    }

    if(!oldExpense)
    {
        return false;
    }
    oldExpense.name=expense.name;
    oldExpense.title=expense.title;
    oldExpense.description=expense.description;
    oldExpense.amount=expense.amount;
    oldExpense.status=expense.status;

    try {
        let savedExpense = await oldExpense.save();
        return savedExpense;
    }
    catch (exception){
        throw new Error("Error : " + exception.message);
    }


};


exports.deleteExpense = async function deleteExpense(id){

    try{
        let deletedExpense = await Expense.remove({_id:id});
        if(deletedExpense.n===0 ){
            throw new Error("Expense could not be deleted" );
        }
        return deletedExpense;
    }
    catch(exception){
        throw new Error("error while trying to delete expense from db" + exception.message);
    }
};