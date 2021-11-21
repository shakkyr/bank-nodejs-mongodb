const express = require('express');
const bankController = require('../bankController/bank.controller')
const router = express.Router();



router.get('/', (req,res)=>{
    bankController.getAllCostumers(req,res)
}).get('/:trans', (req,res)=>{
    bankController.allTransictions(req,res)
}).get('/:account', (req,res)=>{
    bankController.getOneUserData(req,res)
}).post('/api/bank', (req,res)=>{
    bankController.addCostumers(req,res)
}).put('/api/bank', (req,res)=>{
    bankController.trackTransiction(req,res)
});



module.exports = router;