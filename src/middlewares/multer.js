const path = require('path')
const multer = require('multer')

// settings multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/img/temp'),
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = (multer({
    storage,
    dest: path.join(__dirname, '../public/img/temp')
}).single('img'))

module.exports = upload