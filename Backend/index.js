const express = require('express')
const connectTODB = require("./connect");
const router = require("./routes/Routes");
const URL = require("./models/url")
const { handleLogFile } = require('./middlewares/logfile');
const cors = require("cors");
require('dotenv').config()

const app = express();
const PORT = 8000;
app.use(cors());
app.use(handleLogFile)

app.set("view engine","ejs")

connectTODB(process.env.MONGO_URL)
  .then((result) => {
    console.log("Mongodb connected sucessfully");
  })
  .catch((err) => {
    console.log("error", err);
  });

app.use(express.json());

app.use("/", router);





app.listen(PORT, () => console.log("app started at port 8000"));
