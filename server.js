const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");

const port = process.env.PORT || 5000;

if (!process.env.DB_URL) {
  console.error("Missing DB_URL in .env (see .env.example)");
  process.exit(1);
}

mongoose
  .connect(`mongodb+srv://${process.env.DB_URL}/myBankDatabase?retryWrites=true&w=majority`)
  .then(() => {
    console.log("connected to db");
    app.listen(port, () => console.log(`Server started on port ${port}`));
  })
  .catch((err) => {
    console.error("could not connect to db:", err.message);
    process.exit(1);
  });
