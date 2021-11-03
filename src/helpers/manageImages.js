const path = require('path');
const name = require('./randomName');
const fs = require('fs-extra');
const jimp = require('jimp')

const mgImages = {};

const cutImg = async(imageTempPath, targetPath) => {
    jimp.read(imageTempPath)
        .then(lenna => {
            let w = lenna.bitmap.width,
                h = lenna.bitmap.height,
                x = 0;
            if (h > w) {
                h = w;
            } else {
                x = Math.floor((w - h) / 2);
                w = h;
            }
            return lenna
                .crop(x, 0, w, h)
                .resize(500, 500)
                .quality(100)
                .write(targetPath);
        })
        .catch(error => {
            console.log(error)
        })
}

mgImages.move = async(img) => {
    const imageTempPath = img.path;
    const ext = path.extname(img.originalname).toLowerCase();
    const nameImg = name();
    const targetPath = path.join(__dirname, `../public/img/imgProfile/${nameImg}${ext}`);
    await cutImg(imageTempPath, targetPath);
    await fs.unlink(imageTempPath);
    return `${nameImg}${ext}`;
}

mgImages.delete = async(img) => {
    let result = false;

    try {
        const imgPath = path.resolve(__dirname, `../public/img/imgProfile/${img}`);
        await fs.unlink(imgPath);
        result = true;
    } catch (error) {
        console.log(error);
    }

    return result;
}

module.exports = mgImages;