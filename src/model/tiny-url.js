const { mongoose } = require('../db/mongoose');

const TinyUrl = mongoose.model('TinyUrl', {
    hashCode: String,
    url: String,
    createdTime: Number
});

module.exports = { TinyUrl };
