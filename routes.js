const router = require('express').Router()

router.get('/', function(req, res) {
    res.send('port as:' + process.env.PORT)
})

module.exports = router