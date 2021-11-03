const name = () => {
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let stringRamdom = '';
    for (let i = 0; i < 8; i++) {
        stringRamdom += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return stringRamdom;
}

module.exports = name;