const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
});
const FileModel=mongoose.model('File',fileSchema);
module.exports={FileModel} 

    