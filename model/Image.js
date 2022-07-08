const mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
    id: 
    {
        type: String,
        equired: true
    },
    img:
    {
        data: Buffer,
        contentType: String
    }
});
  
module.exports = new mongoose.model('Image', imageSchema);