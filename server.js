const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const port = 5000;
const cors = require("cors");

bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(cors());

app.use("/api/bank", require("./routes/bank.route"));

app.get("/api/getUser", (req, res) =>
  res.send({ username: os.userInfo().username })
);

if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  app.use(express.static("client/build"));
  // Express serve up index.html file if it doesn't recognize route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

mongoose.connect(
  `mongodb+srv://${process.env.DB_URL}/myBankDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true },
  () => {
    console.log("connected to db");
  }
);

app.listen(process.env.PORT || port, () => {
  console.log(`Server started on port ${port}`);
});

// mongodb+srv://shadi:<password>@cluster0.ksjui.mongodb.net/myBankDatabase?retryWrites=true&w=majority
