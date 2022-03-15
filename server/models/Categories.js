const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    categories: {
        type: Object,
        
    }
    
})

module.exports = mongoose.model("Categories", CategorySchema);