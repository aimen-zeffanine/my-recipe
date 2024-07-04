const fs = require('fs');
const path = require('path');

exports.write = (base64String, fileName) => {
    var buffer = new Buffer(base64String, 'base64');
    fs.writeFile(`${__dirname}/images/${fileName}.jpg`, buffer, (error) => {
        console.log(error);
    });
    return `/images/${fileName}.jpg`;
}