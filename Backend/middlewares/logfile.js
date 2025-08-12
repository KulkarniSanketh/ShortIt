const fs = require("fs");

async function handleLogFile(req, res, next) {
  try {
    fs.appendFile(
      "./logfile.log",
      `${req.ip} : ${req.method} : ${req.url} : ${
        res.statusCode
      } : ${Date.now()}\n`,
      (Err) => {
        if(Err) console.log('err:',Err.message)
          next();
    }
    );
  } catch (err) {
    console.log("err:", err.message);
  }
}

module.exports = {handleLogFile}
