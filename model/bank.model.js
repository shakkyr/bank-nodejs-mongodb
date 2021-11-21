const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    costumerName : {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    firstDeposit:{
        type: Number,
        required:true,
    },
    accountNumber: {
        type:Number,
        required:true,
        minlength:6,
        maxlength:6,
    },
    joinedIn:{
        type: String,
        required:true,
    },
    id: {
        type : String,
        required:true
    }
});

const transictionsSchema = new mongoose.Schema({
    fromWho : {
        type: Number
    },
    transfer : {
        type : Number
    },
    toWho : {
        type: Number
    },
    transictionTime : {
        type : Number,
    }

})

const BankModel = mongoose.model('Bank', bankSchema);
const Transictions = mongoose.model('Transictions',transictionsSchema )

module.exports = {
    BankModel,
    Transictions
}