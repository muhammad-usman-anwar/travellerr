const express = require('express')
const {
    body
} = require('express-validator/check')

const Post = require('../models/chat')
const postController = require('../controllers/post')
const is_auth = require('../middleware/is_auth')

const router = express.Router()

router.get('/', is_auth, postController.read)

router.patch('/post', is_auth, [
    body('postId').custom((value, {
        req
    }) => {
        return Post.findOne({
            _id: value
        }).then(postDoc => {
            if (!carDoc) {
                Promise.reject('invalid post id')
            }
        })
    }),
], postController.edit)

router.put('/post/new', is_auth, [
    body('origin').trim().not().isEmpty(),
    body('time').trim().not().isEmpty(),
    body('destination').trim().not().isEmpty()
], postController.add)

module.exports = router