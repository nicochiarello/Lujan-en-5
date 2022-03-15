const mongoose = require('mongoose')


const SchemaNabvar = new mongoose.Schema({
  categories: {
    type: Object,
  },
});

module.exports = mongoose.model("NavbarCategoriese", SchemaNabvar)