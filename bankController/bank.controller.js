const BankModel = require('../model/bank.model').BankModel;
const Transictions = require('../model/bank.model').Transictions;


//! ===================== get all costumers List =================
const getAllCostumers = (req,res) => {
    BankModel.find({} , (err,data) =>{
        if(err){
           return res.status(404).json('not a valid data')

        }
        return res.status(200).json(data);
    })
}

//! ===================== get all transes list =================
const allTransictions = (req, res) => {
    Transiction.Transictions.find({} , (err,data) =>{
        if(err){
            res.status(404).json('not a valid data')
            return console.log(err);
        }
        return res.status(200).json(data);
    })
}


//! ======================= get individual user data ================
const getOneUserData = (req, res) => {
    const {accountNumber} = req.params;
    console.log(accountNumber);
    BankModel.find(accountNumber, (err,data)=> {
        if (err){
            res.status(404).json('user isnt exist')
            console.log('shadi');
        }
        console.log(data);
        return res.status(200).json(data)
    })
}


//! ===================== add costumer to the data base ==========
const addCostumers = (req,res) => {
    const {costumerName,email,firstDeposit,accountNumber,id} = req.body
    console.log(req.body);
    console.log('sssss');

    // if(!(costumerName && email && firstDeposit >= 0 && accountBalance >= -1000 && accountNumber.length ===6   && joinedIn)){
    //     return res.status(400).send('missing data or invalid values ')
    //   }
      // ========================= time ====================
      let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let dateTime = date+' '+time;
//  ============================================================       
      const bank =new BankModel({
        costumerName : costumerName,
        email : email,
        firstDeposit : firstDeposit,
        accountNumber : accountNumber,
        joinedIn : dateTime,
        id: id
      })

    bank.save((err,data)=>{
        if (err){
            res.status(404).json('not a valid data')
            return console.log(err);
        }
        res.status(200).json('data entered sucssesfully')
    console.log(data);
    })

}

//! ========================= transfers between users =================
const trackTransiction = (req,res) => {

    // ========================= time ====================
                let today = new Date();
                let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                let dateTime = date+' '+time;
        //  ============================================================       
                const {deposit,withdraw,transfer,accountNumber,toWho,fromWho} = req.body;
                console.log(req.body);
                let user = BankModel.find(accountNumber, (err,data)=> {
                    if (err){
                        res.status(404).json('user isnt exist')
                        console.log('shadi');
                    }
                   
                    return res.status(200).json(data)
                })
                console.log(user);
                
    
                let user2 = buffer.find(usr=>{
                    return usr.accountNumber == req.body.toWho
                })
    
                if(!user) {
                    return res.status(400).json({error: 'user is not exist'})
                }
                let cridet = -1000;
                let inMoney = (deposit === '' ? 0 : parseFloat(deposit))
                let outMoney = (withdraw === '' ? 0 : parseFloat(withdraw))
                let transferMoney = (transfer === '' ? 0 : parseFloat(transfer))
                if(outMoney > user.firstDeposit + inMoney && transferMoney > (user.firstDeposit + inMoney + cridet )  ){
                    return res.status(400).json({error: 'no enough money'})
                }
                user.firstDeposit = user.firstDeposit + inMoney - outMoney - transferMoney
                
                if(transferMoney != 0) {
                    user2.firstDeposit =  user2.firstDeposit + transferMoney
                }
    
          
            const trans =new Transictions({
                fromWho:  parseFloat(req.body.fromWho),
                transfer:  parseFloat(req.body.transfer),
                toWho:  parseFloat(req.body.toWho),
                transictionTime : dateTime
              })
        
              trans.save((err,data)=>{
                if (err){
                    res.status(404).json('not a valid data')
                    return console.log(err);
                }
                res.status(200).json('data entered sucssesfully')
            console.log(data);
            })
        
}



module.exports = {
    getAllCostumers,
    addCostumers,
    allTransictions,
    getOneUserData,
    trackTransiction

}