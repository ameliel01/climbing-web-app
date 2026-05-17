const router = require('express').Router()
// This middleware adds the json header to every response for the api
router.use('/', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})
router.use(require('./route.js'))
router.use(require('./friendship.js'))
router.use(require('./user.js'))
router.use(require('./comment.js'))
router.use(require('./room.js'));
router.use(require('./roomuser.js'));
router.use(require('./message.js'));
router.use(require('./like.js'))
router.use('/user/:user_id', require('./post.js'));

module.exports = router

