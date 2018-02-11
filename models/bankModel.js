var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var BankSchema =new mongoose.Schema({
    bankName:String,
    balance:Number,
    description:String,
    code:String
});

BankSchema.plugin(mongoosePaginate);
const Bank = mongoose.model('Banks',BankSchema);

module.exports = Bank;