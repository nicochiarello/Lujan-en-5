const mongoose = require('mongoose')

const PhraseSchema = new mongoose.Schema({
    phrase: {
        type: String
    }
})


module.exports = mongoose.model('DayPhrase', PhraseSchema)