var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var ExpenseSchema =new mongoose.Schema({
    title:String,
    amount:Number,
    description:String,
    date:Date,
    status:String
});

ExpenseSchema.plugin(mongoosePaginate);
const Expense = mongoose.model('Expense',ExpenseSchema);

module.exports = Expense;