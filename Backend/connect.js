const mongoose = require("mongoose");

async function connectTODB(url) {
  return mongoose.connect(url);
}

module.exports = connectTODB ;
