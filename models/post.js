const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    Origin: {
        type: String,
        required: true
    },
    Time: {
        type: String,
        required: true
    },
    Destination: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    chatId: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: false
    }
})

module.exports = mongoose.model('Post', postSchema)