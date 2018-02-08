var Bank = require ('../models/bankModel');

_this = this;

//getting banks account list
exports.getBankAccountList = async function getBankAccountListList(query,page,limit){


    var options = {
        page,
        limit
    }

    try{
        let bankAccounts = await Bank.paginate(query,options);
        return bankAccounts;
    }

    catch(exception){
        throw new Error('Error while trying to get bank accounts list '+ exception.message);
    }
};

exports.addBankAccount = async function addBankAccount(bank){

    let newBankAccount = new Bank({
        bankName:bank.bankName,
        balance:bank.balance,
        description:bank.description,

    });
    try{

        let addedAcount = await newBankAccount.save();
        return addedAcount;
    }

    catch(exception){
        throw new Error('Error while trying to save to db : ' + exception.message);
    }
};