var expensesService = require('../../services/expenses.service');


_this=this;
function getLastDayOfMonth(requestedMonth){
    const month = requestedMonth; // January
    const d = new Date(2018, month, 0);

    return d.getDate();
}

function getFirstDayOfMonth(requestedMonth)
{
    var date = new Date();
    return new Date(date.getFullYear(),requestedMonth+1,2);
}

//getting the expenses list from exepensesService
exports.getExpensesList = async function getExpensesList(req,res,next){

    let d = new Date();
    var query ="";
    var query2="";
        //setting the pagnitation of expenses list
        let page = req.query.page ? req.query.page : 1;
        let limit = req.query.limit ? req.query.limit : 10;
        if(req.params.month != undefined) {

            if (req.params.month != d.getMonth() + 1) {
                let fromDay = +req.query.fromDay ? +req.query.fromDay : 1;
                let fromMonth = +req.params.month;
                let fromYear = +req.query.fromYear ? +req.query.fromYear : +d.getFullYear();

                // until the current day,month,year
                let toDay = +getLastDayOfMonth(req.params.month);
                let toMonth = +req.params.month;
                let toYear = +req.query.toYear ? +req.query.toYear : +d.getFullYear();
                query2 = {
                    "date":
                        {
                            "$gte": new Date(d.getFullYear(),fromMonth-1,2),
                            "$lt":  new Date(2018, fromMonth, 1)//new Date(fromYear+"-"+fromMonth+"-"+getLastDayOfMonth(fromMonth))
                        }
                };
                console.log(query2);
                    query = {
                    "date": {
                        $gte:new Date(d.getFullYear(),fromMonth-1,2) //new Date(fromYear+"-"+(+fromMonth)+"-01")
                    }
                    ,
                    $and: [
                        {
                            "date": {
                                $lte: new Date(fromYear+"-"+fromMonth+"-"+getLastDayOfMonth(fromMonth))
                            }
                        }
                    ]
                };
            }
            else {
                //Date:
                //Default:from start of current month ,year , day
                let fromYear = +req.query.fromYear ? +req.query.fromYear : +d.getFullYear();
                let fromMonth = +req.query.fromMonth ? +req.query.fromMonth : +d.getMonth() + 1;
                let fromDay = +req.query.fromDay ? +req.query.fromDay : 1;

                // until the current day,month,year
                let toDay = +req.query.toDay ? +req.query.toDay : +d.getDate();
                let toYear = +req.query.toYear ? +req.query.toYear : +d.getFullYear();
                let toMonth = +req.query.toMonth ? +req.query.toMonth : +d.getMonth() + 1;

                query2 = {
                    "date":
                        {
                            "$gte": new Date(d.getFullYear(),fromMonth-1,2),
                            "$lt":  new Date()//new Date(fromYear+"-"+fromMonth+"-"+getLastDayOfMonth(fromMonth))
                        }
                };

                query =
                    {
                        "date": {
                            "$gte": new Date(fromYear + "-" + fromMonth + "-" + fromDay+"T00:00:00Z")
                        }
                        ,
                        $and: [
                            {
                                "date": {
                                    "$lte": new Date(toYear + "-" + toMonth + "-" +getLastDayOfMonth(fromMonth)+"T00:00:00Z")
                                }
                            }
                        ]
                    }



            }
        }

        else if(req.body.from  && req.body.to)
        {
            console.log('body ')
        }

    try {
        let expenses = await expensesService.getExpensesList(query2,page,limit);

        return res.status(200).json({success:true,data:expenses,message:'Successfully received expenses list'});
    }
    catch(exception){
        return res.status(400).json({success:false,data:{},message:exception.message});
    }
};


function formatDate(date)
{
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();

    if (dd < 10) {
        dd = +`0${dd}`;
    }
    if (mm < 10) {
        mm = +`0${mm}`;
    }

    return dd + '/' + mm + '/' + yyyy;
}

//get Expenses by specific month
exports.getExpensesByMonth = async function getExpensesByMonth(req,res,next) {
    try {

        let month = req.params.month;

        let expensesByMonth = await expensesService.getExpensesByMonth(month);
        if (expensesByMonth.length > 0 ) {
            return res.status(200).json({
                success: true,
                data: expensesByMonth,
                message: 'Successfully received expenses list by month'
            });
        }
       return  res.status(200).json({success:true,data:{},message:'No results was found for the given month'});
    }

    catch(excption) {
        return res.status(400).json({success:false,data:{},message:excption.message});
    }
}


exports.getTotalExpensesAmountPerMonth = async function getTotalExpensesAmountPerMonth(req,res,next) {
    try{

        let month = req.params.month;
        let year = req.query.year;
        let totalExpensesAmountByMonth = await expensesService.getTotalAmountOfExpensesPerMonth(+month,+year);
        if(totalExpensesAmountByMonth.length > 0)
            return res.status(200).json({success:true,data:totalExpensesAmountByMonth,message:'Successfully received total expenses per month list'})
        else
           return res.status(200).json({success:false,data:{},message:'No Results found'})
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