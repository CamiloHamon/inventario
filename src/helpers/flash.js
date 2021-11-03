const flashM = {};

flashM.messages = (flash) => {
    let msg = '';

    if (Object.keys(flash).length > 0) {
        msg = {
            type: Object.keys(flash)[0],
            message: Object.values(flash)[0]
        };
    }

    return msg;
}

module.exports = flashM;