const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
  user: {
    type: String,
    
  },
  password:{
      type: String,
      
  }
});

module.exports = mongoose.model("auth", AuthSchema);
