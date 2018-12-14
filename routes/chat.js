const express = require('express')
const {
    body
} = require('express-validator/check')

const Chat = require('../models/chat')
const chatController = require('../controllers/chat')
const is_auth = require('../middleware/is_auth')

const router = express.Router()

router.put('/insert', is_auth, [
    body('chatId').custom((value, {
        req
    }) => {
        return Chat.findOne({
            _id: value
        }).then(chatDoc => {
            if (!chatDoc) {
                Promise.reject('invalid chat id')
            }
        })
    }),
    body('message').trim().not().isEmpty(),
], chatController.insert)

router.get('/:id', is_auth, chatController.read)

module.exports = router