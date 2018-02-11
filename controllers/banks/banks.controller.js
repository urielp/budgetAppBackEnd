var banksService = require('../../services/banksService');


_this=this;

//getting the expenses list from exepensesService
exports.getBankAccountsList = async function getBankAccountsList(req,res,next){
    try{
        //setting the pagnitation of bank accounts  list
        var page = req.query.page ? req.query.page:1;
        var limit = req.query.limit ? req.query.limit:10;

        let bankAccounts = await banksService.getBankAccountList({},page,limit);
        return res.status(200).json({success:true,data:bankAccounts,message:'Successfully received bank accounts list'});
    }
    catch (exception) {
        return res.status(400).json({success:false,data:{},message:exception.message});
    }
};
exports.addBankAccount = async function getBankAccountsList(req,res,next){

    let newBankAccount = {
        bankName:req.body.name,
        balance:req.body.balance,
        description:req.body.description,
        code:req.body.code

    };

    try {
        let addedAcount = await banksService.addBankAccount(newBankAccount);
        return res.status(200).json({success:true,data:addedAcount,message:'bank added successfully '})
    }
    catch(exception){
        return res.status(400).json({status:400,data:{},message:exception.message})
    }
};