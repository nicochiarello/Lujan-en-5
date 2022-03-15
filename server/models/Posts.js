const mongoose = require('mongoose')

const date =
  new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()

const PostsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
    },
    photo: {
        type: String,
        required: false,
    },
    creator: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    category: {
        type: String,
        required: true 
    },
    copete: {
        type: String,
        required: false,
        default: ""
    },
    clicks: {
        type: Number,
        default: 0
    },
    ratesNumber: {
        type: Number,
        default: 1
    },
    ratesPromedy: {
        type: Number,
        default: 10
    },
    ratesAcumulator: {
        type: Number,
        default: 10
    },
    copete: {
        type: String,
        required: false
    },
    main: {
        type: Boolean,
        default: false
    },

})

module.exports = mongoose.model('Posts', PostsSchema)