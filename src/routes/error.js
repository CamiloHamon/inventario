const express = require('express')
const router = express.Router()

router.get('*', (req, res, next) => {
    res.status(404).render('error/error')
})

module.exports = router