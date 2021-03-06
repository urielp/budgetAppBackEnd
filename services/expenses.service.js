var Expense =require ('../models/expenses.model');
var mongoose = require('mongoose');
_this = this;


//getting expenses list
exports.getExpensesList = async function getExpensesList(query,page,limit){

    //mongoos paginate settings

    var options = {
        page,
        limit
    }

    try{
       console.log(query);
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
        
        return expensesByDate;
    }

    catch(exception) {
        throw new Error('Error while trying to get expenses by month '+ exception.message);
    }
}

exports.getTotalAmountOfExpensesPerMonth = async function(month,year) {
    try {
        //
        // let options = {
        //     page,
        //     limit
        // };


       if(month === 0)
        {
            let totalExpensesPerMonth = await Expense.aggregate(
                [
                    {
                        $group:
                            {
                                _id: { month: { $month: "$date"}, year: { $year: "$date" } },
                                totalAmount: { $sum: "$amount" },
                                count: { $sum: 1 }
                            },
                    }
                ],(err,results) =>{
                    if(err){
                        return err;
                    }
                    return results;
                }
            );
            console.log('pass query')
            return totalExpensesPerMonth;
        }
        else {

        let totalExpensesPerMonth = await Expense.aggregate(
            [

                {
                    $group:
                        {
                            _id: { month: { $month: "$date"}, year: { $year: "$date" } },
                            totalAmount: { $sum: "$amount" },
                            count: { $sum: 1 }

                        },

                },
                {$match: {$and:[{"_id.year":year},{"_id.month":month}]}}
            ],(err,results) =>{
                if(err){
                  
                    console.log(err);
                    return err;
                }
                console.log(results);
                return results;
            }
        );
            return totalExpensesPerMonth;
        }


    }
    catch (exception) {
        throw new Error('Error while trying to get total expenses amount  by month '+ exception.message);
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

// removing an expense by id
exports.deleteExpense = async function deleteExpense(id){

    // try{
    //     let deletedExpense = await Expense.findByIdAndRemove(id,function (err,expense) {
    //         if(err){
    //             console.log(err);
    //         }
    //         else
    //             console.log('Yay');
    //             console.log(expense);
    //     });
    //     if(deletedExpense.n===0 ){
    //         throw new Error("Expense could not be deleted" );
    //     }
    //     return deletedExpense;
    // }
    // catch(exception){
    //     throw new Error("error while trying to delete expense from db" + exception.message);
    // }

    try {
       let temp =  await Expense.remove({ _id:new mongoose.mongo.ObjectID(id) }, function (err) {
            if (err) return err;
            // removed!
        });
       return temp;
    }
    catch(exception){
        throw new Error("Error while trying to find expense in db due to : "+exception.message);
    }
};