const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()
const port = 5000;
const cors = require('cors');

bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(cors())



app.use('/api/bank', require('./routes/bank.route'));

mongoose.connect(
    `mongodb+srv://${process.env.DB_URL}/myBankDatabase?retryWrites=true&w=majority`,
    { useNewUrlParser: true },
    () => {
      console.log("connected to db");
    }
  );


app.listen(process.env.PORT || port , () =>{
    console.log(`Server started on port ${port}`)
});


// mongodb+srv://shadi:<password>@cluster0.ksjui.mongodb.net/myBankDatabase?retryWrites=true&w=majority